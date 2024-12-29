<template>
	<a-table
		:columns="columns"
		:data-source="articleList"
		:scroll="{ x: 3000 }"
		bordered
		:pagination="false">
		<template #bodyCell="{ column, record }">
			<template v-if="column.dataIndex === 'id'">
				<a-tag color="purple">
					{{ record.id }}
				</a-tag>
			</template>
			<template v-if="column.type === 'text'">
				<harver-text
					:contentStyle="{
						fontSize: '0.6rem',
					}"
					:content="record[column.dataIndex] + ''" />
			</template>
			<template v-if="column.type === 'ellipsis'">
				<harver-text
					:contentStyle="{
						fontSize: '0.6rem',
					}"
					:content="record[column.dataIndex]"
					supperLazy
					:ellipsis="{ rows: 1 }" />
			</template>
			<template v-if="column.type === 'tag'">
				<harver-tag
					:content="record[column.dataIndex]"
					:style="{
						fontSize: '0.6rem',
					}">
				</harver-tag>
			</template>
			<template v-if="column.type === 'tags'">
				<harver-tags
					:content="
							record[column.dataIndex].map((item:string) => {
								return {
									content: item,
									maxWidth: 50,
									rows: 1,
									style: {
										textAlign: 'center',
										fontSize: '0.6rem',
										margin:'0px'
									}
								};
							})
						"
					:ellipsis="{
						rows: 1,
					}"
					style="display: flex; flex-wrap: wrap; font-size: 0.6rem; gap: 0.2rem"
					:ellipsisStyle="{
						fontSize: '0.6rem',
					}">
				</harver-tags>
			</template>
			<template v-if="column.type === 'keywords'">
				<harver-tags
					v-if="record[column.dataIndex]"
					:content="record[column.dataIndex].split(',').map((item: string) => {

								return {
									content: item,
									maxWidth: 50,
									rows: 1,
									style: {
										textAlign: 'center',
										fontSize: '0.6rem',
										margin:'0px'
									}
								};
							})
						"
					:ellipsis="{
						rows: 1,
					}"
					style="display: flex; flex-wrap: wrap; font-size: 0.6rem; gap: 0.2rem"
					:ellipsisStyle="{
						fontSize: '0.6rem',
					}">
				</harver-tags>
			</template>
			<template v-if="column.type === 'time'">
				<span
					:style="{
						fontSize: '0.6rem',
					}"
					>{{ dayjs(record[column.dataIndex]).format('YYYY-MM-DD HH:mm:ss') }}</span
				>
			</template>
			<template v-if="column.type === 'switch'">
				<a-switch
					v-model:checked="record[column.dataIndex]"
					@change="() => updateArticle(record)" />
			</template>
			<template v-if="column.type === 'image'">
				<a-image
					:width="40"
					:src="record[column.dataIndex]"
					:fallback="errorImg"
					:preview="{
						src: record[column.dataIndex],
					}" />
			</template>
			<template v-if="column.type === 'qa'">
				<harver-tags
					:content="record[column.dataIndex].map((item:IArticleCard['questions'][number]) => {
							return {
								content: item.q,
								rows: 1,

								style: {
									textAlign: 'center',
									fontSize: '0.6rem',
									margin: '0px',
								},
								tooltip: {
									enable: !!item.a,
									content:item.a
								}
							};
						})
					"
					:ellipsis="{
						rows: 1,
					}"
					style="display: flex; font-size: 0.6rem; gap: 0.2rem"
					:ellipsisStyle="{
						fontSize: '0.6rem',
					}">
				</harver-tags>
			</template>
			<template v-if="column.type === 'controller'">
				<div style="display: flex; justify-content: center">
					<harver-button
						size="small"
						@click="() => edit(record)"
						>修改</harver-button
					>
					<harver-button
						size="small"
						@click="() => updateSEO(record)"
						>更新文章SEO</harver-button
					>
					<harver-button
						size="small"
						@click="() => deleteArticle(record)"
						>删除</harver-button
					>
				</div>
			</template>
		</template>
	</a-table>
	<a-pagination
		style="margin-top: 20px"
		v-model:pageSize="pageState.limit"
		v-model:current="pageState.page"
		:showSizeChanger="true"
		:hideOnSinglePage="false"
		:pageSizeOptions="[10, 20, 30, 50]"
		:total="pageState.count" />
	<ArticleInfo
		v-if="editDataSource"
		ref="articleFormRef"
		:operateType="'update'"
		:onOk="updateArticle"
		:data="editDataSource"
		v-model:open="isOpenDialog" />
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { client } from '@blog_admin/utils/client';
import { IArticleCard } from '@blog_admin/utils/parseMarkdown';
import ArticleInfo from '@blog_admin/components/article-info.vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import errorImg from '@blog_admin/assets/error-img';
const articleList = ref<IArticleCard[]>([]);
const articleFormRef = ref();
const isOpenDialog = ref(false);
const editDataSource = ref<null | IArticleCard>(null);
const pageState = reactive({
	page: 1,
	limit: 10,
	count: -1,
});
const getArticleList = async () => {
	const res = await client.getArticleList({
		limit: pageState.limit,
		offset: pageState.limit * (pageState.page - 1),
		catalog: '',
		id: '',
		is_reverse: 0,
	});
	if (!res) return;
	articleList.value = res.list;
	pageState.count = res.count;
};
watch(
	() => pageState,
	() => getArticleList(),
	{
		deep: true,
	}
);
onBeforeMount(() => {
	getArticleList();
});
const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
		fixed: 'left',
	},
	{
		title: '文章标题',
		dataIndex: 'title',
		align: 'center',
		fixed: 'left',
		width: '140px',
		type: 'ellipsis',
	},

	{
		title: '目录',
		dataIndex: 'catalog',
		align: 'center',
		type: 'tag',
	},
	{
		title: '标签',
		dataIndex: 'tags',
		align: 'center',
		type: 'tags',
	},
	{
		title: '创建日期',
		dataIndex: 'create_time',
		align: 'center',
		type: 'time',
	},
	{
		title: '更新日期',
		dataIndex: 'update_time',
		align: 'center',
		type: 'time',
	},
	{
		title: '描述',
		dataIndex: 'description',
		align: 'center',
		type: 'ellipsis',
	},
	{
		title: '文章展示图',
		dataIndex: 'pre_img',
		align: 'center',
		type: 'image',
	},
	{
		title: '关键词',
		dataIndex: 'keywords',
		align: 'center',
		type: 'keywords',
	},

	{
		title: '文章权重',
		dataIndex: 'order',
		align: 'center',
		type: 'text',
	},
	{
		title: 'QA',
		dataIndex: 'questions',
		align: 'center',
		type: 'qa',
	},
	{
		title: '访问量',
		dataIndex: 'pv',
		align: 'center',
		type: 'text',
	},
	{
		title: '发布',
		dataIndex: 'publish',
		align: 'center',
		type: 'switch',
	},
	{
		title: '加密',
		dataIndex: 'is_lock',
		align: 'center',
		type: 'switch',
	},
	{
		title: '作者',
		dataIndex: 'auth',
		align: 'center',
		type: 'text',
	},
	{
		title: '操作',
		align: 'center',
		fixed: 'right',
		width: 240,
		type: 'controller',
	},
];
const updateArticle = async (record: IArticleCard) => {
	const res = await client.updateArticle(record);
	if (!res) {
		return;
	}
	getArticleList();
	message.success('修改成功');
};

const edit = (record: IArticleCard) => {
	isOpenDialog.value = true;
	editDataSource.value = record;
};

const updateSEO = async (record: IArticleCard) => {
	if (typeof record.id === 'undefined') return;

	const host = import.meta.env.VITE_BLOGHOST;
	const key = import.meta.env.VITE_INDEXNOWKEY;
	const keyLocation = `${host}/${key}.txt`;
	const url = `${host}/article/${record.id}`;

	const res = await client.updateArticlesSEO({ host, key, keyLocation, urlList: [url] });
	if (res) {
		message.success('更新成功!');
	}
};
const deleteArticle = async (record: IArticleCard) => {
	if (!record.id) return;
	const res = await client.deleteArticle(record.id);
	if (res) {
		message.success('删除成功!');
	}
	getArticleList();
};
</script>
