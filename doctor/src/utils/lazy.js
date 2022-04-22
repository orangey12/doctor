import Vue from "vue";
import myJsTools from "./myJsTools";

// 图片懒加载
console.log('vue 引入lazy')
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
let io;
if (!isiOS) {
  io = new IntersectionObserver(arr => {
    arr.forEach(v => {
      // 获取元素
      let img = v.target;
      // 如果出现此元素
      if (v.isIntersecting) {
        // 赋值地址
        console.log(img.dataset.src + "==========img.dataset.src ");
        if (img.dataset.src.indexOf(".png") != -1 && img.dataset.src.indexOf(",") != -1) {
          myJsTools.getUrl(img.dataset.src).then(url => {
            console.log("isandriod" + url)
            img.src = url;
          })
        } else {
          img.src = img.dataset.src;
        }
        // 取消监听
        io.unobserve(img)
      }
    })
  })
}


// 注册一个全局自定义指令 `v-lazy`
Vue.directive('zlazy', {
  inserted(el, binding) {
    // 如果存在图片地址
    if (el.dataset.type == 'jg') {
      el.src = require("../assets/img/index/jg.png");
    } else if (el.dataset.type == 'xyImg') {
      el.src = require("../assets/img/cf/xy.png");
    } else if (el.dataset.type == 'cyImg') {
      el.src = require("../assets/img/cf/cy.png");
    } else {
      el.src = require("../assets/img/my/default.png");
    }
    console.log(binding.value)
    if (binding.value) {
      el.dataset.src = binding.value;
      console.log(isiOS, "isiOS")
      if (isiOS) {
      if (el.dataset.src.indexOf(".png") != -1 && el.dataset.src.indexOf(",") != -1) {
        console.log(el.dataset.src, "isiOS")
        myJsTools.getUrl(el.dataset.src).then(url => {
          console.log("isiOS" + url)
          el.src = url;
        })
      } else {
        el.src = el.dataset.src;
      }
      } else {
        io.observe(el)
      }
    } else {
      // 直接使用默认图片
      console.log('没有图片，替换默认图片')
    }
  }
})
