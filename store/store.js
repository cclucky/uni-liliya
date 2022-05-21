import Vue from "vue"
import Vuex from "vuex"
import moduleCar from "./car.js"
import moduleUser from "./user.js"

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		m_cart:moduleCar,
		m_user: moduleUser,
	}
})
export default store