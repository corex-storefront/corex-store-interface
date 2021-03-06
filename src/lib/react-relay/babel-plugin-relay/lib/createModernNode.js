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

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var crypto = require("crypto");

var path = require("path");

var _require = require("graphql"),
    print = _require.print;

var GENERATED = './__generated__/';
/**
 * Relay Modern creates separate generated files, so Babel transforms graphql
 * definitions to lazy require function calls.
 */

function createModernNode(t, graphqlDefinition, state, options) {
  var definitionName = graphqlDefinition.name && graphqlDefinition.name.value;

  if (!definitionName) {
    throw new Error('GraphQL operations and fragments must contain names');
  }

  var requiredFile = definitionName + '.graphql';
  var requiredPath = options.isHasteMode ? requiredFile : options.artifactDirectory ? getRelativeImportPath(state, options.artifactDirectory, requiredFile) : GENERATED + requiredFile;
  var hash = crypto.createHash('md5').update(print(graphqlDefinition), 'utf8').digest('hex');
  var requireGraphQLModule = t.callExpression(t.identifier('require'), [t.stringLiteral(requiredPath)]);
  var bodyStatements = [t.returnStatement(requireGraphQLModule)];

  if (options.isDevVariable != null || options.isDevelopment) {
    var nodeVariable = t.identifier('node');
    var nodeDotHash = t.memberExpression(nodeVariable, t.identifier('hash'));
    var checkStatements = [t.variableDeclaration('const', [t.variableDeclarator(nodeVariable, requireGraphQLModule)]), t.ifStatement(t.logicalExpression('&&', nodeDotHash, t.binaryExpression('!==', nodeDotHash, t.stringLiteral(hash))), t.blockStatement([t.expressionStatement(warnNeedsRebuild(t, definitionName, options.buildCommand))]))];

    if (options.isDevVariable != null) {
      checkStatements = [t.ifStatement(t.identifier(options.isDevVariable), t.blockStatement(checkStatements))];
    }

    bodyStatements.unshift.apply(bodyStatements, (0, _toConsumableArray2["default"])(checkStatements));
  }

  return t.functionExpression(null, [], t.blockStatement(bodyStatements));
}

function warnNeedsRebuild(t, definitionName, buildCommand) {
  return t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('error')), [t.stringLiteral("The definition of '".concat(definitionName, "' appears to have changed. Run ") + '`' + buildCommand + '` to update the generated files to receive the expected data.')]);
}

function getRelativeImportPath(state, artifactDirectory, fileToRequire) {
  if (state.file == null) {
    throw new Error('Babel state is missing expected file name');
  }

  var filename = state.file.opts.filename;
  var relative = path.relative(path.dirname(filename), path.resolve(artifactDirectory));
  var relativeReference = relative.length === 0 || !relative.startsWith('.') ? './' : '';
  return relativeReference + path.join(relative, fileToRequire);
}

module.exports = createModernNode;