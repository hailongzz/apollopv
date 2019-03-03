<template>
<div>
  <page-template>
    <h1 slot="hTitle">{{basicInfo.stationName}}</h1>
    <div slot="elButton">
      <i class="btn delete" @click="deletejj"><span class="icon_delete"></span>删除</i>
    </div>
    <template slot="content">
      <div class="contentWrapper">
        <div class="stepWrapper">
          <div class="stepAll4">
            <div :class="['stepNo', 'stepNo1',{'stepNoActive': currentStep===1}]" @click="toggleStep(1)"><span class="stepNum">1</span> 新建项目</div>
            <div :class="['stepNo', 'stepNo2',{'stepNoActive': currentStep===2}]" @click="toggleStep(2)"><span class="stepNum">2</span> 上传资料</div>
            <div :class="['stepNo', 'stepNo3',{'stepNoActive': currentStep===3}]" @click="toggleStep(3)"><span class="stepNum">3</span> 进入现场</div>
            <div :class="['stepNo', 'stepNo4',{'stepNoActive': currentStep===4}]" @click="toggleStep(4)"><span class="stepNum">4</span> 录入台账</div>
          </div>
          <p class="detailsDes">
            <i class="el-icon-info"></i>&nbsp;
            {{official[currentStep-1]}}
          </p>
        </div>
        <div class="componentWrapper">
          <keep-alive>
            <component :is="currentTabComponent" 
              @checkParamsEvent="checkParams" 
              @acceptBackEvent="backAccept"
              @getStationName="getStationName"
              ></component>
          </keep-alive>
        </div>
      </div>
    </template>
  </page-template>
  <div class="jj-submit clearfix">
    <div class="l">最近保存于 {{statusInfo.updateTime}}</div>
    <div class="r clearfix">
      <div class="">{{lackText}}</div>
      <div class="btns">
          <i class="btn normal" @click="prevStep" v-if="currentStep != 1">上一步</i>
          <i class="btn normal disabled" v-if="currentStep == 1">上一步</i>
          <i class="btn normal" @click="nextStep" v-if="currentStep != 4">下一步</i>
          <i class="btn normal disabled" v-if="currentStep == 4">下一步</i>
          <i class="btn submit" v-if="submitFlag" @click="toAccept">确认交接完成</i>
          <i class="btn submit disabled" v-if="!submitFlag">确认交接完成</i>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import pageTemplate from '@/components/pageTemplate'
  import stepNo1 from './stepNo1/index'
  import stepNo2 from './stepNo2/index'
  import stepNo3 from './stepNo3/index'
  import stepNo4 from './stepNo4/Inventory/equipTab'
  import accept from './accept/index'
  export default {
    data () {
      return {
        currentStep: 1,
        currentTabComponent: stepNo1,
        basicInfo:{},
        checkFlag: [
          {step: 1, isok: false},
          {step: 2, isok: false},
          {step: 3, isok: false},
          {step: 4, isok: false}
        ],
        official: [
          '请编辑电站基本信息，录入电站相关内外部联系人，并根据运维合同配置该电站的服务项目',
          '请上传该电站相关的各类文档',
          '请录入现场勘察中发现的缺陷和隐患，并拍摄和上传各型号设备的名牌照片，以记录相关参数信息',
          '请对现场设备型号及数量进行盘点'
        ],
        statusInfo: {
          contactOk: false, //联系人
          services: false, //服务项目
          fileOk: false, //电站资料
          mingCardPhoto: false, //铭牌照片
          checkDevice: false//设备台账
        },
        submitFlag: true,
        lackText: "",
      }
    },
    components: {
      pageTemplate,
      stepNo1,
      stepNo2,
      stepNo3,
      stepNo4,
      accept
    },
    created () {

    },
    mounted() {
      this.init();
    },
    methods: {
      init: function(){
        this.getStatus();
      },
      //获取当前文件上传状态
      getStatus: function(){
          var _this = this;
          var params = {
              powerStationId: this.$route.query.powerStationId
          }
          this.$http.get(this.$http.adornUrl('/stationhandover/handoverInfo'),{params: params}).then(function(res){
              if(res.data.code == 0){
                _this.statusInfo = {
                  contactOk: res.data.data.contactOkCount, //联系人
                  services: res.data.data.servicesCount, //服务项目
                  fileOk: res.data.data.fileOkCount, //电站资料
                  mingCardPhoto: res.data.data.mingCardPhotoCount, //铭牌照片
                  checkDevice: res.data.data.checkDeviceCount,//设备台账
                  updateTime: res.data.data.updateTime
                }
                //判断隐藏提交按钮

                _this.vdSubmitComplete();
              }
          },function(){
          });
      },
      vdSubmitComplete: function(){
        this.submitFlag = true;
        var isFirst = false;
        for(var keyname in this.statusInfo){
          if(!this.statusInfo[keyname]){
            this.submitFlag = false;
            if(!isFirst){
              isFirst = true;
              if(keyname == "contactOk"){
                this.lackText = "未录入联系人";
              }else if(keyname == "services"){
                this.lackText = "未录入服务项目";
              }else if(keyname == "fileOk"){
                this.lackText = "未录入电站资料";
              }else if(keyname == "mingCardPhoto"){
                this.lackText = "未录入铭牌照片";
              }else if(keyname == "checkDevice"){
                this.lackText = "未录入设备台账";
              }
            }
          }
        }
      },
      prevStep: function(){
        this.toggleStep(this.currentStep - 1);
      },
      nextStep: function(){
        this.toggleStep(this.currentStep + 1);
      },
      backAccept: function(){
        this.toggleStep(this.currentStep);
        document.querySelector(".pageTemplate-header__top_buttons .btn.delete").style.display = "block";
      },
      toAccept: function(){
        this.currentTabComponent = "accept";
        document.querySelector(".pageTemplate-header__top_buttons .btn.delete").style.display = "none";
      },
      toggleStep(index) {
        this.currentStep = index
        this.currentTabComponent = `stepNo${index}`
      },
      getStationName(basicInfo){
        this.basicInfo = basicInfo
      },
      /**验证参数demo params: {keyname: "fileOk", isok: true} */
      checkParams: function(params){
        this.statusInfo[params.keyname] = params.isok;
        this.vdSubmitComplete();
      },
      //删除电站交接单
      deletejj: function(){
        var _this = this;
        this.$confirm('确定要删除该交接单吗？', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          _this.$http.post(this.$http.adornUrl("/stationhandover/delete/" + this.$route.query.powerStationId)).then(function(res){
            if(res.data.code == 0){
              _this.$message.success('删除成功');
              _this.$router.push('/stationHandOver-index/c');
            }else{
              _this.$message.error(res.data.message);
            }
          },function(){
            _this.$message.error('删除失败');
          });
        }).catch(() => {
        });
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/scss/variables.scss';
.contentWrapper{
  display: flex;
  flex-direction: column;
  overflow:hidden;
  .stepWrapper{
    height: 103px;
    background: #fff;
    padding: 18px 30px 14px;
    p{
      margin: 14px 0 0;
    }
  }
  .componentWrapper{
    // flex: 1;
    height: 100%;
    overflow:auto;
  }
}

i{
    &.disabled{
        opacity: 0.4;
        cursor: not-allowed !important;
    }
    &.btn{
        position: relative;
        display: inline-block;
        font-style: normal;
        padding: 0 20px 0 42px;
        height:34px;
        line-height: 34px;
        font-size:14px;
        border-radius:2px;
        cursor: pointer;
        user-select: none;
        span{
            position: absolute;
            left: 0;
            color: #fff;
        }
    }
    &.btn.submit{
        padding: 0 20px;
        color: #fff;
        background: #328FE6;
        span{
            top: 5px;
            font-size: 25px;
        }
        &:hover{
            background: #5BA5EB;
        }
    }
    &.btn.normal{
        padding: 0 20px;
        border-radius:2px;
        color:#494952;
        border:1px solid #D7D8E0;
        &:hover{
            border: 1px solid #C5C5D1;
        }
    }
    &.btn.add{
        font-weight:bold;
        color:#fff;
        background: #328FE6;
        span{
            top: 5px;
            left: 12px;
            font-size: 25px;
        }
        &:hover{
            background: #5BA5EB;
        }
    }
    &.btn.delete{
        border-radius:2px;
        color:rgba(73,73,82,1);
        border:1px solid rgba(215,216,224,1);
        span{
            top: 5px;
            left: 12px;
            font-size: 25px;
            color: #494952;
        }
    }
}

/**el-ui 确认框样式调整*/
.el-message-box{
  .el-message-box__header{
    font-size: 22px;
    font-weight: bold;
    color: #101015;
    padding: 30px 30px 10px 30px;
  }
  .el-message-box__content{
    padding: 10px 30px 15px 30px;
  }
  .el-button{
    border: 0px;
    font-size: 14px;
  }
  .el-button--primary{
    background: #328FE6;
    border-radius: 2px;
  }
}

.stepAll4{
  width: 100%;
  line-height: 44px;
  display: flex;
  flex-direction: row;
  flex-wrap:nowrap;
  overflow: hidden;
  cursor: pointer;
  .stepNum{
    float: left;
    font-size: 40px;
    font-weight: bold;
    color: rgba(255,255,255,0.3);
  }
  .stepNo{
    flex-grow: 1;
    height: 100%;
    background: #353443;
    position: relative;
    color: #fff;
    font-size: 16px;
    text-align: center;
    padding:0 20px;
      &:not(:first-child) {
        padding:0 40px;
      }
      &::after {
      display: inline-block;
      content: " ";
      height: 34px;
      width: 33px;
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: absolute;
      top: 11%;
      right: -18px;
      box-sizing: border-box;
      background: #353443;
      border-right:2px solid rgba(255,255,255,1);
      border-top:2px solid rgba(255,255,255,1);
    }
  }
  .stepNoActive{
    background: #328FE6;
    &::after{
      background: #328FE6;
    }
  }
  .stepNo1{
    z-index:10;
  }
  .stepNo2{
    z-index:9;
  }
  .stepNo3{
    z-index:8;
  }
  .stepNo4{
    z-index:7；
  }
}
.detailsDes{
  color: #8A8B99;
  font-size: 12px;
  padding: 0;
  margin: 22px 0 20px;;
  text-align: center;
}
.jj-submit{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height:60px;
    padding: 0 30px;
    background:rgba(255,255,255,1);
    box-shadow:0px -2px 10px 0px rgba(197,197,209,0.3);
    z-index: 4px;
    i{
      &.btn{
          position: relative;
          display: inline-block;
          font-style: normal;
          padding: 0 20px 0 42px;
          height:34px;
          line-height: 34px;
          font-size:14px;
          border-radius:2px;
          cursor: pointer;
          user-select: none;
          span{
              position: absolute;
              left: 0;
              color: #fff;
          }
      }
      &.btn.submit{
        padding: 0 20px;
        color: #fff;
        background: #328FE6;
        span{
            top: 5px;
            font-size: 25px;
        }
      }
      &.btn.normal{
          padding: 0 20px;
          border-radius:2px;
          color:#4B4B54;
          border:1px solid rgba(215,216,224,1);
      }
    }
    .l{
        float: left;
        color: #8A8B99;
        font-size: 14px;
        line-height: 60px;
    }
    .r{
        float: right;
        div{
            float: left;
            color: #8A8B99;
            font-size: 14px;
            height: 60px;
            line-height: 60px;
        }
        .btns{
            float: left;
            padding-top: 13px;
            height: 60px;
            i{
                float: left;
                &.disabled{
                  opacity: 0.5;
                  cursor: not-allowed;
                }
                &:nth-child(1){
                    margin-left: 20px;
                }
                &:nth-child(2){
                    margin-left: 10px;
                }
                &:nth-child(3){
                    margin-left: 20px;
                }
            }
        }
    }
}
</style>
