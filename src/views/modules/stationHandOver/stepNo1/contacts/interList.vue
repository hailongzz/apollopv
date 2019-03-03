<<template>
  <div style="float: left;width:33%;margin-bottom:5px;margin-top: 10px; padding-left: 1px;" id="xxx">
    <div style="width: 95%; ">
      <el-card class="box-card" style="padding: 0px;width: 100%; height: 208px;border-radius: 0">
        <div class="contactInfoActionDiv1"><label class="contactNameStyle">{{item.linkmanName}}</label><div class="contactRoleDiv" :class="classChange()"><div class="contactRoleSpan">{{item.linkmanTag}}</div></div></div>
        <div class="contactInfoActionDiv2"><label class="contactTelephoneStyle">电话</label><span class="contactTelephoneContentStyle">{{item.linkmanMobile|telephoneFormat}}</span></div>
        <!--{{item.linkmanMobile}}-->
        <div class="contactInfoActionDiv3"><label class="contactEmailStyle">邮箱</label><span class="contactEmailContentStyle">{{item.linkmanMail}}</span></div>
        <div class="contactInfoActionDiv4"><label class="contactRemarkContentStyle">{{item.remark|ellipsis}}</label></div>
        <div class="rowline"></div>
        <div class="contactInfoActionDiv5">
          <div class="contactInfoButton contactInfoActionEdit"><a class="contactInfoActionLabel" id="toEdit" @click="toEdit()">编辑</a></div>
          <div id="spea"></div>
          <div class="contactInfoButton contactInfoActionDelete"><a class="contactInfoActionLabel" @click="toDelete1">删除</a></div>
        </div>
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
      <editInterInfo :item="item" ref="editInter"></editInterInfo>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" class="toCancel">取 消</el-button>
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
  import editInterInfo from "../contacts/editInterInfo"
  export default {
    name: "interList",
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
        toChangeClass: {
          green: false,
          blue: false,
          secblue:false
        },
        totalCount:0
      };
    },
    props:{
      item:Object,
      key:Number,
      index:Number,
      stationId:String
    },
    created() {
      var pointer="pointer"+this.index;
      document.getElementById("xxx").setAttribute("id",pointer);
      alert(document.getElementById(pointer));
      // alert(this.index);
      // alert(this.key);
      // console.log(document.getElementsByClassName("divv").index);
      // console.log("=========================");
      // console.log(document.getElementsByClassName("divv"));
      //alert("传进来的index"+this.index);
      //this.totalCount++;
    },
    methods:{
      toDelete1(){
        //alert("开始delete1");
        this.dialogVisible2=true;
      },
      toDelete2(){
        this.isDelete=true;
        this.dialogVisible2=false;
        this.toDelete3();
      },
      toDelete3(){
        // var id2 =index;
        // alert(id2);
        var _this = this;
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/innerContactsDelete/'+this.item.id),
          method: 'post',
          data: this.$http.adornData({
            powerStationId:this.stationId,linkmanType:1
          })
        }).then(({data})=> {
          if (data.code == 0) {
            //document.getElementsByClassName("divv")[this.index].remove();
            //alert("id为"+document.getElementById(pointer).getAttribute("id"));
            //this.list.splice(e,1);
            // "pointer"+this.index
            var el=document.getElementById("pointer"+this.index);
            alert("elele为"+el);
            el.remove();
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
      classChange(){
        if(this.item.linkmanTag==="站长"){
          // this.toChangeClass.blue=true;
          return `blue`
        }else if(this.item.linkmanTag==="值长"){
          // this.toChangeClass.secblue=true;
          return `secblue`
        }else{
          // this.toChangeClass.green=true;
          return `green`
        }
      },
      edit(){
        var _this = this;
        //alert("edit的remark为"+this.$refs.editInter.remark);
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/contactsUpdate'),
          method: 'post',
          data: this.$http.adornData({
            "id":this.item.id,"linkmanName":this.$refs.editInter.name,
            "linkmanMobile":this.$refs.editInter.telephone,
            "linkmanMail":this.$refs.editInter.email,
            "linkmanTag":this.$refs.editInter.tip,"linkmanType":0
            ,"remark":this.$refs.editInter.remark
          })
        }).then(({data})=> {;
          if (data.code == 0) {
            if(this.$refs.editInter.tip==="站长"){
              //alert("titopt站长");
              this.toChangeClass.blue=true;
            }else if(this.$refs.editInter.tip==="值长"){
              //alert("titopt值长");
              this.toChangeClass.secblue=true;
            }else if(this.$refs.editInter.tip==="值班员"){
              //alert("titopt值班员");
              this.toChangeClass.green=true;
            }
            this.dialogVisible=false;
            this.$emit('isRefreshInter');
            this.$emit('isRefreshCount');
          }else{
            _this.$message.error(data.message);
          }
        }).catch((res)=>{
          console.log(res)
        })
      },
    },
    components:{
      editInterInfo
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
   mounted(){
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
      },
      totalCount:{
        handler(newVal,oldVal){
            if(newVal<oldVal){

            }
        }
      }
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
    height: 211px;
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
    border-radius:2px;
    opacity:0.9;
    display: inline-block;
    margin-left: 12px;
  }
  .blue{
    background:#3B75F1;
  }
  .secblue{
    background: rgba(72,173,234,1);
  }
  .green{
    background:rgba(77,196,152,1)
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
    text-align: center;
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
