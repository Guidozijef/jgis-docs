# 地图交互 (3D Core)

`jgis/3d` 模块提供了基于 `Cesium` 的轻量级封装。统一封装全局拾取api

## createSelect

创建一个三维选择器。


```typescript
import { useMap } from 'jgis/3d'
const { createSelect } =  useMap('id')


const { onSelect, clear } = await createSelect({
    style: {
        color: Cesium.Color.GREENYELLOW,
        image: new URL('./famen-CBiSjwuD.png', import.meta.url).href,
        scale: 0.5
    }
})


onSelect((data) => {
    console.log('onSelect', data)
})

```

## createHover

创建一个三维鼠标移动选择器。


```typescript
import { useMap } from 'jgis/3d'
const { createHover, clear } =  useMap('id')

const { onHover } = await createHover({
    style: {
        color: Cesium.Color.GREENYELLOW,
        image: new URL('./famen-CBiSjwuD.png', import.meta.url).href,
        scale: 0.5
    }
})

onHover((data) => {
    console.log('onHover', data)
})
  
```