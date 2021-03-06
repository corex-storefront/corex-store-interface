/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict'; // Intentionally inexact

var CONNECTION_KEY = '__connection';
var CONNECTION_TYPENAME = '__ConnectionRecord';

function createConnectionID(parentID, label) {
  return "connection:".concat(parentID, ":").concat(label);
}

function createConnectionRecord(connectionID) {
  return {
    __id: connectionID,
    __typename: '__ConnectionRecord',
    events: []
  };
}

module.exports = {
  createConnectionID: createConnectionID,
  createConnectionRecord: createConnectionRecord,
  CONNECTION_KEY: CONNECTION_KEY,
  CONNECTION_TYPENAME: CONNECTION_TYPENAME
};