<script lang="ts">
import { computed, reactive, ref, watch, nextTick, onScopeDispose, Ref, StyleValue, CSSProperties } from 'vue';
import {
	useClassName,
	usePrefixCls,
	useSharedGlobalEvent,
	on,
} from '@jialouluo/tools/src/components/vue/hooks/index.ts';
import tooltip from '@jialouluo/tools/src/components/vue/harver-ui/tooltip/index.vue';
import Copy from '@jialouluo/tools/src/components/vue/harver-ui/copy/index.vue';
import Measure from '@jialouluo/tools/src/components/vue/harver-ui/measure/index.vue';
import { isPositiveInit } from '@jialouluo/tools';
import { ITextProps } from '@jialouluo/tools/src/types/harver-ui.ts';

export default {
	name: 'harver-text',
};
</script>

<script lang="ts" setup>
const DEFAULT_ROWS = 1;
const props = withDefaults(defineProps<ITextProps>(), {
	content: '',
	ellipsis: () => ({}),
	tooltip: () => ({}),
	measure: () => ({}),
	contentStyle: () => ({}),
});
const state = reactive({
	expand: false, // 展开/收起状态
});

const content = computed(() => props.content);
const ellipsis = computed(() => {
	const { rows, expandable, foldText, expandText, suffix, copy } = props.ellipsis;
	const { enable, content: tooltipContent, ...tooltipConfig } = props.tooltip;
	const { lazy, supperLazy, maxLength, performance } = props.measure;
	const width = !!props.width
		? typeof props.width === 'string'
			? props.width
			: parseFloat(props.width + '') + 'px'
		: undefined;
	const maxWidth = !!props.maxWidth
		? typeof props.maxWidth === 'string'
			? props.maxWidth
			: parseFloat(props.maxWidth + '') + 'px'
		: undefined;
	const isDefaultSuffix = !suffix || suffix === '...';
	const noExpandable = !expandable && !copy;
	const disabledShowMaxLength = !isPositiveInit(maxLength);
	const realPerformance = isDefaultSuffix && noExpandable && disabledShowMaxLength ? performance ?? 'low' : 'high';
	return {
		rows: isPositiveInit(rows) ? Math.max(rows, DEFAULT_ROWS) : undefined,
		expandable: expandable ?? false,
		width,
		maxWidth,
		maxLength: maxLength ?? undefined,
		foldText: foldText || '收起',
		expandText: expandText || '展开',
		lazy,
		supperLazy,
		enableTooltip: enable,
		suffix: suffix ?? '...',
		performance: realPerformance,
		tooltipConfig,
		tooltipContent: tooltipContent ?? props.content,
		copy,
	};
});

const disabledMeasure = computed(() => {
	// if (ellipsis.value.width) return false;
	return !ellipsis.value.rows || state.expand;
});

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('text-tooltip'));

const handleExpandable = () => {
	state.expand = !state.expand;
};

</script>
<template>
	<Measure
		:content
		:disabled="disabledMeasure"
		:contentStyle
		:style="{
			width: ellipsis.width,
			maxWidth: ellipsis.maxWidth,
			...$attrs.style as CSSProperties
		}"
		v-bind="ellipsis">
		<template #content="{ cutContent, bindContentRef, needEllipsis }">
			<tooltip
				:class="[CN.C('text', 0)]"
				:ref="tooltipRef => bindContentRef((tooltipRef as any)?.triggerRef)"
				:disabled="!(ellipsis.enableTooltip ?? needEllipsis)"
				:content="ellipsis.tooltipContent"
				v-bind="ellipsis.tooltipConfig"
				:style="contentStyle">
				<template #default>
					{{ cutContent }}
				</template>
			</tooltip>
		</template>
		<template #extend="{}">
			<span
				:class="CN.C('expand', 1)"
				v-if="ellipsis.expandable"
				@click="handleExpandable">
				{{ state.expand ? ellipsis.foldText : ellipsis.expandText }}
			</span>
			<Copy
				v-if="ellipsis.copy"
				:valueRef="content" />
		</template>
	</Measure>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-text {
		&-expand {
			margin: 0 rem(0.4);
			padding: 0 rem(0.2);
			font-size: rem(0.8);
			color: col(primary);
			@include pointer;
			@include text_hover;
		}
	}
}
</style>
