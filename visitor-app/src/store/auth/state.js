export default {
	auth_token: JSON.parse(window.localStorage.getItem('token') || "null" ),
	accountId: JSON.parse(window.localStorage.getItem('accountId') || "null" ),
	account: JSON.parse(window.localStorage.getItem('account') || "null" ),
	currentLocation: null,
	currentUser: {}
}
