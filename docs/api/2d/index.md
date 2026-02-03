# 二维地图核心 (2D Core)

`jgis/2d` 模块提供了基于 OpenLayers 的轻量级封装。

## useMap

初始化一个二维地图实例，并返回为全局上下文。

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| el   | String      | 图层id       |
| MapOptions     | MapOptions | 配置项 |


```typescript
import { useMap } from 'jgis/2d';
const { addMark, removeLayer } =  useMap('id');
```