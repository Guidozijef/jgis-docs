import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'JGIS',
  description: '基于函数式编程的轻量级 GIS 开发框架',

  // 部署到 github pages 时需要的 base 路径，如果是根域名则写 '/'
  base: '/jgis-docs/',

  appearance: 'dark',

  outDir: '../dist', // 打包输出目录

  themeConfig: {
    // 顶部左侧 Logo
    logo: '/logo.svg',

    // 顶部导航栏
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API 参考', link: '/api/2d/index' },
      { text: '更新日志', link: 'https://github.com/Guidozijef/jgis/releases' }
    ],

    // 侧边栏配置
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/getting-started' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '多入口架构', link: '/guide/architecture' },
            { text: '混合拾取', link: '/guide/hybrid-select' }
          ]
        }
      ],
      '/api/': [
        {
          text: '二维 (2D)',
          items: [
            { text: '地图核心', link: '/api/2d/index' },
            { text: '交互 Hooks', link: '/api/2d/interaction' },
            { text: 'API', link: '/api/2d/api' }
          ]
        },
        {
          text: '三维 (3D)',
          items: [{ text: '场景核心', link: '/api/3d/index' }]
        }
      ]
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/Guidozijef/jgis' }],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present JGIS Team'
    },

    // 搜索功能
    search: {
      provider: 'local'
    }
  }
})
