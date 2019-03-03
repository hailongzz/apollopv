<template>
    <div style="width: 33%;margin-top:10px; margin-bottom:5px;padding-left: 1px;">
      <div style="width: 95%;background:rgba(245,245,250,0.6);"  @click="dialogVisible = true" id="hoverClass"  @mouseover="enterColor" @mouseout="leaveColor">
        <el-card class="box-card add_Inventory" style="-webkit-box-shadow:none !important;box-shadow: none !important;" id="boxCard">
          <!--@mouseenter="enter(index)" @mouseleave="leave()"-->
          <!--$event-->
          <div style="text-align: center; padding-top: 35px;margin-bottom: 3px">
            <div style="width:60px;height:60px;margin:0 auto" >
              <div class="normalCross1" id="normalCross1"></div>
              <div class="normalCross2" id="normalCross2"></div>
              <div class="normalCross3"  id="normalCross3"></div>
              <div class="normalCross4"  id="normalCross4"></div>
            </div>
            <div class="actionDesc"><a style="color:rgba(164,165,179,1);" id="actionDesc">新增内部工作人员</a></div>
          </div>
        </el-card>
      </div>
      <el-dialog
        title="新增内部工作人员"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div style="margin-left:20px;position: absolute; top: 50px; left: 0;">
          <i class="el-icon-warning" id="formTipIconStyle"></i>
          <span class="formTipStyle">
      提交后我们将发送短信和邮件给该联系人
      </span>
        </div>
        <addInterInfo :secondName="name" ref="exterForm" id="exterForm" :stationId="stationId"></addInterInfo>
        <span slot="footer" class="dialog-footer">
    <el-button @click="doCanel()" class="toCancel">取 消</el-button>
    <el-button type="primary" @click="submit()">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
  import addInterInfo from "../contacts/addInterInfo"
    export default {
        name: "ContactsList",
      data() {
        return {
          dialogVisible: false,
          exterRuleForm:{
            innerUserName:'',
            name: '',
            linkmanTag:'',
            remark:'',
            email:'',
            desc:'',
            telephone:''
          },
          // organizationId:'',
        };
      },
      props:{
        stationId:String,
        organizationId:String,
        name:String
      },
      created(){
       // alert("addInter中的"+this.organizationId);
      },
      methods: {
        enterColor(){
          console.log("enterenter");
              console.log("开始鼠标进入事件")
              document.getElementById("boxCard").style.borderColor="#328FE6";
              document.getElementById("normalCross1").style.borderColor="#328FE6";
              document.getElementById("normalCross2").style.borderColor="#328FE6";
              document.getElementById("normalCross3").style.borderColor="#328FE6";
              document.getElementById("normalCross4").style.borderColor="#328FE6";
              document.getElementById("actionDesc").style.color="#328FE6";
        },
        leaveColor(){
          //alert("enterenter");
          document.getElementById("boxCard").style.borderColor="#C5C5D1";
          document.getElementById("normalCross1").style.borderColor="#C5C5D1";
          document.getElementById("normalCross2").style.borderColor="#C5C5D1";
          document.getElementById("normalCross3").style.borderColor="#C5C5D1";
          document.getElementById("normalCross4").style.borderColor="#C5C5D1";
          document.getElementById("actionDesc").style.color="#C5C5D1";
        },
        doCanel(){
          this.dialogVisible = false,
            this.$refs.exterForm.value9=[];
          this.$refs.exterForm.name='';
          this.$refs.exterForm.remark='';
          this.$refs.exterForm.telephone='';
          this.$refs.exterForm.email='';
          this.$refs.exterForm.linkmanTag='';
          this.$refs.exterForm.resetForm();
        },
        submit(){
          this.$refs.exterForm.submitForm();
          //alert("addInter新增的stationID为"+this.stationId);

         //  this.$refs.exterForm.submitForm();
         //
         //  var _this = this;
         //  this.exterRuleForm.name=this.$refs.exterForm.innerUserName;
         //  var tag = this.$refs.exterForm.linkmanTag;
         //  if(tag == 1) this.exterRuleForm.linkmanTag = '站长';
         // else if(tag == 2) this.exterRuleForm.linkmanTag = '值长';
         //  else if(tag == 3) this.exterRuleForm.linkmanTag = '值班员';
         //  this.exterRuleForm.remark=this.$refs.exterForm.remark;
         //  this.exterRuleForm.email=this.$refs.exterForm.email;
         //  this.exterRuleForm.desc=this.$refs.exterForm.desc;
         //  this.exterRuleForm.telephone=this.$refs.exterForm.telephone;
         //  console.log(this.exterRuleForm.name);
         //  console.log(this.exterRuleForm.linkmanTag);
         //  console.log(this.exterRuleForm.remark);
         //  console.log(this.exterRuleForm.email);
         //  console.log(this.exterRuleForm.desc);
         //  console.log(this.exterRuleForm.telephone);
         //  //alert("执行内部联系人的新增");
         //  this.$http({
         //    url: this.$http.adornUrl('stationhandover/createProject/contactsSave'),
         //    method: 'post',
         //    data: this.$http.adornData({
         //      linkmanName:this.exterRuleForm.name,linkmanMobile:this.exterRuleForm.telephone,linkmanMail:this.exterRuleForm.email,linkmanTag: this.exterRuleForm.linkmanTag,remark:this.exterRuleForm.remark,linkmanType:0,powerStationId:this.stationId,innerUserId:"2"
         //    })
         //  }).then(({data})=> {
         //    // alert("实现新增外部联系人接口成功！！"+data.message);
         //    if (data.code == 0) {
         //      this.$refs.exterForm.name='',
         //        this.$refs.exterForm.linkmanTag='',
         //        this.$refs.exterForm.remark='',
         //        this.$refs.exterForm.email='',
         //        this.$refs.exterForm.desc='',
         //        this.$refs.exterForm.telephone='',
         //        this.dialogVisible=false;
         //      this.$refs.exterForm.value9=[];
         //      //alert("点击提交后进行的刷新内部联系人");
         //      this.$emit('isRefreshInter');
         //      //alert("点击提交后进行的刷新联系人数量");
         //      this.$emit('isRefreshCount');
         //      this.dialogVisible=false;
         //    }else{
         //      if(this.$refs.exterForm.telephone==''||this.$refs.exterForm.email==''){
         //        this.$message.error("请选择内部可选联系人");
         //        return false;
         //      }
         //      if(this.$refs.exterForm.linkmanTag.trim().length<=2){
         //        this.$message.error("必填项身份不可为空");
         //        return false;
         //      }
         //      //_this.$message.error(data.message);
         //    }
         //  }).catch((res)=>{
         //    console.log(res)
         //  })
        }
      },
      components:{
        addInterInfo
      }
    }
</script>

<style scoped>
  .formTipStyle{
    width:251px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#A4A5B3;
    line-height:20px;
  }
  .normalCross1{
    width:30px;height:30px;float: left;border-right: 1px solid #c4c4c4;border-bottom:1px solid #c4c4c4
  }
  .normalCross2{
    width:30px;height:30px;float: left;border-left: 1px solid #c4c4c4;border-bottom:1px solid #c4c4c4
  }
  .normalCross3{
    width:30px;height:30px;float: left;border-top: 1px solid #c4c4c4;border-right:1px solid #c4c4c4
  }
  .normalCross4{
    width:30px;height:30px;float: left;border-top: 1px solid #c4c4c4;border-left:1px solid #c4c4c4
  }
  .add_Inventory{
    border:1px dashed  #C5C5D1;border-radius: 0;
    cursor: pointer;

  }
  .add_Inventory:hover{
    /*background:rgba(195,210,210,0.6);*/
  }
  #formTipIconStyle{
    width:14px;
    height:14px;
    /*background:rgba(164,165,179,1);*/
    margin-right: 3px;
  }
  .toSubmit{
    width:80px;
    height:34px;
    background:linear-gradient(315deg,rgba(53,92,219,1) 0%,rgba(49,107,227,1) 100%);
    border-radius:2px;
    opacity:0.4;
  }
  .box-card {
    width: 100%;
    height: 208px;
    /*background:rgba(245,245,250,0.6);*/
    /*border:1px solid rgba(215,216,224,0.6);*/
  }
  .actionDesc{
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(164,165,179,1);
    padding-top: 15px;
  }
  #hoverClass:hover
</style>
