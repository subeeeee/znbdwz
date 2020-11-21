// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import promise from 'es6-promise'
import '@/assets/iconFont/iconfont.css'
import 'vue-area-linkage/dist/index.css'
import VueAreaLinkage from 'vue-area-linkage'
import '../public.scss'
// import '../element-variables.scss'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import {
  Autocomplete,
  Tree,
  Radio,
  Button,
  Select,
  Option,
  Container,
  Header,
  Aside,
  Main,
  Form,
  FormItem,
  Input,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Row,
  Col,
  RadioGroup,
  RadioButton,
  Dialog,
  Popover,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Pagination,
  Loading,
  Breadcrumb,
  BreadcrumbItem,
  Slider,
  Collapse,
  CollapseItem,
  Tooltip,
  Upload,
  Message,
  MessageBox,
  Notification,
  DatePicker,
  Cascader,
  Steps,
  Step,
  Progress,
  Carousel,
  CarouselItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  ColorPicker,
  Tag,
  Divider,
  Image,
  Switch
} from 'element-ui'
import router from './router'
import store from './store/index'
promise.polyfill()
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.use(Vuex)

Vue.use(Autocomplete)
Vue.use(Tree)
Vue.use(Radio)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(CheckboxButton)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Dialog)
Vue.use(Popover)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Slider)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tooltip)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Cascader)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Progress)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(ColorPicker)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Image)
Vue.use(Switch)

// VueAreaLinkage不属于elementUI
Vue.use(VueAreaLinkage)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$notify = Notification
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
