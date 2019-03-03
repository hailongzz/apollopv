<template>
<div class="login-tem">
  <h1 class="login-title">登录</h1>
	<el-form class="login-subform" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
		<el-form-item class="login-subform__mobile">
			<el-input
          maxlength="11"
          v-model.trim="mobile"
          placeholder="请输入手机号">
        <template slot="prefix"><icon-svg name="login_user" class="site-sidebar__menu-icon"></icon-svg></template>
      </el-input>
		</el-form-item>
		<el-form-item >
			<el-input v-model.trim="password"
        type="password"
        maxlength="64"
        placeholder="请输入账号密码">
        <icon-svg slot="prefix" name="login_password" class="site-sidebar__menu-icon"></icon-svg>
      </el-input>
		</el-form-item>
		<el-form-item>
			<el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()" :loading="login_save">登录</el-button>
		</el-form-item>
		<div class='other__operate'>
			  <span id="errorTip" ref="errorTip" v-show="accountWrong"><i class="el-icon-warning"></i>{{errorMsg}}</span>
      <span></span>
			<el-button class="login-subform__fpsdbtn" type="text" @click="forgetPassword()">忘记密码</el-button>


		</div>
	</el-form>
</div>
</template>
<script>
let md5 = require('md5')
import validator from 'validator'
export default {
  data () {
    return {
      // mobile: localStorage.getItem('envision_user') || '',
      mobile: '',
      password: '',
      accountWrong: false,
      errorMsg: '',
      login_save: false
    }
  },
  methods: {
    dataFormSubmit () {
      if (!this.mobile || !this.password) {
        this.accountWrong = true
        this.errorMsg = '手机号或密码不能为空'
        this.errorTipAnime()
        return
      } else if (!validator.isMobilePhone(this.mobile, 'zh-CN')) {
        this.accountWrong = true
        this.errorMsg = '手机号或密码不正确'
        this.errorTipAnime()
        return
      }
      this.login_save = true
      this.$http({
        url: this.$http.adornUrl('sys/login'),
        method: 'post',
        data: this.$http.adornData({
          mobile: this.mobile,
          password: md5(this.password),
          loginType: 0
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$cookie.set('token', data.data.token)
          window.localStorage.setItem('envision_user', this.mobile)
          window.localStorage.setItem('matchColorType', this.$route.name)
          this.$router.replace({ name: 'main' })
        } else {
          this.accountWrong = true
          this.errorMsg = data.message
          this.errorTipAnime()
        }
        this.login_save = false
      }).catch(error => {
        if (error.response) {
          this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
        } else {
          this.$message.error('请检查网络')
        }
        this.login_save = false
      })
    },
    forgetPassword () {
      this.$emit('forpwd')
    },
    destroy () {
      this.$destroy()
    },
    errorTipAnime () {
      this.$refs.errorTip.animate(
        [
          { transform: 'rotate(0) translateX(-30px)'},
          { transform: 'rotate(0) translateX(30px)'},
        ], 100
      )
    }
  }
}
</script>

<style lang="scss">
 @import '../../../src/assets/scss/variables.scss';
.login-tem {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .login-title {
    margin-bottom: 50px;
  }
  @media only screen and (max-width: 1280px) {
    .login-title {
      font-size: 20px;
    }
  }
  @media only screen and (min-width: 1281px) {
    .login-title {
      font-size: 25px;
    }
  }
  .login-subform {
    .el-form-item{
      input{
        border: 0px solid #fff;
        border-bottom: 1px solid #dcdfe6;
        border-radius: 0;
      }
      @media only screen and (max-width: 1280px) {
        input {
          font-size: 16px;
        }
      }
      @media only screen and (min-width: 1281px) {
        input {
          font-size: 16px;
        }
      }
      &:not(.login-subform__mobile){
        margin-top: 4vh;
      }
      .el-input__prefix{
        top: 3px;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 2vh;
      height: 38px;
      font-size: 16px!important;
    }
    .other__operate {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &>span{
        color: #f00;
        i{
          margin-right: 5px;
        }
      }
      & > .el-button {
        padding: 0;
        color: $--color-310;
        font-size: 14px;
      }
    }
  }
}
</style>
