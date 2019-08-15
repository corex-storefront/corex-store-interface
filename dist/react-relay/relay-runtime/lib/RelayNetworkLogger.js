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

var RelayNetworkLoggerTransaction = require("./RelayNetworkLoggerTransaction");

var createRelayNetworkLogger = require("./createRelayNetworkLogger");

module.exports = createRelayNetworkLogger(RelayNetworkLoggerTransaction);