export default {
	login: function(context, data) {
		let _data = {};
		if (process.env.NODE_ENV === "development") {
			_data = {
				username: data.username,
				password: data.password,
				client_id: '0b07c638595d88754264a7d26cb4797f09dec8db6ec6a513f8d434ad093b8d53',
				client_secret: '66f108205c75d4197bb8a67f5e5ea232c6031d194e11e37ef1ad6e02cbb76b71',
				grant_type: 'password',
				scope: 'ALL:ACCESS'
			}
		} else {
			_data = {
				username: data.username,
				password: data.password,
				client_id: 'c4363f1d3d9503f16acffc9e1fa75ee14fb8bca7946941322fa65abbcc4ba638',
				client_secret: '9bcc74234520c1f6ccfd4c2c720531ec1c673ab359e56edeb054a9c0a508fa8b',
				grant_type: 'password',
				scope: 'ALL:ACCESS'
			}
		}

		context.commit('token_set', null);
		return zfhq_api.post('oauth/token', _data)
			.then(function(res) {
				let data = { token: res.data.access_token, locationId: ""}
				return context.dispatch('tokenLogin', data);
			})
			.catch(function(err) {
				console.log(err);
				context.commit('token_set', new Error('login failed'));
			});
	},

	tokenLogin: function(context, data) {
		const { token, locationId } = data;
		context.commit('update_access_token', token);
		const _data = {
			filters: {
				is_visible: true
			}
		};
		return Promise.all([
			zfhq_api.get('api/v5/account/info'),
			zfhq_api.get('api/v5/account'),
			
			locationId ? zfhq_api.get(`/api/v5/locations/${locationId}`) : zfhq_api.get('/api/v5/locations', _data)
		])
		.then(([ user, account, locations ]) => {
			context.commit('setCurrentUser', user.data);
			context.commit('setAccount', account.data);
			if(locationId){
				// console.log("set current location when locationId is set",locations.data);
				context.commit('setCurrentLocation', locations.data);
            }else{
                // Automatically go to last location after login
                const previousLocation = JSON.parse(window.localStorage.getItem('currentLocation')) || {};
                const matches = locations.data.filter(l => l.id == previousLocation.id);
                const loc = matches[0] || locations.data[0];

				// console.log("set current location when locationId is NOT set",locations.data[0]);
				context.commit('setCurrentLocation', loc);
			}

		})
		.catch((err) => {
			console.log("err", err);
			context.commit('update_access_token', null);
		});
	},

	logout: function({commit, dispatch}, data) {
		commit('token_set', null);
		commit('update_access_token', null);
		//return zfhq_api.post('oauth/revoke', '');
	},

	updateCurrentUser({ commit }, data) {
		commit('setCurrentUser', data);
	},
	updateCurrentLocation({ commit }, data){
		commit('setCurrentLocation', data);
	},
	'pusher/pusher:subscription_succeeded': {
		root: true,
		handler({ commit }, data) {
			// console.log('Pusher is succeeeded');
		}
	}
}
