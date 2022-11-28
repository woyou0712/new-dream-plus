# new-dream
[Git地址](https://github.com/woyou0712/new-dream-plus)
[讨论QQ群：666713758](https://jq.qq.com/?_wv=1027&k=EoWu8K9d)
```
为VUE3量身定制的一款弹窗类UI组件,不依赖任何第三方组件库,简单轻便
```
# 更新
## 2.2.*
- 为`Win`类添加可配置静态属性`defaultContentBox`
- 为`Message`类添加可配置静态属性`defaultContentBox`
- 为`defaultContentBox`类添加可配置静态属性`defaultContentBox`
- `defaultContentBox`：顶级弹窗盒子（默认为`document.body`）

- 优化`Win`实例属性的可访问性，将`config`更新为可访问属性
- 优化`Win`实例属性的可访问性，将`status`更新为可访问属性
- 优化`Win`实例属性的可访问性，将`zIndex`更新为可访问属性
## 2.3.*
- 右键菜单支持绑定多个元素（数组内元素应为兄弟关系）
```
new Menu(el: HTMLElement | HTMLElement[],options)
```
# HTML使用
- 参考`demo`下的使用方法

# VUE3使用
## 安装
```
$ npm install -S new-dream-plus
```
## 引入css
- main.js
```
import "new-dream-plus/dist/index.css"
```

## 弹窗
### `Win`全局配置
key | 必须| 类型 | 描述 | 默认值
-- | -- | -- | -- | --
showMiniList | 否 | boolean | 是否显示最小化列表 | true
```
import { Win } from "new-dream-plus"
// 是否显示最小化列表
Win.showMiniList = false
// 顶级弹窗盒子
Win.defaultContentBox = document.body
// 其他默认配置项
import { defaultConfig } from 'new-dream/src/Win';
import createElement from 'new-dream/src/utils/createElement';
import img from "@/assets/logo/logo.png"
const logo = createElement({ name: "img" });
logo.setAttribute("src", img)
defaultConfig.icon = logo
defaultConfig.title = "财合税"
```
### 弹出窗口
- `close`方法不支持链式操作
- 其余所有方法均支持链式操作
```
import { Win } from "new-dream-plus"
const app = new Win(options)

app.onmounted(()=>{
  // 窗口第一次加载完成回调函数
})
app.ontop(()=>{
  // 窗口置顶回调
})
app.onmove(()=>{
  // 窗口移动结束回调
})
app.onmax(()=>{
  // 窗口最大化切换回调
})
app.onmini(()=>{
  // 窗口最小化切换回调
})
app.onclose(()=>{
  // 窗口关闭回调
})
// 窗口置顶
app.setTop();
// 切换最小化
app.setMini();
// 切换最大化
app.setMax();
// 关闭窗口
app.close();
```
#### options
key | 必须| 类型 | 描述 | 默认值
-- | -- | -- | -- | --
url | 是 | string | 要打开的网页地址，与`component`二选一 | "http://www.bauble.vip"
component | 是 | DefineComponent | 要打开的VUE组件，与`url`二选一 | undefined
parentId | 否 | string | 父窗口ID | undefined
id | 否 | string | 要打开的窗口ID | 随机分配ID
title | 否 | string | 窗口标题 | "新窗口"
width | 否 | string | 窗口宽 | "800px"
height | 否 | string | 窗口高 | "600px"
miniBtn | 否 | boolean | 是否显示最小化按钮 | false
maxBtn | 否 | boolean | 是否显示最大化按钮 | false
resize | 否 | boolean | 窗口是否可缩放 | false
icon | 否 | string/HTMLImageElement | 窗口图标 | svg string
props | 否 | { [key:string] : any } | 打开VUE组件时，所需要的`props`参数 | undefined

- 若是大开VUE组件，没有指定`options`可选配置项时，会优先使用组件自带的配置项
- 组件定义默认配置项示例
```
<script>
export default{
  title:"这是一个窗口",
  width:"600px",
  height:"400px"
  ......
}
</script>
```
## 右键菜单
```
import { Menu } from "new-dream-plus";
new Menu(HTMLElement, options[])
```
### options
key | 必须 | 类型 | 描述
-- | -- | -- | -- 
id | 是 | string/number | 菜单选项ID 
icon | 否 | string/HTMLImageElement | 菜单选项图标 
name | 是 | string | 菜单选项名称 
method | 是 | function | 菜单选项回调

- 示例
```
<div
  style="
    width: 600px;
    height: 600px;
    border: 1px solid #aaa;
    margin: 10px auto;
    text-align: center;
  "
  id="menu-box"
>
  尝试在此区域内设置点击鼠标右键
</div>

<script lang="ts" setup>
onMounted(()=>{
  const menuBox = document.getElementById
  if(!menuBox){return}
  new Menu(menuBox, [
    {
      id: 1,
      name: "查看(V)",
      method: function () {
        console.log("你点击了【查看】")
      }
    },
    {
      id: 2,
      name: "排序方式(O)",
      method: function () {
        console.log("你点击了【排序方式】")
      }
    },
    {
      id: 3,
      name: "刷新",
      method: function () {
        console.log("你点击了【刷新】")
      }
    },
  ])
})
</script>
```

### 注册为VUE指令
```
import NewDreamPlus from "new-dream-plus"
createApp(App).use(NewDreamPlus).mount('#app')
```
- 示例
```
<div
  style="
    width: 600px;
    height: 600px;
    border: 1px solid #aaa;
    margin: 10px auto;
    text-align: center;
  "
  v-Rclick="options[]"
>
  尝试在此区域内设置点击鼠标右键
</div>
```


## 轻提示
```
import { Message } from "new-dream-plus";
// 用法1
new Message("info text");
// 用法2
new Message({ msg: "error text", type: "error" })
// 用法3
Message.success("success text")
```
## 消息确认框
```
new MessageBox(string | options)
  .submit(() => {
    console.log("继续")
  }).cancel(() => {
    console.log("取消")
  })
```
### options
key | 必须 | 描述 | 默认值
-- | -- | -- | --
msg | 是 | 弹窗消息 | "确认消息"
title | 否 | 弹窗标题 | "提示"
cancelName | 否 | 取消按钮文字 | "取消"
submitName | 否 | 确认按钮文字 | "确定"

## 截图
```
<template>
  <div class="home">
    <button @click="slictWin">截图</button>
    <img :src="imgdata">
  </div>
</template>
<script lang="ts" setup>
  import { Screen } from "new-dream-plus"
  const s = new Screen();
  const imgdata = ref("");
  function slictWin() {
    s.start().onsuccess((data) => {
      console.log(data)
      if (data) {
        imgdata.value = data
      }
    })
  }
</script>
```


# VUE示例代码
```
<template>
  <div class="home">
    <button @click="showWin">窗口1</button>
    <button @click="showSon">窗口1的子窗口</button>
    <div id="menu-box" style="
        width: 600px;
        height: 600px;
        border: 1px solid #aaa;
        margin: 10px auto;
        text-align: center;
      ">
      尝试在此区域内设置点击鼠标右键
    </div>
    <button @click="showMsg">info轻消息</button>
    <button @click="showMsgError">error轻消息</button>
    <button @click="showMsgSuccess">success轻消息</button>
    <button @click="showMsgBox">确认提示框</button>
  </div>
</template>

<script lang="ts" setup>
import { Message, MessageBox, Win, Menu } from "new-dream-plus";
import HelloWorld from "@/components/HelloWorld.vue";
import { onMounted } from "@vue/runtime-core";
function showWin() {
  new Win({
    id: "win-01",
    title: "不知道是干什么的窗口",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    width: "600px",
    height: "500px",
    component: HelloWorld,
    props: {
      msg: "Hello World",
    },
  })
    .onmounted((e) => {
      console.log(e);
    })
    .onclose(() => {
      console.log(Win.WinIdMap);
    });
}

function showSon() {
  new Win({
    parentId: "win-01",
    title: "不知道是干什么的窗口",
    url: "http://bauble.vip",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    width: "500px",
    height: "300px",
  })
    .onmounted((e) => {
      console.log(e);
    })
    .onclose(() => {
      console.log(Win.WinIdMap);
    });
}

onMounted(() => {
  const menuBox = document.getElementById("menu-box")
  if(!menuBox){return}
  new Menu(menuBox, [
    {
      id: 0,
      icon: `<svg t="1664646175246" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
p-id="24565">
<path
  d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z"
  fill="#FFE9B4" p-id="24566"></path>
<path d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z"
  fill="#FFB02C" p-id="24567"></path>
<path
  d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z"
  fill="#FFCA28" p-id="24568"></path>
</svg>`,
      name: "新建文件夹",
      method: function () {
        console.log("你点击了【新建文件夹】")
      }
    },
    {
      id: 1,
      name: "查看(V)",
      method: function () {
        console.log("你点击了【查看】")
      }
    },
    {
      id: 2,
      name: "排序方式(O)",
      method: function () {
        console.log("你点击了【排序方式】")
      }
    },
    {
      id: 3,
      name: "刷新",
      method: function () {
        console.log("你点击了【刷新】")
      }
    },
    {
      id: 4,
      icon: `<svg t="1664646671674" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
p-id="5280" >
<path
  d="M960 80H64c-35.3 0-64 28.6-64 64v576c0 35.3 28.7 64 64 64h312c4.4 0 8 3.6 8 8v84c0 2.2-1.8 4-4 4h-60c-17.7 0-32 14.3-32 32v32h448v-32c0-17.7-14.3-32-32-32h-60c-2.2 0-4-1.8-4-4v-84c0-4.4 3.6-8 8-8h312c35.3 0 64-28.7 64-64V144c0-35.4-28.7-64-64-64zM576 876c0 2.2-1.8 4-4 4H452c-2.2 0-4-1.8-4-4v-52c0-4.4 3.6-8 8-8h112c4.4 0 8 3.6 8 8v52z m384-172c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-44c0-2.2 1.8-4 4-4h888c2.2 0 4 1.8 4 4v44z"
  p-id="5281" fill="#1296db"></path>
</svg>`,
      name: "显示设置",
      method: function () {
        console.log("你点击了【显示设置】")
      }
    },
    {
      id: 4,
      icon: `<svg t="1664646621764" class="icon" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
p-id="4311">
<path d="M320 768H0V0h834v64H64v640h256z" fill="#727272" p-id="4312"></path>
<path d="M0 832h1024v192H0z" p-id="4313"></path>
<path
  d="M1004.3 83.8c-26.4-26.4-68.9-26.4-95.2 0l-47.6 47.8 95.2 95.5 47.6-47.7c26.3-26.5 26.3-69.2 0-95.6zM812.4 178.8L526.8 465.2l95.2 95.5 285.6-286.4zM384 704l190.4-95.5-95.2-95.5z"
  fill="#5280C1" p-id="4314"></path>
</svg>`,
      name: "个性化",
      method: function () {
        console.log("你点击了【个性化】")
      }
    },
  ])
})

function showMsg() {
  new Message("hello world");
}
function showMsgError() {
  Message.error("error");
}
function showMsgSuccess() {
  Message.success("success");
}

function showMsgBox() {
  new MessageBox("这是一个确认框")
    .cancel(() => {
      console.log("点击了取消按钮");
    })
    .submit(() => {
      console.log("点击了确定按钮");
    });
}
</script>

<style lang="scss">
.home {
  padding: 20px;
}

button+button {
  margin-left: 10px;
}
</style>
```