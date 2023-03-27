module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
    'vue'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.(t)s$': 'ts-jest'
  },
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/plugins/**/*.ts',
    '<rootDir>/serverMiddleware/**/*.ts'
  ],
  testMatch: [
    '<rootDir>/__tests__/unit/**/*spec.[t|j]s?(x)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e/'
  ],
  preset: 'ts-jest/presets/js-with-babel'
};
