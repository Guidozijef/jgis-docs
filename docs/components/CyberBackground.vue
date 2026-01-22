<template>
  <div class="canvas-container">
    <canvas ref="canvasRef"></canvas>
    <!-- 顶部和底部的遮罩，让背景与页面融合得更自然 -->
    <div class="mask-top"></div>
    <div class="mask-bottom"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
let width = 0
let height = 0
let particles = []

// --- 配置参数 (可以根据喜好微调) ---
const PARTICLE_COUNT = 100    // 粒子数量 (越多越密集，但性能消耗越大)
const CONNECT_DISTANCE = 150  // 连线距离阈值
const MOUSE_RADIUS = 200      // 鼠标影响范围
const PARTICLE_SPEED = 0.5    // 粒子自然漂浮速度

// 鼠标状态
let mouse = { x: -1000, y: -1000 }

// 粒子类
class Particle {
  constructor() {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.vx = (Math.random() - 0.5) * PARTICLE_SPEED
    this.vy = (Math.random() - 0.5) * PARTICLE_SPEED
    // 随机大小，制造层次感
    this.size = Math.random() * 2 + 1 
  }

  update() {
    // 1. 自然移动
    this.x += this.vx
    this.y += this.vy

    // 2. 边界反弹
    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1

    // 3. 鼠标交互 (磁吸效果)
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_RADIUS) {
      // 靠近鼠标时，粒子会微微向鼠标靠拢（磁力）
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS
      
      // 施加轻微的引力
      const moveSpeed = 0.8
      this.x += forceDirectionX * force * moveSpeed
      this.y += forceDirectionY * force * moveSpeed
    }
  }

  draw(context, isDark) {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    // 粒子颜色
    context.fillStyle = isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)'
    context.fill()
  }
}

const init = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
  ctx = canvas.getContext('2d')

  // 初始化粒子
  particles = []
  // 根据屏幕大小调整粒子数量，手机上少一点
  const count = width < 768 ? PARTICLE_COUNT / 2 : PARTICLE_COUNT
  
  for (let i = 0; i < count; i++) {
    particles.push(new Particle())
  }
}

const animate = () => {
  const isDark = document.documentElement.classList.contains('dark')
  ctx.clearRect(0, 0, width, height)

  // 更新所有粒子
  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].draw(ctx, isDark)

    // --- 核心：绘制连线 (拓扑网络) ---
    // 这一步复杂度是 O(N^2)，但粒子少所以很快
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 如果两个粒子距离够近，就画线
      if (distance < CONNECT_DISTANCE) {
        ctx.beginPath()
        
        // 线条透明度基于距离 (越远越淡)
        let opacity = 1 - (distance / CONNECT_DISTANCE)
        
        // 如果这两个粒子都在鼠标附近，线条更亮、更粗
        const distMouse = Math.sqrt(
            Math.pow(mouse.x - particles[i].x, 2) + 
            Math.pow(mouse.y - particles[i].y, 2)
        )
        
        if (distMouse < MOUSE_RADIUS) {
            opacity = opacity * 2 // 鼠标附近高亮
            ctx.lineWidth = 1.5
            ctx.strokeStyle = isDark 
                ? `rgba(100, 200, 255, ${opacity})` // 深色模式：青亮色线
                : `rgba(59, 130, 246, ${opacity})`  // 浅色模式：深蓝色线
        } else {
            ctx.lineWidth = 0.5
            ctx.strokeStyle = isDark 
                ? `rgba(139, 92, 246, ${opacity * 0.2})` // 平时很淡
                : `rgba(0, 0, 0, ${opacity * 0.1})`
        }

        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  // 连接鼠标与附近的粒子 (让交互感更强)
  // ... (可选，为了简洁省略，上面的逻辑已经足够炫酷)

  animationFrameId = requestAnimationFrame(animate)
}

const handleMouseMove = (e) => {
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

const handleResize = () => {
  init()
}

onMounted(() => {
  init()
  animate()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-color: var(--vp-c-bg);
  transition: background-color 0.3s;
  overflow: hidden;
}

canvas {
  display: block;
}

/* 顶部遮罩：防止图形干扰导航栏文字 */
.mask-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(to bottom, var(--vp-c-bg) 20%, transparent 100%);
  pointer-events: none;
}

/* 底部遮罩：防止图形干扰 Footer */
.mask-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(to top, var(--vp-c-bg) 20%, transparent 100%);
  pointer-events: none;
}
</style>