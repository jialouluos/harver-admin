<script lang="ts">
import Divide from '../divider/index.vue';
import { useClassName, usePrefixCls } from '../../hooks';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
	name: 'harver-b-code',
};
</script>
<script lang="ts" setup>
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const props = withDefaults(
	defineProps<{
		type?: string;
		code?: string;
		demoKey?: string;
	}>(),
	{
		type: 'javascript',
		code: '',
		demoKey: '',
	}
);
const CN = CNGenerator(Symbol('b-code'));
const displayRef = ref<HTMLElement>();
const sourceCodeShow = ref(false);
const route = useRoute();

onMounted(() => {
	handleRequestFullScreen();
});
const handleRequestFullScreen = () => {
	const demoKey = typeof route.query.demoKey === 'string' ? route.query.demoKey : '';
	if (props.demoKey && demoKey && displayRef.value) {
		if (demoKey === props.demoKey) {
			displayRef.value.classList.add('fullscreen');
		} else {
			displayRef.value.style.display = 'none';
		}
	}
};
const generateShareURL = async (e: MouseEvent, key: string, type: 'url' | 'iframe') => {
	const query = new URLSearchParams({
		embed: 'true',
		demoKey: key,
	});
	const val =
		type === 'url'
			? `${window.location.origin}${window.location.pathname}?${query.toString()}`
			: `<iframe src="${window.location.origin}${
					window.location.pathname
			  }?${query.toString()}" loading="lazy" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" allowfullscreen="" style="height:100vh"></iframe>`;
	try {
		if (navigator.clipboard && navigator.permissions) {
			await navigator.clipboard.writeText(val);
		}
	} catch (err) {
		try {
			const textArea = document.createElement('textArea') as HTMLTextAreaElement;
			textArea.value = val;
			textArea.style.width = '0px';
			textArea.style.position = 'fixed';
			textArea.style.left = '-999px';
			textArea.style.top = '10px';
			textArea.setAttribute('readonly', 'readonly');
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
		} catch (err2) {
			console.error(err || err2 || 'copy error');
		}
	}
};
const handleShowSourceCode = () => {
	sourceCodeShow.value = !sourceCodeShow.value;
};
</script>

<template>
	<div
		:class="[CN.C('b-code', 0)]"
		ref="displayRef">
		<div
			:class="[CN.C('title', 1)]"
			v-if="demoKey && !route.query.demoKey">
			<h2 @click="e => generateShareURL(e, demoKey, 'url')">创建分享链接</h2>
			<h2 @click="e => generateShareURL(e, demoKey, 'iframe')">创建分享iframe</h2>
		</div>
		<div :class="[CN.R('content', 1)]">
			<div :class="[CN.C('desc', 2)]"><slot name="desc"></slot></div>
			<div :class="[CN.C('gui', 2)]">
				<slot name="gui"></slot>
				<harver-button
					:size="'small'"
					style="width: max-content"
					@click="handleShowSourceCode"
					>{{ sourceCodeShow ? '隐藏源码' : '显示源码' }}</harver-button
				>
			</div>

			<Divide :container-style="{ margin: '0px' }" />
			<div :class="[CN.C('display-root', 2)]">
				<slot></slot>
			</div>
			<Divide :container-style="{ marginTop: '0px' }" />

			<highlightjs
				v-if="sourceCodeShow"
				:language="type"
				:code="code" />
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-b-code {
		margin: rem(1) 0;

		&-title {
			@include flex_center;

			gap: rem(1);

			h2 {
				@include title;
				@include card;
				@include pointer;

				display: inline-flex;
				margin: 0;
				padding: 0 rem(2);
				border: none;
				border-radius: rem(0.5) rem(0.5) 0 0;
				width: auto;
			}
		}

		&-content {
			position: relative;

			&-desc {
				display: flex;
				margin: rem(0.5) 0;
				padding: 0 rem(1);
				width: 100%;
				height: auto;
				min-height: 0;
			}

			&-gui {
				display: grid;
				align-items: center;
				margin: rem(0.5) 0;
				padding: 0 rem(1);
				width: 100%;
				gap: rem(1);
				grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr));
			}

			&-display-root {
				display: flow-root;
				position: relative;
				padding: rem(1);
			}

			&-code {
				display: flex;
				flex-direction: column;
				gap: rem(1);

				&-feat-wrapper {
					display: flex;
					padding: 0 rem(1);
					width: 100%;
				}
			}

			pre {
				margin: 0;
				border-radius: 0 0 rem(0.25) rem(0.25);

				code {
					color: #fff;
					white-space: pre-wrap;
				}
			}
			@include card(0.5, 0.25, 'highlight');

			padding: 0;
		}
	}
}
</style>
<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.fullscreen {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9999;
	margin: 0 !important;
	width: 100vw;
	height: 100vh;
	background-color: col(box-bg);
}
</style>
