<script setup>
	import { computed, reactive } from 'vue';

	import InputSettingsItem from './InputSettingsItem.vue';

	const inputSettings = defineModel();

	const borderStyleSelectValues = reactive(
		[
			{
				name: 'solid',
				isActive: true
			},
			{
				name: 'dotted',
				isActive: false
			},
			{
				name: 'dashed',
				isActive: false
			},
			{
				name: 'double',
				isActive: false
			},
			{
				name: 'groove',
				isActive: false
			},
			{
				name: 'ridge',
				isActive: false
			},
			{
				name: 'inset',
				isActive: false
			},
			{
				name: 'outset',
				isActive: false
			},
			{
				name: 'none',
				isActive: false
			},
			{
				name: 'hidden',
				isActive: false
			}
		]
	);

	const borderStyleVariants = computed(() => borderStyleSelectValues.filter(variant => !variant.isActive));
</script>

<template>
	<div class="input-settings-wr">
		<!-- <InputSettingsItem label="Внутренний отступ (сверху, слева, снизу, справа)" v-model="inputSettings.inputPadding" /> -->

		<InputSettingsItem
			label="Прозрачность"
			v-model="inputSettings.inputOpacity"
			type="number"
		/>

		<InputSettingsItem
			label="Цвет заднего фона"
			v-model="inputSettings.inputBgColor"
			type="color"
		/>

		<!--<InputSettingsItem label="Размер шрифта" v-model="inputSettings.inputFontSize" /> -->

		<InputSettingsItem
			label="Цвет текста"
			v-model="inputSettings.inputTextColor"
			type="color"
		/>

		<!-- <InputSettingsItem label="Ширина обводки" v-model="inputSettings.inputBorderSize" /> -->

		<InputSettingsItem
			label="Стиль обводки"
			v-model="inputSettings.inputBorderStyle"
			type="select"
			:variants="borderStyleVariants"
		/>

		<InputSettingsItem
			label="Цвет обводки"
			v-model="inputSettings.inputBorderColor"
			type="color"
		/>

		<!-- <InputSettingsItem label="Закругление обводки" v-model="inputSettings.inputBorderRadius" /> -->

		<InputSettingsItem
			label="Прозрачность при фокусе"
			v-model="inputSettings.inputOpacityFocus"
			type="number"
		/>

		<InputSettingsItem
			label="Цвет плейсхолдера"
			v-model="inputSettings.inputPlaceholderTextColor"
			type="color"
		/>
	</div>
</template>

<style lang='scss'>
	.input-settings-wr
	{
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		display: flex;
		position: fixed;
		overflow-y: auto;
		max-height: 100vh;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background-color: rgba(black, 0.7);
	}
</style>