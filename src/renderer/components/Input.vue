<script setup>
	import { ref, onMounted } from 'vue';
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

	const handleInput = (event) =>
	{
		const value = event.target.value;
		window.electron.ipcRenderer.send('input', value);
	}

	const setupIpcListener = () =>
	{
		window.electron.ipcRenderer.on('input-response', (data) =>
			{
				searchResults.value = data.results.map((item, idx) =>
					{
						if (idx === 0)
							return {
								...item,
								isSelected: true
							}
						else
							return {
								...item,
								isSelected: false
							}
					}
				);
			}
		);

		window.electron.ipcRenderer.on('close-response', (data) =>
			{
				if (data.success)
					input.value.value = '';
			}
		)
	}

	const selectItem = (idx, prevIdx = null) =>
	{
		searchResults.value[idx].isSelected = true;

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
		width: 640px;
		color: var(--input-text-color);
		border: var(--input-border);
		padding: var(--input-padding);
		opacity: var(--input-opacity);
		font-size: var(--input-font-size);
		border-radius: var(--input-border-radius);
		background-color: var(--input-background-color);

		@include tr(0.3, opacity);

		&:focus { opacity: var(--input-opacity--focus) !important; }
		&::placeholder { color: var(--input-placeholder-text-color); }
	}
</style>