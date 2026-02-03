# API (2D API)

`useMap` Hooks提供了基于 OpenLayers 的API封装。

## getTargetId

获取地图容器的id，地图容器为`<div>`元素。(唯一性`id`)。


```typescript
const { getTargetId } = useMap('id');
console.log('id', getTargetId());
```


## getInstance

获取地图实例，地图实例为`ol.Map`对象。


```typescript
const { getInstance } = useMap('id');
console.log('地图实例', getInstance());
```


## addMarker

创建点位，点位为`ol.Feature`对象。根据图层名称、点位数据、点位样式创建点位。其中点位样式为`ol.style.Style`对象。



| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| data        | Array       | 数据格式为数组对象        |
| options     | LayerOptions['Point'] | 配置项 |


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
    zIndex: 10,
    lonLabel: 'lon',
    latLabel: 'lat',
})
```



## createLayer

创建矢量图层，图层为`ol.layer.Vector`对象。根据图层名称、点位数据、点位样式创建点位。其中点位样式为`ol.style.Style`对象。其中配置项`type`字段支持`Point、GeoJSON、LineString、Polygon、Circle、MultiLineString、MultiPolygon`等类型，不同类型`data`数据结构不一样, `addMarker`就是这个方法type为`Point`的一个封装。



| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| layerName   | String      | 图层名称       |
| data        | Array       | 数据格式为数组对象        |
| options     | LayerOptions['Point'] | 配置项 |


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
    zIndex: 10,
    lonLabel: 'lon',
    latLabel: 'lat',
})
```
