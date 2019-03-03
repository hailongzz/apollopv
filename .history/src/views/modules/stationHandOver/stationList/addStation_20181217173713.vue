<template>
  <el-form ref="stationForm" :model="stationForm" :rules="stationRules" label-width="80px">
    <el-form-item label="电站名称" prop="stationName">
      <el-input v-model="stationForm.stationName" placeholder="请输入电站名称"></el-input>
    </el-form-item>
    <el-form-item label="所属业主" prop="customerName">
      <el-autocomplete
        v-model="stationForm.customerName"
        placeholder="请输入所属业主"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearchAsync"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item label="所在地区" prop="province">
      <el-cascader
        v-model="stationForm.province"
        placeholder="请选择"
        :options="provinces"
        @active-item-change="handleItemChange"
        :change-on-select="false"
        :props="props"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="powerstationAddress">
      <el-autocomplete
        v-model="stationForm.powerstationAddress"
        placeholder="请输入详细地址"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        @select="detaiChange"
      >
        <template slot-scope="{ item }">
          <div class="addressDetaiItem">
            <div class="addr" :key="item.uid">{{ item.value }}</div>
            <div class="addr" :key="item.uid">{{ item.address }}</div>
            <i class="el-icon-location-outline"></i>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="并网日期" prop="combineDate">
      <el-date-picker v-model="stationForm.combineDate" placeholder="请选择日期"></el-date-picker>
    </el-form-item>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="电站类型" prop="stationType">
          <el-select v-model="stationForm.stationType" placeholder="请选择">
            <el-option
              v-for="(item,index) in stationTypeMap"
              :key="index"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="并网类型" prop="combineType">
          <el-select v-model="stationForm.combineType" placeholder="请选择">
            <el-option
              v-for="(item,index) in gridTypeMap"
              :key="index"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="组件容量" prop="installedCapacity">
      <el-input v-model="stationForm.installedCapacity" placeholder="请输入">
        <template slot="append">kWp</template>
      </el-input>
    </el-form-item>
    <el-form-item label="度电收益" prop="profits">
      <el-input v-model="stationForm.profits" placeholder="请输入">
        <template slot="append">元/kWh</template>
      </el-input>
    </el-form-item>
    <div id="l-map"></div>
  </el-form>
</template>
<script>
import { stationTypeMap, gridTypeMap } from "../dataMap.js";

export default {
  data() {
    const that = this;
    function validateName(rule, value, callback) {
      if (value.length > 20) {
        callback("电站名称不能超过20字符");
      }
      callback();
    }
    function validateCapacity(rule, value, callback) {
      if (
        !/^0\.\d{1,3}$|^[1-9]\d{0,}(\.\d{1,3})?$/.test(parseFloat(value)) ||
        value <= 0
      ) {
        callback("需输入正数,小数位不超过三位");
      }
      callback();
    }
    function validateProfits(rule, value, callback) {
      if (
        !/^0\.\d{1,2}$|^[1-9]\d{0,}(\.\d{1,2})?$/.test(parseFloat(value)) ||
        value <= 0
      ) {
        callback("需输入正数,小数位不超过两位");
      }
      callback();
    }
    function validateCustomerName(rule, value, callback) {
      if (!that.organizationList.length && !that.submitFlag) {
        callback("无匹配的业主名称，提交后系统将自动创建该业主");
      }
      callback();
    }
    var stationForm = {};

    if (this.detail) {
      const { provinceCode, cityCode, areaCode } = this.detail;
      stationForm = this.detail;
      this.loadProvinces(this.loadCitys);
      stationForm.province = [provinceCode, cityCode, areaCode];
    } else {
      stationForm = {
        province: [],
        stationType: 1,
        combineType: 0,
        profits: 0.8,
        powerstationAddress: ""
      };
    }
    return {
      stationTypeMap,
      gridTypeMap,
      Bmap: null,
      location: {},
      locationDetails: [],
      stationForm,
      provinces: [],
      cities: [],
      areas: [],
      organizationList: [],
      submitFlag: false,
      props: {
        value: "provinceId",
        label: "province"
      },
      stationRules: {
        stationName: [
          { required: true, message: "请输入电站名称", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        province: [
          { required: true, message: "请选择所在地区", trigger: "blur" }
        ],
        powerstationAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        stationType: [
          { required: true, message: "请选择电站类型", trigger: "blur" }
        ],
        combineType: [
          { required: true, message: "请选择并网类型", trigger: "blur" }
        ],
        installedCapacity: [
          { required: true, message: "请输入组件容量", trigger: "blur" },
          { validator: validateCapacity, trigger: "blur" }
        ],
        profits: [
          { required: true, message: "请输入度电收益", trigger: "blur" },
          { validator: validateProfits, trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "请输入所属业主", trigger: "blur" },
          { validator: validateCustomerName, trigger: "blur" }
        ],
        combineDate: [
          { required: true, message: "请选择并网日期", trigger: "blur" }
        ]
      }
    };
  },
  props: ["detail", "powerStationId"],
  created() {
    if (!this.detail) {
      this.loadProvinces();
    }
  },
  mounted() {
    this.getLocation(this.initMap);
  },
  watch: {
    detail(newVal) {
      const { provinceCode, cityCode, areaCode } = newVal;
      let stationForm = newVal;
      this.loadProvinces(this.loadCitys);
      stationForm.province = [provinceCode, cityCode, areaCode];
      this.stationForm = stationForm;
    }
  },
  // beforeUpdate(){
  //    this.$nextTick(()=>{
  //     const {provinceCode,cityCode,areaCode} = this.detail
  //     let stationForm = this.detail
  //     this.loadProvinces(this.loadCitys)
  //     stationForm.province = [provinceCode,cityCode,areaCode]
  //     this.stationForm = stationForm
  //   })
  // },
  methods: {
    initMap() {
      var map = new BMap.Map("l-map");
      const { lng, lat } = this.location;
      map.centerAndZoom(new BMap.Point(lng, lat), 11);
      this.Bmap = map;
    },
    getLocation(cb) {
      const that = this;
      var geolocation = new BMap.Geolocation();
      // var local = new BMap.LocalSearch(this.Bmap);
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // marker = new BMap.Marker(r.point);
            // map.addOverlay(marker);//添加标注
            // marker.enableDragging(); //设置标注可拖拽(默认为不可拖拽)
            // map.panTo(r.point);
            // console.log('您的位置：'+r.point.lng+','+r.point.lat);
            console.log(111, r);
            that.location = {
              lng: r.point.lng,
              lat: r.point.lat
            };
            cb && cb();
            // 初始化地图,设置中心点坐标，
            // point = new BMap.Point(r.point.lng,r.point.lat); // 创建点坐标
            // map.centerAndZoom(point, 15);
            // map.enableScrollWheelZoom();
          } else {
            console.log(this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    loadProvinces(cb) {
      this.$http({
        url: this.$http.adornUrl("stationhandover/createProject/getProvinces"),
        method: "post",
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data.code == 0) {
          data.data.forEach(item => {
            item.children = [];
          });
          this.provinces = Array.isArray(data.data) ? data.data : [];
          if (this.detail && this.detail.provinceCode) {
            cb && cb(this.detail.provinceCode, this.loadAreas);
          }
        }
      });
    },
    handleItemChange(val) {
      if (Array.isArray(val)) {
        if (val.length == 1) {
          this.loadCitys(val[0]);
        } else {
          console.log(val);
          this.loadAreas(val[0], val[1]);
        }
      }
    },
    loadCitys(id, cb) {
      this.$http({
        url: this.$http.adornUrl(
          `stationhandover/createProject/getCities/${id}`
        ),
        method: "post",
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data.code == 0) {
          const currentIndex = this.provinces.findIndex(
            item => item.provinceId == id
          );
          if (Array.isArray(data.data)) {
            data.data.forEach(item => {
              (item.provinceId = item.cityId), (item.province = item.city);
              item.children = [];
            });
            if (currentIndex >= 0) {
              this.provinces[currentIndex].children = Array.isArray(data.data)
                ? data.data
                : [];
            }
            this.cities = Array.isArray(data.data) ? data.data : [];
            if (this.detail && this.detail.cityCode) {
              cb && cb(this.detail.provinceCode, this.detail.cityCode);
            }
          }
        }
      });
    },
    loadAreas(id1, id2) {
      this.$http({
        url: this.$http.adornUrl(
          `stationhandover/createProject/getAreas/${id2}`
        ),
        method: "post",
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data.code == 0) {
          const currentIndex1 = this.provinces.findIndex(
            item => item.provinceId == id1
          );
          if (Array.isArray(data.data)) {
            data.data.forEach(item => {
              item.provinceId = item.areaId;
              item.province = item.area;
            });
            if (
              currentIndex1 >= 0 &&
              Array.isArray(this.provinces[currentIndex1].children)
            ) {
              const currentIndex2 = this.provinces[
                currentIndex1
              ].children.findIndex(item => item.cityId == id2);
              if (currentIndex2 >= 0) {
                this.provinces[currentIndex1].children[
                  currentIndex2
                ].children = Array.isArray(data.data) ? data.data : [];
              }
            }
            this.areas = Array.isArray(data.data) ? data.data : [];
          }
        }
      });
    },
    querySearchAsync(customerName, cb) {
      this.$http({
        url: this.$http.adornUrl("/stationhandover/customerList"),
        method: "post",
        data: this.$http.adornData({
          customerName
        })
      }).then(({ data }) => {
        if (data.code == 0) {
          if (Array.isArray(data.organizationList)) {
            data.organizationList.forEach(item => {
              item.value = item.organizationName;
            });
            this.organizationList = Array.isArray(data.organizationList)
              ? data.organizationList
              : [];
            cb(
              Array.isArray(data.organizationList) ? data.organizationList : []
            );
            if (!this.organizationList.length) {
              this.$refs.stationForm.validateField(["customerName"]);
            }
          }
        }
      });
    },
    querySearch(keyWord, cb) {
      const that = this;
      var local = new BMap.LocalSearch(this.Bmap, {
        onSearchComplete(results) {
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            var s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i++) {
              let placeHolder;
              if (results.getPoi(i).province && results.getPoi(i).city) {
                placeHolder = `${results.getPoi(i).province}${
                  results.getPoi(i).city
                }${results.getPoi(i).title}`;
              } else {
                if (results.getPoi(i).province) {
                  placeHolder = `${results.getPoi(i).province}${
                    results.getPoi(i).title
                  }`;
                }
                if (results.getPoi(i).city) {
                  placeHolder = `${results.getPoi(i).city}${
                    results.getPoi(i).title
                  }`;
                }
              }
              s.push({
                uid: results.getPoi(i).uid,
                address: results.getPoi(i).address,
                province: results.getPoi(i).province,
                city: results.getPoi(i).city,
                value: placeHolder
              });
            }
            that.locationDetails = s;
            cb(Array.isArray(s) ? s : []);
          }
        }
      });
      local.search(keyWord);
    },
    detaiChange(obj) {},
    getName(list, id, key, label) {
      return list.filter(item => item[key] == id)[0]
        ? list.filter(item => item[key] == id)[0][label]
        : "";
    },
    resetFields() {
      this.$refs.stationForm.resetFields();
    },
    addZero(data, prop, num) {
      let propStr = (data[prop] + "").split(".")[1];
      if (propStr) {
        const strLen = propStr ? propStr.length : 0;
        for (let i = 0; i < num - strLen; i++) {
          propStr += "0";
        }
      }else{
        propStr='';
        const strLen = propStr ? propStr.length : 0;
        for (let i = 0; i < num - strLen; i++) {
          propStr += "0";
        }
      }

      return `${(data[prop] + "").split(".")[0]}.${propStr}`;
    },
    submit() {
      this.submitFlag = true;
      this.$refs.stationForm.validate(result => {
        this.submitFlag = false;
        if (result) {
          const {
            provinces,
            cities,
            areas,
            stationForm: { province },
            detail,
            powerStationId
          } = this;
          if (detail) {
            var { provinceName, cityName, areaName } = this.detail;
            var params = {
              id: powerStationId,
              ...this.stationForm,
              provinceName,
              cityName,
              areaName,
              provinceCode: province[0],
              cityCode: province[1],
              areaCode: province[2],
              installedCapacity: this.addZero(
                this.stationForm,
                "installedCapacity",
                3
              ),
              profits: this.addZero(this.stationForm, "installedCapacity", 2)
            };
          } else {
            var provinceName = this.getName(
              provinces,
              province[0],
              "provinceId",
              "province"
            );
            var cityName = this.getName(cities, province[1], "cityId", "city");
            var areaName = this.getName(areas, province[2], "areaId", "area");
            var params = {
              ...this.stationForm,
              provinceName,
              cityName,
              areaName,
              provinceCode: province[0],
              cityCode: province[1],
              areaCode: province[2],
              installedCapacity: this.addZero(
                this.stationForm,
                "installedCapacity",
                3
              ),
              profits: this.addZero(this.stationForm, "installedCapacity", 2)
            };
          }
          this.$http({
            url: detail
              ? this.$http.adornUrl(
                  "stationhandover/createProject/updateStationBaseInfo"
                )
              : this.$http.adornUrl(
                  "stationhandover/createProject/saveStation"
                ),
            method: "post",
            data: this.$http.adornData(params)
          }).then(({ data }) => {
            if (data.code == 0) {
              this.resetFields();
              if (detail) {
                this.$message.success("编辑成功");
                this.$emit("loadBasicInfo", true);
              } else {
                this.$message.success("新增成功");
                this.$router.push(
                  `/stationHandOver-index/stationHandOver-details?powerStationId=${
                    data.result.stationId
                  }`
                );
                this.$emit("loadStationList", true);
              }
            } else {
              this.$message({
                type: "error",
                message: data.message
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style scope lang="scss">

.el-form-item .el-input__inner:focus + .el-input-group__append {
  border-color: #409eff;
}
.el-form-item.is-success .el-input-group__append {
  border-color: #67c23a !important;
}
.el-form-item.is-error .el-input-group__append {
  border-color: #f56c6c!important;
}
.el-date-editor.el-input {
  width: 100%;
}
.el-select {
  width: 100%;
}
.el-cascader {
  width: 100%;
}
.el-autocomplete {
  width: 100%;
}
.el-dialog__body {
  padding: 20px 40px;
}
.el-form-item__label {
  position: relative;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  /* float: right; */
  margin-right: 0;
  font-size: 22px;
  position: absolute;
  top: 50%;
  right: 3px;
  transform: translate(0, -50%);
  -moz-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
}
.addressDetaiItem {
  position: relative;
  padding: 5px 0 5px 30px;

  & > div {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(62, 62, 71, 1);
  }
  & > div:nth-child(2) {
    font-weight: 400;
    color: rgba(138, 139, 153, 1);
  }
  &:hover {
    background: rgba(245, 245, 250, 1);
  }
  i {
    position: absolute;
    left: 0;
    top: 50%;
    font-size: 20px;
    color: #c5c5d1;
    transform: translate(0, -50%);
    -moz-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
  }
}
</style>
