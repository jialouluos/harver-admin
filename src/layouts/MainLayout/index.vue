<script lang="ts" setup>
import LayoutHeader from './layout-header.vue';
import LayoutMain from './layout-main.vue';
import LayoutAside from './layout-aside.vue';
import { Layout } from 'ant-design-vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { onBeforeMount, ref } from 'vue';

import { useStore } from '@/store';
const { basicStore } = useStore();
onBeforeMount(() => {
	basicStore.init();
});

const isEmbed = basicStore.isEmbed;
const collapsed = ref(false);

const AMenuFoldOutlined = MenuFoldOutlined;

const AMenuUnfoldOutlined = MenuUnfoldOutlined;
</script>

<template>
	<Layout
		class="layout"
		:hasSider="!isEmbed">
		<LayoutAside
			:collapsed="collapsed"
			v-if="!isEmbed" />
		<Layout class="body-layout">
			<LayoutHeader v-if="!isEmbed">
				<template #feat>
					<harver-button
						:shape="'rect'"
						@click="() => (collapsed = !collapsed)">
						<AMenuFoldOutlined v-if="collapsed" />
						<AMenuUnfoldOutlined v-else />
					</harver-button>
				</template>
			</LayoutHeader>
			<LayoutMain />
		</Layout>
	</Layout>
</template>

<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.layout {
	flex-direction: row;
	width: 100%;
	height: 100%;
	gap: rem(1);

	.body-layout {
		gap: rem(1);
	}
}
</style>
