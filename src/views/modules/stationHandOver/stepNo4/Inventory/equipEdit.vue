<template>
  <div class="editForm">
    <el-form
      :inline="true"
      label-position="top"
      :rules="rules"
      :model="editItem"
      ref="editForm"
    >
      <el-form-item label="设备类型" prop="deviceTypeId">
        <el-select placeholder="请选择设备类型" v-model="deviceTypeId" style="display:block;">
          <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备品牌" prop="deviceBrand" class="col1">
        <el-input placeholder="请输入设备品牌" v-model="editItem.deviceBrand"/>
      </el-form-item>
      <el-form-item label="设备型号" prop="deviceModel" class="col2">
        <el-input placeholder="请输入设备型号" v-model="editItem.deviceModel"/>
      </el-form-item>
      <el-form-item label="设备数量(个)" prop="deviceNumber">
        <el-input placeholder="请输入设备数量" v-model="editItem.deviceNumber"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error("设备数量请输入正整数"));
      }
      callback();
    };
    return {
      rules: {
        deviceTypeId: [
          { required: true, message: "请选择设备类型", trigger: "blur" }
        ],
        deviceBrand: [
          { required: true, message: "请输入设备品牌", trigger: "blur" },
          { max: 10, message: "设备品牌最多十个字符", trigger: "blur" }
        ],
        deviceModel: [
          { required: true, message: "请输入设备型号", trigger: "blur" },
          { max: 20, message: "设备品牌最多二十个字符", trigger: "blur" }
        ],
        deviceNumber: [
          { required: true, message: "请输入设备数量", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      }
    };
  },
  props: ["editItem", "deviceTypeName", "deviceTypeId", "options"],
  methods: {
    submit() {
      const {
        query: { powerStationId }
      } = this.$route;
      this.$refs.editForm.validate(result => {
        if (result) {
          this.$http({
            url: this.$http.adornUrl(
              "stationhandover/equipmentInventory/checkUpdate"
            ),
            method: "post",
            data: this.$http.adornData({
              ...this.editItem,
              deviceNumber: this.editItem.deviceNumber + "",
              deviceTypeId: this.deviceTypeId
            })
          }).then(({ data }) => {
            if (data.code == 0) {
              this.$emit("loadEquipList", true);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .editForm{
    text-align:center;
    .el-form--inline{
      text-align:left;
      .el-form-item__label{
        background:rgba(248,248,248,1);
        width:100%;
      }
    }
    .el-form--inline .el-form-item{
      width:24%;
      margin-right:0;
    }
  }
</style>
