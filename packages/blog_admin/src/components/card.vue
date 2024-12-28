<script lang="ts" setup>
import { useClassName, usePrefixCls } from '@jialouluo/tools/src/components/vue/hooks/index';
import Tag from '@jialouluo/tools/src/components/vue/harver-ui/tag/index.vue';
import Text from '@jialouluo/tools/src/components/vue/harver-ui/text/index.vue';
import Divider from '@jialouluo/tools/src/components/vue/harver-ui/divider/index.vue';
import ArticleInfo from './article-info.vue';
import { IArticleCard } from '@blog_admin/utils/parseMarkdown';
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
const props = withDefaults(
	defineProps<{
		sources: IArticleCard;
		commit: (article: IArticleCard) => Promise<IArticleCard[] | void>;
	}>(),
	{
		sources: () => ({} as IArticleCard),
	}
);
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('modal'));

const isOpenDialog = ref(false);
const isUpload = ref(false);
const isHasError = ref(false);
const articleFormRef = ref();

const openDialog = () => {
	isOpenDialog.value = true;
};
const beforeUpdateArticle = () => {
	articleFormRef.value?.handleValidate(
		async (data: IArticleCard) => {
			isHasError.value = false;
			updateFile(data);
		},
		() => {
			isHasError.value = true;
			message.error('存在必填字段未填写');
		}
	);
};
const updateFile = async (article: IArticleCard) => {
	const res = await props.commit(article);

	if (res || isUpload) {
		isUpload.value = true;
		message.success('文章已上传');
	}
};
</script>

<template>
	<div :class="[CN.C('card', 0), isHasError ? CN.C('card-error', 0) : '', isUpload ? CN.C('card-upload', 0) : '']">
		<header :class="CN.C('header', 1)">
			<div :class="CN.C('title', 2)">
				<div :class="CN.C('left', 3)">
					<EyeOutlined v-if="sources.publish" />
					<EyeInvisibleOutlined v-else />
				</div>
				<h2>{{ sources.title }}</h2>
				<div :class="CN.C('right', 3)">
					<LockOutlined v-if="sources.is_lock" />
					<UnlockOutlined v-else />
				</div>
			</div>
			<div :class="CN.R('meta', 2)">
				<div :class="CN.C('img', 3)">
					<img
						v-lazy
						:src="sources.pre_img"
						alt="" />
				</div>
				<div :class="CN.R('info', 3)">
					<Text :content="sources.auth"></Text>
					<div :class="CN.C('catalog', 4)">
						<Tag :content="sources.catalog"></Tag>
					</div>
				</div>
			</div>
			<Divider
				:containerStyle="{ margin: '0' }"
				:content="'文章描述'"
				:contentStyle="{
					fontSize: '0.8rem',
					fontWeight: 600,
				}" />
			<div :class="CN.R('desc', 2)">
				<div>
					<Text
						:ellipsis="{
							rows: 3,
						}"
						supperLazy
						:content="sources.description" />
				</div>
			</div>
		</header>
		<Divider :containerStyle="{ margin: '0' }" />
		<main :class="CN.R('main', 1)">
			<div>
				<div :class="CN.C('row', 2)">
					<Text
						class="label"
						:content="'更新时间:'"></Text>
					<Tag
						:type="'grey'"
						:content="dayjs(sources.update_time).format('YYYY-MM-DD HH:mm:ss')"
						:rows="1"></Tag>
				</div>
				<div :class="CN.C('row', 2)">
					<Text
						class="label"
						:content="'创建时间:'"></Text>
					<Tag
						:type="'grey'"
						:content="dayjs(sources.create_time).format('YYYY-MM-DD HH:mm:ss')"
						:rows="1"></Tag>
				</div>
				<div :class="CN.C('row', 2)">
					<Text
						class="label"
						:content="'标签:'"></Text>
					<Tag
						v-for="(tag, index) in sources.tags"
						:content="tag"
						:rows="1"
						:key="index"
						:max-width="'3rem'"></Tag>
				</div>
				<div :class="CN.C('row', 2)">
					<Text
						class="label"
						:content="'关键词:'"></Text>
					<Tag
						v-if="sources.keywords"
						v-for="(keyword, index) in sources.keywords.split(',')"
						:content="keyword"
						:max-width="'3rem'"
						:key="index + 'keywords'"
						:rows="1"></Tag>
				</div>
				<div :class="CN.C('row', 2)">
					<Text
						class="label"
						:content="'文章排序权重:'"></Text>
					<Text
						class="label"
						:content="sources.order + ''"></Text>
				</div>
			</div>
		</main>
		<footer :class="[CN.C('footer', 1), CN.F()]">
			<harver-button @click="beforeUpdateArticle">上传</harver-button>
			<harver-button @click="openDialog">查看</harver-button>
		</footer>
	</div>
	<ArticleInfo
		ref="articleFormRef"
		:onOk="updateFile"
		:data="sources"
		v-model:open="isOpenDialog" />
</template>
<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-card {
		@include card(0.5, 0.25, 'simple');
		@include flex_wrap;

		flex: 20%;
		padding-bottom: rem(1);
		width: rem(16);
		max-width: 25%;
		gap: rem(1);

		&-header {
			@include flex_start;

			flex-wrap: wrap;
			flex: 3;
			width: 100%;
			gap: rem(0.4);

			&-title {
				@include title;
				@include flex_center;

				position: relative;
				padding: rem(0) rem(0.5);
				width: 100%;
				height: rem(2);
				font-weight: 500;

				& > div {
					flex: 0 0 rem(1);
					font-size: rem(0.8);
				}

				& > h2 {
					flex: auto;
					@include title {
						margin: 0;
						padding: rem(0) rem(1);
						border-bottom: none;
						text-align: center;
					}
				}
			}

			&-meta {
				display: flex;
				align-items: center;
				width: 100%;
				gap: rem(0.4);

				&-img {
					overflow: hidden;
					box-sizing: border-box;
					width: rem(1.5);
					height: rem(1.5);
					@include flex_center;
					@include supper_border('default', 0.25, 0.1, 0.75);
					@include pointer;

					background-color: col(grey-1);

					img {
						width: 100%;
						height: 100%;
					}
				}

				&-info {
					align-items: center;
					flex: 1;
					width: 100%;
					background-color: col(grey-1);
					gap: rem(0.4);
					@include flex_wrap;

					&-catalog {
						display: flex;
						align-items: center;
					}
				}
			}

			&-desc {
				overflow: hidden;
				margin: 0 rem(0.5);
				width: 100%;

				/* background-color: col(grey-2); */
				@include border_radius(0.5);
				@include bg_hover(0.2);

				& > div {
					position: relative;
					z-index: 20;

					/* overflow: auto; */
					padding: rem(0.5) rem(0.3) rem(0.5) rem(0.5);
					height: rem(4);
					@include scrollbar(primary);
					@include scrollbar_hover;

					& span {
						font-size: rem(0.7);
						color: col(text-sub-color);
					}
				}
			}
		}

		&-main {
			@include border_radius(0.5);

			overflow: hidden;
			position: relative;
			margin: 0 rem(0.5);
			width: 100%;
			background-color: col(grey-2);
			box-shadow: inset 0 0 1px rgb(255 255 255), inset 0 0 8px rgb(0 0 0 / 40%);

			/* &:hover {
				box-shadow: 0 0 1px rgb(255 255 255), 0 0 8px rgb(0 0 0 / 40%);
			} */
			&::before {
				position: absolute;
				top: 0;
				z-index: 99;
				width: 100%;
				height: 100%;
				background-color: col(#fff, 0.4);
				pointer-events: none;
				user-select: none;
				content: '';
				@include grass(0.1px);
			}

			& > div {
				@include scrollbar(primary);
				@include scrollbar_hover;
				@include flex_wrap;

				overflow: auto;
				padding: rem(0.5) rem(0.3) rem(0.5) rem(0.5);
				max-height: rem(14);
				gap: rem(0.6);

				& span {
					font-size: rem(0.7);
				}
			}

			&-row {
				display: flex;
				align-items: center;
				gap: rem(0.4);
				width: 100%;
			}
		}

		&-footer {
			width: 100%;
			height: auto;
			@include flex_center;

			& > button {
				width: 100%;
				color: col(primary);
			}
		}
	}

	&-card-error {
		border: rem(0.2) solid #ff4d4f;
	}

	&-card-upload {
		border: rem(0.2) solid #b7eb8f;
	}
}

.label {
	display: flex;
	align-items: center;
	flex: 0 0 auto;
	width: auto;
}
</style>
