<template>
  <div style="width:100%;" >
    <div style="width:100%;margin-top: 15px; padding-left: 32px; padding-right: 2%;">
    <div class="title1">联系人管理</div>
    <div class="title2">阿波罗光伏站一号</div>
    <div class="title3" @click="exportStationInfo"><img src="../../../../../assets/img/ziming_export.png"/><span class="title3Content">导出</span></div>
    </div>
    <el-tabs v-model="activeContent" @tab-click="handleClick" id="elTabs" style="clear: left; width: 96%; " >
    <el-tab-pane :label="`内部联系人${interCount}`" name="internalStaffTab" id="inter"  style="width: 102%;">
      <div class="externalContactTabStyle">
      <addInter :organizationId="organizationId" :name="name" v-bind:stationId='stationId' @isRefreshInter="isRefreshInter" @isRefreshCount="isRefreshCount"></addInter>
      <interList v-for="(item,index) in interList" :key='index' :item='item'  	:index="index"  v-on:childByValue="getChildValue" v-bind:stationId='stationId'  @isRefreshInter="isRefreshInter" @isRefreshCount="isRefreshCount" @showCityName="interList" class="divv">
      </interList>
      </div>
    </el-tab-pane>
    <el-tab-pane :label="`外部联系人${exterCount}`" name="externalContactTab" id="exter" style="width: 102%;">
      <div class="externalContactTabStyle">
        <addContact @isRefreshContacts="isRefreshContacts" @isRefreshCount="isRefreshCount" v-bind:stationId='stationId'></addContact>
        <contactsList v-for="(item,index) in this.exterList" :key='index' :item='item' 	:index="index" v-on:childByValue="getChildValue" @isRefreshContacts="isRefreshContacts" @isRefreshCount="isRefreshCount"   v-bind:stationId='stationId'></contactsList>
      </div>
    </el-tab-pane>
    </el-tabs>
    </div>
</template>
<script>
  import addContact from "../contacts/addContact"
  import contactsList from "../contacts/contactsList"
  import addInter from "../contacts/addInter"
  import interList from "../contacts/interList"
  export default {
    name: "contactsTab",
    data() {
      return {
        activeContent: '',
        exterList:[],
        interList:[],
        exterCount:0,
        interCount:0,
        isDelete:0,
        editOradd:0,
        stationId:'',
        powerStationId:'',
        organizationId:'',
        name:'',
        token:''
        // key:''
      };
    },
    created(){
        this.getParams();
        this.organizationId=this.$store._modules.root._children.user.state.organizationId;
        this.name=this.$store._modules.root._children.user.state.name;
    },
    methods: {
      handleClick(tab, event) {
       if(tab.name=="externalContactTab"){
         this.isRefreshContacts();
         var token = this.$cookie.get('token');
        this.token=token.toString();
        this.isRefreshCount();
       }
       else if(tab.name=="internalStaffTab"){
         this.isRefreshInter();
         this.isRefreshCount();
        }
    },
      getChildValue(isDelete){
          this.isDelete = isDelete
        },
      isRefreshContacts(){
      //alert("wowow"+this.stationId);
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
      isRefreshInter(){
        //alert("开始刷新内部联系人");
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/contactsSelect'),
          method: 'post',
          data: this.$http.adornData({
            powerStationId:this.stationId,linkmanType:0
          })
        }).then(({data})=> {
     if (data.code == 0) {
            this.interList=data.data.contactsList;
            console.log(this.interList);
          }
        }).catch((res)=>{
          console.log(res)
        })
      },
      isRefreshCount(){
        console.log("刷新个数begin");
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
      exportStationInfo(){
       // alert("开始导出");
        this.$http({
          url: this.$http.adornUrl('stationhandover/createProject/contactsExport?powerStationId='+this.stationId+"&&token="+this.token),
          method: 'GET',
          responseType: "blob"
        }).then(data => {
          console.log(data)
          console.log(data.data)
          if (data) {
            if ("msSaveBlob" in navigator) {
              // 对IE和Edge的兼容
              window.navigator.msSaveBlob(
                data.data,
                decodeURI(
                  data.headers["content-disposition"].split("filename=")[1]
                )
              );
            } else {
              let a = document.createElement("a");
              let url = window.URL.createObjectURL(data.data);
              // console.log(data.headers["content-disposition"]);
              let filename = decodeURI(
                data.headers["content-disposition"].split("filename=")[1]
              );
              if (navigator.userAgent.indexOf("Firefox") !== -1) {
                var evt = document.createEvent("MouseEvents"); // 对firefox的兼容
                evt.initEvent("click", false, false); // 对firefox的兼容
                a.dispatchEvent(evt); // 对firefox的兼容
              } else {
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
              }
            }
          }
        })
      },
      getParams () {
        // 取到路由带过来的参数;
        ///alert(this.$route.query.sendStationId.split("=")[0]==="AAAA");
        if(this.$route.query.sendStationId.split("=")[0]==="AAAA"){
          this.activeContent='externalContactTab';
          this.stationId=this.$route.query.sendStationId.split("=")[1];
          //alert("是点击外部联系人进来的"+this.stationId);
          this.isRefreshContacts();
          this.isRefreshCount();
        }else{
          this.activeContent='internalStaffTab';
          this.stationId=this.$route.query.sendStationId;
          //alert("是点击内部联系人进来的"+this.stationId);
          this.isRefreshInter();
          this.isRefreshCount();
        }
      }
      },
    components:{
      addContact,
      contactsList,
      addInter,
      interList
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  };
</script>

<style scoped>
  a{
    text-decoration: none;
  }
  .el-tabs__item{
    width:91px;
    height:14px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:14px;
  }
  .el-tabs__nav-wrap::after{
    width: 90px !important;
  }
  #tab-internalStaffTab,#tab-externalContactTab{
    width:91px;
    height:14px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:14px;
  }
  .el-tabs__active-bar is-top :active{
    width:105px;
    height:2px;
    background:rgba(53,92,219,1);
  }
  .navx{
    width:1px;
    height:12px;
    background:rgba(197,197,209,1);
    float: left;
    margin-left: 9px;
    margin-right: 9px;
  }
  .nav1{
    width:12px;
    height:10px;
    /*background:rgba(197,197,209,1);*/
    float: left;
    margin-top: 1px;
    margin-bottom: 1px;
  }
  .nav2{
    width:60px;
    height:14px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(16,16,21,1);
    line-height:14px;
    float: left;
  }
  .nav3{
    width:71px;
    height:14px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(16,16,21,1);
    line-height:14px;
    float: left;
  }
  .title3 img{
    width:16px;
    height:14px;
    /*//background:rgba(73,73,82,1);*/
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 15px;
    float: left;
    margin-right: 9px;
  }
  .title3Content{
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(73,73,82,1);
    line-height:34px;
    float: left;
  }
  .title3{
    padding-right: 15px;
    height:34px;
    border-radius:2px;
    border:1px solid rgba(215,216,224,1);
    float: right;
    margin: 0px;
    cursor: pointer;
  }
  .title2{
    font-size:14px;
    font-family:PingFang-SC-Heavy;
    /*color:rgba(164,165,179,1);*/
    line-height:20px;
    margin-top: 12px;
    margin-bottom: 8px;
    margin-left: 10px;
    padding-left: 7px;
    float: left;
    width:126px;
    height:20px;
    font-weight:400;
    color:rgba(50,143,230,1);
    line-height:20px;
    background:rgba(50,143,230,0.2);
  }
  .title1{
    width:103px;
    height:20px;
    font-size:20px;
    font-family:PingFang-SC-Heavy;
    font-weight:800;
    color:rgba(16,16,21,1);
    line-height:20px;
    margin-left: 1px;
    margin-top: 10px;
    margin-bottom: 10px;
    float: left;
  }
  #elTabs{
    width:100%;
    margin-left:32px;
    height: calc(100vh - 150px);
    overflow: auto;
  }
.internalStaffTabStyle,.externalContactTabStyle{
  width:91px;
  height:14px;
  font-size:14px;
  font-family:PingFang-SC-Bold;
  font-weight:bold;
  color:rgba(138,139,153,1);
  line-height:14px;
}
  .internalStaffTabStyle,.externalContactTabStyle{
    width:91px;
    height:14px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:14px;
  }
  .externalContactTabStyle div{
    float: left;
  }
  .externalContactTabStyle{
    width:100%;
  }
el-tab-pane {
  width: 105px;
  height: 2px;
  background: rgba(53, 92, 219, 1);
}
  .el-tabs__active-bar is-top{
    background-color:#355CDB;
  }
  .el-tabs__active-bar{
    background-color:#355CDB;
  }
  .el-tabs__item:hover{
    background-color:#355CDB;
  }
  .el-tabs__item.is-active{
    color:black;
  }
</style>

