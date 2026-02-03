# API (2D API)

`useMap` Hooks提供了基于 OpenLayers 的API封装。

## getTargetId

获取地图容器的id，地图容器为`<div>`元素。(唯一性`id`)。

**示例：**
```typescript
const { getTargetId } = useMap('id');
console.log('id', getTargetId());
```


## getInstance

获取地图实例，地图实例为`ol.Map`对象。

**示例：**
```typescript
const { getInstance } = useMap('id');
console.log('地图实例', getInstance());
```


## getTargetElement

获取地图容器的`<div>`元素。在设置鼠标样式时非常有用。

**示例：**
```typescript
const { getTargetElement } = useMap('id');
console.log('地图容器元素：', getTargetElement());
```


## addMarker

创建点位，点位为`ol.Feature`对象。根据图层名称、点位数据、点位样式创建点位。其中点位样式为`ol.style.Style`对象。


**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| data        | Array       | 数据格式为数组对象        |
| options     | LayerOptions['Point'] | 配置项 |

**options配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| style       | ol.style.Style | 样式       |
| getStyle       | (layerName, feature) => ol.style.Style | 样式 , style优先级最高      |
| zIndex      | Number      | 层级       |
| visible     | Boolean     | 是否可见       |
| lonLabel     | String      | 经度字段名称      |
| latLabel     | String      | 纬度字段名称       |

**示例：**

```typescript
const { addMarker } = useMap('id');
addMarker('laierName', [{lon:120.0, lat:30.0}], {
    style: new ol.style.Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'blue' })
        })
    }),
    // getStyle: (layerName, feature) => {
    //     return new ol.style.Style({
    //         image: new CircleStyle({
    //           radius: 5,
    //           fill: new Fill({ color: 'blue' })
    //         })
    //     }
    // },
    visible: true,
    zIndex: 10,
    lonLabel: 'lon',
    latLabel: 'lat',
})
```



## createLayer

创建矢量图层，图层为`ol.layer.Vector`对象。根据图层名称、点位数据、点位样式创建点位。其中点位样式为`ol.style.Style`对象。其中配置项`type`字段支持`Point、GeoJSON、LineString、Polygon、Circle、MultiLineString、MultiPolygon`等类型，不同类型`data`数据结构不一样, `addMarker`就是这个方法type为`Point`的一个封装。



**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| data        | Array       | 数据格式为数组对象        |
| options     | LayerOptions['Point'] | 配置项 |

**options配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| type       | String | 支持 Point、GeoJSON、LineString、MultiLineString、Polygon、MultiPolygon、Circle       |
| style       | ol.style.Style | 样式       |
| getStyle       | (layerName, feature) => ol.style.Style | 样式 , style优先级最高      |
| zIndex      | Number      | 层级       |
| visible     | Boolean     | 是否可见       |
| lonLabel     | String      | 经度字段名称      |
| latLabel     | String      | 纬度字段名称       |

如果`type`为`Point`，则`data`格式为：
```typescript
[{
    lon: 120.0,
    lat: 30.0,
    ...
}]
```

如果`type`为`GeoJSON`，则`data`格式为：
```typescript
{
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [102.0, 0.5],
            },
            properties: {}
        }
    ] 
}
```

如果`type`为`LineString`,`MultiLineString`,`Polygon`,`MultiPolygon`，则`data`格式为：

```typescript
[
    {
        coordinates: [[102.0, 0.5], [103.0, 0.5], [104.0, 0.5]]
    }
]

```

如果`type`为`Circle`，则`data`格式为：

```typescript
{
    lon: 120.0,
    lat: 30.0,
    ...
}
```

`options`参数为：

```typescript
{
   radius: 1000, // 圆形半径
   style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 2,
            }),
        }),
   })
}
```

**示例：**

```typescript
const { createLayer } = useMap('id');
createLayer('laierName', [{lon:120.0, lat:30.0}], {
    type: 'Point', // 支持 Point、GeoJSON、LineString、Polygon、Circle、MultiLineString、MultiPolygon
    style: new ol.style.Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'blue' })
        })
    }),
    // getStyle: (layerName, feature) => {
    //     return new ol.style.Style({
    //         image: new CircleStyle({
    //           radius: 5,
    //           fill: new Fill({ color: 'blue' })
    //         })
    //     }
    // },
    visible: true,
    zIndex: 10,
    lonLabel: 'lon',
    latLabel: 'lat',
})
```

## createWmsLayer

创建WMS图层


**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| options     | WmsOptions | 配置项 |


**options配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| url   | String      | wms服务地址       |
| zIndex   | Number      | 层级       |
| visible     | Boolean  | 是否可见 |
| opacity     | Number  | 透明度0-1 |
| cqlFilter     | String  | 是否可见 |
| layers     | String  | wms图层服务名称 |


**示例：**

```js
const { createWmsLayer } = useMap('id');
map.createWmsLayer('wmsLayer', {
    url: 'http://localhost:8080/geoserver/wms',
    layers: 'test:province',
    zIndex: 10,
    visible: true,
    opacity: 1,
    cqlFilter: 'name = "北京市"',
})
```

## createOverlay

创建覆盖物

**参数：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 覆盖物名称       |
| options     | OverlayOptions | 配置项 |


**options配置项：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| positioning   | Positioning      | 位置       |


**返回值：**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| overlayer   | Overlayer      | Overlayer实例       |
| content   | HTML      | 覆盖物绑定上下文      |