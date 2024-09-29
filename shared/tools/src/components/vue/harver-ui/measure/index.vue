<script lang="ts" setup>
import {
	onMounted,
	ref,
	reactive,
	onScopeDispose,
	Ref,
	nextTick,
	watch,
	StyleValue,
	CSSProperties,
	computed,
} from 'vue';
import { computedEllipsis } from '@jialouluo/tools';
import {
	useSharedGlobalEvent,
	useIntersectionObserver,
	useClassName,
	usePrefixCls,
} from '@jialouluo/tools/src/components/vue/hooks/index.ts';
// import { computedEllipsis } from '../../../../common/feat';
import { isPositiveInit } from '@jialouluo/tools';
interface IState {
	needEllipsis: boolean;
	cutIndex: number | undefined;
	measureFinished: boolean;
}
const props = withDefaults(
	defineProps<{
		rows?: number;
		content: string;
		suffix?: string;
		lazy?: boolean;
		disabled?: boolean;
		containerStyle?: StyleValue;
		contentStyle?: CSSProperties;
		showMaxLength?: number;
		performance?: 'high' | 'low';
		style?:CSSProperties;
	}>(),
	{
		suffix: '...',
		lazy: false,
		rows: 1,
		disabled: true,
		containerStyle: () => ({}),
		contentStyle: () => ({}),
		showMaxLength: Infinity,
		performance: 'low',
	}
);
const emit = defineEmits(['ellipsis']);

const containerRef = ref();
const contentRef = ref();
const ioStop = ref();
const state = reactive<IState>({
	needEllipsis: false,
	cutIndex: undefined,
	measureFinished: true,
});
const eventId = Symbol('tooltip-event');

const eventEngine = useSharedGlobalEvent();

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('measure'));
const TRUNKCN = CNGenerator(Symbol('trunk'));
const bindContentRef = (ref: any) => {
	if (!contentRef.value && ref) {
		contentRef.value = ref;
		if (useCSSTrunk.value && !props.disabled) {
			nextTick(() => {
				contentRef.value.classList.add(TRUNKCN.value.R('trunk', 0));
				contentRef.value.style.webkitLineClamp = `${props.rows}`;
				setTimeout(() => {
					handleMeasureText();
				});
			});
		} else {
			handleMeasureText();
		}
	}
};
const useCSSTrunk = computed(() => {
	return props.performance === 'low';
});
const showMaxLength = computed(() => {
	return props.showMaxLength;
});
const isShowSuffix = computed(() => {
	if (props.performance !== 'high') return false;
	if (props.disabled) return false;
	if (!state.measureFinished) return true;
	if (state.needEllipsis) return true;
});
watch(
	() => props.disabled,
	() => {
		if (props.disabled) {
			state.cutIndex = undefined;
			state.measureFinished = true;
			state.needEllipsis = false;
		} else {
			handleMeasureText();
		}
	}
);
const measureText = () => {
	if (!containerRef.value || !contentRef.value) return;
	state.measureFinished = false;
	if (props.performance === 'high') {
		nextTick(() => {
			const { needEllipsis, cutIndex, needUpdateCutIndex } = computedEllipsis(
				containerRef.value,
				contentRef.value,
				props.content,
				props.rows
			)!;

			if (needUpdateCutIndex) {

				if (isPositiveInit(showMaxLength.value)) {
					/**
					 *@ 如果设置了maxLength
					 *@ cutIndex > maxLength  取maxLength 显示...
					 *@ cutIndex === maxLength 取maxLength 显示...
					 *@ cutIndex < maxLength 取cutIndex 显示...
					 *@ needUpdateCutIndex为true,cutIndex 为undefined 表示当前足够显示所有内容 这时就要比较content的长度和maxLength了
					 */
					if (cutIndex) {
						state.cutIndex = Math.min(showMaxLength.value, cutIndex);
						state.needEllipsis = true;
					} else {
						state.cutIndex = showMaxLength.value;
						state.needEllipsis = props.content.length > showMaxLength.value;
					}
				} else {
					state.cutIndex = cutIndex;
					state.needEllipsis = needEllipsis;
				}

				emit('ellipsis', { cutIndex, needEllipsis, content: props.content });
			}
			state.measureFinished = true;
		});
	} else if (useCSSTrunk.value) {
		//css测量法 通过动画
		//对于css测量法 showMaxLength暂不生效
		nextTick(() => {
			const styleMap = (contentRef.value as HTMLSpanElement).computedStyleMap()!;
			const chunk = styleMap.get('--trunk') ?? [];

			state.cutIndex = props.content.length;
			state.needEllipsis = chunk[0] === 'true';
			emit('ellipsis', { ...state, content: props.content });
			state.measureFinished = true;

		});
	}
};

const handleMeasureText = () => {
	if (props.disabled) return;
	if (props.lazy) {
		if (ioStop.value) return;
		ioStop.value = useIntersectionObserver(containerRef.value, measureText, {
			once: true,
			onDisposeCallback: () => {
				ioStop.value = null;
			},
		});
	} else {
		measureText();
	}
};

eventEngine.value?.onGlobal('resize', handleMeasureText, { eventId, debounce: useCSSTrunk.value ? 100 : undefined });

onMounted(() => {
	handleMeasureText();
});

onScopeDispose(() => {
	eventEngine.value?.remove('resize', eventId);
	ioStop.value && ioStop.value();
});

</script>
<template>
	<div
		ref="containerRef"
		:class="CN.R('measure', 0)"
		:style="containerStyle">
		<slot
			name="content"
			:cutContent="content.slice(0, state.cutIndex)"
			:rawContent="content"
			:cutIndex="state.cutIndex"
			:needEllipsis="state.needEllipsis"
			:bindContentRef="bindContentRef">
			<span
				:ref="ref => bindContentRef(ref)"
				:style="contentStyle">
				{{ content.slice(0, state.cutIndex) }}
			</span>
		</slot>

		<span
			:title="content"
			v-if="isShowSuffix"
			:class="CN.R('suffix', 1)"
			>{{ suffix }}</span
		>
		<slot
			name="extend"
			:cutContent="content.slice(0, state.cutIndex)"
			:content="content"
			:cutIndex="state.cutIndex"
			:needEllipsis="state.needEllipsis"></slot>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-measure {
		width: 100%;
		font-size: rem(0.8);
		word-break: break-word;
		line-height: 1.5;

		&-suffix {
			margin: 0 rem(0.4) 0 0;
		}
	}
}
</style>
<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';
.#{$prefixCls} {
	&-trunk {
		@include trunk;
	}
}
</style>
