<template>
  <div ref="newItemWrap">
    <el-row :gutter="23" class="newItemWrap">
      <el-col :span="8" class="basicInfo">
        <div class="newItem">
          <el-row class="infoHeader">
          <h4>基本信息</h4>
          <span class="floatRight" @click="editVisible = true" v-if="canEdit">编辑</span>
          <span class="floatRight" v-else>编辑</span>
          </el-row>
          <div class="infoContent">
            <div>
              <span class="label">电站名称&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.stationName}}</span>
            </div>
            <div>
              <span class="label">所属业主&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.customerName}}</span>
            </div>
            <div>
              <span class="label">所属地区&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.provinceName}}/{{basicInfo.cityName}}/{{basicInfo.areaName}}</span>
            </div>
            <div>
              <span class="label">详细地址&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.powerstationAddress}}</span>
            </div>
            <div>
              <span class="label">并网日期&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.combineDate|timeFormat}}</span>
            </div>
            <div>
              <span class="label">电站类型&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.stationType|stationTypeMapObj}}</span>
            </div>
            <div>
              <span class="label">并网类型&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.combineType|gridTypeMapObj}}</span>
            </div>
            <div>
              <span class="label">组建容量&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.installedCapacity}} kWp</span>
            </div>
            <div>
              <span class="label">度电收益&nbsp;&nbsp;</span>
              <span class="content">{{basicInfo.profits}} 元/kWh</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="contract">
        <div class="newItem">
          <el-row class="infoHeader">
            <h4>联系人</h4>
          </el-row>
          <div class="infoContent">
            <!--$router.push({name: 'stationHandOver-stepNo1-contacts-contactsTab',query:{stationId:this.powerStationId}})-->
              <div class="contractItem" @click="goContactsTab1" id="FTab1" @mouseenter="doTab1">
              <span>内部工作人员</span>
              <div class="contractNum" id="Tab1Num">{{innerContactsTotal}}</div>
              <el-button class="addBtn" @click="toAddInter($event)">新增</el-button>
            </div>
            <div class="contractItem" @click="goContactsTab2" id="FTab2">
              <span>外部联系人</span>
              <div class="contractNum" id="Tab2Num">{{outContactsTotal}}</div>
              <el-button class="addBtn" @click="toAddContacts($event)">新增</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="service">
        <div class="newItem">
          <el-row class="infoHeader">
            <h4>服务项目</h4>
            <span class="floatRight" @click="dialogVisible=true" v-if="(Array.isArray(selectedList)&&selectedList.length>0)">配置</span>
          </el-row>
          <div class="infoContent">
            <div v-if="(Array.isArray(selectedList)&&selectedList.length>0)">
              <el-row class="selectedTitle">运维服务（已开通{{selectedList.length}}项）
                <span class="floatRight">开通情况</span>
              </el-row>
              <div class="selectedItemWrap">
                <el-row v-for="(item,index) in selectedList" :key="index" class="selectedItem">
                  {{item.serviceItemName}}
                  <span class="floatRight">
                    <i class="el-icon-check"></i>
                  </span>
                </el-row>
              </div>
            </div>
            <div class="noDataWrap" v-else>
              <p>您还没有配置服务项目</p>
              <el-button @click="dialogVisible=true" class="addBtn">配置服务项目</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="largeDialog">
    <el-dialog
            title="配置服务项目"
            :visible.sync="dialogVisible"
            width="35%"
            :before-close="handleClose">
            <config-item
              ref="configItem"
              :unselectedList="unselectedList"
              :defaultList="defaultList"
              :selectedList="selectedList1"
              @closeModal="dialogVisible = false"
            ></config-item>
             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfig">确 定</el-button>
            </span>
    </el-dialog>
    </div>
       <el-dialog
            title="编辑电站"
            :visible.sync="editVisible"
            width="45%"
            :before-close="handleClose"
        >
            <edit-station
              ref="addStationForm"
              :detail="basicInfo1"
              :powerStationId="powerStationId"
              @loadBasicInfo="loadBasicInfo"
            ></edit-station>

             <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStationConfirm">确 定</el-button>
            </span>
        </el-dialog>
    <el-dialog
      title="新增内部工作人员"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose"
      >
      <addInterInfo :secondName="name" ref="exterForm" id="exterForm" :stationId="stationId"></addInterInfo>
      <span slot="footer" class="dialog-footer">
    <el-button @click="doCancel2()" class="toCancel">取 消</el-button>
    <el-button type="primary" @click="submitInter()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="新增外部工作人员"
      :visible.sync="dialogVisible3"
      width="30%"
      :before-close="handleClose"
      style="margin-left:2%" id="dialog">
      <div style="margin-left:20px;position: absolute; top: 50px; left: 0;">
        <i class="el-icon-info" id="formTipIconStyle"></i>
        <span class="formTipStyle">
      提交后我们将发送短信和邮件给该联系人
      </span>
      </div>
      <addContactsInfo  ref="exterForm2" id="exterForm2" :stationId="stationId"></addContactsInfo>
      <span slot="footer" class="dialog-footer">
    <el-button @click="doCancel3()" class="toCancel">取 消</el-button>
    <el-button :plain="true"  type="primary" @click="submitExter()">提交</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import configItem from './configItem';
import newDialog from '../stationList/addStation'
import {statusMap,stationTypeMap,gridTypeMap,stationTypeMapObj,gridTypeMapObj} from '../dataMap.js'
import {cloneDeep} from 'lodash'
import addInterInfo from "./contacts/addInterInfo"
import addContactsInfo from "./contacts/addContactsInfo"
export default {
  data(){
    const {query:{powerStationId}} = this.$route
    return {
      dialogVisible:false,
      editVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      canEdit:false,
      basicInfo:{

      },
      basicInfo1:{},
      selectedList:[],
      defaultList:[],
      unselectedList:[],
      selectedList1:[],
      statusMap,stationTypeMap,gridTypeMap,stationTypeMapObj,gridTypeMapObj,
      innerContactsTotal:0,
      outContactsTotal:0,
      powerStationId,
      name:this.$store._modules.root._children.user.state.name,
      stationId:'',
      // isR:0

    }
  },
  props:{

  },
  components:{
    "config-item":configItem,
    "edit-station":newDialog,
    addInterInfo,
    addContactsInfo
  },
  created() {
    this.loadBasicInfo()
    this.loadConfigs()
    // this.loadContractNum()
    this.getStationId()
    this.isRefreshCount();
  },
  mounted() {
    // this.averageheight()
  },
  watch:{
    dialogVisible(newVal,oldVal){
      if(!newVal){
        this.loadConfigs()
      }
    }
  },
  methods:{
    handleClose(done) {
     this.isRefreshCount();
     done();
    },
    doTab1(){
      //document.getElementById("Tab1Num").style.color="#328FE6"
    },
    getStationId(){
      var url = document.location.toString();
      var arrUrl = url.split("?");
      var para = arrUrl[1];
      var key=para.split("=")[1];
      this.stationId=key;
    },
    doCancel2(){
     this.dialogVisible2 = false,
       // value9: [],
       //  list:[],
       //  value8: '',
       //  name: '',
       //  linkmanTag:'1',
       //  remark:'',
       //  telephone:'',
       //  email:'',
       this.$refs.exterForm.value9=[];
     this.$refs.exterForm.name='';
     this.$refs.exterForm.remark='';
     this.$refs.exterForm.telephone='';
     this.$refs.exterForm.email='';
     this.$refs.exterForm.linkmanTag='';
      this.$refs.exterForm.resetForm();
    },
    doCancel3(){
      this.dialogVisible3 = false;
      // this.$refs.exterForm2.ruleForm.telephone='';
      // this.$refs.exterForm2.ruleForm.desc='';
      // this.$refs.exterForm2.ruleForm.email='';
      // this.$refs.exterForm2.ruleForm.tip='';
      // this.$refs.exterForm2.ruleForm.remark=''
      this.$refs.exterForm2.resetForm();
    },
    toAddInter(event){
      event.cancelBubble = true;
      this.dialogVisible2=true;
    },
    submitExter(){
      this.isR++;
      this.$refs.exterForm2.submitForm();
      this.dialogVisible3=false;
    },
    loadBasicInfo(flag){
      if(flag){
        this.editVisible = false;
      }
      const {powerStationId} = this
      this.$http({
        url: this.$http.adornUrl(`stationhandover/createProject/info/${powerStationId}`),
        method: 'post',
      }).then(({data})=>{
        if(data.code==0){
          this.basicInfo = data.data&&data.data.gtStationInfo?data.data.gtStationInfo:{}
          this.basicInfo1 = cloneDeep(this.basicInfo)
          this.$emit("getStationName",this.basicInfo)
          this.canEdit = true;
        }
      })
    },
    loadConfigs(){
      const {powerStationId} = this
      this.$http({
        url: this.$http.adornUrl('stationhandover/createProject/cfgServiceList'),
        method: 'post',
        data: this.$http.adornData({
          powerStationId,
        })
      }).then(({data})=>{
        if(data.code==0){
          const {defaultList,selectedList,unselectedList} = data.data;
          this.defaultList = Array.isArray(defaultList)?defaultList:[]
          this.selectedList = Array.isArray(selectedList)?selectedList:[]
          this.unselectedList = Array.isArray(unselectedList)?unselectedList:[]
          this.selectedList1 =cloneDeep(Array.isArray(selectedList)?selectedList:[])
          this.selectSelected()
        }
      })
    },
    isRefreshCount(){
      //console.log('111111111');
      var url = document.location.toString();
      var arrUrl = url.split("?");
      var para = arrUrl[1];
      var key=para.split("=")[1];
      //alert("key"+key)
      this.$http({
        url: this.$http.adornUrl('stationhandover/createProject/contactsCount'),
        method: 'post',
        data: this.$http.adornData({
          powerStationId:key
        })
      }).then(({data})=> {
        if (data.code == 0) {
          //alert("isRefreshCount"+this.outContactsTotal);
          this.outContactsTotal=data.data.outContactsTotal;
          this.innerContactsTotal=data.data.innerContactsTotal;
          console.log("刷新个数end");
        }
      }).catch((res)=>{
        console.log(res)
      })
    },
    selectSelected(){
      const {defaultList,selectedList,unselectedList,selectedList1} = this;
      if(selectedList.length>0&&defaultList.length>0){
        defaultList.forEach((item)=>{
          const currentIndex = selectedList1.findIndex(item1=>item.id==item1.id)
          if(currentIndex>=0){
            this.selectedList1.splice(currentIndex,1)
          }
        })
      }
    },
    addConfig(){
      this.$refs.configItem.submit()
    },
    loadContractNum(){
      const {powerStationId} = this;
      this.$http({
        url: this.$http.adornUrl('stationhandover/createProject/contactsCount'),
        method: 'post',
        data: this.$http.adornData({
          powerStationId,
        })
      }).then(({data})=>{
        if(data.code==0){
          const {innerContactsTotal,outContactsTotal} = data;
          this.innerContactsTotal =innerContactsTotal||0
          this.outContactsTotal =outContactsTotal||0
        }
      })
    },
    averageheight(){
      const $newItemWrap  = this.$refs.newItemWrap
      const domArr = Array.from($newItemWrap.querySelectorAll('.newItemWrap>.el-col-8'))
      const heightArr  = domArr.map((item)=>{
        return parseFloat(this.getStyle(item,'height'))
      })
      const maxHeight = Math.max.apply(null,heightArr);
      domArr.forEach((item)=>{
        item.style.height = maxHeight+'px'
      })
    },
    addStationConfirm(){
      this.$refs.addStationForm.submit()
    },
    getStyle(element, attr) {
        if(element.currentStyle) {
                return element.currentStyle[attr];
        } else {
                return getComputedStyle(element, false)[attr];
        }
    },
    goContactsTab1(){
      var url = document.location.toString();
      var arrUrl = url.split("?");
      var para = arrUrl[1];
      var key=para.split("=")[1];
      //const {powerStationId} = this
        this.$router.push({
          path: 'stationHandOver-stepNo1-contacts-contactsTab',
          name: 'stationHandOver-stepNo1-contacts-contactsTab',
          query: {
            sendStationId: key
          }
        })
      },
    goContactsTab2(){
      var url = document.location.toString();
      var arrUrl = url.split("?");
      var para = arrUrl[1];
      var key=para.split("=")[1];
      //const {powerStationId} = this
      this.$router.push({
        path: 'stationHandOver-stepNo1-contacts-contactsTab',
        name: 'stationHandOver-stepNo1-contacts-contactsTab',
        query: {
          sendStationId: "AAAA="+key,
        }
      })
    },
    submitInter(){
      this.isR++;
      this.$refs.exterForm.submitForm();
      this.dialogVisible2=false;
       //alert("方法一执行完成执行方法2");
    },
    function2(){
      this.$refs.exterForm.submitForm();
      this.dialogVisible2=false;
      return Promise.resolve("成功执行")
    },
    function3(){
      this.$refs.exterForm2.submitForm();
      this.dialogVisible3=false;
      return Promise.resolve("成功执行")
    },
    toAddContacts(event){
      event.cancelBubble = true;
      this.dialogVisible3=true;
    }
    // function1(){
    //   this.function2().then(val => {
    //     this.function3();
    //   });
    // }
  },
  // watch:{
  //   isR:{
  //     handler(newVal,oldVal){
  //       alert("axaszazsasx"+this.isR);
  //      this.isRefreshCount();
  //     }
  //   }
  // },

  filters:{
    timeFormat(value){
      if(value){
        const date = new Date(value)
        const year = date.getFullYear()
        const month = date.getMonth()+1
        const day = date.getDate()
        return `${year}年${month>=10?month:"0"+month}月${day>=10?day:"0"+day}日`
      }
    },
    stationTypeMapObj(value){
      return stationTypeMapObj[value]
    },
    gridTypeMapObj(value){
      return gridTypeMapObj[value]
    },
  }
}
</script>

<style scope lang="scss">
   .el-button{
      // width:80px;
      padding:13px 20px!important;
    }
   .largeDialog{
    .el-dialog{
      min-width: 800px;
    }
  }
  .newItemWrap{
    background:rgba(248,248,248,1);
    margin: 0 -20px 0;
    padding:10px 30px;
    &>.el-col{
    }
    .newItem{
      background:rgba(255,255,255,1);
      border:1px solid rgba(215,216,224,0.6);
      padding:0 20px;
      position: relative;
      padding-top: 74px;
      height: calc(100vh - 300px);
      .infoHeader{
        margin:10px 0;
        position: absolute;
        top:0;
        width: calc(100% - 40px);
        h4{
          font-size:18px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(16,16,21,1);
        }
      }
      .orderContent{
        max-height:346px;
        overflow: auto;
      }
    }
    .basicInfo{
      .infoHeader{
        h4{
          display: inline-block;
        }
        span{
          height:54px;
          line-height: 54px;
          font-size:14px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:#328FE6;
          cursor: pointer;
        }
      }
      .infoContent{
        font-size:14px;
        margin-top: -8px;
        // max-height: 350px;
        // overflow: auto;
        &>div{
          margin-bottom: 5px;
        }
        .label{
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(138,139,153,1);
          line-height:34px;
        }
        .content{
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(33,32,41,1);
          line-height:34px;
        }
      }
    }
    .contract{
      .contractItem{
        padding:25px 20px;
        background:rgba(245,245,250,1);
        opacity:0.6;
        margin-bottom: 10px;
        position: relative;
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:bold;
        color:rgba(33,32,41,1);
        cursor: pointer;
        span{
          font-size: bold;
          color: #212029;
          font-size: 15px;
        }
        &:hover{
          .contractNum{
            color:#328FE6;
          }
        }
        .contractNum{
          font-size:24px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(33,32,41,1);
          line-height:22px;
          margin-top: 15px;
          font-weight:bold;
        }
        .addBtn{
          position: absolute;
          top:50%;
          right:20px;
          color:#328FE6;
          border: 1px solid currentColor;
          transform: translate(0,-50%);
          -moz-transform: translate(0,-50%);
          -o-transform: translate(0,-50%);
          -ms-transform: translate(0,-50%);
          background:rgba(245,245,250,1);
        }
      }
    }
    .service{
      .infoHeader{
        h4{
          display: inline-block;
        }
        span{
          height:54px;
          line-height: 54px;
          font-size:14px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:#328FE6;
          cursor: pointer;
        }
      }
      .noDataWrap{
        text-align: center;
        .addBtn{
          color:#328FE6;
          border: 1px solid currentColor;
        }
      }
      .infoContent{
        .selectedItemWrap{
          overflow: auto;
          max-height: calc(100vh - 418px);
        }
        .selectedTitle{
         padding:8px 15px;
         color: #292830;
         background:rgba(248,248,248,1);
        }
        .selectedItem{
          padding:10px 30px 10px 15px;
          color:#313138;
          border-bottom: 1px solid rgba(231,231,231,1);
          .el-icon-check{
            border-radius: 50%;
            color:#fff;
            background: #328FE6;
            width:18px;
            height:18px;
            line-height: 18px;
            text-align: center;
          }
        }
      }
    }
  }
  .floatRight{
      float: right;
  }
  .operawrap{
    margin: 20px -20px 0;
    &>div{
      padding:20px 20px;
      box-shadow:0px -2px 10px 0px rgba(197,197,209,0.3);
      position: relative;
      .floatRight{
        position: absolute;
        right: 20px;
        top:50%;
        transform: translate(0,-50%);
        -moz-transform: translate(0,-50%);
        -o-transform: translate(0,-50%);
        -ms-transform: translate(0,-50%);
      }
      .operaTime{
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(138,139,153,1);
        line-height:34px;
      }
    }
    .el-button--primary{
      background:linear-gradient(315deg,rgba(53,92,219,1) 0%,rgba(49,107,227,1) 100%);
      border-color:rgba(53,92,219,1);
      &:hover{
        background:rgba(49,107,227,1);
      }
    }
  }
</style>
