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

	const updateValue = (value) => {
		value = value.replace(',', '.');

		// Оставляем только цифры и точку
		value = value.replace(/[^\d.]/g, '');

		// Одна точка
		const parts = value.split('.');
		if (parts.length > 2)
			value = parts[0] + '.' + parts[1];

		// Максимум 2 знака после запятой
		if (parts.length > 1 && parts[1].length > 2)
			value = parts[0] + '.' + parts[1].slice(0, 2);

		if (!value)
		{
			model.value = '';
			return;
		}

		// Парсим и ограничиваем диапазон 0-1
		let num = parseFloat(value);

		if (isNaN(num)) return;

		if (num > 1)
		{
			model.value = 1;
			return;
		}

		if (num < 0)
		{
			model.value = 0;
			return;
		}

		model.value = value;
	}
</script>

<template>
	<label class="input-settings-item-wr">
		{{ label }}
		<input
			@input="(e) => updateValue(e.target.value)"
			v-model.number="model"
			type="text"
		/>
	</label>
</template>
