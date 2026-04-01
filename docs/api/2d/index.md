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
import { onMapReady } from 'jgis/2d';

onMapReady('id', (ctx) => {
    // 此时确认地图已挂载完成，ctx.getInstance() 等一定有效
    ctx.setZoom(15);
});
```

### getMapContext

获取当前地图绑定的运行时上下文工具。但需要注意的是它返回的是包裹了一层 `Asyncify` 的特化结构。**在该解构下调用里面的所有方法返回全部都会变成 Promise 结构（等待其 resolve 后才能获取真值）**。

**参数**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| id   | String      | 创建地图容器时的唯一 ID      |

**返回值**
返回 `Asyncify<MapContext>`。

**示例代码：**
```typescript
import { getMapContext } from 'jgis/2d';

const asyncCtx = getMapContext('id');
// 取值变为异步链式调用防止卡死
asyncCtx.getZoom().then(zoom => console.log('当前在', zoom))
```

### getMapContextAsync

最直观好用的顶层异步查找方法。返回包裹了原生态所有 `MapContext` 方法集合组合的 Promise 对象，使用 `await` 解组后和 `useMap` 使用上毫无差别。

**参数**

| Name        | Type        | Description   |
| ----------- | ----------- |----------- |
| id   | String      | 创建地图容器时的唯一 ID      |

**返回值**
返回 `Promise<MapContext>`。

**示例代码：**
```typescript
import { getMapContextAsync } from 'jgis/2d';

async function locateUser() {
    // 等到系统初始化完了之后拿出来用
    const { flyTo } = await getMapContextAsync('id');
    flyTo([104.06, 30.65], { zoom: 16 });
}
```