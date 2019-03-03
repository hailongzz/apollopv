<template>
<div>
  <page-template>
    <h1 slot="hTitle">角色管理</h1>
    <div slot="elButton">
       <el-button class="largeBtn" type="primary" @click="addRole()">新建角色</el-button>
    </div>
    <template slot="content">
      <div class="roleControl-content">
        <div class="roleControl-content-tool">

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="筛选" >
              <el-select v-model="searchForm.status" @change="getDataList(1)" clearable style="width: 150px;">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="已启用" value="1"></el-option>
                <el-option label="已停用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input prefix-icon="el-icon-search" v-model.trim="searchForm.roleName" placeholder="请输入角色名称" maxLength="20" clearable @clear="getDataList(1)"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getDataList(1)">查询</el-button>
              <el-button  @click="resetSearchForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
        v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          :default-sort = "{prop: 'date', order: 'descending'}"
          >
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="描述">
            <!-- <template slot-scope="scope">
              <span class="roleControl-content__describe">{{scope.row.remark}}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="menuTxt"
            label="菜单权限">
             <template slot-scope="scope">
              <span class="roleControl-content__menutxt" v-html="scope.row.menuTxt || '无'"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <span class="roleControl-content__state">
                <span :class="{'state__success': scope.row.status===1, 'state__error': scope.row.status!==1}"><span :class="[{'state__mark-success':scope.row.status===1},{'state__mark-error':scope.row.status!==1}, 'state__mark']"></span>{{scope.row.status===1?'已启用':'已停用'}}</span>
                <span>{{scope.row.enableTime}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createInfo"
            label="创建信息">
            <template slot-scope="scope">
              <div class="roleControl-content__createInfo">
                <span>{{scope.row.createBy}}</span>
                <span>{{scope.row.createTime}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作">
            <template slot-scope="scope" >
              <div>
                <div class="customer_operate" v-if="scope.row.isInnerRole !== 1">
                  <span @click="allotMenu(scope.row.roleId)">分配菜单</span>
                  <el-dropdown>
                    <span class="customer_operate_more">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item><el-button type="text" @click="editRole(scope.row.roleId)">编辑</el-button></el-dropdown-item>
                      <el-dropdown-item><el-button type="text" @click="stopRole(scope.row.roleId, scope.row.status)" v-text="scope.row.status === 1?'停用':'启用'"></el-button></el-dropdown-item>
                      <el-dropdown-item><el-button type="text" @click="deleteRole(scope.row.roleId, scope.row.userCount)">删除</el-button></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="customer_operate customer_operate__inner" v-else>
                  <span>分配菜单</span>
                  <el-dropdown>
                    <span class="customer_operate_more">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length >0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50, 100, 500]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="totalCount">
        </el-pagination>
      </div>
    </template>
  </page-template>
  <!-- 分配菜单 -->
  <el-dialog
    class="allotMenu-style"
    title="授权"
    :visible.sync="allotStationDialogVisible"
    width="570px"
    :close-on-click-modal="false"
    :before-close="handleCloseAllotMenu">
    <div class="allotMenu-style__tree">
      <el-tree
        ref="tree"
        v-loading="allotTreeLoading"
        :data="data2"
        show-checkbox
        node-key="menuId"
        :default-expanded-keys="firstKeys"
        :props="defaultProps">
      </el-tree>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button class="largeBtn" @click="closeMenuDialog()">取消</el-button>
      <el-button class="largeBtn" type="primary" @click="saveMenu()" :loading="allotMenu_loading">确定</el-button>
    </span>
  </el-dialog>
  <!-- 新增编辑 -->
  <el-dialog
    :title="editDialog.title"
    :visible.sync="roleDialogVisible"
    width="570px"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input type="text" v-model="ruleForm.roleName" maxlength ="10" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" >
        <el-input type="textarea" v-model="ruleForm.remark" maxlength ="100"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="largeBtn" @click="closeRoleDialog()">取消</el-button>
      <el-button class="largeBtn" type="primary" @click="saveOrUpdate()" :loading="btn__save">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import pageTemplate from '@/components/pageTemplate'
  export default {
    data () {
      return {
        tableLoading: false,
        tableData: [],
        data2: [],
        firstKeys: [],
        currentMenuRoleId: null,
        defaultProps: {
          children: 'list',
          label: 'name'
        },
        ruleForm: {
          roleName: '',
          remark: ''
        },
        searchForm: {
          status: '',
          roleName: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          remark: [
            { required: false, message: '请输入备注', trigger: 'blur' }
          ]
        },
        editDialog: {
          title: '新建角色'
        },
        currentRoleObj: null,
        allotStationDialogVisible: false,
        roleDialogVisible: false,
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        btn__save: false,
        allotMenu_loading: false,
        allotTreeLoading: false
      }
    },
    components: {
      pageTemplate
    },
    created () {
      this.getDataList()
    },
    beforeRouteLeval (to, from ,next) {
      this.currentPage = 1
      this.pageSize = 10
      this.totalCount = 0
      this.currentRoleObj = null
      this.ruleForm = {
        roleName: '',
        remark: ''
      }
      next()
    },
    computed: {
      userObj: {
        get () {return this.$store.state.user.userObj},
      }
    },
    methods: {
      resetSearchForm () {
        this.searchForm  = {
          status: '',
          roleName: ''
        }
        this.getDataList('1')
      },
      getDataList (page) {
       if (page) {
         this.currentPage = 1
       }
        let _url = 'accessControl/role/list'
        let _obj = JSON.parse(JSON.stringify(this.searchForm))
        if (!_obj.status) {
          _obj.status = null
        }
        let _params = Object.assign(
          _obj,
          {
            page: page&&page.toString() || this.currentPage.toString(),
            limit: this.pageSize,
            organizationId: this.userObj.organizationId
          }
        )
        this.tableLoading = true
        this.$http({
          url: this.$http.adornUrl(_url),
          method: 'get',
          params: this.$http.adornParams(_params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page.list
            this.totalCount = data.page.totalCount
          } else {
            this.$message.error(data.message )
          }
          this.tableLoading = false
        }).catch(error => {
          if (error.response) {
            this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
          } else {
            this.$message.error('请检查网络')
          }
          this.tableLoading = false
        })
      },
      formatNavList (arr, _arr) {
        arr.forEach(item => {
          if (item.type / 1 !== 2) {
            if (item.list && item.list.length > 0) {
              let _list = JSON.parse(JSON.stringify(item.list))
              item.list = []
              _arr.push(item)
              this.formatNavList(_list, item.list)
            } else {
              _arr.push(item)
            }
            if (item.type  === 0) {
              this.firstKeys.push(item.menuId)
            }
          }
        })
      },
      allotMenu (roleId) {
        this.allotStationDialogVisible = true
        this.currentMenuRoleId = roleId
        this.firstKeys = []
        this.allotTreeLoading = true
        Promise.all([this.allotMenuList(), this.getOwnMenuList()]).then(values => {
          let _menuList
          let _ownMenuList
          if (values[0].status === 200 && values[0].data.code === 0) {
            let _data = values[0].data && values[0].data.menuList || []
            let _arr = []
            this.formatNavList(_data, _arr)
            this.data2 = _arr
          } else {
            this.$message.error('获取角色列表失败')
          }
          if (values[1].status === 200 && values[1].data.code === 0) {
            _ownMenuList = values[1].data && values[1].data.menuList || []
            this.$nextTick(() =>{
              this.$refs.tree.setCheckedKeys(_ownMenuList)
            })
          } else {
            this.$message.error('获取角色已有列表失败')
          }
          this.allotTreeLoading = false
        })
      },
      allotMenuList () {
        let _url = `accessControl/role/allMenus/${this.currentMenuRoleId}`
        return this.$http({
          url: this.$http.adornUrl(_url),
          method: 'get',
          data: this.$http.adornData()
        })
      },
      getOwnMenuList () {
        let _url = `accessControl/role/roleMenus/${this.currentMenuRoleId}`
        return this.$http({
          url: this.$http.adornUrl(_url),
          method: 'get',
          data: this.$http.adornData()
        })
      },
      saveMenu () {
        let _keys = [].concat(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
        let params = {
          roleId: this.currentMenuRoleId,
          menuIdList: _keys
        }
        this.allotMenu_loading = true
        this.$http({
          url: this.$http.adornUrl('accessControl/role/roleDistributeMenus'),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.closeMenuDialog()
            this.getDataList()
          } else {
            this.$message.error(data.message)
          }
          this.allotMenu_loading = false
        }).catch(error => {
          if (error.response) {
            this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
          } else {
            this.$message.error('请检查网络')
          }
          this.allotMenu_loading = false
      })
      },
      addRole () {
        this.editDialog.title = '新建角色'
        this.roleDialogVisible = true
      },
      editRole (roleId) {
        this.getRoleInfo(roleId)
        this.editDialog.title = '编辑角色'
        this.roleDialogVisible = true
      },
      stopRole (roleId, status) {
        let toState = !status / 1
        this.$confirm(`请确认是否${toState?'启用': '停用'}该角色`,`${toState?'启用': '停用'}角色`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {
            roleId,
            status: toState
          }
          this.$http({
            url: this.$http.adornUrl('accessControl/role/disable'),
            method: 'post',
            data: this.$http.adornData(_params)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success(toState?'启用成功':'停用成功')
              this.getDataList()
            } else {
              this.$message.error(data.message)
            }
          })
        })
      },
      saveOrUpdate () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.btn__save = true
            let _url = ''
            let _params = {
              roleName: this.ruleForm.roleName,
              remark: this.ruleForm.remark,
              organizationId: this.userObj && this.userObj.organizationId || ''
            }
            if (this.currentRoleObj && this.currentRoleObj.roleId) {
              _url = 'accessControl/role/update'
              _params.roleId = this.currentRoleObj.roleId
            } else {
              _url = 'accessControl/role/save'
            }
            this.$http({
              url: this.$http.adornUrl(_url),
              method: 'post',
              data: this.$http.adornData(_params)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.closeRoleDialog()
                this.$message.success(_params.roleId?'更新成功':'新增成功')
                this.getDataList ()
                if (_url === 'accessControl/role/save') {
                  let _id = data.roleId
                  setTimeout((data) => {
                    this.allotMenu(_id)
                  }, 1000)
                }
              } else {
                this.$message.error(data.message)
              }
              this.btn__save = false
            })
          } else {
            return false
          }
        })
      },
      getRoleInfo (roleId) {
        let _url = `accessControl/role/info/${roleId}`
        this.$http({
          url: this.$http.adornUrl(_url),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.currentRoleObj = data.role
            this.ruleForm.roleName = data.role.roleName
            this.ruleForm.remark = data.role.remark
          }
        })
      },
      //删除
      deleteRole(rowId, userCount) {
        var params = []
        params.push(rowId)
        if (userCount > 0) {
          this.$alert(`有${userCount}个用户属于当前角色，无法删除该角色。如果需要删除该角色，请先在权限管理中修改相关用户的角色`, '删除角色', {
            confirmButtonText: '我知道了'
          })
        } else {
          this.$confirm(`是否确认删除该角色？`, '删除角色', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/accessControl/role/delete'),
              method: 'post',
              data: this.$http.adornData(params,false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.getDataList()
              } else {
                this.$message.error(data.message)
              }
            });
          })
        }
      },
      handleClose(done) {
        this.closeRoleDialog()
        done();
      },
       handleCloseAllotMenu(done) {
        this.data2 = []
        this.firstKeys = []
        done();
      },
      closeRoleDialog () {
        this.currentRoleObj = null
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {
          roleName: '',
          remark: ''
        }
        this.roleDialogVisible = false
        this.btn__save = false
      },
      closeMenuDialog () {
        this.data2 = []
        this.firstKeys = []
        this.allotStationDialogVisible = false
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/scss/variables.scss';
.roleControl-content{
  padding: 10px;
  &-tool{
    // margin-bottom: 20px;
  }
  &__operate{
    span{
      color: $--color-101;
      cursor: pointer;
      &:not(.operate__stop)::after{
        content: '|';
        padding-left: 5px;
      }
    }
  }
  &__describe{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  &__menutxt{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    .title{
      font-weight: bold;
    }
  }
  &__state{
    display: flex;
    flex-direction: column;
    .state__success{
      color: $--color-201;
    }
    .state__error{
      color: $--color-203;
    }
    .state__mark{
      display: inline-block;
      height: 10px;
      width: 10px;
      margin-right: 5px;
      border-radius: 50%;
    }
    .state__mark-success{
      background: $--color-201;
    }
    .state__mark-error{
      background: $--color-203;
    }
    &>span:last-child{
      color: $--color-309;
    }
  }
  &__createInfo{
    display: flex;
    flex-direction: column;
    &>span:first-child{
      color: #000;
    }
    &>span:last-child{
      color: $--color-309;
    }
  }
}
.allotMenu-style{
  &__tree{
    width: 100%;
    height: 50vh;
    overflow-y:auto;
    .el-tree{
      background: #f5f5fa;
    }
  }
  .el-dialog__body{
    background: #f5f5fa;
    margin-left: 10px;
    margin-right: 10px;
    box-sizing: border-box;
  }
  .el-loading-mask{
    background: #f5f5fa;
  }
}

.customer_operate {
  color: $--color-101;
  span {
    cursor: pointer;
    &:not(.customer_operate_more)::after {
      content: "|";
      color: $--color-311;
      padding: 0 0 0 5px;
    }
  }
  .customer_operate_more {
    i {
      color: $--color-101;
      transform: rotate(90deg);
      padding-left: -23px;
    }
    li.el-dropdown-menu__item {
      color: $--color-101 !important;
    }
  }
  &__inner {
    span {
      color: $--color-310;
      i{
        color: $--color-310!important;
      }
    }
  }
}
</style>
