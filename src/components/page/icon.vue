<template>
  <i :class="map[type]['icon']" :style="map[type]['style']"></i>
</template>
<script>
export default {
  props: {
    type: {
      required: true
    }
  },
  data () {
    return {
      map: {
        warning: { // 故障
          icon: 'el-icon-warning',
          style: 'color: #f74c60'
        },
        remove: { // 离线
          icon: 'el-icon-remove',
          style: 'color: #bcbed1'
        },
        success: {// 正常
          icon: 'el-icon-success',
          style: 'color: #0ede77'
        },
        error: {
          icon: 'el-icon-error',
          style: 'color: #a2a5bd'
        }
      }
    }
  }
}
</script>
