import Vue from 'vue'
import Vonic from 'vonic'

//// Page Components
//import Index from './components/Index.vue'
//import About from './components/About.vue'
//
//// Routes
//const routes = [
//{ path: '/', component: Index },
//{ path: '/about', component: About }
//]


import './iconfont/iconfont.css'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

//文件上传
const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)

//Vue.use(VueRouter)
Vue.component('VueSlider', VueSlider)


//import 'vonic/vonic.min.css'
//import 'vonic/vonic.min'

// Page Components
import Index from './components/Index.vue'
import historypage from './components/history.vue'
import push from './components/push.vue'
// Routes
const routes = [
  { path: '/', component: Index },
  { path: '/history', component: historypage },
   { path: '/push', component: push }
]
 

Vue.use(Vonic.app, {
  routes: routes
})
