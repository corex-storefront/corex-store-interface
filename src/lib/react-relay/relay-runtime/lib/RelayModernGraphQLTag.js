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

var RelayConcreteNode = require("./RelayConcreteNode");

var invariant = require("fbjs/lib/invariant");
/**
 * Runtime function to correspond to the `graphql` tagged template function.
 * All calls to this function should be transformed by the plugin.
 */


function graphql(strings) {
  !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'graphql: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `graphql`.') : invariant(false) : void 0;
}

function getNode(taggedNode) {
  var fn = typeof taggedNode === 'function' ? taggedNode : typeof taggedNode.modern === 'function' ? taggedNode.modern : null; // Support for classic raw nodes (used in test mock)

  if (fn === null) {
    return taggedNode;
  }

  var data = fn(); // Support for languages that work (best) with ES6 modules, such as TypeScript.

  return data["default"] ? data["default"] : data;
}

function isFragment(node) {
  var fragment = getNode(node);
  return typeof fragment === 'object' && fragment !== null && fragment.kind === RelayConcreteNode.FRAGMENT;
}

function isRequest(node) {
  var request = getNode(node);
  return typeof request === 'object' && request !== null && request.kind === RelayConcreteNode.REQUEST;
}

function isInlineDataFragment(node) {
  var fragment = getNode(node);
  return typeof fragment === 'object' && fragment !== null && fragment.kind === RelayConcreteNode.INLINE_DATA_FRAGMENT;
}

function getFragment(taggedNode) {
  var fragment = getNode(taggedNode);
  !isFragment(fragment) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernGraphQLTag: Expected a fragment, got `%s`.', JSON.stringify(fragment)) : invariant(false) : void 0;
  return fragment;
}

function getPaginationFragment(taggedNode) {
  var _fragment$metadata;

  var fragment = getFragment(taggedNode);
  var refetch = (_fragment$metadata = fragment.metadata) === null || _fragment$metadata === void 0 ? void 0 : _fragment$metadata.refetch;
  var connection = refetch === null || refetch === void 0 ? void 0 : refetch.connection;

  if (refetch === null || typeof refetch !== 'object' || connection === null || typeof connection !== 'object') {
    return null;
  }

  return fragment;
}

function getRefetchableFragment(taggedNode) {
  var _fragment$metadata2;

  var fragment = getFragment(taggedNode);
  var refetch = (_fragment$metadata2 = fragment.metadata) === null || _fragment$metadata2 === void 0 ? void 0 : _fragment$metadata2.refetch;

  if (refetch === null || typeof refetch !== 'object') {
    return null;
  }

  return fragment;
}

function getRequest(taggedNode) {
  var request = getNode(taggedNode);
  !isRequest(request) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernGraphQLTag: Expected a request, got `%s`.', JSON.stringify(request)) : invariant(false) : void 0;
  return request;
}

function getInlineDataFragment(taggedNode) {
  var fragment = getNode(taggedNode);
  !isInlineDataFragment(fragment) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernGraphQLTag: Expected an inline data fragment, got `%s`.', JSON.stringify(fragment)) : invariant(false) : void 0;
  return fragment;
}

module.exports = {
  getFragment: getFragment,
  getPaginationFragment: getPaginationFragment,
  getRefetchableFragment: getRefetchableFragment,
  getRequest: getRequest,
  getInlineDataFragment: getInlineDataFragment,
  graphql: graphql,
  isFragment: isFragment,
  isRequest: isRequest,
  isInlineDataFragment: isInlineDataFragment
};