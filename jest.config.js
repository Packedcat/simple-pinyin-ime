export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 用于将 @/ 转换为 src/，根据你的项目目录结构进行调整
  },
}
