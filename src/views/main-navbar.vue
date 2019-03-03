<template>
  <nav class="site-navbar">
    <div class="site-navbar__header" :class="'site-navbar__header__' + matchColorsType">
      <h1 class="site-navbar__brand">
        <a class="site-navbar__brand-lg" href="javascript:;"></a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <div class="navbar-avator">
        <div class="navbar-title">光伏电站运维管理系统</div>
        <div class="site-navbar__avatar"   >
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <!-- <img src="~@/assets/img/avatar.png" > -->
              <img :src="avatorUrl" alt="">
            </span>
            <el-dropdown-menu slot="dropdown" class="site-navbar-dropdown" >
              <el-card >
                <div slot="header" class="clearfix site-navbar-dropdown__message" @click="$router.push({name: 'sys-settings'})">
                  <div class="site-navbar-info">
                    <img :src="avatorUrl" alt="">
                    <div>
                      <span>
                        <span>{{this.userObj&&this.userObj.userName}}</span>
                        <span>{{this.userObj&&this.userObj.mobile}}</span>
                      </span>
                      <span>{{this.userObj&& this.userObj.isOrganizationUser === 1&&this.userObj.organizationName || ''}}（{{this.userObj && this.userObj.roleList && this.userObj.roleList.map(item => item.roleName).join(',')}}）</span>
                    </div>
                  </div>
                </div>

                <el-dropdown-item @click.native="$router.push({name: 'sys-settings'})"><icon-svg name="setting" class="site-navbar__menu-icon"></icon-svg>  <span>设置</span></el-dropdown-item>
                <el-dropdown-item  @click.native="logoutHandle()"><icon-svg name="logout" class="site-navbar__menu-icon"></icon-svg> <span>退出</span></el-dropdown-item>
              </el-card>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  import SubMenu from './main-sidebar-sub-menu'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        dynamicMenuRoutes: [],
        defaultActive: '',
        alarmNum: '',
        alarmList: []
      }
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.checkDefaultActive()
      this.getAlarmData()
    },
    watch: {
      $route () {
        this.checkDefaultActive()
      }
    },
    components: {
      UpdatePassword,
      SubMenu
    },
    computed: {
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      matchColorsType: {
        get () {
          return this.$store.state.common.matchColorsType
        },
        set (val) {this.$store.commit('common/updateMatchColorsType', val)}
      },
      userObj: {
        get () {return this.$store.state.user.userObj}
      },
      avatorUrl () {
        if (this.userObj&& this.userObj.imageUrl) {
          return this.userObj.imageUrl
        } else {
          return '/static/img/avatar.png'
        }
      }
    },
    methods: {
      // 消息中心告警
      getAlarmData () {
        const that = this
        // this.$http({
        //   url: this.$http.adornUrl('powerStationOperation/gtalarm/unreadTotal'),
        //   method: 'post',
        //   data: this.$http.adornData()
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.alarmNum = data.untotal
        //     this.alarmList = data.alarmList
        //   } else {
        //     that.$message.error(data.message)
        //   }
        // })
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: this.$http.adornUrl('sys/logout/0'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              let _colorTheme = window.localStorage.getItem('matchColorType')
              this.matchColorsType = _colorTheme
              this.$router.push({ name: this.$store.state.common.matchColorsType})
              clearLoginInfo()
            }
          })
        }).catch(() => {})
      },
      checkDefaultActive () {
        if (this.$route.path !== '/') {
        this.menuList.forEach(item => {
          try{
            if (item.url) {
              let name = 'c' + item.url.replace('/', '-')
              let aname =  item.url.replace('/', '-')
              if (name === this.$route.name || aname === this.$route.name) {
                this.defaultActive = item['menuId']
                throw 'undo'
              }
            } else {
              item.list && item.list.forEach(list => {
                let name = list.url && list.url.replace('/', '-')
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
      }
    }
  }
</script>
<style lang="scss">
 @import '../../src/assets/scss/variables.scss';
.site-navbar__avatar:hover{
  // background: #1b1c2e;
}
.site-navbar-dropdown{
  width: 300px;
  padding: 0;
  margin: 0;
  .el-card__header{
    background: #f5f9ff;
  }
  .el-card__body{
    padding: 0;
    li{
      height: 40px;
      line-height: 40px!important;
      display: flex;
      flex-direction: row;
      align-items: center;
      &:first-child{
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
      }
      .site-navbar__menu-icon{
        font-size: 25px;
        margin-bottom: 3px;
      }
    }
  }
  .site-navbar-dropdown__message{
    display: flex;
    flex-direction: column;
    background: #f5f9ff;
    .site-navbar-info{
      display: flex;
      flex-direction: row;
      min-height: 70px;
      align-items: center;
      cursor: pointer;
      img{
        width: 60px!important;
        height: 60px!important;
        border-radius: 50%;
      }
      &>div{
        width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 60px;
        padding-left: 15px;
        span:first-child{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 2px 0;
          box-sizing: border-box;
          &>span:last-child{
            color: #88909f;
            font-size: 12px;
            line-height: 18px
          }
        }
        span:last-child{
          color: $--color-306;
        }
      }
    }
  }
}
.site-navbar-dropdown__news{
  width: 300px;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 48px!important;
  .el-icon-alarm{
    background:url('../assets/img/icon_alarm.png');
    background-size: cover;
    height: 22px;
    width: 22px;
    vertical-align: middle;
    margin-right: 11px;
  }
  .el-card__header{
    height: 40px;
    line-height: 38px!important;
    text-align:center;
    padding: 0;
  }
  .el-card__body{
    padding: 0;
    ul{
      padding: 0;
      margin: 0;
      li{
        list-style:none;
        margin: 0;
        padding: 16px 16px 12px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        &:first-child{
          border-bottom: 1px solid #f5f9ff;
        }
        &:hover{
          background: #f5f9ff;
        }
        &>span:first-child{
          span{
            line-height: 20px;
            font-size: 14px;
            color:#393C57;
          }
        }
        &>span:not(:first-child){
          padding-left: 34px;
          font-size: 14px;
          height: 24px;
          line-height: 24px;
          color: #88909f;
        }
        &>span:last-child{
          margin-top: 5px;
          font-size: 12px;
          color:#A2A5BD;
        }
      }
    }
    .el-button{
      margin-left: 7px;
      text-align: center;
      color: #A2A5BD;
      font-size: 14px;
      display: block;
      margin: auto;
    }
  }
}
.site-navbar__body{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.navbar-avator{
  width: 100%;
  height: 44px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .navbar-title{
    margin-left: 30px;
    font-size: 16px;
    color: #212029;
    font-family:PingFang-SC-Medium;
    font-weight:500;
  }
  .site-navbar__news{
    margin-right: 30px;
    i{
      font-size: 24px;
      color: #fff;
    }
  }
}
.site-navbar__header__envision-theme{
  background:url( '../../src/assets/img/logo_envision.png') no-repeat center;
}
.site-navbar__header__ats-theme{
  background:url( '../../src/assets/img/logo_ats.png') no-repeat center;
}
.el-menu-item:focus{
  color: #909399!important;
}
.el-menu-item.is-active{
  color: #fff!important;
}
</style>
