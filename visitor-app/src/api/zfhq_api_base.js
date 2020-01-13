import axios from 'axios'
import qs from 'qs'
import deserializeJsonApi from './json-api';
import router from '@/router';

let api_endpoint = "https://api.zapfloorhq.com"
if (process.env.NODE_ENV === "development") {
	api_endpoint = "http://localhost:3000"
}else if(process.env.NODE_ENV === "staging"){
	api_endpoint = "https://sandbox-api.zapfloorhq.com"
}

const api = axios.create({
	baseURL: api_endpoint,
	timeout: 30000
})

const getHeader = function() {
	let token = JSON.parse(window.localStorage.getItem('token'))
	if (token) {
		const access_token = token.access_token
		return {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	} else {
		return {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
}

const getMultipartHeader = function(){
	let headers = getHeader();
	headers['Content-Type'] = 'multipart/form-data'
	return headers
}

const handleResults = function(resolve, res){
	if(res.headers['content-type'] == undefined) {
		resolve(res);
	} else if (res.headers['content-type'].includes('application/vnd.api+json')){
		if(res.status == 500) {
			resolve(res);
			return;
		}
		if(res.data == null) {
			resolve(res);
			return;
		}
		let meta = undefined
		let links = undefined
		// console.log("handleResults", res.data)
		if (res.data.meta !== undefined){
			meta = res.data.meta
		}
		if (res.data.links !== undefined){
			links = res.data.links
		}
		let result = {
			data: deserializeJsonApi(res.data)
		}
		if(meta !== undefined) {
			result['meta'] = meta
		}
		if(links !== undefined) {
			result['links'] = links
		}
		resolve(result)

	} else{
		resolve(res)
	}
}

const handleErrors = function(reject, error){
	const res = error.response
	if(!res){
		reject('network error')
		router.push({
			name: 'Login'
		})
		return
	}
	switch (res.status) {
		case 403:
			router.push({
				name: 'Dashboard'
			})
			break;
		default:
			break;
	}
	if(res.headers['content-type'].includes('application/vnd.api+json')){
		reject({data: deserializeJsonApi(res.data)})
	} else {
		reject(res)
	}
}

export default {
	client: api,

	getUri(url, query = {}, config = {}) {
		const uri = api.getUri({
			url,
			params: query,
			...config
		});

		return api_endpoint.replace(/\/*$/, '') + uri;
	},
	get(url, params){
		if (params){
			url += '?' + qs.stringify(params)
		}
		return new Promise(function(resolve, reject) {
			api.get(url, { headers: getHeader() } )
			.then(function(res) {
				handleResults(resolve, res)
			})
			.catch(function(err) {
				reject(err)
				handleErrors(reject, err)
			})
		})
	},
	delete(url, params){
		if (params){
			url += '?' + qs.stringify(params)
		}
		return new Promise(function(resolve, reject) {
			api.delete(url, { headers: getHeader() } )
			.then(function(res) {
				handleResults(resolve, res)
			})
			.catch(function(err) {
				reject(err)
				handleErrors(reject, err)
			})
		})
	},
	post(url, params){
		return new Promise(function(resolve, reject) {
			api.post(url, params, { headers: getHeader() } )
			.then(function(res) {
				handleResults(resolve, res)
			})
			.catch(function(err) {
				reject(err)
				handleErrors(reject, err)
			})
		})
	},
	put(url, params){
		return new Promise(function(resolve, reject) {
			api.put(url, params, { headers: getHeader() } )
			.then(function(res) {
				handleResults(resolve, res)
			})
			.catch(function(err) {
				reject(err)
				handleErrors(reject, err)
			})
		})
	},
	patch(url, params){
		return new Promise(function(resolve, reject) {
			api.patch(url, params, { headers: getHeader() } )
			.then(function(res) {
				handleResults(resolve, res)
			})
			.catch(function(err) {
				reject(err)
				handleErrors(reject, err)
			})
		})
	},
	upload(url, params){
		return new Promise(function(resolve, reject) {
			api.post(url, params, { headers: getMultipartHeader() } )
			.then(function(res) {
				resolve(res)
			})
			.catch(function(err) {
				reject(err)
				handleErrors(reject, err)
			})
		})
	}

}
