/**
 * 处理 移动设备上的 点击、长按、左右上下滑动 事件
 *
 * =========================================
 * 导出了7个自定义指令：
 *  v-tap： tap点击事件
 *  v-swipe： swipe滑动事件
 *  v-swipeleft： swipeleft左滑事件
 *  v-swiperight： swiperight右滑事件
 *  v-swipedown： swipedown下滑
 *  v-swipeup： swipeup上滑
 *  v-longtap： longtap长按
 * =========================================
 *
 * =========================================
 * 包含四个参数
 * stop 阻止冒泡
 * prevent 阻止默认事件
 * self 只当在 event.target 是当前元素自身时触发处理函数
 * once 执行一次后解绑
 *
 * @example v-tap.stop.prevent.self.once
 * =========================================
 *
 * =========================================
 * 事件绑定有两种方式
 * @example
 *  1. v-tap="showDialog" 绑定一个方法对象
 *  2. v-tap="{fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}"
 *      绑定一个JSON字面量，fn是执行的方法，后边的是需要传递的参数
 * 事件回调参数
 * @param 第一个参数是event，事件对象
 * @param 第二个参数是 binding.value，也就是v-tap=""双引号中的部分（如示例2，第二个参数就是 {fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}）
 * =========================================
 *
 * @update
 *  1. 根据MUI进行了滑动事件的判断修正
 *  2. 根据TouchEvent修正了点击位置的判断
 *
 */

import Vue from 'vue';

/**
 * vue上点击事件处理类
 */

