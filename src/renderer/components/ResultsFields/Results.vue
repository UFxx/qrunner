<script setup>
	import { onMounted, onUnmounted, ref } from 'vue';
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
		if (currentSelectedItemIndex.value >= props.items.length - 1) return;

		currentSelectedItemIndex.value += 1;

		if (currentSelectedItemIndex !== 0)
			selectItem(currentSelectedItemIndex.value, currentSelectedItemIndex.value - 1);
		else
			selectItem(currentSelectedItemIndex.value);
	}
	const selectPrevItem = () =>
	{
		if (currentSelectedItemIndex.value <= 0) return;

		currentSelectedItemIndex.value -= 1;
		selectItem(currentSelectedItemIndex.value, currentSelectedItemIndex.value + 1);
	}

	const launchApp = () =>
	{
		window.electron.ipcRenderer.send('launchApp', props.items[currentSelectedItemIndex.value].path);
	}

	const keydownHandlers = (e) =>
	{
		if (e.key === "ArrowDown") selectNextItem();
		if (e.key === "ArrowUp")   selectPrevItem();
		if (e.key === 'Enter')     launchApp();
	}

	onMounted(() =>
	{
		window.addEventListener('keydown', keydownHandlers)
		selectItem(currentSelectedItemIndex.value);
	});

	onUnmounted(() => window.removeEventListener('keydown', keydownHandlers));
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
		width: 100%;
		display: flex;
		row-gap: 10px;
		padding: 0 10px;
		overflow-y: scroll;
		max-height: 300px;
		position: absolute;
		scrollbar-width: thin;
		flex-direction: column;
		top: calc(100% + 20px);
	}
</style>