/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 * @emails oncall+relay
 */
'use strict';

var RelayConcreteNode = require("./RelayConcreteNode");

var RelayRecordSourceMutator = require("./RelayRecordSourceMutator");

var RelayRecordSourceProxy = require("./RelayRecordSourceProxy");

var RelayStoreUtils = require("./RelayStoreUtils");

var cloneRelayHandleSourceField = require("./cloneRelayHandleSourceField");

var invariant = require("fbjs/lib/invariant");

var _require = require("./RelayRecordState"),
    EXISTENT = _require.EXISTENT,
    UNKNOWN = _require.UNKNOWN;

var CONDITION = RelayConcreteNode.CONDITION,
    CLIENT_EXTENSION = RelayConcreteNode.CLIENT_EXTENSION,
    DEFER = RelayConcreteNode.DEFER,
    CONNECTION_FIELD = RelayConcreteNode.CONNECTION_FIELD,
    FRAGMENT_SPREAD = RelayConcreteNode.FRAGMENT_SPREAD,
    INLINE_FRAGMENT = RelayConcreteNode.INLINE_FRAGMENT,
    LINKED_FIELD = RelayConcreteNode.LINKED_FIELD,
    LINKED_HANDLE = RelayConcreteNode.LINKED_HANDLE,
    MODULE_IMPORT = RelayConcreteNode.MODULE_IMPORT,
    SCALAR_FIELD = RelayConcreteNode.SCALAR_FIELD,
    SCALAR_HANDLE = RelayConcreteNode.SCALAR_HANDLE,
    STREAM = RelayConcreteNode.STREAM;
var getModuleOperationKey = RelayStoreUtils.getModuleOperationKey,
    getStorageKey = RelayStoreUtils.getStorageKey,
    getArgumentValues = RelayStoreUtils.getArgumentValues;
/**
 * Synchronously check whether the records required to fulfill the given
 * `selector` are present in `source`.
 *
 * If a field is missing, it uses the provided handlers to attempt to substitute
 * data. The `target` will store all records that are modified because of a
 * successful substitution.
 *
 * If all records are present, returns `true`, otherwise `false`.
 */

function check(source, target, selector, handlers, operationLoader, getDataID) {
  var dataID = selector.dataID,
      node = selector.node,
      variables = selector.variables;
  var checker = new DataChecker(source, target, variables, handlers, operationLoader, getDataID);
  return checker.check(node, dataID);
}
/**
 * @private
 */


var DataChecker =
/*#__PURE__*/
function () {
  function DataChecker(source, target, variables, handlers, operationLoader, getDataID) {
    var _operationLoader;

    this._operationLoader = (_operationLoader = operationLoader) !== null && _operationLoader !== void 0 ? _operationLoader : null;
    this._handlers = handlers;
    this._mutator = new RelayRecordSourceMutator(source, target);
    this._recordWasMissing = false;
    this._source = source;
    this._variables = variables;
    this._recordSourceProxy = new RelayRecordSourceProxy(this._mutator, getDataID);
  }

  var _proto = DataChecker.prototype;

  _proto.check = function check(node, dataID) {
    this._traverse(node, dataID);

    return !this._recordWasMissing;
  };

  _proto._getVariableValue = function _getVariableValue(name) {
    !this._variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayAsyncLoader(): Undefined variable `%s`.', name) : invariant(false) : void 0;
    return this._variables[name];
  };

  _proto._handleMissing = function _handleMissing() {
    this._recordWasMissing = true;
  };

  _proto._getDataForHandlers = function _getDataForHandlers(field, dataID) {
    return {
      args: field.args ? getArgumentValues(field.args, this._variables) : {},
      // Getting a snapshot of the record state is potentially expensive since
      // we will need to merge the sink and source records. Since we do not create
      // any new records in this process, it is probably reasonable to provide
      // handlers with a copy of the source record.
      // The only thing that the provided record will not contain is fields
      // added by previous handlers.
      record: this._source.get(dataID)
    };
  };

  _proto._handleMissingScalarField = function _handleMissingScalarField(field, dataID) {
    var _this$_getDataForHand = this._getDataForHandlers(field, dataID),
        args = _this$_getDataForHand.args,
        record = _this$_getDataForHand.record;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this._handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var handler = _step.value;

        if (handler.kind === 'scalar') {
          var newValue = handler.handle(field, record, args, this._recordSourceProxy);

          if (newValue !== undefined) {
            return newValue;
          }
        }
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

    this._handleMissing();
  };

  _proto._handleMissingLinkField = function _handleMissingLinkField(field, dataID) {
    var _this$_getDataForHand2 = this._getDataForHandlers(field, dataID),
        args = _this$_getDataForHand2.args,
        record = _this$_getDataForHand2.record;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this._handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var handler = _step2.value;

        if (handler.kind === 'linked') {
          var newValue = handler.handle(field, record, args, this._recordSourceProxy);

          if (newValue != null && this._mutator.getStatus(newValue) === EXISTENT) {
            return newValue;
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this._handleMissing();
  };

  _proto._handleMissingPluralLinkField = function _handleMissingPluralLinkField(field, dataID) {
    var _this = this;

    var _this$_getDataForHand3 = this._getDataForHandlers(field, dataID),
        args = _this$_getDataForHand3.args,
        record = _this$_getDataForHand3.record;

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this._handlers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var handler = _step3.value;

        if (handler.kind === 'pluralLinked') {
          var newValue = handler.handle(field, record, args, this._recordSourceProxy);

          if (newValue != null) {
            return newValue.filter(function (linkedID) {
              return linkedID != null && _this._mutator.getStatus(linkedID) === EXISTENT;
            });
          }
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    this._handleMissing();
  };

  _proto._traverse = function _traverse(node, dataID) {
    var status = this._mutator.getStatus(dataID);

    if (status === UNKNOWN) {
      this._handleMissing();
    }

    if (status === EXISTENT) {
      this._traverseSelections(node.selections, dataID);
    }
  };

  _proto._traverseSelections = function _traverseSelections(selections, dataID) {
    var _this2 = this;

    selections.forEach(function (selection) {
      switch (selection.kind) {
        case SCALAR_FIELD:
          _this2._checkScalar(selection, dataID);

          break;

        case LINKED_FIELD:
          if (selection.plural) {
            _this2._checkPluralLink(selection, dataID);
          } else {
            _this2._checkLink(selection, dataID);
          }

          break;

        case CONDITION:
          var conditionValue = _this2._getVariableValue(selection.condition);

          if (conditionValue === selection.passingValue) {
            _this2._traverseSelections(selection.selections, dataID);
          }

          break;

        case INLINE_FRAGMENT:
          var typeName = _this2._mutator.getType(dataID);

          if (typeName != null && typeName === selection.type) {
            _this2._traverseSelections(selection.selections, dataID);
          }

          break;

        case LINKED_HANDLE:
          // Handles have no selections themselves; traverse the original field
          // where the handle was set-up instead.
          var handleField = cloneRelayHandleSourceField(selection, selections, _this2._variables);

          if (handleField.plural) {
            _this2._checkPluralLink(handleField, dataID);
          } else {
            _this2._checkLink(handleField, dataID);
          }

          break;

        case MODULE_IMPORT:
          _this2._checkModuleImport(selection, dataID);

          break;

        case DEFER:
        case STREAM:
          _this2._traverseSelections(selection.selections, dataID);

          break;

        case SCALAR_HANDLE:
        case FRAGMENT_SPREAD:
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayAsyncLoader(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0; // $FlowExpectedError - we need the break; for OSS linter

          break;

        case CLIENT_EXTENSION:
          var recordWasMissing = _this2._recordWasMissing;

          _this2._traverseSelections(selection.selections, dataID);

          _this2._recordWasMissing = recordWasMissing;
          break;

        case CONNECTION_FIELD:
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'DataChecker(): Connection fields are not supported yet.') : invariant(false) : void 0; // $FlowExpectedError - we need the break; for OSS linter

          break;

        default:
          selection;
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayAsyncLoader(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0;
      }
    });
  };

  _proto._checkModuleImport = function _checkModuleImport(moduleImport, dataID) {
    var operationLoader = this._operationLoader;
    !(operationLoader !== null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DataChecker: Expected an operationLoader to be configured when using `@module`.') : invariant(false) : void 0;
    var operationKey = getModuleOperationKey(moduleImport.documentName);

    var operationReference = this._mutator.getValue(dataID, operationKey);

    if (operationReference == null) {
      if (operationReference === undefined) {
        this._handleMissing();
      }

      return;
    }

    var operation = operationLoader.get(operationReference);

    if (operation != null) {
      this._traverse(operation, dataID);
    } else {
      // If the fragment is not available, we assume that the data cannot have been
      // processed yet and must therefore be missing.
      this._handleMissing();
    }
  };

  _proto._checkScalar = function _checkScalar(field, dataID) {
    var storageKey = getStorageKey(field, this._variables);

    var fieldValue = this._mutator.getValue(dataID, storageKey);

    if (fieldValue === undefined) {
      fieldValue = this._handleMissingScalarField(field, dataID);

      if (fieldValue !== undefined) {
        this._mutator.setValue(dataID, storageKey, fieldValue);
      }
    }
  };

  _proto._checkLink = function _checkLink(field, dataID) {
    var storageKey = getStorageKey(field, this._variables);

    var linkedID = this._mutator.getLinkedRecordID(dataID, storageKey);

    if (linkedID === undefined) {
      linkedID = this._handleMissingLinkField(field, dataID);

      if (linkedID != null) {
        this._mutator.setLinkedRecordID(dataID, storageKey, linkedID);
      }
    }

    if (linkedID != null) {
      this._traverse(field, linkedID);
    }
  };

  _proto._checkPluralLink = function _checkPluralLink(field, dataID) {
    var _this3 = this;

    var storageKey = getStorageKey(field, this._variables);

    var linkedIDs = this._mutator.getLinkedRecordIDs(dataID, storageKey);

    if (linkedIDs === undefined) {
      linkedIDs = this._handleMissingPluralLinkField(field, dataID);

      if (linkedIDs != null) {
        this._mutator.setLinkedRecordIDs(dataID, storageKey, linkedIDs);
      }
    }

    if (linkedIDs) {
      linkedIDs.forEach(function (linkedID) {
        if (linkedID != null) {
          _this3._traverse(field, linkedID);
        }
      });
    }
  };

  return DataChecker;
}();

module.exports = {
  check: check
};