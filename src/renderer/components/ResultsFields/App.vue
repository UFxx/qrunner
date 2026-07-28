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