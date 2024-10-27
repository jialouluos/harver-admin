<script lang="ts" setup generic="T extends Record<string,any>[] | string">
import { onMounted, ref, reactive, onScopeDispose, nextTick, watch, computed, CSSProperties } from 'vue';
import { computedEllipsis } from '@jialouluo/tools';
import {
	useSharedGlobalEvent,
	useIntersectionObserver,
	useClassName,
	usePrefixCls,
	useResizeObserver,
} from '@jialouluo/tools/src/components/vue/hooks/index.ts';
import { isPositiveInit } from '@jialouluo/tools';
import { IMeasureProps } from '@jialouluo/tools/src/types/harver-ui.ts';

interface IState {
	needEllipsis: boolean;
	cutIndex: number | undefined;
	measureFinished: boolean;
}
const props = withDefaults(defineProps<IMeasureProps<T>>(), {
	suffix: '...',
	lazy: false,
	supperLazy: false,
	rows: 1,
	disabled: true,
	contentStyle: () => ({}),
	maxLength: Infinity,
	performance: 'low',
});
const emit = defineEmits(['ellipsis']);

const containerRef = ref();
const contentRef = ref();
const ioStop = ref();
const roStop = ref();
const state = reactive<IState>({
	needEllipsis: false,
	cutIndex: undefined,
	measureFinished: true,
});

const eventEngine = useSharedGlobalEvent();

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});

const CN = CNGenerator(Symbol('measure'));
const TRUNK_CN = CNGenerator(Symbol('trunk'));
const eventId = Symbol('tooltip-event');

const bindContentRef = (ref: any) => {
	if (!contentRef.value && ref) {
		contentRef.value = ref;
		if (useCSSTrunk.value && !props.disabled) {
			nextTick(() => {
				contentRef.value.classList.add(TRUNK_CN.value.C('trunk', 0));
				contentRef.value.style.webkitLineClamp = `${props.rows}`;
				setTimeout(() => {
					init();
				});
			});
		} else {
			init();
		}
	}
};
const useCSSTrunk = computed(() => {
	return props.performance === 'low';
});

const isShowSuffix = computed(() => {
	if (!props.suffix) return;
	if (props.performance !== 'high') return false;
	if (props.disabled) return false;
	if (!state.measureFinished) return true;
	if (state.needEllipsis) return true;
});
watch(
	() => props.disabled,
	() => {
		if (props.disabled) {
			dispose();
		} else {
			init();
		}
	}
);
const measureText = () => {
	if (!containerRef.value || !contentRef.value) return;
	state.measureFinished = false;
	state.cutIndex = undefined;
	if (props.performance === 'high') {
		nextTick(() => {
			const { needEllipsis, cutIndex, needUpdateCutIndex } = computedEllipsis(
				containerRef.value,
				contentRef.value,
				'',
				props.rows
			)!;

			if (needUpdateCutIndex) {
				if (isPositiveInit(props.maxLength)) {
					/**
					 *@ 如果设置了maxLength
					 *@ cutIndex > maxLength  取maxLength 显示...
					 *@ cutIndex === maxLength 取maxLength 显示...
					 *@ cutIndex < maxLength 取cutIndex 显示...
					 *@ needUpdateCutIndex为true,cutIndex 为undefined 表示当前足够显示所有内容 这时就要比较content的长度和maxLength了
					 */
					if (cutIndex) {
						state.cutIndex = Math.min(props.maxLength, cutIndex);
						state.needEllipsis = true;
					} else {
						state.cutIndex = props.maxLength;
						state.needEllipsis = props.content.length > props.maxLength;
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
const handleDOMResize = (handler: () => any) => {
	const resizeOB = <{ run: any; stop: any; dispose: any }>{
		run: null,
		stop: null,
		dispose: null,
	};
	resizeOB.run = () => {
		// const oldStyle = containerRef.value.style.transform;
		// containerRef.value.style.transform = 'translateZ(0)'; // 添加到合成层去计算
		const stop = useResizeObserver(containerRef.value, () => {
			requestIdleCallback(handler);
		});
		resizeOB.dispose = () => {
			stop();
			// containerRef.value.style.transform = oldStyle;
			resizeOB.stop = null;
			resizeOB.run = null;
		};
		resizeOB.stop = () => {
			stop();
			// containerRef.value.style.transform = oldStyle;
			resizeOB.stop = null;
		};
	};
	return resizeOB;
};
const lazyMeasureText = () => {
	if (props.disabled) return;
	if (!contentRef.value) return;
	if (ioStop.value) return;
	ioStop.value = useIntersectionObserver(containerRef.value, measureText, {
		once: true,
		onDisposeCallback: () => {
			ioStop.value = null;
		},
	});
};
const useResizeOBMeasure = () => {
	roStop.value = handleDOMResize(measureText);
	ioStop.value = useIntersectionObserver(containerRef.value, roStop.value.run, {
		onDisposeCallback: () => {
			ioStop.value = null;
			roStop.value?.dispose?.();
			roStop.value = null;
		},
		onHiddenCallback: () => {
			roStop.value?.stop?.();
		},
	});
};
const init = () => {
	if (props.disabled) return;
	if (!contentRef.value) return;
	if (!containerRef.value) return;
	dispose();

	if (props.supperLazy) {
		//启用resize观察者

		useResizeOBMeasure();
	} else if (props.lazy) {
		//启用onresize事件
		lazyMeasureText();

		eventEngine.value?.onGlobal('resize', lazyMeasureText, { eventId, debounce: useCSSTrunk.value ? 100 : undefined });
	} else {
		//不做优化处理
		measureText();

		eventEngine.value?.onGlobal('resize', measureText, { eventId, debounce: useCSSTrunk.value ? 100 : undefined });
	}
};
const dispose = () => {
	state.cutIndex = undefined;
	state.measureFinished = true;
	state.needEllipsis = false;
	eventEngine.value?.remove('resize', eventId);
	ioStop.value && ioStop.value();
	ioStop.value = null;
	roStop.value && roStop.value?.dispose?.();
	roStop.value = null;
};
onMounted(() => {
	init();
});

onScopeDispose(dispose);
</script>
<template>
	<div
		ref="containerRef"
		:class="[CN.C('measure', 0), disabled ? '' : CN.C('measure-full', 0)]"
		v-bind="$attrs">
		<slot
			name="content"
			:cutContent="(content as T).slice(0, state.cutIndex)"
			:rawContent="content"
			:cutIndex="state.cutIndex"
			:needEllipsis="state.needEllipsis"
			:measureFinished="state.measureFinished"
			:bindContentRef="bindContentRef">
			<span
				:ref="ref => bindContentRef(ref)"
				:style="contentStyle">
				{{ (content as T).slice(0, state.cutIndex) }}
			</span>
		</slot>
		<slot
			name="suffix"
			:cutContent="(content as T).slice(0, state.cutIndex)"
			:content="content"
			:cutIndex="state.cutIndex"
			:isShowSuffix="isShowSuffix"
			:needEllipsis="state.needEllipsis"
			:measureFinished="state.measureFinished"
			:contentStyle="contentStyle">
			<span
				v-if="isShowSuffix"
				:class="CN.C('suffix', 1)"
				:style="contentStyle"
				>{{ suffix }}</span
			>
		</slot>

		<slot
			name="extend"
			:cutContent="(content as T).slice(0, state.cutIndex)"
			:content="content"
			:cutIndex="state.cutIndex"
			:needEllipsis="state.needEllipsis"
			:measureFinished="state.measureFinished"
			:contentStyle="contentStyle"></slot>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-measure-full {
		/* width: 100%; */
	}

	&-measure {
		line-height: 1.5;
		font-size: rem(0.8);
		color: col(text-color);
		word-break: break-all;

		&-suffix {
			margin: 0;
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
