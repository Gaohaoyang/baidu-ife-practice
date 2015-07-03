# 关于这个仓库

这里是用来存放我在做百度前端任务的练习代码。

关于百度前端学院的详情请点击这里：[https://github.com/baidu-ife/ife](https://github.com/baidu-ife/ife)

---

## 说明

前两个任务的代码已经写到fork的仓库中了，如下：

* [task0001](https://github.com/Gaohaoyang/ife/tree/master/task/task0001/work/Gaohaoyang)
* [task0002](https://github.com/Gaohaoyang/ife/tree/master/task/task0002/work/Gaohaoyang)

但是我同时又拷贝了一份到这个仓库，因为改变了提交作业的方法之后，还是用自己的仓库比较方便。

## task0001

深入学习了HTML、CSS。深刻理解了 CSS 布局和 BFC 技术。

最终实现了一个博客页面的展示。

* [任务要求](https://github.com/baidu-ife/ife/tree/master/task/task0001)
* [在线 demo](http://gaohaoyang.github.io/ife/task/task0001/work/Gaohaoyang/index.html)
* [我的笔记-HTML, CSS基础](http://gaohaoyang.github.io/2015/04/15/baidu-ife-1/)

## task0002

学习 JavaScript。

自己封装了一个 util.js 工具库，包含深度克隆、数组去重、添加删除 CSS 样式、简单 Query、封装 Ajax 等功能。

后面的练习中实现了兴趣列表、倒计时、图片轮播、输入框即时提示、拖拽交互等任务。

* [任务要求](https://github.com/baidu-ife/ife/tree/master/task/task0002)
* [我的笔记-JavaScript 基础](http://gaohaoyang.github.io/2015/04/22/baidu-ife-2-javascript/)
* [在线 Demo](http://gaohaoyang.github.io/ife/task/task0002/work/Gaohaoyang/index.html)

## task0003

任务三实现了一个 ToDo 的单页应用。

使用 localStorage 存储数据，JSON 模拟数据表，实现了分类和待办状态的改变，具有良好的交互体验。

* [任务要求](https://github.com/baidu-ife/ife/tree/master/task/task0003)
* [在线 Demo](http://gaohaoyang.github.io/baidu-ife-practice/task0003/)
* [笔记](http://gaohaoyang.github.io/)

## task0004

任务四是将任务三的 ToDo 应用优化，以适应移动端设备。

为了便于管理，我单独开了一个仓库用来放 ToDo 手机适配版的代码。

仓库见这里：[https://github.com/Gaohaoyang/ToDo-WebApp](https://github.com/Gaohaoyang/ToDo-WebApp)

### ToDo WebApp Version

* [任务四要求](https://github.com/baidu-ife/ife/tree/master/task/task0004)
* [源代码](https://github.com/Gaohaoyang/ToDo-WebApp)
* [在线 demo](http://gaohaoyang.github.io/ToDo-WebApp/)
* 手机查看 ↓ 二维码 ↓
    
    ![todoWebApp](http://7q5cdt.com1.z0.glb.clouddn.com/task4-code-todoWebApp.png)
* [版本更新日志](https://github.com/Gaohaoyang/ToDo-WebApp/releases)
* [我的博客 HyG](http://gaohaoyang.github.io)

### Details

* **数据存储**

    以 JSON 模拟数据表的形式存储于 LocalStorage 中

         使用数据库的思想，构建3张表。
         cateJson 分类
         childCateJson 子分类
         taskJson 任务
         
         分类表 cate
         ----------------------
         id* | name | child(FK)
         ----------------------
         
         子分类表 childCate
         --------------------------------
         id* | pid(FK) | name | child(FK)
         --------------------------------
         
         任务表 task
         ----------------------------------------------
         id* | pid(FK) | finish | name | date | content
         ----------------------------------------------

* **使用 `Sass` 重构了 CSS 代码**
    
    使用分块、继承等方式，使得代码更加清晰明了。

* **响应式布局**
    
    针对手机端细节做了很多调整，更符合手机上的视觉交互习惯。

* **加入页面切换效果**
    
    使用 `translate3d()`，纯 CSS3 切换动画效果。

* **处理了 XSS 防护**
    
    对可能造成破坏的字符进行转码。

* **性能优化**
    
    使用 CDN 处理静态资源 fontAwesome，压缩静态资源等

* **模块化**
    
    使用 requireJS 模块化 JavaScript 代码。重构 JavaScript 代码。优化之前写的耦合性高的绑定事件，重新绑定事件，降低耦合性。期间根据具体需求重写了事件代理的代码。

* **前端工程化**
    
    使用 gulp，自动编译 Sass，压缩 CSS 和 JavaScript 代码。并且配置了自动流程。

