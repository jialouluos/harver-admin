<script lang="ts" setup>
import { onMounted, reactive, toRaw } from 'vue';
import { Form } from 'ant-design-vue';
import { client } from '@blog_admin/utils/client';
import { watch } from 'vue';
import { CatalogFiled } from '@blog_admin/types';

interface IState {
	subLoading: boolean;
	catalogOptions: { label: string; value: number; disabled: boolean }[];
}
const useForm = Form.useForm;
const props = withDefaults(
	defineProps<{
		data: CatalogFiled;
		type: 'add' | 'update';
		onOk: (data: CatalogFiled) => Promise<any>;
	}>(),
	{
		data: () => ({} as CatalogFiled),
	}
);
const open = defineModel('open', {
	default: false,
});

const formState = reactive<CatalogFiled>({ ...props.data });
const state = reactive<IState>({
	subLoading: false,
	catalogOptions: [],
});
watch(
	() => open.value,
	() => {
		Object.assign(formState, { ...props.data });
	}
);
const rulesRef = reactive({
	name: [
		{
			required: true,
			message: '目录名称必填',
		},
	],
	pid: [
		{
			required: true,
			message: '父节点必填',
		},
	],
});
const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);
const handleValidate = (run: (data: CatalogFiled) => any, onError?: () => any) => {
	validate()
		.then(async () => {
			run(toRaw(formState));
		})
		.catch(err => {
			console.log('error', err);
			onError?.();
		});
};
const handleOk = () => {
	handleValidate(async data => {
		await props.onOk(data);
		open.value = false;
	});
};
const handleCancel = () => {
	open.value = false;
	resetFields();
};
const getCatalogList = async () => {
	state.subLoading = true;
	const data = await client.getCatalogAllList();
	state.subLoading = false;
	if (!data) return state.catalogOptions;
	state.catalogOptions = [{ id: -1, name: '根节点' }, ...data].map(item => ({
		label: item.name,
		value: item.id,
		disabled: false,
	}));
};
const handleSearch = (input: string, option: { label: string; value: number }) => {
	return option.label.includes(input);
};

onMounted(() => {
	getCatalogList();
});
defineExpose({
	handleValidate,
});
</script>
<template>
	<a-modal
		:width="'60vw'"
		v-model:open="open"
		:title="`目录${type === 'add' ? '新增' : '更新'}`"
		@ok="handleOk"
		@cancel="handleCancel">
		<a-form :style="{ width: '100%' }">
			<a-row :gutter="24">
				<a-col :span="12">
					<a-form-item
						label="父目录"
						v-bind="validateInfos.pid">
						<a-select
							show-search
							:filterOption="handleSearch"
							v-model:value="formState.pid"
							:options="state.catalogOptions"
							placeholder="选择目录">
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="目录名称"
						v-bind="validateInfos.name">
						<a-input
							v-model:value="formState.name"
							placeholder="输入目录">
						</a-input>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</a-modal>
</template>
