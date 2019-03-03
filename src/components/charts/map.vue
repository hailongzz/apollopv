<template>
  <ve-bmap
    ref="bmap"
    :after-set-option="afterSet"
    :settings="chartSettings"
    :series="chartSeries"
    :tooltip="chartTooltip"
    :after-config="afterConfig"
    height="190px">
  </ve-bmap>
</template>

<script>
export default {
  data() {
    return {
      chartSeries: [
        {
          type: "scatter",
          coordinateSystem: "bmap",
          data: [
            [] // 经度，维度，value，...
          ]
        }
      ],
      chartSettings: {
        key: "cVOD4xzmS3k2p2XaCtIbH1Yms6oj1LZ0",
        bmap: {
          center: [], //[this.longitude,this.latitude],
          zoom: 14,
          roam: true,
          mapStyle: {}
        }
      },
      chartTooltip: { show: true }
    };
  },
  props: {
    parent_longitude: {
      type: String,
      requred: true
    },
    parent_latitude: {
      type: String,
      requred: true
    }
  },
  methods: {
    //获取id
    getId() {
      //this.$nextTick(() => {
      this.chartSettings.bmap.center = []
      this.chartSettings.bmap.center.push(
        parseFloat(this.parent_longitude),
        parseFloat(this.parent_latitude)
      );
    },
    afterConfig (options) { 
      options = {...this.chartSettings}
      return options
    },
    afterSet (charts) {
      let bmap = charts.getModel().getComponent('bmap').getBMap()
      let marker = new BMap.Marker(new BMap.Point(this.parent_longitude, this.parent_latitude))
      bmap.addOverlay(marker);  
    }
  },
  watch: {
    parent_longitude(val) {
      if (val) {
        this.getId();
      }
    }
  }
};
</script>
