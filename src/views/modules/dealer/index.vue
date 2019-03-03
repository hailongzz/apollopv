<template>
    <div class="powerStation">
      <page-template>
        <h1 slot="hTitle" >经销商管理</h1>
        <!--<el-tag slot="elTag">标签一</el-tag>-->
        <template slot="elButton">
          <el-button type="primary" @click="showCreateDealer()"><i class="el-icon-plus"></i>&nbsp;&nbsp;新建经销商</el-button>
        </template>

        <template slot="content">
          <div class="dealer-content">
            <!-- 筛选 -->
            <el-form :inline="true"  class="powerStation-form-inline">

              <el-form-item label="筛选：">
                <dealer-or-own-area-template
                  @getAreaData="getSearchAreaData"
                  class="customer_area"
                  :changeOnSelect="true"
                  :reset="areaReset"
                  url="organization/getAgentAreaByOrganizationId"
                ></dealer-or-own-area-template>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="formInline.status" placeholder="全部状态" @change="getDataList('1')">
                  <el-option label="全部状态" value=""></el-option>
                  <el-option label="已启用" value="1"></el-option>
                  <el-option label="已停用" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-input v-model="formInline.keyword" placeholder="请输入经销商名称、负责人、手机号等" class="search_input">
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
                :data="dataList"
                v-loading="dataListLoading"
                style="width: 100%;">
                <table-tree-column
                  prop="name"
                  header-align="left"
                  treeKey="id"
                  label="经销商名称"
                  v-if="showTable"
                >
                </table-tree-column>
                <el-table-column
                  prop="name"
                  header-align="left"
                  align="left"
                  label="经销商名称"
                  v-if="!showTable"
                >
                </el-table-column>
                <el-table-column
                  header-align="left"
                  align="left"
                  label="经销商级别"
                  v-if="roleShow"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.level === 1">一级经销商</span>
                    <span v-if="scope.row.level === 2">二级经销商</span>
                    <span v-if="scope.row.level === 3">三级经销商</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="chargerName"
                  header-align="left"
                  align="left"
                  label="经销商负责人">
                  <template slot-scope="scope">
                    <div>{{scope.row.chargerName}}</div>
                    <div>{{scope.row.mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="agentProvinceName"
                  header-align="left"
                  align="left"
                  label="经销地区">
                  <template slot-scope="scope">
                    {{scope.row.agentProvinceName}}<span v-if="scope.row.agentCityName !== null">/</span>{{scope.row.agentCityName}}<span v-if="scope.row.agentCityName !== null&&scope.row.agentAreaName !== null">/</span>{{scope.row.agentAreaName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="agentProvinceName"
                  header-align="left"
                  align="left"
                  label="联系地址">
                  <template slot-scope="scope">
                    <div>{{scope.row.provinceName}}<span v-if="scope.row.cityName !== null">/</span>{{scope.row.cityName}}<span v-if="scope.row.cityName !== null&&scope.row.areaName !== null">/</span>{{scope.row.areaName}}</div>
                    <div>{{scope.row.address}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  header-align="left"
                  align="left"
                  label="状态">
                  <template slot-scope="scope">
                    <div class="dealer_status" :style="{'background-color':scope.row.status === 1? '#0ede77':'#f74c60'}"></div>
                    <span v-if="scope.row.status === 1">已启用</span>
                    <span v-if="scope.row.status === 0">已停用</span>
                    <div>{{scope.row.updateTime}}</div>
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
                  fixed="right"
                  header-align="center"
                  align="center"

                  label="操作">
                  <template slot-scope="scope">
                    <div class="dealer_operate">
                      <span @click="showCreateDealer(scope.row)" v-if="scope.row.level !== 3">创建下级</span>
                      <span @click="getMemberListByOrganizationId(scope.row.id)" v-if="scope.row.level === 3">查看成员</span>
                      <el-dropdown>
											<span class="dealer_operate_more">
												<i class="el-icon-more"></i>
											</span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="getMemberListByOrganizationId(scope.row.id)" v-if="scope.row.level !== 3">查看成员</el-dropdown-item>
                          <el-dropdown-item @click.native="showUpdatDealer(scope.row)">修改</el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.status === 1" @click.native="updateStatus(scope.row)">停用</el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.status === 0" @click.native="updateStatus(scope.row)">启用</el-dropdown-item>
                          <el-dropdown-item  @click.native="deleteHandle(scope.row)">
                            <span v-if="scope.row.sonNum === 0 || scope.row.sonNum === '' || scope.row.sonNum === null">删除</span>
                            <span v-if="scope.row.children!==undefined&&scope.row.children.length === 0">删除</span>
                          </el-dropdown-item>
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
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, prev, pager, next, sizes"
            :total="totalCount">
          </el-pagination>

        </template>
      </page-template>

    <el-dialog :title="createTitle" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="上级经销商"  v-if="isShowDealer">
          <span>{{levelDealer}}</span>
        </el-form-item>
        <el-form-item label="经销商名称"  prop="organizationName">
          <el-input v-model="form.organizationName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经销商负责人"  prop="chargerId" v-if="updateShow">
          <el-select v-model="form.chargerId" placeholder="请选择" >
            <el-option
              v-for="item in managers"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="经销商负责人"  prop="charger" v-if="!updateShow">
          <el-input v-model="form.charger" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="负责人手机号"  prop="mobile" v-if="!updateShow">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" class="contact_area">
          <area-template @getAreaData="getAreaData" :selectedValue="selectedValue"  ref="contactArea"></area-template>
          <span ref="errorContact" v-show="contactWrong" class="form_error">{{contactErrorMsg}}</span>
        </el-form-item>
        <el-form-item label="" label-width="100px" style="margin-top: -30px">
          <div >
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
        <el-form-item label="经销地区" class="deal_area">
          <!--<el-cascader-->
            <!--:options="provincesData"-->
            <!--change-on-select-->

            <!--:props="props"-->
            <!--v-model="selectedOptions2"-->
          <!--&gt;</el-cascader>-->
          <area-template @getAreaData="getAreaData2" :selectedValue="selectedValue2" :changeOnSelect="true"  ref="dealArea"></area-template>
          <span ref="errorDeal" v-show="dealWrong" class="form_error">{{dealErrorMsg}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeForm ('form')">取消</el-button>
        <el-button type="primary" @click="createDealer" :loading="save_loading">确定</el-button>
      </div>
    </el-dialog>

      <!--成员查看-->
      <el-dialog title="查看成员" :visible.sync="dialogMemberVisible" >

            <el-table
              :data="memberData"
              border
              height="440"
              style="width: 100%;">
              <el-table-column
                prop="userName"
                label="姓名"
                width="">
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                width="">
              </el-table-column>
              <el-table-column
                prop="roleNames"
                label="角色">
              </el-table-column>
            </el-table>

      </el-dialog>

      <!--删除经销商转移-->
      <el-dialog title="删除经销商" :visible.sync="dialogDeleteVisible" width="35%">
        <el-radio-group v-model="deleteRadio">
          <el-radio label="1" style="display: block;margin-top: 15px;margin-left: 0px">
            <span>转移到其他经销商下</span>
            <!--<dealer-template @getSelectDealerData="getSelectDealerData" :parentId="parentorganizationId"></dealer-template>-->
            <el-select v-model="otherDealer" placeholder="请选择">
              <el-option
                v-for="item in otherDealers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-radio>
          <el-radio label="2" class="dealer_radio">全部删除</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteDealer" :loading="save_loading">确定</el-button>
        </div>
      </el-dialog>
    <!--&lt;!&ndash; 弹窗, 新增 / 修改 &ndash;&gt;-->
    <!--<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
  import pageTemplate from '@/components/pageTemplate'
  import areaTemplate from '@/components/areaTemplate'
  import dealerTemplate from '@/components/dealerTemplate'
  import searchTree from '@/components/page/search-tree'
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate_dealer } from '@/utils'
  import dealerOrOwnAreaTemplate from '@/components/dealerOrOwnAreaTemplate'
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
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        formInline: {
          status: "",
          keyword: ""
        },
        form: {
          organizationName: '',
          charger: '',
          mobile: '',
          address: ''
        },
        pageIndex: 1,
        pageSize: 10,
        currentPage: 1,
        totalCount: 1,
        dialogFormVisible: false,
        provincesData: [],
        provinces: [],
        cities: [],
        areas: [],
        areasData: [],
        memberData: [],
        dialogMemberVisible: false,
        selectedOptions: {},
        props: {
          value: 'id',
          lable: 'lable',
          children: 'children'
        },
        selectedOptions2: {},
        save_loading: false,
        createTitle: '',
        isShowDealer: false,
        levelDealer: "",
        levelDealerId: "",
        dialogDeleteVisible: false,
        dealers: [],
        dealer: '',
        deleteRadio: '1',
        dealerprops: {
          lable: 'label',
          children: 'children'
        },
        filterText: '',
        selectDealer: [],
        parentorganizationId: '',
        areaReset: false,
        selectedSearch: {},
        organizationId: "",
        defaultAreaValue: "",
        defaultAgentValue: "",
        otherDealer: "",
        otherDealers: [],
        address_detail: "",
        userlocation: {lng: "", lat: ""},
        managers: [],
        selectedValue: [],
        selectedValue2: [],
        updateShow: false,
        contactWrong: false,
        dealWrong: false,
        contactErrorMsg: "",
        dealErrorMsg: "",
        rules:{
          organizationName: [{ required: true, message: '请输入经销商姓名', trigger: 'blur' }],
          charger: [{ required: true, message: '请输入经销商负责人', trigger: 'blur' }],
          chargerId: [{ required: true, message: '请选择经销商负责人', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: checkMobile }],
          address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
        },
        showTable: true,
        roleShow: true
      }
    },
    components: {
      TableTreeColumn,
      pageTemplate,
      searchTree,
      areaTemplate,
      dealerTemplate,
      dealerOrOwnAreaTemplate
    },
    computed: {
      userObj: {
        get () {return this.$store.state.user.userObj},
      }
    },
    created () {
      this.getDataList()
      for(var i=0;i<this.userObj.roleList.length;i++){
        if(this.userObj.roleList[i].roleId === "4" || this.userObj.roleList[i].roleId === "5"){
          this.roleShow = false
          return
        }
      }
      // this.getProvince()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 获取数据列表
      getDataList (pageIndex) {
        this.dataListLoading = true
        console.log(this.selectedSearch)
        this.pageIndex = pageIndex?parseInt(pageIndex):this.pageIndex
        var params = {
          page: pageIndex || this.pageIndex.toString(),
          limit: this.pageSize.toString(),
          organizationId: this.userObj.organizationId.toString(),
          sidx: 'level',
          order: 'desc',
          // level: this.userObj.organizationLevel,
          status: this.formInline.status,
          agentProvinceCode: this.selectedSearch.provinceCode!== undefined?this.selectedSearch.provinceCode:"",
          agentCityCode: this.selectedSearch.cityCode!== undefined?this.selectedSearch.cityCode:"",
          agentAreaCode: this.selectedSearch.areaCode !== undefined ?this.selectedSearch.areaCode:"",
          keyword: this.formInline.keyword,
          level: this.userObj.organizationLevel.toString()
        };
        var url = ''
        if(params.status !== '' || params.agentProvinceCode !== '' || params.keyword !== '' || this.userObj.organizationLevel === 2){
          this.showTable = false

          url = 'organization/getListPage'
        }else{
          this.showTable = true

          url = 'organization/getTreeListPage'
        }
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (data && data.code === 0){
            this.dataList = []
            this.$nextTick(() => {
              if(params.status !== '' || params.agentProvinceCode !== '' || params.keyword !== ''
                || (this.userObj.roleList[0].roleId === '4' && this.userObj.organizationLevel === 2)){
                this.dataList = data.page.list
              }else{
                if((this.userObj.roleList[0].roleId === '4' && this.userObj.organizationLevel === 1)){
                  this.dataList = treeDataTranslate_dealer(data.page.list, 'id','parentId',2)
                }else{
                  this.dataList = treeDataTranslate_dealer(data.page.list, 'id','parentId')
                }

              }
            })

            this.totalCount = data.page.totalCount

          }else{
            // this.totalPage = 0;
            this.$message.error(data.message);
          }
          this.dataListLoading = false
        })
      },
      // 删除
      deleteHandle (row) {
        var deleteData = {
          organizationId: row.id,
          newOrganizationId: ''
        }
        var params = {
          organizationId: row.id
        }
        this.parentorganizationId = row.parentId
        this.organizationId = row.id

        this.$confirm(`删除经销商将会同步删除经销商下的成员账号，是否确认继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`organization/queryUserCustomerStationCountByOrganizationId`),
            method: 'post',
            data: this.$http.adornData(params)
          }).then(({data}) => {
            if (data && data.code === 0) {
              if(data.data.customerCount !== 0 ){
                this.getOtherDealer(row.parentId)
                this.dialogDeleteVisible = true
              }else{
                this.deleteRadio = "2"
                this.directDeleteHandle()
              }
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      },
      handleSizeChange (val) {
        // console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        // console.log(`当前页: ${val}`)
        this.pageIndex = val
        this.getDataList()
      },
      //新建编辑经销商页面显示,
      // info=1新建经销商，否则新建下级
      showCreateDealer (info) {
        this.$nextTick(()=>{
          this.form = {
            organizationName: '',
            charger: '',
            chargerId: '',
            mobile: '',
            address: ''
          }
          this.selectedOptions = {}
          this.selectedOptions2 = {}
          this.selectedValue = []
          this.selectedValue2 = []
          this.address_detail = ''
          this.organizationId = ''
          this. userlocation = {lng: "", lat: ""}
          if (info) {
            this.createTitle = "新建下级经销商"
            this.isShowDealer = true
            this.levelDealer = info.name
            this.levelDealerId = info.id
          }else{
            this.createTitle = "新建经销商"
            this.isShowDealer = false
          }
          this.contactWrong = false
          this.contactErrorMsg = ""


          this.dealWrong = false
          this.dealErrorMsg = ""

          if(this.$refs['form']){
            this.$refs['form'].resetFields();
          }

        })
        this.initMap ()
        this.getManagers ()
        // console.log(this.provinces)
        this.updateShow = false
        this.dialogFormVisible = true
        if(this.$refs.contactArea){
          this.$refs.contactArea.$el.children[0].children[0].children[0].style.borderColor = ''
        }
        if(this.$refs.dealArea){
          this.$refs.dealArea.$el.children[0].children[0].children[0].style.borderColor = ''
        }
      },
      //显示修改页面
      showUpdatDealer (info) {
        this.$nextTick(()=>{

          this.createTitle = "修改经销商"
          if (info.level === 1) {
            this.isShowDealer = false
          }else{
            this.isShowDealer = true
          }
          // console.log(this.getNode(info.id))
          this.form = {
            organizationName: info.name,
            chargerId: info.chargerId,
            mobile: info.mobile,
            address: info.address
          }
          this.selectedValue = []
          if(info.provinceCode !== null || info.cityCode !== null || info.areaCode !== null){
            this.selectedValue.push(info.provinceCode,info.cityCode,info.areaCode)
          }
          this.selectedValue2 = []
          if(info.agentProvinceCode !== null || info.agentCityCode !== null || info.agentAreaCode !== null){
            this.selectedValue2.push(info.agentProvinceCode,info.agentCityCode,info.agentAreaCode)

          }
          this.levelDealer = info.parentName
          this.selectedOptions.provinceCode = info.provinceCode
          this.selectedOptions.cityCode = info.cityCode
          this.selectedOptions.areaCode = info.areaCode
          this.selectedOptions.provinceName = info.provinceName
          this.selectedOptions.cityName = info.cityName
          this.selectedOptions.areaName = info.areaName
          this.selectedOptions2.provinceCode = info.agentProvinceCode
          this.selectedOptions2.cityCode = info.agentCityCode
          this.selectedOptions2.areaCode = info.agentAreaCode
          this.selectedOptions2.provinceName = info.agentProvinceName
          this.selectedOptions2.cityName = info.agentCityName
          this.selectedOptions2.areaName = info.agentAreaName
          this.address_detail = info.address
          this.userlocation = {lng: info.latitude, lat: info.latitude}
          this.contactWrong = false
          this.contactErrorMsg = ""
          if(this.$refs.contactArea !== null){
            this.$refs.contactArea.$el.children[0].children[0].children[0].style.borderColor = ''
          }
          if(this.$refs.dealArea !== null){
            this.$refs.dealArea.$el.children[0].children[0].children[0].style.borderColor = ''
          }
          this.dealWrong = false
          this.dealErrorMsg = ""
          this.$refs['form'].resetFields();
        })
        this.getManagers (info.id)
        var areaName = info.cityName !== null ? info.cityName.split("市")[0] : info.provinceName
        if(info.latitude === null || row.latitude === ''){
          this.initMap (areaName)
        }else{
          this.initMap (0)
        }
        this.organizationId = info.id
        this.updateShow = true
        this.dialogFormVisible = true
      },
      //停用启用
      updateStatus (row) {

        var data = {
          organizationId: row.id,
          status: row.status === 0?'1':'0'
        }
        var message = row.status === 1 ? "停用客户后，该成员账号不会被删除，但将无法登录系统，是否确认停用？"
          :"启动客户后，该客户将能够重新登录系统，是否确认启用？"
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: this.$http.adornUrl('organization/updateStatus'),
            method: 'post',
            data: this.$http.adornData(data)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getDataList('1')
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})

      },
      //查看成员
      getMemberListByOrganizationId (id) {
        var data = {
          organizationId: id,
          isOrganizationUser: "1"
        }
        this.$http({
          url: this.$http.adornUrl('sys/user/getMemberListByOrganizationId'),
          method: 'post',
          data: this.$http.adornData(data)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.memberData = data.data
          } else {
            this.$message.error(data.message)
          }
        })
        this.dialogMemberVisible = true
      },
      //获取经销区
      getAgentArea (id) {
        if(id.length === 1){
          this.getCity(id[0])
        }else if(id.length === 2){
          this.getArea(id[1])
        }
      },
      //新建经销商
      createDealer () {

        // console.log(this.selectedOptions)
        this.save_loading = true
        var url = ""
        var messages = ""
        var data = {
          mobile: this.form.mobile,
          address: this.form.address,
        }
        if(this.organizationId !== ''){
          data.organizationId = this.organizationId
          data.chargerId = this.form.chargerId
          url = "organization/updateOrganizationAndUpdateCharger"
          messages = "修改经销商成功"
        }else{
          data.parentOrganizationId = this.levelDealerId || this.userObj.organizationId
          data.charger = this.form.charger
          url = "organization/saveOrganizationAndSaveCharger"
          messages = "新增经销商成功"
        }
        data.organizationName = this.form.organizationName
        console.log(this.selectedOptions)
        console.log(this.selectedOptions2)
        data.provinceCode = this.selectedOptions.provinceCode
        data.provinceName = this.selectedOptions.provinceName
        data.agentProvinceCode = this.selectedOptions2.provinceCode
        data.agentProvinceName = this.selectedOptions2.provinceName
        data.cityCode = this.selectedOptions.cityCode
        data.cityName = this.selectedOptions.cityName
        data.agentCityCode = this.selectedOptions2.cityCode
        data.agentCityName = this.selectedOptions2.cityName
        data.areaCode = this.selectedOptions.areaCode
        data.areaName = this.selectedOptions.areaName
        data.agentAreaCode = this.selectedOptions2.areaCode
        data.agentAreaName = this.selectedOptions2.areaName
        debugger
        if(this.selectedOptions.provinceCode === undefined || this.selectedOptions.provinceCode === null){
          this.contactWrong = true
          this.contactErrorMsg = "请输入联系地址"
          this.$refs.contactArea.$el.children[0].children[0].children[0].style.borderColor = '#f56c6c'
          this.save_loading = false
          return
          // console.log(this.$refs.area)
        }else{
          this.contactWrong = false
          this.contactErrorMsg = ""
          this.$refs.contactArea.$el.children[0].children[0].children[0].style.borderColor = ''
        }
        if(this.selectedOptions2.provinceCode === undefined || this.selectedOptions2.provinceCode === null){
          this.dealWrong = true
          this.dealErrorMsg = "请输入经销地址"
          this.$refs.dealArea.$el.children[0].children[0].children[0].style.borderColor = '#f56c6c'
          this.save_loading = false
          return
          // console.log(this.$refs.area)
        }else{
          this.dealWrong = false
          this.dealErrorMsg = ""
          this.$refs.dealArea.$el.children[0].children[0].children[0].style.borderColor = ''
        }
        this.$refs['form'].validate((valid) => {

          if (valid) {
            this.$http({
              url: this.$http.adornUrl(url),
              method: 'post',
              data: this.$http.adornData(data)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: messages,
                  type: 'success'
                });
                this.getDataList("1")
                this.dialogFormVisible = false
                this.$refs['form'].resetFields();
              } else {
                this.$message.error(data.message);
              }

            })
          }
        });
        this.save_loading = false
      },
      //接收省市区信息
      getAreaData (val) {
        console.log(val)
        this.selectedOptions = val
        var areaName = val.cityName !== undefined ? val.cityName.split("市")[0] : val.provinceName
        console.log(areaName)
        this.initMap (areaName)
      },
      getAreaData2 (val) {
        console.log(val)
        this.selectedOptions2 = val
      },
      getSearchAreaData (val) {
        console.log(val)
        this.selectedSearch = val
        this.areaReset = false
        this.getDataList("1")
      },
      getSelectDealerData (val) {
        this.selectDealer = val
        console.log(this.selectDealer)
      },
      //重置
      resetForm (formName) {
        this.formInline = {
          status: '',
          areaCode: '',
          keyword: '',
          organizationIds: ''
        }
        this.dealerReset = true
        this.areaReset = true
        this.getDataList("1")
        // this.$refs[formName].resetFields();
      },
      //删除
      deleteDealer () {
        var message = ""
        if(this.deleteRadio === "1"){
          message = "您希望将该经销商下的客户和电站：转移到其他经销商下"
          // data.newOrganizationId = this.selectDealer[0].id
        }else{
          message = "您将删除选择的经销商及其成员，客户和电站，删除操作不可恢复，是否确认继续？"
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.directDeleteHandle()


        }).catch(() => {})

      },
      //直接删除
      directDeleteHandle () {
        var data = {
          "organizationId": this.organizationId,
        }
        if(this.deleteRadio === "1"){
          data.newOrganizationId = this.otherDealer
        }else{
          data.newOrganizationId = ''
        }
        console.log(data)
        this.$http({
          url: this.$http.adornUrl('organization/deleteOrganizationAndUpdateCustomer'),
          method: 'post',
          data: this.$http.adornData(data)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList("1")
                this.dialogDeleteVisible = false
              }
            })

          } else {
            this.$message.error(data.message)
          }
        })
      },
      getOtherDealer (parentId) {
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
              if(this.organizationId !== list[i].id){
                list[i].label = list[i].name;
                rst.push(list[i]);
              }
            }
            this.otherDealers = rst
          }
          // console.log(rst)

          // return rst;
          // this.dealers.push(data.data)

        })
        // this.dialogDeleteVisible = true
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
          if(this.$refs.map_search_btn !== null){
            searchBtn = this.$refs.map_search_btn.$el
          }
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
      //获得经销商负责人
      getManagers (id) {

        var data = {
          organizationId: id ? id:this.userObj.organizationId
        }
        this.$http({
          url: this.$http.adornUrl(`organization/getOrganizationManagers`),
          method: 'post',
          data: this.$http.adornData(data)
        }).then(({data}) => {
          if(data && data.code === 0){
            this.managers = data.data
          }
        })
      },
      closeForm (formName) {
        var suggestion = document.getElementsByClassName('tangram-suggestion-main')
        for(var i=0;i<suggestion.length;i++){
          suggestion[i].style.zIndex = '1'
        }
        suggestion[suggestion.length-1].style.display = 'none';
        this.dialogFormVisible = false;
        // 点击取消 数据重置
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/scss/variables.scss';
.el-dialog{
  margin: 70px auto 15px !important;
}
.dealer-content {
  padding: 10px;
  box-sizing: border-box;
  .dealer_operate {
    color: $--color-101;
    span {
      cursor: pointer;
      &:not(.dealer_operate_more)::after {
        content: '|';
        color: $--color-311;
        padding: 0 0 0 5px;
      }
    }
    .dealer_operate_more {
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
.dealer_radio{
  display: block;
  margin-top: 30px;
  margin-left: 0px !important;
}
.dealer_status{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 10px;
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
  top: 48px;
  left: 11px;
  z-index: 1;
  padding: 5px 10px !important;
}
.contact_area {
  label:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.deal_area {
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
.el-cascader .el-input input::-webkit-input-placeholder{color: #606266!important;}    /* 使用webkit内核的浏览器 */
.el-cascader .el-input input:-moz-placeholder{color: #606266!important;}                  /* Firefox版本4-18 */
.el-cascader .el-input input::-moz-placeholder{color: #606266!important;}                  /* Firefox版本19+ */
.el-cascader .el-input input:-ms-input-placeholder{color: #606266!important;}
</style>
