<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <div style="height: 44px;">
        <main-navbar />
      </div>
      <main-sidebar />
      <div style="height: 48px;"  v-if="isShowBreadcurmb">
        <main-breadcurmb />
      </div>
      <!-- <div class="other-breadcurmb" v-else></div> -->
      <div class="site-content__wrapper" :style="{ 'height': documentClientHeight - 92 + 'px' }">
        <!--  -->
        <main-content />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  import MainBreadcurmb from './main-breadcurmb'
  
  export default {
    data () {
      return {
        loading: false
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent,
      MainBreadcurmb
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      organizationId: {
        get () { return this.$store.state.user.organizationId },
        set (val) { this.$store.commit('user/updateOrganizationId', val) }
      },
      userObj: {
        get () {return this.$store.state.user.userObj},
        set (val) {this.$store.commit('user/updateUserObj', val)}
      },
      isShowBreadcurmb () {
        return this.$route.name !== 'sys-news' && this.$route.name !== 'sys-settings'
      },
      matchColorsType: {
        get () {return this.$store.state.common.matchColorsType},
        set (val) {this.$store.commit('common/updateMatchColorsType',val)}
      }
    },
    created () {
      this.getUserInfo()
      let _routeArr = JSON.parse(window.sessionStorage.getItem('dynamicMenuRoutes'))
      if (this.$cookie.get('token') && _routeArr.length > 0) {
        // console.log(this.$route, 'route')
        if (this.$route.path === '/') {
          this.$router.push({name:_routeArr[0]['name']})
        }
      } else {
        this.$router.push({name:window.localStorage.getItem('matchColorType') ? window.localStorage.getItem('matchColorType') : 'envision-theme'})
      }
      this.toggleTheme(this.matchColorsType)
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('sys/user/userInfo'),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.data.userId
            this.userName = data.data.userName
            this.organizationId = data.data.organizationId
            this.userObj = data.data
            window.sessionStorage.setItem('userObj', JSON.stringify(data.data))
          } else {
            this.$message.error(data.message)
          }
        })
      },
      toggleTheme  (val) {
        let Ele = document.getElementsByTagName('body')[0]
        if (Ele.classList[0] !== val) {
          Ele.classList.remove(Ele.classList[0])
          Ele.classList.add(val)        
        }
      }
    }
  }
</script>
<style lang="scss">
.site-wrapper{
  .site-content__wrapper{
    background: #f5f5fa;
    overflow: hidden;
  }
  .other-breadcurmb{
    position: absolute;
    top: 60px;
    left: 0;
    height: 30px;
    width: 100%;
    background: #f5f5fa;
    z-index: 1000;
  }
}
</style>
