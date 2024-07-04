<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

interface FormState {
	username: string;
	password: string;
}
const router = useRouter();
const state = reactive<FormState>({
	username: '',
	password: '',
});
const onFinish = () => {
	router.replace('/home');
};
const onFinishFailed = () => {};
</script>
<template>
	<div id="login-wrapper">
		<a-form
			class="shell"
			:model="state"
			name="login"
			@finish="onFinish"
			@finishFailed="onFinishFailed">
			<h2 class="title">LOGIN</h2>
			<a-form-item
				name="username"
				:rules="[{ required: true, message: '请输入用户名!' }]">
				<a-input
					v-model:value="state.username"
					placeholder="请输入用户名" />
			</a-form-item>

			<a-form-item
				name="password"
				:rules="[{ required: true, message: '请输入密码!' }]">
				<a-input-password
					v-model:value="state.password"
					placeholder="请输入密码" />
			</a-form-item>

			<a-form-item class="submit">
				<a-button
					type="primary"
					html-type="submit"
					>登录</a-button
				>
			</a-form-item>
		</a-form>
	</div>
</template>

<style lang="scss">
@import '@/styles/global.scss';
#login-wrapper {
	width: 100%;
	height: 100%;
	@include flex_center();
	background-image: radial-gradient(circle at 10% 20%, col(grey-2) 0%, col(primary) 90%);
	.shell {
		@include flex_center() {
			align-items: flex-start;
			flex-wrap: wrap;
		}
		width: rem(32);
		height: auto;
		@include border_radius();
		@include grass();
		@include shadow('box');
		background-color: #00000000;
		border: 1px solid rgba(209, 213, 219, 0.3);
		padding: 0 rem(6);
		gap: rem(1);
		& > div {
			width: 100%;
			margin: 0px;
		}
		.title {
			font-size: rem(2.5);
			margin: 0;
			color: col(grey-6, 1);
		}
		.submit {
			text-align: center;
			margin-bottom: rem(1);
		}
	}
}
</style>
