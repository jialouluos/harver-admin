<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { ExceptionEnum } from '../enums/ExceptionEnum';
import { useRoute } from 'vue-router';
import { useGo } from '@/hooks/usePage';
import { PageEnum } from '@/enums/PageEnum';
interface MapValue {
	title: string;
	subTitle: string;
	btnText?: string;
	icon?: string;
	handler?: any;
	status?: ExceptionEnum;
}
const props = defineProps({
	status: {
		type: Number as PropType<number>,
		default: ExceptionEnum.Not_Found,
	},
	title: {
		type: String as PropType<string>,
		default: '',
	},
});
const { params } = useRoute();

const go = useGo();
const statusMap = ref(new Map<ExceptionEnum, MapValue>());

const isInPrefabStatus = (status: number) => {
	switch (status) {
		case ExceptionEnum.Bad_Gateway:
		case ExceptionEnum.NET_WORK_ERROR:
		case ExceptionEnum.Forbidden:
		case ExceptionEnum.Not_Found:
		case ExceptionEnum.Server_Error:
		case ExceptionEnum.Service_Unavailable:
		case ExceptionEnum.Timeout:
		case ExceptionEnum.Unauthorized: {
			return true;
		}
		default: {
			return false;
		}
	}
};

const status = computed(() => {
	const _status = Number(params.status[1]);
	return isInPrefabStatus(_status) ? _status : props.status;
});

statusMap.value.set(ExceptionEnum.Unauthorized, {
	title: 'Unauthorized',
	status: ExceptionEnum.Unauthorized,
	subTitle: '身份验证异常',
	handler: () => go(PageEnum.LOGIN_PAGE),
});

statusMap.value.set(ExceptionEnum.Forbidden, {
	title: 'Forbidden',
	status: ExceptionEnum.Forbidden,
	subTitle: '权限过低',
	handler: () => go(PageEnum.BASE_PAGE),
});

statusMap.value.set(ExceptionEnum.Not_Found, {
	title: 'Not Found',
	status: ExceptionEnum.Not_Found,
	subTitle: '资源未找到',
	handler: () => go(PageEnum.BASE_PAGE),
});

statusMap.value.set(ExceptionEnum.Server_Error, {
	title: 'ServerError',
	status: ExceptionEnum.Server_Error,
	subTitle: '服务器错误',
	handler: () => go(PageEnum.BASE_PAGE),
});

statusMap.value.set(ExceptionEnum.Bad_Gateway, {
	title: 'Bad Gateway',
	status: ExceptionEnum.Bad_Gateway,
	subTitle: '响应错误',
	handler: () => go(PageEnum.BASE_PAGE),
});

statusMap.value.set(ExceptionEnum.Service_Unavailable, {
	title: 'Service Unavailable',
	status: ExceptionEnum.Service_Unavailable,
	subTitle: '服务器宕机',
	handler: () => go(PageEnum.BASE_PAGE),
});

statusMap.value.set(ExceptionEnum.Timeout, {
	title: 'Service Timeout',
	status: ExceptionEnum.Timeout,
	subTitle: '请求超时',
	handler: () => go(PageEnum.BASE_PAGE),
});

statusMap.value.set(ExceptionEnum.NET_WORK_ERROR, {
	title: 'NET WORK ERROR',
	status: ExceptionEnum.NET_WORK_ERROR,
	subTitle: '网络异常',
	handler: () => go(PageEnum.BASE_PAGE),
});

const currentStatusValue = computed(() => {
	return statusMap.value.get(status.value);
});
</script>
<template>
	<a-result
		:status="status"
		:title="props.title || currentStatusValue?.title || 'Error Page'"
		:sub-title="currentStatusValue?.subTitle || ''">
		<template #extra>
			<a-button
				v-if="currentStatusValue?.handler"
				type="primary"
				@click="currentStatusValue?.handler"
				>Back Home</a-button
			>
		</template>
	</a-result>
</template>
