<template>
  <div style="width:100%;">
    <div class="showAddTitle" style="padding-left: 5px;">
      <div style="width:22.5%;padding-left: 15px;"><span class="titleStyle">设备类型</span></div>
      <div style="width:22.5%;padding-left: 15px;"><span class="titleStyle">设备品牌</span></div>
      <div style="width:22.5%;padding-left: 15px;"><span class="titleStyle">设备型号</span></div>
      <div style="width:22.5%;padding-left: 15px;"><span class="titleStyle">设备数量(个)</span></div>
      <div style="width:10%;padding-left: 15px;text-align: center"><span class="titleStyle">操作</span></div>
    </div>
    <div>
      <!--<addItem></addItem>-->
      <!--<addItem></addItem>-->
        <template>
          <el-form id="addItem" :model="addForm" :ref="`addForm${index}`" :rules="rules" style="width:100%;min-width: 900px;"  v-for="(item,index) in itemList" :key="index">
            <div class="thisRow">
              <span style="float:left;">{{index+1}}</span>
              <div class="fivPart" style="padding-left:0px">
                <div class="thisContent">
                  <el-form-item :prop="`deviceTypeId${index}`">
                   <el-select  v-model="addForm[`deviceTypeId${index}`]" placeholder="设备类型" filterable  clearable style="width: 85%;margin-left:2%">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.typeName"
                      :value="item.id">
                    </el-option></el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="fivPart">
                <div class="thisContent">
                  <el-form-item :prop="`deviceBrand${index}`">
                   <el-input v-model="addForm[`deviceBrand${index}`]" placeholder="设备品牌" class="ItemInput"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="fivPart">
                <div class="thisContent">
                  <el-form-item :prop="`deviceModel${index}`">
                   <el-input v-model="addForm[`deviceModel${index}`]" placeholder="设备型号" class="ItemInput"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="fivPart">
                <div class="thisContent">
                  <el-form-item :prop="`deviceNumber${index}`">
                   <el-input v-model="addForm[`deviceNumber${index}`]" placeholder="设备数量(个)" class="ItemInput"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="fivPart" style="width:10%;padding-left: 4%">
                <div class="thisContent">
                  <label v-if="!(itemList.length==1&&index==0)"><a class="equipOptionAction" v-on:click="toDelete(index,$event)">删除</a></label>
                </div>
              </div>
              <div style="clear: left;"></div>
            </div>
          </el-form>
        </template>
      </div>
      <div class="doclick" v-on:click="greet">
        <span><i class="el-icon-plus" style="margin-right: 1%;font-weight: 800"></i></span><label class="tip">新增设备型号</label>
      </div>
    </div>
</template>

<script>
  import addItem from "../Inventory/addItem"
  // Vue.component('c1', {
  //   props: ['item'],
  //   template: '#c1'
  // })
    export default {
      name: "addContactsInfo",
      data() {
        const {query:{powerStationId}} = this.$route
         var validatePass = (rule, value, callback) => {
          if (!(/^[1-9]\d*$/.test(value))) {
            callback(new Error('设备数量请输入正整数'));
          }
          callback();
        };
        return {
          addForm:{

          },
          powerStationId,
          value: '',
          rules: {
            deviceTypeId0: [
              {required: true, message: '请选择设备类型', trigger: 'blur'},
            ],
            deviceBrand0: [
              {required: true, message: '请输入设备品牌', trigger: 'blur'},
              {max: 10, message: '设备品牌最多十个字符', trigger: 'blur'}
            ],
            deviceModel0: [ {required: true, message: '请输入设备型号', trigger: 'blur'},
            {max: 20, message: '设备品牌最多二十个字符', trigger: 'blur'}
            ],
            deviceNumber0: [
              {required: true, message: '请输入设备数量', trigger: 'blur'},
               { validator: validatePass, trigger: 'blur' }
            ],
          },
          itemList: [
            {
              brand:'',
              code:'',
              num:''
            }
          ],
          counter: 1,
          flag:false
        };
      },
      props:["options"],
      created() {
      },
      methods: {
        shanchudangqiande(index){
          this.itemList1.splice(index, 1);
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        loadEquipList(){
          this.$emit("loadEquipList")
        },
        submit(){
          const {itemList,powerStationId} = this;
          const that = this;
          const requestArr = [];
          var requestFlag = true;
          if(Array.isArray(itemList)&&itemList.length>0){
            itemList.forEach((item,index)=>{
              that.$refs[`addForm${index}`][0].validate((result)=>{
                const {addForm} = that;
                const deviceTypeId = addForm[`deviceTypeId${index}`]
                const deviceBrand = addForm[`deviceBrand${index}`]
                const deviceModel = addForm[`deviceModel${index}`]
                const deviceNumber = addForm[`deviceNumber${index}`]
                requestArr[index] = {
                  powerStationId,deviceTypeId,deviceBrand,deviceModel,deviceNumber
                }
                if(!result){
                  requestFlag = false
                }
              })
            })
            if(requestFlag){
              this.$http({
                    url: this.$http.adornUrl('stationhandover/equipmentInventory/checkSave'),
                    method: 'post',
                    data: this.$http.adornData(
                      [...requestArr],false
                    )
              }).then(({data})=>{
                if(data.code==0){
                  this.$emit("loadEquipList",true)
                  itemList.forEach((item,index)=>{
                    that.$refs[`addForm${index}`][0].resetFields()
                  })
                }
              })
            }
          }
        },
        greet: function (event) {
          this.counter++;
          const {rules:{deviceTypeId0,deviceBrand0,deviceModel0,deviceNumber0},itemList:{length}} = this;
          this.$set(this.rules,`deviceTypeId${length}`,deviceTypeId0)
          this.$set(this.rules,`deviceBrand${length}`,deviceBrand0)
          this.$set(this.rules,`deviceModel${length}`,deviceModel0)
          this.$set(this.rules,`deviceNumber${length}`,deviceNumber0)

          this.itemList.push({
            brand:'',
            code:'',
            num:''
          });

          this.flag=true;
        },
        remove(item) {
          this.counter=1;
          var i = this.items.indexOf(item)
          this.items.splice(i, 1)
        },
        toDelete:function (index,event)
        {
          this.itemList.splice(index, 1);
        }
      }
      ,
      components: {
        addItem
        // },
        // props:{
        //     counter
        // }
      }
    }
</script>

<style scoped>
  .doclick{
    float:left; width: 100%; height: 44px; text-align: center; border: 1px #cccccc dashed; line-height: 44px; margin-top: 15px;margin-bottom: 20px;cursor: pointer;
  }
  .doclick:hover{
    cursor: pointer;background-color: #f9f9f9;
  }
  .equipOptionAction{
    width:27px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(41,152,253,1);
    line-height:20px;
    margin-left:5%;
  }
  .ItemInput{
    width: 100%;
    height:34px;
    background:rgba(255,255,255,1);
    border-radius:2px;
  }
  #addItem>div{
    float: left;
  }

  .thisRow{
    width: 100%;
    margin-top:15px;
    border-bottom: 1px solid rgba(231,231,231,1);
    padding-bottom: 10px;
  }
  .fivPart{
    float: left;
    width: 22.0%;
    padding-left:1%;
  }
  .thisContent{
    width: 90%;
    margin: 0 auto;
  }
.formTipStyle{
  width:251px;
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(164,165,179,1);
  line-height:20px;
}

</style>
<style>
  .tip{
    width:84px;
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Medium;
    font-weight:800;
    color:rgba(73,73,82,1);
    line-height:20px;
  }
  .titleStyle{
    width:20%;
    height:20px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(41,40,48,1);
    line-height:20px;
  }
  .showAddTitle{
    width:100%;
    height:30px;
    background:rgba(248,248,248,1);
    line-height: 30px;
  }
  .showAddTitle>div{
    float: left;
    width:20%;
  }
  .el-form-item__label{
    height:34px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:34px;
  }
  label{
    height:34px;
    font-size:14px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(138,139,153,1);
    line-height:34px;
  }
</style>
