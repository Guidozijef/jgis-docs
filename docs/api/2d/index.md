# 二维地图核心 (2D Core)

`jgis/2d` 模块提供了基于 `OpenLayers` 的轻量级封装。

## useMap

初始化一个二维地图实例，并返回为全局上下文。

**参数**
| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| target   | String      | 图层id，跟el一样，传一个就行       |
| projection     | Projection | 坐标系 |
| center     | number[] | 地图中心坐标 |
| zoom      | Number | 当前缩放层级 |
| minZoom     | Number | 最小层级 |
| maxZoom     | Number | 最大层级 |
| baseLayers     | BaseLayerOptions | 天地图底图配置 |

**baseLayers** 
| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| target   | String      | 图层id，跟el一样，传一个就行       |
| mapType     | String |  天地图类型：'ver' | 'img' | 'ter' |
| zIndex      | Number | 图层层级 |
| minZoom     | Number | 天地图最小层级 |
| maxZoom     | Number | 最大层级 |

```typescript
import { useMap } from 'jgis/2d';
const { addMark, removeLayer } =  useMap('id', options);
```