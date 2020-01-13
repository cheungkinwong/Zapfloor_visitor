<template>
  <div>
  	login: {{login}}
    <form ref="form" 
    	:model="form" 
    	label-width="120px" 
    	:rules="formRules" 
    	label-position="top">
			<div :label="('user name')" prop="username" class="mg-bt-20">
				<input v-model="form.username"></input>
			</div>

			<div :label="('password')" class="mg-bt-20" prop="pass">
				<input type="password" v-model="form.pass" auto-complete="off"></input>
			</div>

			<div class="mg-bt-20">
				<button type="primary" size="medium" @click.prevent="submitForm(form)">
					{{('login')}}
				</button>
			</div>
	</form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name: 'login',
	data() {
		return {
			form: {
				username: 'demo@zapfloorhq.com',
				pass: 'apiapi',
			},
			formRules: {
				username: [
					{
						required: true,
						message: 'Please input a username',
						trigger: 'blur'
					}
				],
				pass: [{
						required: true,
						message: 'Please input a password',
						trigger: 'blur'
					},
				]
			}			
		}
	},
	computed: {
		...mapGetters('auth', {
			'loginError': 'login_error'
		}),
	},
	methods: {
		...mapActions('auth', [
			'login',
		]),
		submitForm(formName) {
			console.log("form", formName);
			// this.$refs[formName]
			// this.formName.validate((valid) => {
				// if (valid) {
					this.login({username: this.form.username, password: this.form.pass})
				// } else {
				// 	console.log('error submit!!');
				// 	return false;
				// }
			}
		},
	}

</script>
