<template>
  <div>
    <el-cascader
      :options="provincesData"
      @active-item-change="handleItemChange"
      :props="props"
      v-model="selectedOptions"
      @change="getAreaData"
      placeholder="全部地区"
      :change-on-select="changeOnSelect"

    ></el-cascader>
  </div>
</template>

<script>
export default {
  name: "areaTemplate",
  data () {
      return{
        provincesData: [],
        selectedOptions: [],
        props: {
          value: 'id',
          lable: 'lable',
          children: 'children'
        },
        provinces: [],
        cities: [],
        areas: [],
        areasData: [],
        data: {}
      }
  },
  props: {
    changeOnSelect: Boolean,  //
    reset: Boolean,
    organizationId: String,
    selectedValue: Array
  },
  watch: {
    reset (newValue, oldValue) {
      // console.log(newValue)
      if (newValue) {
        this.selectedOptions = []
      }
    },
    selectedValue (newValue, oldValue) {
      console.log(newValue)
      this.selectedOptions = newValue
      // this.selectedOptions = this.selectedValue
      if(newValue.length !== 0){
        this.getProvince()
        console.log("3"+this.selectedValue)
      }
      console.log(newValue)
    },
    organizationId (newValue, oldValue) {
      // console.log(newValue)
      if (newValue) {
        this.getProvince()
        console.log("2"+this.selectedValue)
      }
    },
  },
  created (){

    this.getProvince()
    console.log("1"+this.selectedValue)
    this.selectedOptions = this.selectedValue
  },
  methods: {
    handleItemChange (id) {
      console.log(this.selectedOptions)
      if(id.length === 1){
        this.getCity(id[0])
      }else if(id.length === 2){
        this.getArea(id[1])
      }
    },
    //获取所有省
    getProvince () {
      console.log(this.organizationId)
      var data = {
        organizationId: this.organizationId || ''
      }
      this.$http({
        url: this.$http.adornUrl('powerStationOperation/gtpowerstation/getAllProvince'),
        method: 'post',
        data: this.$http.adornData(data)
      }).then(({data}) => {
        this.provinces = []
        this.provinces = data.list
        this.provincesData = []
        data.list.find(item=>{
          var obj = {label:item.provinceName,id:item.provinceId,children: []}
          this.provincesData.push(obj)
        })
        if(this.selectedValue.length > 1){
          this.getCity (this.selectedValue[0])
          // this.getArea (this.selectedValue[1])
        }
      })
    },
    //获取所有市
    getCity (id) {
      var data = {
        provinceId: id
      }
      this.$http({
        url: this.$http.adornUrl('powerStationOperation/gtpowerstation/getCityByProvince'),
        method: 'post',
        data: this.$http.adornData(data)
      }).then(({data}) => {
        var cityAry = []
        this.cities = data.list
        data.list.find(item=>{
          var obj = {label:item.cityName,id:item.cityId,children: []}
          cityAry.push(obj)
        })
        this.provincesData.find(i=>{
          if(i.id === data.list[0].provinceId){
            i.children = []
            i.children = cityAry
          }
        })
        if(this.selectedValue.length > 2){
          // this.getCity (this.selectedValue[0])
          this.getArea (this.selectedValue[1])
        }
      })
    },
    //获取所有区
    getArea (id) {
      var data = {
        cityId: id
      }
      this.$http({
        url: this.$http.adornUrl('powerStationOperation/gtpowerstation/getAreaByCity'),
        method: 'post',
        data: this.$http.adornData(data)
      }).then(({data}) => {
        this.areas = data.list
        this.areasData = []
        data.list.find(item=>{
          var obj = {label:item.areaName,id:item.areaId}
          this.areasData.push(obj)
        })
        this.provincesData.find(item=>{
          // var obj = {label:item.areaName,id:item.areaId}
          // item.cities.push(obj)
          item.children.find(i=>{
            i.children = []
            if(i.id === id){
              i.children = this.areasData
            }
          })
        })
      })
    },
    //
    getAreaData (id) {
      // debugger
      if(this.changeOnSelect){
        this.handleItemChange(id)
      }
      this.data = {}
      console.log(this.selectedOptions)
      this.provinces.find(item => {
        if(this.selectedOptions.length >0 && item.provinceId === this.selectedOptions[0]){
          this.data.provinceCode = item.provinceId
          this.data.provinceName = item.provinceName
        }
      })
      this.cities.find(item => {
        if(this.selectedOptions.length >1 && item.cityId === this.selectedOptions[1]){
          this.data.cityCode = item.cityId
          this.data.cityName = item.cityName
        }
      })
      this.areas.find(item => {
        if(this.selectedOptions.length >2 && item.areaId === this.selectedOptions[2]){
          this.data.areaCode = item.areaId
          this.data.areaName = item.areaName
        }
      })
      console.log(this.selectedOptions)
      this.$emit('getAreaData',this.data);
    }
  }
}
</script>

<style scoped>

</style>
