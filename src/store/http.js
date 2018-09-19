/* eslint-disable */
import axios from 'axios'
import store from './store'
import qs from 'qs'
// import router from './router'

// axios 配置
axios.defaults.timeout = 5000

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers['token'] = `${store.state.accessToken}`
    config.headers['tokenType'] = 'accessToken'
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error.response.data === "accessTokenCacheExpired") {
            console.log("accessTokenCacheExpired失效啦")
                // accessToken过期,系统自动通过refreshToken 获取最新accessToken
            refreshToken();
          } else if (error.response.data === "error" || error.response.data === "refreshTokenCacheExpired") {
                // token 校验失败,重新登录
            store.commit("logout")
            window.location.href = store.state.loginUrl + window.location.href
          }
      }
    }
    return Promise.reject(error)
  },
)

function refreshToken() {
  console.log("refreshToken调用啦")
  axios.post('/token/refreshToken', qs.stringify({refreshToken: `${store.state.refreshToken}`})
    ).then(response => {
      if (response.data.code === 'OK') {
        store.commit("login", {accessToken: response.data.data.split("__")[0], tokenType: 'accessToken'});
        store.commit("login", {refreshToken: response.data.data.split("__")[1], tokenType: 'refreshToken'});
      }
    }).catch(error => {
      console.log(error);
    });
}

export default axios

