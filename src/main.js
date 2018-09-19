// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import VCharts from 'v-charts'
import yarn from './views/yarn/yarn'
import yarn2 from './views/yarn/yarn2'
import hdfs from './views/hdfs/hdfs'
// import login from './views/login/login'
import 'font-awesome/css/font-awesome.min.css';
import Mock from './mock/mock';

import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import qs from 'qs';

/* eslint-disable */

import store from './store/store'
import axios from './store/http'
Vue.prototype.axios = axios;
Vue.prototype.qs = qs;
Mock.mockData();
Vue.use(VueRouter);// 安装路由功能
/* eslint-disable no-new */
Vue.use(ElementUI);
Vue.use(VCharts)
let routes = [
  {
    path: '/',
    component: App,
    children: [
      {path: '/yarn', component: yarn, name: 'Yarn', class: 'fa-plug', hidden: true,meta:{requireAuth:true}},
      {path: '/yarn2', component: yarn2, name: 'Yarn', class: 'fa-plug',meta:{requireAuth:true}},
      {path: '/hdfs', component: hdfs, name: 'Hdfs', class: 'fa-plug',meta:{requireAuth:true}},
    ]
  },
  {
    path: '/yarn2',
    component: resolve => require(['./views/yarn/yarn2'], resolve)
  },
];
let router = new VueRouter({
  'mode': 'history', //去掉URL的#号，需要配置服务器http://router.vuejs.org/zh-cn/essentials/history-mode.html
  'linkActiveClass': 'active',
  routes
});
// import  $ from 'jquery'
// 后端对比cookies判断是否登录，凡接口response的header带有x-auth-token的即未登录，跳转首页。
// Vue.http.interceptors.push((request, next) => {
//   request.credentials = true;
//   next((response) => {
//     let messageHeader;
//     /* global IS_PRODUCTION:true */
//     if (IS_PRODUCTION) {
//       messageHeader = "X-Auth-Token";
//     } else {
//       messageHeader = "x-auth-token";
//     }
//     if (messageHeader in response.headers.map) {
//       router.push({path: '/login'});
//     }
//     return response
//   });
// });
// axios.interceptors.request.use(
//   data => {
//     console(data.baseURL)
//   }
// )
//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     // const user = JSON.parse(sessionStorage.getItem('user'));
//     // sessionStorage.setItem('user',"hushenmin")
//     const user = sessionStorage.getItem('user');
//
//     // console.log(to)
//     console.log(user)
//     if (user === null && to.path !== '/login') {
//       next('/login')
//     } else {
//       next()
//     }
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.accessToken) {
      next();
    }
    else {
      if (to.query.tokens) {
        store.commit('login', {accessToken: to.query.tokens.split("__")[0], tokenType: 'accessToken'});
        store.commit('login', {refreshToken: to.query.tokens.split("__")[1], tokenType: 'refreshToken'});
        next()
      } else {
        window.location.href = store.state.loginUrl + window.location.href + to.fullPath.slice(1)
      }
    }
  }
  else {
    next();
  }
})

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('accessToken') && window.localStorage.getItem('refreshToken')) {
  store.commit("login", {accessToken: window.localStorage.getItem('accessToken'), tokenType: 'accessToken'})
  store.commit("login", {refreshToken: window.localStorage.getItem('refreshToken'), tokenType: 'refreshToken'})
}


// eslint-disable-next-line
/* eslint-disable */
let app = new Vue({
  router,
  store,
  axios
}).$mount('#app');
export default app;
