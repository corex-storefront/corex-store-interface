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

function hasOverlappingIDs(seenRecords, updatedRecordIDs) {
  var keys = Object.keys(seenRecords);

  for (var ii = 0; ii < keys.length; ii++) {
    if (updatedRecordIDs.hasOwnProperty(keys[ii])) {
      return true;
    }
  }

  return false;
}

module.exports = hasOverlappingIDs;