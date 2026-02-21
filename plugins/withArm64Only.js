const { withAppBuildGradle } = require('@expo/config-plugins');

const withArm64Only = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Forzar solo arm64-v8a (16KB compatible)
    if (!contents.includes('abiFilters')) {
      contents = contents.replace(
        /defaultConfig\s*{/,
        `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withArm64Only;
