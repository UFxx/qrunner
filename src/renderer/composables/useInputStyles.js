import { computed } from 'vue';

export function useInputStyles(inputSettings) {
	const inputStyles = computed(() => {
		return {
			"--input-border"                 : `${inputSettings.inputBorderSize} ${inputSettings.inputBorderStyle} ${inputSettings.inputBorderColor}`,
			"--input-padding"                : inputSettings.inputPadding,
			"--input-opacity"                : inputSettings.inputOpacity,
			"--input-font-size"              : inputSettings.inputFontSize,
			"--input-icon-size"              : inputSettings.inputIconSize,
			"--input-text-color"             : inputSettings.inputTextColor,
			"--input-border-radius"          : inputSettings.inputBorderRadius,
			"--input-opacity-focus"          : inputSettings.inputOpacityFocus,
			"--input-background-color"       : inputSettings.inputBgColor,
			"--input-placeholder-text-color" : inputSettings.inputPlaceholderTextColor
		};
	});

	return inputStyles;
}