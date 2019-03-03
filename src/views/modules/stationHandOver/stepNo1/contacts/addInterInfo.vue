<template>
  <div style="width:100%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: -8%;width:103%">
      <el-form-item label="姓名" prop="value9"  style=" height:34px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(138,139,153,1);line-height:34px;">
        <!--<el-input v-model="name" class="noneBorder"></el-input>-->
        <el-select v-model="value9" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" clearable placeholder="请选择" style="width: 100%; word-break: break-all;"
                   no-data-text="搜索不到匹配的内部工作人员请先在权限管理中创建账号">
          <el-option
            v-for="item in options4"
            :key="item.userId"
            :label="item.innerContactName"
            :value="item.userId"
            style="height: 68px;">
            <div>{{ item.innerContactName }}</div>
            <div style=" color: #8492a6; font-size: 13px">{{ item.mobile}}</div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机" prop="telephone" style="height:34px;border-radius: 0;" :class="showStyle()">
        <el-input v-model="telephone" class="noneBorder" style="border-style: none;!important;" readonly="true" onfocus="this.blur()" ref="marktel"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" style="height:34px;border-radius: 0" :class="showStyle()">
        <el-input v-model="email" class="noneBorder" style="border-style: none;!important;" onfocus="this.blur()"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="linkmanTag">
        <el-radio-group v-model="linkmanTag">
          <el-radio :label="1" style=" width:28px;height:20px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(62,62,71,1);line-height:20px;">站长</el-radio>
          <el-radio :label="2"  style=" width:28px;height:20px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(62,62,71,1);line-height:20px;">值长</el-radio>
          <el-radio :label="3"  style=" width:28px;height:20px;font-size:14px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(62,62,71,1);line-height:20px;">值班员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="8" maxlength="400" v-model="remark" placeholder="请输入" onKeyUp="javascript:checkWord(this);" onMouseDown="javascript:checkWord(this);" name="content" style="margin-bottom: -10px">
        </el-input>
        <span class="ta-len">{{editdescLen}}/400</span>
      </el-form-item>
    </el-form>
    <!--<input type="hidden" v-model="initVal">-->
  </div>
</template>
<script>
  // import {validInnerName} from '../contacts/js/validate.js';
  var isvalidInnerName=(rule, value,callback)=>{
    if(value.trim().length==0){
      callback(new Error('请填入需要新增的内部联系人姓名'));
    }
  }
  export default {
    name: "addContactsInfo",
    data() {
      return {
        options: [],
        states: ["Alabama", "Alaska", "Arizona",
          "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida",
          "Georgia", "Hawaii", "Idaho", "Illinois",
          "Indiana", "Iowa", "Kansas", "Kentucky",
          "Louisiana", "Maine", "Maryland",
          "Massachusetts", "Michigan", "Minnesota",
          "Mississippi", "Missouri", "Montana",
          "Nebraska", "Nevada", "New Hampshire",
          "New Jersey", "New Mexico", "New York",
          "North Carolina", "North Dakota", "Ohio",
          "Oklahoma", "Oregon", "Pennsylvania",
          "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas",
          "Utah", "Vermont", "Virginia",
          "Washington", "West Virginia", "Wisconsin",
          "Wyoming"],
        loading: false,
        options4:[],
        strtstr:'搜索不到匹配的内部工作人员'+'/n'+'请先在权限管理中创建账号',
        value9: [],
        list:[],
        value8: '',
        name: '',
        linkmanTag:'',
        remark:'',
        telephone:'',
        email:'',
        rules: {
          value9: [
            {required: true, message: '请选择要添加的内部联系人',validator:isvalidInnerName,trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          linkmanTag: [
            {required: true, message: '请选择身份', trigger: 'change' }
          ]
          // remark: [
          //   { message: '请填写活动形式', trigger: 'blur' }
          // ]
        },
        organizationId:'',
        innerUserName:'',
        optionList:[],
        toChangeClass: {
          isShow:false,
          isNotShow:true
        }
        // initVal:this.ruleForm.name
      }

    },
    computed: {
      editdescLen: function(){
        return this.remark.length;
      },
      editdescLen2: function(){
        return this.linkmanTag.length;
      }
    },
    props:{
      // organizationId:String,
      secondName:String,
      stationId:String
    },
    created(){
      // this.
    },
    mounted() {
      this.list = this.states.map(item => {
        return { value: item, label: item };
      });
    },
    methods: {
      submitForm() {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
           // alert(valid);
            var tag = this.linkmanTag;
            if(tag == 1) this.linkmanTag = '站长';
            else if(tag == 2) this.linkmanTag = '值长';
            else if(tag == 3) this.linkmanTag = '值班员';
            this.$http({
              url: this.$http.adornUrl('stationhandover/createProject/contactsSave'),
              method: 'post',
              data: this.$http.adornData({
                linkmanName:this.innerUserName,linkmanMobile:this.telephone,linkmanMail:this.email,linkmanTag: this.linkmanTag,remark:this.remark,linkmanType:0,powerStationId:this.stationId,innerUserId:"2"
              })
            }).then(({data})=> {
              if (data.code == 0) {
                this.name='',
                  this.linkmanTag='',
                  this.remark='',
                  this.email='',
                  this.desc='',
                  this.telephone='',
                  this.value9=[];
                return "123";
              }else{
                // if(this.telephone==''||this.email==''){
                //   this.$message.error("请选择内部可选联系人");
                //   return false;
                // }
                // if(this.linkmanTag.trim().length<=2){
                //   this.$message.error("必填项身份不可为空");
                //   return false;
                // }
                // this.$message.error(data.message);
              }
            }).catch((res)=>{
              console.log(res);
              // if(this.telephone==''||this.email==''){
              //   this.$message.error("请选择内部可选联系人");
              //   return false;
              // }
              // if(this.linkmanTag.trim().length<=2){
              //   this.$message.error("必填项身份不可为空");
              //   return false;
              // }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });



      },
      showStyle(){
        //alert(this.telephone+"....."+this.email);
        //alert(this.options4);
        //alert(this.telephone!==''||this.email!=='');
          if(this.telephone!=''||this.email!=''){
            return `isShow`;
          }else{
            return `isNotShow`;
          }
      },
      getInner(){
        if(this.name==''){
          this.telephone='';
          this.email='';
          return;
        }
        this.telephone='';
        this.email='';
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/innerContactsData'),
          method: 'post',
          data: this.$http.adornData({
            organizationId:this.$store._modules.root._children.user.state.organizationId,innerUserName:this.name
          })
        }).then(({data})=> {
          console.log(data)
          if (typeof(data.data)=="undefined") {
            this.telephone='';
            this.email='';
            this.options4=[];
          }else{
            this.states=data.contactsList
          }
        }).catch((res)=>{
          this.telephone='';
          this.email='';
          console.log(res)
        })
      },
      resetForm() {
        this.$refs["ruleForm"].resetFields();
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$http({
              url: this.$http.adornUrl('stationhandover/createProject/innerContactsData'),
              method: 'post',
              data: this.$http.adornData({
                organizationId:this.$store._modules.root._children.user.state.organizationId,innerUserName:query
              })
            }).then(({data})=> {
              if (typeof(data.data)=="undefined") {
                this.telephone='';
                this.email='';
                this.options4=[];
              } else{
                this.options4=data.data.contactsList;
                console.log(this.options4);
                for(var i=0;i<this.options4.length;i++){
                  this.states[i]=this.options4[i];
                }
              }
            }).catch((res)=>{
              this.telephone='';
              this.email='';
              console.log(res)
            })
          }, 200);
        } else {
          this.options4 = [];
        }
      }
    },
    watch:{
      value9:{
        handler(newVal,oldVal){
          //this.options4=[];
          console.log(newVal);
          for (let i in this.options4) {
            if (newVal === this.options4[i].userId) {
              this.telephone=this.options4[i].mobile;
              this.innerUserName=this.options4[i].innerContactName;
              this.email=this.options4[i].email;
              break;
            }
          }
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
  .isShow{
    display: inline-block;
  }
  .isNotShow{
    display: none;
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
  .noneBorder .el-input__inner{
      border:none !important;
    cursor:default !important;
    }
  .noneBorder .el-input__inner :focus{
    cursor:default!important;
  }
</style>
