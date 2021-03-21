module.exports = {
  roots: ['src'],
  transform: { '\\.ts$': ['ts-jest'] },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}'],
};
