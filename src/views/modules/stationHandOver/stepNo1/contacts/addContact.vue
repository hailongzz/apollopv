<template>
    <div style="width: 33%;margin-top:10px; margin-bottom:5px;padding-left: 1px;" id="hoverController">
      <div style="width: 95%;rgba(255,255,255,1);"  @click="dialogVisible = true"  @mouseover="enterColor" @mouseout="leaveColor">
        <el-card class="box-card add_Inventory"  style="-webkit-box-shadow:none !important;box-shadow: none !important;" id="add_Inventory" >
          <div style="text-align: center; padding-top: 35px;">
            <div style="text-align: center;margin-bottom: 3px">
              <div style="width:60px;height:60px;margin:0 auto">
                <div class="normalCross1" id="normalCross11"></div>
                <div class="normalCross2" id="normalCross22"></div>
                <div class="normalCross3" id="normalCross33"></div>
                <div class="normalCross4" id="normalCross44"></div>
              </div>
            <div class="actionDesc"><a style="color:rgba(164,165,179,1);" id="actionDesc1">新增外部联系人</a></div>
          </div>
          </div>
        </el-card>
      </div>
      <el-dialog
        title="新增外部工作人员"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose" style="margin-left:2%" id="dialog">
        <div style="margin-left:20px;position: absolute; top: 50px; left: 0;">
          <i class="el-icon-warning" id="formTipIconStyle"></i>
          <span class="formTipStyle">
      提交后我们将发送短信和邮件给该联系人
      </span>
        </div>
        <addContactsInfo  ref="exterForm" id="exterForm" :stationId="stationId"></addContactsInfo>
        <span slot="footer" class="dialog-footer">
    <el-button @click="doCanel" class="toCancel">取 消</el-button>
    <el-button :plain="true"  type="primary" @click="submitExter()">提交</el-button>
          <!--<div class="opts">-->
          <!--<i class="cancle" @click="doCanel">取消</i>-->
          <!--<i class="submit"  @click="submitExter()">提交</i>-->
          <!--&lt;!&ndash;<i class="submit disabled" v-if="!uploadBtnStatus" @click="submitqxForm">提交</i>&ndash;&gt;-->
        <!--</div>-->
  </span>
      </el-dialog>
    </div>
</template>
<script>
  import addContactsInfo from "../contacts/addContactsInfo"
    export default {
        name: "ContactsList",
      data() {
        return {
          dialogVisible: false,
          exterRuleForm:{
            name: '',
            tip:'',
            remark:'',
            email:'',
            desc:'',
            telephone:''
          },
          powerStationId:''
        };
      },
      props:{
        stationId:String
      },
      methods: {
        handleClose(){
          this.$refs.exterForm.resetForm();
          this.dialogVisible=false;
        },
        submitExter(){
          this.$refs.exterForm.submitForm();
          this.$emit(`isRefreshContacts`);
          this.$emit(`isRefreshCount`);
          this.dialogVisible=false;
        },
        doCanel(){
          this.dialogVisible =false;
          this.$refs.exterForm.resetForm();
        },
        enterColor(){
          console.log("enterenter");
          console.log("开始鼠标1111111进入事件");
          document.getElementById("add_Inventory").style.borderColor="#328FE6";
          document.getElementById("normalCross11").style.borderColor="#328FE6";
          document.getElementById("normalCross22").style.borderColor="#328FE6";
          document.getElementById("normalCross33").style.borderColor="#328FE6";
          document.getElementById("normalCross44").style.borderColor="#328FE6";
          document.getElementById("actionDesc1").style.color="#328FE6";
        },
        leaveColor(){
          //alert("enterenter");
          document.getElementById("add_Inventory").style.borderColor="#C5C5D1";
          document.getElementById("normalCross11").style.borderColor="#C5C5D1";
          document.getElementById("normalCross22").style.borderColor="#C5C5D1";
          document.getElementById("normalCross33").style.borderColor="#C5C5D1";
          document.getElementById("normalCross44").style.borderColor="#C5C5D1";
          document.getElementById("actionDesc1").style.color="#C5C5D1";
        },
      },
      components:{
        addContactsInfo
      },
      created(){
      }
    }

</script>

<style scoped>
  .out{
    border-color: gray;
  }
  .over{
    border-color: red;
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
  .formTipStyle{
    width:251px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#A4A5B3;
    line-height:20px;
  }
  .toCancel hover{
    background-color:rgba(195,210,210,0.6);
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
    background:rgba(255,255,255,1);
    /*border:1px solid rgba(215,216,224,0.6);*/
  }
  .actionDesc{
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    padding-top: 15px;
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
  #hoverController,.normalCross1 :hover {
    border-color: #3b8bfb;
  }
  /*.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover*/
  /*#hoverController,* :hover{*/
    /*border-color: #3b8bfb;*/
  /*}*/
</style>
<style>
  a{
       text-decoration: none;
       cursor: pointer;
     }
  a:focus a:hover{
    text-decoration: none;
    cursor: pointer;
  }
</style>
<style lang="scss">
  @import '../../../../../assets/scss/stationHandOver/public.scss';
  @import '../../../../../assets/scss/stationHandOver/stepNo3.scss';
</style>
