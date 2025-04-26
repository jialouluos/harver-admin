<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import { E_SupportType } from '@/extraTools/hooks/useInjectGlobalState';
import { init as initPIP } from '@/extraTools/hooks/usePictureInPicture';

import { Form, FormItem, Input, Checkbox, Modal, Select } from 'ant-design-vue';

export default defineComponent({
	name: 'PipModal',
	components: {
		Form,
		FormItem,
		Input,
		Checkbox,
		Modal,
		Select,
	},
	setup() {
		const state = reactive({
			open: false,
			fromState: {
				scrolling: false,
				scrollingInfo: '',
				target: '',
				customScrollingTarget: false,
				supportType: E_SupportType.NONE,
				customTarget: false,
				supportTarget: E_SupportType.NONE,
			},
		});

		const handlePIP = () => {
			const hw = initPIP();
			closePIPDialog();
			hw.hooks.usePictureInPicture?.(state.fromState);
		};

		const openDialog = () => {
			state.open = true;
		};

		const closePIPDialog = () => {
			state.open = false;
		};

		watch(
			() => state.fromState.scrolling,
			newValue => {
				if (!newValue) {
					state.fromState.scrollingInfo = '';
					state.fromState.supportType = E_SupportType.NONE;
				}
			}
		);
		watch(
			() => state.fromState.customScrollingTarget,
			() => {
				state.fromState.scrollingInfo = '';
				state.fromState.supportType = E_SupportType.NONE;
			}
		);
		watch(
			() => state.fromState.customTarget,
			() => {
				state.fromState.target = '';
				state.fromState.supportTarget = E_SupportType.NONE;
			}
		);
		const supportTypeOptions = reactive([
			{
				value: E_SupportType.BILIBILI,
				label: 'b站',
			},
		]);

		return {
			handlePIP,
			closePIPDialog,
			openDialog,
			state,
			supportTypeOptions,
		};
	},
});
</script>
<template>
	<Modal
		okText="确认"
		cancelText="取消"
		class="modal"
		v-model:open="state.open"
		title="画中画启用配置"
		@ok="handlePIP">
		<Form
			:model="state.fromState"
			name="pip_form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			autocomplete="off">
			<FormItem
				name="customTarget"
				label="开启自定义节点">
				<Checkbox v-model:checked="state.fromState.customTarget"></Checkbox>
			</FormItem>
			<FormItem
				v-if="!state.fromState.customTarget"
				name="supportTarget"
				label="已支持网站">
				<Select
					:options="supportTypeOptions"
					v-model:value="state.fromState.supportTarget"
					placeholder="已支持画中画预设网站" />
			</FormItem>

			<FormItem
				v-if="state.fromState.customTarget"
				name="target"
				label="画中画根节点信息">
				<Input
					v-model:value="state.fromState.target"
					placeholder="画中画根节点信息(节点id或者类名)" />
			</FormItem>

			<FormItem
				name="scrolling"
				label="开启画中画弹幕">
				<Checkbox v-model:checked="state.fromState.scrolling"></Checkbox>
			</FormItem>
			<FormItem
				v-if="state.fromState.scrolling"
				name="customScrollingTarget"
				label="自定义弹幕根节点">
				<Checkbox v-model:checked="state.fromState.customScrollingTarget"></Checkbox>
			</FormItem>
			<FormItem
				v-if="state.fromState.scrolling && state.fromState.customScrollingTarget"
				name="scrollingInfo"
				label="弹幕根节点信息">
				<Input
					placeholder="弹幕根节点信息(节点id或者类名)"
					v-model:value="state.fromState.scrollingInfo" />
			</FormItem>
			<FormItem
				v-if="state.fromState.scrolling && !state.fromState.customScrollingTarget"
				name="supportType"
				label="已支持网站">
				<Select
					:options="supportTypeOptions"
					v-model:value="state.fromState.supportType"
					placeholder="已支持弹幕网站" />
			</FormItem>
		</Form>
	</Modal>
</template>
<style lang="css" scoped>
.modal {
	display: flex;
	position: relative;
	position: absolute;
	inset: 0;
	z-index: 9999;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: auto;
	padding: 0.5rem;
	border: 1px solid rgb(205 227 255 / 90%);
	border-radius: 0.5rem;
	width: 60vw !important;
	height: 60vh !important;
	background: radial-gradient(rgb(60 221 255 / 40%) 0%, rgb(213 201 255 / 40%) 90%);
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
	backdrop-filter: blur(16px);
}

.modal::after {
	position: absolute;
	left: 0.125rem;
	top: 0.125rem;
	z-index: 0;
	border-radius: 0.5rem;
	width: calc(100% - 0.25rem);
	height: calc(100% - 0.25rem);
	background: radial-gradient(circle at 50% 50%, rgb(255 255 255 / 40%) 0%, rgb(60 221 255 / 10%) 90%);
	backdrop-filter: blur(16px);
	pointer-events: none;
	content: '';
}

.modal::before {
	position: absolute;
	left: 0.25rem;
	top: 0.25rem;
	z-index: 1;
	border-radius: 0.5rem;
	width: calc(100% - 0.5rem);
	height: calc(100% - 0.5rem);
	background-color: initial;
	pointer-events: none;
	content: '';
}

.modal > * {
	position: relative;
	z-index: 9;
	padding: 1rem;
	border-radius: 0;
	background-color: #fff;
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
}
</style>
