<script lang="ts" setup>
import { computed, reactive, toRaw } from 'vue';
import { Form } from 'ant-design-vue';
import { IArticleCard, parseMarkDown, markdownMerge } from '@blog_admin/utils/parseMarkdown';
import { client } from '@blog_admin/utils/client';
import { watch } from 'vue';
import { useUploadFileByPick } from '@jialouluo/tools';
interface IState {
	subLoading: boolean;
	catalogOptions: { label: string; value: string; disabled: boolean }[];
	searchCatalogString: string;
	tagOptions: { label: string; value: string; disabled: boolean }[];
}
const useForm = Form.useForm;
const props = withDefaults(
	defineProps<{
		data: IArticleCard;
		operateType: 'update' | 'add';
		onOk: (data: IArticleCard) => Promise<any>;
	}>(),
	{
		operateType: 'add',
		data: () => ({} as IArticleCard),
	}
);
const open = defineModel('open', {
	default: false,
});

const formState = reactive<IArticleCard>({ ...props.data });
const state = reactive<IState>({
	subLoading: false,
	catalogOptions: [],
	tagOptions: [],
	searchCatalogString: '',
});
watch(
	() => open.value,
	() => {
		Object.assign(formState, { ...props.data });
	}
);
const rulesRef = reactive({
	title: [
		{
			required: true,
			message: '文章标题必填',
		},
	],
	catalog: [
		{
			required: true,
			message: '目录必填',
		},
	],
});
const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);
const handleValidate = (run: (data: IArticleCard) => any, onError?: () => any) => {
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

const handleUpload = async () => {
	const pickers = await useUploadFileByPick({ type: 'single', scope: window.blogAdminWindow });
	const picker = pickers[0];
	if (!picker) return;
	console.log(picker,'picker');
	const result = {
		body: picker.context,
		update_time: new Date().getTime(),
		//下面的字段都支持md文章中配置
		...parseMarkDown(picker.context, picker.meta),
	};
	console.log(result);
	Object.assign(formState, markdownMerge(result, toRaw(formState)));
	console.log(formState);
};

const getCatalogList = async () => {
	state.subLoading = true;
	const data = await client.getCatalogAllList();
	state.subLoading = false;
	if (!data) return state.catalogOptions;
	state.catalogOptions = data.map(item => ({
		label: item.name,
		value: item.name,
		disabled: false,
	}));
};
const getTagList = async () => {
	state.subLoading = true;
	const data = await client.getTagAllList();
	state.subLoading = false;
	if (!data) return state.tagOptions;
	state.tagOptions = data.tags.map(item => ({
		label: item,
		value: item,
		disabled: false,
	}));
};
const handleSearch = (input: string) => {
	state.searchCatalogString = input;
};
const handleRemoveQA = (item: IArticleCard['questions'][number]) => {
	formState.questions ??= [];
	const index = formState?.questions?.indexOf(item)!;
	if (index !== -1 && formState.questions) {
		formState.questions.splice(index, 1);
	}
};
const handleAddQA = () => {
	formState.questions ??= [];
	formState.questions.push({
		q: '',
		a: '',
	});
};
const catalogOptions = computed(() => {
	return [
		...state.catalogOptions,
		...(state.searchCatalogString
			? [
					{
						label: state.searchCatalogString,
						value: state.searchCatalogString,
						disabled: false,
					},
			  ]
			: []),
	];
});
defineExpose({
	handleValidate,
});
</script>
<template>
	<a-modal
		:width="'60vw'"
		v-model:open="open"
		title="文章详情"
		@ok="handleOk"
		@cancel="handleCancel">
		<a-form :style="{ width: '100%' }">
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item
						label="标题"
						v-bind="validateInfos.title">
						<a-input
							v-model:value="formState.title"
							placeholder="输入标题" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="预览图">
						<a-input
							v-model:value="formState.pre_img"
							placeholder="输入预览图" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
						label="目录"
						v-bind="validateInfos.catalog">
						<a-select
							show-search
							v-model:value="formState.catalog"
							:loading="state.subLoading"
							:options="catalogOptions"
							@dropdownVisibleChange="getCatalogList"
							@search="handleSearch"
							placeholder="选择目录">
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="标签">
						<a-select
							v-model:value="formState.tags"
							mode="tags"
							placeholder="文章标签"
							@dropdownVisibleChange="getTagList"
							:options="state.tagOptions"></a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="关键词">
						<a-input
							v-model:value="formState.keywords"
							placeholder="使用,分割" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="文章权重">
						<a-input-number v-model:value="formState.order" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="加密">
						<a-switch v-model:checked="formState.is_lock" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="发布">
						<a-switch v-model:checked="formState.publish" />
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="operateType === 'update'">
					<harver-button
						@click="handleUpload()"
						:size="'small'"
						>文件更新</harver-button
					>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="24">
					<a-form-item label="描述">
						<a-input v-model:value="formState.description" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="22">
					<a-row
						v-for="(question, index) in formState.questions"
						:key="index"
						:gutter="12"
						align="baseline">
						<a-col
							:span="10"
							:offset="1">
							<a-form-item
								:label="'QA'"
								:name="['questions', index, 'q']">
								<a-input
									v-model:value="question.q"
									placeholder="请输入需要挂载的文章内容" />
							</a-form-item>
						</a-col>
						<a-col :span="10">
							<a-form-item :name="['questions', index, 'a']">
								<a-input
									v-model:value="question.a"
									placeholder="请输入挂载的内容" />
							</a-form-item>
						</a-col>

						<a-col :span="2">
							<a-button @click="handleRemoveQA(question)">删除</a-button>
						</a-col>
					</a-row>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col
					:offset="10"
					:span="4">
					<a-form-item>
						<a-button
							type="dashed"
							block
							@click="handleAddQA">
							增加
						</a-button>
					</a-form-item></a-col
				>
			</a-row>
		</a-form>
	</a-modal>
</template>
