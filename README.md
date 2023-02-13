# ChatGPT-API-Server

实现简单的openai的key管理，当部署时会自动切换可用api

## 实现特点
1. 以MongoDB为驱动,提供基础的key管理(状态更改，api增加删除,api tokens数统计)
2. tokens计量，当超过阈值时自动关闭状态
3. 随机调用当前可用的key
4. 提供了一个demo


## 如何部署?
准备环境
- MongoDB
- NodeJS


```bash
git clone https://github.com/Nothing1024/chatgpt-api-server
npm install
npm run dev
```

访问 http://localhost:3000 查看demo界面
