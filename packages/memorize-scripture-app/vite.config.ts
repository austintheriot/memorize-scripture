import path from 'path'
import { defineConfig } from 'vite'
export default defineConfig(({ _command, _mode }) => {
	return {
		resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	}
})
