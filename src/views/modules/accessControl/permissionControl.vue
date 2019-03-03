<template>
<div>
  <page-template>
    <h1 slot="hTitle">用户管理</h1>
    <div slot="elButton">
       <el-button class="largeBtn" type="primary" @click="addPermission()">新建用户</el-button>
    </div>
    <template slot="content">
      <div class="permissionControl-content">
        <div class="permissionControl-content-tool">

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="状态" >
              <el-select v-model.trim="searchForm.status" @change="getDataList(1)" clearable  style="width: 150px;">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="已启用" value="1"></el-option>
                <el-option label="已停用" value="0"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item >
                  <el-select v-model.trim="searchForm.roleId" @change="getDataList(1)" clearable style="width: 150px;">
                    <el-option label="全部角色" value=""></el-option>
                    <el-option v-for="(item, index) in roleSearchOptions" :key="index" :label="item.roleName" :value="item.roleId"></el-option>
                  </el-select>
            </el-form-item>
            <!-- <el-form-item label="" label-width="100px">
              <el-select v-model.trim="searchForm.roleId" >
                <el-option label="全部角色" value=""></el-option>
                <el-option v-for="(item, index) in roleIdList"
                  :label="item.roleName"
                  :value="item.roleId"
                  :key="index" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="100px">
              <el-select v-model.trim="searchForm.orgId" >
                <el-option label="全部组织" value=""></el-option>
                <el-option v-for="(item, index) in orgIdList"
                  :label="item.name"
                  :value="item.id"
                  :key="index" ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item >
              <el-input v-model.trim="searchForm.keyword" style="width: 250px;"
              prefix-icon="el-icon-search"
                 placeholder="请输入用户姓名、手机号或邮箱等"
                 @clear = "getDataList('1')"
                 clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getDataList('1')">查询</el-button>
              <el-button @click="resetSearchForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="tableLoading"
          :default-sort = "{prop: 'date', order: 'descending'}"
          >
          <el-table-column
            prop="name"
            label="用户姓名">
          </el-table-column>
          <el-table-column
            prop="roleNames"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系方式">
            <template slot-scope="scope">
              <div>{{scope.row.mobile}}</div>
              <div>{{scope.row.email}}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <span class="permissionControl-content__state">
                <span :class="{'state__success': scope.row.status===1, 'state__error': scope.row.status!==1}"><span :class="[{'state__mark-success':scope.row.status===1},{'state__mark-error':scope.row.status!==1}, 'state__mark']"></span>{{scope.row.status===1?'已启用':'已停用'}}</span>
                <span style="color:#A2A5BD">{{scope.row.updateTime}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createInfo"
            label="创建信息">
            <template slot-scope="scope">
              <div class="permissionControl-content__createInfo">
                <span>{{scope.row.createby}}</span>
                <span>{{scope.row.createTime}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作">
            <template slot-scope="scope">
              <div class="permissionControl-content__operate" >
                  <span @click="allotMenu(scope.row.id)">分配电站</span>
                  <el-dropdown>
                    <span class="customer_operate_more">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item><el-button type="text" @click="editPermission(scope.row)">修改</el-button></el-dropdown-item>
                      <el-dropdown-item><el-button type="text" @click="delPermission(scope.row)">删除</el-button></el-dropdown-item>
                      <el-dropdown-item><el-button type="text" @click="stopPermission(scope.row.id, scope.row.status)">{{scope.row.status===0?'启用':'停用'}}</el-button></el-dropdown-item>

                      <!-- <span class="operate__stop" @click="stopPermission(scope.row.id, scope.row.status)">{{scope.row.status===0?'启用':'停用'}}</span> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length > 0"
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
  <!-- 分配电站 -->
  <el-dialog
    title="分配电站"
    width="1045px"
    top="40px"

    :visible.sync="allotStationDialogVisible"
    :close-on-click-modal="false"
    custom-class="powerStationClass"
    :lock-scroll='true'
    :before-close="handleCloseAllotPowerStation">
    <el-button style="width: 124px;" type="primary" @click="getAuthObj()" >选择授权对象</el-button>
      <template>
        <el-table
          v-loading="allotStationLoading"
          :data="allotStationData"
          ref="authTable"
          max-height="400"
          style="width: 100%;margin-top: 20px;">
          <span slot="empty">暂无电站，立即 <el-button type="text" @click="getAuthObj()">新增授权对象</el-button></span>

           <table-tree-column
              prop="authObjName"

              treeKey="uniqueId"
              levelKey="_level"
              childKey="subAuthObjectList"
              label="对象名称"
              >
            </table-tree-column>


          <el-table-column label="电站权限" header-align="center">
            <el-table-column

              align="center"
              label="编辑"
              width="60">
              <template slot-scope="scope">
                <gt-radio mark = "54" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"

              label="删除"
              width="60">
              <template slot-scope="scope">
                <gt-radio mark = "55" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="设备权限" header-align="center">
            <el-table-column
              width="60"
              align="center"

              label="接入/导入">
              <template slot-scope="scope">
                <gt-radio mark = "56" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
            <el-table-column
              width="60"
              align="center"

              label="编辑">
              <template slot-scope="scope">
                <gt-radio mark = "58" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
            <el-table-column
              width="60"
              align="center"

              label="删除">
              <template slot-scope="scope">
                <gt-radio mark = "59" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
            <el-table-column
              width="60"
              align="center"

              label="更换设备">
              <template slot-scope="scope">
                <gt-radio mark = "60" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes="scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
            <el-table-column
                v-if="!checkBadDealer"
              width="60"
              align="center"

              label="远程控制">
              <template slot-scope="scope">
                <gt-radio mark = "61" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
            <el-table-column
              width="60"
              align="center"

              label="逆变器固件升级">
              <template slot-scope="scope">
                <gt-radio mark = "62" :uniqueId="scope.row.uniqueId"
                  @state="getState"
                  :indexes = "scope.row.indexes"
                  :authObjType="scope.row.authObjType"
                  :selfdata = "authMark"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作">
          <el-table-column
              prop="address"
              width="105">
              <template slot-scope="scope">
                <el-button type="text" v-if ="scope.row.parentId==='#'" @click="removeNode(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            </el-table-column>
        </el-table>
      </template>
    <span slot="footer" class="dialog-footer">
      <el-button class="largeBtn" @click="cancelAuth()">取消</el-button>
      <el-button class="largeBtn" type="primary" @click="saveAuth()" :loading="auth__save">确定</el-button>
    </span>
  </el-dialog>
    <!-- 授权电站-->
  <el-dialog
    title="选择授权电站"
    :visible.sync="authDialogVisible"
    :close-on-click-modal="false"
    :before-close="handleCloseAuthDialog">
    <auth-tree ref="authTree"
      :treeData="powerTreeData"
      :authTreeLoading = "authTreeLoading"
      :defaultCheckedKeys="defaultCheckedKeys" @submitData="submitData"/>
    <span slot="footer" class="dialog-footer">
      <el-button class="largeBtn" @click="cancelAuthPower()">取消</el-button>
      <el-button class="largeBtn" type="primary" @click="saveAuthPower()" :loading="authPower__save">确定</el-button>
    </span>
  </el-dialog>
  <!-- 新增编辑 -->
  <el-dialog
    :title="editDialog.title"
    :visible.sync="permissionDialogVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input type="text" style="width: 200px" maxlength ="15" v-model="ruleForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input type="text" style="width: 200px" maxlength ="11" v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" style="width: 200px" v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="roleIdList">
        <el-select v-model="ruleForm.roleIdList" style="width: 300px" multiple placeholder="请选择">
          <el-option
            v-for="item in authOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="largeBtn" @click="closePermissionDialog()">取消</el-button>
      <el-button class="largeBtn" type="primary" @click="saveOrUpdate()" :loading="btn__save">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import pageTemplate from '@/components/pageTemplate'
  import authTree from '@/components/page/auth-tree'
  import gtRadio from '@/components/page/gt-radio'
  import TableTreeColumn from '@/components/table-tree-column'
  import validator from 'validator'
  var validator_mobile = (rule, value, callback) => {
    if (!validator.isMobilePhone(value, 'zh-CN')) {
      callback(new Error('手机号格式错误'));
    } else {
      callback()
    }
  }
  var validator_email = (rule, value, callback) => {
    if (!validator.isEmail(value, 'zh-CN')) {
      callback(new Error('邮箱格式错误'));
    } else {
      callback()
    }
  }
  export default {
    data () {
      return {
        tableLoading: false,
        options: [],
        authOptions: [],
        roleSearchOptions: [],
        tableData: [],
        allotStationData: [],
        allotStationLoading: false,
        authTreeLoading: true,
        authMark: {},// 保存 初始化电站radio 状态
        authId: ['54', '55', '56', '58', '59', '60', '61', '62'],
        authTreeMap: [], // 格式化数据 生成唯一id 完整树
        authOneArray: {},// uniqueId -> parentId -> children
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        ruleForm: {
          organizationId: '',
          username: '',
          mobile: '',
          roleIdList: [],
          isOrganizationUser: 0,
          email: ""
        },
        searchForm: {
          status: '',
          roleId: '',
          orgId: '',
          keyword: '',
          sidx: '',
          order: '',
          roleName: ''
        },
        roleIdList: null,
        orgIdList: null,
        rules: {
          username: [
            { required: true, message: '请输入用户名' }
          ],
          mobile: [
            { required: true, message: '请输入手机号' },
            {validator: validator_mobile}
          ],
          email: [
            { required: true, message: '请输入邮箱号' },
            {validator: validator_email}
          ],
          roleIdList: [
            { required: true, message: '请选择用户角色'}
          ]
        },
        editDialog: {
          title: '新建用户'
        },
        allotStationDialogVisible: false,
        permissionDialogVisible: false,
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        btn__save: false,
        auth__save: false,
        authPower__save: false,
        authDialogVisible: false,
        powerTreeData: [],
        currentUserId: '',
        defaultCheckedKeys: []
      }
    },
    components: {
      pageTemplate,
      authTree,
      gtRadio,
      TableTreeColumn
    },
    created () {
      this.getDataList()
      this.getAuthList()
      // this.getAllUserRoles()
      // this.getAllOrg()
      // this.getAllRole()
    },
    beforeRouteLeval (to, from ,next) {
      this.currentPage = 1
      this.pageSize = 10
      this.totalCount = 0
      this.ruleForm = {
        organizationId: '',
        username: '',
        mobile: '',
        email: '',
        roleIdList: [],
        isOrganizationUser: 0
      }
      next()
    },
    methods: {
      // 获取所有角色
      getAllUserRoles () {
        this.$http({
          url: this.$http.adornUrl('accessControl/role/list'),
          method: 'post',
          data: this.$http.adornData()
        })
      },
      // 获取所有组织
      getAllOrg () {
        this.$http({
          url: this.$http.adornUrl('organization/getListByOrganizationId'),
          method: 'post',
          data: this.$http.adornData({organizationId: this.userObj && this.userObj.organizationId || ''})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orgIdList = data.data
          } else {
            this.$message.error(data.message)
          }
        })
      },
      // 获取所有角色
      getAllRole () {
        this.$http({
          url: this.$http.adornUrl('accessControl/role/select'),
          method: 'get',
            params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.roleIdList = data.data
          } else {
            this.$message.error(data.message)
          }
        })
      },
      resetSearchForm () {
        this.searchForm = {
          status: '',
          roleId: '',
          orgId: '',
          keyword: '',
          sidx: '',
          order: '',
          roleName: ''
        }
        this.getDataList('1')
      },
      // 分配电站移除节点
      removeNode (node) {
        let _index = this.defaultCheckedKeys.indexOf(node.uniqueId)
        if (_index > -1) {
          this.defaultCheckedKeys.splice(_index, 1)

          this.submitData (this.defaultCheckedKeys, false)
        }
      },
      // 获取radio当前状态
      getState (val){
        let _indexes = val.indexes.split('_').map((item,index) => {
          return item / 1
        })
        if (_indexes.length > 1) {
          _indexes.shift()
        }
        let _node = this.authTreeMap
        for (var i = 0; i < _indexes.length; i++) {
          if (i === _indexes.length - 1) {
            _node = _node[_indexes[i]]
          } else {
            _node = _node[_indexes[i]]['item']['children']
          }
        }
        let _arrUniqueId = []
        this.getChildrenUniqueId([_node], _arrUniqueId)
        _arrUniqueId.forEach(item => {
          let _a = [].concat(this.authMark[item]['data'])
          let _index = this.authMark[item]['data'].indexOf(val.mark)
          let _indexHalf = this.authMark[item]['data'].indexOf(val.mark + '_half')
          if (val.checked) {
            _index > -1 ? void 0 : _a.push(val.mark)
            _indexHalf < 0 ? void 0 : _a.splice(_indexHalf, 1)
          } else {
            _index < 0 ? void 0 : _a.splice(_index, 1)
            _indexHalf < 0 ? void 0 : _a.splice(_indexHalf, 1)
          }
          this.$set(this.authMark[item], 'data', _a)
        })
        let _parentId = []
        this.getParentUniqueId(_node, _parentId)
        let firstNode = _parentId.indexOf('#')
        if (firstNode > -1) {
          _parentId.splice(firstNode, 1)
        }
        let _parentIdState = true
        _parentId.forEach(item => {
          let _a = [].concat(this.authMark[item]['data'])
          let _index = this.authMark[item]['data'].indexOf(val.mark)
          let _indexHalf = this.authMark[item]['data'].indexOf(val.mark + '_half')
          // _index > -1 ? void 0 : _a.push(val.mark)
          // this.$set(this.authMark[item], 'data', _a)
          if (_parentIdState) {
            let _numY = 0
            let _numF = 0
            let _half = 0
            this.authOneArray[item]['children'].forEach(list => {
              let _stateIndex = this.authMark[list.uniqueId]['data'].indexOf(val.mark)
              let _stateIndexHalf = this.authMark[list.uniqueId]['data'].indexOf(val.mark + '_half')

              if (_stateIndex < 0 && _stateIndexHalf < 0) {
                _numF++
              } else if (_stateIndex > -1 && _stateIndexHalf < 0) {
                _numY++
              } else {
                _half++
              }
            })
            if (_half > 0) {
              // _indexHalf > -1 ? void 0 : _a.push(val.mark + '_half')
              // _index < 0 ? void 0 : _a.splice(_index, 1)
              _parentIdState = false
            } else if (_numY > 0 && _numF === 0 ) {
              _indexHalf < 0 ? void 0 : _a.splice(_indexHalf, 1)
              _index > -1 ? void 0 : _a.push(val.mark)
              _parentIdState = true
            } else if (_numY === 0 && _numF > 0) {
              _indexHalf < 0 ? void 0 : _a.splice(_indexHalf, 1)
              _index < 0 ? void 0 : _a.splice(_index, 1)
              _parentIdState = true
            } else if (_numY === 0 && _numF === 0) {
              _index < 0 ? void 0 : _a.splice(_index, 1)
              _indexHalf > -1 ? void 0 : _a.push(val.mark + '_half')
            } else {
              _parentIdState = false
            }
            this.$set(this.authMark[item], 'data', _a)
          }
          if (!_parentIdState) {
            _index < 0 ? void 0 : _a.splice(_index, 1)
            _indexHalf > -1 ? void 0 : _a.push(val.mark + '_half')
            this.$set(this.authMark[item], 'data', _a)
          }
        })
      },
      // 获取当前节点下所有子节点uniqueId
      getChildrenUniqueId (node, arr) {
        node.forEach(item => {
          arr.push(item.item.uniqueId)
          if (item.item.children && item.item.children.length > 0) {
            this.getChildrenUniqueId(item.item.children, arr)
          }
        })
      },
      // 获取当前节点所有父节点uniqueId
      getParentUniqueId (node, arr) {
        let currentId = node.item.uniqueId
        let currentParentId = node.item.parentId
        arr.push(currentParentId)
        while(currentParentId !== '#') {
          currentParentId = this.authOneArray[currentParentId]['parentId']
          arr.push(currentParentId)
        }
      },
      // 保存授权对象
      saveAuthPower () {
        this.$refs.authTree.commit()
      },
      cancelAuthPower () {
        this.powerTreeData = []
        this.authDialogVisible = false
        this.getAuthObjDetails()
      },
      submitData (val, clear=true) {
        let _list = []
        if (val && val.length > 0) {
          val.forEach(item => {
            let _arr = item.split('_')
            _list.push({
              objId: _arr[0],
              authObjType: _arr[1]
            })
          })
        }
        let _params = {
          userId: this.currentUserId,
          list: _list
        }
        this.authPower__save = true
        this.$http({
          url: this.$http.adornUrl('accessControl/gtuserstationmenu/saveOrUpdateAuthObjs'),
          method: 'post',
          data: this.$http.adornData(_params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('保存成功')
            if (clear) {
              this.$refs.authTree.clearData()
            }
            this.cancelAuthPower()
            // 重新获取 已分配的电站接口
            this.getCheckedTree()
          } else {
            this.$message.error(data.message)
          }
          this.authPower__save = false
        }).catch(error => {
          this.authPower__save = false
          if (error.response) {
            this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
          } else {
            this.$message.error('请检查网络')
          }
        })
      },
      // 获取已授权对象树 -分配电站
      getCheckedTree () {
        this.allotStationLoading = true
        this.$http({
          url: this.$http.adornUrl(`accessControl/gtuserstationmenu/getUserStations/${this.currentUserId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.allotStationData = data.data
            this.authMark = {}
            this.authTreeMap = []
            this.authOneArray = {}
            this.formatAuth(this.allotStationData, 0, '#', this.authTreeMap, 0)
            this.allotStationData = treeDataTranslate(this.allotStationData, 'id')
            // console.log(this.authMark, 'authMark')
            // let temObj = {
            //   authObjType: 2,
            //   checked: true,
            //   indexes: '0_0_16',
            //   mark: '54',
            //   uniqueId: '123_0'
            // }
            this.firstFormatParentNode(this.authMark)
          } else {
            this.$message.error(data.message)
          }
          this.allotStationLoading = false
        }).catch(error => {
          if (error.response) {
            this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
          } else {
            this.$message.error('请检查网络')
          }
          this.allotStationLoading = false
        })
      },
      // 格式化已获取权限结构
      formatAuth (arr, number=0, parentId='#',authTreeMap, indexes=0) {
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach((item, index) => {
            item.indexes = indexes + '_' + index
            item['_level'] = number + 1
            item.parentId = parentId
            item.uniqueId = item.objId + '_' + item.authObjType
            authTreeMap[index] = {
              item: {
                'uniqueId': item.uniqueId,
                'children': [],
                'parentId': item.parentId
              }
            }
            this.authOneArray[item.uniqueId] = {
              'uniqueId': item.uniqueId,
              'parentId': item.parentId,
              'children': item.subAuthObjectList
            }
            if (!this.authMark[item.uniqueId]) {
              this.$set(this.authMark, item.uniqueId, {
                authObjType: item.authObjType,
                data: [],
                indexes: item.indexes
              })
            }
            if (item.menuIdList && item.menuIdList.length > 0) {
              let _b = this.authMark[item.uniqueId]['data']
              _b = [].concat(item.menuIdList)
              this.$set(this.authMark[item.uniqueId], 'data', _b)
            }
            if (item.subAuthObjectList){
              this.formatAuth(
                item.subAuthObjectList,
                item['_level'],
                item.uniqueId,
                authTreeMap[index]['item']['children'],
                indexes + '_' + index
              )
            }
          })
        }
      },
      // 初始化父节点
      firstFormatParentNode (authMark) {
        for (var item in authMark) {
          if (authMark[item].authObjType === 2) {
            // 54, 55, 56, 58, 59, 60, 61, 62 this.authId
            this.authId.forEach(id => {
              let _index = authMark[item].data.indexOf(id)
              let temObj = {
                authObjType: 2,
                checked: _index > -1,
                indexes: authMark[item].indexes,
                mark: id,
                uniqueId:  item
              }
              this.getState(temObj)
            })
          }
        }
      },
      // 获取已被授权的对象-选择授权对象
      getDefaultCheckedKeys () {
        return this.$http({
          url: this.$http.adornUrl(`accessControl/gtuserstationmenu/getAuthObjects/${this.currentUserId}`),
          method: 'get',
          params:this.$http.adornParams()
        })
      },
      getPowerTree () {
        this.authTreeLoading = true
        return this.$http({
          url: this.$http.adornUrl(`accessControl/gtuserstationmenu/getUserTree/${this.currentUserId}`),
          method: 'get',
          params: this.$http.adornParams()
        })
      },
      // 构造唯一id 和 parentId
      createIdAndParentId (data, parentId) {
          if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
              item.parentId = parentId || '#'
              item.uniqueId = item.objId + '_' + item.authObjType
              if (item.subAuthObjectList && item.subAuthObjectList.length > 0) {
                this.createIdAndParentId(item.subAuthObjectList, item.uniqueId)
              }
            })
          }
      },
      getAuthObj () {
        this.authDialogVisible = true
        this.getAuthObjDetails()
      },
      getAuthObjDetails () {
        Promise.all([this.getPowerTree(), this.getDefaultCheckedKeys()]).then(values => {
          if (values[0].status === 200 && values[0].data.code === 0) {
            this.powerTreeData = [].concat(values[0].data.data || [])
            this.createIdAndParentId(this.powerTreeData)
          } else {
            this.$message.error(values[1].data.message)
          }
          if (values[1].status === 200 && values[1].data.code === 0) {
            this.defaultCheckedKeys = []
            let _arr = values[1].data.data
            let _arrid = []
            _arr.forEach(item => {
              let _str = item.objId + '_' + item.authObjType
              if (typeof _str === 'string') {
                _arrid.push(_str)
              }
            })
            this.defaultCheckedKeys = [].concat(_arrid)
          } else {
            this.$message.error(values[1].data.message)
          }
          this.authTreeLoading = false
        })
      },
      getDataList (page) {
        page? this.currentPage = 1: void 0
        let _url = 'sys/user/authorityMemberListPage'
        let _params = Object.assign(
          this.searchForm,
          {
            page: page && page.toString() || this.currentPage.toString(),
            limit: this.pageSize.toString(),
            organizationId: this.userObj && this.userObj.organizationId || ''
          }
        )
        this.tableLoading = true
        this.$http({
          url: this.$http.adornUrl(_url),
          method: 'post',
          data: this.$http.adornData(_params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page.list
            this.totalCount = data.page.totalCount
          } else {
            this.$message.error(data.message)
            this.tableData = []
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
      allotMenu (id) {
        this.currentUserId = id
        this.allotStationDialogVisible = true
        this.powerTreeData = []
        this.defaultCheckedKeys = []
        this.getCheckedTree()
        this.getAuthObjDetails()
      },
      addPermission () {
        this.editDialog.title = '新建用户'
        this.getAuthList()
        this.permissionDialogVisible = true
      },
      editPermission (userInfo) {
        this.ruleForm.username = userInfo.name
        this.ruleForm.userId = userInfo.id
        this.ruleForm.mobile = userInfo.mobile
        this.ruleForm.email = userInfo.email
        this.ruleForm.roleIdList = userInfo.roleIds.split(',')
        this.getAuthList(userInfo.organizationId)
        this.editDialog.title = '编辑角色'
        this.permissionDialogVisible = true
      },
      delPermission (userInfo) {
        this.$confirm(`删除 ${userInfo.name} 用户后，该用户的账号及其所有的电站将被同步删除。该操作不可恢复，是否确认继续？`, '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/user/deleteMember'),
            method: 'post',
            data: this.$http.adornData({userId: userInfo.id})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success('删除成功')
              this.getDataList()
            } else {
              this.$message.error(data.message)
            }
          })
        })
      },
      stopPermission (permissionId, disable) {
        let toState = !disable / 1
        this.$confirm(`请确认是否${toState?'启用': '停用'}该用户`,`${toState?'启用': '停用'}用户`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {
            userId: permissionId,
            status: toState
          }
          this.$http({
            url: this.$http.adornUrl('sys/user/updateMemberStatus'),
            method: 'post',
            data: this.$http.adornData(_params)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success(toState?'启用成功':'停用成功')
              this.getDataList()
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
              mobile: this.ruleForm.mobile,
              username: this.ruleForm.username,
              roleIdList: this.ruleForm.roleIdList,
              email: this.ruleForm.email,
            }
            if (!this.ruleForm.userId) {
              _url = 'sys/user/saveMember'
              _params.isOrganizationUser = 0
              _params.organizationId = this.userObj && this.userObj.organizationId || ''
            } else {
              _url = 'sys/user/updateMember'
              _params.userId = this.ruleForm.userId
            }
            this.$http({
              url: this.$http.adornUrl(_url),
              method: 'post',
              data: this.$http.adornData(_params)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.closePermissionDialog()
                this.$message.success(_params.userId?'更新成功':'新增成功')
                this.getDataList ()
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
      // 获取权限列表
      getAuthList (org) {
        let params = {
          organizationId: org || this.userObj && this.userObj.organizationId || ''
        }
        this.$http({
          url: this.$http.adornUrl('sys/user/getRolesByOrganizationId'),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.authOptions = data.data
            if (!org) {
              this.roleSearchOptions = data.data
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },
      cancelAuth () {
        this.authMark = {}
        this.allotStationData = []
        this.allotStationDialogVisible = false
      },
      saveAuth () {
        let _list = []
        for(var key in this.authMark) {
          let _arr = this.authMark[key]['data']
          _list.push({
            objId: key.split('_')[0],
            authObjType: key.split('_')[1],
            menuIdList: _arr
          })
        }
        this.auth__save = true
        this.$http({
          url: this.$http.adornUrl('accessControl/gtuserstationmenu/saveOrUpdatMenus'),
          method: 'post',
          data: this.$http.adornData({list: _list, userId: this.currentUserId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.allotStationDialogVisible = false
          } else {
            this.$message.error(data.message)
          }
          this.auth__save = false
        }).catch(error => {
          this.auth__save = false
          if (error.response) {
            this.$message.error(`请求已发出，但服务器响应的状态码为${error.response.status}`)
          } else {
            this.$message.error('请检查网络')
          }
        })
      },
      handleClose(done) {
        this.closePermissionDialog()
        done();
      },
      handleCloseAllotPowerStation(done) {
        this.auth__save = false
        done();
      },
      handleCloseAuthDialog (done) {
        done()
      },
      closePermissionDialog () {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {
          organizationId: '',
          username: '',
          mobile: '',
          email: '',
          roleIdList: [],
          isOrganizationUser: 0
        }
        this.authOptions = []
        this.permissionDialogVisible = false
        this.btn__save = false
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getDataList()
      },
      checkBadDealer () {
        let _state = false
        this.userObj && this.userObj.roleList.forEach(item => {
          if (item.roleId === '4') {
            _state = true
          }
        })
        return _state
      }
    },
    computed: {
      userObj: {
        get () {return this.$store.state.user.userObj},
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/scss/variables.scss';
.permissionControl-content{
  padding: 10px;
  &-tool{
    // margin-bottom: 20px;
  }
  &__operate{
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
  }
  &__describe{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
.powerStationClass{
  padding-left: 31px;
  padding-right: 31px;
}
</style>
