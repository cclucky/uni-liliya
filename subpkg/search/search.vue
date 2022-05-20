<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none" focus></uni-search-bar>
		</view>
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="item.goods_id" @click="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<view class="history-box" v-else>
		  <!-- 标题区域 -->
		  <view class="history-title">
		    <text>搜索历史</text>
		    <uni-icons type="trash" size="17" @click="clean"></uni-icons>
		  </view>
		  <!-- 列表区域 -->
		  <view class="history-list" >
		    <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				searchResults: [],
				historyList: []
			};
		},
		onLoad() {
			this.historyList=JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		computed: {
		  historys() {
		    // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
		    // 而是应该新建一个内存无关的数组，再进行 reverse 反转
		    return [...this.historyList].reverse()
		  }
		},
		methods: {
			input(e) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.kw = e.trim();
					this.getSearchList();
					this.saveSearchHistory()
				}, 1000)
			},
			async getSearchList() {
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				});
				if (res.meta.status != 200) return uni.$showMsg();
				this.searchResults = res.message;
			},
			gotoDetail(item){
				uni.navigateTo({
					url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
				})
			},
			clean(){
				this.kw='';
				this.historyList=[],
				uni.setStorageSync('kw', '[]')
			},
			saveSearchHistory(){
				// this.historyList.push(this.kw)
				const set = new Set(this.historyList);
				set.delete(this.kw);
				set.add(this.kw);
				this.historyList = [...set];
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
			},
			gotoGoodsList(kw){
				uni.navigateTo({
				  url:`/subpkg/goods_list/goods_list?query=${kw}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		background-color: #00aaff;
	}
	.sugg-list {
	  padding: 0 5px;
	
	  .sugg-item {
	    font-size: 12px;
	    padding: 13px 0;
	    border-bottom: 1px solid #efefef;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	
	    .goods-name {
	      // 文字不允许换行（单行文本）
	      white-space: nowrap;
	      // 溢出部分隐藏
	      overflow: hidden;
	      // 文本溢出后，使用 ... 代替
	      text-overflow: ellipsis;
	      margin-right: 3px;
	    }
	  }
	}
	.history-box {
	  padding: 0 5px;
	
	  .history-title {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    height: 40px;
	    font-size: 13px;
	    border-bottom: 1px solid #efefef;
	  }
	
	  .history-list {
	    display: flex;
	    flex-wrap: wrap;
	
	    .uni-tag {
	      margin-top: 5px;
	      margin-right: 5px;
	    }
	  }
	}
</style>
