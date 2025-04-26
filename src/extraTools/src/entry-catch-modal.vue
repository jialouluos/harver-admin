<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive, ref } from 'vue';

import { Form, FormItem, Input, Checkbox, Modal, Select, message, Typography, Tooltip } from 'ant-design-vue';

const { Paragraph } = Typography;
export default defineComponent({
	name: 'EntryCatchModal',
	components: {
		Form,
		FormItem,
		Input,
		Checkbox,
		Modal,
		Select,
		Text,
		Tooltip,
		Paragraph,
	},
	setup() {
		const state = reactive({
			open: false,
			fromState: {
				types: [],
				types_input: '',
				custom: false,
			},
		});
		const result = ref<any[]>([]);
		const obClear = ref<any>();

		const supportTypeOptions = reactive([
			{
				value: 'img',
				label: '图片',
			},
			{
				value: 'xmlhttprequest',
				label: '网络请求(xml)',
			},
			{
				value: 'fetch',
				label: '网络请求(fetch)',
			},
		]);

		const openDialog = () => {
			state.open = true;
		};

		const clear = () => {
			obClear.value && obClear.value();
			obClear.value && message.success('监听已销毁');
			obClear.value = null;
		};

		const closeDialog = () => {
			state.open = false;
		};

		const initEntryCatch = () => {
			clear();
			const filterTypes = state.fromState.types_input
				? state.fromState.types_input.split(',').filter(Boolean)
				: state.fromState.types;
			const ob = new PerformanceObserver(list => {
				const filterList = list.getEntriesByType('resource');

				const entries = filterList.filter(entry => filterTypes.includes((entry as any).initiatorType));
				result.value.push(...entries);
			});
			ob.observe({ entryTypes: ['resource'] });
			message.success(`开启成功,正在监听${filterTypes.join('、')}类型的资源请求`);
			obClear.value = () => {
				ob.disconnect();
			};
			closeDialog();
		};

		onBeforeUnmount(() => {
			clear();
		});

		return {
			closeDialog,
			supportTypeOptions,
			initEntryCatch,
			openDialog,
			clear,
			state,
			result,
			obClear,
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
		title="资源捕获"
		@ok="initEntryCatch"
		@cancel="clear">
		<Form
			:model="state.fromState"
			name="pip_form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			autocomplete="off">
			<FormItem
				name="custom"
				label="自定义类型">
				<Checkbox v-model:checked="state.fromState.custom"></Checkbox>
			</FormItem>
			<FormItem
				v-if="!state.fromState.custom"
				name="types"
				label="预设接口类型">
				<Select
					mode="multiple"
					:options="supportTypeOptions"
					v-model:value="state.fromState.types"
					placeholder="已支持预设接口类型" />
			</FormItem>

			<FormItem
				v-if="state.fromState.custom"
				name="types_input"
				label="自定义类型">
				<Input
					v-model:value="state.fromState.types_input"
					placeholder="支持多个(img,fetch,etc...)，使用,分割" />
			</FormItem>
		</Form>
	</Modal>
	<div
		class="fixed"
		v-if="obClear">
		<div
			v-for="entry in result"
			:key="entry.name">
			<Tooltip
				:trigger="'click'"
				:title="JSON.stringify(entry)"
				:overlayStyle="{
					width: '400px',
				}">
				<Paragraph
					class="entry-name"
					copyable>
					【{{ entry.initiatorType }}】: {{ entry.name }}</Paragraph
				>
			</Tooltip>
		</div>
	</div>
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

.fixed {
	display: flex;
	overflow: auto;
	position: fixed;
	right: 60px;
	bottom: 100px;
	flex-direction: column;
	padding: 10px;
	border: 1px solid #e3e5e7;
	border-radius: 4px;
	width: 400px;
	height: 300px;
	background: #fff;
	box-shadow: 0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 10%);
	gap: 10px;
}

::-webkit-scrollbar {
	width: 2px; /* 设置滚动条宽度 */
}

::-webkit-scrollbar-thumb {
	background-color: #52525256; /* 设置滚动条颜色 */
}

.fixed > div {
	padding: 1px 8px;
	border-radius: 4px;
	width: 100%;
	background-color: #e3e5e7;
}

.entry-name {
	line-height: 22px;
	font-size: 14px;
	color: #252626;
	word-break: break-all;
}

:global(.ant-tooltip-inner) {
	flex-wrap: wrap;
	word-break: break-all;
	white-space: pre-wrap;
}
</style>
