<template>
  <div style="width:100%;">
    <div style="width: 100%;margin-left: 32px;">
      <div class="title">盘点设备</div>
      <!--<div class="nav1"><img src="../../../../../assets/img/ziming-backward.png" width="12px" height="10px" style="margin-bottom: 7px"/></div>-->
      <!--<div class="navx"></div>-->
      <!--<div class="nav2">交接详情</div>-->
      <!--<div class="navx"></div>-->
      <!--<div class="nav3">联系人管理</div>-->
      <!--</div>-->
      <!--<div style="width:100%;margin-top: 15px; padding-left: 32px; padding-right: 2%;">-->
      <!--<div class="title1">联系人管理</div>-->
      <!--<div class="title2">阿波罗光伏站一号</div>-->
      <!--<div class="title3"><img src="../../../../../assets/img/ziming_export.png"/><span class="title3Content">导出</span></div>-->
      <!--</div>-->
      <div style="height: calc(100vh - 300px );overflow:auto;">
        <addEquip @loadEquipList="loadEquipList" :options="options"></addEquip>
        <equipList
          v-for="(item,index) in equipList"
          :key="index"
          :detail="item"
          @loadEquipList="loadEquipList"
          :options="options"
        />
      </div>
    </div>
  </div>
</template>
<script>
import addEquip from "../Inventory/addEquip";
import equipList from "../Inventory/equipList";
export default {
  name: "contactsTab",
  data() {
    const {
      query: { powerStationId }
    } = this.$route;
    return {
      activeContent: "second",
      powerStationId,
      equipList: [],
      options: [],
      page: 1,
      limit: 10
    };
  },
  created() {
    this.loadEquipList();
    this.getStationTypes();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getStationTypes() {
      this.$http({
        url: this.$http.adornUrl("stationhandover/enterSence/deviceTypeInfo"),
        method: "post",
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data.code == 0) {
          this.options = Array.isArray(data.list) ? data.list : [];
        }
      });
    },
    loadEquipList() {
      const { powerStationId, page, limit } = this;
      this.$http({
        url: this.$http.adornUrl(
          "stationhandover/equipmentInventory/checkList"
        ),
        method: "post",
        data: this.$http.adornData({
          powerStationId: powerStationId + "",
          page: page + "",
          limit: limit + ""
        })
      }).then(({ data }) => {
        if (data.code == 0) {
          this.equipList =
            data.data && Array.isArray(data.data.list) ? data.data.list : [];
            // this.$emit("checkParamsEvent",{keyname: 'checkDevice', isok: this.equipList.length});
        }
      });
    }
  },
  components: {
    addEquip,
    equipList
    // addInter,
    // interList
  }
};
</script>
<style scoped>
.title {
  width: 72px;
  height: 40px;
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(16, 16, 21, 1);
  line-height: 40px;
}
.el-tabs__item {
  width: 91px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(138, 139, 153, 1);
  line-height: 14px;
}
.el-tabs__nav-wrap::after {
  width: 90px !important;
}
#tab-internalStaffTab,
#tab-externalContactTab {
  width: 91px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(138, 139, 153, 1);
  line-height: 14px;
}
.el-tabs__active-bar is-top :active {
  width: 105px;
  height: 2px;
  background: rgba(53, 92, 219, 1);
}
.navx {
  width: 1px;
  height: 12px;
  background: rgba(197, 197, 209, 1);
  float: left;
  margin-left: 9px;
  margin-right: 9px;
}
.nav1 {
  width: 12px;
  height: 10px;
  /*background:rgba(197,197,209,1);*/
  float: left;
  margin-top: 1px;
  margin-bottom: 1px;
}
.nav2 {
  width: 60px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(16, 16, 21, 1);
  line-height: 14px;
  float: left;
}
.nav3 {
  width: 71px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(16, 16, 21, 1);
  line-height: 14px;
  float: left;
}
.title3 img {
  width: 16px;
  height: 14px;
  /*//background:rgba(73,73,82,1);*/
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 15px;
  float: left;
  margin-right: 9px;
}
.title3Content {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(73, 73, 82, 1);
  line-height: 34px;
  float: left;
}
.title3 {
  padding-right: 15px;
  height: 34px;
  border-radius: 2px;
  border: 1px solid rgba(215, 216, 224, 1);
  float: right;
  margin: 0px;
}
.title2 {
  width: 181px;
  height: 20px;
  font-size: 14px;
  font-family: PingFang-SC-Heavy;
  font-weight: 800;
  color: rgba(164, 165, 179, 1);
  line-height: 20px;
  margin-top: 12px;
  margin-bottom: 8px;
  margin-left: 10px;
  float: left;
}
.title1 {
  width: 103px;
  height: 20px;
  font-size: 20px;
  font-family: PingFang-SC-Heavy;
  font-weight: 800;
  color: rgba(16, 16, 21, 1);
  line-height: 20px;
  margin-left: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
  float: left;
}
#elTabs {
  width: 100%;
  margin-left: 32px;
}
.internalStaffTabStyle,
.externalContactTabStyle {
  width: 91px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(138, 139, 153, 1);
  line-height: 14px;
}
.internalStaffTabStyle,
.externalContactTabStyle {
  width: 91px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(138, 139, 153, 1);
  line-height: 14px;
}
.externalContactTabStyle div {
  float: left;
}
.externalContactTabStyle {
  width: 100%;
}
el-tab-pane {
  width: 105px;
  height: 2px;
  background: rgba(53, 92, 219, 1);
}
.el-tabs__active-bar is-top {
  background-color: #355cdb;
}
.el-tabs__active-bar {
  background-color: #355cdb;
}
.el-tabs__item:hover {
  background-color: #355cdb;
}
.el-tabs__item.is-active {
  color: black;
}
</style>

