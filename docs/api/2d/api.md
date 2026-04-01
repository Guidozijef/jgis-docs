# API (2D API)

`useMap` Hooks提供了基于 OpenLayers 的API封装。

## getTargetId

获取地图容器的唯一 `id`（地图容器为 `<div>` 元素）。

**返回值：**

| Name   | Type   | Description |
| ---- | ---- | --------- |
| id | String | 地图容器的 ID 号 |

**示例：**
```typescript
const { getTargetId } = useMap('id');
console.log('当前地图容器 ID：', getTargetId());
```

## getInstance

获取地图实例。

**返回值：**

| Name   | Type   | Description |
| ---- | ---- | --------- |
| map | Map (ol/Map) | OpenLayers 核心 Map 实例对象 |

**示例：**
```typescript
const { getInstance } = useMap('id');
const mapObj = getInstance();
console.log('地图实例', mapObj);
```

## getTargetElement

获取地图容器的 DOM `<div>` 元素。在设置鼠标指针样式时非常有用。

**返回值：**

| Name   | Type   | Description |
| ---- | ---- | --------- |
| element | HTMLElement | 绑定当前地图的宿主 HTML 元素 |

**示例：**
```typescript
const { getTargetElement } = useMap('id');
const el = getTargetElement();
el.style.cursor = 'pointer'; // 改变鼠标为手指手势
```

## addMarker / createLayer

创建并渲染矢量图层，图层为 `ol.layer.Vector`对象。`addMarker` 本质为 `createLayer(type: 'Point')` 的封装。

根据配置项 `type` 的不同（支持：`Point`、`GeoJSON`、`LineString`、`Polygon`、`Circle`、`MultiLineString`、`MultiPolygon`等），数据结构也会有所变化。


**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 矢量图层唯一名称       |
| data        | Array \| Object | 数据，点线面格式或 GeoJSON 数据 |
| options     | LayerOptions | 图层与样式配置项 |

**options 配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| type       | String | 支持 Point、GeoJSON、LineString、MultiLineString、Polygon、MultiPolygon、Circle 等       |
| style       | ol.style.Style | 点位/线/面样式       |
| getStyle       | Function | (layerName, feature, resolution) => options.style，动态样式函数，优先级最高      |
| zIndex      | Number      | 叠加层级       |
| visible     | Boolean     | 初始是否可见       |
| lonLabel     | String      | `data` 数组项中对应的经度字段名称      |
| latLabel     | String      | `data` 数组项中对应的纬度字段名称       |
| isCluster   | Boolean | （仅 Point 下）是否启用聚合图层 |
| distance    | Number | （仅 Point 下）聚合距离 |

**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layer | ol.layer.Vector  | 生成的矢量图层实例 |


**示例：**

```typescript
const { createLayer } = useMap('id');

createLayer('myPointLayer', [{ lon: 120.0, lat: 30.0, name: '北京' }], {
    type: 'Point', 
    style: new ol.style.Style({
        image: new ol.style.CircleStyle({
          radius: 5,
          fill: new ol.style.Fill({ color: 'blue' })
        })
    }),
    visible: true,
    zIndex: 10,
    lonLabel: 'lon',
    latLabel: 'lat',
})
```

## createWmsLayer

加载 WMS (Web Map Service) 地图影像服务图层。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| options     | WmsOptions | WMS 的相关配置项 |


**WmsOptions配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| url         | String      | WMS 服务地址       |
| layers      | String      | 在 Geoserver 中发布的图层服务名称 |
| zIndex      | Number      | 叠加层级       |
| visible     | Boolean  | 图层初始是否可见 |
| opacity     | Number  | 图层透明度 (0-1) |
| cqlFilter   | String  | Geoserver 高级基于字段过滤数据的 CQL 表达式 |

**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layer | ol.layer.Tile  | WMS 切片图层实例 |

**示例：**

```typescript
const { createWmsLayer } = useMap('id');
createWmsLayer('wmsLayer', {
    url: 'http://localhost:8080/geoserver/wms',
    layers: 'test:province',
    zIndex: 10,
    opacity: 0.8,
    cqlFilter: 'name = "北京市"',
})
```

## createWfsLayer

加载 WFS (Web Feature Service) 矢量资源并作为 Feature 加载到地图，返回标准的 `ol.layer.Vector` 实例。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| options     | WfsOptions | WFS 资源配置项 |


**WfsOptions配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| url         | String \| Function | WFS 地址或接收地图范围并返回字符串的回调函数 |
| projection      | String      | 坐标系声明（如 `EPSG:4326`）|
| zIndex      | Number      | 叠加层级       |
| visible     | Boolean  | 图层初始是否可见 |
| opacity     | Number  | 二维要素总体透明度 |

**示例：**

```typescript
const { createWfsLayer } = useMap('id');
const wfsLayer = createWfsLayer('wfsLayer', {
    url: 'http://localhost:8080/geoserver/wfs',
    visible: true,
    opacity: 0.8
})
```

## createOverlay

创建 OpenLayers 原生的 HTML 弹窗/覆盖物容器，允许你挂载 Vue/React 组件 DOM，并将其位置与地图中某个具体的真实经纬度坐标进行绑定（支持相机漫游下联动）。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 覆盖物唯一名称       |
| options     | OverlayOptions | `{ offset: [x,y], positioning: 'center' }` 等原生的 ol.Overlay 选项 |

**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| overlay   | ol.Overlay      | OpenLayers 原生 Overlay 实例       |
| element   | HTMLDivElement      | 覆盖物的实际 DOM 容器节点      |
| setPosition | (coordinate: [lon, lat]) => void | 改变该弹窗定位到的经纬度的方法 |
| setOffset | (offset: [x, y]) => void | 改变弹窗像素偏移的方法 |

**示例：**
```typescript
const { createOverlay } = useMap('id');
const { overlay, element, setPosition } = createOverlay('myOverlay', { positioning: 'bottom-center' })
// 此时 element 可以通过 createApp 或 Vue 的 createVNode 将组件挂载上去
element.innerHTML = '<div style="background: white; padding: 10px;">弹窗内容</div>'

// 定位弹窗到成都
setPosition([104.064839, 30.548857])
```

## customBaseLayer / setBaseLayer

用于配置地图底层加载的基础地图（天地图 / 自定义 XYZ）。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| mapType   | String      | （仅 `setBaseLayer`）天地图影像类型：`'vec'` 矢量, `'img'` 影像, `'ter'` 地形       |
| options     | Object | 分别接受 `BaseLayerOptions` / `XYZOptions` 底图配置对象（`token` / `url`） |


**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layer   | ol.layer.Tile  | 底层切片图层       |

**示例：**
```typescript
const { setBaseLayer, customBaseLayer } = useMap('id');

// 直接借助配置内置的天地图类型 (需要您的天地图 token)
setBaseLayer('vec', { token: 'your-tdt-token', minZoom: 1, maxZoom: 18 });

// 使用一套外部的私有 XYZ 底图并作为底层基础
customBaseLayer('myCustomMap', { url: "http://example.com/map/{z}/{x}/{y}.png", zIndex: 0 });
```


## removeLayer / visibleLayer / getLayerByName / getSourceByName

用于对地图中的已有图层对象进行直接的隐藏、销毁或检索读取。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String \| String[] | 需要操作的图层名字。在 `removeLayer` 中支持传入数组一次清理多个。 |
| visible     | Boolean | （仅 `visibleLayer`有效）是否显示图层 |

**返回值：**

获取类方法均会返回目标源对应的实例化对象（如 `ol.layer.Layer` 等）。若无查找结果则返回空。

**示例：**
```typescript
const { removeLayer, visibleLayer, getLayerByName, getSourceByName } = useMap('id');

// 临时隐藏省份面图层
visibleLayer('province_polygon', false);

// 获取图层的对应资源 Source 读取内部加载的 feature 数据
const source = getSourceByName('pointLayer');

// 清理不再需要的多个老旧图层业务
removeLayer(['markerLayer', 'bufferGroup']);
```


## flashFeature / lightFeature

对象高亮与脉冲光晕特效 API。多用于配合交互钩子（或接口查询完毕后）高亮选中的特定资产，吸引用户的视觉聚焦。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 高亮特效将要挂载执行的图层名       |
| feature     | ol.Feature | OpenLayers 标准的被操作特性对象 |
| options   | HighLightOptions / FlashOptions | 特效参数，主要为 `getStyle((layerName, feature))` 和 `time` 时长控制 |
| zoomFlag   | Boolean | （仅 `lightFeature` 存在该选项）设置为真时，视角会自动飞跃聚焦到要素所在地 |


**示例：**
```typescript
const { flashFeature, getFeatures } = useMap('id');
// 取出要素
const feature = getFeatures('parksLayer')[0];

// 做一个红光闪烁动画，持续 2000 毫秒
flashFeature('parksLayer', feature, {
    time: 2000,
    getStyle: () => {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 12,
                fill: new ol.style.Fill({ color: 'red' }),
                stroke: new ol.style.Stroke({ color: 'white', width: 2 })
            })
        })
    }
});
```

## trackAnimation

行军/轨迹动画 API。能够基于一串给定的坐标序列数组让图层或者图标要素运动。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| path   | Array | 二维坐标点轨迹数据 `[[lon, lat], [lon, lat], ...]`  |
| options     | TrackAnimationOptions | 动画轨迹的具体播放配置及样式资源 |

**TrackAnimationOptions配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| duration | Number | 每段路径所需的推演时间跨度，单位 ms |
| showPath | Boolean | 是否在路过时顺带画出行经的完整轨迹线 |
| loop | Boolean | 运动结束后是否自动重置回到起点循环 |
| style | Object | 图标风格。含 `icon(图片地址)`, `offset`, `autoRotate` (行进时是否随路网切线改变车头车轮朝向) |

**示例：**
```typescript
const { trackAnimation } = useMap('id');

trackAnimation([[120, 30], [121, 31], [122, 32], [123, 29]], {
    duration: 5000,
    showPath: true,
    loop: false,
    style: {
        icon: '/images/car.png',
        autoRotate: true 
    }
});
```

## flyTo / flyToByFeature / flyToByExtent

用于地图相机的视野漫游控制，提供了直接面向坐标点、直接面向单个数据点 `Feature` 或直接覆盖一个完整的空间矩形边界框三种聚焦方式。

**参数 (`flyTo` 和 `flyToByFeature`)：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| coordinate/feature   | Array \| Feature | 你想要移动向的目标实体数据（坐标：`[lon, lat]` 或是原生的要素） |
| options       | flyOptions | 控制漫游缓冲或视角的过渡配置对象  |

**参数 (`flyToByExtent`)：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| options       | flyOptions | 根据 `index.ts` 本方法只有一个入参，其中包含了包围边界配置 `options.extend`  |

**flyOptions配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| zoom | Number | 停止飞行时相机希望保持的最终缩放层级 |
| duration | Number | 整个空间穿梭过渡使用的总时间毫秒数，默认 1000 |
| rotation | Number | 地图 2D 平面翻转/旋转的角度值 |
| easing | Function | 用于动画推演的数学缓动计算函数（例如进缓退疾曲线） |

**返回值：**

这些方法返回 `Promise<boolean>` ，表示如果飞行动画安全完成没有任何因用户拖拽打断而终止，则为 `true`。

**示例：**
```typescript
const { flyTo } = useMap('id');

flyTo([104.06, 30.65], {
    zoom: 15,
    duration: 2500
}).then((success) => {
    if(success) {
        console.log('顺利达到目标点，没有被用户中途滚动鼠标打断');
    }
});
```

## getZoom / setZoom

读取和改变相机的当前层级。

**参数 (setZoom)：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| zoom   | Number | 新的层级级别 (如 `4`, `16`)       |

**返回值 (getZoom)：**
返回当前的 `Number`。

**示例：**
```typescript
const { getZoom, setZoom } = useMap('id');

const current = getZoom();
setZoom(current + 1); // 放大一级
```

## destroyMap

完全摧毁并取消关联所有 `JGIS` 地图的上下文，清理其注册表。用于当前路由离开，卸载 Vue 组件时的手动销毁清理，防范大规模内存泄漏。

**参数：**

无，它会自动抓取创建时内部绑定的实例和 ID 进行清理。

**示例：**
```typescript
import { onBeforeUnmount } from 'vue';

const { destroyMap } = useMap('div_id');

onBeforeUnmount(() => {
    destroyMap();
})
```

## createBlankLayer

创建一个没有任何默认数据点的空白矢量图层。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称标识       |
| options     | styleOptions | 包含图层层级（`zIndex`）、是否可见（`visible`）及基础样式配置（`style` / `getStyle`）的对象 |

**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layer   | ol.layer.Layer      | 返回继承自 OpenLayers Layer 的图层基类对象 |

## getLonLat

统一的经纬度数据提取工具方法，通过传入任意包含有约定经纬度字段的原始业务数据对象，自动抽取出 `[longitude, latitude]`。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| data   | Any      | 含有特定地理标签映射的数据项  |

**返回值：**

返回 `[number, number]` 元组数组。

## findFeature

遍历特定图层，并在其存储特性的 properties 属性中依据条件字典返回检索到的第一个关联结果。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String | 要查找的名称 |
| properties  | Any | 匹配的对象字典或条件 |

**返回值：**
返回第一个符合计算后的 `ol.FeatureLike`。

## getFeatures 

简单快捷地获取任意一个给定名称图层内的所有的 Feature。

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String | 要获取数据的图层名称标识 |

**返回值：**
返回 `FeatureLike[]` 的 OpenLayers 要素数组。

## getAllLayer / getAllOverlay

获取当前整个底图实例中挂载的**所有**通用图层和所有独立挂靠的覆盖物。

**参数：**

无参数。底层的 `useMap` 会自动绑定当前闭包中的 `map`。

**返回值：**
分别返回包含了 `(ol.layer.Base | ol.Overlay)[]` 和单独的 `ol.Overlay[]` 数组。

**示例：**
```typescript
const { getAllLayer } = useMap('id');

const layers = getAllLayer();
console.log('当前地图所有挂载层：', layers);
```

## getProjection

获取当前 2D 平面上相机的地图投影标准对象。

**返回值：**
返回当前相机所处的原生 `ol.proj.Projection` 实例（例如其内部记录了是 EPSG:4326 或 3857 以及当前经纬范围等标准系常量）。