这是一个简单的 sse sdk。做了非常简单的封装，方便开发人员使用

## Quick Start

```js
import SSESdk from 'sse-client-sdk'

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

import SSEClient from 'sse-client-sdk'

const sse = new SSEClient(url, options)

function Example() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    sse.subscribe('message', data => {
      setCount(data)
    })
    
    return () => {
      sse.unsubscribe()
    }
  }, [])
  
  return <div>{count}</div>
}

```

## API
- retry

重试次数

- interval

重试的间隔时间

## Example

```shell
git clone https://github.com/qinghuanI/sse-client.git

cd sse-clinet/example

node server.js
open index.html in chrome browser
```

## Contributing
Please see our [CONTRIBUTING.md](./CONTRIBUTING.md)

## License
[MIT](./LICENSE)
