<script setup>
	import { ref } from 'vue';

	const props = defineProps(
		{
			label:
			{
				type: String,
				required: false
			},
			variants:
			{
				type: Array,
				required: true
			}
		}
	)

	const model = defineModel();
	const emit  = defineEmits(['update:modelValue']);

	const isDropdownOpened = ref(false);

	const updateValue = (value) => emit('update:modelValue', value);
</script>

<template>
	<label class="input-settings-item-wr">
	<span v-if="label">{{ label }}</span>
		<div class="input-settings-item__select" @click="isDropdownOpened = !isDropdownOpened">
			<span>{{ model }}</span>
				<svg viewBox="0 0 24 24" width="17" height="17" fill="gray" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="gray"></path> </g></svg>
		</div>
		<div
			v-if="isDropdownOpened"
			class="input-settings-item__dropdown"
		>
			<div
				v-for="variant in variants"
				:key="variant.name"
				class="input-settings-item__dropdown-item"
				@click="updateValue(variant.name)"
			>
				{{ variant.name }}
			</div>
		</div>
	</label>
</template>

<style lang='scss'>
	.input-settings-item__select
	{
		width: 100%;
		padding: 10px;
		display: flex;
		cursor: pointer;
		border: 1px solid gray;
		justify-content: space-between;

		span { line-height: 16px; }
	}

	.input-settings-item__dropdown-item
	{
		z-index: 2;
		cursor: pointer;
		font-size: 14px;
		user-select: none;
		padding: 5px 0 5px 10px;

		&:hover { background-color: rgba(gray, 0.1); }
	}
</style>