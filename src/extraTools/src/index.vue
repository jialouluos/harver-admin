<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue';
import { E_SupportType, init } from '@/extraTools/hooks/useInjectGlobalState';
import { init as initPIP } from '@/extraTools/hooks/usePictureInPicture';

import { Form, FormItem, Input, Checkbox, Modal, Select } from 'ant-design-vue';

import { useHeartBeat } from '../../hooks/useHeartBeat';

export default defineComponent({
	name: 'Main',
	components: {
		Form,
		FormItem,
		Input,
		Checkbox,
		Modal,
		Select,
	},
	setup() {
		const aliyunel = document.createElement('link');
		aliyunel.rel = 'stylesheet';
		aliyunel.href = '//at.alicdn.com/t/c/font_4628072_do7sjinevcu.css';
		aliyunel.type = 'text/css';
		document.head.append(aliyunel);
		const state = reactive({
			open: false,
			pipConfig: {
				showDialog: false,
				fromState: {
					scrolling: false,
					scrollingInfo: '',
					target: '',
					customScrollingTarget: false,
					supportType: E_SupportType.NONE,
					customTarget: false,
					supportTarget: E_SupportType.NONE,
				},
			},
		});
		useHeartBeat('__harver_header_beat__test__', () => {}, {
			space: 2000,
		});

		onMounted(() => {
			init();
		});
		const onClickIcon = () => {
			state.open = !state.open;
		};
		const handlePIP = () => {
			console.info(state.pipConfig.fromState);
			const hw = initPIP();
			closePIPDialog();
			hw.hooks.usePictureInPicture?.(state.pipConfig.fromState);
		};
		const openPIPDialog = () => {
			state.pipConfig.showDialog = true;
		};
		const closePIPDialog = () => {
			state.pipConfig.showDialog = false;
		};

		watch(
			() => state.pipConfig.fromState.scrolling,
			newValue => {
				if (!newValue) {
					state.pipConfig.fromState.scrollingInfo = '';
					state.pipConfig.fromState.supportType = E_SupportType.NONE;
				}
			}
		);
		watch(
			() => state.pipConfig.fromState.customScrollingTarget,
			() => {
				state.pipConfig.fromState.scrollingInfo = '';
				state.pipConfig.fromState.supportType = E_SupportType.NONE;
			}
		);
		watch(
			() => state.pipConfig.fromState.customTarget,
			() => {
				state.pipConfig.fromState.target = '';
				state.pipConfig.fromState.supportTarget = E_SupportType.NONE;
			}
		);
		const supportTypeOptions = reactive([
			{
				value: E_SupportType.BILIBILI,
				label: 'b站',
			},
		]);

		return {
			onClickIcon,
			handlePIP,
			closePIPDialog,
			openPIPDialog,
			state,
			supportTypeOptions,
		};
	},
});
</script>
<template>
	<div :class="['tools_root', state.open ? 'show' : 'hidden']">
		<i
			:class="['icon', 'iconfont', 'tools_icon', state.open ? 'icon-enter-line' : 'icon-back-line']"
			@click="onClickIcon"></i>
		<div class="tools_box">
			<ul>
				<li @click="openPIPDialog">画中画</li>
			</ul>
		</div>
	</div>
	<Modal
		okText="确认"
		cancelText="取消"
		class="modal"
		v-model:open="state.pipConfig.showDialog"
		title="画中画启用配置"
		@ok="handlePIP">
		<Form
			:model="state.pipConfig.fromState"
			name="pip_form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			autocomplete="off">
			<FormItem
				name="customTarget"
				label="开启自定义节点">
				<Checkbox v-model:checked="state.pipConfig.fromState.customTarget"></Checkbox>
			</FormItem>
			<FormItem
				v-if="!state.pipConfig.fromState.customTarget"
				name="supportTarget"
				label="已支持网站">
				<Select
					:options="supportTypeOptions"
					v-model:value="state.pipConfig.fromState.supportTarget"
					placeholder="已支持画中画预设网站" />
			</FormItem>

			<FormItem
				v-if="state.pipConfig.fromState.customTarget"
				name="target"
				label="画中画根节点信息">
				<Input
					v-model:value="state.pipConfig.fromState.target"
					placeholder="画中画根节点信息(节点id或者类名)" />
			</FormItem>

			<FormItem
				name="scrolling"
				label="开启画中画弹幕">
				<Checkbox v-model:checked="state.pipConfig.fromState.scrolling"></Checkbox>
			</FormItem>
			<FormItem
				v-if="state.pipConfig.fromState.scrolling"
				name="customScrollingTarget"
				label="自定义弹幕根节点">
				<Checkbox v-model:checked="state.pipConfig.fromState.customScrollingTarget"></Checkbox>
			</FormItem>
			<FormItem
				v-if="state.pipConfig.fromState.scrolling && state.pipConfig.fromState.customScrollingTarget"
				name="scrollingInfo"
				label="弹幕根节点信息">
				<Input
					placeholder="弹幕根节点信息(节点id或者类名)"
					v-model:value="state.pipConfig.fromState.scrollingInfo" />
			</FormItem>
			<FormItem
				v-if="state.pipConfig.fromState.scrolling && !state.pipConfig.fromState.customScrollingTarget"
				name="supportType"
				label="已支持网站">
				<Select
					:options="supportTypeOptions"
					v-model:value="state.pipConfig.fromState.supportType"
					placeholder="已支持弹幕网站" />
			</FormItem>
		</Form>
	</Modal>
</template>
<style lang="css" scoped>
.show {
	transition: all 0.3s;
	transform: translate3d(0%, 25%, 0);
}

.hidden {
	transition: all 0.3s;
	transform: translate3d(100%, 25%, 0);
}

:global(:root) {
	--primary: 206, 239, 253;
	--sub: 207, 149, 217;
	--grey-0: 255, 255, 255;
	--grey-1: 253, 253, 253;
	--grey-2: 247, 247, 247;
	--grey-3: 239, 242, 243;
	--grey-5: 153, 153, 153;
	--grey-6: 103, 110, 123;
	--grey-7: 51, 51, 51;
	--bg: var(--grey-2);
	--box-bg: var(--grey-1);
	--text-color: var(--grey-7);
	--text-sub-color: var(--grey-5);
	--shadow: var(--grey-7);
}

.tools_root {
	position: fixed;
	top: 2rem;
	right: 2rem;
	z-index: 99999;
	display: flex;
	justify-content: center;
	align-items: center;
	width: auto;
	height: auto;
}

.tools_root .tools_icon {
	position: relative;
	font-size: 2rem;
	color: #808080;
	transition: all 0.3s;
	cursor: pointer;
}

.tools_root .tools_icon:hover {
	color: aqua;
}

.tools_root .tools_box {
	position: relative;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	width: 10rem;
	height: auto;
	background: radial-gradient(rgb(60 221 255 / 40%) 0%, rgb(213 201 255 / 40%) 90%);
	border: 1px solid rgb(205 227 255 / 90%);
	border-radius: 0.5rem;
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
	backdrop-filter: blur(16px);
	inset: 0;
	flex-wrap: wrap;
}

.tools_root .tools_box::after {
	position: absolute;
	top: 0.125rem;
	left: 0.125rem;
	z-index: 0;
	width: calc(100% - 0.25rem);
	height: calc(100% - 0.25rem);
	background: radial-gradient(circle at 50% 50%, rgb(255 255 255 / 40%) 0%, rgb(60 221 255 / 10%) 90%);
	content: '';
	pointer-events: none;
	border-radius: 0.5rem;
	backdrop-filter: blur(16px);
}

.tools_root .tools_box::before {
	position: absolute;
	top: 0.25rem;
	left: 0.25rem;
	z-index: 1;
	width: calc(100% - 0.5rem);
	height: calc(100% - 0.5rem);
	background-color: initial;
	content: '';
	pointer-events: none;
	border-radius: 0.5rem;
}

.tools_root .tools_box > * {
	position: relative;
	z-index: 9;
	padding: 0.4rem;
	background-color: #fff;
	border-radius: 0.5rem;
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
}

.tools_root .tools_box ul {
	display: flex;
	justify-content: center;
	justify-content: flex-start;
	align-items: center;
	margin: 0;
	width: 100%;
	list-style: none;
	flex-wrap: wrap;
	gap: 0.4rem;
}

.tools_root .tools_box ul li {
	display: flex;
	justify-content: center;
	justify-content: flex-start;
	align-items: center;
	padding: 0 0.5rem;
	width: 100%;
	min-height: 2rem;
	color: rgb(var(--sub));
	background-color: rgb(var(--grey-3));
	border-radius: 0.5rem;
	transition: all 0.3s;
	cursor: pointer;
}

.tools_root .tools_box ul li:hover {
	color: rgb(var(--sub));
	background-color: rgb(var(--primary));
}

.modal {
	position: relative;
	position: absolute;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	margin: auto;
	width: 60vw !important;
	height: 60vh !important;
	background: radial-gradient(rgb(60 221 255 / 40%) 0%, rgb(213 201 255 / 40%) 90%);
	border: 1px solid rgb(205 227 255 / 90%);
	border-radius: 0.5rem;
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
	backdrop-filter: blur(16px);
	inset: 0;
	flex-direction: column;
}

.modal::after {
	position: absolute;
	top: 0.125rem;
	left: 0.125rem;
	z-index: 0;
	width: calc(100% - 0.25rem);
	height: calc(100% - 0.25rem);
	background: radial-gradient(circle at 50% 50%, rgb(255 255 255 / 40%) 0%, rgb(60 221 255 / 10%) 90%);
	content: '';
	pointer-events: none;
	border-radius: 0.5rem;
	backdrop-filter: blur(16px);
}

.modal::before {
	position: absolute;
	top: 0.25rem;
	left: 0.25rem;
	z-index: 1;
	width: calc(100% - 0.5rem);
	height: calc(100% - 0.5rem);
	background-color: initial;
	content: '';
	pointer-events: none;
	border-radius: 0.5rem;
}

.modal > * {
	position: relative;
	z-index: 9;
	padding: 1rem;
	background-color: #fff;
	border-radius: 0;
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
}
</style>
