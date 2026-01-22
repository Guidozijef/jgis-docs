<template>
  <div class="map-demo-container">
    <div id="home-map" class="map-view"></div>
    <div class="overlay">
      Interactive Demo
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// 假设我们这里动态引入 jgis (如果是本地开发，可以用 npm link)
// import { createMap2D } from 'jgis/2d'; 
// import 'ol/ol.css';

onMounted(async () => {
  if (typeof window !== 'undefined') {
    // 这里写一段简单的 OpenLayers 或 Cesium 初始化代码
    // 为了演示，这里可以先用 CSS 模拟，或者真实引入
    console.log('Map Initialized on Home Page');
    
    // 示例：如果不方便引入真实库，可以用 CSS 动画模拟一个地球
  }
});
</script>

<style scoped>
.map-demo-container {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
}

.map-view {
  width: 100%;
  height: 100%;
  /* 这里可以放一张很酷的地图截图作为背景，或者真实渲染 Canvas */
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg');
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  animation: pulse 10s infinite alternate;
}

.overlay {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #fff;
  background: rgba(0,0,0,0.5);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
</style>