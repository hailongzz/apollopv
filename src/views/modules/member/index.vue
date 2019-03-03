<template>
  <div class="powerStation">
    <page-template>
      <h1 slot="hTitle">成员管理</h1>
      <!--<el-tag slot="elTag">标签一</el-tag>-->
      <template slot="elButton">
        <el-button type="primary" @click="showCreateMember"><i class="el-icon-plus"></i>&nbsp;&nbsp;新建成员</el-button>
      </template>
      <template slot="content">
        <div class="member-content">
          <!-- 筛选 -->
          <el-form :inline="true" ref="searchForm"  class="powerStation-form-inline">
            <!--<el-form-item label="经销地区">-->
              <!--<el-select v-model="formInline.area" placeholder="经销地区">-->
                <!--<el-option label="全部地区" value="全部地区"></el-option>-->
                <!--<el-option label="区域一" value="shanghai"></el-option>-->
                <!--<el-option label="区域二" value="beijing"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="状态" prop="status">
              <el-select v-model="formInline.status" placeholder="状态" @change="getDataList('1')">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="已启用" value="1"></el-option>
                <el-option label="已停用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="请输入成员姓名、手机号等" class="search_input">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getDataList('1')">查询</el-button>
              <el-button  @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <template>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading"
              :default-sort = "{prop: 'status', order: 'descending'}"
              @sort-change="sortChange"
            >
              <el-table-column
                prop="name"
                label="成员名字"
                >
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                >
              </el-table-column>
              <el-table-column
                prop="roleNames"
                label="成员身份"
                >
                <template slot-scope="prop">
                  <div class="member__role">
                    <icon-svg name="member_manager" v-if="prop.row.roleNames.indexOf('管理员') > -1 " class="iconStyle"></icon-svg>
                    <icon-svg name="login_user" v-if="prop.row.roleNames.indexOf('普通') > -1 " class="iconStyle" ></icon-svg>
                    {{prop.row.roleNames}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                sortable="custom">
                <template slot-scope="prop">
                  <div class="member_status" :style="{'background-color':prop.row.status === 1? '#0ede77':'#f74c60'}"></div>
                  <span v-if="prop.row.status === 1" style="color:#0ede77">已启用</span>
                  <span v-else style="color:#f74c60">已停用</span>
                  <div>{{prop.row.updateTime}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createBy"
                label="创建信息"
                sortable>
                <template slot-scope="prop">
                  <div>{{prop.row.createby}}</div>
                  <div>{{prop.row.createTime}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="action"
                label="操作">
                <template slot-scope="scope">
                  <div class="member_operate">
                    <span @click="showCreateMember(scope.row)">修改</span>
                    <span v-if="scope.row.status === 1" @click="updateMemberStatus(scope.row)">停用</span>
                    <span v-else @click="updateMemberStatus(scope.row)">启用</span>
                    <span @click="deleteMember(scope.row.id)">删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <el-pagination
          v-if="totalCount > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="totalCount">
        </el-pagination>

      </template>
    </page-template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="saveForm">
        <el-form-item label="成员姓名" label-width="80px" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
          <!--<span id="usernameTip" ref="errorTip" v-show="usernameWrong"><i class="el-icon-warning"></i>{{usernameErrorMsg}}</span>-->
        </el-form-item>
        <el-form-item label="手机号码" label-width="80px" prop="mobile">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="成员身份" label-width="80px" prop="roleIdList">
          <el-radio-group v-model="form.roleIdList" class="member_radio">
            <el-radio :label="item.roleId" v-for="(item,index) in roleList" :key="index">{{item.roleName}}</el-radio>
          </el-radio-group>
          <div class="customer_role">普通成员可进行电站运营、客户管理</div>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="closeForm('saveForm')">取消</el-button>
        <el-button type="primary" @click="createOrUpdateMember" :loading="save_loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pageTemplate from '@/components/pageTemplate'
  // import circle1 from '@/components/charts/circle'
  import iconTemplate from '@/components/page/icon'
  import { isMobile } from "@/utils/validate"

  export default {
    data () {
      let checkMobile = (rule, value, cb) => {
        if (!isMobile(value)) {
          cb("手机格式有误");
        } else {
          cb();
        }
      }
      return {
        activeName: '全部',
        formInline: {
          status: "",
          keyword: ""
        },
        tableData: [],
        options2: [],
        form: {
          username: '',
          mobile: '',
          roleIdList: '3',
          userId: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1,
        dialogFormVisible: false,
        roleList: [],
        save_loading: false,
        searchForm: {
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          keyword: [
            { required: true, message: '请输入客户姓名、电话、电站名称等', trigger: 'blur' },
          ],
        },
        sortInfo: {
          column: "",
          order: "",
          prop: "status"
        },
        title: '',
        rules:{
          username: [{ required: true, message: '请输入成员姓名', trigger: 'blur' }],
          mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: checkMobile }
          ],
          roleIdList: [{ required: true, message: '请选择成员身份', trigger: 'change' }],
        },
        loading: false
        // usernameWrong: false
      }
    },
    computed: {
      userObj: {
        get () {return this.$store.state.user.userObj},
      }
    },
    created () {
      this.getDataList()

    },
    methods: {
      // 获取数据列表
      getDataList (pageIndex) {
        this.loading = true;
        console.log(this.userObj)
        this.pageIndex = pageIndex?parseInt(pageIndex):this.pageIndex
        var params = {
          page: pageIndex || this.pageIndex.toString(),
          limit: this.pageSize.toString(),
          organizationId: this.userObj.organizationId,

          status: this.formInline.status,
          keyword: this.formInline.keyword,
          sidx: this.sortInfo.prop,
          order: this.sortInfo.order === "ascending"?"asc":"desc",
          isOrganizationUser: '1'
        };
        this.$http({
          url: this.$http.adornUrl('sys/user/memberListPage'),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.tableData = data.page.list;
            this.totalCount = data.page.totalCount;
          } else {
            // this.dataList = []
            this.totalCount = 0
            this.$message.error(data.message)
          }
          this.loading = false
        });
      },
      leaderDetails (id) {
        this.$router.push({ name: '', query: { id: id } })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },

      handleClick () {
        //
      },
      formatter (row, column) {
        return row.address
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.pageIndex = val
        this.getDataList()
        console.log(`当前页: ${val}`)
      },
      // 选择城市区域时触发
      handleItemChange () {
        console.log(`111`)
      },
      //新建，编辑成员显示界面
      showCreateMember (row) {
        this.getRoleList ()

        this.$nextTick(()=>{
          // this.$refs['saveForm'].resetFields();
          if(row.id){
            console.log(row)
            this.title = '编辑成员'
            this.form.username = row.name
            this.form.mobile = row.mobile
            this.form.roleIdList = row.roleIds
            this.form.userId = row.id
          }else{
            this.title = '新建成员'
            this.form = {
              username: '',
              mobile: '',
              roleIdList: '',
              userId: ''
            }

          }
          /*if(this.userObj.roleList[0].roleId==='2' || this.userObj.roleList[0].roleId==='3'){
            this.form.roleIdList = '3'
          }else{
            this.form.roleIdList = '5'
          }*/
          // this.$refs['saveForm'].resetFields();
        })

        this.dialogFormVisible = true

      },
      //获取角色列表
      getRoleList () {
        // var params = {
        //   organizationId: this.userObj.organizationId,
        // }
        var roleType;
        if(this.userObj.roleList[0].roleId === '2'){
          roleType = 1
        }else if(this.userObj.roleList[0].roleId === '4'){
          roleType = 2
        }
        this.$http({
          url: this.$http.adornUrl(`accessControl/role/selectRoleListByType/`+roleType),
          method: 'get',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.roleList = data.data
            this.form.roleIdList = this.form.roleIdList ? this.form.roleIdList : this.roleList[1].roleId
          } else {
            this.$message.error(data.message)
          }
          this.dataListLoading = false
        });
      },
      //创建修改成员
      createOrUpdateMember () {
        this.save_loading = true
        var url = ''
        var params = {}
        var message
        if(this.form.userId === ''){
          url = 'sys/user/saveMember'
          params = {
            organizationId: this.userObj.organizationId,
            isOrganizationUser: "1",
            mobile: this.form.mobile,
            username: this.form.username,
            roleIdList: []
          }
          message = "新建成员成功"
        }else{
          url = 'sys/user/updateMember'
          params = {
            userId: this.form.userId,
            mobile: this.form.mobile,
            username: this.form.username,
            roleIdList: []
          }
          message = "修改成员成功"
        }
        params.roleIdList.push(this.form.roleIdList)
        console.log(params)
        this.$refs['saveForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(url),
                method: 'post',
                data: this.$http.adornData(params)
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: message,
                    type: 'success'
                  });
                  this.getDataList("1")

                } else {
                  this.$message.error(data.message)
                }
                this.$nextTick(() => {
                  this.$refs['saveForm'].resetFields();
                })
                this.dialogFormVisible = false

              });
            }
        });
        this.save_loading = false
      },
      //成员启停
      updateMemberStatus (row) {
        var params = {
          userId: row.id,
          status: row.status === 1 ? "0":"1",
        }
        var message = row.status === 1 ? "停用成员后，该成员账号不会被删除，但将无法登录系统，是否确认停用？"
          :"启动成员后，该成员将能够重新登录系统，是否确认启用？"

        this.$confirm(message, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/user/updateMemberStatus'),
            method: 'post',
            data: this.$http.adornData(params)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList('1')
            } else {
              this.$message.error(data.message)
            }
            this.dialogFormVisible = false
          });
        });

      },
      //成员删除
      deleteMember (id) {
        this.$confirm(`删除成员将导致该成员无法登录系统，是否确认继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var userId = {
            userId: id
          }
          this.$http({
            url: this.$http.adornUrl("sys/user/deleteMember"),
            method: "post",
            data: this.$http.adornData(userId)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getDataList('1');
            } else {
              this.$message.error(data.message);
            }
          });
        });
      },
      //编辑成员
      updateMember () {

      },
      //重置
      resetForm (formName) {
        this.formInline = {
          status: "",
          keyword: ""
        }
        this.$refs[formName].resetFields();
        this.getDataList("1")
      },
      //获取排序
      sortChange (sort) {
        this.sortInfo = sort
        console.log(sort)
      },
      closeForm (formName) {
        this.form = {}
        this.dialogFormVisible = false;
        // 点击取消 数据重置
        this.$refs[formName].resetFields();
      }
    },
    components: {
      pageTemplate,
      iconTemplate
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/variables.scss';
  .member-content{
    padding: 10px;
    box-sizing: border-box;
    .member__role{
      /*font-size: 20px;*/
      display: flex;
      flex-direction: row;
      align-items: center;
      .iconStyle{
        /*margin-top: 3px;*/
        font-size: 24px;
      }
    }
    .member_status{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 10px;
    }
    .member_operate {
      color: $--color-101;
      span {
        cursor: pointer;
        &:not(:last-child)::after{
          content: '|';
          color: $--color-311;
          padding: 0 0 0 5px;
        }
      }
    }

    }
  .search_input{
    width: 200px!important;
  }

  .customer_role{
    font-size: 12px;
    color: $--color-311;
  }
</style>
<style>
  .member_radio .is-checked .el-radio__label {
    color: #606266!important;
  }
</style>

