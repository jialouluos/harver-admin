<script lang="ts" setup>
import { IArticleCard, parseMarkDown, PickerArticleFiled } from '@blog_admin/utils/parseMarkdown';
import { useUploadFileByPick } from '@jialouluo/tools';
import { useClassName, usePrefixCls } from '@jialouluo/tools/src/components/vue/hooks/index.ts';
import { ref } from 'vue';
import Card from '@blog_admin/components/card.vue';
import { client } from '@blog_admin/utils/client';

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('article-up'));
const pickers = ref<Record<PickerArticleFiled, any>[]>([]);
const handleUpload = async (type: 'multiple' | 'single' | 'dir') => {
	const data = await useUploadFileByPick({ type, scope: window.blogAdminWindow });
	if (!data || !data.length) return;
	console.log(data);
	pickers.value = pickers.value.concat(
		data.map(item => {
			return {
				pv: 0, //访问量
				body: item.context,
				create_time: item.meta.updateTime,
				//下面的字段都支持md文章中配置
				...parseMarkDown(item.context, item.meta),
			};
		})
	);
};
// //整理文章表单内容
const commit = async (data: IArticleCard, index: number) => {
	pickers.value[index] = { ...pickers.value[index], ...data };
	return await client.putArticle({
		...data,
		tags: [...data.tags].sort(),
		create_time: data.create_time === 0 ? new Date().getTime() : data.create_time,
		update_time: new Date().getTime(),
	});
};
</script>
<template>
	<div>
		<div :class="CN.R('feat-box', 0)">
			<harver-button @click="handleUpload('dir')">目录上传</harver-button>
			<harver-button @click="handleUpload('multiple')">文件上传</harver-button>
		</div>

		<div :class="CN.R('article-card', 0)">
			<div>
				<Card
					v-for="(item, index) in pickers"
					:sources="item"
					:key="index"
					:commit="data => commit(data, index)" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-feat-box {
		@include card(0.25);

		height: rem(4);
		@include flex_start;
	}

	&-article-card {
		@include card(0.25);

		margin-top: rem(4);

		& > div {
			@include flex_start;
			@include flex_wrap;
			@include scrollbar;

			overflow: auto;
			padding: rem(1);
			height: 64vh;
			gap: rem(1);
		}
	}
}
</style>
