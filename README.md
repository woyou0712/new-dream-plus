# new-dream
[Git地址](https://github.com/woyou0712/new-dream-plus)
```
为VUE3量身定制的一款弹窗类UI组件,不依赖任何第三方组件库,简单轻便
```
## 安装

- 从Git获取项目 https://github.com/woyou0712/new-dream-plus
- 放入`src`目录下

```
## 全局注册
- 在main.js中引入

```
import { createApp } from 'vue'
import App from './App.vue'


import NewDreamPlus from "@/new-dream-plus/index.js";


createApp(App).use(NewDreamPlus).mount('#app');

```
### 弹窗
- 弹出一个VUE组件
```
import VueComponent from "@/components/test.vue"

export default{
  data(){
    return {
      myApp:null
    }
  },
  methods:{
    // 打开一个VUE窗口
    openWin(){
      this.myApp = new this.Win({
        id: "appid", // String [default rendom]
        parentId:null, // String [default null]
        title: "窗口标题", // String [default '新窗口']
        width: "800px", // String [default '800px']
        height: "600px", // String [default '600px']
        miniBtn: true, // 是否显示最小化按钮 Boolean [default true]
        maxBtn: true, // 是否显示最大化按钮 Boolean [default true]
        resize: true, // 窗口是否可缩放 Boolean [default true]
        component: VueComponent, // 要弹出的VUE组件
        props:{}, // 组件传参
      }).onmounted((app) => {
        console.log("窗口打开成功",app)
      }).ontop((app) => {
        console.log("窗口已经置顶", app)
      }).onmini((app) => {
        console.log("窗口已经最小化", app)
      }).onmax(app => {
        console.log("窗口最大化", app)
      }).onclose(app => {
        console.log("窗口已经关闭", app)
      })
    },
    closeWin(){
      this.myApp.close(); // 触发事件关闭窗口
    }
  }
}
```
- 弹出一个网页
```
new this.Win({
  id: "appid", // String [default rendom]
  parentId:null, // String [default null]
  title: "窗口标题", // String [default '新窗口']
  width: "800px", // String [default '800px']
  height: "600px", // String [default '600px']
  miniBtn: true, // 是否显示最小化按钮 Boolean [default true]
  maxBtn: true, // 是否显示最大化按钮 Boolean [default true]
  resize: true, // 窗口是否可缩放 Boolean [default true]
  url: "http://www.baidu.com", // 网站URL
}).onmounted((app) => {
  console.log("窗口打开成功",app)
}).ontop((app) => {
  console.log("窗口已经置顶", app)
}).onmini((app) => {
  console.log("窗口已经最小化", app)
}).onmax(app => {
  console.log("窗口最大化", app)
}).onclose(app => {
  console.log("窗口已经关闭", app)
})
```
### 右键
- 简单使用
```
<template>
  <div v-Rclick>右键点我</div>
</template>
```
- 自定义菜单
```
<template>
  <div v-Rclick="HomeMenu" data-key="1" data-data="2">右键点我</div>
</template>

<script>
export default {
  setup(){
    const HomeMenu = [
      {
        icon: null,
        name: "打印data-key",
        fn: (el)=>{
          console.log("data-key",el.getAttribute("data-key"))
        }
      },
      {
        icon: null,
        name: "打印data-data",
        fn: (el)=>{
          console.log("data-data",el.getAttribute("data-data"))
        }
      },
    ]
  }
}
</script>
```

## 局部使用
- 弹窗
```
import { Win } from "@/new-dream-plus/index.js"
export default{
  methods:{
    openApp(){
      new Win(options)
    }
  }
}

```
- 右键
```
import { Rclick } from "@/new-dream-plus/index.js"
export default{
  directives: {
    Rclick:Rclick
  }
}
```
