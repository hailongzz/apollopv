<template>
    <div class="cloud">
        <el-row class="cloudHeader">
          <h4>电站交接</h4>
          <el-button type="primary" icon="el-icon-plus" @click="showDialog" class="floatRightCenter">新建</el-button>
        </el-row>
        <el-tabs v-model="activeName">
            <el-tab-pane name="2">
                <span slot="label">全部交接 {{handoverTotal}}</span>
                <el-row :gutter="20" class="colWrap">
                    <el-col v-for="(item,index) in stationList" :key="index" :span="12">
                      <div class="cloudCard" @click="$router.push(`/stationHandOver-index/stationHandOver-details?powerStationId=${item.id}`)">
                        <div class="planteName">{{item.stationName}}</div>

                        <div>
                            <span>业主:&nbsp;&nbsp;</span>
                            <span class="planteContent">{{item.customerName}}</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span>站长:&nbsp;&nbsp;</span>
                            <span class="planteContent">{{item.stationMaster}}</span>
                        </div>
                        <div>
                          <span>位置:&nbsp;&nbsp;</span>
                          <span class="planteContent">{{item.stationAddress}}</span>
                          </div>
                        <div class="createTime">创建于{{item.handoverStartTime}} {{item.createBy}}</div>
                        <div class="statusTip">
                           <div :class="item.handOverState==0?'status':'status done'"><span>{{statusMap[item.handOverState]}}</span></div>
                           <div class="tip">{{item.handOverState==0?"已进行":'共交接'}}{{item.timeCalc}}</div>
                        </div>
                      </div>
                   </el-col>
                </el-row>
                <div class="noDataWrap" v-if="!(Array.isArray(stationList)&&stationList.length>0)">
                 <p>暂无数据</p>
                 <el-button type="primary" icon="el-icon-plus" @click="showDialog">立即新建</el-button>
               </div>
            </el-tab-pane>
            <el-tab-pane name="0" >
               <span slot="label">交接中 {{handoveringCount}}</span>
                <el-row :gutter="20" class="colWrap">
                    <el-col v-for="(item,index) in stationList" :key="index" :span="12">
                      <div class="cloudCard" @click="$router.push(`/stationHandOver-index/stationHandOver-details?powerStationId=${item.id}`)">
                        <div class="planteName">{{item.stationName}}</div>
                        <div>
                            <span>业主:&nbsp;&nbsp;</span>
                            <span class="planteContent">{{item.customerName}}</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span>站长:&nbsp;&nbsp;</span>
                            <span class="planteContent">{{item.stationMaster}}</span>
                        </div>
                        <div>
                          <span>位置:&nbsp;&nbsp;</span>
                          <span class="planteContent">{{item.stationAddress}}</span>
                          </div>
                        <div class="createTime">创建于{{item.handoverStartTime}} {{item.createBy}}</div>
                        <div class="statusTip">
                           <div :class="item.handOverState==0?'status':'status done'"><span>{{statusMap[item.handOverState]}}</span></div>
                           <div class="tip">{{item.handOverState==0?"已进行":'共交接'}}{{item.timeCalc}}</div>
                        </div>
                      </div>
                   </el-col>
                </el-row>
                <div class="noDataWrap" v-if="!(Array.isArray(stationList)&&stationList.length>0)">
                 <p>暂无数据</p>
                 <el-button type="primary" icon="el-icon-plus" @click="showDialog">立即新建</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane name="1">
              <span slot="label">交接完成 {{handoverEndCountCount}}</span>
               <el-row :gutter="20" class="colWrap">
                    <el-col v-for="(item,index) in stationList" :key="index" :span="12" >
                      <div class="cloudCard" @click="$router.push(`/stationHandOver-index/stationHandOver-details?powerStationId=${item.id}`)">
                        <div class="planteName">{{item.stationName}}</div>
                       <div>
                            <span>业主:&nbsp;&nbsp;</span>
                            <span class="planteContent">{{item.customerName}}</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span>站长:&nbsp;&nbsp;</span>
                            <span class="planteContent">{{item.stationMaster}}</span>
                        </div>
                        <div>
                          <span>位置:&nbsp;&nbsp;</span>
                          <span class="planteContent">{{item.stationAddress}}</span>
                          </div>
                        <div class="createTime">创建于{{item.handoverStartTime}} {{item.createBy}}</div>
                        <div class="statusTip">
                           <div :class="item.handOverState==0?'status':'status done'"><span>{{statusMap[item.handOverState]}}</span></div>
                           <div class="tip">{{item.handOverState==0?"已进行":'共交接'}}{{item.timeCalc}}</div>
                        </div>
                      </div>
                   </el-col>
                </el-row>
                <div class="noDataWrap" v-if="!(Array.isArray(stationList)&&stationList.length>0)">
                 <p>暂无数据</p>
                 <el-button type="primary" icon="el-icon-plus" @click="showDialog">立即新建</el-button>
               </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            title="新建电站交接"
            :visible.sync="dialogVisible"
            width="35%"
            :before-close="resetFields"
        >
            <new-dialog ref="addStationForm" @loadStationList="loadStationList"></new-dialog>
             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false;resetFields">取 消</el-button>
                <el-button type="primary" @click="addStationConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <el-row class="paginationWrap" v-if="Array.isArray(stationList)&&stationList.length>0">
          <span>Total Records : {{handoverTotalCalc}}</span>
          <el-pagination
            :current-page.sync="page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='limit'
            layout="prev, pager, next"
            :total="handoverTotalCalc"
            @current-change="paginationChnage"
            @size-change="sizeChange"
          >
          </el-pagination>
           <el-select v-model="pageLimit.value" @change="handleSizeChange" placeholder="请选择">
            <el-option
              v-for="item in pageLimit.data"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-row>
    </div>
</template>
<script>
import newDialog from './addStation.vue'
import {statusMap} from '../dataMap.js'
export default {
    data() {
      return {
        activeName: '2',
        dialogVisible:false,
        stationList:[],
        page: 1,
        limit: 10,
        statusMap,
        handoverTotalCalc:0,
        handoverTotal:0,
        handoveringCount:0,
        handoverEndCountCount:0,
        pageLimit: {
          value: '10/Page',
          data: ['10/Page','20/Page','30/Page','40/Page','50/Page']
        },
      };
    },
    components:{
        "new-dialog":newDialog,
    },
    created() {
      this.loadStationList();
    },
    watch:{
      activeName(newVal,oldVal){
        const {handoverTotal,handoveringCount,handoverEndCountCount} =this;
        this.handoverTotalCalc= newVal==2?handoverTotal:(newVal==0?handoveringCount:handoverEndCountCount)
        this.loadStationList()
      }
    },
    methods:{
        showDialog(){
            this.dialogVisible = true
        },
        handleSizeChange(val){
          this.page =1;
          this.limit = parseFloat(val)
          this.loadStationList()
        },
        loadStationList(flag){
          if(flag){
            this.dialogVisible = false;
          }
          const {activeName,page,limit} = this;
          this.$http({
            url: this.$http.adornUrl('stationhandover/createProject/stationList'),
            method: 'post',
            data: this.$http.adornData({
              state:activeName,
              page,
              limit,
            })
          }).then(({data})=>{
            if(data.code==0){
              const {data:{handoverTotal,handoveringCount,handoverEndCountCount,page}} = data
              if(page&&Array.isArray(page.list)){
                page.list.forEach((item)=>{
                  const timeCalc = item.handOverTime?new Date(item.handOverTime).getTime()-new Date(item.handoverStartTime).getTime():new Date().getTime()-new Date(item.handoverStartTime).getTime()
                  if(timeCalc<24*60*60*1000){
                    item.timeCalc = parseInt(timeCalc/(60*60*1000)) + '小时'
                  }else{
                    item.timeCalc = parseInt(timeCalc/(24*60*60*1000)) + '天'
                    console.log(item)
                  }
                })
                this.stationList = page.list
              }
              if(activeName==2){
                this.handoverTotal = handoverTotal;
                this.handoverTotalCalc = handoverTotal;
                this.handoveringCount = handoveringCount
                this.handoverEndCountCount = handoverEndCountCount
              }
            }
          }).catch((res)=>{
            console.log(res)
          })
        },
        handleClick(tab, event){
        },
        addStationConfirm(){
          this.$refs.addStationForm.submit()
        },
        paginationChnage(page){
          this.page = page
          this.loadStationList()
        },
        sizeChange(size){
          this.limit = size
          this.loadStationList()
        },
        resetFields(done){
          this.$refs.addStationForm.resetFields()
          if(done){
            done()
          }
        }
    }
}
</script>
<style lang="scss">
  .el-tabs__item{
    &:hover{
      color:rgba(33,32,41,1);
    }
  }
  .el-tabs__item.is-active{
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(33,32,41,1);
    line-height:14px;
  }
  .el-tabs__header{
      background: #ebeef5;
      // padding: 0 0 15px;
      // margin: 0 -20px;
  }
  .el-tabs__nav-wrap{
      background: #fff;
      // padding-left:20px;
      // padding-right: 20px;
  }
  .cloud{
      margin: 10px 20px;
      background:rgba(248,248,248,1);
      .cloudHeader{
        position: relative;
        background: #fff;
        h4{
          width:80px;
          height:20px;
          font-size:20px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(62,62,71,1);
          line-height:20px;
        }
      }
      .el-tabs__header{
        margin-left:-20px;
        margin-right: -20px;
        padding-left:20px;
        padding-right: 20px;
        background: #fff;
      }
      .el-tabs__content{
        background:rgba(248,248,248,1);
        margin: -15px -20px 0;
        padding: 15px 20px 0;
      }
      .colWrap{
        height: calc(100vh - 293px);
        overflow: auto;
      }
    //   card样式
      .cloudCard{
         background:#fff;
         padding:15px 20px 10px 20px;
         margin:20px 5px 5px 5px;
         transition: all 0.3 ease-in-out;
         border-radius: 3px;
         border:1px solid rgba(215,216,224,0.6);
         position: relative;
         cursor: pointer;
         color:#A4A5B3;
         background: #fff;
         &>div{
            margin-bottom: 8px;
         }
         .planteName{
             font-family:PingFangSC-Semibold;
             font-weight:600;
             color:rgba(31,32,51,1);
             line-height:20px;
             font-size: 18px;
             margin-bottom: 20px;
         }
         .planteContent{
             color:#3E3E47;
         }
         .createTime{
             font-size: 12px;
             color:#A4A5B3;
             margin-top: 30px;
         }
         .statusTip{
           position: absolute;
           top:15px;
           right:15px;
           text-align: right;
           font-size: 12px;
           .status{
             position: relative;
             margin-bottom: 5px;
            &>span{
              display: inline-block;
              color:rgba(243,180,30,1);
              background:rgba(243,180,30,0.08);
              height:22px;
              width:100%;
              padding:0 10px;
              line-height: 22px;
              text-align: center;
              z-index: 1;
              position: relative;
              border-radius: 11px;
            }
             &::before,&::after{
              // content: '';
              display: inline-block;
              background:rgba(243,180,30,0.08);
              width:22px;height: 22px;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              z-index: 0;
            }
            &::before{
              left: 0;
              transform: translate(-50%,-50%)
            }
            &::after{
              right: 0;
              transform: translate(50%,-50%)
            }
            //  &::before{
            //    content:'';
            //    width:8px;
            //    height:8px;
            //    display: inline-block;
            //    margin-right: 5px;
            //    background:rgba(255,159,19,1);
            //    border-radius: 50%;
            //  }
           }
           .done.status{
             &>span{
               color:#22B47E;
               background:rgba(34,180,126,0.08);
             }
             &::before,&::after{
              background:rgba(34,180,126,0.08);
            }
           }
           .tip{
               color:#999;
               font-size: 12px;
           }
         }
      }
      .cloudCard:hover{
        background: #fff;
        box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
        .planteName{
          color:#328FE6;
        }
      }
    .floatRightCenter{
      width: 90px;
      float: right;
      position: absolute;
      top:50%;
      right: 0;
      font-size: 14px;
      transform: translate(0,-50%);
      -moz-transform: translate(0,-50%);
      -o-transform: translate(0,-50%);
      -ms-transform: translate(0,-50%);
      i{
        display: inline-block;
        margin-right: 7px;
      }
    }
    .cloudHeader{
      h4{
        display: inline-block;
      }
    }
    .noDataWrap{
      text-align: center;
      color:#8A8B99;
      padding-top: 20vh;
      p{
        margin-bottom: 15px;
      }
    }
    .paginationWrap{
      position: relative;
      background: #f8f8f8;
      text-align: center;
      margin: 0 -20px;
      padding:0 20px;
      .el-pager li,.el-pagination button,input{
        background: #f8f8f8;
      }
      .el-pager li.active{
        color:#f8f8f8;
        &::before{
          content: '';
          width:5px;
          height:5px;
          background:#409EFF;
        }
      }
      &>span{
        position: absolute;
        left:25px;
        color:#8A8B99;
        top:50%;
        transform: translate(0,-50%);
        -moz-transform: translate(0,-50%);
        -o-transform: translate(0,-50%);
        -ms-transform: translate(0,-50%);
      }
      .el-select{
        position: absolute;
        top:50%;
        right: 20px;
        width:100px;
        font-size: 14px;
        transform: translate(0,-50%);
        -moz-transform: translate(0,-50%);
        -o-transform: translate(0,-50%);
        -ms-transform: translate(0,-50%);
        input{
          border-color: transparent!important;
        }
      }
    }
    .el-pagination{
      padding-right:0;
      display: inline-block;
      text-align: center;
      .el-pagination__sizes{
        margin-right: 0;
      }
    }
    .el-dialog{
      .el-dialog__header{
        font-size:22px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(16,16,21,1);
        line-height:22px;
      }
      .el-form-item__label{
        padding-right: 14px;
      }
      .el-form-item__content{
        padding-left:8px;
      }
      .el-dialog__body{
        padding: 20px 55px;
        .el-input-group__append{
          background: transparent;
          border-left: none;
        }
        .el-input-group>.el-input__inner{
          border-right: none;
        }
      }
      .el-dialog__footer{
        padding-right: 30px;
      }
      .el-button{
        width:90px;
      }
    }
  }
</style>
