import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import Cart from './routes/Cart.vue';
import { Store } from './data/store';
import { Routes } from './data/appData';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(BootstrapVue)
Vue.use(Vuex)

const router = new VueRouter({
  routes: Routes
});

const store = new Vuex.Store(Store);

// Start app
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app');
