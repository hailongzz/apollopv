<template>
  <div style="width:100%">
  <el-form  ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: -8%;width:103%">
   <el-form-item label="姓名" prop="name"  style=" height:34px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(138,139,153,1);line-height:34px;">
    <el-input v-model="name" class="noneBorder"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="telephone" style="height:34px;border-radius: 0;">
      <el-input v-model="telephone" class="noneBorder" style="border-style: none;!important;"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" style="height:34px;border-radius: 0">
      <el-input v-model="email" class="noneBorder" style="border-style: none;!important;"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tip">
      <el-radio-group v-model="tip">
        <el-radio label="站长" style=" width:28px;height:20px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(62,62,71,1);line-height:20px;"></el-radio>
        <el-radio label="值长"  style=" width:28px;height:20px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(62,62,71,1);line-height:20px;"></el-radio>
        <el-radio label="值班员"  style=" width:28px;height:20px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(62,62,71,1);line-height:20px;"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="remark" type="textarea" :rows="8" maxlength="400"  placeholder="请输入" onKeyUp="javascript:checkWord(this);" onMouseDown="javascript:checkWord(this);" name="content" style="margin-bottom: -10px">
      </el-input>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
    export default {
        name: "addContactsInfo",
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
          name: '',
          tip:'',
          remark:'',
          telephone:'',
          email:'',
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            tip: [
              { required: true, message: '请选择活动资源', trigger: 'change' }
            ],
            remark: [
              { message: '请填写活动形式', trigger: 'blur' }
            ]
          }
        };
      },
      computed: {
        editdescLen: function(){
          return this.item.remark.length;
        },
        editdescLen2: function(){
          return this.item.linkmanTag.length;
        }
      },
      props:{
        organizationId:String,
        secondName:String,
        stationId:String,
        item:Object
      },
      created(){
        this.name=this.item.linkmanName;
        this.remark=this.item.remark;
        this.telephone=this.item.linkmanMobile;
        this.email=this.item.linkmanMail;
        var x=this.item.linkmanTag;
        if(x==="站长"){
              this.tip="站长"
        }
        if(x==="值长"){
          this.tip="值长"
        }
        if(x=="值班长"){
          this.tip="值班员"
        }
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
        },
      watch:{
        name:{
         handler(newVal,oldVal){
            this.getInner();
            }
        }
      }
    }
</script>

<style scoped>
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
 /*.noneBorder .el-input__inner .el-input--small{*/
  /*border:none*/
/*}*/
</style>
<style>
  .noneBorder .el-input__inner .el-input--small{
    border:none
  }
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
