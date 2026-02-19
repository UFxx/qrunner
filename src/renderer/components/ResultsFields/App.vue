<script setup>
	import { computed, inject } from 'vue';

	const props = defineProps(
		{
			item:
			{
				type: Object,
				required: true
			}
		}
	);

	const inputStyles = inject('inputStyles');

	const itemStyles = computed(() =>
		(
			{
				color: inputStyles.value.color,
				border: inputStyles.value.border,
				opacity: inputStyles.value.opacity,
				borderRadius: inputStyles.value.borderRadius,
				backgroundColor: inputStyles.value.backgroundColor,
			}
		)
	);
</script>

<template>
	<div
		class="results__item results__item-app"
		:class="{ 'active': item.isSelected }"
		:style="itemStyles"
	>
		<p>{{`${item.name}.${item.extension}`}}</p>
	</div>
</template>

<style lang='scss'>
	.results__item
	{
		width: 100%;
		opacity: 0.5;
		padding: 20px;
		color: white;
		font-size: 18px;
		flex-shrink: 0;

		@include tr(0.3, background-color, opacity);

		&.active,
		&:hover
		{
			opacity: 1 !important;
			cursor: pointer;
		}
	}
</style>