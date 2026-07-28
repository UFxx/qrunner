<script setup>
	import { computed, ref, watch } from 'vue';
	import calculatorIcon from '../../assets/images/calculator.svg';

	const props = defineProps(
		{
			calculation:
			{
				type     : String,
				required : true
			}
		}
	);

	const isCopied = ref(false);

	const formattedCalculation = computed(() => props.calculation.slice(1, props.calculation.length));
	const calculationResult    = computed(() => eval(formattedCalculation.value));

	const copy = async () =>
	{
		await navigator.clipboard.writeText(calculationResult.value)
		isCopied.value = true;
	};

	watch(() => props.calculation, () => isCopied.value = false);

	defineExpose({ copy });
</script>

<template>
	<div
		class="results__item results__item-calculation"
		@click="copy"
	>
		<img
			class="results__item-icon"
			:src="calculatorIcon"
		>
		<div class="results__item-info">
			<p class="results__item-info-name">{{ calculationResult }}</p>
			<p
				class="results__item-info-copy"
				:class="{ 'success': isCopied }"
			>
				{{ isCopied ? 'Скопировано' : 'Скопировать' }}
			</p>
		</div>
	</div>
</template>

<style lang="scss">
	.results__item.results__item-calculation
	{
		opacity: 1;
	}

	.results__item-info-copy
	{
		opacity: 0.5;
		font-size: 14px;

		&.success { opacity: 1; }
	}
</style>