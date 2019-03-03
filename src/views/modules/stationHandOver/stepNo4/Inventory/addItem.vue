<template>
<div id="addItem" style="width:100%;min-width: 900px;">
  <div class="thisRow">
    <div class="fivPart" style="padding-left:0px">
      <div class="thisContent">
        <label><span>1</span><el-select v-model="value" placeholder="设备类型" style="width: 85%;margin-left:2%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option></el-select></label>
      </div>
    </div>
    <div class="fivPart">
      <div class="thisContent">
        <label><el-input v-model="input" placeholder="设备品牌" class="ItemInput"></el-input></label>
      </div>
    </div>
    <div class="fivPart">
      <div class="thisContent">
        <label><el-input v-model="input" placeholder="设备型号" class="ItemInput"></el-input></label>
      </div>
    </div>
    <div class="fivPart">
      <div class="thisContent">
        <label><el-input v-model="input" placeholder="设备数量(个)" class="ItemInput"></el-input></label>
      </div>
    </div>
    <div class="fivPart" style="width:10%;padding-left: 4%">
      <div class="thisContent">
        <label><a class="equipOptionAction">删除</a></label>
      </div>
    </div>
    <div style="clear: left;"></div>
  </div>
</div>
</template>

<script>
  export default {
    name:'addItem',
    //json

    //[{“a”:"asdf"}]
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    }
  }
</script>
<style scoped>
  .equipOptionAction{
    width:27px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(41,152,253,1);
    line-height:20px;
    margin-left:5%;
  }
  .ItemInput{
    width: 100%;
    height:34px;
    background:rgba(255,255,255,1);
    border-radius:2px;
  }
#addItem>div{
  float: left;
}

  .thisRow{
    width: 100%;
    margin-top:15px;
    border-bottom: 1px solid rgba(231,231,231,1);
    padding-bottom: 10px;
  }
  .fivPart{
    float: left;
    width: 22.5%;
    padding-left:1%;
  }
  .thisContent{
    width: 90%;
    margin: 0 auto;
  }
</style>
