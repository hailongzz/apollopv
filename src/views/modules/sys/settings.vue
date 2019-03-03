<template>
	<div class="setting-wrap">
		<div class="setting-content">
			<div class="setting-content__card">
				<div class="setting-content__card__info">
					<img :src="avatorUrl" alt="">
					<h3>{{this.userObj && this.userObj.userName}}</h3>
					<span>{{this.userObj && this.userObj.isOrganizationUser === 1 && this.userObj.organizationName || ''}}</span>
				</div>
				<div class="setting-content__card__menu">
					<ul>
						<li @click="currentCard=1" :class="{'active': currentCard==1}">个人资料</li>
						<li @click="currentCard=2" :class="{'active': currentCard==2}">修改密码</li>
						
					</ul>
				</div>
			</div>
			<div class="setting-content__edit" ref="settings">
					<div class="setting-content__edit__title" v-text="currentCard===1?'个人资料':'修改密码'"></div>
          <i class="el-icon-close closePage" @click="closePage()"></i>
					<el-form key="1" v-if="currentCard===1" label-width="80px" :model="userInfo" ref="userInfo"  :rules="rules">
            <el-form-item label="头像" class="el-form__avator">
							<img :src="avatorUrl" alt="">
              <el-upload
              :show-file-list="false"
                class="upload-demo"
                action="http://122.112.203.235:8012/envisionom/sys/user/upHeadImage"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :data="uploadData"
                accept="image/*"
                :file-list="fileList">
                <el-button size="small" type="text">更换头像</el-button>
              </el-upload>
						</el-form-item>
						<el-form-item label="姓名" prop="userName">
							<el-input v-model="userInfo.userName"></el-input>
						</el-form-item>
						<el-form-item label="公司">
              <el-input v-if="userInfo.isOrganizationUser === 1" v-model="userInfo.organizationName" disabled></el-input>
							<el-input v-else disabled></el-input>
						</el-form-item>
						<el-form-item label="手机号">
							<el-input v-model="userInfo.mobile" disabled></el-input>
						</el-form-item>
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="userInfo.email"></el-input>
						</el-form-item>
            <el-form-item >
							<el-button type="primary" @click="updateInfo()" :loading="info_save" >保存</el-button>
						</el-form-item>
					</el-form>
	
					<el-form key="2" v-if="currentCard===2" label-width="80px" :model="passwordForm" :rules="passwordRules" ref="updatepassword">
						<el-form-item label="旧密码" prop="password">
							<el-input type="password" v-model="passwordForm.password" placeholder="请输入旧密码"></el-input>
						</el-form-item>
						<el-form-item label="新密码" prop="newPassword">
							<el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入6位以上数字、字母组合的新密码"></el-input>
						</el-form-item>
						<el-form-item label="确认密码" prop="newPassword2">
							<el-input type="password" v-model="passwordForm.newPassword2" placeholder="请重复输入新密码"></el-input>
						</el-form-item>
            <el-form-item >
							<el-button type="primary" @click="updatePassword()" :loading="password_save">保存</el-button>
						</el-form-item>
					</el-form>
					
				</div>
			</div>
		</div>
</template>
<script>
import md5 from 'md5'
import validator from 'validator'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入6位以上密码'))
      } else if ((/\s/g).test(value)) {
        callback(new Error('密码不能包含空格'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatorEmail = (rule, value, callback) => {
      if (value.length > 0 && !validator.isEmail(value)) {
        callback('邮箱格式有误')
      } else {
        callback()
      }
    }
    return {
      password_save: false,
      info_save: false,
      personInfo: {},
      passwordForm: {
        password: '',
        newPassword: '',
        newPassword2: ''
      },
      passwordRules: {
        password: [
          {required: true, message: '请输入旧密码'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码'},
          {validator:validatePass }
        ],
        newPassword2: [
          {required: true, message: '请重复输入新密码'},
          {validator: validatePass2}
        ]
      },
      currentCard: 1,
      uploadData: {
        userId: ''
      },
      userInfo: {
        userName: '',
        isOrganizationUser: '',
        mobile: '',
        email: ''
      },
      rules: {
        userName: [
          {required: true, message: '姓名不能为空'}
        ],
        email: [
          {validator: validatorEmail}
        ]
      },
      fileList: []
    }
  },
  created () {
    this.userInfo = JSON.parse(JSON.stringify(this.userObj))
  },
  methods: {
    closePage () {
      this.$router.go(-1)
    },
    updatePassword () {
      this.$refs.updatepassword.validate((valid) => {
        if (valid) {
          let _params = {
            password:md5(this.passwordForm.password),
            newPassword: md5(this.passwordForm.newPassword)
          }
          this.password_save = true
          this.$http({
            url: this.$http.adornUrl('sys/user/updatePassword'),
            method: 'post',
            data: this.$http.adornData(_params)
          }).then(({data}) => {
            this.password_save = false
            if (data && data.code === 0) {
              this.$message.success('密码修改成功')
              this.$router.go(-1)
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
          this.password_save = false
          if (error.response) {
            this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
          } else {
            this.$message.error('请检查网络')
          }
        })
        } else {
          return false
        }
      })
    },
    updateInfo () {
      this.$refs.userInfo.validate(valid => {
        if (valid) {
          let _params = {
            imageUrl: this.userInfo.imageUrl,
            username: this.userInfo.userName,
            email: this.userInfo.email
          }
          this.info_save = true
          this.$http({
            url: this.$http.adornUrl('sys/user/update'),
            method: 'post',
            data: this.$http.adornData(_params)
          }).then(({data}) => {
            this.info_save = false
            if (data && data.code === 0) {
              this.$message.success('个人资料修改成功')
              this.getUserInfo()
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
              this.info_save = false
              if (error.response) {
                this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
              } else {
                this.$message.error('请检查网络')
              }
            })
        } else {
          return false
        }
      })
    },
    beforeUpload (file) {
      console.log(file, 'file')
      if (file.type.indexOf('image') < 0) {
        this.$message.error('格式有误')
        return false
      }
      this.$set(this.uploadData, 'userId', this.userObj && this.userObj.userId)
      this.$set(this.uploadData, 'token', this.$cookie.get('token'))
      return file
    },
    handleSuccess (response, file, fileList) {
      if (response && response.code === 0) {
        this.userInfo.imageUrl = response.imageUrl
      }
      fileList = []
      this.fileList = []
    },
    getUserInfo () {
      this.$http({
        url: this.$http.adornUrl('sys/user/userInfo'),
        method: 'post',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.userId = data.data.userId
          this.userName = data.data.userName
          this.organizationId = data.data.organizationId
          this.userObj = data.data
        } else {
          this.$message.error(data.message)
        }
      })
    },
    toggle () {
      this.$refs.settings.animate(
        [
          { transform: 'rotate(0) translateY(0)'},
          { transform: 'rotate(0) translateY(50px)'},
        ], 200
      )
    }
  },
  computed: {
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
    avatorUrl () {
      if ( this.userInfo && this.userInfo.imageUrl) {
        return this.userInfo.imageUrl
      }else if (this.userObj && this.userObj.imageUrl) {
        return this.userObj.imageUrl
      } else {
        return '/static/img/avatar.png'
      }
    }
  }
}
</script>

<style lang="scss">
.setting-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f5fa;
  .setting-content {
    width: 70vw;
    height: 80vh;
    // max-width: 1100px;
    // max-height: 600px;
    display: flex;
    flex-direction: row;
    &__card {
      width: 20vw;
      height: 70vh;
      display: flex;
      flex-direction: column;
      &__info {
        width: 20vw;
        height: 45vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-bottom: 1px solid #f5f5fa;
        img {
          width: 95px;
          height: 95px;
          border-radius: 50%;
          border: 1px solid #eee;
        }
      }
      .setting-content__card__menu {
        width: 20vw;
        height: 25vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background: #fff;
        box-sizing: border-box;
        ul {
          padding: 0;
          margin: 0;
          width: 100%;
          li {
            list-style: none;
            padding: 10px;
            font-size: 16px;
            width: 100%;
            text-align: center;
            line-height: 30px;
            font-weight: bold;
            box-sizing: border-box;
            border-bottom: 1px solid #EBEBF2;
            border-left: 3px solid #fff;
            cursor: pointer;
            &:hover {
              // border-left: 3px solid #0a6efa;
              color: #4993fc;
              // background: rgba(10, 110, 250, 0.1);
            }
            &.active {
              box-sizing: border-box;
              border-left: 3px solid #0a6efa;
              color: #4993fc;
              background: rgba(10, 110, 250, 0.1);
            }
          }
        }
      }
    }
    .setting-content__edit {
      position: relative;
      width: 50vw;
      height: 100%;
      margin-left: 1vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 30px 30px;
      box-sizing: border-box;
      background: #fff;
      .closePage{
        position: absolute;
        top: 10px;
        right: 10px;
        &:hover{
          transform: scale(1.5)
        }
      }
      .setting-content__edit__title {
        display: block;
        width: 100%;
        float: left;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 12vh;
      }
      .el-form__avator{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .el-form-item__content{
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 0!important;
          img{
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin-right: 20px;
          border: 1px solid #eee;
          }
          .el-button{
            margin: 0;
            width: 80px;
          }
        }
      }
      .el-input {
        width: 20vw;
      }
      .el-button {
        margin-top: 5vh;
        width: 90px;
      }
    }
  }
}
</style>
