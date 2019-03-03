<template>
  <div style="width:100%;">
      <!--<div class="showAddTitle" style="padding-left: 5px;">
        &lt;!&ndash;<div style="width:30%;padding-left: 15px;"><span class="titleStyle">设备类型</span></div>&ndash;&gt;
        <div style="width:30%;padding-left: 15px;"><span class="titleStyle">设备品牌</span></div>
        <div style="width:30%;padding-left: 15px;"><span class="titleStyle">设备型号</span></div>
        <div style="width:30%;padding-left: 15px;"><span class="titleStyle">设备数量(个)</span></div>
        <div style="width:10%;padding-left: 15px;text-align: center"><span class="titleStyle">操作</span></div>
      </div>-->
    <div>
      <addComInfoTr :list="list" @openEdit="openEdit" @deleteItem="deleteItem"></addComInfoTr>
      <!--<addItem></addItem>-->
      <!--<addItem></addItem>-->
      <!--<div v-for="(item,index) in itemList">-->
        <!--<template>-->
          <!--<div id="addItem" style="width:100%;min-width: 900px;">-->
            <!--<div class="thisRow">-->
              <!--<div class="fivPart" style="padding-left:0px">-->
                <!--<div class="thisContent">-->
                  <!--<label><span>{{index+1}}</span><el-select  v-model="value" placeholder="设备类型" clearable style="width: 85%;margin-left:2%">-->
                    <!--<el-option-->
                      <!--v-for="item in options"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                    <!--</el-option></el-select>-->
                  <!--</label>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="fivPart">-->
                <!--<div class="thisContent">-->
                  <!--<label><el-input v-model="brand" placeholder="设备品牌" class="ItemInput"></el-input></label>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="fivPart">-->
                <!--<div class="thisContent">-->
                  <!--<label><el-input v-model="code" placeholder="设备型号" class="ItemInput"></el-input></label>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="fivPart">-->
                <!--<div class="thisContent">-->
                  <!--<label><el-input v-model="num" placeholder="设备数量(个)" class="ItemInput"></el-input></label>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="fivPart" style="width:10%;padding-left: 4%">-->
                <!--<div class="thisContent">-->
                  <!--<label><a class="equipOptionAction" v-on:click="toDelete(index,$event)">删除</a></label>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div style="clear: left;"></div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</div>-->
      <!--<div style="float:left; width: 100%; height: 44px; text-align: center; border: 1px #cccccc dashed; line-height: 44px; margin-top: 15px;margin-bottom: 20px">-->
        <!--<span><i class="el-icon-plus" style="margin-right: 1%;font-weight: 800"></i></span><a class="tip" v-on:click="greet">新增设备型号</a>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import addComInfoTr from "../Inventory/addComInfoTr"
  // Vue.component('c1', {
  //   props: ['item'],
  //   template: '#c1'
  // })
    export default {
      name: "addContactsInfo",
      data() {
        return {
          formInline: {
            user: '',
            region: '',
            brand:'',
            code:'',
            num:''
          },
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          value: '',
          rules: {
            name: [
              {required: true, message: '请输入活动名称', trigger: 'blur'},
              {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
            tip: [
              {required: true, message: '请选择活动资源', trigger: 'change'}
            ],
            remark: [
              {message: '请填写活动形式', trigger: 'blur'}
            ],
            telephone: [
              {required: true, message: '请填写活动形式', trigger: 'blur'}
            ],
            desc: [
              {message: '请填写活动形式', required: true, trigger: 'blur'}
            ]
          },
          itemList: ['<addItem/>'],
          counter: 1,
          flag:false
        };
      },
      props:['list'],
      methods: {
        openEdit(row){
          this.$emit('openEdit',row)
        },
        deleteItem(id){
          this.$emit('deleteItem',id)
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
        // },
        // created(res){
        //   res = res.body
        //   res.list.forEach((item, i) => {
        //     // sdfsafs[face-1]sad[face-2]
        //     // 将被替换为
        //     // sdfsafs<img src="face-1.jpg">sad<img src="face-2.jpg">
        //     // ，请自行根据需要修改
        //     item.Content = item.Content.replace(/\[face\-(\d+)\]/g, '<img src="face-$1.jpg">')
        //   })
        // },
        greet: function (event) {
          // `this` 在方法里指当前 Vue 实例
          this.counter++;
          this.itemList.push('<addItem/>');
          alert('Hello ' + this.counter + '!')
          // `event` 是原生 DOM 事件
          this.flag=true;
          this.formInline.brand='',
            this.formInline.code='',
            this.formInline.num=''
        },
        remove(item) {
          this.counter=1;
          var i = this.items.indexOf(item)
          this.items.splice(i, 1)
        },
        toDelete:function (index,event)
        {
            alert("待刪除的是："+(index+1));
            alert(this.itemList[index].toString());
             this.itemList.splice(index, 1);
        }
      }
      ,
      components: {
        addComInfoTr
        // },
        // props:{
        //     counter
        // }
      }
    }
</script>

<style scoped>
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
    width: 22.5%;
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
