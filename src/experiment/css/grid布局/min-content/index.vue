<script lang="ts" setup>
import ArticleLayout from '@/components/article-template/index.vue';
import demo1String from './codes/demo1.vue?raw';
import demo1 from './codes/demo1.vue';
import demo2String from './codes/demo2.vue?raw';
import demo2 from './codes/demo2.vue';
import demo3String from './codes/demo3.vue?raw';
import demo3 from './codes/demo3.vue';
import demo4String from './codes/demo4.vue?raw';
import demo4 from './codes/demo4.vue';
</script>
<template>
	<ArticleLayout
		:articleTitle="'Grid和Flex的最小内容尺寸'"
		:articleUrl="'https://www.harver.cn/article/107'">
		<!-- <p>
			元素盒子上下文格式（视觉格式化模型）在没有发生变化的条件之下，min-width 取值为 auto 时，浏览器计算出来的值是
			0。如果使用 CSS Flexbox 或 CSS Grid 来构建布局，我们就需要改变元素的 display 属性的值：
		</p>
		<ul>
			<li>CSS Flexbox 布局：flex 或 inline-flex</li>
			<li>CSS Grid 布局：grid 或 inline-grid</li>
		</ul>
		<p>
			这样一来，就改变了元素盒子的视觉盒模型，其相应的子元素（Flex 项目或 Grid 项目）的 min-width 取值为 auto
			时，浏览器计算出来的 min-width 的值不再是 0 ，而是关键词 auto 。
		</p>
		<p>
			这时在 Flexbox 和 Grid 布局中，Flex 项目和 Grid 项目的最小尺寸不会小于其最小内容尺寸（min-content） 。
			所以会以其最小的内容尺寸最为min-width。
		</p> -->

		<harver-b-code
			:code="demo1String"
			:demoKey="'min-content-demo-1'">
			<demo1 />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>width应用值</harver-blockquote>
				</div>
			</template>
		</harver-b-code>

		<!-- <p>
			CSS Flexbox 或 CSS Grid 布局中，Flex 项目或 Grid 项目的最小尺寸不会小于其最小内容尺寸 。其中根本原因，是由于 Flex
			项目和 Grid 项目的 min-width 的计算值是 auto ，而不是 0 。 最简单的解决方法就是在 Flex 项目上重置 min-width
			属性的值为 0 对于 CSS Grid 布局，它还有另一种解决方案，那就是使用 minmax(0, 1fr) 来替代 1fr 。 在 CSS Grid 中，1fr
			的底层实现逻辑其实就是 minmax(auto,1fr) （minmax() 是用来设置网格轨道尺寸一个 CSS 函数），意味着
			min=auto（即min-width: min-content），max=1fr。这样一来，minmax(0, 1fr) 将 1fr 的默认min-width 从 min-content （即
			auto）重置为 0 。这样就允许网格轨道尺寸保持在 0 至 1f 范围内（最小小到 0 ，最大大到 1fr）。
			就拿最后一个示例为例吧，在 Flexbox 布局的 Flex 项目上显式设置 min-width: 0 ；在 Grid 布局上，除了可以在 Grid
			项目上显式设置为 min-width: 0 之外，还可以把网格容器中的 1fr 替换为 minmax(0, 1fr) ：
		</p> -->
		<harver-b-code
			:code="demo2String"
			:demoKey="'min-content-demo-2'">
			<demo2 />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>固定尺寸</harver-blockquote>
				</div>
			</template>
		</harver-b-code>

		<!-- <p>
			虽然在 CSS Flexbox 布局中，我们可以在 Flex 项目上显式设置 flex: 1 1 0% ，让 Flex 项目根据 Flex
			容器的剩余空间或不足空间进行收缩与扩展，但是即使是这样，我们在使用 flex: 1 1 0% 对 Flex
			项目进行收缩时，仍需特别注意，Flex 项目收缩之后的宽度不能小于 Flex 项目的最小内容尺寸（min-content） 。 为了避免
			flex: 1 1 0% 引起的不必要麻烦，我们在编写 CSS 时应该注意，在使用 flex: 1 1 % 的 Flex 项目上，需要显式设置
			min-width: 0 或 overflow: hidden (也可以是 auto 或 scroll )，只不过设置 overfow
			时，需要根据具体需求来判断，如果不需要让 Flex 项目出现滚动条，建议 overflow 取 hidden 值 。 同样的，在 CSS Grid
			布局中，Grid 项目收缩的时候，其宽度同样不能小于其最小内容尺寸。只不过，在 CSS Grid 布局中，我们常使用 1fr
			来设置网格轨道，让相应的网格项目根据网格容器可用空间来进行收缩。也就是说，如果你在定义网格轨道时，碰到了 1fr
			设置网格轨道尺寸时，需要使用下面三种方式来确保 Grid 网格项目不产生问题： 在定义网格轨道尺寸时，使用 minmax(0, 1fr)
			来替代 1fr； 在设置为 1fr 网格轨道中的网格项目上显式设置 min-width 属性的值为 0； 在设置为 1fr
			网格轨道中的网格项目上显式设置 overflow 属性的值为 hidden 或 auto 或 scroll
			。如果不希望网格项目出现滚动条，则建议将 overflow 属性的值设置为 hidden。 虽然上面三种方式都可以避免 1fr
			产生的问题，但我更建议使用 minmax(0, 1fr) 来替代 1fr。 最后简单地说，我们在编写 CSS 代码的时候，只要碰到了 flex:1
			（或 flex: 1 1 0% 或 flex: 1 1 100% ）和在网格轨道设置 1fr 时，最好在对应的项目（Flex 项目或网格项目）上显式设置
			min-width 的值为 0 ；而且使用 minmax(0, 1fr) 来替代 1fr 。这样你编写出的 CSS 更具防御性，代码也更健壮。
		</p> -->
		<harver-b-code
			:code="demo3String"
			:demoKey="'min-content-demo-3'">
			<demo3 />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>高度展开渐变</harver-blockquote>
				</div>
			</template>
		</harver-b-code>
		<harver-b-code
			:code="demo4String"
			:demoKey="'min-content-demo-4'">
			<demo4 />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>min-width:auto问题(等宽布局和撑破弹性布局)</harver-blockquote>
				</div>
			</template>
		</harver-b-code>
	</ArticleLayout>
</template>
