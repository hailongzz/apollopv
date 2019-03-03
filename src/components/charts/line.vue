<template>
  <ve-line class="chart" height='300px' :data="chartData" :settings="chartSettings" :legend="legend"></ve-line><!--:data-empty="dataEmpty"-->
</template>

<script>
export default {
  data() {
    this.chartSettings = {
      metrics: [], //["23543","4e21431","GW3000-OS","GW3000-PS","4e21430"]
      dimension: ["日期"],
      yAxisName: ["kwp"],
      xAxisType: "category"
      //xAxisType: 'time'
    };
    this.columnsList = [];
    this.rowsList = [];
    return {
      chartData: {
        columns: [],
        rows: []
      },
      legend: {
        icon: "rect",
        right: "45%",
        itemWidth: 13,
        itemHeight: 3,
        itemGap: 20, 
        //data: this.legendList,
        textStyle: { fontSize: 12, color: "#A2A5BD" }
      }
      //dataEmpty: false
    };
  },
  props: {
    chartDate: String,
    requred: true,
    default: ""
  },
  // mounted() {
  //   this.getChartList()
  // },
  created() {
    this.getChartList();
  },
  methods: {
    // 主要指标
    getChartList(time) {
      var params = {
        dateTime: "2018-11-07", //time,
        id: "4aa53b5934ec43189c4978cbd8ba806c" //this.$route.query.id
      };
      this.$http({
        url: this.$http.adornUrl(`powerStationOperation/gtpowerstation/curve`),
        method: "post",
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.data) {
            this.rowsList = [];
            this.columnsList = [];
            for (var i = 0; i < data.data[0].invertData.length; i++) {
              var o1 = { 日期: data.data[0].invertData[i].dateTime };
              var o3 = {};
              this.columnsList = ["日期"];
              this.columnList = [];
              for (var j = 0; j < data.data.length; j++) {
                var interverName = data.data[j].interverSN;
                var o2 = {
                  [interverName]: data.data[j].invertData[i].totalRateOfWork
                };

                var device = Object.assign(o3, o2);
                this.columnsList.push(interverName);
                this.columnList.push(interverName);
              }

              var obj = Object.assign(o1, o3);
              this.rowsList.push(o1);
            }
            // console.log("this.rowsList--->" + );
            this.chartSettings.metrics = this.columnList;
            this.chartData.columns = this.columnsList;
            this.chartData.rows = this.rowsList;
          } else {
            this.chartData.rows = [];
            this.chartData.columns = [];
            this.chartSettings.metrics = [];
            // console.log("--------this.chartData" + JSON.stringify(this.chartData));
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    afterConfig(options) {
      options = { ...this.chartSettings };
      return options;
    }
  }
};
</script>
<style lang="scss">
.chart {
  top: -25px;
}
canvas {
  height: 360px !important;
}
</style>