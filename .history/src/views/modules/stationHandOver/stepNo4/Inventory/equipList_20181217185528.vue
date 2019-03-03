<template>
    <el-col :span="8"
      style="margin-bottom:5px;margin-top: 13px; padding-left: 1px; padding-bottom: 50px;"
    >
      <div style="width: 95%;">
        <el-card class="box-card" style="padding: 0px;width: 100%; height: 210px;border-radius: 0">
          <div class="contactInfoActionDiv1">
            <label class="equipNameStyle">{{detail.deviceTypeName}}</label>
          </div>
          <div class="contactInfoActionDiv2">
            <label class="equipCodeStyle">{{detail.total}}</label>
          </div>
          <!--<div class="contactInfoActionDiv2"></div>-->
          <div v-for="(i,index1) in detail.deviceTypeDetails" v-if="detail.deviceTypeDetails.length>=4?index1<2:index1<=2" :key="index1">
            <div style="height: 25px;margin-top: 10px">
              <div class="equipOptionDiv">
                <div class="part1">
                  <label class="equipOptionLabel" style="padding-right: 15px;">{{i.deviceBrand}}</label>
                  <label style="padding-right: 15px; font-weight: 200">{{i.deviceModel}}</label>
                  <label style="padding-right: 15px;font-weight: 200">{{i.deviceNumber}}</label>
                </div>
                <div style="float:right">
                  <a class="equipOptionAction" @click="openEdit(index1)">编辑</a>
                  <span class="spe"></span>
                  <a class="equipOptionAction" @click="deleteItem(i)">删除</a>
                </div>
              </div>
            </div>
            <div class="equipDashStyle" v-if="detail.deviceTypeDetails.length>1 && index1 == 0"></div>
            <div class="equipDashStyle" v-if="detail.deviceTypeDetails.length>2 && index1 == 1"></div>
          </div>
          <div v-if="detail.deviceTypeDetails.length>=4">
          <div style="margin-top: 15px" id="showLast">
          <div>
          <a class="showOthers" @click="dialogVisible=true">查看全部<span>{{(detail.deviceTypeDetails.length)}}</span>个型号<i class="el-icon-arrow-right" style="font-size: 14px;font-weight:800"></i></a>
          </div>
          </div>
          </div>
          <el-dialog
            title="组件"
            :visible.sync="dialogVisible"
            width="950px"
            style="margin-left: 180px; color: red !important;"
            :before-close="handleClose"
          >
            <addComInfo :list="detail.deviceTypeDetails" @openEdit="openEdit" @deleteItem="deleteItem"></addComInfo>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false" class="toCancel">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">提交</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="组件"
            :visible.sync="editVisible"
            width="950px"
            style="margin-left: 180px; color: red !important;"
            :before-close="handleClose"
          >
            <equipEdit
              :editItem="editItem"
              :deviceTypeName="detail.deviceTypeName"
              ref="editForm"
              :deviceTypeId="detail.deviceTypeId"
              @loadEquipList="loadEquipList"
              :options="options"
            ></equipEdit>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editVisible = false" class="toCancel">取 消</el-button>
              <el-button type="primary" @click="submit">提交</el-button>
            </span>
          </el-dialog>
          <!--<div class="contactInfoActionDiv3"><equipOption></equipOption></div>-->
          <!--<div class="contactInfoActionDiv4"><label class="contactRemarkContentStyle">备注内容占位备注内容占位备注内容占位</label></div>-->
          <!--<div class="rowline"></div>-->
          <!--<div class="contactInfoActionDiv5">-->
          <!--<div class="contactInfoButton contactInfoActionEdit"><a class="contactInfoActionLabel" id="toEdit">编辑</a></div>-->
          <!--<div id="spea"></div>-->
          <!--<div class="contactInfoButton contactInfoActionDelete"><a class="contactInfoActionLabel">删除</a></div>-->
          <!--</div>-->
        </el-card>
      </div>
    </div>
</template>
<script>
import equipOption from "../Inventory/equipOption";
import equipDash from "../Inventory/equipDash";
import addComInfo from "../Inventory/addComInfo";
import equipEdit from './equipEdit'
import {isObject,cloneDeep} from 'lodash'
export default {
  name: "equipList",
  data() {
    return {
      dialogVisible: false,
      editVisible:false,
      editItem:{

      }
    };
  },
  props: ["detail","options"],
  methods: {
    countEquip: function() {
      var count = document.getElementById("#countEquip").value;
      if (count === 4) {
      }
    },
    toShow: function() {
      var count = document.getElementById("countEquip").value;
      if (count.toString() == 4) {
        document.getElementById("xxx").style.display = "block";
      }
    },
    openEdit(index){
      if(isObject(index)){
         this.editItem = cloneDeep(index);
      }else{
        this.editItem = cloneDeep(this.detail.deviceTypeDetails[index])
      }
      this.editVisible = true;
    },
    loadEquipList(flag){
      if(flag){
        this.editVisible = false;
      }
      this.$emit('loadEquipList')
    },
    submit(){
      this.$refs.editForm.submit()
    },
    deleteItem(row){
      this.$confirm(`是否删除${row.deviceBrand}${row.deviceModel}${row.deviceNumber}个盘点记录?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('stationhandover/equipmentInventory/checkDelete'),
            method: 'post',
            data: this.$http.adornData({
              id:row.id,
            })
          }).then(({data})=>{
            if(data.code==0){
              this.$message({
                type: 'success',
                message:'删除成功'
              })
              this.$emit('loadEquipList')
            }
          })
        }).catch(() => {

        });
    }
  },
  components: {
    equipOption,
    equipDash,
    addComInfo,
    equipEdit
  }
};
</script>
<style scoped>
.equipOptionAction {
  text-decoration: none;
}
.equipOptionDiv {
  margin: 10px 0px;
}
.equipOptionAction {
  width: 27px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(41, 152, 253, 1);
  line-height: 20px;
  cursor: pointer;
}
.part1 {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: rgba(73, 73, 82, 1);
  line-height: 20px;
  float: left;
}
.spe {
  width: 1px;
  height: 13px;
  border: 1px solid rgba(215, 216, 224, 1);
  margin-left: 10px;
  margin-right: 10px;
}
.equipDashStyle {
  width: 100%;
  height: 1px;
  opacity: 0.6;
  border: 1px dashed rgba(215, 216, 224, 1);
  margin-top: 4px;
  margin-bottom: -4px;
}
.showOthers {
  width: 92px;
  height: 20px;
  font-size: 13px;
  font-family: PingFangSC-Semibold;
  font-weight: 900;
  color: rgba(164, 165, 179, 1);
  line-height: 17px;
  text-decoration: none;
}
.equipCodeStyle {
  width: 77px;
  height: 30px;
  font-size: 28px;
  font-family: HelveticaNeue-Medium;
  font-weight: 500;
  color: rgba(62, 62, 71, 1);
  line-height: 30px;
}
.equipNameStyle {
  width: 49px;
  height: 14px;
  font-size: 14px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: rgba(49, 49, 56, 1);
  line-height: 14px;
}
.contactInfoActionDiv2 {
  margin: 10px 0px;
  margin-bottom: 22px;
}
.contactInfoActionDiv5 {
  width: 100%;
}
.el-card__body {
  margin-bottom: 13%;
}
.contactInfoActionDiv1 {
}
#spea {
  float: left;
  width: 2%;
  border-left: 1px solid #cccccc;
  height: 20px;
  margin-top: 10px;
}

.clear {
  display: inline-block;
  clear: both;
  overflow: hidden;
}
.box-card {
  width: 362px;
  height: 210px;
  float: left;
  padding: 0px;
}
.contactInfoActionDiv {
  float: left;
  width: 49%;
  height: 20px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(138, 139, 153, 1);
  line-height: 20px;
  text-align: center;
}
.contactNameStyle {
  width: 54px;
  height: 20px;
  font-size: 18px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: rgba(33, 32, 41, 1);
  line-height: 20px;
  margin-left: 24px;
}
.contactRoleDiv {
  width: 76px;
  height: 20px;
  background: rgba(252, 173, 35, 1);
  border-radius: 2px;
  opacity: 0.9;
  display: inline-block;
  margin-left: 12px;
}
.contactRoleSpan {
  width: 60px;
  height: 20px;
  font-size: 12px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
  margin-left: 8px;
}
.contactRemarkContentStyle {
  width: 302px;
  height: 60px;
  font-size: 12px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(164, 165, 179, 1);
  line-height: 60px;
  margin-left: 24px;
  margin-bottom: 19px;
  margin-top: 18px;
}
.box-card .el-card__body {
  padding: 0px;
}
.rowline {
  width: 110%;
  height: 1px;
  opacity: 0.4;
  border: 1px solid rgba(215, 216, 224, 1);
  margin-left: -20px;
}
.toSubmit {
  width: 80px;
  height: 34px;
  border-radius: 2px;
}
.toSubmit:hover {
  cursor: pointer;
}
#showLast {
  cursor: pointer;
}
</style>
