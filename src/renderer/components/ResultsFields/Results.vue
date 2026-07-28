<script setup>
	import { onMounted, onUnmounted, ref } from 'vue';
	import App from './App.vue';
	import Calculation from './Calculation.vue';

	const props = defineProps(
		{
			items:
			{
				type     : Array,
				required : false,
				default  : []
			},
			calculation:
			{
				type     : String,
				required : false,
				default  : ''
			},
			type:
			{
				type     : String,
				required : false,
				default  : 'app'
			}
		}
	);

	const currentSelectedItemIndex = ref(0);
	const calculationRef           = ref(null);
	const resultsRef               = ref(null);

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

		scrollItemIntoView(resultsRef.value.children[currentSelectedItemIndex.value], 'end');
	};

	const selectPrevItem = () =>
	{
		if (currentSelectedItemIndex.value <= 0) return;

		currentSelectedItemIndex.value -= 1;
		selectItem(currentSelectedItemIndex.value, currentSelectedItemIndex.value + 1);

		scrollItemIntoView(resultsRef.value.children[currentSelectedItemIndex.value], 'start');
	};

	const scrollItemIntoView = (item, blockOption) => item.scrollIntoView(
		{
			behavior : 'smooth',
			block    : blockOption
		}
	);

	const launchApp = () =>
	{
		window.electron.ipcRenderer.send('launchApp', props.items[currentSelectedItemIndex.value].path);
	};

	const keydownHandlers = (e) =>
	{
		if (e.key === "ArrowDown") selectNextItem();
		if (e.key === "ArrowUp") selectPrevItem();
		if (e.key === 'Enter')
		{
			if (props.type === 'app')
				launchApp();
			else if (props.type === 'calculation')
				calculationRef.value.copy();
		}
	};

	onMounted(() =>
	{
		window.addEventListener('keydown', keydownHandlers);
		selectItem(currentSelectedItemIndex.value);
	});

	onUnmounted(() => window.removeEventListener('keydown', keydownHandlers));
</script>

<template>
	<div
		class="results"
		ref="resultsRef"
	>
		<template v-if="type === 'app'">
			<App
				v-for="item in items"
				:key="item.id"
				:item="item"
			/>
		</template>

		<template v-if="type === 'calculation'">
			<Calculation
				:calculation
				ref="calculationRef"
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

	.results__item
	{
		color: var(--input-text-color);
		width: 100%;
		border: var(--input-border);
		opacity: 0.5;
		padding: 20px;
		font-size: 18px;
		border-radius: var(--input-border-radius);
		background-color: var(--input-background-color);

		display: flex;
		flex-shrink: 0;
		column-gap: 10px;
		align-items: center;

		@include tr(0.3, background-color, opacity);

		&.active,
		&:hover
		{
			cursor: pointer;
			opacity: 1 !important;
		}
	}

	.results__item-info { overflow: hidden; }

	.results__item-icon
	{
		width: 40px;
		height: 40px;
		object-fit: contain;

		flex-shrink: 0;
	}

	.results__item-info-path
	{
		opacity: 0.5;
		overflow: hidden;
		font-size: 14px;
		text-overflow: ellipsis;
	}
</style>