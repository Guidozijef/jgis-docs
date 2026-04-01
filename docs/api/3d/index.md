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

## 全局上下文获取钩子

除了在初始化时直接通过结构 `useMap` 获取到操作方法对象的上下文之外，JGIS 还在该入口内向外部暴露了以下独立函数方法，方便你在应用的其他独立模块下通过绑定时的 `id` 安全、跨组件地取用相关逻辑控制钩子。

### onMapReady

回调等待钩子。用于确保地图上下文已经完全注册并且挂接可用后再去执行相应的业务逻辑函数。

**参数**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| id   | String      | 创建地图容器时的唯一 ID      |
| callback     | Function | `(ctx: MapContext) => void` 地图准备好后触发的回调传参，包含了地图的所有 API 暴露。 |

**示例代码：**
```typescript
import { onMapReady } from 'jgis/3d';

onMapReady('id', (ctx) => {
    // 此时确认地球模型已挂载完成，ctx.getInstance() 等一定有效
    ctx.flyHome();
});
```

### getMapContext

获取当前地图绑定的运行时上下文工具。但需要注意的是它返回的是包裹了 `Asyncify` 的特化结构。**在该解构下调用里面的所有方法返回全部都会变成 Promise 结构（等待其 resolve 后才能拿到真正的返回值）**。

**参数**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| id   | String      | 创建地图容器时的唯一 ID      |

**返回值**
返回 `Asyncify<MapContext>`。

**示例代码：**
```typescript
import { getMapContext } from 'jgis/3d';

const asyncCtx = getMapContext('id');
// 哪怕是不支持 Promise 的底层普通方法也会被封装成响应异步链式调用防止卡死
asyncCtx.getCenter().then(center => console.log('焦点落点海拔', center.cameraZ))
```

### getMapContextAsync

最直观好用的顶层异步查找方法。返回包裹了原生态所有 `MapContext` 方法集合组合的 Promise 对象，使用 `await` 取出后和原本的 `useMap` 解开的一模一样。

**参数**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| id   | String      | 创建地图容器时的唯一 ID      |

**返回值**
返回 `Promise<MapContext>`。

**示例代码：**
```typescript
import { getMapContextAsync } from 'jgis/3d';

async function updateState() {
    // 跨越 Vue 文件也能随时取用所有 API 进行操作
    const { flyTo } = await getMapContextAsync('id');
    flyTo([104.06, 30.65, 3000]);
}
```