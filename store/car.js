export default {
	namespaced: true,
	
	state:()=>({
		cart:JSON.parse(uni.getStorageSync('cart') || '[]'),
	}),
	
	mutations:{
		addToCart(state, goods){
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			
			      if (!findResult) {
			        // 如果购物车中没有这件商品，则直接 push
			        state.cart.push(goods)
			      } else {
			        // 如果购物车中有这件商品，则只更新数量即可
			        findResult.goods_count++
			      }
				  this.commit('m_cart/saveToStorage')
		},
		updateGoodsState(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(findResult){
				findResult.goods_state = goods.goods_state
			}
			this.commit('m_cart/saveToStorage')
		},
		updateGoodsCount(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(findResult){
				findResult.goods_count = goods.goods_count
			}
			this.commit('m_cart/saveToStorage')
		},
		removeGoodsById(state,goods){
			state.cart = state.cart.filter(item=>item.goods_id!=goods.goods_id)
			this.commit('m_cart/saveToStorage')
		},
		updateAllGoodsState(state,newVal){
			state.cart.forEach(item=>item.goods_state=newVal)
			this.commit('m_cart/saveToStorage')
		}
		,
		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
		   uni.setStorageSync('cart', JSON.stringify(state.cart))
		}
	},
	
	getters:{
		total(state){
			// let c=0;
			// state.cart.forEach(item=>c+=item.goods_count);
			// return c
			return state.cart.reduce((total,item)=>total+=item.goods_count,0)
		},
		checkedCount(state) {
		  // 先使用 filter 方法，从购物车中过滤器已勾选的商品
		  // 再使用 reduce 方法，将已勾选的商品总数量进行累加
		  // reduce() 的返回值就是已勾选的商品的总数量
		  return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 已勾选的商品的总价
		checkedGoodsAmount(state) {
		  // 先使用 filter 方法，从购物车中过滤器已勾选的商品
		  // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
		  // reduce() 的返回值就是已勾选的商品的总价
		  // 最后调用 toFixed(2) 方法，保留两位小数
		  return state.cart.filter(x => x.goods_state)
		                   .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
		                   .toFixed(2)
		}
	}
}