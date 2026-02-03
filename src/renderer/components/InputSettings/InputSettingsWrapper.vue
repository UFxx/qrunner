<script setup>
	import { computed, reactive } from 'vue';

	import InputSettingsItem from './InputSettingsItem.vue';

	const inputSettings = defineModel();
	const emit          = defineEmits(['toggleSettings']);

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

	const changeBorderStyleActiveVariant = (value) => borderStyleSelectValues.forEach(el => el.isActive = (el.name === value));

	const borderStyleVariants   = computed(() => borderStyleSelectValues.filter(variant => !variant.isActive));
</script>

<template>
	<div class="input-settings-wr">
		<div
			class="input-settings__close-icon"
			@click="emit('toggleSettings', false)"
		>
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
					<path d="M16 8L8 16M8 8L16 16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path>
				</g>
			</svg>
		</div>

		<InputSettingsItem
			label="Внутренний отступ (сверху, слева, снизу, справа)"
			v-model="inputSettings.inputPadding"
			type="size"
		/>

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

		<InputSettingsItem
			label="Размер шрифта"
			v-model="inputSettings.inputFontSize"
			type="size"
		/>

		<InputSettingsItem
			label="Цвет текста"
			v-model="inputSettings.inputTextColor"
			type="color"
		/>

		<InputSettingsItem
			label="Ширина обводки"
			v-model="inputSettings.inputBorderSize"
			type="size"
		/>

		<InputSettingsItem
			label="Стиль обводки"
			v-model="inputSettings.inputBorderStyle"
			type="select"
			:variants="borderStyleVariants"
			@update:model-value="changeBorderStyleActiveVariant"
		/>

		<InputSettingsItem
			label="Цвет обводки"
			v-model="inputSettings.inputBorderColor"
			type="color"
		/>

		<InputSettingsItem
			label="Закругление обводки"
			v-model="inputSettings.inputBorderRadius"
			type="size"
		/>

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

	.input-settings__close-icon
	{
		top: 32px;
		width: 32px;
		right: 32px;
		height: 32px;
		opacity: 0.5;
		display: flex;
		cursor: pointer;
		position: absolute;
		align-items: center;
		justify-content: center;
		@include tr(0.3, opacity);

		&:hover { opacity: 1; }
	}
</style>