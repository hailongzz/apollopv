<template>
	<div class="chart-wrapper">
    <canvas width="50" height="50" :id="ids"></canvas>
  </div>
</template>

<script>
const F2 = require('@antv/f2')
export default {
  props: {
    ids: {
      type: String,
      required: true,
      default: Math.random() + ''
    }
  },
  data () {
    return {
      data: [{
        x: '1',
        y: 85
      }],
      chart: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      var chart
      chart = new F2.Chart({
        id: this.ids,
        pixelRatio: window.devicePixelRatio,
        padding: 0
      })
      chart.source(this.data, {
        y: {
          max: 100,
          min: 0
        }
      })
      chart.axis(false)
      chart.tooltip(false)
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.8,
        radius: 0.85
      })
      chart.guide().arc({
        start: [0, 0],
        end: [1, 99.98],
        top: false,
        style: {
          lineWidth: 2,
          stroke: '#ccc'
        }
      })
      chart.guide().text({
        position: ['50%', '50%'],
        content: '19.2kW',
        style: {
          fontSize: '15px',
          fill: '#1890FF'
        }
      })
      chart.interval().position('x*y').size(2).animate({
        appear: {
          duration: 1200,
          easing: 'cubicIn'
        }
      })
      chart.render()
    }
  }
}
</script>


