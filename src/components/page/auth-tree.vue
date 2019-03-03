<template >
<div class="auth-tree">
  <div class="auth-tree-tree">
    <div class="auth-tree-tree__search">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="请搜索电站名称"
        v-model="filterText">
      </el-input>
    </div>
    <div class="auth-tree-tree__search__tree">
      <el-tree
        v-loading="authTreeLoading"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="uniqueId"
        ref="tree"
        highlight-current
        @check = "getCheckData"
        :filter-node-method="filterNode"
        :props="defaultProps">
        <span slot-scope="{node, data}">
          <img v-if="node.data.authObjType !==2" src="/static/img/org.png"/>
          <span @click="abc (node, data)">{{node.label}}</span>
        </span>
      </el-tree>
    </div>
  </div>
  <div class="auth-tree-list">
    <div class="auth-tree-list__title">
      已选对象
    </div>
    <div class="auth-tree-list__list">
      <ul>
        <li v-for="item in checkedListLabel" :key="item.uniqueId">
          <span>
            <img v-if="item.authObjType !==2" src="/static/img/org.png"/>{{item.label}}</span>
          <i class="el-icon-close" @click="removeNote(item.uniqueId)"></i>
        </li>
      </ul>
    </div>
  </div>
</div> 
</template>
<script>
  export default {
    data () {
      return {
        defaultProps: {
          label: 'authObjName',
          children: 'subAuthObjectList'
        },
        checkedList: [], //右侧数据
        checkedListLabel: [],
        filterText: '',
        treeDataArray: []
      }
    },
    props: {
      treeData: {
        type: Array
      },
      defaultCheckedKeys: {
        type: Array,
        default: []
      },
      authTreeLoading: {
        trye: Boolean,
        default: true
      }
    },
    created () {
      this.treeDataArray = []
      this.formateTree2Array(this.treeData)
    },
    methods: {
      clearData () {
        this.checkedList = []
        this.checkedListLabel = []
        this.filterText = ''
        this.treeDataArray = []
        this.$refs.tree.setCheckedKeys([]);
      },
      commit () {
        this.$emit('submitData', this.checkedList)
      },
      removeNote (id) {
        this.setCheckedKeys(id)
      },
      // 根据key取消选择
      setCheckedKeys (key) {
        let _keys = this.$refs.tree.getCheckedKeys()
        let _node = this.$refs.tree.getNode(key)
        let removeId = []
        this.getAllKeys(_node, removeId)
        this.getAllParentkeys(_node, removeId)
        removeId.forEach(item => {
          let _index = _keys.indexOf(item)
          if (_index > -1) {
            _keys.splice(_index, 1)
          }
        })
        this.$refs.tree.setCheckedKeys(_keys)
        this.checkedList.splice(this.checkedList.indexOf(key), 1)
      },
      // 获取节点里所有子节点key
      getAllKeys (node, arr) {
        arr.push(node.key)// node.key
        if (node.childNodes && node.childNodes.length > 0) {
          node.childNodes.forEach(item => {
            this.getAllKeys(item, arr)
          })
        }
      },
      // 获取节点里所有父节点key
      getAllParentkeys(node, arr) {
        if (node.parent && node.parent.key) {
          arr.push(node.parent.key)
          this.getAllParentkeys(node.parent, arr)
        }
      },
      getCheckData (current, selected) {
        var _selected = Array.from(selected.checkedKeys)
        if ( _selected.indexOf(current.uniqueId) > -1) { // 选中
          if (current.subAuthObjectList) { // 有子节点
            if (this.checkedList.indexOf(current.uniqueId) < 0) {
              this.checkedList.push(current.uniqueId)
            }
            var _haveSubNote = []
            this.getSubNote(current.subAuthObjectList, _haveSubNote)
            if (_haveSubNote.length > 0) {
              _haveSubNote.forEach(item => {
                var _index = this.checkedList.indexOf(item)
                if (_index > -1) {
                  this.checkedList.splice(_index, 1)
                }
              })
            }
          } else {
            if (this.checkedList.indexOf(current.uniqueId) < 0) {
              this.checkedList.push(current.uniqueId)
            }
          }
        } else { // 反选
          var _childNoteIndex = this.checkedList.indexOf(current.uniqueId)
          if (_childNoteIndex > -1) {
            this.checkedList.splice(_childNoteIndex, 1)
          } else { 
            // 1. 父节点反选
            // 2. 子节点反选
            if (current.subAuthObjectList) { // 去除子节点
              var _subNote = []
              this.getSubNote(current.subAuthObjectList, _subNote)
              if (_subNote.length > 0) {
                _subNote.forEach(item => {
                  var _index = this.checkedList.indexOf(item)
                  if (_index > -1) {
                    this.checkedList.splice(_index, 1)
                  }
                })
              }
            }
            // 去除父节点
            var _parentIds = []
            var _parentIdValid = []
            if (current.uniqueId !== '#') {
              this.getParentNote(current, _parentIds)
              if (_parentIds.length > 0) {
                _parentIds.forEach(item => {
                  var _index = this.checkedList.indexOf(item)
                  if (_index > -1) {
                    this.checkedList.splice(_index, 1)
                    _parentIdValid = _parentIds.slice(0, _parentIds.indexOf(item) + 1 )
                  }
                })
                var _parentIdValidLengtrh = _parentIdValid.length
                // 1. 得到 父节点
                // 2. 获取每个父节点下的子节点
                // 3. 去除 父节点 和当前节点
                if (_parentIdValidLengtrh > 0) {
                  let _validNote = this.getSubNoteByParent(_parentIdValid)
                  _parentIdValid.forEach(item => {
                    let _index = _validNote.indexOf(item)
                    if (_index > -1) {
                      _validNote.splice(_index, 1)
                    }
                  })
                  _validNote.splice(_validNote.indexOf(current.uniqueId), 1)
                  this.checkedList = this.checkedList.concat(_validNote)
                }
              }
            }
          }
        }
      },
      // 获取当前节点所有子节点
      getSubNote (item, arr) {
        item.forEach((list) => {
          if (list.subAuthObjectList) {
            arr.push(list.uniqueId)
            this.getSubNote(list.subAuthObjectList, arr)
          } else {
            arr.push(list.uniqueId)
          }
        })
      },
      // 根据父节点 获取一级子节点
      getSubNoteByParent(arr) {
        let _arr = []
        this.treeDataArray.forEach(item => {
          arr.forEach(list => {
            if (item.parentId === list) {
              _arr.push(item.uniqueId)
            }
          })
        })
        return _arr
      },
      // 获取所有父节点
      getParentNote (currentNote, ids) {
        this.treeDataArray.forEach(item => {
          if (item.uniqueId === currentNote.parentId) {
            ids.push(item.uniqueId)
            if (item.uniqueId !== '#') {
              this.getParentNote(item, ids)
            }
          }
        })
      },
      // 获取所有兄弟节点
      getSiblingNote(currentNote, ids) {
        this.treeDataArray.forEach(item => {
          if (item.parentId === currentNote.parentId && item.uniqueId !== currentNote.uniqueId) {
            ids.push(item.uniqueId)
          }
        })
      },
      // 格式化数据tree -> []
      formateTree2Array (data) {
        data.forEach(item=> {
          this.treeDataArray.push(item)
          if (item.subAuthObjectList && Array.isArray(item.subAuthObjectList) && item.subAuthObjectList.length > 0) {
            this.formateTree2Array(item.subAuthObjectList)
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.authObjName.indexOf(value) !== -1;
      }
    },
    watch: {
      treeData(val) {
        this.treeDataArray = []
        this.formateTree2Array(this.treeData)
        // if (this.defaultCheckedKeys.length > 0) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
            // this.$set(this.checkedList, [].concat(this.defaultCheckedKeys))
            this.checkedList = [].concat(this.defaultCheckedKeys)
          })
        // }
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      defaultCheckedKeys (val) {
      },
      checkedList (arr) {
        this.checkedListLabel = []
        let _arr = []
        this.treeDataArray.forEach(item => {
          arr.forEach(unique => {
            if (unique === item.uniqueId) {
              _arr.push({label: item.authObjName, uniqueId: item.uniqueId, authObjType: item.authObjType})
            }
          })
        })
        this.checkedListLabel = [].concat(_arr)
      }
    }
  }
</script>
<style lang="scss">
.auth-tree{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  border: 1px solid #e3e4ed;
  box-sizing: border-box;
  &-tree{
    &__search{
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #e3e4ed;
      input{
        height: 38px!important;
        line-height: 38px!important;
        border: none!important;
      }
      &__tree{
        max-height: 20vw;
        overflow-y: auto;
      }
    }
    height: 100%;
    flex-basis: 60%;
    border-right: 1px solid #e3e4ed;
    box-sizing: border-box;
  }
  &-list{
    height: 100%;
    flex-basis: 40%;
    box-sizing: border-box;
    &__title{
      height: 38px;
      line-height: 38px;
      margin-left: 23px;
      font-size: 14px;
      color:#A2A5BD;
    }
    &__list{
      max-height: 20vw;
      overflow-y: auto;
      li{
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #F5F5FA;
        padding: 0 9px 0 0;
        box-sizing: border-box;
        span{
          color: #4B4F6B;
          font-size: 14px;
          padding-left: 23px;
          display: inline-block;
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        i{
          float: right;
          margin-top: 11px;
          margin-right: 5px;
          &:hover{
            font-weight: bold;
            transform: scale(1.2)
          }
        }
        img{
          margin-bottom: 3px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>

