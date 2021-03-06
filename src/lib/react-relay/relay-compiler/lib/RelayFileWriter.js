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

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var ASTConvert = require("./ASTConvert");

var CodegenDirectory = require("./CodegenDirectory");

var CompilerContext = require("./GraphQLCompilerContext");

var Profiler = require("./GraphQLCompilerProfiler");

var RelayParser = require("./RelayParser");

var RelayValidator = require("./RelayValidator");

var SchemaUtils = require("./GraphQLSchemaUtils");

var compileRelayArtifacts = require("./compileRelayArtifacts");

var crypto = require("crypto");

var graphql = require("graphql");

var invariant = require("fbjs/lib/invariant");

var nullthrows = require("nullthrows");

var path = require("path");

var writeRelayGeneratedFile = require("./writeRelayGeneratedFile");

var _require = require("./GraphQLDerivedFromMetadata"),
    getReaderSourceDefinitionName = _require.getReaderSourceDefinitionName;

var _require2 = require("immutable"),
    ImmutableMap = _require2.Map;

var isExecutableDefinitionAST = SchemaUtils.isExecutableDefinitionAST;

function compileAll(_ref) {
  var baseDir = _ref.baseDir,
      baseDocuments = _ref.baseDocuments,
      baseSchema = _ref.baseSchema,
      compilerTransforms = _ref.compilerTransforms,
      documents = _ref.documents,
      extraValidationRules = _ref.extraValidationRules,
      reporter = _ref.reporter,
      schemaExtensions = _ref.schemaExtensions,
      typeGenerator = _ref.typeGenerator; // Can't convert to IR unless the schema already has Relay-local extensions

  var transformedSchema = ASTConvert.transformASTSchema(baseSchema, schemaExtensions);
  var extendedSchema = ASTConvert.extendASTSchema(transformedSchema, [].concat((0, _toConsumableArray2["default"])(baseDocuments), (0, _toConsumableArray2["default"])(documents))); // Verify using local and global rules, can run global verifications here
  // because all files are processed together

  var validationRules = [].concat((0, _toConsumableArray2["default"])(RelayValidator.LOCAL_RULES), (0, _toConsumableArray2["default"])(RelayValidator.GLOBAL_RULES));

  if (extraValidationRules) {
    validationRules = [].concat((0, _toConsumableArray2["default"])(validationRules), (0, _toConsumableArray2["default"])(extraValidationRules.LOCAL_RULES || []), (0, _toConsumableArray2["default"])(extraValidationRules.GLOBAL_RULES || []));
  }

  var definitions = ASTConvert.convertASTDocumentsWithBase(extendedSchema, baseDocuments, documents, validationRules, RelayParser.transform);
  var compilerContext = new CompilerContext(baseSchema, extendedSchema).addAll(definitions);
  var transformedTypeContext = compilerContext.applyTransforms(typeGenerator.transforms, reporter);
  var transformedQueryContext = compilerContext.applyTransforms([].concat((0, _toConsumableArray2["default"])(compilerTransforms.commonTransforms), (0, _toConsumableArray2["default"])(compilerTransforms.queryTransforms)), reporter);
  var artifacts = compileRelayArtifacts(compilerContext, compilerTransforms, reporter);
  return {
    artifacts: artifacts,
    definitions: definitions,
    transformedQueryContext: transformedQueryContext,
    transformedTypeContext: transformedTypeContext
  };
}

function writeAll(_ref2) {
  var writerConfig = _ref2.config,
      onlyValidate = _ref2.onlyValidate,
      baseDocuments = _ref2.baseDocuments,
      documents = _ref2.documents,
      baseSchema = _ref2.schema,
      reporter = _ref2.reporter,
      sourceControl = _ref2.sourceControl;
  return Profiler.asyncContext('RelayFileWriter.writeAll',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    var _compileAll = compileAll({
      baseDir: writerConfig.baseDir,
      baseDocuments: baseDocuments.valueSeq().toArray(),
      baseSchema: baseSchema,
      compilerTransforms: writerConfig.compilerTransforms,
      documents: documents.valueSeq().toArray(),
      extraValidationRules: writerConfig.validationRules,
      reporter: reporter,
      schemaExtensions: writerConfig.schemaExtensions,
      typeGenerator: writerConfig.typeGenerator
    }),
        artifactsWithBase = _compileAll.artifacts,
        definitions = _compileAll.definitions,
        transformedTypeContext = _compileAll.transformedTypeContext,
        transformedQueryContext = _compileAll.transformedQueryContext; // Build a context from all the documents


    var baseDefinitionNames = new Set();
    baseDocuments.forEach(function (doc) {
      doc.definitions.forEach(function (def) {
        if (isExecutableDefinitionAST(def) && def.name) {
          baseDefinitionNames.add(def.name.value);
        }
      });
    }); // remove nodes that are present in the base or that derive from nodes
    // in the base

    var artifacts = artifactsWithBase.filter(function (_ref3) {
      var _definition = _ref3[0],
          node = _ref3[1];
      var sourceName = getReaderSourceDefinitionName(node);
      return !baseDefinitionNames.has(sourceName);
    });
    var artifactMap = new Map(artifacts.map(function (_ref4) {
      var _definition = _ref4[0],
          node = _ref4[1];
      return [node.kind === 'Request' ? node.params.name : node.name, node];
    }));
    var existingFragmentNames = new Set(definitions.map(function (definition) {
      return definition.name;
    }));
    var definitionsMeta = new Map();

    var getDefinitionMeta = function getDefinitionMeta(definitionName) {
      var artifact = nullthrows(artifactMap.get(definitionName));
      var sourceName = getReaderSourceDefinitionName(artifact);
      var definitionMeta = definitionsMeta.get(sourceName);
      !definitionMeta ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayFileWriter: Could not determine source for definition: `%s`.', definitionName) : invariant(false) : void 0;
      return definitionMeta;
    };

    documents.forEach(function (doc, filePath) {
      doc.definitions.forEach(function (def) {
        if (def.name) {
          definitionsMeta.set(def.name.value, {
            dir: path.join(writerConfig.baseDir, path.dirname(filePath)),
            ast: def
          });
        }
      });
    }); // TODO(T22651734): improve this to correctly account for fragments that
    // have generated flow types.

    baseDefinitionNames.forEach(function (baseDefinitionName) {
      existingFragmentNames["delete"](baseDefinitionName);
    });
    var allOutputDirectories = new Map();

    var addCodegenDir = function addCodegenDir(dirPath) {
      var codegenDir = new CodegenDirectory(dirPath, {
        onlyValidate: onlyValidate
      });
      allOutputDirectories.set(dirPath, codegenDir);
      return codegenDir;
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (writerConfig.generatedDirectories || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var existingDirectory = _step.value;
        addCodegenDir(existingDirectory);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var configOutputDirectory;

    if (writerConfig.outputDir) {
      configOutputDirectory = addCodegenDir(writerConfig.outputDir);
    }

    var getGeneratedDirectory = function getGeneratedDirectory(definitionName) {
      if (configOutputDirectory) {
        return configOutputDirectory;
      }

      var generatedPath = path.join(getDefinitionMeta(definitionName).dir, '__generated__');
      var cachedDir = allOutputDirectories.get(generatedPath);

      if (!cachedDir) {
        cachedDir = addCodegenDir(generatedPath);
      }

      return cachedDir;
    };

    var formatModule = Profiler.instrument(writerConfig.formatModule, 'RelayFileWriter:formatModule');
    var persistQuery = writerConfig.persistQuery ? Profiler.instrumentWait(writerConfig.persistQuery, 'RelayFileWriter:persistQuery') : null;

    try {
      yield Promise.all(artifacts.map(
      /*#__PURE__*/
      function () {
        var _ref7 = _asyncToGenerator(function* (_ref5) {
          var _writerConfig$repersi;

          var definition = _ref5[0],
              node = _ref5[1];
          var nodeName = node.kind === 'Request' ? node.params.name : node.name;

          if (baseDefinitionNames.has(nodeName)) {
            // don't add definitions that were part of base context
            return;
          }

          var typeNode = transformedTypeContext.get(nodeName);
          var typeText = typeNode ?
          /* $FlowFixMe(>=0.98.0 site=react_native_fb,oss) This comment
           * suppresses an error found when Flow v0.98 was deployed. To see
           * the error delete this comment and run Flow. */
          writerConfig.typeGenerator.generate(typeNode, {
            customScalars: writerConfig.customScalars,
            enumsHasteModule: writerConfig.enumsHasteModule,
            existingFragmentNames: existingFragmentNames,
            optionalInputFields: writerConfig.optionalInputFieldsForFlow,
            useHaste: writerConfig.useHaste,
            useSingleArtifactDirectory: !!writerConfig.outputDir,
            noFutureProofEnums: writerConfig.noFutureProofEnums
          }) : '';
          var sourceHash = Profiler.run('hashGraphQL', function () {
            return md5(graphql.print(getDefinitionMeta(nodeName).ast));
          });
          yield writeRelayGeneratedFile(getGeneratedDirectory(nodeName), definition, node, formatModule, typeText, persistQuery, writerConfig.platform, sourceHash, writerConfig.extension, writerConfig.printModuleDependency, (_writerConfig$repersi = writerConfig.repersist) !== null && _writerConfig$repersi !== void 0 ? _writerConfig$repersi : false);
        });

        return function (_x) {
          return _ref7.apply(this, arguments);
        };
      }()));
      var generateExtraFiles = writerConfig.generateExtraFiles;

      if (generateExtraFiles) {
        Profiler.run('RelayFileWriter:generateExtraFiles', function () {
          var configDirectory = writerConfig.outputDir;
          generateExtraFiles(function (dir) {
            var outputDirectory = dir || configDirectory;
            !outputDirectory ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayFileWriter: cannot generate extra files without specifying ' + 'an outputDir in the config or passing it in.') : invariant(false) : void 0;
            var outputDir = allOutputDirectories.get(outputDirectory);

            if (!outputDir) {
              outputDir = addCodegenDir(outputDirectory);
            }

            return outputDir;
          }, transformedQueryContext, getGeneratedDirectory);
        });
      }

      allOutputDirectories.forEach(function (dir) {
        dir.deleteExtraFiles();
      });

      if (sourceControl && !onlyValidate) {
        yield CodegenDirectory.sourceControlAddRemove(sourceControl, Array.from(allOutputDirectories.values()));
      }
    } catch (error) {
      var details;

      try {
        details = JSON.parse(error.message);
      } catch (_) {} // eslint-disable-line lint/no-unused-catch-bindings


      if (details && details.name === 'GraphQL2Exception' && details.message) {
        throw new Error('GraphQL error writing modules:\n' + details.message);
      }

      throw new Error('Error writing modules:\n' + String(error.stack || error));
    }

    return allOutputDirectories;
  }));
}

function md5(x) {
  return crypto.createHash('md5').update(x, 'utf8').digest('hex');
}

module.exports = {
  writeAll: writeAll
};