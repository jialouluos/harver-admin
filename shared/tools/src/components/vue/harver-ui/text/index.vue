<script lang="ts" setup>
import { computed, reactive, ref, watch, nextTick, onScopeDispose, Ref, StyleValue, CSSProperties } from 'vue';
import {
	useClassName,
	usePrefixCls,
	useSharedGlobalEvent,
	on,
} from '@jialouluo/tools/src/components/vue/hooks/index.ts';
import tooltip from '@jialouluo/tools/src/components/vue/harver-ui/tooltip/index.vue';
import Copy from '@jialouluo/tools/src/components/vue/harver-ui/copy/index.vue';
// import Measure from '@jialouluo/tools/src/components/vue/harver-ui/measure/index.vue';
import Measure from '../measure/index.vue';
import { isPositiveInit } from '@jialouluo/tools';

interface IProps {
	copy?: boolean;
	content?: string;
	performance?: 'high' | 'low'; // 测量性能要求  low不支持expandable、copy、suffix、expandText、foldText
	textStyle?: CSSProperties;
	containerStyle?: CSSProperties;
	lazy?: boolean; //是否开启懒处理
	width?: string | number; //文本宽度
	ellipsis?: {
		rows?: number; //最大展示行数
		expandable?: boolean; //ellipsis时是否展示展开按钮
		tooltip?: string; //tooltip展示的内容
		enableTooltip?: boolean; //启用tooltip
		trigger?: 'click' | 'hover';
		showMaxLength?: number; //最大展示的字数
		placement?: 'top' | 'right' | 'left' | 'bottom';
		expandText?: string; //展开文案
		foldText?: string; //闭合文案
		suffix?: string; //省略文案
	};
}
const DEFAULT_ROWS = 1;
const props = withDefaults(defineProps<IProps>(), {
	content: '',
	ellipsis: () => ({}),
	textStyle: () => ({}),
	containerStyle: () => ({}),
});
const state = reactive({
	expand: false, // 展开/收起状态
});
const content = computed(() => props.content);
const ellipsis = computed(() => {
	const { rows, expandable, trigger, placement, tooltip, showMaxLength, foldText, expandText, enableTooltip, suffix } =
		props.ellipsis;
	const width = !!props.width ? parseFloat(props.width + "") + 'px':undefined;
	const isDefaultSuffix = !suffix || suffix === '...';
	const noExpandable = !expandable && !props.copy;
	const disabledShowMaxLength = !isPositiveInit(showMaxLength)
	return {
		rows: isPositiveInit(rows) ? Math.max(rows, DEFAULT_ROWS) : undefined,
		expandable: expandable ?? false,
		trigger: trigger ?? 'hover',
		tooltip: tooltip ?? '',
		placement: placement ?? 'top',
		width: width,
		showMaxLength: showMaxLength ?? undefined,
		foldText: foldText || '收起',
		expandText: expandText || '展开',
		lazy: props.lazy,
		enableTooltip: enableTooltip,
		suffix: suffix ?? '...',
		performance: props.performance ?? (isDefaultSuffix && noExpandable  && disabledShowMaxLength ? 'low' : 'high'),
	};
});

const disabledMeasure = computed(() => {
	if (ellipsis.value.width) return false;
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
		:rows="ellipsis.rows"
		:disabled="disabledMeasure"
		:contentStyle="{...$attrs.style as CSSProperties,...textStyle}"
		:showMaxLength="ellipsis.showMaxLength"
		:containerStyle="{
			width: ellipsis.width,
			...containerStyle,
		}"
		:suffix="ellipsis.suffix"
		:lazy="ellipsis.lazy"
		:performance="ellipsis.performance"
		>
		<template #content="{ cutContent, bindContentRef, needEllipsis }">
			<tooltip
				:class="[CN.R('text', 0)]"
				:ref="tooltipRef => bindContentRef((tooltipRef as any)?.triggerRef)"
				:trigger="ellipsis.trigger"
				:disabled="!( ellipsis.enableTooltip ? true : needEllipsis)"
				:placement="ellipsis.placement"
				:content
				:style="{...$attrs.style as CSSProperties,...textStyle}"
				>
				<template #default>
					{{ cutContent }}
				</template>
				<template
					#content
					v-if="ellipsis.tooltip">
					{{ ellipsis.tooltip }}
				</template>
			</tooltip>
		</template>
		<template #extend="{ cutContent, needEllipsis }">
			<span
				:class="CN.R('expand', 1)"
				v-if="ellipsis.expandable"
				@click="handleExpandable">
				{{ state.expand ? ellipsis.foldText : ellipsis.expandText }}
			</span>
			<Copy
				v-if="copy"
				:valueRef="content" />
		</template>
	</Measure>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-text {
		&-expand {
			padding: 0 rem(0.2);
			margin: 0 rem(0.4);
			font-size: rem(0.8);
			color: col(strong-primary);
			@include pointer;
			@include text_hover;
		}
	}
}
</style>
