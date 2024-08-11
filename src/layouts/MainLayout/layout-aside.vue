<script lang="ts" setup>
import { computed, reactive, h, watch } from 'vue';
import { rawMenus } from '@/router';

import { useRouter } from 'vue-router';
import { LayoutSider } from 'ant-design-vue';
import { deepHandleObjectFn } from '@jialouluo/tools';
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

const menus = computed(() => {
	return rawMenus.map(item => {
		return deepHandleObjectFn(item, 'children', {
			handleFn: obj => {
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
console.log(menus);
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

<style lang="scss">
@import '@/styles/global';

.layout_aside {
	width: max-content;
	@include supper_box(0.5) {
		& > * {
			padding: rem(0.5);
		}
	}
}

.ant-menu-item-selected {
	@include supper_box(0.125) {
		& > * {
			padding: 0;
			background-color: initial;
			border: none;
			box-shadow: none;
		}
	}
}
</style>
