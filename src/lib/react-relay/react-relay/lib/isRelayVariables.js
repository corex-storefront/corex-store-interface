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
/**
 * Determine if the object is a plain object that matches the `Variables` type.
 */

function isRelayVariables(variables) {
  return typeof variables === 'object' && variables !== null && !Array.isArray(variables);
}

module.exports = isRelayVariables;