<script setup>
	const props = defineProps(
		{
			label:
			{
				type: String,
				required: true
			}
		}
	)

	const model = defineModel();

	const updateValue = (value) => model.value = value;
</script>

<template>
	<label class="input-settings-item-wr">
		{{ label }}
		<div class="input-settings-item-size-wr">
			<div class="input-settings-item__input-wr">
				<input
					@input="(e) => updateValue(e.target.value)"
					v-model="model"
					type="text"
				/>
			</div>
		</div>
	</label>
</template>

<style lang='scss' scoped>
.input-settings-item-size-wr
{
	display: flex;
	column-gap: 10px;
	align-items: flex-start;

	label { margin: 0; }
}

</style>