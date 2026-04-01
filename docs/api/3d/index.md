# 三维地图核心 (3D Core)

`jgis/3d` 模块提供了基于 `Cesium` 的轻量级封装。

## useMap

创建一个三维地图实例，并返回为全局上下文。

**参数**
| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| el   | String      | 图层id       |
| options     | MapOptions | 配置项 |

**MapOptions**
| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| terrainUrl   | String      | 地形服务地址       |
| minZoom     | Number | 最小缩放 |
| maxZoom     | Number | 最大缩放 |
| showFrameRate     | Boolean | 是否显示帧率 |
| baseLayers     | BaseLayerOptions | 天地图底图配置 |


**baseLayers**
| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| token   | String      | 天地图token       |
| mapType     | mapType | 天地图类型：'ver' | 'img' | 'ter' |


```typescript
import { useMap } from 'jgis/3d';
const options = {
  terrainUrl: 'http://localhost:8080/terrain',
  minZoom: 0,
  maxZoom: 18,
  showFrameRate: true,
  baseLayers: {
      token: 'your token',
      mapType: 'ver'
    }
}
const { addMarker, removeLayer } =  useMap('id', options);
```