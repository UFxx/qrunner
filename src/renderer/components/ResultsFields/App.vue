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
	<div class="results__item results__item-app">
		<p>{{ item.name }}</p>
	</div>
</template>

<style lang='scss'>
	.results__item
	{
		color: white;
	}
</style>