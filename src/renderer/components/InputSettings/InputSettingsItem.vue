<script setup>
	import Number from './Fields/Number.vue';
	import Color from './Fields/Color.vue';
	import Select from './Fields/Select.vue';

	defineProps(
		{
			label:
			{
				type: String,
				required: true
			},
			type:
			{
				type: String,
				required: false,
				default: '',
				validator: (v) => ['select', 'size', 'color', 'number'].includes(v)
			},
			variants:
			{
				type: Array,
				required: false
			}
		}
	)

	const model = defineModel();
</script>

<template>
	<Number
		v-if="type === 'number'"
		:label
		v-model="model"
	/>

	<Color
		v-if="type === 'color'"
		:label
		v-model="model"
	/>

	<Select
		v-if="type === 'select'"
		:label
		v-model="model"
		:variants
	/>
</template>

<style lang='scss'>
	.input-settings-item-wr
	{
		display: flex;
		color: white;
		cursor: pointer;
		max-width: 640px;
		margin-bottom: 10px;
		flex-direction: column;
		width: 100%;

		input
		{
			padding: 10px;
			color: white;
			border: 1px solid gray;
			background-color: transparent;
		}
	}
</style>