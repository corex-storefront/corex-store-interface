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

var nullthrows = require("./nullthrowsOSS");

var _require = require("graphql"),
    GraphQLInterfaceType = _require.GraphQLInterfaceType,
    GraphQLList = _require.GraphQLList,
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLSchema = _require.GraphQLSchema,
    GraphQLUnionType = _require.GraphQLUnionType,
    SchemaMetaFieldDef = _require.SchemaMetaFieldDef,
    TypeMetaFieldDef = _require.TypeMetaFieldDef,
    TypeNameMetaFieldDef = _require.TypeNameMetaFieldDef,
    assertAbstractType = _require.assertAbstractType,
    getNamedType = _require.getNamedType,
    getNullableType = _require.getNullableType;

var ID = 'id';
var ID_TYPE = 'ID';
/**
 * Determine if the given type may implement the named type:
 * - it is the named type
 * - it implements the named interface
 * - it is an abstract type and *some* of its concrete types may
 *   implement the named type
 */

function mayImplement(schema, type, typeName) {
  var unmodifiedType = getRawType(type);
  return unmodifiedType.toString() === typeName || implementsInterface(unmodifiedType, typeName) || isAbstractType(unmodifiedType) && hasConcreteTypeThatImplements(schema, unmodifiedType, typeName);
}

function canHaveSelections(type) {
  return type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType;
}
/**
 * Implements duck typing that checks whether a type has an id field of the ID
 * type. This is approximating what we can hopefully do with the __id proposal
 * a bit more cleanly.
 */


function hasID(schema, type) {
  var unmodifiedType = getRawType(type);
  !(unmodifiedType instanceof GraphQLObjectType || unmodifiedType instanceof GraphQLInterfaceType) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLSchemaUtils.hasID(): Expected a concrete type or interface, ' + 'got type `%s`.', type) : invariant(false) : void 0;
  var idType = schema.getType(ID_TYPE);
  var idField = unmodifiedType.getFields()[ID];
  return idField && getRawType(idField.type) === idType;
}
/**
 * Determine if a type is abstract (not concrete).
 *
 * Note: This is used in place of the `graphql` version of the function in order
 * to not break `instanceof` checks with Jest. This version also unwraps
 * non-null/list wrapper types.
 */


function isAbstractType(type) {
  var rawType = getRawType(type);
  return rawType instanceof GraphQLInterfaceType || rawType instanceof GraphQLUnionType;
}

function isUnionType(type) {
  return type instanceof GraphQLUnionType;
}
/**
 * Get the unmodified type, with list/null wrappers removed.
 */


function getRawType(type) {
  return nullthrows(getNamedType(type));
}
/**
 * Gets the non-list type, removing the list wrapper if present.
 */


function getSingularType(type) {
  var unmodifiedType = type;

  while (unmodifiedType instanceof GraphQLList) {
    unmodifiedType = unmodifiedType.ofType;
  }

  return unmodifiedType;
}
/**
 * @public
 */


function implementsInterface(type, interfaceName) {
  return getInterfaces(type).some(function (interfaceType) {
    return interfaceType.toString() === interfaceName;
  });
}
/**
 * @private
 */


function hasConcreteTypeThatImplements(schema, type, interfaceName) {
  return isAbstractType(type) && getConcreteTypes(schema, type).some(function (concreteType) {
    return implementsInterface(concreteType, interfaceName);
  });
}
/**
 * @private
 */


function getConcreteTypes(schema, type) {
  return schema.getPossibleTypes(assertAbstractType(type));
}
/**
 * @private
 */


function getInterfaces(type) {
  if (type instanceof GraphQLObjectType) {
    return type.getInterfaces();
  }

  return [];
}
/**
 * @public
 *
 * Determine if an AST node contains a fragment/operation definition.
 */


function isExecutableDefinitionAST(ast) {
  return ast.kind === 'FragmentDefinition' || ast.kind === 'OperationDefinition';
}
/**
 * @public
 *
 * Determine if an AST node contains a schema definition.
 */


function isSchemaDefinitionAST(ast) {
  return ast.kind === 'SchemaDefinition' || ast.kind === 'ScalarTypeDefinition' || ast.kind === 'ObjectTypeDefinition' || ast.kind === 'InterfaceTypeDefinition' || ast.kind === 'UnionTypeDefinition' || ast.kind === 'EnumTypeDefinition' || ast.kind === 'InputObjectTypeDefinition' || ast.kind === 'DirectiveDefinition' || ast.kind === 'ScalarTypeExtension' || ast.kind === 'ObjectTypeExtension' || ast.kind === 'InterfaceTypeExtension' || ast.kind === 'UnionTypeExtension' || ast.kind === 'EnumTypeExtension' || ast.kind === 'InputObjectTypeExtension';
}

function isServerDefinedField(field, compilerContext, parentType) {
  var serverSchema = compilerContext.serverSchema;
  var rawType = getRawType(field.type);
  var serverType = serverSchema.getType(rawType.name);
  var parentServerType = serverSchema.getType(getRawType(parentType).name);
  return serverType != null && parentServerType != null && (canHaveSelections(parentType) && assertTypeWithFields(parentType).getFields()[field.name]) != null || // Allow metadata fields and fields defined on classic "fat" interfaces
  field.name === SchemaMetaFieldDef.name || field.name === TypeMetaFieldDef.name || field.name === TypeNameMetaFieldDef.name || field.directives.some(function (_ref) {
    var name = _ref.name;
    return name === 'fixme_fat_interface';
  });
}

function isClientDefinedField(field, compilerContext, parentType) {
  return !isServerDefinedField(field, compilerContext, parentType);
}

function assertTypeWithFields(type) {
  !(type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLSchemaUtils: Expected type `%s` to be an object or interface type.', type) : invariant(false) : void 0;
  return type;
}

function generateIDField(idType) {
  return {
    kind: 'ScalarField',
    alias: ID,
    args: [],
    directives: [],
    handles: null,
    loc: {
      kind: 'Generated'
    },
    metadata: null,
    name: ID,
    type: idType
  };
}

module.exports = {
  assertTypeWithFields: assertTypeWithFields,
  canHaveSelections: canHaveSelections,
  generateIDField: generateIDField,
  getNullableType: getNullableType,
  getRawType: getRawType,
  getSingularType: getSingularType,
  hasID: hasID,
  implementsInterface: implementsInterface,
  isAbstractType: isAbstractType,
  isClientDefinedField: isClientDefinedField,
  isExecutableDefinitionAST: isExecutableDefinitionAST,
  isSchemaDefinitionAST: isSchemaDefinitionAST,
  isServerDefinedField: isServerDefinedField,
  isUnionType: isUnionType,
  mayImplement: mayImplement
};