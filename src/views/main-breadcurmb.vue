<template>
	<div :class="['breadcurmb', {'breadcurmbFold': sidebarFold}]" >
		<el-breadcrumb separator="|">
			<!-- <el-breadcrumb-item :to="{ path: '/' }" class="crumb_hover_color"><i class="el-icon-tickets"></i>首页</el-breadcrumb-item> -->
			<el-breadcrumb-item   v-for="(item, index) in routeMetaList" 
        v-if="item.meta.title && index > 0" 
        :key="index" 
        @click.native="breadRoute(item)" 
        :class="['crumb_hover_color', 'breadcurmb-item', {'crumb_color': index===routeMetaList.length-1}]">
          <i v-if="index === 1 && routeMetaList.length > 2" class="icon_back breadcurmbBack"></i>
          <span v-else>{{item.meta.title}}</span>
      </el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>
<script>
export default {
  data () {
    return {
      routeMetaList: []
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      if (this.$route.matched.length > 0) {
        let _arr = []
        this.$route.matched.forEach(item => {
          if (item && item.meta && item.meta.title) {
            _arr.push(item)
          }
        })
        this.routeMetaList = [].concat(_arr)
      }
    },
    breadRoute (item) {
      this.$router.push({ name: item.name })
    }
  },
  computed: {
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    }
  }
}
</script>
<style lang="scss">
.breadcurmb{
  position: fixed;
  top: 44px;
  left: 180px;
  width: 100%;
  height: 48px;
	background: #fff;
	padding: 22px 30px 12px 30px;;
  box-sizing: border-box;
  z-index: 1000;
  transition: inline-block .3s, left .3s, width .3s, margin-left .3s, font-size .3s;
	&__icon{
		margin-right: 5px;
	}
  .breadcurmb-item span{
    cursor: pointer!important;
    font-size: 12px;
    color:#8A8B99!important;
  }
  .breadcurmbBack{
    font-size: 29px;
    color: #8A8B99;
    position: relative;
    top: -7px;
    right: -0px;
    margin-left: -4px;
  }
  .el-breadcrumb__item:first-child .el-breadcrumb__separator{
    position: relative;
    top: -15px;
    margin: 9px 10px 8px 3px;
  }
}
.breadcurmbFold {
  left: 70px!important;
}
</style>
