<template>
  <div class="jj-enter">
    <div class="en-inner">
        <div class="danger">
          <div class="inner">
            <div class="title">
              <div class="name">缺陷及隐患记录<span class="num">{{ftotal}}</span></div>
              <div class="opts">
                <i class="btn add" type="1" @click="showUploadqx"><span class="icon_add001"></span>录入缺陷</i>
                <i class="btn add" type="2" @click="showUploadqx"><span class="icon_add001"></span>录入隐患</i>
              </div>
            </div>
            <template v-if="faultList.length > 0">
              <ul class="list" v-loading="flistloading">
                <li v-for="(fd,index) in faultList" :key="index" @click="showEditqx" :fId="fd.id">
                  <template v-if="fd.faultType == 0">
                    <div type="1" class="n-need-h name" style="max-height: 52px;">
                      <span class="n-icon n-down" @click.stop="showAllName" style="display: none;"><span class="ellipsis">...</span> 展开<i class="el-icon-arrow-down"></i></span>
                      <span class="n-icon n-up" @click.stop="hideAllName" style="display: none;">收起<i class="el-icon-arrow-up"></i></span>
                      <div class="n-i">
                        <i class="tip" type="qx">缺陷</i>
                        {{fd.faultDescribe}}
                        <span class="s-a-s" style="display: none;padding: 0 33px;"></span>
                      </div>
                    </div>
                  </template>
                  <template v-if="fd.faultType == 1">
                    <div type="2" class="n-need-h name" style="max-height: 52px;">
                      <span class="n-icon n-down" @click.stop="showAllName" style="display: none;"><span class="ellipsis">...</span> 展开<i class="el-icon-arrow-down"></i></span>
                      <span class="n-icon n-up" @click.stop="hideAllName" style="display: none;">收起<i class="el-icon-arrow-up"></i></span>
                      <div class="n-i">
                        <i class="tip" type="yh">隐患</i>
                        {{fd.faultDescribe}}
                        <span class="s-a-s" style="display: none;padding: 0 33px;"></span>
                      </div>
                    </div>
                  </template>
                  <div class="imgs">
                    <template v-for="(imgUrl,index) in fd.imageUrls">
                      <img :allImgs="JSON.stringify(fd.imageUrls)" @click.stop="showImageListDetail" :key="index" :src="imgUrl">
                    </template>
                    <template v-if="fd.imageUrls.length > 0 && fd.imageUrls.length > maxImgCount">
                      <div class="imgs-more" :style="{left: ((maxImgCount - 1) * 63) + 'px'}" :allImgs="JSON.stringify(fd.imageUrls)" @click.stop="showImageListDetail">查看全部<br/><span>{{fd.imageUrls.length}}</span>张</div>
                    </template>
                  </div>
                </li>
              </ul>
              <div class="paging">
                <el-pagination
                  small
                  layout="prev, pager, next"
                  :page-size="flistParams.limit"
                  :total="ftotal"
                  @current-change="handleCurrentChange">
                </el-pagination>
              </div>
            </template>
            <template v-if="faultList.length <= 0">
              <div class="empty"><span>暂无内容</span></div>
            </template>
          </div>
        </div>
        <div class="device">
          <div class="inner">
            <div class="title">
              <div class="name">设备铭牌照片<span class="num">{{ntotal}}</span></div>
              <div class="opts">
                <i class="btn delete" @click="deleteNpChecked" v-if="npDeleteImgs.length > 0"><span class="icon_delete"></span>删除<template v-if="npDeleteImgs.length > 0">&nbsp;&nbsp;(&nbsp;{{npDeleteImgs.length}}&nbsp;)</template></i>
                <i class="btn add" @click="showUploadnp"><span class="icon_add001"></span>上传照片</i>
              </div>
            </div>
            <template v-if="nameplateList.length > 0">
              <ul class="list">
                <li v-for="(np,index) in nameplateList" :key="index">
                  <div class="name">{{np.deviceTypeName}}</div>
                  <div class="imgs">
                    <template v-for="(nImg,index) in np.deviceTypeUrlList">
                      <div class="np-image-item" :key="index" :npImgId="nImg.id">
                        <div class="img-delete" @click.stop="choosenpImg" :npImgId="nImg.id"></div>
                        <div class="choosed" @click.stop="choosenpImg" :npImgId="nImg.id">
                          <span class="icon_icon_tick"><img src="../../../../assets/img/right_circle.png"/></span>
                        </div>
                        <img :allImgs="JSON.stringify(np.deviceTypeUrlList)" @click.stop="shownpImageListDetail" :npImgId="nImg.id" :src="nImg.nameplateImgUrl">
                      </div>
                    </template>
                  </div>
                </li>
              </ul>
            </template>
            <template v-if="nameplateList.length <= 0">
              <div class="empty"><span>暂无内容</span></div>
            </template>
          </div>
        </div>
    </div>
    <div class="up-cover up-qx">
      <div class="inner">
        <i class="close el-icon-close" @click="hideUploadqx"></i>
        <div class="title" v-if="qxoryx == 1">录入缺陷</div>
        <div class="title" v-if="qxoryx == 2">录入隐患</div>
        <div class="body" style="padding-top: 22px;">
          <div class="form-item">
            <el-form :model="qxForm" :rules="qxrules" ref="qxForm" label-width="110px" class="demo-ruleForm">
              <template v-if="qxoryx == 1">
                <el-form-item label="缺陷描述" prop="faultDescribe">
                  <el-input v-model="qxForm.faultDescribe" maxlength="100" placeholder="请输入缺陷描述" @input="vdSubmitComplete"></el-input>
                </el-form-item>
                <el-form-item label="处理等级" prop="handleLevel">
                  <el-radio-group v-model="qxForm.handleLevel" @change="vdSubmitComplete">
                    <el-radio label="0">立即处理</el-radio>
                    <el-radio label="1">当天处理</el-radio>
                    <el-radio label="2">三日处理</el-radio>
                    <el-radio label="3">择日处理</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
              <template v-if="qxoryx == 2">
                <el-form-item label="隐患描述" prop="faultDescribe">
                  <el-input v-model="qxForm.faultDescribe" maxlength="100" placeholder="请输入隐患描述" @input="vdSubmitComplete"></el-input>
                </el-form-item>
                <el-form-item label="处理等级" prop="faultDimensions">
                  <el-radio-group v-model="qxForm.faultDimensions" @change="vdSubmitComplete">
                    <el-radio label="0">严重</el-radio>
                    <el-radio label="1">一般</el-radio>
                    <el-radio label="2">轻微</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
              <el-form-item label="照片">
                  <template v-for="(imgItem,index) in upImageList">
                    <div class="up-image-item" :key="index" :imgUrl="imgItem.imageUrl" @click="showUpImgPreview">
                      <div class="img-delete"><i class="el-icon-delete" @click.stop="deleteImg" :imgUrl="imgItem.imageUrl"></i></div>
                      <img :src="imgItem.imageUrl">
                    </div>
                  </template>
                  <template v-if="upImgPreview">
                    <div class="up-image-item" v-loading="true" element-loading-text="" element-loading-background="rgba(0, 0, 0, 0.5)">
                      <img :src="upImgPreview">
                    </div>
                  </template>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadAction"
                    :headers="fileUploadHeaders"
                    :data="fileUploadData"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload"
                    :accept="'image/*'">
                    <!-- <div class="add-img-btn" v-if="fileUploadData.type != 0 || upImageList.length < 8"><i class="el-icon-plus"></i></div> -->
                    <div class="add-img-btn" v-if="upImageList.length < 8"><i class="el-icon-plus"></i></div>
                  </el-upload>
              </el-form-item>
              <el-form-item label="建议处理方式" prop="handleDescribe">
                <el-input type="textarea" v-model="qxForm.handleDescribe" maxlength="200" placeholder="请输入建议处理方式"></el-input>
                <span class="ta-len">{{descLen}}/200</span>
              </el-form-item>
              <el-form-item label="处理结果" prop="handleResult">
                <el-input type="textarea" v-model="qxForm.handleResult" maxlength="200" placeholder="如果已处理，请输入处理结果"></el-input>
                <span class="ta-len">{{resultLen}}/200</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="opts">
          <i class="cancle" @click="hideUploadqx">取消</i>
          <i class="submit" v-if="uploadBtnStatus" @click="submitqxForm">提交</i>
          <i class="submit disabled" v-if="!uploadBtnStatus" @click="submitqxForm">提交</i>
        </div>
      </div>
    </div>

    <div class="up-cover edit-qx">
      <div class="inner" v-loading="editLoading">
        <i class="close el-icon-close" @click="hideEditqx"></i>
        <div class="title" v-if="qxoryx == 1 && editFlag == 1">缺陷详情</div>
        <div class="title" v-if="qxoryx == 2 && editFlag == 1">隐患详情</div>
        <div class="title" v-if="qxoryx == 1 && editFlag == 2">编辑缺陷</div>
        <div class="title" v-if="qxoryx == 2 && editFlag == 2">编辑隐患</div>
        <div class="body" style="padding-top: 22px;">
          <div class="form-item">
            <el-form v-if="editFlag == 1" :model="qxEditForm" :rules="qxEditrules" ref="qxEditForm" label-width="110px" class="demo-ruleForm">
              <template v-if="qxoryx == 1">
                <el-form-item label="缺陷描述">
                   {{qxEditForm.faultDescribe}}
                </el-form-item>
                <el-form-item label="处理等级">
                  {{qxEditForm.handleName}}
                </el-form-item>
              </template>
              <template v-if="qxoryx == 2">
                <el-form-item label="隐患描述">
                  {{qxEditForm.faultDescribe}}
                </el-form-item>
                <el-form-item label="处理等级">
                  {{qxEditForm.faultDName}}
                </el-form-item>
              </template>
              <el-form-item label="照片">
                <template v-for="(imgItem,index) in upImageList">
                  <img class="up-image-item" :key="index" :src="imgItem.imageUrl">
                </template>
              </el-form-item>
              <el-form-item label="建议处理方式">
                {{qxEditForm.handleDescribe}}
              </el-form-item>
              <el-form-item label="处理结果">
                {{qxEditForm.handleResult}}
              </el-form-item>
            </el-form>
            <el-form v-if="editFlag == 2" :model="qxEditForm" :rules="qxEditrules" ref="qxEditForm" label-width="110px" class="demo-ruleForm">
              <template v-if="qxoryx == 1">
                <el-form-item label="缺陷描述" prop="faultDescribe">
                  <el-input v-model="qxEditForm.faultDescribe" maxlength="100" placeholder="请输入缺陷描述" @input="vdSubmitComplete"></el-input>
                </el-form-item>
                <el-form-item label="处理等级" prop="handleLevel">
                  <el-radio-group v-model="qxEditForm.handleLevel" @change="vdSubmitComplete">
                    <el-radio label="0">立即处理</el-radio>
                    <el-radio label="1">当天处理</el-radio>
                    <el-radio label="2">三日处理</el-radio>
                    <el-radio label="3">择日处理</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
              <template v-if="qxoryx == 2">
                <el-form-item label="隐患描述" prop="faultDescribe">
                  <el-input v-model="qxEditForm.faultDescribe" maxlength="100" placeholder="请输入隐患描述" @input="vdSubmitComplete"></el-input>
                </el-form-item>
                <el-form-item label="处理等级" prop="faultDimensions">
                  <el-radio-group v-model="qxEditForm.faultDimensions" @change="vdSubmitComplete">
                    <el-radio label="0">严重</el-radio>
                    <el-radio label="1">一般</el-radio>
                    <el-radio label="2">轻微</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
              <el-form-item label="照片">
                  <template v-for="(imgItem,index) in upImageList">
                    <div class="up-image-item" :key="index" :imgUrl="imgItem.imageUrl" @click="showUpImgPreview">
                      <div class="img-delete"><i class="el-icon-delete" @click.stop="deleteImg" :imgUrl="imgItem.imageUrl"></i></div>
                      <img :src="imgItem.imageUrl">
                    </div>
                  </template>
                  <template v-if="upImgPreview">
                    <div class="up-image-item" v-loading="true" element-loading-text="" element-loading-background="rgba(0, 0, 0, 0.5)">
                      <img :src="upImgPreview">
                    </div>
                  </template>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadAction"
                    :headers="fileUploadHeaders"
                    :data="fileUploadData"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload"
                    :accept="'image/*'">
                    <div class="add-img-btn" v-if="upImageList.length < 8"><i class="el-icon-plus"></i></div>
                  </el-upload>
              </el-form-item>
              <el-form-item label="建议处理方式" prop="handleDescribe">
                <el-input type="textarea" v-model="qxEditForm.handleDescribe" maxlength="200" placeholder="请输入建议处理方式"></el-input>
                <span class="ta-len">{{editdescLen}}/200</span>
              </el-form-item>
              <el-form-item label="处理结果" prop="handleResult">
                <el-input type="textarea" v-model="qxEditForm.handleResult" maxlength="200" placeholder="如果已处理，请输入处理结果"></el-input>
                <span class="ta-len">{{editresultLen}}/200</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="opts">
          <template v-if="editFlag == 1">
            <i class="cancle" :qxId="qxEditForm.id" :faultType="qxEditForm.faultType" @click="deleteQx">删除</i>
            <i class="submit" @click="toEditqx">编辑</i>
          </template>
          <template  v-if="editFlag == 2">
            <i class="cancle" @click="toDetailqx">取消</i>
            <i class="submit" v-if="uploadBtnStatus" @click="submitqxEditForm">提交</i>
            <i class="submit disabled" v-if="!uploadBtnStatus" @click="submitqxEditForm">提交</i>
          </template>
        </div>
      </div>
    </div>

    <div class="up-cover up-np">
      <div class="inner">
        <i class="close el-icon-close" @click="hideUploadnp"></i>
        <div class="title">上传设备铭牌</div>
        <div class="body" style="padding-top: 22px;">
          <div class="form-item">
            <el-form :model="npForm" :rules="nprules" ref="npForm" label-width="110px" class="demo-ruleForm">
              <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="npForm.deviceType" placeholder="请选择" filterable @change="vdSubmitComplete">
                  <el-option
                    v-for="item in deviceList"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="照片">
                  <template v-for="(imgItem,index) in upImageList">
                    <div class="up-image-item" :key="index" :imgUrl="imgItem.imageUrl" @click="showUpImgPreview">
                      <div class="img-delete"><i class="el-icon-delete" @click.stop="deleteImg" :imgUrl="imgItem.imageUrl"></i></div>
                      <img :src="imgItem.imageUrl">
                    </div>
                  </template>
                  <template v-if="upImgPreview">
                    <div class="up-image-item" v-loading="true" element-loading-text="" element-loading-background="rgba(0, 0, 0, 0.5)">
                      <img :src="upImgPreview">
                    </div>
                  </template>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadAction"
                    :headers="fileUploadHeaders"
                    :data="fileUploadData"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload"
                    :accept="'image/*'">
                    <div class="add-img-btn" v-if="upImageList.length < 8"><i class="el-icon-plus"></i></div>
                  </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="opts">
          <i class="cancle" @click="hideUploadnp">取消</i>
          <i class="submit" v-if="uploadBtnStatus" @click="submitnpForm">提交</i>
          <i class="submit disabled" v-if="!uploadBtnStatus" @click="submitnpForm">提交</i>
        </div>
      </div>
    </div>
    <div class="imgs-preview">
      <i class="el-icon-close" @click="hideImgsPreview"></i>
      <i class="el-icon-arrow-left" v-if="imgsPreview.imgArray.length > 1 && imgsPreview.nowIndex != 0" @click="prevImg"></i>
      <div class="i-p-body">
        <template v-for="(ipv,index) in imgsPreview.imgArray">
          <img v-if="ipv.active" :key="index" :src="ipv.url"/>
        </template>
      </div>
      <div class="i-p-ps">
        <template v-for="(ipv,index) in imgsPreview.imgArray">
          <template v-if="ipv.active">{{index + 1}}</template>
        </template>/{{imgsPreview.imgArray.length}}
      </div>
      <i class="el-icon-arrow-right" v-if="imgsPreview.imgArray.length > 1 && imgsPreview.nowIndex < imgsPreview.imgArray.length - 1" @click="nextImg"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'jjstep3',
  props: {
  },
  data() {
    return {
      npForm: {
        deviceType: "",
        desc: "",
      },
      nprules: {
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入文件描述', trigger: 'change' }
        ],
      },
      qxForm: {
        handleLevel: "",
        faultDescribe: "",
        faultDimensions: "",
        handleDescribe: "",
        handleResult: "",
      },
      qxrules: {
        handleLevel: [
          { required: true, message: '请选择缺陷处理等级', trigger: 'change' }
        ],
        faultDimensions: [
          { required: true, message: '请选择隐患严重程度', trigger: 'change' }
        ],
        faultDescribe: [
          { required: true, message: '请输入描述', trigger: 'change' }
        ],
      },
      qxEditForm: {},
      qxEditFormBak: {},
      qxEditrules: {
        handleLevel: [
          { required: true, message: '请选择缺陷处理等级', trigger: 'change' }
        ],
        faultDimensions: [
          { required: true, message: '请选择隐患严重程度', trigger: 'change' }
        ],
        faultDescribe: [
          { required: true, message: '请输入描述', trigger: 'change' }
        ],
      },
      uploadBtnStatus: false, //是否可以提交
      qxoryx: 1, //1.缺陷 2.隐患
      editFlag: 1, //记录编辑状态 1、详情，2、编辑
      flistParams: {}, //缺陷列表查询参数
      faultList: [], //缺陷列表
      ftotal: 0, //缺陷列表总条数
      nameplateList: [], //铭牌照片列表
      ntotal: 0, //铭牌照片总条数
      upImageList: [],//已上传的图片列表
      upImgPreview: "", //上传图片base64，用于上传中预览
      imgsPreview: {
        nowIndex: 0,
        imgArray: []
      },//图片预览列表
      npDeleteImgs: [],//铭牌选中要删除的图片
      fileUploadHeaders: {},//图片上传请求头
      uploadAction: "",//图片上传接口地址
      fileUploadData: {}, //上传图片附带数据
      deviceList: [], //设备列表
      editLoading: false, //编辑弹窗loading
      flistloading: false, //缺陷列表查询loading
      maxImgCount: 0, //缺陷&隐患每行最多显示的图片张数
    }
  },
  components: {
  },
  computed: {
    editdescLen: function(){
      return this.qxEditForm.handleDescribe.length;
    },
    editresultLen: function(){
      return this.qxEditForm.handleResult.length;
    },
    descLen: function(){
      return this.qxForm.handleDescribe.length;
    },
    resultLen: function(){
      return this.qxForm.handleResult.length;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function(){
      var token = this.$cookie.get('token');
      if(token){
        this.fileUploadHeaders = {token: token};
        this.uploadAction = this.$http.adornUrl("stationhandover/enterSence/upload");
      }
      if(!this.$route.query.powerStationId){
        return false;
      }
      this.flistParams = {page: "1",limit: 10,powerStationId: this.$route.query.powerStationId};
      this.getFaultList();
      this.getNameplateList();
      this.getDeviceType();
      var _this = this;
      window.onresize = function(){
        _this.initQxStyle();
      }
    },
    //初始化缺陷&隐患列表样式
    initQxStyle: function(){
      var _this = this;
      try {
        //图片超过一行样式
        _this.maxImgCount = parseInt((document.querySelector(".danger .inner").clientWidth - 57) / 63);
      } catch (error) { }
      try {
        //文字超过两行样式
        setTimeout(function(){
          document.querySelectorAll(".n-need-h").forEach(function(item){
            var textHeight = item.lastElementChild.clientHeight;
            if(textHeight > 52){
              item.firstElementChild.style.display = "block";
              item.lastElementChild.lastElementChild.style.display = "inline";
            }else{
              item.firstElementChild.style.display = "none";
              item.lastElementChild.lastElementChild.style.display = "none";
            }
          })
        },200);
      } catch (error) { }
    },
    showAllName: function(event){
      var $item = event.currentTarget;
      var parentNode = $item.parentNode;
      $item.style.display = "none";
      $item.nextElementSibling.style = "block";
      parentNode.style.maxHeight = "";
    },
    hideAllName: function(event){
      var $item = event.currentTarget;
      var parentNode = $item.parentNode;
      $item.style.display = "none";
      $item.previousElementSibling.style = "block";
      parentNode.style.maxHeight = "52px";
    },
    //分页
    handleCurrentChange: function(val){
      this.flistParams.page = parseInt(val);
      this.getFaultList();
    },
    shownpImageListDetail: function(event){
      this.showImageListDetail(event, true);
    },
    //上传过程中预览
    showUpImgPreview: function(event){
      var allImgs = [];
      for(var i = 0; i < this.upImageList.length; i ++){
        allImgs.push(this.upImageList[i].imageUrl);
      }
      var currentImg = event.currentTarget.getAttribute("imgUrl");
      this.showImageBody(allImgs,currentImg);
    },
    //图片预览
    showImageListDetail: function(event, npflag){
      var allImgs = JSON.parse(event.currentTarget.getAttribute("allImgs"));
      var currentImg = event.currentTarget.getAttribute("src");
      this.showImageBody(allImgs,currentImg,npflag);
    },
    showImageBody: function(allImgs,currentImg,npflag){
      if(!currentImg){
        currentImg = allImgs[0];
      }
      var tempImgs = {
        nowIndex: 0,
        imgArray:[]
      };
      var hasFlag = false;
      if(npflag){
        for(var i = 0; i < allImgs.length; i ++){
          var active = false;
          if(allImgs[i].nameplateImgUrl == currentImg && !hasFlag){
            hasFlag = true;
            active = true;
            tempImgs.nowIndex = i;
          }
          tempImgs.imgArray.push({
            active: active,
            url: allImgs[i].nameplateImgUrl
          })
        }
      }else{
        for(var i = 0; i < allImgs.length; i ++){
          var active = false;
          if(allImgs[i] == currentImg && !hasFlag){
            hasFlag = true;
            active = true;
            tempImgs.nowIndex = i;
          }
          tempImgs.imgArray.push({
            active: active,
            url: allImgs[i]
          })
        }
      }
      this.imgsPreview = tempImgs;
      document.querySelector(".imgs-preview").classList.add("show");
    },
    prevImg: function(){
      for(var i = 0; i < this.imgsPreview.imgArray.length; i ++){
        if(this.imgsPreview.imgArray[i].active && i > 0){
          this.imgsPreview.imgArray[i-1].active = true;
          this.imgsPreview.imgArray[i].active = false;
          this.imgsPreview.nowIndex = i - 1;
          break;
        }
      }
    },
    nextImg: function(){
      for(var i = 0; i < this.imgsPreview.imgArray.length; i ++){
        if(this.imgsPreview.imgArray[i].active && i < this.imgsPreview.imgArray.length - 1){
          this.imgsPreview.imgArray[i+1].active = true;
          this.imgsPreview.imgArray[i].active = false;
          this.imgsPreview.nowIndex = i + 1;
          break;
        }
      }
    },
    //隐藏图片预览
    hideImgsPreview: function(){
      this.imgsPreview = {
        nowIndex: 0,
        imgArray: []
      };
      document.querySelector(".imgs-preview").classList.remove("show");
    },
    //获取缺陷/隐患列表
    getFaultList: function(){
      var _this = this;
      var params = {
        page: this.flistParams.page + "",
        limit: this.flistParams.limit + "",
        powerStationId: this.flistParams.powerStationId
      }
      _this.flistloading = true;
      this.$http.post(this.$http.adornUrl("stationhandover/enterSence/faultList"),params).then(function(res){
        var result = res.data;
        _this.flistloading = false;
        if(result.code == 0){
          _this.ftotal = result.data.totalCount;
          for(var i = 0; i < result.data.list.length; i ++){
            result.data.list[i].imageUrls = result.data.list[i].imageUrls ? result.data.list[i].imageUrls.split(",") : [];
          }
          _this.faultList = result.data.list;
          _this.initQxStyle();
        }else{
        }
      },function(){
        _this.flistloading = false;
      });
    },
    //查询设备铭牌图片
    getNameplateList: function(){
      var _this = this;
      this.$http.post(this.$http.adornUrl("stationhandover/enterSence/nameplateList"),{powerStationId: this.flistParams.powerStationId}).then(function(res){
        var result = res.data;
        if(result.code == 0){
          _this.ntotal = result.data.totalCount;
          _this.nameplateList = result.data.list;
          _this.$emit("checkParamsEvent",{keyname: 'mingCardPhoto', isok: _this.nameplateList.length});
        }else{
        }
      },function(){
      });
    },
    //查询设备类型
    getDeviceType: function(){
      var _this = this;
      this.$http.post(this.$http.adornUrl("stationhandover/enterSence/deviceTypeInfo")).then(function(res){
        var result = res.data;
        if(result.code == 0){
          _this.deviceList = result.list;
        }else{
          _this.$message.error('设备类型查询失败');
        }
      },function(){
        _this.$message.error('设备类型查询失败');
      });
    },
    //获取隐患/缺陷详情
    getQxDetail: function(id){
      var _this = this;
      _this.editLoading = true;
      this.$http.post(this.$http.adornUrl("stationhandover/enterSence/faultInfo/" + id)).then(function(res){
        var result = res.data;
        _this.editLoading = false;
        if(result.code == 0){
          var handleLvlName = ["立即处理","当天处理","三日处理","择日处理"];
          var faultDimName = ["严重","一般","轻微"];
          if(result.list.faultDimensions != null){
            result.list.faultDName = faultDimName[result.list.faultDimensions];
            result.list.faultDimensions += "";
          }
          if(result.list.handleLevel != null){
            result.list.handleName = handleLvlName[result.list.handleLevel];
            result.list.handleLevel += "";
          }
          var imgList = result.list.imageUrls ? result.list.imageUrls.split(",") : [];
          _this.upImageList = [];
          for(var i = 0; i < imgList.length; i ++){
            _this.upImageList.push({
              imageUrl: imgList[i]
            });
          }
          _this.qxEditForm = result.list;
          _this.qxEditFormBak = JSON.parse(JSON.stringify(result.list));
        }else{
        }
      },function(){
        _this.editLoading = false;
      });
    },
    vdSubmitComplete: function(){
      if(this.fileUploadData.type == 1){
        //铭牌
        if(this.upImageList.length > 0 && this.npForm.deviceType){
          this.uploadBtnStatus = true;
        }else{
          this.uploadBtnStatus = false;
        }
      }else if(this.fileUploadData.type == 0 && this.qxoryx == 1){
        //缺陷
        if(this.editFlag == 2){
          if(this.qxEditForm.faultDescribe && this.qxEditForm.handleLevel){
            this.uploadBtnStatus = true;
          }else{
            this.uploadBtnStatus = false;
          }
        }else{
          if(this.qxForm.faultDescribe && this.qxForm.handleLevel){
            this.uploadBtnStatus = true;
          }else{
            this.uploadBtnStatus = false;
          }
        }
      }else if(this.fileUploadData.type == 0 && this.qxoryx == 2){
        //隐患
        if(this.editFlag == 2){
          if(this.qxEditForm.faultDescribe && this.qxEditForm.faultDimensions){
            this.uploadBtnStatus = true;
          }else{
            this.uploadBtnStatus = false;
          }
        }else{
          if(this.qxForm.faultDescribe && this.qxForm.faultDimensions){
            this.uploadBtnStatus = true;
          }else{
            this.uploadBtnStatus = false;
          }
        }
      }
    },
    showUploadnp: function(){
      this.fileUploadData = {
        type: 1
      }
      document.querySelector(".up-cover.up-np").classList.add("show");
    },
    hideUploadnp: function(){
      this.upImageList = [];
      this.$refs['npForm'].resetFields();
      document.querySelector(".up-cover.up-np").classList.remove("show");
    },
    showUploadqx: function(event){
      this.fileUploadData = {
        type: 0
      }
      if(event.currentTarget.getAttribute('type') == "1"){
        this.qxoryx = 1;
      }else{
        this.qxoryx = 2;
      }
      document.querySelector(".up-cover.up-qx").classList.add("show");
    },
    hideUploadqx: function(){
      this.upImageList = [];
      this.$refs['qxForm'].resetFields();
      document.querySelector(".up-cover.up-qx").classList.remove("show");
      this.vdSubmitComplete();
    },
    showEditqx: function(event){
      var fId = event.currentTarget.getAttribute("fId");
      this.fileUploadData = {
        type: 0
      }
      if(event.currentTarget.firstElementChild.getAttribute('type') == "1"){
        this.qxoryx = 1;
      }else{
        this.qxoryx = 2;
      }
      this.editFlag = 1;
      this.qxEditForm = {};
      this.getQxDetail(fId);
      document.querySelector(".up-cover.edit-qx").classList.add("show");
    },
    hideEditqx: function(){
      this.upImageList = [];
      this.$refs['qxEditForm'].resetFields();
      document.querySelector(".up-cover.edit-qx").classList.remove("show");
      this.vdSubmitComplete();
    },
    //文件上传前
    beforeAvatarUpload(file) {
      var _this = this;
      var reader = new FileReader();
      if(reader){
        reader.readAsDataURL(file);
        reader.onload=function(e){
          _this.upImgPreview = e.target.result
        }
      }else{
        //浏览器不支持预览
      }
      return true;
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      this.upImgPreview = "";
      this.upImageList.push(res);
      this.vdSubmitComplete();
    },
    //上传失败
    handleAvatarError: function(res, file){
      
    },
    //删除图片
    deleteImg: function(event){
      var _this = this;
      var imgUrl = event.currentTarget.getAttribute("imgUrl");
      this.$confirm('选择的照片删除后不可恢复，请确认是否删除？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        var params = {
          "imageUrl": imgUrl,
	        "type": this.fileUploadData.type
        }
        this.$http.post(this.$http.adornUrl("stationhandover/enterSence/deleteUploadPhoto"),params).then(function(res){
          if(res.data.code == 0){
            for(var i = 0; i < _this.upImageList.length; i ++){
              if(_this.upImageList[i].imageUrl == imgUrl){
                _this.upImageList.splice(i,1);
                break;
              }
            }
            _this.vdSubmitComplete();
            _this.$message.success('删除成功');
          }else{
            _this.$message.error(res.data.message);
          }
        },function(){
          _this.$message.error('删除失败');
        });
      }).catch(() => {      
      });
    },
    //选中要删除的铭牌图片
    choosenpImg: function(event){
      var parentNode = event.currentTarget.parentNode;
      var npImgId = parentNode.getAttribute("npImgId");
      if(parentNode.className.indexOf("checked") > -1){
        parentNode.classList.remove("checked");
        for(var i = 0; i < this.npDeleteImgs.length; i ++){
          if(this.npDeleteImgs[i] == npImgId){
            this.npDeleteImgs.splice(i,1);
            break;
          }
        }
      }else{
        this.npDeleteImgs.push(npImgId);
        parentNode.classList.add("checked");
      }
    },
    //删除铭牌图片
    deleteNpChecked: function(){
      var _this = this;
      this.$confirm('您是否确认删除所选' + this.npDeleteImgs.length + '张铭牌照片', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        var npIds = "";
        var params = {
          ids: _this.npDeleteImgs
        }
        _this.$http.post(_this.$http.adornUrl("stationhandover/enterSence/nameplateDelete"),params).then(function(res){
          if(res.data.code == 0){
            _this.getNameplateList();
            _this.$message.success('删除成功');
            _this.npDeleteImgs = [];
            document.querySelectorAll(".np-image-item.checked").forEach(function(item){
              item.classList.remove("checked");
            })
          }else{
            _this.$message.error(res.data.message);
          }
        },function(){
          _this.$message.error('删除失败');
        });
      }).catch(() => {  
        _this.npDeleteImgs = [];
        document.querySelectorAll(".np-image-item.checked").forEach(function(item){
          item.classList.remove("checked");
        })  
      });
    },
    //提交铭牌照片
    submitnpForm: function(){
      var _this = this;
      this.$refs['npForm'].validate((valid) => {
        if (valid) {
          if(this.upImageList.length <= 0){
            _this.$message.error('请先上传图片');
            return false;
          }
          var params = {
            deviceTypeId: this.npForm.deviceType,
            nameplateImgUrl: "",
            powerStationId: this.flistParams.powerStationId
          }
          for(var i = 0; i < this.upImageList.length; i ++){
            if(i == 0){
              params.nameplateImgUrl = this.upImageList[i].imageUrl;
            }else{
              params.nameplateImgUrl += ("," + this.upImageList[i].imageUrl);
            }
          }
          this.$http.post(this.$http.adornUrl("stationhandover/enterSence/nameplateUpload"),params).then(function(res){
            if(res.data.code == 0){
              _this.upImageList = [];
              _this.hideUploadnp();
              _this.getNameplateList();
              _this.$message.success('提交成功');
            }else{
              _this.$message.error(res.data.message);
            }
          },function(){
          });
        } else {
          return false;
        }
      });
    },
    //提交缺陷隐患
    submitqxForm: function(){
      var _this = this;
      this.$refs['qxForm'].validate((valid) => {
        if (valid) {
          // if(this.upImageList.length <= 0){
          //   _this.$message.error('请先上传图片');
          //   return false;
          // }
          var params = {
            faultDescribe: this.qxForm.faultDescribe,
            imageUrls: "",
            handleDescribe: this.qxForm.handleDescribe,
            handleResult: this.qxForm.handleResult,
            faultType: "",
            powerStationId: this.flistParams.powerStationId
          }
          if(this.qxoryx == 1){
            params.faultType = "0";
            params.handleLevel = parseInt(this.qxForm.handleLevel);
          }else{
            params.faultType = "1";
            params.faultDimensions = parseInt(this.qxForm.faultDimensions);
          }
          for(var i = 0; i < this.upImageList.length; i ++){
            if(i == 0){
              params.imageUrls = this.upImageList[i].imageUrl;
            }else{
              params.imageUrls += ("," + this.upImageList[i].imageUrl);
            }
          }
          this.$http.post(this.$http.adornUrl("stationhandover/enterSence/faultSave"),params).then(function(res){
            if(res.data.code == 0){
              _this.upImageList = [];
              _this.hideUploadqx();
              _this.getFaultList();
              _this.$message.success('提交成功');
            }else{
              _this.$message.error(res.data.message);
            }
          },function(){
          });
        } else {
          return false;
        }
      });
    },
    //删除缺陷/隐患
    deleteQx: function(event){
      var qxId = event.currentTarget.getAttribute("qxId");
      var faultType = event.currentTarget.getAttribute("faultType");
      if(qxId){
        var msg = "";
        var _this = this;
        if(faultType == "0"){
          msg = '此操作将永久删除该条缺陷，是否继续?';
        }else{
          msg = '此操作将永久删除该条隐患，是否继续?';
        }
        this.$confirm(msg, '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$http.post(this.$http.adornUrl("stationhandover/enterSence/faultDelete/" + qxId)).then(function(res){
            if(res.data.code == 0){
              _this.upImageList = [];
              _this.hideEditqx();
              _this.flistParams.page = "1";
              _this.getFaultList();
              _this.$message.success('删除成功');
            }else{
              _this.$message.error(res.data.message);
            }
          },function(){
            _this.$message.error('删除失败');
          });
        }).catch(() => {      
        });
      }
    },
    toDetailqx: function(){
      this.qxEditForm = JSON.parse(JSON.stringify(this.qxEditFormBak));
      this.editFlag = 1;
    },
    toEditqx: function(){
      this.editFlag = 2;
      this.vdSubmitComplete();
    },
    submitqxEditForm: function(){
      var _this = this;
      this.$refs['qxEditForm'].validate((valid) => {
        if (valid) {
          // if(this.upImageList.length <= 0){
          //   _this.$message.error('请先上传图片');
          //   return false;
          // }
          var params = {
            id: this.qxEditForm.id,
            faultDescribe: this.qxEditForm.faultDescribe,
            imageUrls: "",
            handleDescribe: this.qxEditForm.handleDescribe,
            handleResult: this.qxEditForm.handleResult,
            powerStationId: this.flistParams.powerStationId
          }
          if(this.qxoryx == 1){
            params.handleLevel = parseInt(this.qxEditForm.handleLevel);
          }else{
            params.faultDimensions = parseInt(this.qxEditForm.faultDimensions);
          }
          for(var i = 0; i < this.upImageList.length; i ++){
            if(i == 0){
              params.imageUrls = this.upImageList[i].imageUrl;
            }else{
              params.imageUrls += ("," + this.upImageList[i].imageUrl);
            }
          }
          _this.editLoading = true;
          this.$http.post(this.$http.adornUrl("stationhandover/enterSence/faultUpdate"),params).then(function(res){
            if(res.data.code == 0){
              _this.upImageList = [];
              _this.hideEditqx();
              _this.getFaultList();
              _this.$message.success('提交成功');
            }else{
              _this.$message.error(res.data.message);
            }
            _this.editLoading = false;
          },function(){
            _this.editLoading = false;
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss">
@import '../../../../assets/scss/stationHandOver/public.scss';
@import '../../../../assets/scss/stationHandOver/stepNo3.scss';
</style>

