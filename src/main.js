import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import Pay from './routes/Pay.vue';
import { Store } from './data/store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(BootstrapVue)
Vue.use(Vuex)

const routes = [
  { path: '/pay', component: Pay },
  //{ path: '/cart', component: Cart },
  //{ path: '/create/trip', component: CreateTrip },
  //{ path: '/search/event', component: SearchEvent },
  //{ path: '/search/property', component: SearchProperty },
  //{ path: '/register/property', component: RegisterProperty },
  //{ path: '/register/user', component: RegisterUser },
];

const router = new VueRouter({
  routes
});

const store = new Vuex.Store(Store);

// Start app
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app');
