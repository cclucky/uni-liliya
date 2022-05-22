<template>
	<view class="my-container">
		<view class="login-container" v-if="!token">
		    <!-- 提示登录的图标 -->
		    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		    <!-- 登录按钮 -->
		    <button type="primary" class="btn-login" @tap="getUserInfo">一键登录</button>
		    <!-- 登录提示 -->
		    <view class="tips-text">登录后尽享更多权益</view>
			</view>
			<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import { mapState ,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
		},
		computed:{
			...mapState('m_user',['token','redirectInfo'])
		},
		methods: {
			...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
			getUserInfo(e){
				uni.getUserProfile({
					desc:"获取你的昵称，头像，地址",
					success: (res) => {
						this.updateUserInfo(res.userInfo);
						this.getToken(res)
					},
					fail(){
						return uni.$showMsg('您取消了登录授权！')
					}
				})
			},
			async getToken(info){
				const [err, res] = await uni.login().catch(err => err)
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				  const query = {
				    code: res.code,
				    encryptedData: info.encryptedData,
				    iv: info.iv,
				    rawData: info.rawData,
				    signature: info.signature
				  }
				  const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				  //接口坏了，随便写个token吧
				  if (loginResult.meta.status == 200) return uni.$showMsg('登录失败！')
				  uni.$showMsg('登录成功')
				  this.updateToken('123')
				  this.navigateBack()
			},
			navigateBack(){
				// redirectInfo 不为 null，并且导航方式为 switchTab
				  if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
				    // 调用小程序提供的 uni.switchTab() API 进行页面的导航
				    uni.switchTab({
				      // 要导航到的页面地址
				      url: this.redirectInfo.from,
				      // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
				      complete: () => {
				        this.updateRedirectInfo(null)
				      }
				    })
				  }
			}
		}
	}
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
page,
.my-container {
  height: 100%;
}
</style>
