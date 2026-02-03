# 地图交互 (2D Core)

`jgis/2d` 模块提供了基于 OpenLayers 的轻量级封装。

## useMap

初始化一个二维地图实例，并自动注册为全局上下文。


```typescript
function useMap(options: MapOptions): ol.Map
```