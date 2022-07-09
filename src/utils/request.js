import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

//请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    const status = response.status//浏览器返回的状态码
    const code = res.code//后端接口返回的状态码
    const msg = res.message//后端接口返回的消息

    //浏览器错误
    if (status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error'
      })
    } else {
      //浏览器200
      if (code !== 200) {
        //业务错误
        Message({
          message: msg,
          type: 'error'
        })
      } else {
        //浏览器和业务都是200
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
