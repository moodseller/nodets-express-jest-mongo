module.exports = {
	setupFiles: ['./jest.setup.js'],
	testEnvironment: 'node',
	transform: { '^.+\\.(js|ts|jsx|tsx)$': 'ts-jest' },
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
	testPathIgnorePatterns: ['/node_modules/', '/__tests__/mock/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	globals: {
		NODE_ENV: 'test',
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	}
};
