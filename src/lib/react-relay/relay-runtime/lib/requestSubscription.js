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

var RelayDeclarativeMutationConfig = require("./RelayDeclarativeMutationConfig");

var warning = require("fbjs/lib/warning");

var _require = require("./RelayModernGraphQLTag"),
    getRequest = _require.getRequest;

var _require2 = require("./RelayModernOperationDescriptor"),
    createOperationDescriptor = _require2.createOperationDescriptor;

function requestSubscription(environment, config) {
  var subscription = getRequest(config.subscription);

  if (subscription.params.operationKind !== 'subscription') {
    throw new Error('requestSubscription: Must use Subscription operation');
  }

  var configs = config.configs,
      onCompleted = config.onCompleted,
      onError = config.onError,
      onNext = config.onNext,
      variables = config.variables;
  var operation = createOperationDescriptor(subscription, variables);
  process.env.NODE_ENV !== "production" ? warning(!(config.updater && configs), 'requestSubscription: Expected only one of `updater` and `configs` to be provided') : void 0;

  var _ref = configs ? RelayDeclarativeMutationConfig.convert(configs, subscription, null
  /* optimisticUpdater */
  , config.updater) : config,
      updater = _ref.updater;

  return environment.execute({
    operation: operation,
    updater: updater,
    cacheConfig: {
      force: true
    }
  }).map(function () {
    var data = environment.lookup(operation.fragment).data; // $FlowFixMe

    return data;
  }).subscribeLegacy({
    onNext: onNext,
    onError: onError,
    onCompleted: onCompleted
  });
}

module.exports = requestSubscription;