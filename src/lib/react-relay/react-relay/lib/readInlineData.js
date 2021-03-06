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

var invariant = require("fbjs/lib/invariant");

var _require = require("relay-runtime"),
    getInlineDataFragment = _require.getInlineDataFragment,
    FRAGMENTS_KEY = _require.FRAGMENTS_KEY;

function readInlineData(fragment, fragmentRef) {
  var _fragmentRef$FRAGMENT;

  var inlineDataFragment = getInlineDataFragment(fragment);

  if (fragmentRef == null) {
    return fragmentRef;
  }

  !(typeof fragmentRef === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'readInlineData(): Expected an object, got `%s`.', typeof fragmentRef) : invariant(false) : void 0; // $FlowFixMe

  var inlineData = (_fragmentRef$FRAGMENT = fragmentRef[FRAGMENTS_KEY]) === null || _fragmentRef$FRAGMENT === void 0 ? void 0 : _fragmentRef$FRAGMENT[inlineDataFragment.name];
  !(inlineData != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'readInlineData(): Expected fragment `%s` to be spread in the parent ' + 'fragment.', inlineDataFragment.name) : invariant(false) : void 0;
  return inlineData;
}

module.exports = readInlineData;