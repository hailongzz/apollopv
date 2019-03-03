<template>
    <el-col :span="8" style="margin-top:10px; margin-bottom:5px;">
      <div style="width: 95%;background:rgba(255,255,255,1);margin-right: 5%" @click="dialogVisible = true">
        <el-card class="box-card add_Inventory">
          <div style="text-align: center; padding-top: 35px;">
            <i  class="el-icon-plus" style="font-size: 60px;"></i>
            <div class="actionDesc">新增盘点</div>
          </div>
        </el-card>
       
      </div>
       <el-dialog
          title="新增盘点"
          :visible.sync="dialogVisible"
          width="950px"
          style="margin-left: 180px; color: red !important;"
          :before-close="handleClose">
          <addEquipInfo ref='thisChild' @loadEquipList="loadEquipList" :options="options"></addEquipInfo>
          <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog" class="toCancel">取 消</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
  </span>
        </el-dialog>

    </el-col>
</template>

<script>
  import addEquipInfo from "../Inventory/addEquipInfo"
    export default {
        name: "ContactsList",
      data() {
        return {
          dialogVisible: false
        };
      },
      props:["options"],
      methods: {
        handleClose(done) {
            this.$refs.thisChild.counter=1;
            this.$refs.thisChild.$refs[`addForm${0}`][0].resetFields()
            this.$refs.thisChild.itemList=['<addItem/>']
            done();

        },
        loadEquipList(flag){
          if(flag){
            this.dialogVisible = false
          }
          this.$emit("loadEquipList")
        },
        submit(){
          this.$refs['thisChild'].submit();
        },
      },
      components:{
        addEquipInfo
      }
    }
</script>

<style scoped lang="scss">
  .add_Inventory{
    border:1px dashed  #C5C5D1;border-radius: 0;
    cursor: pointer;
  }
  .add_Inventory:hover{
    background:rgba(195,210,210,0.6);
    border:1px dashed  #328FE6;border-radius: 0;
    .actionDesc{
        color:#328FE6;
    };
    .el-icon-plus{
        color:#328FE6;
    }
  }

  .el-icon-plus{
            color:#C5C5D1;

  }
  /*.toCancel{*/
    /*width:50px;*/
    /*height:20px;*/
    /*font-size:14px;*/
    /*font-family:PingFangSC-Medium;*/
    /*font-weight:500;*/
    /*color:rgba(73,73,82,1);*/
    /*line-height:20px;*/
    /*border:none;*/
  /*}*/
  .toSubmit{
    width:80px;
    height:34px;
    background:linear-gradient(315deg,rgba(53,92,219,1) 0%,rgba(49,107,227,1) 100%);
    border-radius:2px;
    opacity:0.4;
  }
  .box-card {
    width: 100%;
    height: 210px;
    background:rgba(245,245,250,0.6);
    margin-top: 3px;
  }
  .actionDesc{
    /*font-size:14px;*/
    /*font-family:PingFang-SC-Bold;*/
    /*font-weight:bold;*/
    /*color:rgba(164,165,179,1);*/
    /*padding-top: 15px;*/
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(164,165,179,1);
    line-height:20px;
    margin-top: 20px;
  }
 
  .el-dialog__title{
    font-size:22px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(16,16,21,1);
  }
</style>
