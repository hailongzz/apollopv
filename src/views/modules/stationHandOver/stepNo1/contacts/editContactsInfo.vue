<template>
  <div style="width:100%;padding-left: 5%">
    <el-form :model="item" :rules="rules" ref="item" label-width="100px" class="demo-item" style="margin-left: -8%;width:103%">
      <el-form-item label="姓名" prop="linkmanName"  style=" height:34px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(138,139,153,1);line-height:34px;">
        <el-input v-model="item.linkmanName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="linkmanMobile">
        <el-input v-model="item.linkmanMobile" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="linkmanMail">
        <el-input v-model="item.linkmanMail" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="linkmanTag">
        <el-input v-model="item.linkmanTag" max-length="8" style="height:34px" placeholder="请输入,最多不超过8个字"></el-input>
        <span class="ta-len">{{editdescLen2}}/8</span>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="8"  v-model="item.remark" maxlength="400" placeholder="请输入">
        </el-input>
        <span class="ta-len">{{editdescLen}}/150</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {isvalidPhone} from '../contacts/js/validate.js';
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入电话号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  }
  export default {
    name: "editContactsInfo",
    props: {
      item: Object
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
        rules: {
          linkmanName: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          linkmanTag: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          remark: [
            {message: '请填写活动形式', trigger: 'blur'},{max:150,message:'超出最大字符范围',trigger:'change'}
          ],
          linkmanMobile: [
            { required: true, trigger: 'blur', validator: validPhone,message:'手机号格式不对' }
          ],
          linkmanTag: [
            {message: '请填写活动形式', required: true, trigger: 'blur'},{max:8,message:'超出最大字符范围',trigger:'change'}
          ]
        },
        isEdit:0
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
    methods: {
      submitForm() {
        this.$refs["item"].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('stationhandover/createProject/contactsUpdate'),
              method: 'post',
              data: this.$http.adornData({
                "id":this.item.id,"linkmanName":this.item.linkmanName,
                "linkmanMobile":this.item.linkmanMobile,
                "linkmanMail":this.item.linkmanMail,
                "linkmanTag":this.item.linkmanTag,"linkmanType":1
                ,"remark":this.item.remark
              })
            }).then(({data})=> {
              console.log(data);
              if (data.code == 0) {
                //alert(data.message);
                // this.dialogVisible=false;
                // this.$emit('isRefreshContacts');
                // this.$emit('isRefreshCount');
              }else{
                this.$message.error(data.message);
              }
            }).catch((res)=>{
              console.log(res)
            })
          } else {
            console.log('error submit!!');
            this.$message.error("请消除表单上的异常项");
            return false;
          }
        });

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
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
