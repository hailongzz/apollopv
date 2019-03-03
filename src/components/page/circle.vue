<template>
<div class="circle-wrap">
  <el-progress
    class="circle-entity"
    type="circle"
    color="#0a6efa"
    :stroke-width="4"
    :width="width"
    :show-text="false"
    :percentage="percent"></el-progress>
  <span class="circle-wrap__power">{{power}}<span style="font-size: 12px">kW</span></span>
</div>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 60
    },
    capacity: {
      type: String,
      default: '100'
    },
    power: {
      type: String,
      default: '100kwh'
    }
  },
  computed: {
    percent () {
      let _capacity = parseFloat(this.capacity)
      let _power = parseFloat(this.power)
      if (!_capacity || !_power) {
        return 0
      } else {
        return parseInt(_power / _capacity * 100)
      }
    }
  }
}
</script>
<style lang="scss">
.circle-wrap{
  height: 60px;
  width: 60px;
  position: relative;
  text-align: center;
  .circle-entity{
    position: absolute;
    top: 0;
    left: 0;
  }
  &__power{
    width: 60px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }
}
</style>
