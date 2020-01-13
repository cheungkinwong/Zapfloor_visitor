window.currentLang = 'en';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from "./i18n.js";

import api from '@/api/zfhq_api_base'
window.zfhq_api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
