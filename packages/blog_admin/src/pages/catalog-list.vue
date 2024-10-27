<template>
	<div class="list">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ name: 'head_route' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>目录管理</el-breadcrumb-item>
			<el-breadcrumb-item>目录列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-button
				type="primary"
				@click="handleAddCatalog"
				>新增
			</el-button>
			<el-table
				style="width: 100%"
				max-height="600"
				:data="catalogList">
				<el-table-column label="目录pid">
					<template slot-scope="scope">
						<el-tooltip
							effect="dark"
							:content="scope.row.pid + ''"
							placement="top">
							<el-tag
								size="info"
								style="width: 100%"
								class="cont"
								>{{ scope.row.pid }}</el-tag
							>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="目录id">
					<template slot-scope="scope">
						<el-tooltip
							effect="dark"
							:content="scope.row.id + ''"
							placement="top">
							<el-tag
								size="info"
								style="width: 100%"
								class="cont"
								>{{ scope.row.id }}</el-tag
							>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="目录名称">
					<template slot-scope="scope">
						<el-tooltip
							effect="dark"
							:content="scope.row.name"
							placement="top">
							<el-tag
								size="info"
								style="width: 100%"
								class="cont"
								>{{ scope.row.name }}</el-tag
							>
						</el-tooltip>
					</template>
				</el-table-column>

				<el-table-column
					label="操作"
					width="240"
					align="right">
					<template slot-scope="scope">
						<el-button
							type="primary"
							size="mini"
							@click="() => handleChangeData(scope.row)"
							>更改</el-button
						>
						<el-button
							type="danger"
							size="mini"
							@click="() => deleteCatalog(scope.row)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				@size-change="handSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.page"
				:page-sizes="[3, 5, 10, 15]"
				:page-size="queryInfo.limit"
				layout="total, sizes, prev, pager, next, jumper"
				:total="count">
			</el-pagination>
		</el-card>
		<el-dialog
			:visible="showDialog"
			class="article_info"
			width="80%"
			:before-close="() => cancel()">
			<el-form
				:label-position="'top'"
				:model="form"
				:rules="inputFormRules"
				ref="catalogRef">
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item
							prop="pid"
							label="父级目录">
							<el-select
								v-model="form.pid"
								placeholder="请选择pid"
								:filterable="true"
								style="width: 100%">
								<el-option
									v-for="item in catalogOptions"
									:key="item.label"
									:label="item.label"
									:value="item.value"
									:disabled="item.value === form.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="目录名称">
							<el-input
								v-model="form.name"
								placeholder="请输入目录名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-row :gutter="24">
				<div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 10px">
					<el-button
						type="primary"
						@click="updateCatalog"
						>{{ updateType === 'add' ? '新增' : '更新' }}
					</el-button>
				</div>
			</el-row>
		</el-dialog>
	</div>
</template>
<script>
import { client } from '@/utils';

export default {
	name: 'Home',
	components: {},
	data() {
		return {
			catalogList: [],
			queryInfo: {
				limit: 10,
				page: 1,
			},
			count: 0, //数据的总数
			showDialog: false,
			form: {
				pid: -1,
				name: '',
			},
			updateType: 'add',
			isShowPreview: false,
			catalogOptions: [],
			inputFormRules: {
				pid: [{ required: true, message: '请选择pid', trigger: ['blur', 'change'] }],
				name: [
					{ required: true, message: '请输入目录名称', trigger: 'blur' },
					{
						min: 1,
						message: '长度必须大于1',
						trigger: 'blur',
					},
				],
			},
		};
	},
	created() {
		this.getCatalogList();
	},

	methods: {
		async getCatalogList() {
			const data = await client.getCatalogList(this.queryInfo.limit, this.queryInfo.limit * (this.queryInfo.page - 1));
			if (!data) return (this.catalogList = []);
			console.log(data);
			this.catalogList = data.list;
			this.count = data.count;
			this.catalogOptions = [
				{ label: '根目录', value: -1 },
				...data.all.map(item => ({
					label: item.name,
					value: item.id,
				})),
			];
			console.log(this.catalogOptions);
		},
		handleAddCatalog() {
			this.updateType = 'add';
			this.showDialog = true;
		},
		handleChangeData(data) {
			this.form = data;
			this.showDialog = true;
			this.updateType = 'update';
		},
		async updateCatalog() {
			this.$refs.catalogRef.validate(vaild => {
				//vaild为验证结果
				if (!vaild) return this.$message.error('提交信息失败，请检查是否信息信息填写完整！');
				try {
					this.updateInfo(this.form, this.updateType);
				} catch (err) {
					this.$message.error('储存失败，请检查是否数据提供完整！');
				}
			});
		},
		async updateInfo(data, type) {
			if (type === 'add') {
				await client.addCatalog({
					pid: data.pid,
					name: data.name,
				});
			} else if (type === 'update') {
				await client.updateCatalog({
					pid: data.pid,
					id: data.id,
					name: data.name,
				});
			}

			this.cancel();
			this.getCatalogList();
		},
		deleteCatalog(dataInfo) {
			//删除文章
			this.$alert('该操作会删除该目录,是否继续?', '提示', {
				confirmButtonText: '确定',
				callback: async action => {
					if (action === 'confirm') {
						await client.deleteCatalog(dataInfo.id);
						this.getCatalogList();
					} else {
						this.$message.info('操作取消');
					}
				},
			});
		},
		handSizeChange(newSize) {
			this.queryInfo.limit = newSize;
			this.getCatalogList();
		},
		handleCurrentChange(newNum) {
			this.queryInfo.page = newNum;
			this.getCatalogList();
		},
		cancel() {
			this.form = {
				pid: -1,
				name: '',
			};
			this.showDialog = false;
		},
	},
};
</script>

<style scoped lang="less">
.article_info {
	.el-form-item {
		margin: 0px 0px 20px 0px;
		padding: 0px;

		.el-form-item__label {
			font-size: 18px;
			margin: 0px;
			padding: 0px 0px;

			&::before {
				color: #3b5edf;
			}

			.el-input {
				margin: 0px 0px 0px 0px;
				padding: 0px;
			}
		}

		.el-form-item__error {
			color: #3b5edf;
		}
	}
}
</style>
