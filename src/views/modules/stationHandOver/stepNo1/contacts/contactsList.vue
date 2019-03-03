<template>
  <div style="float: left;width:33%;margin-bottom:5px;margin-top: 10px; padding-left: 1px;" id="xxx">
    <div style="width: 95%; ">
      <el-card class="box-card" style="padding: 0px;width: 100%; height: 208px;border-radius: 0">
        <div class="contactInfoActionDiv1"><label class="contactNameStyle">{{item.linkmanName}}</label><div class="contactRoleDiv"><span class="contactRoleSpan">{{item.linkmanTag}}</span></div></div>
        <div class="contactInfoActionDiv2"><label class="contactTelephoneStyle">电话</label><span class="contactTelephoneContentStyle">{{item.linkmanMobile|telephoneFormat}}</span></div>
        <div class="contactInfoActionDiv3"><label class="contactEmailStyle">邮箱</label><span class="contactEmailContentStyle">{{item.linkmanMail}}</span></div>
        <div class="contactInfoActionDiv4"><label class="contactRemarkContentStyle">{{item.remark|ellipsis}}</label></div>
        <div class="rowline"></div>
        <div class="contactInfoActionDiv5">
          <div class="contactInfoButton contactInfoActionEdit"><a class="contactInfoActionLabel" id="toEdit" @click="toEdit()">编辑</a></div>
          <div id="spea"></div>
          <div class="contactInfoButton contactInfoActionDelete"><a class="contactInfoActionLabel" @click="toDelete1">删除</a></div>
        </div>
        <input type="hidden" value="" name="linkmanName" id="linkmanName">
        <input type="hidden" value="" name="linkmanTag" id="linkmanTag">
        <input type="hidden" value="" name="linkmanMobile" id="linkmanMobile">
        <input type="hidden" value="" name="linkmanMail" id="linkmanMail">
        <input type="hidden" value="" name="remark" id="remark">
      </el-card>
    </div>
    <el-dialog
      title="修改外部工作人员"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose" style="margin-left:2%">
      <div style="margin-left:20px;position: absolute; top: 50px; left: 0;">
        <i class="el-icon-info" id="formTipIconStyle"></i>
        <span class="formTipStyle">
      提交后我们将发送短信和邮件给该联系人
      </span>
      </div>
      <editContactsInfo :item="this.item" ref="exterForm"></editContactsInfo>
      <span slot="footer" class="dialog-footer">
    <el-button @click="doCancel" class="toCancel">取 消</el-button>
    <el-button type="primary" @click="edit()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="确认删除"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose" style="margin-left:2%">
      <div style="margin-left:20px;position: absolute; top: 50px; left: 0;">
        <!--<i class="el-icon-info" id="isDelete"></i>-->
        <span class="formTipStyle">
      确认删除后将不可恢复,是否删除?
      </span>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false" class="toCancel">取 消</el-button>
    <el-button type="primary" @click="toDelete2">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import editContactsInfo from "./editContactsInfo"
  export default {
    name: "ContactsList",
    data() {
      return {
        dialogVisible:false,
        dialogVisible2:false,
        exterList:[],
        exterCount:0,
        interCount:0,
        exterInitForm:{},
        exterResultForm:{
          name:'',
          tip:'',
          remark:'',
          email:'',
          desc:'',
          telephone:''
        },
        isDelete:false,
        powerStationId:'',
        skin:'',
        BaseVal:{
          name:'',
          tip:'',
          remark:'',
          email:'',
          desc:'',
          telephone:''
        }
      };
    },
    props:{
      item:Object,
      index:Number,
      stationId:String
    },
    methods:{
      handleClose(done){
        this.item.linkmanName=document.getElementById("linkmanName").value;
        this.item.linkmanTag=document.getElementById("linkmanTag").value;
        this.item.linkmanMobile=document.getElementById("linkmanMobile").value;
        this.item.remark=document.getElementById("remark").value;
        this.item.linkmanMail=document.getElementById("linkmanMail").value;
        this.dialogVisible=false;
        done();
      },
      doCancel(){
        this.item.linkmanName=document.getElementById("linkmanName").value;
        this.item.linkmanTag=document.getElementById("linkmanTag").value;
        this.item.linkmanMobile=document.getElementById("linkmanMobile").value;
        this.item.remark=document.getElementById("remark").value;
        this.item.linkmanMail=document.getElementById("linkmanMail").value;
        this.dialogVisible = false
      },
      toDelete1(){
        //alert("开始delete1");
        this.dialogVisible2=true;
      },
      toDelete2(){
       // alert("开始delete2");
          this.isDelete=true;
          this.dialogVisible2=false;
          this.toDelete3();
      },
      toDelete3(){
        //alert("开始删除");
        var pointer="pointer"+this.index;
        document.getElementById("xxx").setAttribute("id",pointer);
        //alert(document.getElementById(pointer));
        var _this = this;
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/innerContactsDelete/'+this.item.id),
          method: 'post',
          data: this.$http.adornData({
            powerStationId:this.stationId,linkmanType:1
          })
        }).then(({data})=> {
         // alert(data.message);
          if (data.code == 0) {
            // this.$emit('isRefreshContacts');
            // this.$emit('isRefreshCount');
            var pointer="pointer"+this.index;
            var el=document.getElementById(pointer);
            el.remove();
            // alert("elel"+el);
            // alert(el.getAttribute("id"));
           // document.getElementById("xxx").setAttribute("id",pointer);
           // alert(document.getElementById(pointer));
          }else{
            _this.$message.error(data.message);
          }
        }).catch((res)=>{
          console.log(res)
        })
      },
      toEdit(){
        this.dialogVisible=true;
      },
      edit(){
        this.$refs.exterForm.submitForm();
        this.dialogVisible=false;
      },
      isRefreshContacts(){
        //alert("刷！");
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/contactsSelect'),
          method: 'post',
          data: this.$http.adornData({
            powerStationId:this.stationId,linkmanType:1
          })
        }).then(({data})=> {
          if (data.code == 0) {
            this.exterList=data.data.contactsList;
            console.log("实时刷新end外部联系人");
          }
        }).catch((res)=>{
          console.log(res)
        })
      },
      isRefreshCount(){
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/contactsCount'),
          method: 'post',
          data: this.$http.adornData({
            powerStationId:this.stationId
          })
        }).then(({data})=> {
          if (data.code == 0) {
            this.exterCount=data.data.outContactsTotal;
            this.interCount=data.data.innerContactsTotal;
            console.log("刷新个数end");
          }
        }).catch((res)=>{
          console.log(res)
        })
      },
    },
    created(){
    },
    components:{
      editContactsInfo
    },
    filters: {
      ellipsis (value) {
        if (!value) return ''
        if (value.length > 35) {
          return value.slice(0,35) + '...'
        }
        return value
      },
      telephoneFormat(value){
        if (!value) return ''
        if (value.length > 0) {
          // return value.slice(0,35) + '...'
          // var telHead=value.substring(0,2)+" "+value.substring(2,6)+" "+value.substring()
          var phone = value.toString();
          var realPhone=phone.substr(0, 3)+' '+phone.substr(3, 4)+' '+phone.substr(7, 4);
          // phone.substr(3, 4);
          // phone.substr(7, 4);
          return realPhone;
        }
        return value
      }
    },
    created(){
      document.getElementById("linkmanName").value=this.item.linkmanName;
      document.getElementById("linkmanTag").value=this.item.linkmanTag;
      document.getElementById("linkmanMobile").value=this.item.linkmanMobile;
      document.getElementById("remark").value=this.item.remark;
      document.getElementById("linkmanMail").value=this.item.linkmanMail;
      // alert(document.getElementById("linkmanName").value);
    }
  }
</script>
<style scoped>
  .contactInfoButton :hover{
    color:#328FE6;
  }
  .contactInfoActionDiv2{
    margin: 10px 0px;
  }
  .contactInfoActionDiv5{
    width:100%;
  }
  .el-card__body{
    margin-bottom:13%;
  }
  #spea{
    float: left;
    width: 2%;
    border-left: 1px solid #cccccc;
    height: 20px;
    margin-top: 10px;
  }
  .contactTelephoneContentStyle,.contactEmailContentStyle{
    width:194px;
    height:24px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(62,62,71,1);
    line-height:26px;
    margin-left: 14px;
    padding-top:1px;
    padding-bottom: 1px;
  }

  .contactEmailContentStyle{
    margin-bottom: 18px;
  }
  .contactInfoButton{
    height: 40px;
    width: 49%;
    float: left;
    line-height: 32px;
    text-align: center;
    background-color: #fbfbfd;
  }
  .contactInfoActionLabel{
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
  }
  .contactTelephoneStyle,.contactEmailStyle{
    width:28px;
    height:24px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:26px;
    clear: both;
    margin-left: 24px;
    padding-top:1px;
    padding-bottom: 1px;
  }
  .clear{
    display: inline-block;
    clear: both;
    overflow: hidden;
  }
  .box-card {
    width: 362px;
    height: 220px;
    float: left;
    padding: 0px;
  }
  .contactInfoActionDiv{
    float: left;
    width:49%;
    height:20px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:20px;
    text-align: center;
  }
  .contactNameStyle{
    width:54px;
    height:20px;
    font-size:18px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(33,32,41,1);
    line-height:20px;
    margin-left: 24px;
  }
  .contactRoleDiv{
    width:90px;
    height:20px;
    background:rgba(252,173,35,1);
    border-radius:2px;
    opacity:0.9;
    display: inline-block;
    margin-left: 12px;
  }
  .contactRoleSpan{
    width:60px;
    height:20px;
    font-size:12px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:20px;
    margin-left: 8px;
  }
  .contactRemarkContentStyle{
    width:302px;
    height:60px;
    font-size:12px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(164,165,179,1);
    line-height:60px;
    margin-left: 24px;
    margin-bottom: 19px;
    margin-top: 18px;
  }
  .box-card .el-card__body{
    padding: 0px;
  }
  .rowline{
    width:110%;
    height:1px;
    opacity:0.4;
    border:1px solid rgba(215,216,224,1);
    margin-left: -20px;
  }
</style>
