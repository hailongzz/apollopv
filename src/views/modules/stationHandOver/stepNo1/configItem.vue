<template>
  <div class="configWrap">
    <div>
      <div class="title">
        <span>{{`已开通项 ${defaultList.length+selectedList.length}`}}</span>
        <span class="titleTip">（{{`包含系统默认开通11项，默认项不可删除)`}}</span>
      </div>
      <el-row>
        <div v-for="(item,index) in defaultList" :key="index" class="len-col-5">
          <span class="added colItem" v-if="item.added" @click="removeItem(item.id)">
            <i class="el-icon-check"></i>
            <i class="el-icon-close"></i>
             {{item.serviceItemName}}</span>
          <span class="colItem" v-else>{{item.serviceItemName}}</span>
        </div>
         <div v-for="(item,index) in selectedList" :key="index" class="len-col-5">
          <span class="added colItem" @click="removeSelectedItem(item.id)">
            <i class="el-icon-check"></i>
            <i class="el-icon-close"></i>
             {{item.serviceItemName}}</span>
        </div>
      </el-row>
    </div>
    <div class="allItems">
      <div class="title">
        <span>所有可选项</span>
      </div>
      <el-row class="allConfigWrap">
        <div v-for="(item,index) in unselectedList" :key="index" class="len-col-5">
          <span class="colItem" @click="selectItem(item.id)"> + {{item.serviceItemName}}</span>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // defaultList:[],
      // selectedList:[],
      // unselectedList:[]
    }
  },
  created() {
    this.loadConfigs()
  },
  props:["defaultList","selectedList","unselectedList"],
  methods:{
    selectItem(id){
      const {defaultList,unselectedList} = this;
      const currentIndex =  unselectedList.findIndex(item=>item.id==id)
      const selectItem = unselectedList[currentIndex]
      selectItem.added = true
      this.$set(defaultList,defaultList.length,selectItem)
      this.unselectedList.splice(currentIndex,1)
    },
    removeItem(id){
      const {defaultList,unselectedList} = this;
      const currentIndex =  defaultList.findIndex(item=>item.id==id)
      const selectItem = defaultList[currentIndex]
      delete selectItem.added
      this.$set(unselectedList,unselectedList.length,selectItem)
      this.defaultList.splice(currentIndex,1)
    },
    removeSelectedItem(id){
      const {selectedList,unselectedList} = this;
      const currentIndex =  selectedList.findIndex(item=>item.id==id)
      const selectItem = selectedList[currentIndex]
      delete selectItem.added
      this.$set(unselectedList,unselectedList.length,selectItem)
      this.selectedList.splice(currentIndex,1)
    },
    submit(){
      const {query:{powerStationId}} = this.$route
      const {defaultList,selectedList} = this
      debugger;
      this.$http({
        url: this.$http.adornUrl('stationhandover/createProject/cfgServiceSave'),
        method: 'post',
        data: this.$http.adornData({
          powerStationId,
          selectServiceId:defaultList.map(item=>item.id).concat(selectedList.map(item=>item.id))
        })
      }).then(({data})=>{
        if(data.code==0){
          this.$message.success('提交成功')
          this.$emit('closeModal')
        }
      })
    }
  }
}
</script>

<style scope lang="scss">
  .configWrap{
    .title{
      font-family:PingFang-SC-Bold;
      font-weight:bold;
      color:rgba(62,62,71,1);
      .titleTip{
        color:rgba(138,139,153,1);
        font-size: 12px;
      }
    }
    .len-col-5{
      float: left;
      width: 20%;
      padding: 0 27px 0 17px;
      height: 44px;
    }
    .colItem{
      display: inline-block;
      width:100%;
      text-align: center;
      background:rgba(245,245,250,1);
      height: 34px;
      line-height: 34px;
      margin-top: 10px;
      position: relative;
      cursor: pointer;
      z-index:1;
      border-radius: 17px;
      border:1px solid transparent;
    }
    .allConfigWrap{
      .colItem{
        background: #fff;
        box-sizing: content-box;
        &:hover{
          border:1px solid rgba(50,143,230,1);
          color:#328FE6;
        }
      }
    }
    .added.colItem{
      background: #328FE6;
      color:#fff;
      &::before,&::after{
        background: #328FE6;
      }
      .el-icon-close{
        display: none;
      }
      &:hover{
        .el-icon-close{
          display: inline;
        }
        .el-icon-check{
          display:none;
        }
      }
    }
    .allItems{
      margin-top: 20px;
    }
  }
</style>
