<script lang="ts" setup>
import { reactive } from 'vue';
import { client } from '@blog_admin/utils/client';
import { useStore } from '@blog_admin/store';
import { Form } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const loginState = reactive({
	username: '',
	password: '',
});
const store = useStore();
const router = useRouter();
const onFinish = async () => {
	const result = await client.loginUser(loginState);
	if (result) {
		store.blogAdminStore.setToken(result.Token);
		store.blogAdminStore.currentUser = result.username;
		router.push('home');
	}
};

const handleReset = () => {
	loginState.username = '';
	loginState.password = '';
};
</script>
<template>
	<div class="login">
		<div class="form_wrapper">
			<Form
				:model="loginState"
				name="login"
				:label-col="{ span: 8 }"
				:wrapper-col="{ span: 16 }"
				@finish="onFinish">
				<a-form-item
					label="用户名"
					name="username"
					:rules="[
						{ required: true, message: '请输入账号', trigger: 'blur' },
						{
							min: 4,
							max: 16,
							message: '长度应处于4到14个字符!',
							trigger: 'blur',
						},
					]">
					<a-input
						v-model:value="loginState.username"
						autocomplete />
				</a-form-item>

				<a-form-item
					label="密码"
					name="password"
					:rules="[
						{ required: true, message: '请输入用户密码', trigger: 'blur' },
						{
							min: 3,
							max: 16,
							message: '长度应处于3到16个字符!',
							trigger: 'blur',
						},
					]">
					<a-input-password
						v-model:value="loginState.password"
						autocomplete />
				</a-form-item>

				<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
					<a-button
						type="primary"
						html-type="submit"
						:style="{
							marginRight: '1rem',
						}"
						>登录</a-button
					>
					<a-button @click="handleReset">重置</a-button>
				</a-form-item>
			</Form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.login {
	width: 100%;
	height: 100%;
	background-color: col(grey-3);
	@include flex_center;

	.form_wrapper {
		display: flex;
		flex-wrap: wrap;
		place-content: center center;
		align-items: flex-start;
		border-radius: 15px;
		width: 600px;
		height: 380px;
		background: linear-gradient(
			to right bottom,
			rgb(255 255 255 / 70%),
			rgb(255 255 255 / 50%),
			rgb(255 255 255 / 40%)
		);
		box-shadow: 0 0 20px #a29bfe;
		backdrop-filter: blur(10px);
	}
}
</style>
