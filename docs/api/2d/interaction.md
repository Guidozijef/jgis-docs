# 地图交互 (2D Core)

`jgis/2d` 模块提供了基于 `Openlayers` 的轻量级封装。统一封装全局拾取api

## ceateSelect

创建一个二维选择器。


```typescript
import { useMap } from 'jgis/2d'
const { ceateSelect } =  useMap('id')


const { onSelect, clear } = await createSelect({
    style: new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: 'red' })
        })
    })
})


onSelect((data) => {
    console.log('onSelect', data)
})

```

## createHover

创建一个二维鼠标移动选择器。


```typescript
import { useMap } from 'jgis/2d'
const { createHover, clear } =  useMap('id')

const { onHover } = createHover({
    style: new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: 'green' })
        })
    })
})

onHover((e) => {
    console.log('hover事件', e)
})
  
```