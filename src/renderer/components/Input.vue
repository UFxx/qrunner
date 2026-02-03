<script setup>
	import { ref, onMounted, computed } from 'vue';

	const props = defineProps(
		{
			inputSettings:
			{
				type: Object,
				required: true
			}
		}
	)

	const emit = defineEmits(['toggleSettings']);

	const input = ref();

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
	)

	onMounted(() => input.value.focus());
</script>

<template>
	<input
		:style="inputStyles"
		ref="input"
		type="text"
		:placeholder="inputSettings.placeholder"
		@dblclick="emit('toggleSettings', true)"
	>
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