<script setup>
	const props = defineProps(
		{
			item:
			{
				type: Object,
				required: true
			}
		}
	);
</script>

<template>
	<div
		class="results__item results__item-app"
		:class="{ 'active': item.isSelected }"
	>
		<img
			class="results__item-icon"
			:src="item.icon"
		>
		<div class="results__item-info">
			<p class="results__item-info-name">{{`${item.name}.${item.extension}`}}</p>
			<p class="results__item-info-path">{{ item.path }}</p>
		</div>
	</div>
</template>

<style lang='scss'>
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