import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";
import { getTimeStamp } from "@/utils/auth";
const TimeOut = 3600; // 定义超时时间

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});
service.interceptors.request.use(
  (config) => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      console.log("检查token");

      if (IsCheckTimeOut()) {
        // 如果它为true表示 过期了
        // token没用了 因为超时了
        console.log("超时了");
        store.dispatch("user/logout"); // 登出操作
        // 跳转到登录页
        router.push("/login");
        return Promise.reject(new Error("token超时了"));
      }

      // 如果token存在 注入token
      config.headers["Authorization"] = `Bearer ${store.getters.token}`;
    }
    return config; // 必须返回配置
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data;
    if (success) {
      return data;
    } else {
      Message.error(message);
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
  }
);

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now(); // 当前时间戳
  var timeStamp = getTimeStamp(); // 缓存时间戳
  let s = (currentTime - timeStamp) / 1000;
console.log(s);
  return s > TimeOut;
}

export default service;
