import DefaultTheme from 'vitepress/theme'
import HomeBackground from '../../components/HomeBackground.vue' // 引入
import RippleBackground from '../../components/RippleBackground.vue' // 引入
import MapDemo from '../../components/MapDemo.vue'
import './style.css'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MapDemo', MapDemo)
    app.component('HomeBackground', HomeBackground) // 注册
    app.component('RippleBackground', RippleBackground)
  },
  // 使用 Layout 插槽将背景注入到所有页面（或者仅首页）
  Layout: () => {
    const { Layout } = DefaultTheme
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => [h(RippleBackground),h(HomeBackground)] // 放在底部插槽
    })
  },
}