<script lang="ts" setup>
import LayoutHeader from './layout-header.vue';
import LayoutMain from './layout-main.vue';
import LayoutAside from './layout-aside.vue';
import { Layout } from 'ant-design-vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useGo } from '@/hooks/usePage';

const collapsed = ref(false);

const AMenuFoldOutlined = MenuFoldOutlined;

const AMenuUnfoldOutlined = MenuUnfoldOutlined;

useGo();
</script>

<template>
	<Layout
		class="layout"
		:hasSider="true">
		<LayoutAside :collapsed="collapsed" />
		<Layout class="body-layout">
			<LayoutHeader>
				<template #feat>
					<a-button @click="() => (collapsed = !collapsed)">
						<AMenuFoldOutlined v-if="collapsed" />
						<AMenuUnfoldOutlined v-else />
					</a-button>
				</template>
			</LayoutHeader>
			<LayoutMain />
		</Layout>
	</Layout>
</template>

<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.layout {
	width: 100%;
	height: 100%;
	flex-direction: row;
	gap: rem(1);

	.body-layout {
		gap: rem(1);
	}
}
</style>
