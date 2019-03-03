<template>
  <span :class="isCheckedStyle" ref="radio" @click="emit()"></span>
</template>
<script>
export default {
  props: {
    uniqueId: {
      default: '',
      required: true
    },
    authObjType: {
      default: '',
      required: true
    },
    mark: {
      required: true
    },
    selfdata: {
      default: {}
    },
    indexes: { // 索引
      type: String,
      default: '0'
    }
  },
  methods: {
    toggleCheck () { // 手动切换
      // 修改自身样式
      if (this.isChecked()) {
        this.unChecked()
      } else {
        this.checked()
      }
      
    },
    emit () {
      if (this.checkBadDealer(this.userObj.roleList)) {
        return false
      } else {
        this.toggleCheck()
        this.$emit('state', {
          authObjType: this.authObjType,
          uniqueId: this.uniqueId,
          checked: this.isChecked(),
          indexes: this.indexes,
          mark: this.mark
        })
      }
    },
    // 判断是否经销商
    checkBadDealer (arr) {
      let _state = false
      arr.forEach(item => {
        if (item.roleId === '4') {
          _state = true
        }
      })
      if (_state && this.mark === '61') {
        return true
      } else {
        return false
      }
    },
    checked () {
      this.$refs.radio.classList.add('gt-radioChecked')
    },
    unChecked () {
      this.$refs.radio.classList.remove('gt-radioChecked')
    },
    isChecked () {
      let _classList =  Array.from(this.$refs.radio.classList)
      return  _classList.indexOf('gt-radioChecked') > -1
    }
  },
  computed: {
    isCheckedStyle () {
      if (this.checkBadDealer(this.userObj.roleList)) {
        return 'gt-radio gt-radioNot'
      }
      if (this.selfdata[this.uniqueId] && this.selfdata[this.uniqueId]['data'].indexOf(this.mark) > -1) {
        return 'gt-radio gt-radioChecked'
      } else if (this.selfdata[this.uniqueId] && this.selfdata[this.uniqueId]['data'].indexOf(this.mark + '_half') > -1) {
        return 'gt-radio gt-radioHalfChecked'
      } else {
        return 'gt-radio'
      }
    },
    userObj: {
      get () {
        return this.$store.state.user.userObj
      }
    }
  }
}
</script>

<style lang="scss">
// gt-radio 基础样式
// gt-radioChecked 选中
// gt-radioHalfChecked 半选选中
.gt-radio{
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #d8d9e6;
  border-radius: 50%;
  position: relative;
  &:hover{
    cursor: pointer;
  }
  &Checked{
    background: #0A6EFA;
    &:after{
      box-sizing: content-box;
      content: "";
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      width: 3px;
      height: 7px;
      position: absolute;
      left: 6px;
      top: 3px;
      transform: rotate(45deg);
      transition: transform .15s ease-in .05s;
      transform-origin: center;
    }
  }
  &HalfChecked{
    background: #D8D9E6;
    &:after{
      box-sizing: content-box;
      content: "";
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      width: 3px;
      height: 7px;
      position: absolute;
      left: 6px;
      top: 3px;
      transform: rotate(45deg);
      transition: transform .15s ease-in .05s;
      transform-origin: center;
    }
  }
  &Not{
    background: #d8d9e6;
  }
}
</style>

