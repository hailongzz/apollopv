<template>
<div class="news_content">
	<div class="news">
		<div class="news_title">
			<h1>通知</h1>
			<i class="el-icon-close" @click="$router.go(-1)"></i>
		</div>
		<!-- <el-tabs slot="elTabs" v-model="activeName" @tab-click="handleClick">
			<el-tab-pane  name="告警">
				<span slot="label"> 告警（4）</span>
			</el-tab-pane>
			<el-tab-pane  name="通知">
				<span slot="label">通知（12）</span>
			</el-tab-pane>
		</el-tabs> -->
		<ul>
			<li v-for="(item, index) in tableData" :key="index">
				<i class="el-icon-alarm"></i>
				<div>
					<span>{{item.alarmContent }}</span>
					<span>{{item.powerStationName}}  {{item.startTime}}</span>
				</div>
			</li>
		</ul>
		</div>
		<el-pagination
		 v-if="tableData.length > 0"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 50, 100, 500]"
			:page-size="pageSize"
			layout="total, prev, pager, next, sizes"
			:total="totalCount">
		</el-pagination>
	</div>
</template>
<script>
export default {
  data () {
    return {
			activeName: '告警',
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			totalCount: 0
    }
	},
	created () {
		this.getDataList()
	},
  methods: {
		handleClick () {},
		getDataList () {
			this.$http({
				url: this.$http.adornUrl('powerStationOperation/gtalarm/infoCenterList'),
				method: 'post',
				data: this.$http.adornData(
					{
						pageSize: this.pageSize,
						page: this.currentPage,
						userId: this.userObj.userId
					}
				)
			}).then(({data}) => {
				if (data && data.code === 0) {
					this.tableData = data.pageUtil.list
					this.totalCount = data.pageUtil.totalCount
				} else {
					this.$message.error(data.message)
				}
			})
		},
		handleSizeChange (val) {
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getDataList()
      }
	},
	computed: {
		userObj: {
			get() {
				return this.$store.state.user.userObj
			}
		}
	}
}
</script>

<style lang="scss">
.news_content {
  padding: 0 100px;
}
.news {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .news_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
		align-items: center;
		h1{
			font-size: 22px;
			margin-top: 41px;
		}
    i {
      font-size: 25px;
      color: #ccc;
    }
  }
  ul {
    padding: 0;
    margin: 20px 0 0;
    li {
      list-style: none;
      padding: 16px 24px;
      display: flex;
      flex-direction: row;
      align-items: space-around;
      border-bottom: 1px solid #f4f6f8;
			i{
				flex-basis: 22px;
			}
      div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
				span{
					line-height: 24px;
				}
        span:last-child {
          color: #aab2c8;
          font-size: 12px;
        }
      }
    }
  }
}
.el-icon-alarm{
    background:url('../../../assets/img/icon_alarm.png');
    background-size: cover;
    height: 22px;
    width: 22px;
    vertical-align: middle;
    margin-right: 11px;
		margin-top: 1px;
  }
</style>
