<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { init } from '@/extraTools/hooks/useInjectGlobalState';
import { Form, FormItem, Input, Checkbox, Modal, Select } from 'ant-design-vue';
import { useHeartBeat } from '../../hooks/useHeartBeat';
import EntryCatchModal from './entry-catch-modal.vue';
import PIPModal from './pip-modal.vue';
enum FeatureType {
	PIP = 'pip',
	ENTRY_CATCH = 'entryCatch',
}

export default defineComponent({
	name: 'Main',
	components: {
		Form,
		FormItem,
		Input,
		Checkbox,
		Modal,
		Select,
		PIPModal,
		EntryCatchModal,
	},
	setup() {
		const aliyunel = document.createElement('link');
		aliyunel.rel = 'stylesheet';
		aliyunel.href = '//at.alicdn.com/t/c/font_4628072_do7sjinevcu.css';
		aliyunel.type = 'text/css';
		document.head.append(aliyunel);

		const pipModalRef = ref();
		const entryCatchRef = ref();

		const state = reactive({
			open: false,
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

		const openDialog = (type: FeatureType) => {
			switch (type) {
				case FeatureType.PIP: {
					pipModalRef.value.openDialog();
					return;
				}
				case FeatureType.ENTRY_CATCH: {
					entryCatchRef.value.openDialog();
					return;
				}
				default: {
					return;
				}
			}
		};

		return {
			FeatureType,
			pipModalRef,
			entryCatchRef,
			onClickIcon,
			openDialog,
			state,
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
				<li @click="() => openDialog(FeatureType.PIP)">画中画</li>
				<li @click="() => openDialog(FeatureType.ENTRY_CATCH)">资源快速捕获</li>
			</ul>
		</div>
	</div>
	<PIPModal
		ref="pipModalRef"
		v-if="state.open" />
	<EntryCatchModal
		ref="entryCatchRef"
		v-if="state.open" />
</template>
<style lang="css" scoped>
.show {
	transform: translate3d(0%, 25%, 0);
	transition: all 0.3s;
}

.hidden {
	transform: translate3d(100%, 25%, 0);
	transition: all 0.3s;
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
	display: flex;
	position: fixed;
	right: 2rem;
	top: 2rem;
	z-index: 99999;
	justify-content: center;
	align-items: center;
	width: auto;
	height: auto;
}

.tools_root .tools_icon {
	position: relative;
	cursor: pointer;
	font-size: 2rem;
	color: #808080;
	transition: all 0.3s;
}

.tools_root .tools_icon:hover {
	color: aqua;
}

.tools_root .tools_box {
	display: flex;
	position: relative;
	inset: 0;
	z-index: 9999;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	border: 1px solid rgb(205 227 255 / 90%);
	border-radius: 0.5rem;
	width: 10rem;
	height: auto;
	background: radial-gradient(rgb(60 221 255 / 40%) 0%, rgb(213 201 255 / 40%) 90%);
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
	backdrop-filter: blur(16px);
}

.tools_root .tools_box::after {
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

.tools_root .tools_box::before {
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

.tools_root .tools_box > * {
	position: relative;
	z-index: 9;
	padding: 0.4rem;
	border-radius: 0.5rem;
	background-color: #fff;
	box-shadow: 0 0.1rem 0.4rem 0 rgb(var(--shadow) / 20%);
}

.tools_root .tools_box ul {
	display: flex;
	list-style: none;
	flex-wrap: wrap;
	justify-content: center;
	justify-content: flex-start;
	align-items: center;
	margin: 0;
	width: 100%;
	gap: 0.4rem;
}

.tools_root .tools_box ul li {
	display: flex;
	justify-content: center;
	justify-content: flex-start;
	align-items: center;
	padding: 0 0.5rem;
	border-radius: 0.5rem;
	width: 100%;
	min-height: 2rem;
	background-color: rgb(var(--grey-3));
	cursor: pointer;
	color: rgb(var(--sub));
	transition: all 0.3s;
}

.tools_root .tools_box ul li:hover {
	background-color: rgb(var(--primary));
	color: rgb(var(--sub));
}

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
