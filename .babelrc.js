const config = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "useBuiltIns": "usage",
        "targets": {
          "chrome": "58",
          "ie": "10"
        },
        "corejs": 3,
        "debug": false
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ],
    "@babel/plugin-transform-runtime",
    [
      "import",
      {
        "libraryName": "antd",
        "style": true
      }
    ],
    "@babel/syntax-dynamic-import",
    "react-hot-loader/babel"
  ]
};

//  线上删除console.log
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(["transform-remove-console", { "exclude": ["error", "warn"] }]);
}

module.exports = config;
