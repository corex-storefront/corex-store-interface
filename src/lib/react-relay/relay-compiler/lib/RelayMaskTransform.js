/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * All rights reserved.
 *
 * 
 * @format
 */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var IRTransformer = require("./GraphQLIRTransformer");

var invariant = require("fbjs/lib/invariant");

var joinArgumentDefinitions = require("./joinArgumentDefinitions");

var _require = require("./RelayCompilerError"),
    createUserError = _require.createUserError;
/**
 * A transform that inlines fragment spreads with the @relay(mask: false)
 * directive.
 */


function relayMaskTransform(context) {
  return IRTransformer.transform(context, {
    FragmentSpread: visitFragmentSpread,
    Fragment: visitFragment
  }, function () {
    return {
      reachableArguments: []
    };
  });
}

function visitFragment(fragment, state) {
  var result = this.traverse(fragment, state);

  if (state.reachableArguments.length === 0) {
    return result;
  }

  var schema = this.getContext().serverSchema;
  var joinedArgumentDefinitions = joinArgumentDefinitions(schema, fragment, state.reachableArguments, '@relay(unmask: true)');
  return (0, _objectSpread2["default"])({}, result, {
    argumentDefinitions: joinedArgumentDefinitions
  });
}

function visitFragmentSpread(fragmentSpread, state) {
  if (!isUnmaskedSpread(fragmentSpread)) {
    return fragmentSpread;
  }

  !(fragmentSpread.args.length === 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayMaskTransform: Cannot unmask fragment spread `%s` with ' + 'arguments. Use the `ApplyFragmentArgumentTransform` before flattening', fragmentSpread.name) : invariant(false) : void 0;
  var context = this.getContext();
  var fragment = context.getFragment(fragmentSpread.name);
  var result = {
    kind: 'InlineFragment',
    directives: fragmentSpread.directives,
    loc: {
      kind: 'Derived',
      source: fragmentSpread.loc
    },
    metadata: fragmentSpread.metadata,
    selections: fragment.selections,
    typeCondition: fragment.type
  };

  if (fragment.directives.length > 0) {
    throw new createUserError('Cannot use @relay(mask: false) on fragment spreads for fragments ' + 'with directives.', [fragmentSpread.loc, fragment.directives[0].loc]);
  }

  var localArgDef = fragment.argumentDefinitions.find(function (argDef) {
    return argDef.kind === 'LocalArgumentDefinition';
  });

  if (localArgDef != null) {
    throw createUserError('RelayMaskTransform: Cannot use @relay(mask: false) on fragment spread ' + 'because the fragment definition uses @argumentDefinitions.', [fragmentSpread.loc, localArgDef.loc]);
  } // Note: defer validating arguments to the containing fragment in order
  // to list all invalid variables/arguments instead of only one.


  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fragment.argumentDefinitions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var argDef = _step.value;
      state.reachableArguments.push(argDef);
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

  return this.traverse(result, state);
}
/**
 * @private
 */


function isUnmaskedSpread(spread) {
  return Boolean(spread.metadata && spread.metadata.mask === false);
}

module.exports = {
  transform: relayMaskTransform
};