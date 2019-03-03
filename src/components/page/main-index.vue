// 主要指标
<template>
  <ul class="main-index__ul">
    <li class="main-index__ul__li">
      <div><img style="width:36px" :src= weatherImg /></div>
      <div class="main-index__ul__li__item">
        <span>{{this.weatherTxt}}</span>
        <span>{{this.weatherTmp}}°C</span>
      </div>
    </li>
    <li class="main-index__ul__li">
      <div class="main-index__ul__li__icon">日</div>
      <div class="main-index__ul__li__item">
        <span>当日发电量</span>
        <span>{{indexInfoData.todayPower}}kWh</span>
      </div>
    </li>
    <li class="main-index__ul__li">
      <div class="main-index__ul__li__icon">月</div>
      <div class="main-index__ul__li__item">
        <span>当月发电量</span>
        <span>{{indexInfoData.thisMonthPower}}kWh</span>
      </div>
    </li>
    <li class="main-index__ul__li">
      <div class="main-index__ul__li__icon">年</div>
      <div class="main-index__ul__li__item">
        <span>当年发电量</span>
        <span>{{indexInfoData.thisYearPower}}kWh</span>
      </div>
    </li>
    <li class="main-index__ul__li">
      <div class="main-index__ul__li__icon">总</div>
      <div class="main-index__ul__li__item">
        <span>累计发电量</span>
        <span>{{indexInfoData.totalPower}}kWh</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      indexInfoData: {},
      weatherTmp: "",
      weatherTxt: "",
      weatherImg: ""
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
      this.getWeatherList(this.powerStationId);
    },

    // 天气
    getWeatherList(id) {
      this.$http({
        url: this.$http.adornUrl(
          `powerStationOperation/gtpowerstation/stationWeather/${id}`
        ),
        method: "get",
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("this.weather--->" + this.weather)
          this.weatherTmp = data.weather !== null ? data.weather.heWeather6[0].now.tmp : "";
          this.weatherTxt = data.weather !== null ? data.weather.heWeather6[0].now.cond_txt : "";
          this.weatherImg = data.weather !== null ? '/./static/img/' + data.weather.heWeather6[0].now.cond_code+ '.png' : ""
        } 
        else {
          this.weatherTmp = "--"
          this.weatherImg = '/./static/img/999.png'
          //this.$message.error("系统异常");
        }
      });
    },

    // 主要指标
    getIndexInfoList(id) {
      this.$http({
        url: this.$http.adornUrl(
          `powerStationOperation/gtpowerstation/powerStationIndex/${id}`
        ),
        method: "get",
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.indexInfoData = data.data;
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
  }
};
</script>

<style lang="scss">
.main-index__ul {
  display: flex;
  flex-direction: row;
  &__li {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    height: 40px;
    align-items: center;
    &__icon {
      height: 36px;
      line-height: 36px;
      width: 36px;
      text-align: center;
      border-radius: 50%;
      border: 1px solid #d0d3df;
      box-sizing: border-box;
    }
    &__item {
      height: 40px;
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      justify-content: space-around;
      span:first-child {
        height: 20px;
        font-size: 14px;
        // font-family:PingFangSC-Regular;
        font-weight: 400;
        color: rgba(162, 165, 189, 1);
        line-height: 20px;
      }
      span:last-child {
        width: 66px;
        height: 30px;
        font-size: 22px;
        // font-family:PingFangSC-Medium;
        font-weight: 500;
        color: rgba(75, 79, 107, 1);
        line-height: 30px;
      }
    }
  }
}
</style>
