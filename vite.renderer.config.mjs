import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'~': fileURLToPath(new URL('./', import.meta.url)),
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@use "~/src/renderer/assets/scss/_base.scss" as *;
					@use "~/src/renderer/assets/scss/_variables.scss" as *;
				`,
				api: 'modern-compiler'
			}
		}
	}
});