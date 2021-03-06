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

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var CodeMarker = require("./CodeMarker");

var Profiler = require("./GraphQLCompilerProfiler");

var crypto = require("crypto");

var dedupeJSONStringify = require("./dedupeJSONStringify");

var invariant = require("fbjs/lib/invariant");

var _require = require("relay-runtime"),
    RelayConcreteNode = _require.RelayConcreteNode;

function printRequireModuleDependency(moduleName) {
  return "require('".concat(moduleName, "')");
}

function getConcreteType(node) {
  switch (node.kind) {
    case RelayConcreteNode.FRAGMENT:
      return 'ReaderFragment';

    case RelayConcreteNode.REQUEST:
      return 'ConcreteRequest';

    case RelayConcreteNode.SPLIT_OPERATION:
      return 'NormalizationSplitOperation';

    case RelayConcreteNode.INLINE_DATA_FRAGMENT:
      return 'ReaderInlineDataFragment';

    default:
      node;
      !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Unexpected GeneratedNode kind: `%s`.', node.kind) : invariant(false) : void 0;
  }
}

function writeRelayGeneratedFile(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
  return _writeRelayGeneratedFile.apply(this, arguments);
}

function _writeRelayGeneratedFile() {
  _writeRelayGeneratedFile = _asyncToGenerator(function* (codegenDir, definition, _generatedNode, formatModule, typeText, _persistQuery, platform, sourceHash, extension) {
    var printModuleDependency = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : printRequireModuleDependency;
    var shouldRepersist = arguments.length > 10 ? arguments[10] : undefined;
    var generatedNode = _generatedNode; // Copy to const so Flow can refine.

    var persistQuery = _persistQuery;
    var moduleName = (generatedNode.kind === 'Request' ? generatedNode.params.name : generatedNode.name) + '.graphql';
    var platformName = platform != null && platform.length > 0 ? moduleName + '.' + platform : moduleName;
    var filename = platformName + '.' + extension;
    var typeName = getConcreteType(generatedNode);
    var docText;

    if (generatedNode.kind === RelayConcreteNode.REQUEST) {
      docText = generatedNode.params.text;
    }

    var hash = null;

    if (generatedNode.kind === RelayConcreteNode.REQUEST) {
      var oldHash = Profiler.run('RelayFileWriter:compareHash', function () {
        var oldContent = codegenDir.read(filename); // Hash the concrete node including the query text.

        var hasher = crypto.createHash('md5');
        hasher.update('cache-breaker-9');
        hasher.update(JSON.stringify(generatedNode));
        hasher.update(sourceHash);

        if (typeText) {
          hasher.update(typeText);
        }

        if (persistQuery) {
          hasher.update('persisted');
        }

        hash = hasher.digest('hex');
        return extractHash(oldContent);
      });

      if (!shouldRepersist && hash === oldHash) {
        codegenDir.markUnchanged(filename);
        return null;
      }

      if (codegenDir.onlyValidate) {
        codegenDir.markUpdated(filename);
        return null;
      }

      if (persistQuery) {
        switch (generatedNode.kind) {
          case RelayConcreteNode.REQUEST:
            var _text = generatedNode.params.text;
            !(_text != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'writeRelayGeneratedFile: Expected `text` in order to persist query') : invariant(false) : void 0;
            generatedNode = (0, _objectSpread2["default"])({}, generatedNode, {
              params: {
                operationKind: generatedNode.params.operationKind,
                name: generatedNode.params.name,
                id: yield persistQuery(_text),
                text: null,
                metadata: generatedNode.params.metadata
              }
            });
            break;

          case RelayConcreteNode.FRAGMENT:
            // Do not persist fragments.
            break;

          default:
            generatedNode.kind;
        }
      }
    }

    var moduleText = formatModule({
      moduleName: moduleName,
      documentType: typeName,
      definition: definition,
      kind: generatedNode.kind,
      docText: docText,
      typeText: typeText,
      hash: hash ? "@relayHash ".concat(hash) : null,
      concreteText: CodeMarker.postProcess(dedupeJSONStringify(generatedNode), printModuleDependency),
      sourceHash: sourceHash,
      node: generatedNode
    });
    codegenDir.writeFile(filename, moduleText, shouldRepersist);
    return generatedNode;
  });
  return _writeRelayGeneratedFile.apply(this, arguments);
}

function extractHash(text) {
  if (text == null || text.length === 0) {
    return null;
  }

  if (/<<<<<|>>>>>/.test(text)) {
    // looks like a merge conflict
    return null;
  }

  var match = text.match(/@relayHash (\w{32})\b/m);
  return match && match[1];
}

module.exports = writeRelayGeneratedFile;