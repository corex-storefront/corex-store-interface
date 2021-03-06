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

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var compileGraphQLTag = require("./compileGraphQLTag");

var getValidGraphQLTag = require("./getValidGraphQLTag");

var RelayConfig;

try {
  // eslint-disable-next-line no-eval
  RelayConfig = eval('require')('relay-config'); // eslint-disable-next-line lint/no-unused-catch-bindings
} catch (_) {}
/**
 * Using babel-plugin-relay with only the modern runtime?
 *
 *     {
 *       plugins: [
 *         "relay"
 *       ]
 *     }
 */


module.exports = function BabelPluginRelay(context) {
  var t = context.types;

  if (!t) {
    throw new Error('BabelPluginRelay: Expected plugin context to include "types", but got:' + String(context));
  }

  var visitor = {
    TaggedTemplateExpression: function TaggedTemplateExpression(path, state) {
      // Convert graphql`` literals
      var ast = getValidGraphQLTag(path);

      if (ast) {
        compileGraphQLTag(t, path, state, ast);
        return;
      }
    }
  };
  return {
    visitor: {
      Program: function Program(path, state) {
        var config = RelayConfig && RelayConfig.loadConfig();
        path.traverse(visitor, (0, _objectSpread2["default"])({}, state, {
          opts: (0, _objectSpread2["default"])({}, config, state.opts)
        }));
      }
    }
  };
};