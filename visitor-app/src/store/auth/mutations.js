import { add, loading, addPage, loadingPage,loadingRange, expirePage, options ,expireAll , remove, addRange} from '@jorgenevens/rest-store';
import { apply, getRange, getPage, getResource } from '@jorgenevens/rest-store/vuex'

export default {
	update_access_token(state, token){
		state.auth_token = {
			access_token: token,
			token_type: "bearer"
		}
		if (window.localStorage) {
			window.localStorage.setItem('token', JSON.stringify(state.auth_token));
		}
	},
	token_set(state, token) {
		state.auth_token = token
		if (window.localStorage) {
			window.localStorage.setItem('token', JSON.stringify(token));
		}
	},
	setCurrentUser(state, value) {
		state.currentUser = value;
		window.localStorage.setItem('currentUser', JSON.stringify(value));
	},
    setCurrentLocation(state, value) {
		state.currentLocation = value;
		window.localStorage.setItem('currentLocation', JSON.stringify(value));
	},
	setAccount(state, account) {
		state.account = account;
		state.accountId = account.id;
	},

	addAccount(state, {item, listName}) {
		apply(add, state, item.id, item);
		apply(expireAll, state, listName);
	},
}
