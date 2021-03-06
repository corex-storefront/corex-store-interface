/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

var compileGraphQLTag = require("./compileGraphQLTag");

var getValidGraphQLTag = require("./getValidGraphQLTag");

var _require = require("babel-plugin-macros"),
    createMacro = _require.createMacro;

var configName = 'relay';

function BabelPluginRelayMacro(_ref) {
  var references = _ref.references,
      state = _ref.state,
      babel = _ref.babel,
      config = _ref.config;
  var t = babel.types;
  Object.keys(references).forEach(function (referenceKey) {
    references[referenceKey].forEach(function (reference) {
      var path = reference.parentPath;
      var ast = getValidGraphQLTag(path);

      if (ast) {
        compileGraphQLTag(t, path, Object.assign(state, config ? {
          opts: config
        } : {}), ast);
      }
    });
  });
}

module.exports = createMacro(BabelPluginRelayMacro, {
  configName: configName
});