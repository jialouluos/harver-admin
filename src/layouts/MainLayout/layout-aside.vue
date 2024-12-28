<script lang="ts" setup>
import { computed, reactive, h, watch } from 'vue';
import { rawMenus } from '@/router';

import { useRouter } from 'vue-router';
import { LayoutSider } from 'ant-design-vue';
import { deepHandleObjectFn } from '@jialouluo/tools';

import { PACKAGE_ENUM } from '@jialouluo/configs';
import { useStore } from '@/store';
const props = defineProps<{ collapsed: boolean }>();
// defineProps({
// 	collapsed: {
// 		type: Boolean,
// 		required: true,
// 	},
// });
const state = reactive({
	selectedKeys: ['1'],
	openKeys: [],
	preOpenKeys: [],
});
const router = useRouter();
const store = useStore();

const menus = computed(() => {
	return rawMenus.map(item => {
		return deepHandleObjectFn(item, 'children', {
			handleFn: obj => {
				if (obj.path.includes(PACKAGE_ENUM.BLOG_ADMIN)) {
					//注入子应用路由菜单
					return {
						key: obj.path,
						icon: () => (obj.meta.icon ? h(obj.meta.icon) : null),
						label: obj.meta.title,
						title: obj.meta.title,
						children: store.blogAdminStore.microRouteMenu,
					};
				}

				return {
					key: obj.path,
					icon: () => (obj.meta.icon ? h(obj.meta.icon) : null),
					label: obj.meta.title,
					title: obj.meta.title,
				};
			},
		});
	});
});

watch(
	() => state.openKeys,
	(_val, oldVal) => {
		state.preOpenKeys = oldVal;
	}
);

const handleMenuClick = (menu: { key: string; keyPath: string[] }) => {
	const path = menu.keyPath.join('/');
	router.push(path);
};
</script>
<template>
	<LayoutSider
		class="layout_aside"
		theme="light"
		v-model:collapsed="props.collapsed"
		:trigger="null"
		collapsible>
		<a-menu
			v-model:openKeys="state.openKeys"
			v-model:selectedKeys="state.selectedKeys"
			theme="light"
			:items="menus"
			@click="handleMenuClick"
			mode="inline">
		</a-menu
	></LayoutSider>
</template>

<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.layout_aside {
	width: max-content;
	@include card;

	background-color: col(grey-1);
	transform: translateZ(0); // 单独给一个合成层

	:deep(.ant-menu-item-selected) {
		@include card(0.125, 0.125);
	}

	:deep(.ant-menu-item-active) {
		@include bg_hover;
		@include text_hover;

		transition: all 0.3s;
	}
}
</style>
