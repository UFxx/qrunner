<script setup>
	import { onMounted, reactive } from 'vue';
	import Input from './components/Input.vue';
	import baseSstyles from './assets/baseStyles.json';
	import InputSettings from './components/InputSettings/InputSettingsWrapper.vue';

	const inputSettings = reactive({})

	const setInputSettings = () =>
	{
		if (!localStorage.getItem('inputSettings'))
		{
			Object.entries(baseSstyles).forEach(style => inputSettings[style[0]] = style[1]);
			inputSettings.placeholder = 'Введите название приложения...';
			localStorage.setItem('inputSettings', JSON.stringify(inputSettings));
		}
		else
		{
			const savedInputSettings = JSON.parse(localStorage.getItem('inputSettings'));
			Object.entries(savedInputSettings).forEach(style => inputSettings[style[0]] = style[1])
		}
	}

	onMounted(() => setInputSettings());
</script>

<template>
	<div class="input-wr">
		<Input :inputSettings />
	</div>
	<div>
		<InputSettings v-model="inputSettings" />
	</div>
</template>

<style lang="scss">
	.input-wr
	{
		position: relative;

		&::after
		{
			top              : 50%;
			left             : 30px;
			width            : 30px;
			height           : 30px;
			content          : '';
			position         : absolute;
			transform        : translateY(-50%);
			background-image : url('./assets/images/magnifier.svg');
		}
	}
</style>
