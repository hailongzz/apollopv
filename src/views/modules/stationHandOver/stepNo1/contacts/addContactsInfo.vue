<template>
  <div style="width:100%;">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: -5%;width:100%">
    <el-form-item label="姓名" prop="name"  style=" height:34px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(138,139,153,1);line-height:34px;">
      <el-input v-model="ruleForm.name" style="height:34px;border-radius: 0"  placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="telephone" style="height:34px;border-radius: 0">
      <el-input v-model="ruleForm.telephone" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" style="height:34px;border-radius: 0">
    <el-input v-model="ruleForm.email" placeholder="请输入"></el-input>
  </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input v-model="ruleForm.desc" max-length="8" style="height:34px" placeholder="请输入,最多不超过8个字"></el-input>
      <span class="ta-len">{{editdescLen2}}/8</span>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" :rows="8"  v-model="ruleForm.remark" maxlength="400" placeholder="请输入" >
      </el-input>
      <span class="ta-len">{{editdescLen}}/150</span>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
  import {isvalidPhone} from '../contacts/js/validate.js';
  import {isvalidEmail} from '../contacts/js/validate.js';
  //isvalidEmail
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入电话号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  }
  var validEmail=(rule, value,callback)=>{
    if(value.trim().length==0){
      callback();
    }
     if (!isvalidEmail(value)){
      callback(new Error('请输入正确的邮箱格式'))
    }else {
      callback()
    }
  }
    export default {
      name: "addContactsInfo",
      props: {
        item: Object,
        stationId:String
      },
      data() {
        return {
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          value8: '',
          ruleForm: {
            name: '',
            tip: '',
            remark: '',
            email: '',
            desc: '',
            telephone: ''
          },
          rules: {
            name: [
              {required: true, message: '请输入活动名称', trigger: 'blur',error:"isError"},
              // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
            tip: [
              {required: true, message: '请选择活动资源', trigger: 'change'}
            ],
            remark: [
              {message: '请填写活动形式', trigger: 'blur'},{max:150,message:'超出最大字符范围',trigger:'change'}
            ],
            telephone: [
              { required: true, trigger: 'blur', validator: validPhone,message:'手机号格式不对' }
            ],
            desc: [
              {message: '请填写活动形式', required: true, trigger: 'blur'},{max:8,message:'超出最大字符范围',trigger:'change'}
            ],
            email:[
              { message:'邮箱格式不正确',trigger: 'blur',validator: validEmail }
            ]
          },
          isEdit:0
        };
      },
    computed: {
      editdescLen: function(){
        return this.ruleForm.remark.length;
      },
      editdescLen2: function(){
        return this.ruleForm.desc.length;
      }
    },
      methods: {
        submitForm() {
          //alert("开始提交de");
          this.$refs["ruleForm"].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl('stationhandover/createProject/contactsSave'),
                method: 'post',
                data: this.$http.adornData({
                  linkmanName: this.ruleForm.name,
                  linkmanMobile: this.ruleForm.telephone,
                  linkmanMail: this.ruleForm.email,
                  linkmanTag:this.ruleForm.desc,
                  remark: this.ruleForm.remark,
                  linkmanType: 1,
                  powerStationId: this.stationId,
                  innerUserId: "2"
                })
              }).then(({data}) => {
                //alert("实现新增外部联系人接口成功！！"+data.message);
                if (data.code == 0) {
                   this.ruleForm.name = '',
                  this.ruleForm.tip = '',
                  this.ruleForm.remark = '',
                    this.ruleForm.email = '',
                    this.ruleForm.desc = '',
                   this.ruleForm.telephone = ''
                } else {
                  this.$message.error(data.message)
                }
              }).catch((res) => {
                console.log(res)
              })
            } else {
              //alert("ruleForm的"+this.ruleForm.name.trim().length);
              if(this.ruleForm.name.trim().length==0){
                this.$message.error("必填项姓名不可为空")
              }
              if(this.ruleForm.telephone.trim().length==0){
                this.$message.error("必填项手机号不可为空")
              }
              if(this.ruleForm.desc.trim().length==0){
                this.$message.error("必填项描述不可为空")
              }
              //this.$message.error("请消除表单上的异常项")
                 this.ruleForm.name = '',
                this.ruleForm.tip = '',
                this.ruleForm.remark = '',
                this.ruleForm.email = '',
                this.ruleForm.desc = '',
                this.ruleForm.telephone = ''
                this.resetForm("ruleForm");
              return false;
            }
          });
        },
     resetForm() {
         this.$refs["ruleForm"].resetFields();
         }
      }
    }
</script>

<style scoped>
  textarea{
    border-radius: 2px;
    border: 1px solid rgba(216,217,230,0.8);
    height: 100px;
    resize: none;
  }
  .ta-len{
    position: absolute;
    right: 12px;
    bottom: 10px;
    height:14px;
    font-size:14px;
    color:rgba(164,165,179,1);
    line-height:14px;
  }
.formTipStyle{
  width:251px;
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(164,165,179,1);
  line-height:20px;
}
  .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    /*//margin-right: 4px;*/
  }
</style>
<style>
  .el-form-item__label{
    height:34px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:34px;
  }
  label{
    height:34px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:34px;
  }

</style>
