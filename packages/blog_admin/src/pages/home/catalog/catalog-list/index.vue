<template>
	<div style="margin-bottom: 20px">
		<harver-button @click="add">新增</harver-button>
	</div>
	<a-table
		:columns="columns"
		:data-source="catalogList"
		:scroll="{ x: 1000 }"
		bordered
		:pagination="false">
		<template #bodyCell="{ column, record }">
			<template v-if="column.type === 'id'">
				<a-tag color="purple">
					{{ record[column.dataIndex] }}
				</a-tag>
			</template>
			<template v-if="column.type === 'tag'">
				<harver-tag :content="getCatalogForId(record[column.dataIndex])"> </harver-tag>
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
						@click="() => deleteCatalog(record)"
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
	<CatalogForm
		:type="optType"
		v-if="editDataSource"
		:onOk="optType === 'update' ? updateCatalog : addCatalog"
		:data="editDataSource"
		v-model:open="isOpenDialog" />
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { client } from '@blog_admin/utils/client';

import CatalogForm from '@blog_admin/components/catalog-form.vue';
import { message } from 'ant-design-vue';
import { CatalogFiled, CatalogInfo } from '@blog_admin/types';
const optType = ref<'add' | 'update'>('add');
const catalogList = ref<CatalogInfo[]>([]);
const allCatalogList = ref<CatalogInfo[]>([]);
const isOpenDialog = ref(false);
const editDataSource = ref<null | CatalogFiled>(null);
const pageState = reactive({
	page: 1,
	limit: 10,
	count: -1,
});
const columns = [
	{
		title: '目录Id',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
		type: 'id',
	},
	{
		title: '目录名称',
		dataIndex: 'id',
		align: 'center',
		type: 'tag',
	},
	{
		title: '父目录Id',
		dataIndex: 'pid',
		align: 'center',
		type: 'id',
	},
	{
		title: '父目录名称',
		dataIndex: 'pid',
		align: 'center',
		type: 'tag',
	},
	{
		title: '操作',
		align: 'center',
		fixed: 'right',
		type: 'controller',
	},
];
const getCatalogList = async () => {
	const res = await client.getCatalogList({
		limit: pageState.limit,
		offset: pageState.limit * (pageState.page - 1),
	});
	if (!res) return;
	catalogList.value = res.list;
	allCatalogList.value = [{ id: -1, name: '根节点', pid: -1 }, ...res.all];
	pageState.count = res.count;
};
const getCatalogForId = (id: number) => {
	return allCatalogList.value.find(item => item.id === id)?.name ?? '';
};

const updateCatalog = async (record: CatalogFiled) => {
	const res = await client.updateCatalog(record);
	if (!res) {
		return;
	}
	getCatalogList();
	message.success('修改成功');
};
const addCatalog = async (record: CatalogFiled) => {
	const res = await client.addCatalog(record);
	if (!res) {
		return;
	}
	getCatalogList();
	message.success('修改成功');
};
const deleteCatalog = async (record: CatalogFiled) => {
	if (!record.id) return;
	const res = await client.deleteCatalog(record.id);
	if (res) {
		message.success('删除成功!');
	}
	getCatalogList();
};
const edit = (record: CatalogFiled) => {
	isOpenDialog.value = true;
	optType.value = 'update';
	editDataSource.value = record;
};
const add = () => {
	isOpenDialog.value = true;
	optType.value = 'add';
	editDataSource.value = {
		name: '',
		pid: -1,
	};
};
watch(
	() => pageState,
	() => getCatalogList(),
	{
		deep: true,
	}
);
onBeforeMount(() => {
	getCatalogList();
});
</script>
