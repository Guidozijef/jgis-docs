---
layout: home

hero:
  name: "JGIS"
  text: "重新定义 GIS 开发体验"
  tagline: 基于函数式编程 · 多入口架构 · 极致轻量
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: API 文档
      link: /api/2d
  image:
    component: MapDemo

features:
  - title: 📦 多入口架构
    details: 严格分离 2D (OpenLayers) 与 3D (Cesium)，告别巨型包体积。
  - title: 🚀 函数式 Hooks
    details: useSelect, useMap... 像写 React/Vue 一样写地图逻辑。
  - title: ⚡️ 混合拾取 Hybrid
    details: 一套 API 同时搞定 Vector 与 WMS 图层点击，统一高亮。
---

<script setup>
import MapDemo from './components/MapDemo.vue'
</script>


```javascript
// 🐢 Old Way (OpenLayers 原生)
map.on('click', (e) => {
  const feature = map.forEachFeatureAtPixel(e.pixel, f => f);
  if (feature) {
    // 手动创建高亮层...
  } else {
    // 发送 WMS 请求...
  }
});

// 🐇 The JGIS Way
const select = useSelect({
  layers: [vector, wms],
  style: { stroke: { color: 'red' } }
});
```


<!-- 2. Bento 风格特性网格 -->
<div class="bento-grid">
  <div class="card card-lg">
    <div class="icon">🎨</div>
    <h3>动态样式引擎</h3>
    <p>完全控制权。根据图层类型、属性字段甚至缩放级别，动态计算高亮样式。</p>
  </div>
  <div class="card">
    <div class="icon">📦</div>
    <h3>Tree Shaking</h3>
    <p>只打包你用到的。2D 项目零 Cesium 代码。</p>
  </div>
  <div class="card">
    <div class="icon">🟦</div>
    <h3>TypeScript</h3>
    <p>100% 类型覆盖。智能提示，拒绝 AnyScript。</p>
  </div>
  <div class="card card-wide">
    <div class="icon">🔌</div>
    <h3>Vite 专属优化</h3>
    <p>内置 dedupe 配置指南，完美解决 OpenLayers 双重实例难题。</p>
  </div>
</div>

<!-- 3. 底部 Slogan -->
<div class="footer-cta">
  <h2>准备好构建下一代 GIS 应用了吗？</h2>
  <p>无论是 Vue 还是 React，JGIS 都能无缝集成。</p>
</div>

<style>
/* --- 布局通用 --- */
.section-code {
  display: flex;
  align-items: center;
  gap: 40px;
  margin: 100px 0;
  flex-wrap: wrap;
}

.code-desc {
  flex: 1;
  min-width: 300px;
}

.code-desc h2 {
  font-size: 32px;
  font-weight: 700;
  /* 强制使用蓝紫渐变标题 */
  background: -webkit-linear-gradient(120deg, #3b82f6 30%, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
}

.code-desc ul { list-style: none; padding: 0; margin-top: 20px; }
.code-desc li { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; color: var(--vp-c-text-2); }

.code-block {
  flex: 1.5;
  min-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  /* 强制深色代码背景 */
  background-color: #161618 !important;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5);
}
.code-block div[class*='language-'] { margin: 0 !important; border-radius: 0 !important; background-color: transparent !important; }

/* --- Bento Grid --- */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 100px 0;
}

/* --- 卡片核心样式 (强制修改) --- */
.card {
  position: relative;
  height: 100%;
  padding: 32px;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  /* 默认(浅色模式)：强制使用极淡的蓝灰色，而不是纯白 */
  background-color: #f6f8fa; 
  border: 1px solid #e2e8f0;
}

/* 深色模式下的卡片：强制使用半透明玻璃感 */
:root.dark .card {
  /* 这种颜色在深色背景上会很明显 */
  background-color: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* 悬停效果：加深背景色 + 发光边框 */
.card:hover {
  transform: translateY(-5px);
  /* 浅色模式悬停变白 */
  background-color: #ffffff;
  border-color: #3b82f6; /* 亮蓝色边框 */
  box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.2);
}

:root.dark .card:hover {
  /* 深色模式悬停变亮一点 */
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #6366f1; /* 紫色边框 */
}

/* 卡片内部元素 */
.card-lg { grid-column: span 2; }
.card-wide { grid-column: span 3; }

.card .icon { 
  font-size: 32px; 
  margin-bottom: 20px; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px; 
  height: 60px;
  /* 图标背景：强制渐变色 */
  background: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%);
  border-radius: 16px;
}

.card h3 { font-size: 20px; font-weight: 600; margin-bottom: 10px; color: var(--vp-c-text-1); }
.card p { color: var(--vp-c-text-2); line-height: 1.6; font-size: 15px; }

/* --- 底部 CTA --- */
.footer-cta {
  text-align: center;
  margin: 100px 0 60px;
  padding: 60px 40px;
  border-radius: 24px;
  /* 强制渐变背景 */
  background: linear-gradient(180deg, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0.1) 100%);
  border: 1px solid rgba(59,130,246,0.2);
}

/* 响应式 */
@media (max-width: 768px) {
  .section-code { flex-direction: column; gap: 30px; }
  .bento-grid { grid-template-columns: 1fr; }
  .card-lg, .card-wide { grid-column: span 1; }
  .code-block { width: 100%; }
}

/* 增强 Hero 文字的可读性 */
.VPHero .name, 
.VPHero .text, 
.VPHero .tagline {
  /* 文字阴影/发光，防止被地球背景吃掉 */
  text-shadow: 0 0 20px var(--vp-c-bg), 0 0 25px var(--vp-c-bg); 
  position: relative;
  z-index: 10;
}
</style>