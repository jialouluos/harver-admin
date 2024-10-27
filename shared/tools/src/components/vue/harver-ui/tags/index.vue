<script lang="ts">
import { computed, reactive, ref, watch, nextTick, onScopeDispose, Ref, StyleValue, CSSProperties } from 'vue';
import { useClassName, usePrefixCls } from '@jialouluo/tools/src/components/vue/hooks/index.ts';
import tooltip from '@jialouluo/tools/src/components/vue/harver-ui/tooltip/index.vue';
import tag from '@jialouluo/tools/src/components/vue/harver-ui/tag/index.vue';
// import Measure from '@jialouluo/tools/src/components/vue/harver-ui/measure/index.vue';
import Measure from '../measure/index.vue';
import { isPositiveInit } from '@jialouluo/tools';
import { ITagsProps } from '@jialouluo/tools/src/types/harver-ui.ts';

export default {
	name: 'harver-tags',
};
</script>

<script lang="ts" setup>
const DEFAULT_ROWS = 1;
const props = withDefaults(defineProps<ITagsProps>(), {
	ellipsis: () => ({}),
	ellipsisStyle: () => ({}),
	tooltip: () => ({}),
	measure: () => ({}),
});
const state = reactive({
	expand: false, // 展开/收起状态
});
const content = computed(() => props.content);
const ellipsis = computed(() => {
	const { rows, type, expandText, foldText } = props.ellipsis;
	const { enable, ...tooltipConfig } = props.tooltip;
	const { lazy, supperLazy, maxLength } = props.measure;
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

	return {
		rows: isPositiveInit(rows) ? Math.max(rows, DEFAULT_ROWS) : undefined,
		type: type ?? '+n',
		width,
		maxWidth,
		maxLength: maxLength ?? undefined,
		foldText: foldText || '收起',
		expandText: expandText || '展开',
		lazy,
		supperLazy,
		enableTooltip: enable,
		tooltipConfig,
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
const CN = CNGenerator(Symbol('text-tags'));

const handleExpandable = () => {
	state.expand = !state.expand;
};
</script>
<template>
	<Measure
		v-if="content.length"
		:content
		:rows="ellipsis.rows"
		:disabled="disabledMeasure"
		:maxLength="ellipsis.maxLength"
		:style="{
			width: ellipsis.width,
			maxWidth: ellipsis.maxWidth,
			...$attrs.style as CSSProperties
		}"
		:suffix="''"
		:lazy="ellipsis.lazy"
		:supperLazy="ellipsis.supperLazy"
		:performance="'high'">
		<template #content="{ cutContent, bindContentRef }">
			<div
				:ref="ref => bindContentRef(ref)"
				:style="{...$attrs.style as CSSProperties}">
				<tag
					v-for="(item, index) in (cutContent as typeof content)"
					:key="index"
					v-bind="item"></tag>
			</div>
		</template>

		<template #extend="{ cutContent, cutIndex, needEllipsis, measureFinished }">
			<tooltip
				v-if="ellipsis.type === '+n' && (needEllipsis || !measureFinished)"
				v-bind="ellipsis.tooltipConfig"
				:disabled="!(ellipsis.enableTooltip ? true : needEllipsis)"
				:style="ellipsisStyle">
				<template #default>
					<tag
						:class="CN.C('button-tag', 0)"
						:style="ellipsisStyle"
						:content="`+${content.length - (cutIndex ?? 0)}`"></tag>
				</template>
				<template #content>
					<div :style="{...$attrs.style as CSSProperties}">
						<tag
							v-for="(item, index) in content.slice(cutIndex ?? 0)"
							:key="index"
							v-bind="item"></tag>
					</div>
				</template>
			</tooltip>
			<tag
				v-if="ellipsis.type === 'expand'"
				:class="CN.C('button-tag', 0)"
				:style="ellipsisStyle"
				:content="state.expand ? ellipsis.foldText : ellipsis.expandText"
				@click="handleExpandable"></tag>
		</template>
	</Measure>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-button-tag {
		font-size: rem(0.8);
		color: col(strong-primary);
		@include pointer;
		@include text_hover;
	}
}
</style>
