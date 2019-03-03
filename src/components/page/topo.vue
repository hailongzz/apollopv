// 拓扑结构
<template>
<ul >
  <li v-for="(item,index) in deviceList" :key="index" v-if="deviceList.length !== '0'">
    <div class="topowrap">
      <div class="topo-up">
        采集器 <el-button type="text"  @click="$router.push({name:'deviceStation-index',params: { id: scope.row.id, stationName:scope.row.stationName, t: Date.now() }})">{{item.snNumber}}</el-button>
        <div class="topo-up__status">
          <el-tag :type="item.isOnline | formatter_isOnlineType" style="margin-right:20px">
            <i :class="item.isOnline | formatter_isOnlineIcon"></i>
            {{item.isOnline | formatter_isOnline}}
          </el-tag>
          信号
          <img style="width:21px;height:17px;margin-left:8px;" :src="item.signalStrengthLevel | formatter_signal">
        </div>
      </div>
      <div class="topo-down">
        <div class="topo-down__left"></div>
        <div class="topo-down__right">
          逆变器 <el-button type="text">{{item.serialNumber}}</el-button>
          <div class="topo-down__right__status">
            <el-tag :type="item.isFault | formatter_isFaultType" style="margin-right:20px">
              <i :class="item.isFault | formatter_isFaultIcon"></i>
              {{item.isFault | formatter_isFault}}
            </el-tag>
            功率
            {{item.inverterRateOfWork}}kW
          </div>
        </div>
      </div>
    </div>
  </li>
  <div class="no_device" v-if="deviceList.length === 0 || deviceList[0].length === 0">电站暂未接入设备。。。</div>
</ul>
  
</template>

<script>
export default {
  data() {
    return {
      deviceList: []
    };
  },
  props: {
    powerStationId: String,
    requred: true,
    default: ""
  },
  created() {
    this.getId();
  },
  mounted() {
    this.$nextTick(function() {
      if (this.timer) {
        clearInterval(this.timer);
      } else {
        this.getId();
        this.timer = setInterval(() => {
          this.getId();
        }, 30000);
      }
    });
  },
  deactivated() {
    clearInterval(this.timer);
  },
  activated() {
    clearInterval(this.timer);
  },
  methods: {
    //获取id
    getId() {
      this.getIndexInfoList(this.powerStationId);
    },

    // 主要指标
    getIndexInfoList(id) {
      this.$http({
        url: this.$http.adornUrl(
          `powerStationOperation/gtpowerstation/stationDeviceList/${id}`
        ),
        method: "get",
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.deviceList = data.data;
          console.log("this.deviceList.length--->" + this.deviceList.length);
          console.log("this.deviceList[0].length--->" + JSON.stringify(this.deviceList[0]).length);
        } else {
          this.$message.error("系统异常");
        }
      });
    }
  },
  watch: {
    powerStationId(val) {
      if (val) {
        this.getId();
      }
    }
  },
  filters: {
    formatter_isOnlineType(cellValue) {
      switch (cellValue) {
        case '1':
          return "success";
        case '2':
          return "danger";
        case '0':
          return "info";
      }
    },
    formatter_isOnlineIcon(cellValue) {
      switch (cellValue) {
        case '1':
          return "el-icon-success";
        case '2':
          return "el-icon-warning";
        case '0':
          return "el-icon-remove";
      }
    },
    formatter_isOnline(cellValue) {
      switch (cellValue) {
        case '1':
          return "正常";
        case '2':
          return "故障";
        case '0':
          return "离线";
      }
    },
    formatter_isFaultType(cellValue) {
      switch (cellValue) {
        case '1':
          return "success";
        case '2':
          return "danger";
        case '0':
          return "info";
      }
    },
    formatter_isFaultIcon(cellValue) {
      switch (cellValue) {
        case '1':
          return "el-icon-success";
        case '2':
          return "el-icon-warning";
        case '0':
          return "el-icon-remove";
      }
    },
    formatter_isFault(cellValue) {
      switch (cellValue) {
        case '1':
          return "正常";
        case '2':
          return "故障";
        case '0':
          return "离线";
      }
    },
    formatter_signal(cellValue) {
      if (cellValue > 0 && cellValue <= 25) {
        return "/./static/img/signal_one.png";
      }
      if (cellValue > 25 && cellValue <= 50) {
        return "/./static/img/signal_two.png";
      }
      if (cellValue > 50 && cellValue <= 75) {
        return "/./static/img/signal_three.png";
      }
      if (cellValue > 75 && cellValue <= 100) {
        return "/./static/img/signal_four.png";
      }
      if (cellValue <= 0 && cellValue > 100) {
        return "/./static/img/signal_none.png";
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";
.no_device {
  width: 100%;
  line-height: 100px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.topowrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  color: $--color-305;
  font-weight: 500;
  min-width: 400px;
  .topo-up {
    width: 100%;
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
    box-sizing: border-box;
    background: #f5f5fa;
    &__status {
      float: right;
      width: 180px;
    }
  }
  .topo-down {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 35px;
    line-height: 35px;
    margin-top: 15px;
    &__left {
      position: relative;
      left: 10px;
      top: -15px;
      width: 10px;
      height: 35px;
      border-left: 1px dotted #a5a6b3;
      border-bottom: 1px dotted #a5a6b3;
    }
    &__right {
      flex-grow: 1;
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      box-sizing: border-box;
      background: #f5f5fa;
      margin-left: 10px;
      &__status {
        float: right;
        width: 180px;
      }
    }
  }
}
</style>
