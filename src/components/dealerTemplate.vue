<template>
  <el-dropdown>
    <el-input v-model="selectDealer" placeholder="全部经销商">
      <i slot="suffix" class="el-icon-arrow-down el-icon--right" style="margin-top: 10px;"></i>
    </el-input>
    <el-dropdown-menu slot="dropdown" style="width: 200px; min-height: 100px">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="margin-top: 10px"
      >
      </el-input>
      <el-tree
        :data="dealers"
        show-checkbox
        node-key="id"
        :check-strictly="true"
        @check="getDealerInfos"
        :props="dealerprops"
        :filter-node-method="filterNode"
        ref="tree"
      >
      </el-tree>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
   export default {
      name: "dealerTemplate",
      data () {
          return {
            dealers: [],
            dealer: '',
            deleteRadio: '',
            dealerprops: {
              lable: 'label',
              children: 'children'
            },
            filterText: '',
            selectDealer: '',
            i: 0
          }
      },
      props: {
        parentId: String,
        reset: Boolean
      },
     watch: {
       filterText(val) {
         this.$refs.tree.filter(val);
       },
       reset (newValue, oldValue) {
         // console.log(newValue)
         if (newValue) {
           this.selectDealer = ''
         }
       }
     },
      created () {
        this.loadDealerNode(this.parentId)
        console.log(this.reset)
      },
      methods: {
        loadDealerNode (parentId) {
          this.$http({
            url: this.$http.adornUrl(`organization/getListByOrganizationId`),
            method: 'post',
            data: this.$http.adornData({organizationId: parentId})
          }).then(({data}) => {
            if(data && data.code === 0){

              /*var list = []
              list.push(data.data)
              var rst = new Array();
              for (var i = 0; i < list.length; i++) {
                list[i].label = list[i].name;
                rst.push(list[i]);
                if (list[i].children !== undefined || list[i].childern.length !== 0) {
                  this.getNodes(list[i].children,list[i])
                }
              }*/
              var list = data.data
              var rst = new Array();
              for (var i = 0; i < list.length; i++) {
                list[i].label = list[i].name;
                rst.push(list[i]);
              }
              this.dealers = rst
            }
            // console.log(rst)

            // return rst;
            // this.dealers.push(data.data)

          })
          // this.dialogDeleteVisible = true
        },
        getNodes(arr, parent){
          if (arr.length != 0) {
            parent.children = new Array();
            for (var i = 0; i < arr.length; i++) {
              arr[i].label = arr[i].name;
              parent.children.push(arr[i]);
              this.getNodes(arr[i].children, arr[i]);
            }
          }
        },
        getDealerInfos (data,checked, node) {

          // console.log(this.$refs.tree.getCheckedKeys());

          // this.$refs.tree.setCheckedNodes([]);
          // this.$refs.tree.setCheckedNodes([data]);

          var selectDealer = []
          console.log(this.$refs.tree.getCheckedNodes());
          var selectData = this.$refs.tree.getCheckedNodes()
          selectData.find(item => {
            selectDealer.push(item.label)
          })
          this.selectDealer = selectDealer.join()
          this.$emit('getSelectDealerData',selectData);

          /*var selectDealer = []
          console.log(this.$refs.tree.getCheckedNodes());
          var selectData = this.$refs.tree.getCheckedNodes()
          selectData.find(item => {
            selectDealer.push(item.label)
          })
          this.selectDealer = selectDealer.join()
          this.$emit('getSelectDealerData',selectData);*/
          // this.selectDealer = this.$refs.tree.getCheckedKeys()
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },

      }
    }
</script>

<style scoped>

</style>
