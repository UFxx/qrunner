<script setup>
	import { ref, onMounted, computed, provide } from 'vue';
	import Results from './ResultsFields/Results.vue';

	const props = defineProps(
		{
			inputSettings:
			{
				type: Object,
				required: true
			}
		}
	);

	const emit = defineEmits(['toggleSettings']);

	const input         = ref();
	const searchResults = ref([]);

	const inputStyles = computed(() =>
		{
			const
			{
				inputBgColor,
				inputPadding,
				inputOpacity,
				inputFontSize,
				inputTextColor,
				inputBorderSize,
				inputBorderStyle,
				inputBorderColor,
				inputBorderRadius,
				inputOpacityFocus,
				inputPlaceholderTextColor
			} = props.inputSettings;

			return {
				color                            : inputTextColor,
				border                           : `${inputBorderSize} ${inputBorderStyle} ${inputBorderColor}`,
				padding                          : inputPadding,
				opacity                          : inputOpacity,
				fontSize                         : inputFontSize,
				borderRadius                     : inputBorderRadius,
				backgroundColor                  : inputBgColor,
				"--input-opacity-focus"          : inputOpacityFocus,
				"--input-placeholder-text-color" : inputPlaceholderTextColor
			}
		}
	);

	provide('inputStyles', inputStyles);

	const handleInput = (event) =>
	{
		const value = event.target.value;
		window.electron.ipcRenderer.send('input', value);
	}

	const setupIpcListener = () =>
	{
		window.electron.ipcRenderer.on('input-response', (data) =>
			{
				searchResults.value = data.results.map((item) =>
					(
						{
							...item,
							isSelected: false
						}
					)
				);
			}
		);
	}

	const selectItem = (idx, prevIdx = null) =>
	{
		searchResults.value[idx].isSelected     = true;
		if (prevIdx !== null)
			searchResults.value[prevIdx].isSelected = false;
	}

	onMounted(() =>
	{
		input.value.focus();
		setupIpcListener();
	})
</script>

<template>
	<input
		:style="inputStyles"
		ref="input"
		type="text"
		:placeholder="inputSettings.placeholder"
		@input="handleInput"
		@dblclick="emit('toggleSettings', true)"
	>

	<Results
		v-if="searchResults.length"
		:items="searchResults"
		:styles="inputStyles"
		@selectItem="selectItem"
	/>
</template>

<style lang='scss'>
	input
	{
		width : 640px;

		@include tr(0.3, opacity);

		&:focus { opacity: var(--input-opacity--focus) !important; }
		&::placeholder { color: var(--input-placeholder-text-color); }
	}
</style>