<template>
	<el-container class="head">
		<el-header>
			<span>博客后台</span>
			<el-button
				type="text"
				@click="exit"
				style="font-size: 20px; color: #515151"
				>退出</el-button
			>
		</el-header>
		<el-container class="body">
			<el-aside width="200px">
				<el-menu
					background="rgba(174, 208, 249, 0.7)"
					text-color="#515151"
					active-text-color="#b355c9"
					:default-active="activeIndex"
					:router="true">
					<template v-for="item in menuList.filter(item => item.enable)">
						<el-submenu
							:index="item.path"
							:key="item.path"
							v-if="item.children.length && item.enable">
							<template slot="title">
								<i
									:class="item.icon"
									class="ic"
									style="margin-right: 2px"></i>
								<span>{{ item.menuName }}</span>
							</template>
							<el-menu-item
								:index="item2.path"
								v-for="item2 in item.children.filter(item => item.enable)"
								:key="item2.path">
								<template slot="title">
									<i
										:class="item2.icon"
										class="ic"
										style="margin-right: 2px"></i>
									<span>{{ item2.menuName }}</span>
								</template>
							</el-menu-item>
						</el-submenu>
						<el-menu-item
							:index="item.path"
							:key="item.path"
							v-if="!item.children.length">
							<template slot="title">
								<i
									:class="item.icon"
									class="ic"
									style="margin-right: 2px"></i>
								<span>{{ item.menuName }}</span>
							</template>
						</el-menu-item>
					</template>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			menuList: [
				{
					menuName: '文章管理',
					path: 'article_manage',
					enable: true,
					icon: '',
					children: [
						{
							menuName: '文章上传',
							path: 'article_up',
							children: [],
							enable: true,
							icon: '',
						},
						{
							menuName: '文章列表',
							path: 'article_list',
							children: [],
							enable: true,
							icon: '',
						},
						{
							menuName: '分类管理',
							path: 'category_list',
							children: [],
							enable: false,
							icon: '',
						},
						{
							menuName: '评论管理',
							path: 'comment_list',
							children: [],
							enable: false,
							icon: '',
						},
					],
				},
				{
					menuName: '目录管理',
					path: 'catalog_manage',
					enable: true,
					icon: '',
					children: [
						{
							menuName: ' 目录列表',
							path: 'catalog_list',
							enable: true,
							icon: '',
						},
					],
				},
			],
		};
	},
	created() {},
	methods: {
		exit() {
			window.sessionStorage.clear();
			this.$store.dispatch('init_store');
			this.$router.replace('/login');
			this.$message.success('退出成功！');
		},
	},
	computed: {
		activeIndex() {
			const path = this.$route.path.split('/');
			return path[path.length - 1];
		},
	},
};
</script>

<style lang="less" scoped>
@color: #515151;

.head {
	height: 100%;
	position: relative;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	background: linear-gradient(
		to right bottom,
		rgba(106, 160, 225, 0.7),
		rgba(234, 163, 248, 0.5),
		rgba(70, 194, 224, 0.4)
	);
	.el-header {
		background: linear-gradient(
			to right bottom,
			rgba(255, 255, 255, 0.7),
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.4)
		);
		color: @color;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 20px;
	}
}

.body {
	background: linear-gradient(
		to right bottom,
		rgba(255, 255, 255, 0.7),
		rgba(255, 255, 255, 0.5),
		rgba(255, 255, 255, 0.4)
	);
	.el-aside {
		background: linear-gradient(
			to bottom,
			rgba(164, 198, 239, 0.7),
			rgba(232, 179, 243, 0.5),
			rgba(154, 221, 237, 0.4)
		);
	}

	.el-main {
		// background-color: rgba(0, 0, 0, 0.15) !important;
		overflow-x: hidden;
		position: relative;
		padding: 10px;
		box-sizing: border-box;
	}
}
</style>
