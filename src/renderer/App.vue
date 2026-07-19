<script setup>
	import {
		onUnmounted,
		onMounted,
		reactive,
		watch,
		ref
	} from 'vue';

	import Input from './components/Input.vue';
	import baseStyles from './assets/baseStyles.json';
	import InputSettings from './components/InputSettings/InputSettingsWrapper.vue';

	import { useInputStyles } from './composables/useInputStyles.js';

	let inputSettings      = reactive({})
	const isSettingsOpened = ref(false);
	const inputStyles      = useInputStyles(inputSettings);

	const setInputSettings = () =>
	{
		if (!localStorage.getItem('inputSettings'))
		{
			Object.entries(baseStyles).forEach(style => inputSettings[style[0]] = style[1]);
			inputSettings.placeholder = 'Введите название приложения...';
			localStorage.setItem('inputSettings', JSON.stringify(inputSettings));
		}
		else
		{
			const savedInputSettings = JSON.parse(localStorage.getItem('inputSettings'));
			Object.entries(savedInputSettings).forEach(style => inputSettings[style[0]] = style[1]);
		}
	}

	const toggleSettings       = (value) => isSettingsOpened.value = value;
	const handleIndexResponse  = (data) => localStorage.setItem('lastIndexedTime', data.newTimestamp);
	const startIndex           = () => window.electron.ipcRenderer.send('indexer');
	const setupIpcListener     = () => window.electron.ipcRenderer.on('indexer-response', handleIndexResponse);
	const checkLastIndexedTime = () =>
	{
		const currentTimestamp = Date.now();
		const lastIndexedTime  = localStorage.getItem('lastIndexedTime');

		if (!lastIndexedTime)
			startIndex();

		if (lastIndexedTime && (currentTimestamp - lastIndexedTime) > 86400000)
			startIndex();
	}

	const closeWindow = (e) =>
	{
		if (e.key === 'Escape')
			window.electron.ipcRenderer.send('close');
	}

	watch(inputSettings, () => localStorage.setItem('inputSettings', JSON.stringify(inputSettings)));

	onMounted(() =>
	{
		setupIpcListener();
		setInputSettings();
		checkLastIndexedTime();
		window.addEventListener('keydown', closeWindow);
		useInputStyles();
	});

	onUnmounted(() => {
		window.electron.ipcRenderer.removeListener('indexer-response', handleIndexResponse);
		window.removeEventListener('keydown', closeWindow);
	});
</script>

<template>
	<div
		class="input-wr"
		:style="inputStyles"
	>
		<Input
			:inputSettings
			@toggleSettings="toggleSettings"
		/>
	</div>
	<div v-if="isSettingsOpened">
		<InputSettings
			v-model="inputSettings"
			@toggleSettings="toggleSettings"
			@input="inputHandler"
		/>
	</div>
</template>

<style lang="scss">
	.input-wr
	{
		position: relative;

		&::after
		{
			width: var(--input-icon-size);
			height: var(--input-icon-size);
			content: '';
			transform: translateY(-50%);
			background: url('./assets/images/magnifier.svg');
			background-size: cover;

			top: 50%;
			left: 30px;
			position: absolute;
		}
	}
</style>
