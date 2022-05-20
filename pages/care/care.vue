<template>
	<view>
		<view class="scroll-view-container">
		      <!-- 左侧的滚动视图区域 -->
		      <scroll-view class="left-scroll-view" scroll-y :style="{height:wh + 'px'}">
		        <view :class="['left-scroll-view-item',active===index?'active':'']" v-for="(item,index) in careList" :key="item.cat_id" @click="activeChanged(index)">{{item.cat_name}}</view>
		      </scroll-view>
		      <!-- 右侧的滚动视图区域 -->
		      <scroll-view class="right-scroll-view" scroll-y :style="{height:wh + 'px'}" :scroll-top="scrollTop">
		        <view class="left-scroll-view-item" v-for="(item,index) in cateLevel2" :key="item.cat_id">
					<view class="cate-lv2-title">
						{{item.cat_name}}
					</view>
					 <view class="cate-lv3-list">
					      <!-- 三级分类 Item 项 -->
					      <view class="cate-lv3-item" v-for="(item1, index) in item.children" :key="index" @click="gotoGoodsList(item1)">
					        <!-- 图片 -->
					        <image :src="item1.cat_icon"></image>
					        <!-- 文本 -->
					        <text>{{item1.cat_name}}</text>
					      </view>
					    </view>
				</view>
		      </scroll-view>
		    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wh:0,
				active:0,
				careList:[],
				cateLevel2: [],
				scrollTop: 0
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync();
			this.wh = sysInfo.windowHeight;
			this.getCareList()
		},
		methods: {
			async getCareList(){
				const {data:res} = await uni.$http.get('/api/public/v1/categories');
				if(res.meta.status!=200) return uni.$showMsg()
				this.careList = res.message;
				this.cateLevel2= res.message[0].children;
			},
			activeChanged(index){
				this.active = index;
				this.cateLevel2 = this.careList[index].children;
				this.scrollTop=this.scrollTop?0:1;
			},
			gotoGoodsList(item1){
				uni.navigateTo({
					url:`/subpkg/goods_list/goods_list?cid=${item1.cat_id}`
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
} 
.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 60px;
      height: 60px;
    }

    text {
      font-size: 12px;
    }
  }
}
</style>
