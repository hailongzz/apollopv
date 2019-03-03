<template>
<div class="forget-tem">
  <h1 class="forget-tem-title">找回密码</h1>
  <i class="el-icon-close closeTem" @click="closeTem"></i>
	<el-form class="forget-tem-subform" :model="dataForm" ref="dataForm" @keyup.enter.native="forpwdNext()" status-icon>
		<el-form-item class="forget-tem-subform__mobile">
			<el-input v-model="dataForm.mobile" maxlength="11" placeholder="请输入手机号">
        <template slot="prefix"><icon-svg name="login_user" class="site-sidebar__menu-icon"></icon-svg></template>
      </el-input>
		</el-form-item>
    <input style="display:none" type="text">
    <input style="display:none" type="password">
		<el-form-item class="forget-tem-subform__authcode"  >
			<el-input v-model="dataForm.verifyCode" maxlength="6"  placeholder="请输入验证码">
        <template slot="prefix"><icon-svg name="login_code" class="site-sidebar__menu-icon"></icon-svg></template>
        <!-- <template slot="suffix" @click="getAuthCode()">获取验证码</template> -->
      </el-input>
      <span class="auth-code__content" @click="getAuthCode()">{{authCodeTime}}</span>
		</el-form-item>
		<el-form-item>
			<el-button class="forget-tem-btn-submit" type="primary"  @click="forpwdNext()" :loading="next_save">下一步</el-button>
		</el-form-item>
    <div class='other__operate'>
			  <span id="errorTip" ref="errorTip" v-show="accountWrong"><i class="el-icon-warning"></i>{{errorMsg}}</span>
      <span></span>
			          
		</div>
	</el-form>
</div>
</template>
<script>
import validator from 'validator'

export default {
  data () {
    return {
      dataForm: {
        mobile: '',
        verifyCode: ''
      },
      authCodeTime: '获取验证码',
      timer: null,
      accountWrong: false,
      errorMsg: '',
      next_save: false
    }
  },
  methods: {

    forpwdNext () {
      let _mobile = this.dataForm.mobile
      let _verifyCode = this.dataForm.verifyCode
      if (!_mobile || !_verifyCode) {
        this.accountWrong = true
        this.errorMsg = '手机号或验证码不能为空'
        this.errorTipAnime()
        return
      } else if (!validator.isMobilePhone(_mobile, 'zh-CN')) {
        this.accountWrong = true
        this.errorMsg = '手机号不正确'
        this.errorTipAnime()
        return
      }
      var params = {
        mobile: this.dataForm.mobile,
        verifyCode:this.dataForm.verifyCode
      };
      this.next_save = true
      this.$http({
        url: this.$http.adornUrl("sys/checkVerifyCode"),
        method: "post",
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$emit('forpwdNext', this.dataForm)
        } else if (data && data.code === 1020) {
          this.accountWrong = true
          this.errorMsg = '验证码错误'
          this.errorTipAnime()
        } else {
          this.$message.error(data.message);
        }
        this.next_save = false
      }).catch(error => {
        if (error.response) {
          this.accountWrong = true
          this.errorMsg = `请求已发出，但服务器响应的状态码为${error.response.status}`
          this.errorTipAnime()
        } else {
          this.accountWrong = true
          this.errorMsg = `请检查网络`
          this.errorTipAnime()
        }
        this.next_save = false
      })

      clearInterval(this.timer)
      this.authCodeTime =  '获取验证码'
      
    },

    getAuthCode () {
      if (this.timer) return
      if( this.dataForm.mobile === "") {
        this.accountWrong = true
        this.errorMsg = '手机号不能为空'
        this.errorTipAnime()
        return
      } else if (!validator.isMobilePhone(this.dataForm.mobile, 'zh-CN')) {
        this.accountWrong = true
        this.errorMsg = '手机号不正确'
        this.errorTipAnime()
        return
      } else {
        this.accountWrong = false

        var params = {
          mobile: this.dataForm.mobile,
        };
        this.$http({
          url: this.$http.adornUrl("sys/getVerifyCode"),
          method: "post",
          data: this.$http.adornData(params)
        }).then(({ data }) => {
          if (data && data.code === 500) {
            this.accountWrong = true
            this.errorMsg = data.message
            this.errorTipAnime()
            clearInterval(this.timer)
            this.timer = null
            this.authCodeTime =  '获取验证码'

          } else if (data && data.code !== 0) {
            this.$message.error(data.message);
            clearInterval(this.timer)
            this.timer = null
            this.authCodeTime =  '获取验证码'

          }
        });
        this.countDown()
      }
    },
    countDown () {
      let timeValue = 60
      this.authCodeTime = '60s'
      this.timer = setInterval(() => {
        if (timeValue <= 1) {
          this.authCodeTime = '重新获取验证码'
          clearInterval(this.timer)
          this.timer = null
          return
        }
        timeValue--
        this.authCodeTime = timeValue + 's'
      }, 1000)
    },
    errorTipAnime () {
      this.$refs.errorTip.animate(
        [
          { transform: 'rotate(0) translateX(-30px)'},
          { transform: 'rotate(0) translateX(30px)'},
        ], 100
      )
    },
    destroy () {
      this.$destroy()
    },
    closeTem () {
      this.$emit('closeTem')
    }
  }
}
</script>

<style lang="scss">
 @import '../../../src/assets/scss/variables.scss';
.forget-tem {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  .closeTem{
    position: absolute;
    top: 15px;
    right: 15px;
    &:hover{
      transform:scale(1.5)
    }
  }
  .forget-tem-title {
    margin-bottom: 50px;
  }
  @media only screen and (max-width: 1280px) {
    .forget-tem-title {
      font-size: 20px;
    }
  }
  @media only screen and (min-width: 1281px) {
    .forget-tem-title {
      font-size: 25px;
    }
  }
  .forget-tem-subform {
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
      &:not(.forget-tem-subform__mobile){
        margin-top: 4vh;
      }
      .el-input__prefix{
        top: 3px;
      }
      .el-input__suffix{
        color: $--color-101;
        cursor: pointer;
      }
    }
    .forget-tem-btn-submit {
      width: 100%;
      margin-top: 2vh;
      height: 38px;
      font-size: 16px!important;
      font-weight: 500;
    }
    &__authcode{
      position: relative;
      .auth-code__content{
        position: absolute;
        top: 0;
        right: 0;
        color: $--color-101;
        cursor: pointer;
      }
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
    }
  }
}
</style>
