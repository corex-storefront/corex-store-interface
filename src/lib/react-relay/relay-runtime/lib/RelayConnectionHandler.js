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

var RelayConnectionInterface = require("./RelayConnectionInterface");

var getRelayHandleKey = require("./getRelayHandleKey");

var invariant = require("fbjs/lib/invariant");

var warning = require("fbjs/lib/warning");

var _require = require("./ClientID"),
    generateClientID = _require.generateClientID;

var CONNECTION = 'connection'; // Per-instance incrementing index used to generate unique edge IDs

var NEXT_EDGE_INDEX = '__connection_next_edge_index';
/**
 * @public
 *
 * A default runtime handler for connection fields that appends newly fetched
 * edges onto the end of a connection, regardless of the arguments used to fetch
 * those edges.
 */

function update(store, payload) {
  var _clientConnectionFiel;

  var record = store.get(payload.dataID);

  if (!record) {
    return;
  }

  var _RelayConnectionInter = RelayConnectionInterface.get(),
      EDGES = _RelayConnectionInter.EDGES,
      END_CURSOR = _RelayConnectionInter.END_CURSOR,
      HAS_NEXT_PAGE = _RelayConnectionInter.HAS_NEXT_PAGE,
      HAS_PREV_PAGE = _RelayConnectionInter.HAS_PREV_PAGE,
      PAGE_INFO = _RelayConnectionInter.PAGE_INFO,
      PAGE_INFO_TYPE = _RelayConnectionInter.PAGE_INFO_TYPE,
      START_CURSOR = _RelayConnectionInter.START_CURSOR;

  var serverConnection = record.getLinkedRecord(payload.fieldKey);
  var serverPageInfo = serverConnection && serverConnection.getLinkedRecord(PAGE_INFO);

  if (!serverConnection) {
    record.setValue(null, payload.handleKey);
    return;
  } // In rare cases the handleKey field may be unset even though the client
  // connection record exists, in this case new edges should still be merged
  // into the existing client connection record (and the field reset to point
  // to that record).


  var clientConnectionID = generateClientID(record.getDataID(), payload.handleKey);
  var clientConnectionField = record.getLinkedRecord(payload.handleKey);
  var clientConnection = (_clientConnectionFiel = clientConnectionField) !== null && _clientConnectionFiel !== void 0 ? _clientConnectionFiel : store.get(clientConnectionID);
  var clientPageInfo = clientConnection && clientConnection.getLinkedRecord(PAGE_INFO);

  if (!clientConnection) {
    // Initial fetch with data: copy fields from the server record
    var connection = store.create(clientConnectionID, serverConnection.getType());
    connection.setValue(0, NEXT_EDGE_INDEX);
    connection.copyFieldsFrom(serverConnection);
    var serverEdges = serverConnection.getLinkedRecords(EDGES);

    if (serverEdges) {
      serverEdges = serverEdges.map(function (edge) {
        return buildConnectionEdge(store, connection, edge);
      });
      connection.setLinkedRecords(serverEdges, EDGES);
    }

    record.setLinkedRecord(connection, payload.handleKey);
    clientPageInfo = store.create(generateClientID(connection.getDataID(), PAGE_INFO), PAGE_INFO_TYPE);
    clientPageInfo.setValue(false, HAS_NEXT_PAGE);
    clientPageInfo.setValue(false, HAS_PREV_PAGE);
    clientPageInfo.setValue(null, END_CURSOR);
    clientPageInfo.setValue(null, START_CURSOR);

    if (serverPageInfo) {
      clientPageInfo.copyFieldsFrom(serverPageInfo);
    }

    connection.setLinkedRecord(clientPageInfo, PAGE_INFO);
  } else {
    if (clientConnectionField == null) {
      // If the handleKey field was unset but the client connection record
      // existed, update the field to point to the record
      record.setLinkedRecord(clientConnection, payload.handleKey);
    }

    var _connection = clientConnection; // Subsequent fetches:
    // - updated fields on the connection
    // - merge prev/next edges, de-duplicating by node id
    // - synthesize page info fields

    var _serverEdges = serverConnection.getLinkedRecords(EDGES);

    if (_serverEdges) {
      _serverEdges = _serverEdges.map(function (edge) {
        return buildConnectionEdge(store, _connection, edge);
      });
    }

    var prevEdges = _connection.getLinkedRecords(EDGES);

    var prevPageInfo = _connection.getLinkedRecord(PAGE_INFO);

    _connection.copyFieldsFrom(serverConnection); // Reset EDGES and PAGE_INFO fields


    if (prevEdges) {
      _connection.setLinkedRecords(prevEdges, EDGES);
    }

    if (prevPageInfo) {
      _connection.setLinkedRecord(prevPageInfo, PAGE_INFO);
    }

    var nextEdges = [];
    var args = payload.args;

    if (prevEdges && _serverEdges) {
      if (args.after != null) {
        // Forward pagination from the end of the connection: append edges
        if (clientPageInfo && args.after === clientPageInfo.getValue(END_CURSOR)) {
          var nodeIDs = new Set();
          mergeEdges(prevEdges, nextEdges, nodeIDs);
          mergeEdges(_serverEdges, nextEdges, nodeIDs);
        } else {
          process.env.NODE_ENV !== "production" ? warning(false, 'RelayConnectionHandler: Unexpected after cursor `%s`, edges must ' + 'be fetched from the end of the list (`%s`).', args.after, clientPageInfo && clientPageInfo.getValue(END_CURSOR)) : void 0;
          return;
        }
      } else if (args.before != null) {
        // Backward pagination from the start of the connection: prepend edges
        if (clientPageInfo && args.before === clientPageInfo.getValue(START_CURSOR)) {
          var _nodeIDs = new Set();

          mergeEdges(_serverEdges, nextEdges, _nodeIDs);
          mergeEdges(prevEdges, nextEdges, _nodeIDs);
        } else {
          process.env.NODE_ENV !== "production" ? warning(false, 'RelayConnectionHandler: Unexpected before cursor `%s`, edges must ' + 'be fetched from the beginning of the list (`%s`).', args.before, clientPageInfo && clientPageInfo.getValue(START_CURSOR)) : void 0;
          return;
        }
      } else {
        // The connection was refetched from the beginning/end: replace edges
        nextEdges = _serverEdges;
      }
    } else if (_serverEdges) {
      nextEdges = _serverEdges;
    } else {
      nextEdges = prevEdges;
    } // Update edges only if they were updated, the null check is
    // for Flow (prevEdges could be null).


    if (nextEdges != null && nextEdges !== prevEdges) {
      _connection.setLinkedRecords(nextEdges, EDGES);
    } // Page info should be updated even if no new edge were returned.


    if (clientPageInfo && serverPageInfo) {
      if (args.after == null && args.before == null) {
        // The connection was refetched from the beginning/end: replace
        // page_info
        clientPageInfo.copyFieldsFrom(serverPageInfo);
      } else if (args.before != null || args.after == null && args.last) {
        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_PREV_PAGE), HAS_PREV_PAGE);
        var startCursor = serverPageInfo.getValue(START_CURSOR);

        if (typeof startCursor === 'string') {
          clientPageInfo.setValue(startCursor, START_CURSOR);
        }
      } else if (args.after != null || args.before == null && args.first) {
        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_NEXT_PAGE), HAS_NEXT_PAGE);
        var endCursor = serverPageInfo.getValue(END_CURSOR);

        if (typeof endCursor === 'string') {
          clientPageInfo.setValue(endCursor, END_CURSOR);
        }
      }
    }
  }
}
/**
 * @public
 *
 * Given a record and the name of the schema field for which a connection was
 * fetched, returns the linked connection record.
 *
 * Example:
 *
 * Given that data has already been fetched on some user `<id>` on the `friends`
 * field:
 *
 * ```
 * fragment FriendsFragment on User {
 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
 *    edges {
 *      node {
 *        id
 *        }
 *      }
 *   }
 * }
 * ```
 *
 * The `friends` connection record can be accessed with:
 *
 * ```
 * store => {
 *   const user = store.get('<id>');
 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
 *   // Access fields on the connection:
 *   const edges = friends.getLinkedRecords('edges');
 * }
 * ```
 *
 * TODO: t15733312
 * Currently we haven't run into this case yet, but we need to add a `getConnections`
 * that returns an array of the connections under the same `key` regardless of the variables.
 */


function getConnection(record, key, filters) {
  var handleKey = getRelayHandleKey(CONNECTION, key, null);
  return record.getLinkedRecord(handleKey, filters);
}
/**
 * @public
 *
 * Inserts an edge after the given cursor, or at the end of the list if no
 * cursor is provided.
 *
 * Example:
 *
 * Given that data has already been fetched on some user `<id>` on the `friends`
 * field:
 *
 * ```
 * fragment FriendsFragment on User {
 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
 *    edges {
 *      node {
 *        id
 *        }
 *      }
 *   }
 * }
 * ```
 *
 * An edge can be appended with:
 *
 * ```
 * store => {
 *   const user = store.get('<id>');
 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
 *   const edge = store.create('<edge-id>', 'FriendsEdge');
 *   RelayConnectionHandler.insertEdgeAfter(friends, edge);
 * }
 * ```
 */


function insertEdgeAfter(record, newEdge, cursor) {
  var _RelayConnectionInter2 = RelayConnectionInterface.get(),
      CURSOR = _RelayConnectionInter2.CURSOR,
      EDGES = _RelayConnectionInter2.EDGES;

  var edges = record.getLinkedRecords(EDGES);

  if (!edges) {
    record.setLinkedRecords([newEdge], EDGES);
    return;
  }

  var nextEdges;

  if (cursor == null) {
    nextEdges = edges.concat(newEdge);
  } else {
    nextEdges = [];
    var foundCursor = false;

    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];
      nextEdges.push(edge);

      if (edge == null) {
        continue;
      }

      var edgeCursor = edge.getValue(CURSOR);

      if (cursor === edgeCursor) {
        nextEdges.push(newEdge);
        foundCursor = true;
      }
    }

    if (!foundCursor) {
      nextEdges.push(newEdge);
    }
  }

  record.setLinkedRecords(nextEdges, EDGES);
}
/**
 * @public
 *
 * Creates an edge for a connection record, given a node and edge type.
 */


function createEdge(store, record, node, edgeType) {
  var _RelayConnectionInter3 = RelayConnectionInterface.get(),
      NODE = _RelayConnectionInter3.NODE; // An index-based client ID could easily conflict (unless it was
  // auto-incrementing, but there is nowhere to the store the id)
  // Instead, construct a client ID based on the connection ID and node ID,
  // which will only conflict if the same node is added to the same connection
  // twice. This is acceptable since the `insertEdge*` functions ignore
  // duplicates.


  var edgeID = generateClientID(record.getDataID(), node.getDataID());
  var edge = store.get(edgeID);

  if (!edge) {
    edge = store.create(edgeID, edgeType);
  }

  edge.setLinkedRecord(node, NODE);
  return edge;
}
/**
 * @public
 *
 * Inserts an edge before the given cursor, or at the beginning of the list if
 * no cursor is provided.
 *
 * Example:
 *
 * Given that data has already been fetched on some user `<id>` on the `friends`
 * field:
 *
 * ```
 * fragment FriendsFragment on User {
 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
 *    edges {
 *      node {
 *        id
 *        }
 *      }
 *   }
 * }
 * ```
 *
 * An edge can be prepended with:
 *
 * ```
 * store => {
 *   const user = store.get('<id>');
 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
 *   const edge = store.create('<edge-id>', 'FriendsEdge');
 *   RelayConnectionHandler.insertEdgeBefore(friends, edge);
 * }
 * ```
 */


function insertEdgeBefore(record, newEdge, cursor) {
  var _RelayConnectionInter4 = RelayConnectionInterface.get(),
      CURSOR = _RelayConnectionInter4.CURSOR,
      EDGES = _RelayConnectionInter4.EDGES;

  var edges = record.getLinkedRecords(EDGES);

  if (!edges) {
    record.setLinkedRecords([newEdge], EDGES);
    return;
  }

  var nextEdges;

  if (cursor == null) {
    nextEdges = [newEdge].concat(edges);
  } else {
    nextEdges = [];
    var foundCursor = false;

    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];

      if (edge != null) {
        var edgeCursor = edge.getValue(CURSOR);

        if (cursor === edgeCursor) {
          nextEdges.push(newEdge);
          foundCursor = true;
        }
      }

      nextEdges.push(edge);
    }

    if (!foundCursor) {
      nextEdges.unshift(newEdge);
    }
  }

  record.setLinkedRecords(nextEdges, EDGES);
}
/**
 * @public
 *
 * Remove any edges whose `node.id` matches the given id.
 */


function deleteNode(record, nodeID) {
  var _RelayConnectionInter5 = RelayConnectionInterface.get(),
      EDGES = _RelayConnectionInter5.EDGES,
      NODE = _RelayConnectionInter5.NODE;

  var edges = record.getLinkedRecords(EDGES);

  if (!edges) {
    return;
  }

  var nextEdges;

  for (var ii = 0; ii < edges.length; ii++) {
    var edge = edges[ii];
    var node = edge && edge.getLinkedRecord(NODE);

    if (node != null && node.getDataID() === nodeID) {
      if (nextEdges === undefined) {
        nextEdges = edges.slice(0, ii);
      }
    } else if (nextEdges !== undefined) {
      nextEdges.push(edge);
    }
  }

  if (nextEdges !== undefined) {
    record.setLinkedRecords(nextEdges, EDGES);
  }
}
/**
 * @internal
 *
 * Creates a copy of an edge with a unique ID based on per-connection-instance
 * incrementing edge index. This is necessary to avoid collisions between edges,
 * which can occur because (edge) client IDs are assigned deterministically
 * based on the path from the nearest node with an id.
 *
 * Example: if the first N edges of the same connection are refetched, the edges
 * from the second fetch will be assigned the same IDs as the first fetch, even
 * though the nodes they point to may be different (or the same and in different
 * order).
 */


function buildConnectionEdge(store, connection, edge) {
  if (edge == null) {
    return edge;
  }

  var _RelayConnectionInter6 = RelayConnectionInterface.get(),
      EDGES = _RelayConnectionInter6.EDGES;

  var edgeIndex = connection.getValue(NEXT_EDGE_INDEX);
  !(typeof edgeIndex === 'number') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayConnectionHandler: Expected %s to be a number, got `%s`.', NEXT_EDGE_INDEX, edgeIndex) : invariant(false) : void 0;
  var edgeID = generateClientID(connection.getDataID(), EDGES, edgeIndex);
  var connectionEdge = store.create(edgeID, edge.getType());
  connectionEdge.copyFieldsFrom(edge);
  connection.setValue(edgeIndex + 1, NEXT_EDGE_INDEX);
  return connectionEdge;
}
/**
 * @internal
 *
 * Adds the source edges to the target edges, skipping edges with
 * duplicate node ids.
 */


function mergeEdges(sourceEdges, targetEdges, nodeIDs) {
  var _RelayConnectionInter7 = RelayConnectionInterface.get(),
      NODE = _RelayConnectionInter7.NODE;

  for (var ii = 0; ii < sourceEdges.length; ii++) {
    var edge = sourceEdges[ii];

    if (!edge) {
      continue;
    }

    var node = edge.getLinkedRecord(NODE);
    var nodeID = node && node.getDataID();

    if (nodeID) {
      if (nodeIDs.has(nodeID)) {
        continue;
      }

      nodeIDs.add(nodeID);
    }

    targetEdges.push(edge);
  }
}

module.exports = {
  buildConnectionEdge: buildConnectionEdge,
  createEdge: createEdge,
  deleteNode: deleteNode,
  getConnection: getConnection,
  insertEdgeAfter: insertEdgeAfter,
  insertEdgeBefore: insertEdgeBefore,
  update: update
};