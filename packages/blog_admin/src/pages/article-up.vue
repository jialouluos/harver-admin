<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ name: 'head_route' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>文章管理</el-breadcrumb-item>
			<el-breadcrumb-item>文章上传</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row :gutter="24">
				<div style="display: flex; justify-content: flex-start; align-items: center; padding: 0 10px">
					<el-button
						type="primary"
						@click="() => handleUpload('dir')">
						目录上传
					</el-button>
					<el-button
						type="primary"
						@click="() => handleUpload('multiple')">
						文件上传
					</el-button>
				</div>
			</el-row>
			<div class="file_list">
				<Card
					:info="item"
					v-for="item in pickers"
					:key="item.title"></Card>
			</div>
		</el-card>

		<ArticleInfo
			:articleData="articleInfo"
			:show="isShowArticleInfoModal"
			:updateInfo="updateInfo"
			:cancel="cancel" />
	</div>
</template>

<script>
const ArticleInfo = () => import('@/components/ArticleInfo');
const Card = () => import('@/components/Card');
import { useUploadFileByPick } from '@jialouluo/tools';
import { client } from '@/utils';
import { parseMarkDown } from '../utils/parseMarkdown';

export default {
	name: 'ArticleUp',
	components: {
		ArticleInfo,
		Card,
	},

	data() {
		return {
			articleInfo: null,
			currentShowIndex: -1,
			isShowArticleInfoModal: false,
			pickers: [],
		};
	},
	created() {},
	mounted() {},
	computed: {},
	methods: {
		async handleUpload(type) {
			const data = await useUploadFileByPick({ type, scope: window.adminWindow });
			this.handleArticleMeta(data);
		},
		handleArticleMeta(data) {
			if (!data || !data.length) return [];

			this.pickers = data.map(item => {
				return {
					isUpload: false, //是否已上传
					pv: 0, //访问量
					body: item.context,
					create_time: item.meta.updateTime,
					//下面的字段都支持md文章中配置
					...parseMarkDown(item.context, item.meta),
				};
			});
		},

		updateInfo(data) {
			if (this.currentShowIndex !== -1) {
				this.pickers[this.currentShowIndex] = data;
				this.pickers[this.currentShowIndex].isUpload = true;
			}
			this.cancel();
			const { isUpload, ...other } = data;

			this.commit(other);
		},
		showArticleInfo(articleInfo, index) {
			this.articleInfo = articleInfo;
			this.currentShowIndex = index;
			this.isShowArticleInfoModal = true;
		},
		cancel() {
			this.isShowArticleInfoModal = false;
			this.articleInfo = null;
			this.currentShowIndex = -1;
		},
		//整理文章表单内容
		async commit(data) {
			await client.addArticle({
				...data,
				tags: [...data.tags].sort(),
				create_time: data.create_time === 0 ? new Date().getTime() : data.create_time,
				update_time: new Date().getTime(),
			});
		},
	},
};
</script>

<style lang="less">
.el-breadcrumb {
	margin-bottom: 15px;
	font-size: 12px;
}
.file_list {
	height: auto;
	width: 100%;
	margin: 20px 0px;
	display: grid;
	grid-row-gap: 10px;
	grid-column-gap: 10px;
	grid-template-columns: repeat(5, 1fr);
	.file_item {
		height: 100px;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0.3rem 0.5rem 0.1rem #0000001a;
		transition: all 0.5s;
		transform-origin: center center;
		backface-visibility: hidden;
		&:hover {
			transform: scale(1.02);
		}
		h4 {
			text-align: center;
			width: 100%;
		}
	}
}
</style>
