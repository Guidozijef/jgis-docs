<template>
  <div class="grid-wrapper">
    <canvas ref="canvasRef"></canvas>
    <!-- 边缘遮罩：防止网格太生硬 -->
    <div class="overlay-mask"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let ctx = null
let width = 0
let height = 0
let animationFrameId = null

// --- 配置参数 ---
const GAP = 24            // 点间距 (越小越像磨砂颗粒)
const RADIUS = 1          // 点的大小
const LIGHT_RADIUS = 300  // 鼠标探照灯范围
const BASE_OPACITY = 0.08 // 默认点的透明度 (很淡，作为背景纹理)
const HOVER_OPACITY = 0.6 // 鼠标照亮时的透明度

let mouse = { x: -1000, y: -1000 }

const init = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  width = window.innerWidth
  height = window.innerHeight
  // 适配高清屏
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
}

const render = () => {
  const isDark = document.documentElement.classList.contains('dark')
  ctx.clearRect(0, 0, width, height)

  // 颜色配置
  // 深色模式：青灰色 / 浅色模式：蓝灰色
  const colorStr = isDark ? '150, 160, 200' : '80, 100, 150'

  // 遍历绘制网格
  // 优化：不使用对象数组，直接循环绘制，性能最强
  for (let x = 0; x < width; x += GAP) {
    for (let y = 0; y < height; y += GAP) {
      
      // 计算鼠标距离
      const dx = mouse.x - x
      const dy = mouse.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      let alpha = BASE_OPACITY

      // 探照灯效果：如果点在鼠标范围内，增加透明度
      if (dist < LIGHT_RADIUS) {
        // 距离越近越亮 (线性插值)
        const intensity = 1 - dist / LIGHT_RADIUS
        alpha += intensity * (HOVER_OPACITY - BASE_OPACITY)
      }

      ctx.beginPath()
      ctx.fillStyle = `rgba(${colorStr}, ${alpha})`
      ctx.arc(x, y, RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  animationFrameId = requestAnimationFrame(render)
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
  render()
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
.grid-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* 关键：放在最底层 (-2)，地球是 (-1) */
  z-index: -2; 
  background-color: var(--vp-c-bg);
  transition: background-color 0.3s;
  pointer-events: none;
}

canvas {
  display: block;
}

.overlay-mask {
  position: absolute;
  inset: 0;
  /* 四周渐隐遮罩 */
  background: radial-gradient(circle at center, transparent 40%, var(--vp-c-bg) 100%);
}
</style>