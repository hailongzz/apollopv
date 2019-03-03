<template>
  <div class="powerStation">
    <page-template>
      <h1 slot="hTitle">客户管理</h1>
      <!--<el-tag slot="elTag">标签一</el-tag>-->
      <template slot="elButton">
        <el-button type="primary" @click="showCreateCustomer" id="createBtn"><i class="el-icon-plus"></i>&nbsp;&nbsp;新建客户</el-button>
        <el-button @click="importFile">导入</el-button>
        <el-button @click="exportCustomer" :loading="loading">导出</el-button>
      </template>
      <el-tabs slot="elTabs" v-model="activeName" @tab-click="tabChange">
        <el-tab-pane  name="2">
          <span slot="label"> 全部（{{allAccessNum}}）</span>
        </el-tab-pane>
        <el-tab-pane  name="1">
          <span slot="label"><i class="el-icon-success" style="color:#0ede77"></i> 已接入（{{completeAccessNum}}）</span>
        </el-tab-pane>
        <el-tab-pane  name="0">
          <span slot="label"><i class="el-icon-remove" style="color:#bcbed1"></i> 未接入（{{noAccessNum}}）</span>
        </el-tab-pane>

      </el-tabs>

      <template slot="content">
        <div class="customer-content">
          <!-- 筛选 -->
          <el-form :inline="true"  class="powerStation-form-inline">

            <el-form-item label="筛选：">
              <el-select v-model="formInline.status" placeholder="全部状态" v-if="activeName === '2'" @change="getDataList('1')">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="已启用" value="1"></el-option>
                <el-option label="已停用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <!--<area-template @getAreaData="getAreaData" class="customer_area" :changeOnSelect="true" :reset="areaReset"></area-template>-->
              <dealer-or-own-area-template
                @getAreaData="getAreaData"
                class="customer_area"
                :changeOnSelect="true"
                :reset="areaReset"
                url="organization/getAreaByOrganizationId"
              ></dealer-or-own-area-template>

            </el-form-item>
            <el-form-item label="">
              <!--<dealer-template @getSelectDealerData="getSelectDealerData" :parentId="organizationId" :reset="dealerReset"></dealer-template>-->
              <el-select v-model="formInline.organizationIds" filterable placeholder="全部经销商" @change="getDataList('1')">
                <el-option label="全部经销商" value=""></el-option>
                <el-option
                  v-for="item in dealers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="formInline.keyword" placeholder="请输入客户姓名、手机号、邮箱等" class="search_input">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchCustomer">查询</el-button>
              <el-button  @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <template>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="dataListLoading"
              :default-sort = "{prop: 'date', order: 'descending'}"
              >
              <el-table-column
                prop="name"
                label="客户名字"
                width="180">
                <template slot-scope="prop">
                  <i class="el-icon-success" style="color:#0ede77" v-if="prop.row.access === 1"></i>
                  <i class="el-icon-remove" style="color:#bcbed1" v-if="prop.row.access === 0"></i>
                  {{prop.row.name}}
                </template>
              </el-table-column>
              <el-table-column
                prop="organizationName"
                label="所属经销商"
                width="180">
                <template slot-scope="prop">
                  <el-button type="text" size="small" @click="getDealerDetails(prop.row.organizationId)">{{prop.row.organizationName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                width="180"
                >
                <template slot-scope="prop">
                  <div>{{prop.row.mobile}}</div>
                  <div>{{prop.row.email}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="联系地址"
                >
                <template slot-scope="prop">
                  <div>{{prop.row.provinceName}}<span v-if="prop.row.cityName !== ''">/</span>{{prop.row.cityName}}<span v-if="prop.row.cityName !== ''&&prop.row.areaName !== ''">/</span>{{prop.row.areaName}}</div>
                  <el-tooltip class="item" effect="dark" :content="prop.row.address" placement="top-start">
                    <div>{{prop.row.address}}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="180">
                <template slot-scope="prop">
                  <div class="customer_status" :style="{'background-color':prop.row.status === 1? '#0ede77':'#f74c60'}"></div>
                  <span v-if="prop.row.status === 1" >已启用</span><!--style="color:#0ede77"-->
                  <span v-else >已停用</span><!--style="color:#f74c60"-->
                  <div>{{prop.row.updateTime}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createBy"
                label="创建信息"
                sortable>
                <template slot-scope="prop">
                  <div>{{prop.row.createBy}}</div>
                  <div>{{prop.row.createTime}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="action"
                label="操作">
                <template slot-scope="prop">
                  <div class="customer_operate">
                    <el-button type="text" @click="$router.push({name:'powerStation-indexadd',query: { id: prop.row.id, t: Date.now() }})">新建电站</el-button>
                    <el-dropdown>
											<span class="customer_operate_more">
												<i class="el-icon-more"></i>
											</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button type="text" @click="showCreateCustomer(prop.row)">编辑</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button type="text" v-if="prop.row.status === 1" @click="updateCustomerStatus(prop.row)">停用</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button type="text" v-if="prop.row.status === 0" @click="updateCustomerStatus(prop.row)">启用</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button type="text" @click="deleteCustomer(prop.row)">删除</el-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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
          :current-page.sync="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="totalCount">
        </el-pagination>

      </template>
    </page-template>
    <!--新建客户-->
    <el-dialog title="新建客户" :visible.sync="dialogFormVisible" width="40%" :modal-append-to-body="false" top="10px">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="客户姓名" label-width="100px" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属经销商" label-width="100px" prop="organizationId">
          <el-select v-model="form.organizationId" placeholder="请选择">
            <el-option
              v-for="item in organizationList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="mobile">
          <el-input v-model="form.mobile" auto-complete="off" id="mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" label-width="100px" class="contactarea">
          <!--<el-input v-model="form.name" auto-complete="off" style="position: relative;top: 36px; z-index: 1;"></el-input>-->
          <area-template @getAreaData="getAreaData2" class="customer_area" :changeOnSelect="true"  :selectedValue="selectedOptions" ref="area"></area-template>
          <span id="errorTip" ref="errorTip" v-show="accountWrong" class="form_error">{{errorMsg}}</span>
          <!--<input type="text" size="20" v-model="form.address"  style="width:150px;" />-->
        </el-form-item>
        <el-form-item label="" label-width="100px" style="margin-top: -30px">
          <div>
            <el-input v-model="address_detail" auto-complete="off" id="suggestId" class="map_search" placeholder="请搜索地址"></el-input>
            <el-button type="primary" class="map_search_btn" ref="map_search_btn" ><i class="el-icon-search" style="font-size: 20px"></i></el-button>
            <!--<input type="text" id="suggestId" size="20" v-model="address_detail"  style="width:150px;" />-->
            <div id="allmap" style="width: 100%;height: 300px"></div>
          </div>
          <div style="background-color: #f4f4f9">
            <div style="margin-left: 20px">
              经度：{{userlocation.lng}}  纬度：{{userlocation.lat}}
            </div>

            <el-form-item label="" prop="address">
              <el-input v-model="form.address" auto-complete="off" style="width: 80%;margin-left: 20px;padding-bottom: 15px;"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="form.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createOrUpdateCustomer">确定</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog title="导入" :visible.sync="dialogUpLoadFormVisible" width="30%">
      <el-form :model="uploadForm">
        <p style="margin-left: 15px;">说明：导入数据量上线为1000条，文件大小为2M。</p>
        <div style="padding:30px">
          <ul class="time-vertical">
            <li><b></b><span>1</span><p>下载导入模板，填写客户信息</p><a href="javascript:void(0);" @click="downModel()">客户模板下载
            </a></li>
            <li style="position: relative; border-left: 1px dashed;"></li>
            <li><b></b><span>2</span><p>上传填写的客户信息表</p></li>
          </ul>
        </div>
        <el-form-item label="" label-width="50px">
          <el-col :span="16">
            <el-input v-model="uploadForm.fileName" placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            <el-upload
              class="upload-demo"
              :data="uploadData"
              ref="upload"
              :action="url"
              :show-file-list= false
              :on-change="handleChange"
              :on-success="handleSuccess"
              :file-list="fileList"
              accept=".xlsx,.xls"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpLoadFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">确定</el-button>
      </div>
    </el-dialog>
    <!--经销商详情-->
    <el-dialog title="经销商信息" :visible.sync="dialogDealerFormVisible" width="30%">
      <el-form :model="dealerForm" label-width="100px">
        <el-form-item label="经销商名称" >
          <span>{{dealerForm.organizationName}}</span>
        </el-form-item>
        <el-form-item label="上级经销商">
          <span>{{dealerForm.parentOrganizationName}}</span>
        </el-form-item>
        <el-form-item label="经销商负责人">
          <span>{{dealerForm.chargerName}}</span>
        </el-form-item>
        <el-form-item label="负责人手机号">
          <span>{{dealerForm.mobile}}</span>
        </el-form-item>
        <el-form-item label="经销地区">
          <span>{{dealerForm.agentProvinceName}} {{dealerForm.agentCityName}} {{dealerForm.agentAreaName}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDealerFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pageTemplate from '@/components/pageTemplate'
  import circle1 from '@/components/charts/circle'
  import areaTemplate from '@/components/areaTemplate'
  import dealerTemplate from '@/components/dealerTemplate'
  import dealerOrOwnAreaTemplate from '@/components/dealerOrOwnAreaTemplate'
  import { isEmail,isMobile } from "@/utils/validate"
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
        aaavisible: false,
        activeName: '2',
        formInline: {
          status: '',
          areaCode: '',
          keyword: '',
          organizationIds: '',
        },
        tableData: [],
        props: {
          value: 'label',
          children: 'cities'
        },
        form: {
          name: '',
          mobile: '',

        },
        pageIndex: 1,
        pageSize: 10,
        currentPage: 1,
        totalCount: 1,
        dialogFormVisible: false,
        organizationList: [],
        dialogUpLoadFormVisible: false,
        // 导入文件
        uploadForm: {
          fileName: ""
        },
        fileList: [],
        url: "",
        dialogDealerFormVisible: false,
        dealerForm: {

        },
        areaData: {},
        allAccessNum: '',
        completeAccessNum: '',
        noAccessNum: '',
        selectDealer: [],
        organizationId: '',
        dealerReset: false,
        areaReset: false,
        map: '',
        address_detail: '',
        userlocation: {lng: "", lat: ""},
        contactAreaData: {},
        selectedOptions: [],
        dealers: [],
        uploadData: {},
        rules:{
          name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
          organizationId: [{ required: true, message: '请选择所属经销商', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: checkMobile }],
          email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
          address: [{ required: true, message: '请输入详细联系地址', trigger: 'blur' }],
        },
        accountWrong: false,
        errorMsg: "",
        loading: false,
        organizationIds: [],
        dataListLoading: false
      }
    },
    computed: {
      userObj: {
        get () {return this.$store.state.user.userObj},
      }
    },
    created () {

      this.getDealers ()
      this.organizationId = this.userObj.organizationId
    },
    methods: {
      // 获取数据列表
      getDataList(pageIndex) {
        // var dealerAry = []
        // this.selectDealer.find(item => {
        //   dealerAry.push(item.id)
        // })
        pageIndex? this.pageIndex = 1: void 0
        this.dataListLoading = true
        this.pageIndex = pageIndex?parseInt(pageIndex):this.pageIndex
        this.dataListLoading = true;
        if (this.formInline.organizationIds !== '') {
          this.organizationIds = []
          this.organizationIds.push(this.formInline.organizationIds)
        }else{
          this.organizationIds = []
        }
        var params = {
          page: pageIndex || this.pageIndex.toString(),
          limit: this.pageSize.toString(),
          organizationId: this.userObj.organizationId,
          sidx: 'createBy',
          order: 'desc',

          status: this.formInline.status,
          provinceCode: this.areaData.provinceCode !== undefined ? this.areaData.provinceCode : "",
          cityCode: this.areaData.cityCode !== undefined ? this.areaData.cityCode : "",
          areaCode: this.areaData.areaCode !== undefined ? this.areaData.areaCode : "",
          keyword: this.formInline.keyword,
          organizationIds: this.organizationIds,
          access: this.activeName === "2" ? '' : this.activeName
        };
        this.$http({
          url: this.$http.adornUrl('organization/getCustomerListPage'),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page.list;
            this.allAccessNum = data.data[0].total
            this.completeAccessNum = data.data[0].access
            this.noAccessNum = data.data[0].unAccess
            this.totalCount = data.page.totalCount;
          } else {
            // this.dataList = []
            this.totalCount = 0
            this.$message.error(data.message)
          }
          this.dataListLoading = false
        });
      },
      leaderDetails(id) {
        this.$router.push({name: '', query: {id: id}})
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`)
        this.pageIndex = val
        this.getDataList()
      },
      // 显示创建客户界面
      showCreateCustomer(row) {
        this.initMap()
        this.getBelongDealer()
        this.$nextTick(()=>{
          if(row.id !== undefined){
            this.form = {
              name: row.name,
              organizationId: row.organizationId,
              mobile: row.mobile,
              email: row.email,
              address: row.address,
              remark: row.remark,
              customerId: row.id
            }
            this.selectedOptions.push(row.provinceCode,row.cityCode,row.areaCode)
            this.contactAreaData.provinceCode = row.provinceCode
            this.contactAreaData.cityCode = row.cityCode
            this.contactAreaData.areaCode = row.areaCode
            this.contactAreaData.provinceName = row.provinceName
            this.contactAreaData.cityName = row.cityName
            this.contactAreaData.areaName = row.areaName
            this.address_detail = row.address
            this.userlocation = {lng: row.longitude, lat: row.latitude}
            var areaName = row.cityName !== undefined ? row.cityName.split("市")[0] : row.provinceName

            if(row.latitude === null || row.latitude === ''){
              this.initMap (areaName)
            }else{
              this.initMap (0)
            }
            // this.initMap(row.address)
          }else{
            this.form = {
              name: "",
              organizationId: "",
              mobile: "",
              email: "",
              address: "",
              remark: "",
              customerId: ""
            }
            this.selectedOptions = []
            this.address_detail = ""
            this.userlocation = {lng: "", lat: ""}
            this.accountWrong = false
            this.errorMsg = ""
          }
          this.$refs['form'].resetFields();
        })

        this.dialogFormVisible = true
        if(this.$refs.area){
          this.$refs.area.$el.children[0].children[0].children[0].style.borderColor = ''
        }

      },

      //获取所属经销商
      getBelongDealer () {
        this.$http({
          url: this.$http.adornUrl(`organization/getListByOrganizationId`),
          method: 'post',
          data: this.$http.adornData({organizationId: this.userObj.organizationId})
        }).then(({data}) => {
          if(data && data.code === 0){
            /*var list = data.data
            var rst = new Array();
            for (var i = 0; i < list.length; i++) {
              list[i].label = list[i].name;
              rst.push(list[i]);
            }*/
            this.organizationList = data.data
          }

        })
      },
      //导入
      importFile() {
        this.url = this.$http.adornUrl('organization/importCustomer')
        this.uploadData.token = this.$cookie.get('token')
        this.fileList = []
        this.uploadForm = {
          fileName: ""
        }
        this.dialogUpLoadFormVisible = true
      },
      // 同步文本框
      handleChange(file, fileList) {
        this.uploadForm.fileName = file.name;
        this.fileList = fileList[0];
      },

      // 上传成功
      handleSuccess(response, file, fileList) {
        console.log(response)

        if (response.code === 500) {
          this.$message.error(response.message)

        } else {
          this.$message({
            message: "上传成功",
            type: "success"
          });
          this.getDataList("1")
          this.dialogUpLoadFormVisible = false
        }
      },

      // 上传文件
      submitUpload() {
        if (this.fileList.length === 0) {
          this.$message.error("请选择文件");
        } else {
          this.$refs.upload.submit();
        }
      },
      // 下载模板
      downModel() {
        this.$http({
          url: this.$http.adornUrl(`organization/downloadCustomerTemplate`),
          method: "get",
          responseType: "blob"
        }).then(data => {
          if (data) {
            if ("msSaveBlob" in navigator) {
              // 对IE和Edge的兼容
              window.navigator.msSaveBlob(
                data.data,
                decodeURI(
                  data.headers["content-disposition"].split("filename=")[1]
                )
              );
            } else {
              let a = document.createElement("a");
              let url = window.URL.createObjectURL(data.data);
              // console.log(data.headers["content-disposition"]);
              let filename = decodeURI(
                data.headers["content-disposition"].split("filename=")[1]
              );
              a.href = url;
              if(navigator.userAgent.indexOf("Firefox") !== -1){
                var evt = document.createEvent("MouseEvents"); // 对firefox的兼容
                evt.initEvent("click", false, false); // 对firefox的兼容
                a.dispatchEvent(evt); // 对firefox的兼容
              }else{
                // a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
              }
            }
          }
        });
      },
      // 导出
      exportCustomer() {
        this.loading = true
        var params = {
          organizationId: this.userObj.organizationId,
        }
        this.$http({
          url: this.$http.adornUrl(`organization/exportCustomer`),
          data: this.$http.adornData(params),
          method: "post",
          responseType: "blob"
        }).then(data => {
          if (data) {
            if ("msSaveBlob" in navigator) {
              // 对IE和Edge的兼容
              window.navigator.msSaveBlob(
                data.data,
                decodeURI(
                  data.headers["content-disposition"].split("filename=")[1]
                )
              );
            } else {
              let a = document.createElement("a");
              let url = window.URL.createObjectURL(data.data);
              // console.log(data.headers["content-disposition"]);
              let filename = decodeURI(
                data.headers["content-disposition"].split("filename=")[1]
              );
              if(navigator.userAgent.indexOf("Firefox") !== -1){
                var evt = document.createEvent("MouseEvents"); // 对firefox的兼容
                evt.initEvent("click", false, false); // 对firefox的兼容
                a.dispatchEvent(evt); // 对firefox的兼容
              }else{
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
              }

            }
          }
          this.loading = false
        });
      },
      //停用启用
      updateCustomerStatus(row) {
        var params = {
          customerId: row.id,
          status: row.status === 1 ? '0' : '1'
        }
        var message = row.status === 1 ? "停用客户后，该成员账号不会被删除，但将无法登录系统，是否确认停用？"
          :"启动客户后，该客户将能够重新登录系统，是否确认启用？"

        this.$confirm(message, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('organization/updateCustomerStatus'),
            method: 'post',
            data: this.$http.adornData(params)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getDataList()
            } else {
            }
          });
        });

      },
      //删除
      deleteCustomer(row) {
        var params = {
          customerId: row.id,
        }
        this.$confirm(`系统将删除用户及其账号，并且同步删除所有的电站及电站下的设备，删除后相关数据不可恢复，是否确认继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('organization/deleteCustomer'),
            method: 'post',
            data: this.$http.adornData(params)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }

          });
        }).catch(() => {
        })
      },
      //重置
      resetForm(formName) {
        this.formInline = {
          status: '',
          areaCode: '',
          keyword: '',
          organizationIds:this.userObj.organizationId
        }
        this.dealerReset = true
        this.areaReset = true
        this.getDataList("1")
        // this.$refs[formName].resetFields();
      },
      //接收省市区信息
      getAreaData(val) {
        console.log(val)
        this.areaData = val
        this.areaReset = false
        this.getDataList("1")
      },
      getAreaData2(val) {
        console.log(val)
        this.contactAreaData = val
         var areaName = val.cityName !== undefined ? val.cityName.split("市")[0] : val.provinceName
        console.log(areaName)
        this.initMap (areaName)
      },
      getDealerDetails(id) {
        var params = {
          organizationId: id,
        }
        this.$http({
          url: this.$http.adornUrl('organization/getOrganizationById'),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dealerForm = data.data
            this.dialogDealerFormVisible = true
          } else {

          }
        });
      },
      getSelectDealerData(val) {
        this.selectDealer = val
      },
      //地图
      initMap (areaName) {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          var th = this
          var local = null
          // 创建Map实例
          var map = new BMap.Map("allmap");
          if(areaName === undefined){
            var geolocation = new BMap.Geolocation();
            var point = null
            geolocation.getCurrentPosition(function(r){
              if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                console.log('您的位置：'+r.point.lng+','+r.point.lat);
                // 初始化地图,设置中心点坐标，
                point = new BMap.Point(r.point.lng,r.point.lat); // 创建点坐标
                map.centerAndZoom(point, 15);
                map.enableScrollWheelZoom();
              }
              else {
                alert('failed'+th.getStatus());
              }
            },{enableHighAccuracy: true})
          }else if(areaName === 0){
            var point1 = new BMap.Point(this.userlocation.lng,this.userlocation.lat); // 创建点坐标
            map.centerAndZoom(point1, 15);
          }else{
            map.centerAndZoom(areaName, 15);
          }


          // map.centerAndZoom('苏州', 15);
          var ac = new BMap.Autocomplete(
            //建立一个自动完成的对象
            {
              "input": "suggestId"
              , "location": map
            })
          map.addEventListener("tilesloaded",function(){
            var suggestion = document.getElementsByClassName('tangram-suggestion-main')
            for(var i=0;i<suggestion.length;i++){
              suggestion[i].style.zIndex = '1'
            }
            suggestion[suggestion.length-1].style.zIndex = '9999';
          });
          var myValue
          ac.addEventListener("onconfirm", function (e) {//鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            th.address_detail = myValue
            th.form.address = th.address_detail
            console.log(myValue)
            setPlace();
          });
          function myFun() {
            th.userlocation = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(th.userlocation, 18);
            map.addOverlay(new BMap.Marker(th.userlocation));    //添加标注
            //经度
            console.log(th.userlocation.lng);
            //维度
            console.log(th.userlocation.lat);
          }
          function setPlace() {
            map.clearOverlays();    //清除地图上所有覆盖物

            local = new BMap.LocalSearch(map, { //智能搜索
              onSearchComplete: myFun
            });
            local.search(myValue);
          }
          var searchBtn = null
          if(this.$refs.map_search_btn){
           searchBtn = this.$refs.map_search_btn.$el
          }
          // var searchBtn = this.$refs.map_search_btn.$el
          searchBtn.addEventListener("click", function() {//点击搜索
            map.clearOverlays(); //清除地图上所有覆盖物
            local = new BMap.LocalSearch(map, { //智能搜索
              onSearchComplete: myFun
            });
            local.search(th.address_detail);
            th.form.address = th.address_detail
          });
        })
      },
      //新建修改
      createOrUpdateCustomer (row) {
        var url = ''
        var params =  {
          "customerId": this.form.customerId,
          "organizationId": this.form.organizationId,
          "name": this.form.name,
          "mobile": this.form.mobile,
          "email": this.form.email,
          "provinceCode": this.contactAreaData.provinceCode,
          "cityCode": this.contactAreaData.cityCode,
          "areaCode": this.contactAreaData.areaCode,
          "provinceName": this.contactAreaData.provinceName,
          "cityName": this.contactAreaData.cityName,
          "areaName": this.contactAreaData.areaName,
          "address": this.form.address,
          "remark": this.form.remark,
          "longitude": this.userlocation.lng?this.userlocation.lng.toString():'',
          "latitude": this.userlocation.lat?this.userlocation.lat.toString():''
        }
        var message = ''
        if(this.form.customerId === ''){
          url = 'organization/saveCustomer'
          message = '新建客户成功'
        }else{
          url = 'organization/updateCustomer'
          message = '修改客户成功'
        }
        debugger
        if (this.form.email!== ''&&!isEmail(this.form.email)) {
          this.$message.error("邮箱格式有误");
          return
        }
        if(this.contactAreaData.provinceCode === undefined){
          this.accountWrong = true
          this.errorMsg = "请输入联系地址"
          this.$refs.area.$el.children[0].children[0].children[0].style.borderColor = '#f56c6c'
          // console.log(this.$refs.area)
        }else{
          this.accountWrong = false
          this.errorMsg = ""
          this.$refs.area.$el.children[0].children[0].children[0].style.borderColor = ''
        }


        console.log(params)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(url),
              method: 'post',
              data: this.$http.adornData(params)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: message,
                  type: 'success'
                });
                this.getDataList("1")
                this.dialogFormVisible = false
              } else {
                // this.dataList = []
                this.totalCount = 0
                this.$message.error(data.message)
              }
              // this.dataListLoading = false
            });
          }
        });

      },
      tabChange () {
        this.resetForm()
        this.getDataList("1")
      },
      getDealers () {
        var data = {
          "organizationId": this.userObj.organizationId
        }
        this.$http({
          url: this.$http.adornUrl('organization/getListByOrganizationId'),
          method: 'post',
          data: this.$http.adornData(data)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dealers = data.data
            this.formInline.organizationIds = this.userObj.organizationId
            this.getDataList()
          } else {
            // this.dataList = []

          }
          // this.dataListLoading = false
        });
      },
      searchCustomer () {
        if(this.formInline.organizationIds !== ""){
          this.organizationIds.push(this.formInline.organizationIds)
        }
        this.getDataList("1")
      }
    },
    components: {
      pageTemplate,
      circle1,
      areaTemplate,
      dealerTemplate,
      dealerOrOwnAreaTemplate,
    }
  }
</script>
<style lang="scss">
  @import "../../../assets/scss/variables.scss";
  .customer-content{
    padding: 10px;
    box-sizing: border-box;
    .customer__role{
      /*font-size: 20px;*/
      display: flex;
      flex-direction: row;
      align-items: center;
      .iconStyle{
        /*margin-top: 3px;*/
        font-size: 24px;
      }
    }
    .customer_status{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 10px;
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
    }
  }

  /*纵向时间轴*/
  .time-vertical {
    list-style-type: none;
  // border-left: 1px dashed #707070;
    padding: 0px;
  }

  .time-vertical li {
    height: 30px;
    position: relative;
  }

  .time-vertical li a {
    display: inline-block;
    margin-left: 20px;
  // margin-top: 15px;
    text-decoration: underline;
    color: #0A6EFA;
    line-height: 30px;
  }
  .time-vertical li span {
    position: absolute;
    top: 8px;
    left: -5px;
  }
  .time-vertical li p {
    display: inline-block;
    margin: 0px 0px 0px 25px;
    padding: 0px;
    line-height: 30px;
  }
  .time-vertical li b:before {
    content: "";
    position: absolute;
  // top: 8px;
    left: -15px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background: #c4c6d6;
  }

    input::-webkit-input-placeholder{
      color:#000000;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color:#000000;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color:#000000;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color:#000000;
    }
  .map_search{
    position: relative;
    top: 45px;
    left: 15px;
    z-index: 1;
    width: 50%!important;
  }
  .map_search_btn{
    position: relative;
    top: 47px;
    left: 11px;
    z-index: 1;
    padding: 5px 10px !important;
  }
  .contactarea {
    label:before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .form_error{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
.search_input{
  width: 255px!important;
}
  .el-dialog__title{
    font-weight: bold;
  }
  .el-cascader .el-input input::-webkit-input-placeholder{color: #606266!important;}    /* 使用webkit内核的浏览器 */
  .el-cascader .el-input input:-moz-placeholder{color: #606266!important;}                  /* Firefox版本4-18 */
  .el-cascader .el-input input::-moz-placeholder{color: #606266!important;}                  /* Firefox版本19+ */
  .el-cascader .el-input input:-ms-input-placeholder{color: #606266!important;}
</style>

