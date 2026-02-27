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
	},
	{
		files: ['src/__tests__/**/*.ts'],
		languageOptions: {
			globals: {
				afterAll: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				beforeEach: 'readonly',
				describe: 'readonly',
				expect: 'readonly',
				it: 'readonly',
				jest: 'readonly'
			}
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		}
	}
]);
