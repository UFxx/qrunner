<script setup>
	defineProps(
		{
			label:
			{
				type: String,
				required: true
			}
		}
	)

	const model = defineModel();

	const updateValue = (value) =>
	{
		if (!value.startsWith('#'))
			model.value = `#${value}`

		if (value.length > 7)
			model.value = value.substring(0, 7);
	}
</script>

<template>
	<label class="input-settings-item-wr">
		{{ label }}
		<div class="input-settings-item__input-wr">
			<input
				@input="(e) => updateValue(e.target.value)"
				v-model="model"
				type="text"
			/>
			<div class="input-settings-item__color-preview" :style="{ backgroundColor: model }" />
		</div>
	</label>
</template>

<style lang='scss'>
	.input-settings-item__input-wr
	{
		display: flex;
		column-gap: 10px;
		align-items: center;
		justify-content: space-between;
	}

	.input-settings-item__color-preview
	{
		width: 40px;
		height: calc(100% - 2px);
		border: 1px solid white;
	}
</style>