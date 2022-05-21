<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title" >
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<view>
			<view class="goods-list">
				<uni-swipe-action>
					<view v-for="item in cart" :key="item.goods_id" @click="gotoDetail(item)">
						<!-- 基础用法 -->
						<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item)">
							<view class="goods-item">
								<!-- 商品左侧图片区域 -->
								<view class="goods-item-left">
									<radio :checked="item.goods_state" color="#C00000"
										@click="changerIsShowCheck(item)"></radio>
									<image :src="item.goods_small_logo||defaultPic" class="goods-pic"></image>
								</view>
								<!-- 商品右侧信息区域 -->
								<view class="goods-item-right">
									<!-- 商品标题 -->
									<view class="goods-name">{{item.goods_name}}</view>
									<view class="goods-info-box">
										<!-- 商品价格 -->
										<view class="goods-price">￥{{item.goods_price}}</view>
										<!-- 商品数量 -->
										<uni-number-box :min="1" v-model="item.goods_count"
											@click.native="numberChangeHandler(item)"></uni-number-box>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</view>
				</uni-swipe-action>
			</view>
		</view>
		<my-settle></my-settle>
	</view>
      <!-- 空白购物车区域 -->
   <view class="empty-cart" v-else>
    <image src="/static/tab_icons/kkruy.webp" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		mixins: [badgeMix],
		computed: {
			// 将 m_cart 模块中的 cart 数组映射到当前页面中使用
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}]
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount','removeGoodsById']),
			gotoDetail(item) {},
			changerIsShowCheck(item) {
				item.goods_state = !item.goods_state
				this.updateGoodsState(item);
			},
			numberChangeHandler(item) {
				this.updateGoodsCount(item)
			},
			swipeActionClickHandler(e) {
			   this.removeGoodsById(e)
			}
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
		}
	}

	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}
	.cart-container {
	  padding-bottom: 60px;
	}
	.empty-cart {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding-top: 150px;
	
	  .empty-img {
	    width: 90px;
	    height: 90px;
	  }
	
	  .tip-text {
	    font-size: 12px;
	    color: gray;
	    margin-top: 15px;
	  }
	}
</style>
