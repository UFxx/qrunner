<script setup>
	import { ref } from 'vue';

	const props = defineProps(
		{
			label:
			{
				type: String,
				required: true
			},
			variants:
			{
				type: Array,
				required: true
			}
		}
	)

	const model            = defineModel();

	const isDropdownOpened = ref(false);
</script>

<template>
	<label class="input-settings-item-wr">
	{{ label }}
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
				@click="(e) => model = e.target.textContent"
			>
				{{ variant.name }}
			</div>
		</div>
	</label>
</template>

<style lang='scss'>
	.input-settings-item__select
	{
		cursor: pointer;
		padding: 10px;
		border: 1px solid gray;
		width: 100%;
		display: flex;
		justify-content: space-between;

		span { line-height: 16px; }
	}

	.input-settings-item__dropdown-item
	{
		cursor: pointer;
		z-index: 2;
		font-size: 14px;
		padding: 5px 0 5px 10px;

		&:hover { background-color: rgba(gray, 0.1); }
	}
</style>