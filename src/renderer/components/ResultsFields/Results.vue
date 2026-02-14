<script setup>
	import { onMounted, ref } from 'vue';
	import App from './App.vue';

	const props = defineProps(
		{
			items:
			{
				type: Array,
				required: true
			},
			type:
			{
				type: String,
				required: false,
				default: 'app'
			}
		}
	);

	const currentSelectedItemIndex = ref(0);

	const emit = defineEmits(['selectItem']);

	const selectItem = (idx, prevIdx) => emit('selectItem', idx, prevIdx);

	const selectNextItem = () =>
	{
		currentSelectedItemIndex.value += 1;

		if (currentSelectedItemIndex !== 0)
			selectItem(currentSelectedItemIndex.value, currentSelectedItemIndex.value - 1);
		else
			selectItem(currentSelectedItemIndex.value);
	}

	const selectPrevItem = () =>
	{
		currentSelectedItemIndex.value -= 1;
		selectItem(currentSelectedItemIndex.value, currentSelectedItemIndex.value + 1);
	}

	const launchApp = () =>
	{
		window.electron.ipcRenderer.send('launchApp', props.items[currentSelectedItemIndex.value].path);
	}

	onMounted(() =>
	{
		window.addEventListener('keydown', (e) =>
			{
				if (e.key === "ArrowDown") selectNextItem();
				if (e.key === "ArrowUp")   selectPrevItem();
				if (e.key === 'Enter')     launchApp();
			}
		)

		selectItem(currentSelectedItemIndex.value);
	});
</script>

<template>
	<div class="results">
		<template v-if="type === 'app'">
			<App
				v-for="item in items"
				:key="item.id"
				:item="item"
			/>
		</template>
	</div>
</template>

<style lang='scss'>
	.results
	{
		display: flex;
		row-gap: 10px;
		position: absolute;
		flex-direction: column;
		top: calc(100% + 20px);
	}
</style>