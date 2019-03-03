/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
NProgress.configure({ showSpinner: false })
NProgress.configure({ easing: 'ease', speed: 500 })
Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
let theme = window.localStorage.getItem('matchColorType') ? window.localStorage.getItem('matchColorType') : 'envision-theme'
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/envision', component: _import('common/login'), name: 'envision-theme', meta: { title: '登录' } },
  { path: '/ats', component: _import('common/login'), name: 'ats-theme', meta: { title: '登录' } }
]
let routes = []
// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    // { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } }
     //{ path: '/contactsList', component: _import('modules/stationHandOver/stepNo1/contacts/contactsTab'), name: 'contactsList', meta: { title: 'aa' } }
  ],
  beforeEnter (to, from, next) {
    NProgress.start()
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      // store.commit('common/updateMatchColorsType', theme)
      next({name: store.state.common.matchColorsType}) // login
      clearLoginInfo()
    } else {
      // store.commit('common/updateMatchColorsType', theme)
      next()
      NProgress.done()
    }
  }
}
const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})
let settingsRoute = {
  path: 'sys-settings',
  component: _import('modules/sys/settings'),
  name: 'sys-settings',
  meta: {
    title: '设置',
    isDynamic: true,
    isTab: false,
    iframeUrl: ''
  }
}

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  // next()
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then((res) => {
      if (res && res.data && res.data.code === 0) {
        let data = res.data
        let _menuList = JSON.parse(JSON.stringify(data.menuList)) // 用于菜单
        let __menuList = JSON.parse(JSON.stringify(data.menuList)) // 用于导航
        formatList(_menuList) // 格式化为菜单格式
        formatData(__menuList) // 格式化为 生成路由 格式
        buildRoute(__menuList, mainRoutes.children) // 生成路由
        let _routesArr = []
        routes.forEach(item => {
          item.children.forEach(list => {
            _routesArr.push(list)
          })
        })
        let _menuArr = [].concat(mainRoutes.children, _routesArr)
        sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(_menuArr || '[]'))
        mainRoutes.children.push(settingsRoute)
        mainRoutes.children.push({path: 'sys-news', component: _import('modules/sys/news'), name: 'sys-news', meta: { title: '告警' }})
        router.addRoutes([
          mainRoutes,
          ...routes,
          {path: '*', redirect: {name: '404'}}
        ])
        // fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        // sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('menuList', JSON.stringify(_menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      // store.commit('common/updateMatchColorsType', theme)
      router.push({ name: store.state.common.matchColorsType }) // login
      clearLoginInfo()
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}
function formatData (arr) {
  arr.forEach(item => {
    if (!item.url && item.list && item.list.length > 0) {
      formatData(item.list)
    } else if (item.url && item.list && item.list.length > 0) {
      let _item = JSON.parse(JSON.stringify(item))
      _item.list = null
      _item.name = ''
      _item.cFlag = 1
      item.list.push(_item)
      item.component = 'main'
      // item.url = 'parentComponent/index'
      formatData(item.list)
    } else if (item.url && item.list && item.list.length === 0) {
      item.list = null
    }
  })
}
function buildRoute (menuList = [], _routes = []) {
  for (let i = 0; i < menuList.length; i++) {
    let temp = []
    if (menuList[i].type !== 0 && menuList[i].url) {
      let route = {
        path: menuList[i].url.replace(/\//g, '-'),
        component: null,
        name: menuList[i].url.replace(/\//g, '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: false,
          iframeUrl: ''
        }
      }
      if (menuList[i].cFlag && menuList[i].cFlag === 1) {
        route.name = 'c' + route.name
        route.path = 'c'
      }
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        if (menuList[i].component && menuList[i].component === 'main') {
          try {
            route.component = _import('modules/parentComponent/index')
          } catch (e) {
          }
          route.redirect = {name: 'c' + route.name}
          route.children = []
          let _route = route.children
          _routes.push(route)
          buildRoute(menuList[i].list, _route)
        } else {
          try {
            route.component = _import(`modules/${menuList[i].url}`) || null
            _routes.push(route)
          } catch (e) {
          }
        }
      }
    } else if (menuList[i].type === 0 && menuList[i].list && menuList[i].list.length > 0) {
      temp = [].concat(menuList[i].list)
      let obj = {
        path: `${menuList[i].url}`,
        component: _import('main'),
        name: `${menuList[i].url}`,
        redirect: { name: 'sys-user' },
        meta: {title: menuList[i].name},
        children: [ ],
        beforeEnter (to, from, next) {
          NProgress.start()
          let token = Vue.cookie.get('token')
          if (!token || !/\S/.test(token)) {
            // store.commit('common/updateMatchColorsType', theme)
            next({ name: store.state.common.matchColorsType }) // login
            clearLoginInfo()
          }
          // store.commit('common/updateMatchColorsType', theme)
          next()
          NProgress.done()
        }
      }
      if (temp.length > 0) {
        let name = temp[0].url.replace('/', '-')
        obj.redirect = {name: name}
      }
      routes.push(obj)
      buildRoute(temp, obj.children)
    }
  }
}
function formatList (arr) {
  arr.forEach(item => {
    if (item.type === 1) {
      item.list = null
    } else if (item.list && item.list.length > 0) {
      formatList(item.list)
    }
  })
}

router.afterEach(() => {
 // NProgress.done() // finish progress bar
})

export default router
