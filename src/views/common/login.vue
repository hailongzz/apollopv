<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="login-main">
        <div class="login-main__form">
          <div class="logo">
            <div class="logo__wrap" :class="'logo__' + matchColorsType"></div>
            <!-- <img src="../../../src/assets/img/logo_ats.png" alt=""> -->
            <p>光伏电站运维管理系统</p>
          </div>
          <div class="form">
            <transition name="fade-transform" mode="out-in">
            <component v-bind:is="currentLoginComponent" 
              ref="loginForm"
              :mobile="account.mobile"
              :verifyCode="account.verifyCode"
              @closeTem="goLogin"
              @goLogin="goLogin"
              @forpwdNext="forpwdNext"
              @forpwd="forpwd">
            </component>
            </transition>
          </div>
        </div>
        <!-- <tem-login /> -->
      </div>
      <div class="brand-info" :class="'logo__bg_' + matchColorsType">
      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import temLogin from '@/components/login/login'
  import temForgetpwd from '@/components/login/forgetPassword'
  import temNewpwd from '@/components/login/newPassword'
  export default {
    data () {
      return {
        currentLoginComponent: 'temLogin',
        account: {
          mobile: '',
          verifyCode: ''
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.$cookie.get('token')) {
          vm.$router.push({name: 'main'})
        } else {
          vm.matchColorsType = vm.$route.name
          vm.toggleTheme(vm.$route.name)
        }
      })
    },
    methods: {
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      },
      forpwd () {
        this.currentLoginComponent = 'temForgetpwd'
        this.$refs.loginForm.destroy()
      },
      forpwdNext (val) {
        console.log(val, 'val')
        this.account = val
        this.currentLoginComponent = 'temNewpwd'
        this.$refs.loginForm.destroy()
      },
      goLogin () {
        this.currentLoginComponent = 'temLogin'
        this.$refs.loginForm.destroy()
      },
      toggleTheme  (val) {
        console.log('aaa')
        let Ele = document.getElementsByTagName('body')[0]
        if (Ele.classList[0] !== val) {
          Ele.classList.remove(Ele.classList[0])
          Ele.classList.add(val)        
        }
      }
    },
    components: {
      temLogin,
      temForgetpwd,
      temNewpwd
    },
    computed: {
      matchColorsType: {
        get () {return this.$store.state.common.matchColorsType},
        set (val) {this.$store.commit('common/updateMatchColorsType', val)}
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../src/assets/scss/variables.scss';
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #e0e0e0;
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      // background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
      display: flex;
      flex-direction: row;
      justify-content:center;
      align-items: center;
      .login-main {
        height: 100%;
        width: 38vw;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &__form{
          height: 100%;
          width: 27vw;
          display: flex;
          flex-direction: column;
          .logo{
            display: flex;
            flex-basis: 30%;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .logo__wrap{
              width: 162px;
              height: 23px;
            }
            .logo__envision-theme{
              background:url( '../../../src/assets/img/logo_envision_c.png') no-repeat center;
            }
            .logo__ats-theme{
              background:url( '../../../src/assets/img/logo_ats.png') no-repeat center;
            }
            p{
              color: #868686;
              font-size: 20px;
              font-weight: bold;
              margin-top: 15px;
            }
            @media only screen and (max-width: 1280px) {
              p {
                font-size: 18px;
              }
            }
            @media only screen and (min-width: 1281px) {
              p {
                font-size: 23px;
              }
            }
          }
          .form{
            flex-grow: 1;
          }
        }
      }
      @media only screen and (max-width: 1280px) {
        .login-main {
          width: 38vw;
          &__form{
            width: 27vw;
          }
        }
      }
      @media only screen and (min-width: 1281px) {
        .login-main {
          width: 30vw;
          &__form{
            width: 22vw;
          }
        }
      }
      .brand-info {
        flex-grow: 1;
        height: 100%;
      }
      .logo__bg_envision-theme{
        background:url( '../../../src/assets/img/login_bg_envision.png') no-repeat;
        background-size: cover;
      }
      .logo__bg_ats-theme{
        background:url( '../../../src/assets/img/login_bg_ats.png') no-repeat;
        background-size: cover;
      }
    }
  }
</style>
