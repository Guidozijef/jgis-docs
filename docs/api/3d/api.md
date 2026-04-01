# API (3D API)

`useMap` Hooks提供了基于原生的 `Cesium` 与 `jgis` 的内部核心方法封装。

## getTargetId / getInstance

最基础的上下文标识与实体获取。在三维场景中获取 ID 和底层的地图环境对象 `Viewer`。

**返回值 (getTargetId)：**

| Name | Type   | Description                         |
| ---- | ------ | ----------------------------------- |
| id   | String | 初始化时注册在 DOM 的挂载 target id |

**返回值 (getInstance)：**

| Name   | Type          | Description                                            |
| ------ | ------------- | ------------------------------------------------------ |
| viewer | Cesium.Viewer | 被移除过版权框等默认不必要控件配置的真实 Cesium Viewer |

**示例：**

```typescript
const { getTargetId, getInstance } = useMap('id')
const viewer = getInstance()
console.log(`正在查看容器 ${getTargetId()} 的底层 Viewer 对象`, viewer)
```

## addMarker / createLayer

使用不同 `type` 创建各种要素图层（最终都以 `Cesium.Primitive`、`Cesium.EntityCollection` 或 `Cesium.DataSource` 插入到三维场景集合中）。`addMarker` 仅仅是 `createLayer(..., { type: 'Point' })` 的代理封装。

配置项 `type` 支持：`Point`、`EntityPoint`、`LineString`、`MultiLineString`、`Wms`等。

**参数：**

| Name      | Type            | Description                                   |
| --------- | --------------- | --------------------------------------------- |
| layerName | String          | 我们为目标渲染操作自定义的不重复标志名称      |
| data      | Array \| Object | 数据集合 (一般是数组里存放具有经纬高维度的点) |
| options   | optionsMap      | 这个映射根据 type 的值要求不同的 `options`    |

**当 type 为 'Point' 时 (`addMarker` 同理)：**

这是基于 `Primitive > BillboardCollection` 技术的高性能点渲染，不支持文字 `label` 渲染。

| Name     | Type     | Description                                                                    |
| -------- | -------- | ------------------------------------------------------------------------------ |
| getImage | Function | `(item: 所在元素本身) => url`, 结合数据给每个点返回不同图片的函数              |
| image    | String   | 所有点公共的图标资源 URL                                                       |
| scale    | Number   | 缩略图整体缩放                                                                 |
| _其他_   | Any      | 向下透明支持原生的 `Cesium.Billboard.ConstructorOptions`，如 `scaleByDistance` |

**当 type 为 'EntityPoint' 时：**

基于 `DataSource > Entity`，不仅支持 Billboard 图片展示，还在下挂对象额外扩展了文字支持：

| Name          | Type                 | Description                                                                      |
| ------------- | -------------------- | -------------------------------------------------------------------------------- |
| _Point全参数_ | Any                  | 继承全部点属性表                                                                 |
| labelStyle    | Cesium.LabelGraphics | 供 `Entity` 采用 `getText(item)` 或静态 `text` 来定义字体大小/颜色的额外声明对象 |

**当 type 为 'LineString' / 'MultiLineString' 时：**

| Name        | Type            | Description                               |
| ----------- | --------------- | ----------------------------------------- |
| width       | Number          | 屏幕像素下的线宽设定                      |
| color       | String          | rgba(..) 或者 hex '#FF5500'               |
| material    | Cesium.Material | 传递原生纹理/粒子/走马灯材质              |
| granularity | Number          | （弧度）精细划分线条粒度的采样，预设 2000 |

**当 type 为 'Wms' 时：**

加载 Geoserver WMS。不需要 data。

| Name                          | Type   | Description                                |
| ----------------------------- | ------ | ------------------------------------------ |
| url                           | String | WMS REST API 请求域址                      |
| layers                        | String | 需要加载的服务内图层名称名                 |
| alpha / opacity               | Number | 这个影像片的呈现透明程度（推荐 0~1）       |
| brightness / contrast / gamma | Number | 图层最终显示时的亮度、对比如、伽马偏色滤镜 |

**示例（同时带有文字的 EntityPoint 创建）：**

```typescript
const { createLayer } = useMap('id')

createLayer('entity_ships', [{ lon: 104.39, lat: 30.9, name: '护卫舰' }], {
  type: 'EntityPoint',
  getImage: () => '/icons/ship.png',
  scale: 0.8,
  labelStyle: {
    getText: (item) => item.name,
    font: '14px sans-serif'
  }
})
```

## create3DTileLayer

快速加载超大场景标准架构 3DTiles 模型（支持倾斜摄影，BIM，或者城市白模等瓦片）。

**参数：**

| Name      | Type   | Description                                                                                        |
| --------- | ------ | -------------------------------------------------------------------------------------------------- |
| layerName | String | 创建的此模型服务集合别名                                                                           |
| options   | Object | `url` 和一个 `isFlyTo` （配置是否当解析完成立马推进视角），此外也接收原生的 Constructor 构造对象。 |

**返回值：**

返回 `Promise<Cesium.Cesium3DTileset>` 实例。

**示例：**

```typescript
const { create3DTileLayer } = useMap('id')
// 利用 Promise 回调等待
const myTile = await create3DTileLayer('beijing_model', {
  url: 'http://data-source/tileset.json',
  isFlyTo: true,
  maximumScreenSpaceError: 16 // 原生属性也可传入控制 LOD 粗糙度
})
```

## createOverlay

类似 2D 中，但由于 Cesium 是由 WebGL 处理画布，我们需要通过建立覆盖在 Canvas 上的绝对定位 HTML Div 并在每一帧监控球体进行 2D 至 3D 转换。这个 API 将这个计算过程为您封装好。

**参数：**

| Name      | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| layerName | String | 要绑定创建的弹层唯一名字标识 |

**返回值：**

返回包含以下操作映射关系的 `OverlayResult` 对象：

| Name        | Type        | Description                                                                             |
| ----------- | ----------- | --------------------------------------------------------------------------------------- |
| element     | HTMLElement | 可以任您修改其 innerHTML 或被 Vue 注入挂载的裸 DIV 窗体                                 |
| setPosition | Function    | `(position: Cartesian3)` 不断监听相机和旋转从而维持其跟随地球三维表面特定的真实目标上。 |

**示例：**

```typescript
const { createOverlay } = useMap('id')
const { element, setPosition } = createOverlay('infoCard')

// 写入 React/Vue 或原生前端视图样式
element.innerHTML = '<div class="card">提示详情面板</div>'

// 定义其实际需要定死的世界坐标位置 (lon, lat, height)
const position = Cesium.Cartesian3.fromDegrees(104.06, 30.54, 100)
setPosition(position)
```

## customBaseLayer / setBaseLayer

底层瓦片/影像（卫星/普通栅格地图）替换工具。因为在三维中往往不需要 2D 那样控制复杂的投影系，本框架已提供了预置快速加载能力。

**参数 (setBaseLayer)：**

配合 JGIS 工具箱可以直接调用公网天地图三剑客。

| Name            | Type   | Description                                                    |
| --------------- | ------ | -------------------------------------------------------------- |
| options.mapType | String | `ver` (矢量街道) / `img` (太空影像) / `ter` (带地形高度的拓扑) |
| options.token   | String | 申请的合法天地图通讯用凭证 Token                               |

**参数 (customBaseLayer)：**

当你使用的是局域网或特定的 XYZ 标准 URL 切片路径时进行覆盖声明。

| Name        | Type   | Description                                                   |
| ----------- | ------ | ------------------------------------------------------------- |
| layerName   | String | 自定义取名                                                    |
| options.url | String | xyz 模板变量地址例如：`http://{s}.server.com/{z}/{x}/{y}.png` |

**返回值：**
返回创建的原生影像 `ImageryLayer/ImageryProvider`。

**示例：**

```typescript
const { setBaseLayer } = useMap('cesiumContainer')

// 加载无云遮挡的超清卫星影像图作为球体最初包裹的皮肤
setBaseLayer({ token: 'my-token123', mapType: 'img' })
```

## removeLayer / visibleLayer / getLayerByName

与 2D 中操作概念完全一致的安全清理、查找工作流。本 API 可用同一套代码思维对三维地球中挂靠在内部字典 `layerName` 的 `DataSource` 或 `Primitive` 进行交互。

**参数：**

| Name      | Type               | Description                                 |
| --------- | ------------------ | ------------------------------------------- |
| layerName | String \| String[] | (可传数组多选) 执行操作目标对象的自定义别名 |
| visible   | Boolean            | （针对显示隐藏特有）真或假                  |

**示例：**

```typescript
const { getLayerByName, visibleLayer, removeLayer } = useMap('id')

// 当我们临时想要关闭大体积模型，减轻显卡负担：
visibleLayer('beijing_model', false)

// 彻底清除并从 GPU 以及内存中清理这些驻留对象
removeLayer(['entity_ships', 'wmsLayer'])

// 如果需要进行底层的 Entity 操作而不是依赖内部黑盒
const billboardColl = getLayerByName('myPointLayer') // 返回 EntityCollection 等
```

## findGraphic

由于部分 API 是通过 `Point` 原生底层的 Primitive `BillboardCollection` 来追求极致效率（如百万辆单车撒点渲染）渲染的。此方法允许你在点击时输入部分关键维度的条件来找回原数据。

**参数：**

| Name      | Type   | Description                                          |
| --------- | ------ | ---------------------------------------------------- |
| layerName | String | 我们想要在哪一个图层集合底下执行检索                 |
| data      | Record | 包含目标实体部分属性键值对（必须含可用的反算坐标）。 |
| tolerance | Number | 查找时候，计算两个球体三维点距的宽容度，默认 `0.1`   |

**返回值：**
返回第一个符合计算后的 `Cesium.Entity` 或者 `Cesium.Billboard` 对象及其自带挂在上的扩展数据。

## flyTo / setView / flyHome / flyToBoundingSphere

飞行调度指令合集。支持常规视域缩放转场及动画过渡、飞向模型包围盒球体等高级操控。

**参数：**

| Name           | Type       | Description                                                                |
| -------------- | ---------- | -------------------------------------------------------------------------- |
| coordinate     | Array      | 如 `flyTo` 和 `setView`：目标视角的所在空域位置。形式 `[lon, lat, height]` |
| boundingSphere | Object     | 模型附带自带的原生空间体积描述对象。                                       |
| options        | flyOptions | 用于修改飞机视角及时间的选项配置                                           |

**flyOptions 属性解读（这是核心，与二维极大不同）：**

| Name      | Type     | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| duration  | Number   | 不带入则默认为瞬间移动。填入为花费转场的动画秒数                 |
| heading   | Number   | 相机水平横滚，例如 0 表示向正北，90是正东                        |
| pitch     | Number   | 垂直纵倾度。通常传负角 `-Math.PI / 2` 表明 90 度垂直往下凝视地面 |
| roll      | Number   | 画面自身的倾侧摇滚度，通常为 0 不发生图像倾斜                    |
| maxHeight | Number   | 过渡时，相机飞行能够允许的最高极限高度                           |
| easing    | Function | 如 `Cesium.EasingFunction.QUADRATIC_IN_OUT` 缓动推波方案         |

**返回值：**
在异步飞行的 API（如 `flyTo`）中返回 `Promise<boolean>` 确保未被人为干扰执行完成才接着后续执行。

**示例：**

```typescript
const { flyTo } = useMap('id')
// 用 2.5 秒，以 45° 向下俯视且朝着正南方向飞往成都
flyTo([104.06, 30.65, 3000], {
  duration: 2.5,
  heading: Math.PI, // 180° 正南方
  pitch: -Math.PI / 4 // -45° 俯冲角
})
```

## getCameraView / getCenter / getViewBounds / getExtent

提取视图和空间信息的一系列状态快照工具。无论你是在编写缩略图导航，还是准备提交视口坐标向后端请求限定数据都是常用功能。

**它们返回的信息集解释：**

- `getCameraView`: 返回包含了 `CameraInfo` `{ longitude, latitude, height, heading, pitch, roll }` 的所有当前摄像机状态。
- `getCenter`: 采用光线投射碰撞（Raycast）去精确推导摄像机屏幕正中心打到地形上的实际点 (`x`, `y` 与 `z` 及高度)。
- `getExtent`: 计算出地图四个边角与地球平面交汇组成的经纬度边界极值 (最大最小面)，返回值通常为 `{ minX,  maxX, minY, maxY }`
- `getViewBounds`: 是上述的另一种风格实现（西南方与东北方的矩形切片），返回的是 `Bounds`。

**示例：**

```typescript
const { getCameraView } = useMap('id')

const info = getCameraView()
console.log(`当前相机视角 - 偏航: ${info.heading}, 倾角: ${info.pitch}, 海拔: ${info.height} 米`)
```

## setWeather

为 Cesium 开发环境扩展了一个全局环境控制器，通过挂接后期渲染后处理对象生成风雨雪雪花光污染颗粒。

**参数：**

| Name    | Type           | Description                                                                                              |
| ------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| options | { type, name } | 提供环境映射。如 { type: 'rain', name: '雨' }、{ type: 'snow', name: '雪' }、{ type: 'fog', name: '雾' } |

**返回值：**
系统会返回挂载的环境控制单例操作句柄结构 `{ destroy, changeOptions }`。

**示例：**

```typescript
const { setWeather } = useMap('id')

// 初始化即开启下雨天气模拟
const weatherControllor = setWeather({ type: 'rain', name: '大雨' })

setTimeout(() => {
  // 改变当前环境至下雪
  weatherControllor.changeOptions({ type: 'snow', name: '暴雪' })
}, 10000)

// 结束所有气象
import { onUnmounted } from 'vue'

onUnmounted(() => {
  weatherControllor.destroy()
})
```

## createBlankLayer

预先向 3D 场景申请并创建一个干净的 Primitive 占位集合对象，供后续手工独立挂靠或在某些特定场景下作为承载容器。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 注册的占位名称标识       |

**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layer   | Cesium.Primitive      | 返回初始化的原生物体集合基类对象 |


## destroyMap

完全摧毁并取消关联当前 `Viewer` 的 WebGL 渲染循环机制，用于离开组件时释放显存避免内存泄露。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| id     | String | 创建时绑定的目标 DOM 节点的 id 字符标识 |

**示例：**

```typescript
import { onBeforeUnmount } from 'vue'

const { destroyMap } = useMap('cesiumContainer')

onBeforeUnmount(() => {
  // 根据 types.ts，3D 版本的销毁操作只要传入当时挂载的 target ID 即可解绑
  destroyMap('cesiumContainer')
})
```
