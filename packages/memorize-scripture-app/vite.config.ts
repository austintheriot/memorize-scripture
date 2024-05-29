import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ _command, _mode }) => {
	return {
		plugins: [tsconfigPaths()],
	}
})
