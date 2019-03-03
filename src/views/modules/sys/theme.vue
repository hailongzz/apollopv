<template>
  <el-form>
    <h2>请选择配色</h2>
    <el-form-item label="配色列表">
      <el-radio-group v-model="matchColorsType">
        <el-radio label="envision-theme" border>远景配色</el-radio>
        <el-radio label="ats-theme" border>阿特斯配色</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="导航条类型">
      <el-radio-group v-model="navbarLayoutType">
        <el-radio label="default" border>default</el-radio>
        <el-radio label="inverse" border>inverse</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="侧边栏皮肤">
      <el-radio-group v-model="sidebarLayoutSkin">
        <el-radio label="light" border>light</el-radio>
        <el-radio label="dark" border>dark</el-radio>
      </el-radio-group>
    </el-form-item> -->
  </el-form>
</template>

<script>
  export default {
    computed: {
      matchColorsType: {
        get () { return this.$store.state.common.matchColorsType },
        set (val) { this.$store.commit('common/updateMatchColorsType', val) }
      },
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType },
        set (val) { this.$store.commit('common/updateNavbarLayoutType', val) }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin },
        set (val) { this.$store.commit('common/updateSidebarLayoutSkin', val) }
      }
    },
    watch: {
      matchColorsType (val) {
        this.toggleTheme(val)
      }
    },
    methods: {
      toggleTheme  (val) {
        let Ele = document.getElementsByTagName('body')[0]
        Ele.classList.remove('envision-theme')
        Ele.classList.remove('ats-theme')
        Ele.classList.add(val)        
      }
    }
  }
</script>

