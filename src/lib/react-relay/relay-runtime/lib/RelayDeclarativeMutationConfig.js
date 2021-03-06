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

var RelayConnectionHandler = require("./RelayConnectionHandler");

var warning = require("fbjs/lib/warning");

var MutationTypes = Object.freeze({
  RANGE_ADD: 'RANGE_ADD',
  RANGE_DELETE: 'RANGE_DELETE',
  NODE_DELETE: 'NODE_DELETE',
  FIELDS_CHANGE: 'FIELDS_CHANGE',
  REQUIRED_CHILDREN: 'REQUIRED_CHILDREN'
});
var RangeOperations = Object.freeze({
  APPEND: 'append',
  IGNORE: 'ignore',
  PREPEND: 'prepend',
  REFETCH: 'refetch',
  // legacy only
  REMOVE: 'remove' // legacy only

});

function convert(configs, request, optimisticUpdater, updater) {
  var configOptimisticUpdates = optimisticUpdater ? [optimisticUpdater] : [];
  var configUpdates = updater ? [updater] : [];
  configs.forEach(function (config) {
    switch (config.type) {
      case 'NODE_DELETE':
        var nodeDeleteResult = nodeDelete(config, request);

        if (nodeDeleteResult) {
          configOptimisticUpdates.push(nodeDeleteResult);
          configUpdates.push(nodeDeleteResult);
        }

        break;

      case 'RANGE_ADD':
        var rangeAddResult = rangeAdd(config, request);

        if (rangeAddResult) {
          configOptimisticUpdates.push(rangeAddResult);
          configUpdates.push(rangeAddResult);
        }

        break;

      case 'RANGE_DELETE':
        var rangeDeleteResult = rangeDelete(config, request);

        if (rangeDeleteResult) {
          configOptimisticUpdates.push(rangeDeleteResult);
          configUpdates.push(rangeDeleteResult);
        }

        break;
    }
  });
  return {
    optimisticUpdater: function optimisticUpdater(store, data) {
      configOptimisticUpdates.forEach(function (eachOptimisticUpdater) {
        eachOptimisticUpdater(store, data);
      });
    },
    updater: function updater(store, data) {
      configUpdates.forEach(function (eachUpdater) {
        eachUpdater(store, data);
      });
    }
  };
}

function nodeDelete(config, request) {
  var deletedIDFieldName = config.deletedIDFieldName;
  var rootField = getRootField(request);

  if (!rootField) {
    return null;
  }

  return function (store, data) {
    var payload = store.getRootField(rootField);

    if (!payload) {
      return;
    }

    var deleteID = payload.getValue(deletedIDFieldName);
    var deleteIDs = Array.isArray(deleteID) ? deleteID : [deleteID];
    deleteIDs.forEach(function (id) {
      if (id && typeof id === 'string') {
        store["delete"](id);
      }
    });
  };
}

function rangeAdd(config, request) {
  var parentID = config.parentID,
      connectionInfo = config.connectionInfo,
      edgeName = config.edgeName;

  if (!parentID) {
    process.env.NODE_ENV !== "production" ? warning(false, 'RelayDeclarativeMutationConfig: For mutation config RANGE_ADD ' + 'to work you must include a parentID') : void 0;
    return null;
  }

  var rootField = getRootField(request);

  if (!connectionInfo || !rootField) {
    return null;
  }

  return function (store, data) {
    var parent = store.get(parentID);

    if (!parent) {
      return;
    }

    var payload = store.getRootField(rootField);

    if (!payload) {
      return;
    }

    var serverEdge = payload.getLinkedRecord(edgeName);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = connectionInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var info = _step.value;

        if (!serverEdge) {
          continue;
        }

        var connection = RelayConnectionHandler.getConnection(parent, info.key, info.filters);

        if (!connection) {
          continue;
        }

        var clientEdge = RelayConnectionHandler.buildConnectionEdge(store, connection, serverEdge);

        if (!clientEdge) {
          continue;
        }

        switch (info.rangeBehavior) {
          case 'append':
            RelayConnectionHandler.insertEdgeAfter(connection, clientEdge);
            break;

          case 'ignore':
            // Do nothing
            break;

          case 'prepend':
            RelayConnectionHandler.insertEdgeBefore(connection, clientEdge);
            break;

          default:
            process.env.NODE_ENV !== "production" ? warning(false, 'RelayDeclarativeMutationConfig: RANGE_ADD range behavior `%s` ' + 'will not work as expected in RelayModern, supported range ' + "behaviors are 'append', 'prepend', and 'ignore'.", info.rangeBehavior) : void 0;
            break;
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
  };
}

function rangeDelete(config, request) {
  var parentID = config.parentID,
      connectionKeys = config.connectionKeys,
      pathToConnection = config.pathToConnection,
      deletedIDFieldName = config.deletedIDFieldName;

  if (!parentID) {
    process.env.NODE_ENV !== "production" ? warning(false, 'RelayDeclarativeMutationConfig: For mutation config RANGE_DELETE ' + 'to work you must include a parentID') : void 0;
    return null;
  }

  var rootField = getRootField(request);

  if (!rootField) {
    return null;
  }

  return function (store, data) {
    if (!data) {
      return;
    }

    var deleteIDs = [];
    var deletedIDField = data[rootField];

    if (deletedIDField && Array.isArray(deletedIDFieldName)) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = deletedIDFieldName[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var eachField = _step2.value;

          if (deletedIDField && typeof deletedIDField === 'object') {
            deletedIDField = deletedIDField[eachField];
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

      if (Array.isArray(deletedIDField)) {
        deletedIDField.forEach(function (idObject) {
          if (idObject && idObject.id && typeof idObject === 'object' && typeof idObject.id === 'string') {
            deleteIDs.push(idObject.id);
          }
        });
      } else if (deletedIDField && deletedIDField.id && typeof deletedIDField.id === 'string') {
        deleteIDs.push(deletedIDField.id);
      }
    } else if (deletedIDField && typeof deletedIDFieldName === 'string' && typeof deletedIDField === 'object') {
      deletedIDField = deletedIDField[deletedIDFieldName];

      if (typeof deletedIDField === 'string') {
        deleteIDs.push(deletedIDField);
      } else if (Array.isArray(deletedIDField)) {
        deletedIDField.forEach(function (id) {
          if (typeof id === 'string') {
            deleteIDs.push(id);
          }
        });
      }
    }

    deleteNode(parentID, connectionKeys, pathToConnection, store, deleteIDs);
  };
}

function deleteNode(parentID, connectionKeys, pathToConnection, store, deleteIDs) {
  process.env.NODE_ENV !== "production" ? warning(connectionKeys, 'RelayDeclarativeMutationConfig: RANGE_DELETE must provide a ' + 'connectionKeys') : void 0;
  var parent = store.get(parentID);

  if (!parent) {
    return;
  }

  if (pathToConnection.length < 2) {
    process.env.NODE_ENV !== "production" ? warning(false, 'RelayDeclarativeMutationConfig: RANGE_DELETE ' + 'pathToConnection must include at least parent and connection') : void 0;
    return;
  }

  var recordProxy = parent;

  for (var i = 1; i < pathToConnection.length - 1; i++) {
    if (recordProxy) {
      recordProxy = recordProxy.getLinkedRecord(pathToConnection[i]);
    }
  } // Should never enter loop except edge cases


  if (!connectionKeys || !recordProxy) {
    process.env.NODE_ENV !== "production" ? warning(false, 'RelayDeclarativeMutationConfig: RANGE_DELETE ' + 'pathToConnection is incorrect. Unable to find connection with ' + 'parentID: %s and path: %s', parentID, pathToConnection.toString()) : void 0;
    return;
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    var _loop = function _loop() {
      var key = _step3.value;
      var connection = RelayConnectionHandler.getConnection(recordProxy, key.key, key.filters);

      if (connection) {
        deleteIDs.forEach(function (deleteID) {
          RelayConnectionHandler.deleteNode(connection, deleteID);
        });
      }
    };

    for (var _iterator3 = connectionKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      _loop();
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
}

function getRootField(request) {
  if (request.fragment.selections && request.fragment.selections.length > 0 && request.fragment.selections[0].kind === 'LinkedField') {
    return request.fragment.selections[0].name;
  }

  return null;
}

module.exports = {
  MutationTypes: MutationTypes,
  RangeOperations: RangeOperations,
  convert: convert
};