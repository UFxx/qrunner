<script setup>
	defineProps(
		{
			item:
			{
				type: Object,
				required: true
			}
		}
	);
</script>

<template>
	<div
		class="results__item results__item-app"
		:class="{ 'active': item.isSelected }"
	>
		<p>{{`${item.name}.${item.extension}`}}</p>/
	</div>
</template>

<style lang='scss'>
	.results__item
	{
		color: white;

		&.active
		{
			// color: var(--inputTextColor);
			color: green;
		}
	}
</style>