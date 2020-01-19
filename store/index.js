import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    openid: '',
    /**
     * 是否需要强制登录
     */
    forcedLogin: false,
    hasLogin: false,
    userName: ""
  },
  mutations: {
    SET_OPENID(state, openid) {
      state.openid = openid
    },
    login(state, userName) {
        state.userName = userName || '新用户';
        state.hasLogin = true;
    },
    logout(state) {
        state.userName = "";
        state.hasLogin = false;
    }
  }
})

export default store
