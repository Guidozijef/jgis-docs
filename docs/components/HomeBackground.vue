<template>
  <div v-if="isHome" class="globe-wrapper" :class="{ loaded: isLoaded }">
    <!-- 地球容器 -->
    <canvas ref="canvasRef" />
    
    <!-- 大气层辉光：用 CSS 模拟地球背后的光晕 -->
    <div class="globe-glow"></div>
    
    <!-- 遮罩：边缘融合 -->
    <div class="globe-mask"></div>
  </div>
</template>

<script setup>
import createGlobe from 'cobe'
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, isDark: themeIsDark } = useData()
const canvasRef = ref()
let globe = null
const isLoaded = ref(false)

const isHome = computed(() => frontmatter.value.layout === 'home')

// --- 静态配置 ---
// 核心城市锚点 (纬度, 经度)
const CITIES = [
  { lat: 39.9042, lng: 116.4074 }, // 北京
  { lat: 31.2304, lng: 121.4737 }, // 上海
  { lat: 35.6895, lng: 139.6917 }, // 东京
  { lat: 40.7128, lng: -74.0060 }, // 纽约
  { lat: 51.5074, lng: -0.1278 },  // 伦敦
  { lat: -33.8688, lng: 151.2093 }, // 悉尼
  { lat: 48.8566, lng: 2.3522 },   // 巴黎
  { lat: 55.7558, lng: 37.6173 },  // 莫斯科
  { lat: 1.3521, lng: 103.8198 },  // 新加坡
  { lat: 25.2048, lng: 55.2708 },  // 迪拜
]

// --- 动态卫星生成 ---
// 生成 30 个随机卫星: [纬度, 经度, 速度, 轨道偏移]
let satellites = Array.from({ length: 30 }, () => [
  (Math.random() - 0.5) * 160,   // 纬度范围大一点
  Math.random() * 360,           // 经度任意
  0.1 + Math.random() * 0.2,     // 速度 (比之前快)
  Math.random() * Math.PI * 2    // 闪烁相位
])

let phi = 4.5 
let width = 0

const initGlobe = () => {
  if (!canvasRef.value || !isHome.value) return
  if (globe) globe.destroy()

  width = canvasRef.value.offsetWidth
  const isDarkMode = themeIsDark.value

  // 配色方案 (更具科技感的配色)
  const config = {
    dark: isDarkMode ? 1 : 0,
    // 深色模式：深蓝底 / 浅色模式：纯白底
    baseColor: isDarkMode ? [0.1, 0.1, 0.3] : [1, 1, 1],
    // 标记点颜色：高亮青色
    markerColor: isDarkMode ? [0.3, 0.8, 1] : [0.1, 0.5, 1],
    // 辉光颜色
    glowColor: isDarkMode ? [0.1, 0.1, 0.5] : [0.8, 0.9, 1], 
    diffuse: 1.2, 
    mapBrightness: 6, 
  }

  globe = createGlobe(canvasRef.value, {
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,
    phi: 0,
    theta: 0.25, // 稍微倾斜一点，更立体
    dark: config.dark,
    diffuse: config.diffuse,
    mapSamples: 25000, // 点阵密度极大，画面更细腻
    mapBrightness: config.mapBrightness,
    baseColor: config.baseColor,
    markerColor: config.markerColor,
    glowColor: config.glowColor,
    opacity: 0.9,
    markers: [], // 初始为空，由 onRender 填充
    onRender: (state) => {
      // 1. 地图自转
      phi += 0.002
      state.phi = phi
      state.width = width * 2
      state.height = width * 2

      // 2. 构建渲染数组
      const currentMarkers = []

      // A. 添加固定城市 (呼吸效果)
      const time = Date.now() / 1000
      const pulse = Math.sin(time * 3)
      const baseSize = 0.04
      
      CITIES.forEach(city => {
        currentMarkers.push({
          location: [city.lat, city.lng],
          size: baseSize + (pulse * 0.01) // 微微呼吸
        })
      })

      // B. 更新并添加卫星 (飞线)
      satellites.forEach((sat, i) => {
        // 更新经度：模拟飞行
        sat[1] -= sat[2] // 向西飞行
        
        // 闪烁大小：模拟信号灯
        // 使用 sin 函数基于时间和相位计算大小
        const flash = Math.sin(time * 5 + sat[3])
        // 只有当 flash > 0 时才显示，模拟闪烁
        const size = flash > 0 ? 0.02 + flash * 0.04 : 0
        
        if (size > 0) {
          currentMarkers.push({
            location: [sat[0], sat[1]],
            size: size
          })
        }
      })

      // 提交给 Cobe 渲染
      state.markers = currentMarkers
    },
  })

  setTimeout(() => { isLoaded.value = true }, 200)
}

watch(() => frontmatter.value.layout, (layout) => {
  if (layout === 'home') nextTick(() => initGlobe())
  else if (globe) globe.destroy()
})

watch(themeIsDark, () => {
  if (isHome.value) initGlobe()
})

const onResize = () => {
  if (canvasRef.value) width = canvasRef.value.offsetWidth
}

onMounted(() => {
  if (isHome.value) {
    window.addEventListener('resize', onResize)
    initGlobe()
  }
})

onUnmounted(() => {
  if (globe) globe.destroy()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.globe-wrapper {
  position: fixed;
  /* 右下角大地球布局 */
  right: -10%;
  bottom: -20%;
  width: 900px; 
  height: 900px;
  z-index: -1;
  opacity: 0;
  transition: opacity 1.5s ease;
  pointer-events: none;
  /* Flex 居中确保 Canvas 和光晕对齐 */
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1400px) {
  .globe-wrapper {
    width: 1100px;
    height: 1100px;
    right: -5%;
    bottom: -25%;
  }
}

@media (max-width: 768px) {
  .globe-wrapper {
    width: 600px;
    height: 600px;
    right: -30%;
    bottom: -10%;
    opacity: 0.7;
  }
}

.globe-wrapper.loaded { opacity: 1; }

canvas {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2; /* 在光晕之上 */
}

/* 新增：大气层辉光效果 */
.globe-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
  border-radius: 50%;
  z-index: 1; /* 在 Canvas 之下 */
  
  /* 深色模式下的蓝色辉光 */
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  filter: blur(60px);
}

/* 亮色模式适配辉光 */
:global(.vp-doc:not(.dark)) .globe-glow {
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 60%);
}

.globe-mask {
  position: absolute;
  inset: 0;
  z-index: 3;
  /* 径向渐变遮罩 */
  background: radial-gradient(circle at 50% 50%, transparent 45%, var(--vp-c-bg) 70%);
}
</style>