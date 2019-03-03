<template>
  <div class="jj-upload">
    <div class="up-inner">
      <div class="opts clearfix">已上传文档<span class="num">{{allCount}}</span>
        <i class="btn add" @click="showUpload()"><span class="icon_add001"></span>上传文档</i>
      </div>
      <div class="con">
        <ul class="tap clearfix">
          <template v-for="(tt, index) in topTap">
            <li @click="changeFileType" v-if="index == 0" class="active" :cId="tt.category" :key="index">
              <div>{{tt.name}}<span>{{tt.count}}</span></div>
            </li>
            <li @click="changeFileType" v-else :key="index" :cId="tt.category">
              <div>{{tt.name}}<span>{{tt.count}}</span></div>
            </li>
          </template>
        </ul>
        <div class="data">
          <template v-if="tableData.length <= 0">
            <div class="empty"><span>您还没有上传文档</span></div>
          </template>
          <template v-else>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              v-loading="listloading"
              :height="tHeight">
              <el-table-column
                prop="fileName"
                style="width: 25%"
                label="文档">
              </el-table-column>
              <el-table-column
                prop="remark"
                style="width: 20%"
                label="描述">
              </el-table-column>
              <el-table-column
                prop="category"
                style="width: 16%"
                label="类别">
              </el-table-column>
              <el-table-column
                prop="fileSize"
                label="大小">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="right"
                width="160">
                <template slot-scope="scope">
                  <el-button @click="downLoadFile(scope.row)" type="text" size="small">下载</el-button>
                  <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="paging" v-if="tableData.length > 0">
          <div class="total">Total Records : {{total}}</div>
          <el-pagination
            small
            layout="prev, pager, next"
            :page-size="listParams.limit"
            :total="total"
            @current-change="handleCurrentChange">
          </el-pagination>
          <el-select v-model="pageLimit.value" @change="handleSizeChange" placeholder="请选择">
            <el-option
              v-for="item in pageLimit.data"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <!-- <div class="size">{{listParams.limit}}/Page</div> -->
        </div>
      </div>
    </div>
    <div class="up-cover">
      <div class="inner">
        <i class="close el-icon-close" @click="hideUpload"></i>
        <div class="title" v-if="updateId">编辑文档信息</div>
        <div class="title" v-if="!updateId">上传文档</div>
        <div class="body" v-loading="uploading">
          <div class="file-item" v-if="!updateId">
            <template v-if="fileProgress.length <= 0" class="empty">
              <el-upload
                class="avatar-uploader"
                ref="upload"
                :action="uploadAction"
                :show-file-list="false"
                :headers="fileUploadHeaders"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :on-progress="handleAvatarProgress"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </template>
            <template v-else>
              <div class="upload-file-item" v-for="(file,index) in fileProgress" :key="index">
                <div class="name">{{file.name}}</div>
                <div class="percent" v-if="!updateId">
                  <div class="full" :style="{width: file.percent + '%'}"></div>
                </div>
                <div class="info">
                  <template v-if="file.type != 3">
                    <span>{{file.percent}}%</span><span>（{{file.loaded}}/{{file.total}}）</span>
                  </template>
                  <template v-if="file.type == 2">
                    <span class="success-msg">上传成功</span>
                    <a href="javascript:;" @click="reUploadFile" :fileId="file.fileId">重新选择</a>
                  </template>
                  <template v-if="file.type == 3">
                    <span class="error-msg">上传失败</span>
                    <a href="javascript:;" @click="reSubmitFile">重新上传</a>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div class="file-item edit-file-item" v-if="updateId">
            <div class="upload-file-item" v-for="(file,index) in fileProgress" :key="index">
              <div class="name">{{file.name}}</div>
              <div class="info">
                <span>{{file.total}}</span>
              </div>
            </div>
          </div>
          <div class="form-item">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
              <el-form-item label="文档类别" prop="fileType">
                <div class="info">
                  <i></i>
                  <ul class="info-con">
                    <li>
                      <div class="i-t">图纸</div>
                      <div class="i-con">组件排布图、系统设计图、施工图纸等</div>
                    </li>
                     <li>
                      <div class="i-t">合同</div>
                      <div class="i-con">代运维合同、购售电合同、EPC合同等</div>
                    </li>
                     <li>
                      <div class="i-t">说明书</div>
                      <div class="i-con">箱变说明书、逆变器说明书、汇流箱说明书等</div>
                    </li>
                     <li>
                      <div class="i-t">手册</div>
                      <div class="i-con">安全运行手册、电站管理手册</div>
                    </li>
                  </ul>
                </div>
                <el-radio-group v-model="ruleForm.fileType" @change="vdSubmitComplete">
                  <el-radio label="0">图纸</el-radio>
                  <el-radio label="1">合同</el-radio>
                  <el-radio label="2">说明书</el-radio>
                  <el-radio label="3">手册</el-radio>
                  <el-radio label="4">其他</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" maxlength="50" @input="vdSubmitComplete" placeholder="请输入"></el-input>
                <span class="ta-len">{{descLen}}/50</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="opts">
          <i class="cancle" @click="hideUpload">取消</i>
          <i class="submit" v-if="uploadBtnStatus" @click="submitForm">提交</i>
          <i class="submit disabled" v-if="!uploadBtnStatus" @click="submitForm">提交</i>
        </div>
      </div>
    </div>
    <!-- <div class="jj-submit clearfix">
      <div class="l">最近保存于 2018-11-21 12:33</div>
      <div class="r clearfix">
        <div class="tip">未录入台帐，无法确认交接完成</div>
        <div class="btns">
            <i class="btn normal">上一步</i>
            <i class="btn normal">下一步</i>
            <i class="btn submit disabled">确认交接完成</i>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>

export default {
  name: 'jjstep2',
  props: {
    proName: String
  },
  data() {
    return {
      ruleForm: {
        fileType: "",
        desc: "",
      },
      rules: {
        fileType: [
          { required: true, message: '请选择文档类型', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入文件描述', trigger: 'change' }
        ],
      },
      pageLimit: {
        value: '10/Page',
        data: ['5/Page','10/Page','20/Page','50/Page']
      },
      fileUploadHeaders: {},//文件上传请求头
      uploadAction: "",//文件上传接口地址
      fileProgress: [],//上传过程中文件状态
      topTap: [],
      tableData: [],
      tHeight: 250, //表格高度
      listParams: {page:1,limit:10,category:"",powerstationId:""}, //文件列表查询参数
      total: 0, //分页总条数
      allCount: 0, //已上传文档数量
      updateId: '',//文档id,存在则编辑
      uploadBtnStatus: false, //验证提交按钮是否可以点击
      listloading: false, //列表加载loading
      uploading: false, //上传loading
    }
  },
  computed: {
    descLen: function(){
      return this.ruleForm.desc.length;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function(){
      var token = this.$cookie.get('token');
      if(!this.$route.query.powerStationId){
        return false;
      }
      this.listParams.powerstationId = this.$route.query.powerStationId;
      if(token){
        this.fileUploadHeaders = {token: token};
        this.uploadAction = this.$http.adornUrl("stationhandover/uploadFile/upload");
        this.getFiles();
      }
      //计算列表高度
      try {
        var _this = this;
        _this.tHeight = document.querySelector(".con .data").clientHeight;
        window.onresize= function(){
          _this.tHeight = document.querySelector(".con .data").clientHeight;
        }
      } catch (error) {}
    },
    fileSizeFormat: function(val){
      if (val === 0 || val === null || val === undefined || val === "") return '0 B';
      var k = 1024,
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    getFiles: function(){
      var _this = this;
      _this.listloading = true;
      this.$http.post(this.$http.adornUrl("stationhandover/uploadFile/fileList"),this.listParams).then(function(res){
        var result = res.data;
        _this.listloading = false;
        if(result.code == 0){
          _this.topTap = [
            {category: "", name: "全部", count: result.data.allCount},
            {category: "0", name: "图纸", count: result.data.drawingCount},
            {category: "1", name: "合同", count: result.data.contractCount},
            {category: "2", name: "说明书", count: result.data.specificationCount},
            {category: "3", name: "手册", count: result.data.notebookCount},
            {category: "4", name: "其它", count: result.data.otherCount},
          ];
          var categoryTypeName = ["图纸","合同","说明书","手册","其他"];
          _this.total = result.data.page.totalCount;
          _this.allCount = result.data.allCount;
          _this.tableData = result.data.page.list.map(function(item){
            item.category = categoryTypeName[item.category];
            item.fileSize = _this.fileSizeFormat(item.fileSize);
            return item;
          });
          _this.$emit("checkParamsEvent",{keyname: 'fileOk', isok: _this.tableData.length});
        }else{
        }
      },function(){
        _this.listloading = false;
      });
    },
    //更换每页显示条数
    handleSizeChange: function(val){
      this.listParams.page = 1;
      this.listParams.limit = parseInt(val);
      this.getFiles();
    },
    handleCurrentChange: function(val){
      this.listParams.page = parseInt(val);
      this.getFiles();
    },
    //切换文件查询类型
    changeFileType: function(event){
      var target = event.currentTarget;
      if(event.currentTarget.className != "active"){
        document.querySelector(".jj-upload .tap li.active").classList.remove("active");
        target.classList.add("active");
        this.listParams.category = target.getAttribute("cId");
        this.getFiles();
      }
    },
    //显示上传
    showUpload: function(isEdit){
      if(!isEdit){
        this.updateId = '';
        document.querySelector(".el-upload input[type='file']").click();
      }else{
        document.querySelector(".up-cover").classList.add("show");
      }
    },
    //隐藏上传
    hideUpload: function(){
      if(this.fileProgress.length > 0 && this.fileProgress[0].fileId && this.updateId == ""){
        this.deleteFile(this.fileProgress[0].fileId);
      }
      this.fileProgress = [];
      this.$refs['ruleForm'].resetFields();
      document.querySelector(".up-cover").classList.remove("show");
    },
    //文件上传前
    beforeAvatarUpload(file) {
      // if(file.name.length > 50){
      //   this.$message.error("文件名长度不得多于50字符，请重新选择");
      //   return false;
      // }
      var fileName = file.name;
      if(fileName){
        fileName = fileName.split(".")[0];
      }
      this.ruleForm.desc = fileName.substr(0,50);
      document.querySelector(".up-cover").classList.add("show");
      return true;
    },
    //上传过程
    handleAvatarProgress: function(event, file, fileList){
      var loaded = this.fileSizeFormat(event.loaded);
      var total = this.fileSizeFormat(event.total);
      var percent = event.percent > 99 ? 99 : event.percent;
      this.fileProgress = [{
        type: 1,
        fileId: '',
        total: total,
        loaded: loaded,
        name: file.name,
        percent: parseFloat(percent).toFixed(2)
      }]
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      if(res.data && res.data.fileId){
        this.fileProgress[0].type = 2;
        this.fileProgress[0].fileId = res.data.fileId;
        this.fileProgress[0].percent = 100;
      }
      this.vdSubmitComplete();
    },
    //上传失败
    handleAvatarError: function(res, file){
      this.fileProgress[0].type = 3;
    },
    //验证提交数据的完整性
    vdSubmitComplete: function(){
      if(this.fileProgress.length > 0 && this.ruleForm.fileType && this.ruleForm.desc){
        this.uploadBtnStatus = true;
      }else{
        this.uploadBtnStatus = false;
      }
    },
    //提交数据
    submitForm: function(){
      var _this = this;
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.fileProgress.length > 0 && this.fileProgress[0].fileId != ""){
            if(!this.updateId){
              var params = {
                powerstationId: this.listParams.powerstationId,
                fileId: this.fileProgress[0].fileId,
                category: this.ruleForm.fileType,
                remark: this.ruleForm.desc
              }
              _this.uploading = true;
              this.$http.post(this.$http.adornUrl("stationhandover/uploadFile/fileSave"),params).then(function(res){
                if(res.data.code == 0){
                  _this.fileProgress = [];
                  _this.hideUpload();
                  _this.getFiles();
                  _this.$message.success('上传成功');
                }else{
                  _this.$message.success(res.message);
                }
                _this.uploading = false;
              },function(){
                _this.uploading = false;
              });
            }else{
              var params = {
                id: this.updateId,
                fileId: this.fileProgress[0].fileId,
                category: this.ruleForm.fileType,
                remark: this.ruleForm.desc
              }
              this.$http.post(this.$http.adornUrl("stationhandover/uploadFile/fileUpdate"),params).then(function(res){
                if(res.data.code == 0){
                  _this.fileProgress = [];
                  _this.hideUpload();
                  _this.getFiles();
                  _this.$message.success('编辑成功');
                }else{
                  _this.$message.error(res.message);
                }
              },function(){
              });
            }
          }else{
            _this.$message.error('请先上传文件');
          }
        } else {
          return false;
        }
      });
    },
    //下载文件
    downLoadFile(row){
      var el = document.createElement("a");
      document.body.appendChild(el);
      el.href = this.$http.adornUrl("stationhandover/uploadFile/downloadFile?fileId=" + row.fileId + "&token=" + this.$cookie.get('token'));
      el.download = row.fileName;
      el.target = '_downFile';
      el.click();
      document.body.removeChild(el);
      /*this.$http({
        url: this.$http.adornUrl("stationhandover/uploadFile/downloadFile?fileId=" + row.fileId),
        method: "get",
        responseType: "blob",
        headers: {
          'token': this.$cookie.get('token')
        }
      }).then(function(res){
        
      });*/
    },
    //编辑数据
    editRow(row){
      console.log(row);
      this.updateId = row.id;
      var total = row.fileSize;
      this.fileProgress = [{
        type: 2,
        fileId: row.fileId,
        total: total,
        loaded: total,
        name: row.fileName,
        percent: 100
      }];
      var cateList = {"图纸": "0","合同": "1","说明书": "2","手册": "3","其他": "4"};
      this.ruleForm = {
        fileType: cateList[row.category],
        desc: row.remark,
      }
      this.vdSubmitComplete();
      this.showUpload(true);
    },
    //删除数据
    deleteRow(row){
      var _this = this;
      if(row.id){
        this.$confirm('您确认要删除文档' + row.fileName  + '吗？', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          _this.$http.post(this.$http.adornUrl("stationhandover/uploadFile/fileDetele"),{id: row.id}).then(function(res){
            if(res.data.code == 0){
              _this.getFiles();
              _this.$message.success('删除成功');
            }else{
              _this.$message.error(res.data.message);
            }
          },function(){
            _this.$message.error('删除失败');
          });
        }).catch(() => {      
        });

        
      }else{
        _this.$message.error('无效数据，主键丢失删除失败');
      }
    },
    reUploadFile: function(event){
      var fileId = event.currentTarget.getAttribute("fileId");
      this.fileProgress = [];
      if(fileId){
        this.deleteFile(fileId);
      }
      this.vdSubmitComplete();
      setTimeout(function(){
        document.querySelector(".el-upload input[type='file']").click();
      },100);
    },
    reSubmitFile: function(event){
      this.reUploadFile(event);
    },
    //删除文件
    deleteFile: function(fileId){
      this.$http.post(this.$http.adornUrl('stationhandover/uploadFile/deteleUploadFile'),{fileId: fileId}).then(function(res){
      },function(){
      });
    }
  }
}
</script>
<style lang="scss">
@import '../../../../assets/scss/stationHandOver/public.scss';
@import '../../../../assets/scss/stationHandOver/stepNo2.scss';
</style>
