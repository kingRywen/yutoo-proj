module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transformIgnorePatterns: ["/node_modules/(?!core-js|vue-worker)"],
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest"
  },
  collectCoverage: false,
  collectCoverageFrom: ["**/src/**/*.{js,vue}", "!**/node_modules/**"]
};
