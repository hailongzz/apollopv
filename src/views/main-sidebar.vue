<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner"
      @mouseleave="getMousePosition"
      >
      <div class="imgWrap" >
        <!-- <img :src="!sidebarFold?fullImg:'halfImg'" alt=""> -->
        <i v-if="!sidebarFold" class="icon_logo002 sidebarLogo002" ></i>
        <i v-else class="icon_logo001 sidebarLogo001" ></i>
      </div>
      <div :class="['el-menu-wrap',{'el-menu-wrap__fold':sidebarFold} ]"
        ref="elMenu">
        <el-menu
          :default-active="defaultActive || 'home'"
          :collapse="sidebarFold"
          :collapseTransition="false"
          class="site-sidebar__menu">
          <sub-menu
            v-for="(menu, index) in menuList"
            @mouseenter.native="getMousePosition"
            @click.capture.native="getMousePosition"
            :key="menu.menuId"
            :menu="menu"
            :dynamicMenuRoutes="dynamicMenuRoutes">
          </sub-menu>
        </el-menu>
        <div ref="sidebarHoverLine" class="sidebar-nav-hover-line"></div>
      </div>
      <i @click="toggleSidebarFold" :class="['toggleSidebar',{'icon_navigation_spread':sidebarFold}, {'icon_navigation_recovery': !sidebarFold}] " />
    </div>
  </aside>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  import fullImg from '../assets/img/logo_envision.png'
  export default {
    data () {
      return {
        dynamicMenuRoutes: [],
        fullImg,
        halfImg: '',
        defaultActive: '',
        defaultEle: null,
        routeLineEle: null
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      // $route: 'routeHandle',
      $route () {
        this.checkDefaultActive()
      }
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
      this.checkDefaultActive()
    },
    methods: {
      // 路由操作
      routeHandle (route) {
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      },
      checkDefaultActive () {
        if (this.$route.path !== '/') {
        this.menuList.forEach(item => {
          try{
            if (item.url) {
              let name = 'c' + item.url.replace(/\//g, '-')
              let aname =  item.url.replace(/\//g, '-')
              if (name === this.$route.name || aname === this.$route.name) {
                this.defaultActive = item['menuId']
                throw 'undo'
              }
            } else {
              item.list && item.list.forEach(list => {
                let name = list.url && list.url.replace(/\//g, '-')
                if (name === this.$route.name || ( 'c' + name) === this.$route.name) {
                  this.defaultActive = list.menuId
                  throw 'undo'
                }
              })
            }
          } catch(e) {
            if (e!=='undo') {
              throw e
            }
          }
        })
      } else {
        this.defaultActive = this.menuList[0]['menuId']
      }
      this.getSidebarLineFirstPosition()
      },
      getSidebarLineFirstPosition () {
        setTimeout(() => {
          this.defaultEle = document.getElementsByClassName('el-submenu is-active')[0] || document.getElementsByClassName('el-menu-item is-active')[0]
          this.routeLineEle = this.defaultEle
          this.getMousePosition()
        },0)
      },
      getMousePosition (e) {
        if (e && e.type==='mouseenter') {
          this.routeLineEle = e.target
        } else if (e && e.type === 'mouseleave') {
          this.routeLineEle = this.defaultEle
        } else if (e && e.type === 'click') {
          e.path[1].className.indexOf('el-menu-item')>-1 ? this.defaultEle = e.path[1]: ''
        }
        this.$refs.sidebarHoverLine.style.top = 
          this.routeLineEle.getBoundingClientRect().top - 80 + 8 + document.getElementsByClassName('el-menu-wrap')[0].scrollTop+'px'
        
      },
      toggleSidebarFold () {
        this.sidebarFold = !this.sidebarFold
        this.getSidebarLineFirstPosition()
      }
    }
  }
</script>
<style lang="scss">
.toggleSidebar{
  position: absolute;
  bottom: 23px;
  left: 22px;
  color: #A4A5B3;
  font-size: 28px;
}
.sidebarLogo001{
  color: #fff;
  font-size: 44px;
  position: absolute;
  top: 6px;
}
.sidebarLogo002{
  color: #fff;
  font-size: 150px;
  position: absolute;
  top: -45px;
}
.sidebar-nav-hover-line{
  height: 30px;
  width: 5px;
  background:#328FE6;
  border-radius: 3px;
  position: absolute;
  top: 88px;
  left: 10px;
  transition: all .15s ease-out;
}
.el-menu-wrap__fold{
  width: 70px!important;
}
</style>
