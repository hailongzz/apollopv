<template>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%;"

    :header-cell-style="{
    'color': '#000000',
    'background': 'rgba(248,248,248,1)',
    'border': '0px',
}">
    <el-table-column  label=""

                      prop="index"
                      width="20" class="col1">
    </el-table-column>
    <el-table-column  label="设备品牌"

      prop="deviceBrand"
      width="180" class="col1">
    </el-table-column>
    <el-table-column  label="设备型号"
      prop="deviceModel"
      width="180" class="col2">
    </el-table-column>
    <el-table-column  label="设备数量(个)" headerst
    prop="deviceNumber">
  </el-table-column>
    <el-table-column
      label="操作"
      width="100" class="col3">
      <template slot-scope="scope">
        <a style="color:#409EFF;" @click="openEdit(scope.row)">修改</a>&nbsp;&nbsp;&nbsp;
        <a style="color:#409EFF;" @click="deleteItem(scope.row)">删除</a>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: "addComInfoTr",
    data() {
      return {
        tableData: [{
          index:'1',
          date: '阳光',
          name: 'A28ADF',
          address: '123'
        },{
          index:'2',
          date: '阳光',
          name: 'A28ADF',
          address: '123'
        },{
          index:'3',
          date: '阳光',
          name: 'A28ADF',
          address: '123'
        },{
          index:'4',
          date: '阳光',
          name: 'A28ADF',
          address: '123'
        }
        ]
      }
    },
    props:['list'],
    methods:{
      openEdit(row){
          this.$emit('openEdit',row)
        },
      deleteItem(id){
        this.$emit('deleteItem',id)
      },
    }
  }
</script>

<style>
.col .el-table__header-wrapper{
  height:0px;
  padding-left:1%;
}
.col1 el-table_1_column_1{
  padding-left:1%
}
.col2 el-table_1_column_2{
  padding-left:12%
}
.col3 el-table_1_column_3{
  padding-left:17%
}
</style>

