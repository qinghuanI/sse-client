this is a simple sse sdk


## usages

```js
import SSESdk from '@qinghuani/sse-client'

// SSESdk 实例化
const SSE = new SSESdk(url, options);

// 订阅来自服务端的消息
SSE.subscribe("message", (data) => {
  console.log("receive message from server", data);
});

// 取消订阅
SSE.unsuscribe();
```

## 在 React 中使用
  
```jsx

```
