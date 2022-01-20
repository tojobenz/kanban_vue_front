import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faEdit,
  faTrashAlt,
  faTimes,
  faPlus,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faEdit, faTrashAlt, faTimes, faPlus, faFilter);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);
import './index.css'
import VueTailwind from 'vue-tailwind'
import {
  TTextarea,
  TSelect,
  TButton,
  TModal,
} from 'vue-tailwind/dist/components';
import "tailwindcss/tailwind.css"
Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

const components = {
  't-textarea': {
    component: TTextarea,
    props: {
      classes: 'border-2 block w-full rounded text-gray-800'
    }
  },
  't-select': {
    component: TSelect,
  },
  't-button': {
    component: TButton,
  },
  't-modal': {
    component: TModal
  }
}

Vue.config.productionTip = false;
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
import platform from "./plugin/plateform";
Vue.use(platform)
Vue.use(Vuex);
Vue.use(VueTailwind, components)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
