<template>
<div class="newpwd-tem">
  <h1 class="newpwd-tem-title">设置新密码</h1>
  <i class="el-icon-close closeTem" @click="closeTem"></i>
	<el-form class="newpwd-tem-subform" :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
		<el-form-item class="newpwd-tem-subform__password">
			<el-input v-model="dataForm.newPassword" minlength="6" type="password" placeholder="请输入6位以上新密码">
        <template slot="prefix"><icon-svg name="login_password" class="site-sidebar__menu-icon"></icon-svg></template>
      </el-input>
		</el-form-item>
    <input style="display:none" type="text">
    <input style="display:none" type="password">
		<el-form-item >
			<el-input v-model="dataForm.password" minlength="6" type="password" placeholder="请重复输入新密码">
        <template slot="prefix"><icon-svg name="login_password" class="site-sidebar__menu-icon"></icon-svg></template>
      </el-input>
		</el-form-item>
		<el-form-item>
			<el-button class="newpwd-tem-subform__submit" type="primary" @click="goLogin()" :loading="new_save">确定</el-button>
		</el-form-item>
    <div class='other__operate'>
			  <span id="errorTip" ref="errorTip" v-show="accountWrong"><i class="el-icon-warning"></i>{{errorMsg}}</span>
      <span></span>
			          
		</div>
	</el-form>
</div>
</template>
<script>
let md5 = require('md5')

export default {
  data () {
    return {
      dataForm: {
        newPassword: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      captchaPath: '',
      accountWrong: false,
      errorMsg: '',
      new_save: false
    }
  },
  props: {
    mobile: {
      type: String,
      required: true
    },
    verifyCode: {
      type: String,
      required: true
    }
  },
  methods: {
    goLogin () {
      let _newPassword = this.dataForm.newPassword
      let _newPassword2 = this.dataForm.password
      if (!_newPassword && !_newPassword2) {
        this.accountWrong = true
        this.errorMsg = '密码不能为空'
        this.errorTipAnime()
        return
      } else if ((/\s/g).test(_newPassword)) {
        this.accountWrong = true
        this.errorMsg = '密码不能包含空格'
        this.errorTipAnime()
        return
      } else if (_newPassword !== _newPassword2) {
        this.accountWrong = true
        this.errorMsg = '两次输入密码不一致'
        this.errorTipAnime()
        return
      } else if (_newPassword.length < 6) {
        this.accountWrong = true
        this.errorMsg = '新密码至少6位'
        this.errorTipAnime()
        return
      }
      let _params = {
        mobile: this.mobile,
        newPassword: md5(_newPassword),
        verifycode: this.verifyCode
      }
      this.new_save = true
      this.$http({
        url: this.$http.adornUrl('sys/user/forgetPassword'),
        method: 'post',
        data: this.$http.adornData(_params)
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message.success("密码修改成功")
          this.$emit('goLogin')
        } else {
          this.accountWrong = true
          this.errorMsg = '系统异常'
          this.errorTipAnime()
        }
        this.new_save = false
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
        this.new_save = false
      })
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
.newpwd-tem {
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
  .newpwd-tem-title {
    margin-bottom: 50px;
  }
  @media only screen and (max-width: 1280px) {
    .newpwd-tem-title {
      font-size: 20px;
    }
  }
  @media only screen and (min-width: 1281px) {
    .newpwd-tem-title {
      font-size: 25px;
    }
  }
  .newpwd-tem-subform {
    .el-form-item {
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
      &:not(.newpwd-tem-subform__password){
        margin-top: 4vh;
      }
      .el-input__prefix{
        top: 3px;
      }
    }
    .newpwd-tem-subform__submit {
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
    }
  }
}
</style>
