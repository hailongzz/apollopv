<template>
  <div class="pageTemplate">
		<div class="pageTemplate-header">
				<div class="pageTemplate-header__top">
					<div>
						<slot name='hTitle'></slot>
						<slot name='elTag'></slot>
					</div>
					<div class="pageTemplate-header__top_buttons">
						<slot name='elButton'></slot>
					</div>
				</div>
				<slot name='elTabs'></slot>
			</div>
		<div class="pageTemplate-content">
			<div >
				<slot name="content"></slot>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
.pageTemplate {
  .pageTemplate-header {
    display: flex;
    flex-direction: column;
    padding: 1px 30px;
    box-sizing: border-box;
    .pageTemplate-header__top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 0;
      & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 20px;
        h1 {
          margin: 0;
					color: #3E3E47;
          font-size: 20px;
        }
        .el-tag {
          margin: 0 0 0 10px;
        }
      }
      .pageTemplate-header__top_buttons {
        // margin: 10px 0;
      }
    }
    .el-tabs {
      margin-top: -11px;
    }
  }
  .pageTemplate-content {
    // background: #f5f5fa;
    background: #F8F8F8;
    // padding: 18px 30px 20px;
    box-sizing: border-box;
    & > div {
      // padding:10px;
      background: #F8F8F8;
    }
  }
}
</style>
