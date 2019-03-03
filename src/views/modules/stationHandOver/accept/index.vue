<template>
<div class="jj-accept">
    <div class="accept-inner" v-loading="submitLoading" :element-loading-text="loadingText">
        <div class="title">
            <div>请确认以下问题无误</div>
            <p>完成交接验收，电站将正式进入运维阶段</p>
        </div>
        <div class="content">
            <div class="parameter">
                <dl>
                    <dd class="clearfix">
                        <div class="name">项目组成员联系方式正确</div>
                        <div class="val"><span>{{statusInfo.contactOkCount}}</span>个成员</div>
                    </dd>
                    <dt>
                        <template v-if="!statusInfo.contactsIsOk">
                            <i class="btn query" type="1" @click="checkItem">确认完成</i>
                        </template>
                        <template v-else>
                            <img src="../../../../assets/img/right_circle.png"/>
                        </template>
                    </dt>
                </dl>
                <dl>
                    <dd class="clearfix">
                        <div class="name">电站收资文档正确</div>
                        <div class="val"><span>{{statusInfo.fileOkCount}}</span>个文档</div>
                    </dd>
                    <dt>
                        <template v-if="!statusInfo.fileIsOk">
                            <i class="btn query" type="2" @click="checkItem">确认完成</i>
                        </template>
                        <template v-else>
                            <img src="../../../../assets/img/right_circle.png"/>
                        </template>
                    </dt>
                </dl>
                <dl>
                    <dd class="clearfix">
                        <div class="name">设备台账正确</div>
                        <div class="val"><span>{{statusInfo.checkDeviceCount}}</span>个设备</div>
                    </dd>
                    <dt>
                        <template v-if="!statusInfo.checkIsOk">
                            <i class="btn query" type="3" @click="checkItem">确认完成</i>
                        </template>
                        <template v-else>
                            <img src="../../../../assets/img/right_circle.png"/>
                        </template>
                    </dt>
                </dl>
                <dl>
                    <dd class="clearfix">
                        <div class="name">监控数据正确</div>
                        <div class="val">已接入监控<!-- 共 <span>{{statusInfo.monitorHours}}</span>个小时 --></div>
                    </dd>
                    <dt>
                        <template v-if="!statusInfo.monitorIsOk">
                            <i class="btn query" type="4" @click="checkItem">确认完成</i>
                        </template>
                        <template v-else>
                            <img src="../../../../assets/img/right_circle.png"/>
                        </template>
                    </dt>
                </dl>
                <dl>
                    <dd class="clearfix">
                        <div class="name">验收小组确认验收</div>
                        <div class="val">正在验收</div>
                    </dd>
                    <dt>
                        <template v-if="!statusInfo.testgroupIsOk">
                            <i class="btn query" type="5" @click="checkItem">确认完成</i>
                        </template>
                        <template v-else>
                            <img src="../../../../assets/img/right_circle.png"/>
                        </template>
                    </dt>
                </dl>
            </div>
            <div class="upload" v-if="statusInfo.testgroupIsOk">
                <dl>
                    <dd class="clearfix">
                        <div v-if="fileProgress.length <= 0" class="val">请上传验收单签字扫描件</div>
                        <template v-if="fileProgress.length > 0">
                            <div class="upload-file-item" v-for="(file,index) in fileProgress" :key="index">
                                <div class="file-name">{{file.name}}</div>
                                <div class="info">
                                    <template v-if="file.type == 1">
                                        <span>{{file.percent}}%</span><span>（{{file.loaded}}/{{file.total}}）</span>
                                    </template>
                                    <template v-if="file.type == 2">
                                        <a href="javascript:;" @click="reUploadFile" :fileId="file.fileId">删除</a>
                                    </template>
                                    <template v-if="file.type == 3">
                                        <span class="error-msg">上传失败</span>
                                        <a href="javascript:;" @click="reSubmitFile">重新上传</a>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </dd>
                    <dt>
                        <template v-if="fileProgress.length <= 0" class="empty">
                            <el-upload
                                class="avatar-uploader"
                                ref="upload"
                                :action="uploadAction"
                                :data="fileUploadData"
                                :show-file-list="false"
                                :headers="fileUploadHeaders"
                                :on-success="handleAvatarSuccess"
                                :on-error="handleAvatarError"
                                :on-progress="handleAvatarProgress"
                                :before-upload="beforeAvatarUpload">
                                <i class="avatar-uploader-icon btn query">上传</i>
                            </el-upload>
                        </template>
                    </dt>
                </dl>
            </div>
        </div>
        <div class="opts">
            <i class="btn normal" @click="pageBack">取消</i>
            <i class="btn submit" @click="submitQuery" v-if="submitBtnStatus">提交</i>
            <i class="btn submit disabled" v-if="!submitBtnStatus">提交</i>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data () {
        return {
            uploadAction: "", //文件上传接口地址
            fileUploadHeaders: {}, //文件上传请求头
            uploadAction: "", //文件上传接口地址
            fileProgress: [], //上传过程中文件状态
            fileUploadData: {}, //文件上传参数
            statusInfo: {}, //电站交接信息列表
            submitBtnStatus: false,
            submitLoading: false, //提交loading
            loadingText: "", //提交完成后提示
        }
    },
    components: {
    },
    created () {

    },
    mounted() {
        this.init();
    },
    methods: {
        init: function(){
            this.getStatus();
            var token = this.$cookie.get('token');
            if(token){
                this.fileUploadHeaders = {token: token};
                this.uploadAction = this.$http.adornUrl("stationhandover/enterSence/upload");
                this.fileUploadData.type = 2;
            }
        },
        //获取当前验收状态
        getStatus: function(){
            var _this = this;
            var params = {
                powerStationId: this.$route.query.powerStationId
            }
            this.$http.get(this.$http.adornUrl('/stationhandover/handoverInfo'),{params: params}).then(function(res){
                if(res.data.code == 0){
                    _this.statusInfo = res.data.data;
                    _this.fileProgress = [{
                        type: 2,
                        fileId: res.data.data.recieveNoteUrl,
                        name: res.data.data.fileName,
                        percent: 100
                    }]
                    _this.vdSubmitComplete();
                }
            },function(){
            });
            
        },
        fileSizeFormat: function(val){
            if (val === 0) return '0 B';
            var k = 1024,
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(val) / Math.log(k));
            return (val / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        //验证提交数据的完整性
        vdSubmitComplete: function(){
            if(this.fileProgress.length > 0 &&this.statusInfo.contactsIsOk && this.statusInfo.fileIsOk && this.statusInfo.checkIsOk && this.statusInfo.monitorIsOk && this.statusInfo.testgroupIsOk){
                this.submitBtnStatus = true;
            }else{
                this.submitBtnStatus = false;
            }
        },
        //验收某一项
        checkItem: function(event){
            var type = event.currentTarget.getAttribute("type");
            if(type == 1){
                this.statusInfo.contactsIsOk = 1;
            }else if(type == 2){
                this.statusInfo.fileIsOk = 1;
            }else if(type == 3){
                this.statusInfo.checkIsOk = 1;
            }else if(type == 4){
                this.statusInfo.monitorIsOk = 1;
            }else if(type == 5){
                this.statusInfo.testgroupIsOk = 1;
            }
            this.vdSubmitComplete();
        },
        //文件上传前
        beforeAvatarUpload(file) {
            return true;
        },
        //上传过程
        handleAvatarProgress: function(event, file, fileList){
            var loaded = this.fileSizeFormat(event.loaded);
            var total = this.fileSizeFormat(event.total);
            this.fileProgress = [{
                type: 1,
                fileId: '',
                total: total,
                loaded: loaded,
                name: file.name,
                percent: event.percent > 99 ? 99 : event.percent
            }]
        },
        //上传成功
        handleAvatarSuccess(res, file) {
            this.fileProgress[0].type = 2;
            this.fileProgress[0].fileId = res.imageUrl;
            this.fileProgress[0].name = file.name;
            this.fileProgress[0].percent = 100;
            this.vdSubmitComplete();
        },
        //上传失败
        handleAvatarError: function(res, file){
            this.fileProgress[0].type = 3;
        },
        //删除文件
        reUploadFile: function(event){
            var fileId = event.currentTarget.getAttribute("fileId");
            this.fileProgress = [];
            this.vdSubmitComplete();
            if(fileId){
                this.deleteFile(fileId);
            }
        },
        //重新上传
        reSubmitFile: function(event){
            this.reUploadFile(event);
            this.fileProgress = [];
            setTimeout(function(){
                document.querySelector(".el-upload input[type='file']").click();
            },100);
        },
        //删除文件
        deleteFile: function(fileId){
            var params = {
                imageUrl: fileId,
                type: 2
            }
            this.$http.post(this.$http.adornUrl("stationhandover/enterSence/deleteUploadPhoto"),params).then(function(res){
                if(res.data.code == 0){
                }else{
                }
            },function(){
            });
        },
        //提交确认单
        submitQuery: function(){
            var _this = this;
            var params = {
                id: this.statusInfo.stationHandOverId,
                contactsIsOk: this.statusInfo.contactsIsOk,
                fileIsOk: this.statusInfo.fileIsOk,
                checkIsOk: this.statusInfo.checkIsOk,
                monitorIsOk: this.statusInfo.monitorIsOk,
                testgroupIsOk: this.statusInfo.testgroupIsOk
            }
            if(this.fileProgress.length > 0){
                params.signState = 1;
                params.recieveNoteUrl = this.fileProgress[0].fileId;
                params.fileName = this.fileProgress[0].name;
            }
            console.log(params);
            this.submitLoading = true;
            this.$http.post(this.$http.adornUrl("stationhandover/handoverUpdate"),params).then(function(res){
                if(res.data.code == 0){
                    _this.$message.success('提交成功');
                    _this.$router.push('/stationHandOver-index/c');
                }else{
                    _this.submitLoading = false;
                    _this.$message.error(res.data.message);
                }
            },function(){
                _this.submitLoading = false;
                _this.$message.success('提交失败');
            });
        },
        pageBack: function(){
            this.getStatus();
            this.$emit("acceptBackEvent");
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../assets/scss/stationHandOver/public.scss';
    @import '../../../../assets/scss/stationHandOver/accept.scss';
</style>
