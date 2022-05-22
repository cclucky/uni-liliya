
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import $http from './utils/index.js'
import store from '@/store/store.js'

uni.$http = $http
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  });
   // 判断请求的是否为有权限的 API 接口
    if (store.state.m_user.token) {
      // 为请求头添加身份认证字段
      options.header = {
        // 字段的值可以直接从 vuex 中进行获取
        Authorization: store.state.m_user.token,
      }
    }
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}
//封装弹窗的方法
uni.$showMsg = function(title='数据加载中ing',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif