import { useEffect, useRef, useState } from "react"
import levels from "../configurations/levels.json"
import characters from "../configurations/characters.json"

const tileSize = 50
const keys = {}

const ANIM_PATH = "/assets/characters/test-hero/Animations/"
const SPRITES = {
  idle: {
    src: ANIM_PATH + "hero-idle.png",
    frames: 1,
    frameWidth: 50,
    frameHeight: 50,
  },
  run: {
    src: ANIM_PATH + "test-run-32.png",
    frames: 3,
    frameWidth: 50,
    frameHeight: 50,
  },
  jump: {
    src: ANIM_PATH + "test-run-32.png",
    frames: 1,
    frameWidth: 50,
    frameHeight: 50,
  },
  shoot: {
    src: ANIM_PATH + "shooting-hero-50.png",
    frames: 2,
    frameWidth: 50,
    frameHeight: 50,
  },
}

// --- ENEMY SPRITES ---
const ENEMY_ANIM_PATH = "/assets/characters/test-hero/Animations/"
const ENEMY_SPRITES = {
  run: {
    src: ENEMY_ANIM_PATH + "grunt.png", // update path as needed
    frames: 2,
    frameWidth: 50,
    frameHeight: 50,
  },
  idle: {
    src: ENEMY_ANIM_PATH + "grunt.png", // update path as needed
    frames: 1,
    frameWidth: 50,
    frameHeight: 50,
  },
}

export default function GameCanvas() {
  const canvasRef = useRef()
  const wallImage = useRef(new Image())
  const backgroundImage = useRef(new Image())

  // --- Music state ---
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef(null)

  // Animation images
  const spriteImages = useRef({
    idle: new window.Image(),
    run: new window.Image(),
    jump: new window.Image(),
    shoot: new window.Image(),
  })
  // Enemy animation images
  const enemySpriteImages = useRef({
    run: new window.Image(),
    idle: new window.Image(),
  })

  // Animation state
  const playerAnim = useRef({
    state: "idle",
    frame: 0,
    tick: 0,
    speed: 8,
  })

  const [currentLevelIndex] = useState(0)
  const levelKeys = Object.keys(levels.world1).filter((key) =>
    key.startsWith("level")
  )
  const currentLevelKey = levelKeys[currentLevelIndex]
  const level = levels.world1[currentLevelKey]

  const [playerHealth, setPlayerHealth] = useState(3)
  const [collectedCount, setCollectedCount] = useState(0)
  const [totalCollectibles, setTotalCollectibles] = useState(5)

  const gameOver = useRef(false)
  const gameWon = useRef(false)

  const damageCooldown = useRef(0)
  const projectiles = useRef([])
  const collectibles = useRef([])

  // For shooting animation
  const shooting = useRef(false)
  const shootingTimer = useRef(0)
  const SHOOT_ANIM_DURATION = 10

  // Multiple enemies
  const enemies = useRef([])

  // --- Music effect ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
      audioRef.current.volume = volume
    }
  }, [isMuted, volume])

  useEffect(() => {
    const resumeAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
    }
    window.addEventListener("click", resumeAudio, { once: true })
    return () => window.removeEventListener("click", resumeAudio)
  }, [])

  useEffect(() => {
    // Load all sprite images
    for (const key in SPRITES) {
      spriteImages.current[key].src = SPRITES[key].src
    }
    // Load enemy sprite images
    for (const key in ENEMY_SPRITES) {
      enemySpriteImages.current[key].src = ENEMY_SPRITES[key].src
    }

    // Load wall and background images
    wallImage.current.src = levels.world1.ground
    backgroundImage.current.src = levels.world1.background

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const cols = level[0].length
    const rows = level.length

    canvas.width = cols * tileSize
    canvas.height = rows * tileSize

    const p = { ...characters.player, facing: 1 }

    // --- Multiple Enemies ---
    const ENEMY_COUNT = 2
    function spawnEnemy() {
      const enemyData = characters["enemy-grunt-1"]
      let x, y
      do {
        const col = Math.floor(Math.random() * cols)
        const row = Math.floor(Math.random() * rows)
        if (level[row][col] !== "#") {
          x = col * tileSize
          y = row * tileSize
          break
        }
      } while (true)
      const spawnSide = Math.random() < 0.5 ? "left" : "right"
      return {
        x,
        y,
        width: enemyData.width || 32,
        height: enemyData.height || 32,
        dx:
          spawnSide === "left"
            ? enemyData.speed || 1.5
            : -(enemyData.speed || 1.5),
        dy: 0,
        speed: enemyData.speed || 1.5,
        jumpForce: enemyData.jumpForce || -6,
        gravity: enemyData.gravity || 0.3,
        onGround: enemyData.onGround || false,
        jumpCooldown: enemyData.jumpCooldown || 0,
        alive: true,
        anim: {
          state: "run",
          frame: 0,
          tick: 0,
          speed: 10,
        },
        facing: 1,
      }
    }
    enemies.current = []
    for (let i = 0; i < ENEMY_COUNT; i++) {
      enemies.current.push(spawnEnemy())
    }

    function isSolid(x, y) {
      const col = Math.floor(x / tileSize)
      const row = Math.floor(y / tileSize)
      if (col < 0 || col >= cols || row < 0 || row >= rows) return true
      return level[row][col] === "#"
    }

    function moveX(entity) {
      entity.x += entity.dx

      const left = entity.x
      const right = entity.x + entity.width
      const top = entity.y + 0.01
      const bottom = entity.y + entity.height - 0.01

      if (entity.dx > 0 && (isSolid(right, top) || isSolid(right, bottom))) {
        entity.x = Math.floor(right / tileSize) * tileSize - entity.width
        entity.dx *= -1
      } else if (
        entity.dx < 0 &&
        (isSolid(left, top) || isSolid(left, bottom))
      ) {
        entity.x = Math.floor(left / tileSize + 1) * tileSize
        entity.dx *= -1
      }
    }

    function moveY(entity) {
      entity.y += entity.dy

      const left = entity.x + 0.01
      const right = entity.x + entity.width - 0.01
      const top = entity.y
      const bottom = entity.y + entity.height

      entity.onGround = false

      if (entity.dy > 0 && (isSolid(left, bottom) || isSolid(right, bottom))) {
        entity.y = Math.floor(bottom / tileSize) * tileSize - entity.height
        entity.dy = 0
        entity.onGround = true
      } else if (entity.dy < 0 && (isSolid(left, top) || isSolid(right, top))) {
        entity.y = Math.floor(top / tileSize + 1) * tileSize
        entity.dy = 0
      }
    }

    function enemyAI() {
      for (let e of enemies.current) {
        if (!e.alive) continue
        if (!e.dx || Math.abs(e.dx) < 0.1) {
          e.dx = Math.random() < 0.5 ? -e.speed : e.speed
        }
        if (e.jumpCooldown <= 0 && e.onGround) {
          if (Math.random() < 0.01) {
            e.dy = e.jumpForce
            e.jumpCooldown = 60
          }
        } else {
          e.jumpCooldown--
        }
        e.dy += e.gravity
        moveX(e)
        moveY(e)
      }
      // --- Enemy Animation Update ---
      for (let e of enemies.current) {
        if (!e.alive) continue
        e.facing = e.dx < 0 ? -1 : 1
        e.anim.state = "run"
        e.anim.tick++
        if (e.anim.tick >= e.anim.speed) {
          e.anim.frame = (e.anim.frame + 1) % ENEMY_SPRITES[e.anim.state].frames
          e.anim.tick = 0
        }
      }
    }

    function checkCollision(a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      )
    }

    function fireProjectile() {
      const bullet = {
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        width: 6,
        height: 6,
        dx: p.facing * 5,
      }
      projectiles.current.push(bullet)
      shooting.current = true
      shootingTimer.current = SHOOT_ANIM_DURATION
    }

    function updateProjectiles() {
      const newProjectiles = []
      for (let proj of projectiles.current) {
        proj.x += proj.dx
        if (proj.x < 0 || proj.x > canvas.width || isSolid(proj.x, proj.y)) {
          continue
        }
        let hit = false
        for (let e of enemies.current) {
          if (e.alive && checkCollision(proj, e)) {
            e.alive = false
            hit = true
            break
          }
        }
        if (!hit) newProjectiles.push(proj)
      }
      projectiles.current = newProjectiles
    }
    const collectibleImages = levels.world1["collectibles-1-images"]
    function spawnCollectibles(count = 5) {
      const items = []
      while (items.length < count) {
        const x = Math.floor(Math.random() * cols)
        const y = Math.floor(Math.random() * rows)
        const imgSrc =
          collectibleImages[
            Math.floor(Math.random() * collectibleImages.length)
          ]
        const img = new window.Image()
        img.src = imgSrc
        if (level[y][x] !== "#") {
          items.push({
            x: x * tileSize + 4,
            y: y * tileSize + 4,
            width: 16,
            height: 16,
            dy: 0,
            onGround: false,
            img,
            imgSrc,
          })
        }
      }
      collectibles.current = items
      setTotalCollectibles(count)
    }

    function checkCollectiblePickup() {
      const remaining = []
      for (const item of collectibles.current) {
        if (checkCollision(p, item)) {
          setCollectedCount((count) => {
            const newCount = count + 1
            if (newCount >= totalCollectibles) {
              gameWon.current = true
              setTimeout(() => {
                alert("🏆 You Win!")
              }, 100)
            }
            return newCount
          })
        } else {
          remaining.push(item)
        }
      }
      collectibles.current = remaining
    }

    function updatePlayerAnimState() {
      if (shooting.current) {
        playerAnim.current.state = "shoot"
        playerAnim.current.frame = 0
        return
      }
      if (!p.onGround) {
        playerAnim.current.state = "jump"
        playerAnim.current.frame = 0
        return
      }
      if (Math.abs(p.dx) > 0.1) {
        playerAnim.current.state = "run"
        return
      }
      playerAnim.current.state = "idle"
      playerAnim.current.frame = 0
    }

    function updatePlayerAnimFrame() {
      const state = playerAnim.current.state
      if (state === "run") {
        playerAnim.current.tick++
        if (playerAnim.current.tick >= playerAnim.current.speed) {
          playerAnim.current.frame =
            (playerAnim.current.frame + 1) % SPRITES.run.frames
          playerAnim.current.tick = 0
        }
      } else {
        playerAnim.current.frame = 0
        playerAnim.current.tick = 0
      }
    }

    function update() {
      if (gameOver.current || gameWon.current) return

      if (keys["ArrowLeft"]) {
        p.dx = -p.speed
        p.facing = -1
      } else if (keys["ArrowRight"]) {
        p.dx = p.speed
        p.facing = 1
      } else {
        p.dx *= p.friction
      }

      if ((keys["w"] || keys["ArrowUp"]) && p.onGround) {
        p.dy = p.jumpForce
        p.onGround = false
      }

      p.dy += p.gravity

      moveX(p)
      moveY(p)
      enemyAI()
      updateProjectiles()
      checkCollectiblePickup()

      // --- Collectible physics (gravity) ---
      const gravity = 0.5
      for (let item of collectibles.current) {
        if (!item.onGround) {
          item.dy += gravity
          item.y += item.dy

          // Check if landed on ground
          const left = item.x
          const right = item.x + item.width
          const bottom = item.y + item.height

          if (isSolid(left, bottom) || isSolid(right, bottom)) {
            // Snap to ground
            item.y = Math.floor(bottom / tileSize) * tileSize - item.height
            item.dy = 0
            item.onGround = true
          }
        }
      }

      // Animation state logic
      updatePlayerAnimState()
      updatePlayerAnimFrame()

      // Shooting animation timer
      if (shooting.current) {
        shootingTimer.current--
        if (shootingTimer.current <= 0) {
          shooting.current = false
        }
      }

      // Player collision with any enemy
      for (let e of enemies.current) {
        if (e.alive && checkCollision(p, e) && damageCooldown.current === 0) {
          setPlayerHealth((prevHealth) => {
            const newHealth = prevHealth - 1
            if (newHealth <= 0) {
              gameOver.current = true
              alert("💀 Game Over!")
            }
            return newHealth
          })
          damageCooldown.current = 60
        }
      }

      if (damageCooldown.current > 0) {
        damageCooldown.current--
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Draw background first
      ctx.drawImage(
        backgroundImage.current,
        0,
        0,
        cols * tileSize,
        rows * tileSize
      )

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const tile = level[y][x]
          const px = x * tileSize
          const py = y * tileSize

          if (tile === "#") {
            ctx.drawImage(wallImage.current, px, py, tileSize, tileSize)
            ctx.save()
            ctx.globalAlpha = 0.4
            ctx.fillStyle = "green"
            ctx.fillRect(px, py, tileSize, tileSize)
            ctx.restore()
          }
        }
      }

      // Player animation
      const state = playerAnim.current.state
      const frame = playerAnim.current.frame
      const img = spriteImages.current[state]
      const { frameWidth, frameHeight } = SPRITES[state]
      ctx.save()
      if (p.facing === -1) {
        ctx.translate(p.x + frameWidth, p.y)
        ctx.scale(-1, 1)
        ctx.drawImage(
          img,
          frame * frameWidth,
          0,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        )
      } else {
        ctx.drawImage(
          img,
          frame * frameWidth,
          0,
          frameWidth,
          frameHeight,
          p.x,
          p.y,
          frameWidth,
          frameHeight
        )
      }
      ctx.restore()

      // --- Enemy sprite animation ---
      for (let e of enemies.current) {
        if (!e.alive) continue
        const enemyState = e.anim.state
        const enemyFrame = e.anim.frame
        const enemyImg = enemySpriteImages.current[enemyState]
        const enemySpriteData = ENEMY_SPRITES[enemyState]
        if (!enemyImg || !enemySpriteData) continue // <-- Add this line
        const { frameWidth: enemyFrameWidth, frameHeight: enemyFrameHeight } =
          enemySpriteData
        ctx.save()
        if (e.facing === -1) {
          ctx.translate(e.x + enemyFrameWidth, e.y)
          ctx.scale(-1, 1)
          ctx.drawImage(
            enemyImg,
            enemyFrame * enemyFrameWidth,
            0,
            enemyFrameWidth,
            enemyFrameHeight,
            0,
            0,
            enemyFrameWidth,
            enemyFrameHeight
          )
        } else {
          ctx.drawImage(
            enemyImg,
            enemyFrame * enemyFrameWidth,
            0,
            enemyFrameWidth,
            enemyFrameHeight,
            e.x,
            e.y,
            enemyFrameWidth,
            enemyFrameHeight
          )
        }
        ctx.restore()
      }

      // Projectiles
      ctx.fillStyle = "yellow"
      for (let proj of projectiles.current) {
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height)
      }

      // Collectibles
      for (let item of collectibles.current) {
        if (item.img && item.img.complete) {
          ctx.drawImage(item.img, item.x, item.y, item.width, item.height)
        } else {
          ctx.beginPath()
          ctx.arc(
            item.x + item.width / 2,
            item.y + item.height / 2,
            8,
            0,
            Math.PI * 2
          )

          ctx.fill()
        }
      }
    }

    function loop() {
      update()
      draw()
      if (!gameOver.current && !gameWon.current) {
        requestAnimationFrame(loop)
      }
    }

    // Wait for all images to load before starting
    let imagesLoaded = 0
    const totalImages =
      2 + Object.keys(SPRITES).length + Object.keys(ENEMY_SPRITES).length
    function tryStart() {
      imagesLoaded++
      console.log("Image loaded", imagesLoaded, "of", totalImages)
      if (imagesLoaded === totalImages) {
        spawnCollectibles(5)
        loop()
      }
    }
    wallImage.current.onload = tryStart
    backgroundImage.current.onload = tryStart
    for (const key in spriteImages.current) {
      spriteImages.current[key].onload = tryStart
    }
    for (const key in enemySpriteImages.current) {
      enemySpriteImages.current[key].onload = tryStart
    }

    const handleKeyDown = (e) => {
      keys[e.key] = true
      if (e.key === " ") {
        fireProjectile()
      }
    }
    const handleKeyUp = (e) => {
      keys[e.key] = false
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* --- MUSIC CONTROLS --- */}
      <audio
        ref={audioRef}
        src='/assets/music/level-background/cyborg-ninja.mp3'
        loop
        autoPlay
      />
      <div style={{ margin: "10px 0" }}>
        <button
          onClick={() => {
            setIsMuted((m) => {
              if (m && audioRef.current) {
                audioRef.current.muted = false
                audioRef.current.play().catch(() => {})
              }
              return !m
            })
          }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ marginLeft: 10, verticalAlign: "middle" }}
        />
      </div>
      {/* --- END MUSIC CONTROLS --- */}

      <div
        style={{
          marginBottom: "10px",
          height: "20px",
          width: "200px",
          backgroundColor: "#555",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #999",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(playerHealth / 3) * 100}%`,
            backgroundColor: "limegreen",
            transition: "width 0.3s",
          }}
        />
      </div>

      <p style={{ color: "#fff" }}>
        Food : {collectedCount} / {totalCollectibles}
      </p>

      <canvas
        ref={canvasRef}
        style={{
          background: "#222",
          display: "block",
          margin: "20px auto",
          imageRendering: "pixelated",
        }}
      />
    </div>
  )
}
