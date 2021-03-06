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

var NormalizationCodeGenerator = require("./NormalizationCodeGenerator");

var ReaderCodeGenerator = require("./ReaderCodeGenerator");

var _require = require("./RelayCompilerError"),
    createCompilerError = _require.createCompilerError;

function generate(node) {
  var _node$metadata;

  switch (node.kind) {
    case 'Fragment':
      if (((_node$metadata = node.metadata) === null || _node$metadata === void 0 ? void 0 : _node$metadata.inlineData) === true) {
        return {
          kind: 'InlineDataFragment',
          name: node.name
        };
      }

      return ReaderCodeGenerator.generate(node);

    case 'Request':
      return {
        kind: 'Request',
        fragment: ReaderCodeGenerator.generate(node.fragment),
        operation: NormalizationCodeGenerator.generate(node.root),
        params: {
          operationKind: node.root.operation,
          name: node.name,
          id: node.id,
          text: node.text,
          metadata: node.metadata
        }
      };

    case 'SplitOperation':
      return NormalizationCodeGenerator.generate(node);
  }

  throw createCompilerError("RelayCodeGenerator: Unknown AST kind '".concat(node.kind, "'."), [node.loc]);
}

module.exports = {
  generate: generate
};