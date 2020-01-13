import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const store = {
	namespaced: true,
	state,
	mutations,
	getters,
	actions
}

export default store
