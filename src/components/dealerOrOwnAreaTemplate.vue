<template>
  <el-cascader
    :options="provincesData"
    @active-item-change="handleItemChange"
    :props="props"
    v-model="selectedOptions"
    @change="getAreaData"
    placeholder="全部地区"
    :change-on-select="changeOnSelect"
    clearable
  ></el-cascader>
</template>

<script>
    export default {
        name: "dealerOrOwnAreaTemplate",
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
            data: {},
          }
        },
      props: {
        changeOnSelect: Boolean,  //
        reset: Boolean,
        organizationId: String,
        url: String
      },
      watch: {
        reset (newValue, oldValue) {
          // console.log(newValue)
          if (newValue) {
            this.selectedOptions = []
            // this.reset = !newValue
          }
        },
        selectedOptions (newValue, oldValue) {
          if (newValue.length === 0) {
            this.data = {
              areaCode: "",
              areaName: "",
              cityCode: "",
              cityName: "",
              provinceCode: "",
              provinceName: ""
            }
            this.$emit('getAreaData',this.data);
          }
        }
      },
      computed: {
        userObj: {
          get () {return this.$store.state.user.userObj},
        }
      },
      created (){
        this.getProvinceCityArea('1','')
      },
      methods: {
        handleItemChange (id) {
          console.log(this.selectedOptions)
          if(id.length === 1){
            this.getProvinceCityArea('2',id[0])
          }else if(id.length === 2){
            this.getProvinceCityArea('3',id[1])
          }
        },
        //获取省市区
        getProvinceCityArea (type,parentRegionCode) {
          var data = {
            organizationId: this.userObj.organizationId,
            type: type,
            parentRegionCode: parentRegionCode
          }
          this.$http({
            url: this.$http.adornUrl(this.url),
            method: 'post',
            data: this.$http.adornData(data)
          }).then(({data}) => {
            if(type === "1"){
              this.provinces = data.data
              data.data.find(item=>{
                var obj = {label:item.name,id:item.code,children: []}
                this.provincesData.push(obj)
              })
            }else if(type === "2"){
              this.cities = data.data
              var cityAry = []
              this.cities = data.data
              data.data.find(item=>{
                var obj = {label:item.name,id:item.code,children: []}
                cityAry.push(obj)
              })
              // console.log(cityAry)
              this.provincesData.find(i=>{
                if(i.id === parentRegionCode){
                  i.children = []
                  i.children = cityAry
                }
              })
            }else{
              this.areas = data.data
              this.areasData = []
              data.data.find(item=>{
                var obj = {label:item.name,id:item.code}
                this.areasData.push(obj)
              })
              this.provincesData.find(item=>{
                // var obj = {label:item.areaName,id:item.areaId}
                // item.cities.push(obj)
                item.children.find(i=>{
                  i.children = []
                  if(i.id === parentRegionCode){
                    i.children = this.areasData
                  }
                })
              })
            }

          })
        },
        // //获取所有市
        // getCity (id) {
        //   var data = {
        //     provinceId: id
        //   }
        //   this.$http({
        //     url: this.$http.adornUrl('powerstation/gtpowerstation/getCityByProvince'),
        //     method: 'post',
        //     data: this.$http.adornData(data)
        //   }).then(({data}) => {
        //     var cityAry = []
        //     this.cities = data.list
        //     data.list.find(item=>{
        //       var obj = {label:item.cityName,id:item.cityId,children: []}
        //       cityAry.push(obj)
        //     })
        //     console.log(cityAry)
        //     this.provincesData.find(i=>{
        //       if(i.id === data.list[0].provinceId){
        //         i.children = []
        //         i.children = cityAry
        //       }
        //     })
        //   })
        // },
        // //获取所有区
        // getArea (id) {
        //   var data = {
        //     cityId: id
        //   }
        //   this.$http({
        //     url: this.$http.adornUrl('powerstation/gtpowerstation/getAreaByCity'),
        //     method: 'post',
        //     data: this.$http.adornData(data)
        //   }).then(({data}) => {
        //     this.areas = data.list
        //     this.areasData = []
        //     data.list.find(item=>{
        //       var obj = {label:item.areaName,id:item.areaId}
        //       this.areasData.push(obj)
        //     })
        //     this.provincesData.find(item=>{
        //       // var obj = {label:item.areaName,id:item.areaId}
        //       // item.cities.push(obj)
        //       item.children.find(i=>{
        //         i.children = []
        //         if(i.id === id){
        //           i.children = this.areasData
        //         }
        //       })
        //     })
        //   })
        // },
        //
        getAreaData (id) {
          if(this.changeOnSelect){
            this.handleItemChange(id)
          }

          this.provinces.find(item => {
            if(this.selectedOptions.length >0 && item.code === this.selectedOptions[0]){
              this.data.provinceCode = item.code
              this.data.provinceName = item.name
            }
          })
          this.cities.find(item => {
            if(this.selectedOptions.length >1 && item.code === this.selectedOptions[1]){
              this.data.cityCode = item.code
              this.data.cityName = item.name
            }
          })
          this.areas.find(item => {
            if(this.selectedOptions.length >2 && item.code === this.selectedOptions[2]){
              this.data.areaCode = item.code
              this.data.areaName = item.name
            }
          })
          console.log(this.selectedOptions)
          console.log(this.data)
          this.$emit('getAreaData',this.data);
        }
      }
    }
</script>

<style scoped>

</style>
