import _ from 'lodash';

export default{
	get_token: function(state){
		return _.get(state, 'auth_token.access_token');
	},
	isLoggedIn(state) {
		const token = _.get(state, 'auth_token.access_token');
		const user = _.get(state, 'currentUser');
		const location = _.get(state, 'currentLocation');
		return !!(token && user && location);
	},
	get_account_id: function(state){
		return _.get(state.currentUser, 'friendly_organisation_id');
	},
	login_error: function(state) {
		if (state.auth_token instanceof Error){
			return state.auth_token.message;
		}
		else{
			return null;
		}
	},
	getCurrentUser: function (state) {
		return state.currentUser;
	},
	isOperator(state) {
		const user = state.currentUser;
		return user && [ 'operator', 'operator_admin' ].indexOf(user.role) > -1;
	},
	getCurrentLocation: function (state) {
		return state.currentLocation;
	},
	getCurrentLocationId: function (state) {
		return state.currentLocation && state.currentLocation.id;
	},
	getCurrentLocationCurrency: function (state) {
		return state.currentLocation && state.currentLocation.currency_sign;
	},
	getCurrentAccount: function(state){
		return state.account;
	},
	getCurrentAccountId: function(state){
		return state.accountId;
	}
}
