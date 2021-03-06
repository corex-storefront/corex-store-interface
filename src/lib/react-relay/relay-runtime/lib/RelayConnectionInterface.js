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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var CONNECTION_CALLS = {
  after: true,
  before: true,
  find: true,
  first: true,
  last: true,
  surrounds: true
};
var REQUIRED_RANGE_CALLS = {
  find: true,
  first: true,
  last: true
};
var config = {
  CLIENT_MUTATION_ID: 'clientMutationId',
  CURSOR: 'cursor',
  EDGES: 'edges',
  END_CURSOR: 'endCursor',
  HAS_NEXT_PAGE: 'hasNextPage',
  HAS_PREV_PAGE: 'hasPreviousPage',
  NODE: 'node',
  PAGE_INFO_TYPE: 'PageInfo',
  PAGE_INFO: 'pageInfo',
  START_CURSOR: 'startCursor'
};
/**
 * @internal
 *
 * Defines logic relevant to the informal "Connection" GraphQL interface.
 */

var RelayConnectionInterface = {
  inject: function inject(newConfig) {
    config = newConfig;
  },
  get: function get() {
    return config;
  },

  /**
   * Checks whether a call exists strictly to encode which parts of a connection
   * to fetch. Fields that only differ by connection call values should have the
   * same identity.
   */
  isConnectionCall: function isConnectionCall(call) {
    return CONNECTION_CALLS.hasOwnProperty(call.name);
  },

  /**
   * Checks whether a set of calls on a connection supply enough information to
   * fetch the range fields (i.e. `edges` and `page_info`).
   */
  hasRangeCalls: function hasRangeCalls(calls) {
    return calls.some(function (call) {
      return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);
    });
  },

  /**
   * Gets a default record representing a connection's `PAGE_INFO`.
   */
  getDefaultPageInfo: function getDefaultPageInfo() {
    var _ref;

    return _ref = {}, (0, _defineProperty2["default"])(_ref, config.END_CURSOR, null), (0, _defineProperty2["default"])(_ref, config.HAS_NEXT_PAGE, false), (0, _defineProperty2["default"])(_ref, config.HAS_PREV_PAGE, false), (0, _defineProperty2["default"])(_ref, config.START_CURSOR, null), _ref;
  }
};
module.exports = RelayConnectionInterface;