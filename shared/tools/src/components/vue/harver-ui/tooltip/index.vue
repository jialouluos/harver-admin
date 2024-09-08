<script lang="ts" setup>
import { useEventListener } from '../../hooks/useEventListener';
import { PropType, ref, reactive, watch, nextTick } from 'vue';
interface ITooltip {
	key: string;
	enable: boolean;
	pos: { x: number; y: number };
	width: number;
	height: number;
	targetWidth: number;
	targetHeight: number;
}

const props = defineProps({
	trigger: {
		type: String as PropType<'hover' | 'click'>,
		default: 'click',
	},
	content: String,
	center: {
		type: Boolean,
		default: true,
	},
	placement: {
		type: String as PropType<'top' | 'left' | 'right' | 'bottom'>,
		default: 'top',
	},
	width: {
		type: Number,
		default: 200,
	},
	space: {
		type: Number,
		default: 20,
	},
});
const triggerRef = ref<HTMLSpanElement>();
const contentRef = ref<HTMLDivElement>();
const state = reactive<{ show: boolean; dispose: boolean; currentPos: null | ITooltip }>({
	show: false,
	dispose: false,
	currentPos: null,
});

switch (props.trigger) {
	case 'hover': {
		useEventListener(triggerRef, 'mouseenter', () => {
			state.show = true;
		});
		useEventListener(triggerRef, 'mouseleave', () => {
			state.show = false;
		});
		break;
	}
	case 'click': {
		useEventListener(document, 'click', (e: any) => {
			if (state.show && contentRef.value && !contentRef.value.contains(e.target as HTMLElement)) {
				state.show = !state.show;
			}
		});
		useEventListener(triggerRef, 'click', (e: any) => {
			state.show = !state.show;
			e.stopPropagation();
		});
		break;
	}
	default: {
		break;
	}
}

const computedTriggerPos = (dom: HTMLElement, contentRef: HTMLElement, space: number) => {
	const { x, y, width: targetWidth, height: targetHeight } = dom.getBoundingClientRect();
	const { width: contentWidth, height: contentHeight } = contentRef.getBoundingClientRect();

	//left
	const leftX = x - (contentWidth + space);
	const leftY = y;
	//top
	const topX = x;
	const topY = y - (contentHeight + space);
	//right
	const rightX = x + targetWidth + space;
	const rightY = y;
	//bottom
	const bottomX = x;
	const bottomY = y + targetHeight + space;
	const flags = {
		left: {
			key: 'left',
			enable: true,
			pos: {
				x: leftX,
				y: leftY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
		top: {
			key: 'top',
			enable: true,
			pos: {
				x: topX,
				y: topY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
		right: {
			key: 'right',
			enable: true,
			pos: {
				x: rightX,
				y: rightY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
		bottom: {
			key: 'bottom',
			enable: true,
			pos: {
				x: bottomX,
				y: bottomY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
	}; //left top right bottom

	if (leftX < 0 || leftY + contentHeight > window.innerHeight || leftY < 0) flags.left.enable = false; //left
	if (topY < 0 || topX < 0 || topX + contentWidth > window.innerWidth) flags.top.enable = false; //top
	if (rightX + contentWidth > window.innerWidth || rightY + contentHeight > window.innerHeight || rightY < 0)
		flags.right.enable = false; //right
	if (bottomY + contentHeight > window.innerHeight || bottomX < 0 || bottomX + contentWidth > window.innerWidth)
		flags.bottom.enable = false; //bottom
	return Object.values(flags).filter(item => item.enable);
};
watch(
	() => state.show,
	(newVal: boolean) => {
		if (newVal && contentRef.value && triggerRef && triggerRef.value) {
			const flags = computedTriggerPos(triggerRef.value, contentRef.value, props.space);

			const posInfo = flags.find(item => item.key === props.placement) || flags[0];
			if (!posInfo) return console.log('暂无');
			state.currentPos = posInfo;
		}
	}
);
watch(
	() => state.currentPos,
	() => {
		if (!state.currentPos) return;

		if (contentRef.value && triggerRef.value) {
			const styles = {
				left: state.currentPos.pos.x,
				top: state.currentPos.pos.y,
			};
			if (props.center) {
				switch (state.currentPos.key) {
					case 'top':
					case 'bottom': {
						styles.left -= (state.currentPos.width - state.currentPos.targetWidth) / 2;
						break;
					}
					case 'left':
					case 'right': {
						styles.top -= (state.currentPos.height - state.currentPos.targetHeight) / 2;
						break;
					}
					default: {
						break;
					}
				}

				contentRef.value.style.inset = `${styles.top}px  auto auto ${styles.left}px  `;
			}
		}
	}
);
</script>
<template>
	<div class="harver_tooltip_root">
		<span ref="triggerRef">
			<slot name="default"></slot>
		</span>
		<Teleport to="body">
			<div
				class="tooltip"
				ref="contentRef"
				:class="[state.currentPos ? `tooltip_${state.currentPos!.key}`:'', state.show ? '' : 'hidden']">
				<div class="tooltip_inner">
					<div>
						<slot
							name="content"
							v-html="content"></slot>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>
<style lang="scss" scoped>
@import '../../../styles/global';

.harver {
	&_tooltip_root {
		position: absolute;
	}
}

.tooltip {
	position: fixed;
	z-index: 999;
	opacity: 1;
	transition-property: opacity;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 0.15s;

	&_inner {
		@include supper_round_border(0.0825, 0.125) {
			& > * {
				padding: rem(0.25);
				font-size: rem(0.8);
			}
		}
	}
}

.tooltip_top {
	@include arrow('top', 0.75);
}

.tooltip_bottom {
	@include arrow('bottom', 0.75);
}

.tooltip_left {
	@include arrow('left', 0.75);
}

.tooltip_right {
	@include arrow('right', 0.75);
}

.hidden {
	opacity: 0;
	visibility: hidden;
}
</style>
