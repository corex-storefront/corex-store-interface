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

var _require = require("./DefaultHandleKey"),
    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

var _require2 = require("graphql"),
    GraphQLEnumType = _require2.GraphQLEnumType,
    GraphQLID = _require2.GraphQLID,
    GraphQLInt = _require2.GraphQLInt,
    GraphQLInputObjectType = _require2.GraphQLInputObjectType,
    GraphQLList = _require2.GraphQLList,
    GraphQLNonNull = _require2.GraphQLNonNull,
    GraphQLScalarType = _require2.GraphQLScalarType;

var INDENT = '  ';
/**
 * Converts a GraphQLIR node into a GraphQL string. Custom Relay
 * extensions (directives) are not supported; to print fragments with
 * variables or fragment spreads with arguments, transform the node
 * prior to printing.
 */

function print(node) {
  switch (node.kind) {
    case 'Fragment':
      return "fragment ".concat(node.name, " on ").concat(String(node.type)) + printFragmentArgumentDefinitions(node.argumentDefinitions) + printDirectives(node.directives) + printSelections(node, '') + '\n';

    case 'Root':
      return "".concat(node.operation, " ").concat(node.name) + printArgumentDefinitions(node.argumentDefinitions) + printDirectives(node.directives) + printSelections(node, '') + '\n';

    case 'SplitOperation':
      return "SplitOperation ".concat(node.name, " on ").concat(String(node.type)) + printSelections(node, '') + '\n';

    default:
      node;
      !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Unsupported IR node `%s`.', node.kind) : invariant(false) : void 0;
  }
}

function printSelections(node, indent, options) {
  var selections = node.selections;

  if (selections == null) {
    return '';
  }

  var printed = selections.map(function (selection) {
    return printSelection(selection, indent, options);
  });
  return printed.length ? " {\n".concat(indent + INDENT).concat(printed.join('\n' + indent + INDENT), "\n").concat(indent).concat((options === null || options === void 0 ? void 0 : options.isClientExtension) === true ? '# ' : '', "}") : '';
}
/**
 * Prints a field without subselections.
 */


function printField(field, options) {
  var _ref;

  var parentDirectives = (_ref = options === null || options === void 0 ? void 0 : options.parentDirectives) !== null && _ref !== void 0 ? _ref : '';
  var isClientExtension = (options === null || options === void 0 ? void 0 : options.isClientExtension) === true;
  return (isClientExtension ? '# ' : '') + (field.alias === field.name ? field.name : field.alias + ': ' + field.name) + printArguments(field.args) + parentDirectives + printDirectives(field.directives) + printHandles(field);
}

function printSelection(selection, indent, options) {
  var _ref2;

  var str;
  var parentDirectives = (_ref2 = options === null || options === void 0 ? void 0 : options.parentDirectives) !== null && _ref2 !== void 0 ? _ref2 : '';
  var isClientExtension = (options === null || options === void 0 ? void 0 : options.isClientExtension) === true;

  if (selection.kind === 'LinkedField') {
    str = printField(selection, {
      parentDirectives: parentDirectives,
      isClientExtension: isClientExtension
    });
    str += printSelections(selection, indent + INDENT, {
      isClientExtension: isClientExtension
    });
  } else if (selection.kind === 'ConnectionField') {
    str = printField(selection, {
      parentDirectives: parentDirectives,
      isClientExtension: isClientExtension
    });
    str += printSelections(selection, indent + INDENT, {
      isClientExtension: isClientExtension
    });
  } else if (selection.kind === 'ModuleImport') {
    str = selection.selections.map(function (matchSelection) {
      return printSelection(matchSelection, indent, {
        parentDirectives: parentDirectives,
        isClientExtension: isClientExtension
      });
    }).join('\n' + indent + INDENT);
  } else if (selection.kind === 'ScalarField') {
    str = printField(selection, {
      parentDirectives: parentDirectives,
      isClientExtension: isClientExtension
    });
  } else if (selection.kind === 'InlineFragment') {
    str = '';

    if (isClientExtension) {
      str += '# ';
    }

    str += '... on ' + selection.typeCondition.toString();
    str += parentDirectives;
    str += printDirectives(selection.directives);
    str += printSelections(selection, indent + INDENT, {
      isClientExtension: isClientExtension
    });
  } else if (selection.kind === 'FragmentSpread') {
    str = '';

    if (isClientExtension) {
      str += '# ';
    }

    str += '...' + selection.name;
    str += parentDirectives;
    str += printFragmentArguments(selection.args);
    str += printDirectives(selection.directives);
  } else if (selection.kind === 'InlineDataFragmentSpread') {
    str = "# ".concat(selection.name, " @inline") + "\n".concat(indent).concat(INDENT, "...") + parentDirectives + printSelections(selection, indent + INDENT);
  } else if (selection.kind === 'Condition') {
    var value = printValue(selection.condition); // For Flow

    !(value != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Expected a variable for condition, got a literal `null`.') : invariant(false) : void 0;
    var condStr = selection.passingValue ? ' @include' : ' @skip';
    condStr += '(if: ' + value + ')';
    condStr += parentDirectives; // For multi-selection conditions, pushes the condition down to each

    var subSelections = selection.selections.map(function (sel) {
      return printSelection(sel, indent, {
        parentDirectives: condStr,
        isClientExtension: isClientExtension
      });
    });
    str = subSelections.join('\n' + INDENT);
  } else if (selection.kind === 'Stream') {
    var streamStr = " @stream(label: \"".concat(selection.label, "\"");

    if (selection["if"] !== null) {
      var _printValue;

      streamStr += ", if: ".concat((_printValue = printValue(selection["if"])) !== null && _printValue !== void 0 ? _printValue : '');
    }

    if (selection.initialCount !== null) {
      var _printValue2;

      streamStr += ", initial_count: ".concat((_printValue2 = printValue(selection.initialCount)) !== null && _printValue2 !== void 0 ? _printValue2 : '');
    }

    streamStr += ')';
    streamStr += parentDirectives;

    var _subSelections = selection.selections.map(function (sel) {
      return printSelection(sel, indent, {
        parentDirectives: streamStr,
        isClientExtension: isClientExtension
      });
    });

    str = _subSelections.join('\n' + INDENT);
  } else if (selection.kind === 'Defer') {
    var deferStr = " @defer(label: \"".concat(selection.label, "\"");

    if (selection["if"] !== null) {
      var _printValue3;

      deferStr += ", if: ".concat((_printValue3 = printValue(selection["if"])) !== null && _printValue3 !== void 0 ? _printValue3 : '');
    }

    deferStr += ')';
    deferStr += parentDirectives;

    if (selection.selections.every(function (subSelection) {
      return subSelection.kind === 'InlineFragment' || subSelection.kind === 'FragmentSpread';
    })) {
      var _subSelections2 = selection.selections.map(function (sel) {
        return printSelection(sel, indent, {
          parentDirectives: deferStr,
          isClientExtension: isClientExtension
        });
      });

      str = _subSelections2.join('\n' + INDENT);
    } else {
      if (selection.metadata != null && selection.metadata.fragmentTypeCondition != null) {
        str = "... on ".concat(String(selection.metadata.fragmentTypeCondition)) + deferStr;
      } else {
        str = '...' + deferStr;
      }

      str += printSelections(selection, indent + INDENT, {
        isClientExtension: isClientExtension
      });
    }
  } else if (selection.kind === 'ClientExtension') {
    !(isClientExtension === false) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Did not expect to encounter a ClientExtension node ' + 'as a descendant of another ClientExtension node.') : invariant(false) : void 0;
    str = '# Client-only selections:\n' + indent + INDENT + selection.selections.map(function (sel) {
      return printSelection(sel, indent, {
        parentDirectives: parentDirectives,
        isClientExtension: true
      });
    }).join('\n' + indent + INDENT);
  } else {
    selection;
    !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Unknown selection kind `%s`.', selection.kind) : invariant(false) : void 0;
  }

  return str;
}

function printArgumentDefinitions(argumentDefinitions) {
  var printed = argumentDefinitions.map(function (def) {
    var str = "$".concat(def.name, ": ").concat(def.type.toString());

    if (def.defaultValue != null) {
      str += ' = ' + printLiteral(def.defaultValue, def.type);
    }

    return str;
  });
  return printed.length ? "(\n".concat(INDENT).concat(printed.join('\n' + INDENT), "\n)") : '';
}

function printFragmentArgumentDefinitions(argumentDefinitions) {
  var printed;
  argumentDefinitions.forEach(function (def) {
    if (def.kind !== 'LocalArgumentDefinition') {
      return;
    }

    printed = printed || [];
    var str = "".concat(def.name, ": {type: \"").concat(def.type.toString(), "\"");

    if (def.defaultValue != null) {
      str += ", defaultValue: ".concat(printLiteral(def.defaultValue, def.type));
    }

    str += '}';
    printed.push(str);
  });
  return printed && printed.length ? " @argumentDefinitions(\n".concat(INDENT).concat(printed.join('\n' + INDENT), "\n)") : '';
}

function printHandles(field) {
  if (!field.handles) {
    return '';
  }

  var printed = field.handles.map(function (handle) {
    // For backward compatibility and also because this module is shared by ComponentScript.
    var key = handle.key === DEFAULT_HANDLE_KEY ? '' : ", key: \"".concat(handle.key, "\"");
    var filters = handle.filters == null ? '' : ", filters: ".concat(JSON.stringify(Array.from(handle.filters).sort()));
    return "@__clientField(handle: \"".concat(handle.name, "\"").concat(key).concat(filters, ")");
  });
  return printed.length ? ' ' + printed.join(' ') : '';
}

function printDirectives(directives) {
  var printed = directives.map(function (directive) {
    return '@' + directive.name + printArguments(directive.args);
  });
  return printed.length ? ' ' + printed.join(' ') : '';
}

function printFragmentArguments(args) {
  var printedArgs = printArguments(args);

  if (!printedArgs.length) {
    return '';
  }

  return " @arguments".concat(printedArgs);
}

function printArguments(args) {
  var printed = [];
  args.forEach(function (arg) {
    var printedValue = printValue(arg.value, arg.type);

    if (printedValue != null) {
      printed.push(arg.name + ': ' + printedValue);
    }
  });
  return printed.length ? '(' + printed.join(', ') + ')' : '';
}

function printValue(value, type) {
  if (type instanceof GraphQLNonNull) {
    type = type.ofType;
  }

  if (value.kind === 'Variable') {
    return '$' + value.variableName;
  } else if (value.kind === 'ObjectValue') {
    !(type instanceof GraphQLInputObjectType) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Need an InputObject type to print objects.') : invariant(false) : void 0;
    var typeFields = type.getFields();
    var pairs = value.fields.map(function (field) {
      var innerValue = printValue(field.value, typeFields[field.name].type);
      return innerValue == null ? null : field.name + ': ' + innerValue;
    }).filter(Boolean);
    return '{' + pairs.join(', ') + '}';
  } else if (value.kind === 'ListValue') {
    !(type instanceof GraphQLList) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Need a type in order to print arrays.') : invariant(false) : void 0;
    var innerType = type.ofType;
    return "[".concat(value.items.map(function (i) {
      return printValue(i, innerType);
    }).join(', '), "]");
  } else if (value.value != null) {
    return printLiteral(value.value, type);
  } else {
    return null;
  }
}

function printLiteral(value, type) {
  if (value == null) {
    // $FlowFixMe(>=0.95.0) JSON.stringify can return undefined
    return JSON.stringify(value);
  }

  if (type instanceof GraphQLNonNull) {
    type = type.ofType;
  }

  if (type instanceof GraphQLEnumType) {
    var result = type.serialize(value);

    if (result == null && typeof value === 'string') {
      // For backwards compatibility, print invalid input values as-is. This
      // can occur with literals defined as an @argumentDefinitions
      // defaultValue.
      result = value;
    }

    !(typeof result === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Expected value of type %s to be a valid enum value, got `%s`.', type.name, JSON.stringify(value)) : invariant(false) : void 0;
    return result;
  } else if (type === GraphQLID || type === GraphQLInt) {
    // For backwards compatibility, print integer and ID values as-is
    // $FlowFixMe(>=0.95.0) JSON.stringify can return undefined
    return JSON.stringify(value);
  } else if (type instanceof GraphQLScalarType) {
    var _result = type.serialize(value); // $FlowFixMe(>=0.95.0) JSON.stringify can return undefined


    return JSON.stringify(_result);
  } else if (Array.isArray(value)) {
    !(type instanceof GraphQLList) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Need a type in order to print arrays.') : invariant(false) : void 0;
    var itemType = type.ofType;
    return '[' + value.map(function (item) {
      return printLiteral(item, itemType);
    }).join(', ') + ']';
  } else if (type instanceof GraphQLList && value != null) {
    // Not an array, but still a list. Treat as list-of-one as per spec 3.1.7:
    // http://facebook.github.io/graphql/October2016/#sec-Lists
    return printLiteral(value, type.ofType);
  } else if (typeof value === 'object' && value != null) {
    var fields = [];
    !(type instanceof GraphQLInputObjectType) ? process.env.NODE_ENV !== "production" ? invariant(false, 'GraphQLIRPrinter: Need an InputObject type to print objects.') : invariant(false) : void 0;
    var typeFields = type.getFields();

    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        fields.push(key + ': ' + printLiteral(value[key], typeFields[key].type));
      }
    }

    return '{' + fields.join(', ') + '}';
  } else {
    // $FlowFixMe(>=0.95.0) JSON.stringify can return undefined
    return JSON.stringify(value);
  }
}

module.exports = {
  print: print,
  printField: printField,
  printArguments: printArguments,
  printDirectives: printDirectives
};