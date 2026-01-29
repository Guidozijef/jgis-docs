# 二维地图核心 (2D Core)

`jgis/2d` 模块提供了基于 OpenLayers 的轻量级封装。

## createMap2D

初始化一个二维地图实例，并自动注册为全局上下文。

### 类型签名

```typescript
function createMap2D(options: MapOptions): ol.Map