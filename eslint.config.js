const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
	globalIgnores(['dist/*', '.expo/*']),
	expoConfig,
	prettierRecommended,
	{
		rules: {
			'react/jsx-sort-props': ['warn', { ignoreCase: false }],
			'sort-keys': ['warn', 'asc', { caseSensitive: true, natural: true }]
		}
	}
]);
