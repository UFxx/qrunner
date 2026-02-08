<script setup>
	import App from './App.vue';

	defineProps(
		{
			items:
			{
				type: Array,
				required: true
			},
			type:
			{
				type: String,
				required: false,
				default: 'app'
			}
		}
	);
</script>

<template>
	<div class="results">
		<template v-if="type === 'app'">
			<App
				v-for="item in items"
				:key="item.id"
				:item="item"
			/>
		</template>
	</div>
</template>

<style lang='scss'>
	.results
	{
		display: flex;
		row-gap: 10px;
		position: absolute;
		flex-direction: column;
		top: calc(100% + 20px);
	}
</style>