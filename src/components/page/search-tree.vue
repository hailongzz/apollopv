<template>
  <div class="search-tree-content">
    <el-dropdown
      trigger="click"
      placement="bottom-start">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-dropdown-menu slot="dropdown">
       <el-card shadow="always" class="search-tree-content__card">
          <el-input v-model="input" placeholder="Search" prefix-icon="el-icon-search"></el-input>
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            :props="defaultProps">
          </el-tree>
        </el-card>
      </el-dropdown-menu>
    </el-dropdown>
    
  </div>
</template>
<script>
export default {
  data () {
    return {
      input: '',
      value: [],
      options: [],
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
}
</script>
<style lang="scss">
.search-tree-content{
  &__card{
    z-index: 3000;
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
  }
}
</style>


