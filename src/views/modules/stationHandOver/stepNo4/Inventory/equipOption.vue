<template>
<div style="height: 25px;margin-top: 10px">
  <div class="equipOptionDiv"><div class="part1"><label class="equipOptionLabel" style="width:30%;margin-right:5%">英利</label><label style="width:30%;margin-right:5%">型号名称占位</label><label style="width:20%">341</label></div><div style="float:right"><a class="equipOptionAction" @click="dialogVisible = true">编辑</a><span class="spe"></span><a class="equipOptionAction">删除</a></div></div>
</div>
</template>

<script>
    export default {
        name: "equipOption"
      // data(){
      //   equiplist:[]
      // }

    }
</script>

<style scoped>
  .equipOptionAction{
    text-decoration: none;
  }
  .equipOptionDiv{
    margin: 10px 0px;
  }
  .equipOptionAction{
    width:27px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(41,152,253,1);
    line-height:20px;
  }
  .part1{
    width:154px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(73,73,82,1);
    line-height:20px;
    float: left;
  }
  .spe{
    width:1px;
    height:13px;
    border:1px solid rgba(215,216,224,1);
    margin-left:10px;
    margin-right:10px;
  }
</style>
