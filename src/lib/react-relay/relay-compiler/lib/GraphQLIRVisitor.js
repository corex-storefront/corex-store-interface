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

var visit = require("graphql").visit;

var NodeKeys = {
  Argument: ['value'],
  ClientExtension: ['selections'],
  Condition: ['condition', 'selections'],
  Defer: ['selections', 'if'],
  ConnectionField: ['args', 'directives', 'selections'],
  Directive: ['args'],
  Fragment: ['argumentDefinitions', 'directives', 'selections'],
  FragmentSpread: ['args', 'directives'],
  InlineDataFragmentSpread: ['selections'],
  InlineFragment: ['directives', 'selections'],
  LinkedField: ['args', 'directives', 'selections'],
  Literal: [],
  LocalArgumentDefinition: [],
  ModuleImport: ['selections'],
  Request: ['fragment', 'root'],
  Root: ['argumentDefinitions', 'directives', 'selections'],
  RootArgumentDefinition: [],
  ScalarField: ['args', 'directives'],
  SplitOperation: ['selections'],
  Stream: ['selections', 'if', 'initialCount'],
  Variable: []
};

function visitIR(root, visitor) {
  return visit(root, visitor, NodeKeys);
}

module.exports = {
  visit: visitIR
};