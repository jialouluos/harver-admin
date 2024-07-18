<script lang="ts" setup>
import { computed, reactive } from 'vue';

const props = defineProps<{
	formState: {
		username: string;
		password: string;
	};
}>();
const emits = defineEmits(['test', 'update']);
const formState = computed(() => props.formState);
console.log(emits);
const onFinish = (data: any) => {
	console.log(data);
};
// emits('test');

const onFinishFailed = (err: any) => {
	console.log(err, 'err');
};
</script>

<template>
	<a-form
		:model="formState"
		name="basic"
		layout="inline"
		:label-col="{ span: 8 }"
		:wrapper-col="{ span: 16 }"
		@finish="onFinish"
		@finishFailed="onFinishFailed">
		<a-form-item
			label="Username"
			name="username"
			:rules="[{ required: true, message: 'Please input your username!' }]">
			<a-input v-model:value="formState.username" />
		</a-form-item>

		<a-form-item
			label="Password"
			name="password"
			:rules="[{ required: true, message: 'Please input your password!' }]">
			<a-input-password v-model:value="formState.password" />
		</a-form-item>

		<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
			<a-button
				@click="() => $emit('test')"
				type="primary"
				html-type="submit"
				>Submit</a-button
			>
		</a-form-item>
	</a-form>
</template>
