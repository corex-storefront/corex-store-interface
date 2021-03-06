/**
 * Relay v5.0.0
 */
module.exports = function (e) {
  var r = {};

  function t(n) {
    if (r[n]) return r[n].exports;
    var i = r[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return e[n].call(i.exports, i, i.exports, t), i.l = !0, i.exports;
  }

  return t.m = e, t.c = r, t.d = function (e, r, n) {
    t.o(e, r) || Object.defineProperty(e, r, {
      enumerable: !0,
      get: n
    });
  }, t.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, t.t = function (e, r) {
    if (1 & r && (e = t(e)), 8 & r) return e;
    if (4 & r && "object" == typeof e && e && e.__esModule) return e;
    var n = Object.create(null);
    if (t.r(n), Object.defineProperty(n, "default", {
      enumerable: !0,
      value: e
    }), 2 & r && "string" != typeof e) for (var i in e) t.d(n, i, function (r) {
      return e[r];
    }.bind(null, i));
    return n;
  }, t.n = function (e) {
    var r = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    return t.d(r, "a", r), r;
  }, t.o = function (e, r) {
    return Object.prototype.hasOwnProperty.call(e, r);
  }, t.p = "", t(t.s = 2);
}([function (e, r) {
  e.exports = require("@babel/runtime/helpers/interopRequireDefault");
}, function (e, r) {
  e.exports = require("graphql");
}, function (module, exports, __webpack_require__) {
  "use strict";

  var _interopRequireDefault = __webpack_require__(0),
      _objectSpread2 = _interopRequireDefault(__webpack_require__(3)),
      compileGraphQLTag = __webpack_require__(4),
      getValidGraphQLTag = __webpack_require__(9),
      RelayConfig;

  try {
    RelayConfig = eval("require")("relay-config");
  } catch (e) {}

  module.exports = function (e) {
    var r = e.types;
    if (!r) throw new Error('BabelPluginRelay: Expected plugin context to include "types", but got:' + String(e));
    var t = {
      TaggedTemplateExpression: function (e, t) {
        var n = getValidGraphQLTag(e);
        n && compileGraphQLTag(r, e, t, n);
      }
    };
    return {
      visitor: {
        Program: function (e, r) {
          var n = RelayConfig && RelayConfig.loadConfig();
          e.traverse(t, (0, _objectSpread2.default)({}, r, {
            opts: (0, _objectSpread2.default)({}, n, r.opts)
          }));
        }
      }
    };
  };
}, function (e, r) {
  e.exports = require("@babel/runtime/helpers/objectSpread");
}, function (e, r, t) {
  "use strict";

  var n = t(5);

  e.exports = function (e, r, t, i) {
    if (1 !== i.definitions.length) throw new Error("BabelPluginRelay: Expected exactly one definition per graphql tag.");
    var a = i.definitions[0];
    if ("FragmentDefinition" !== a.kind && "OperationDefinition" !== a.kind) throw new Error("BabelPluginRelay: Expected a fragment, mutation, query, or subscription, got `" + a.kind + "`.");
    return function (e, r, t) {
      for (var n = r.scope; n.parent;) n = n.parent;

      if (r.scope === n) r.replaceWith(t);else {
        var i = n.generateDeclaredUidIdentifier("graphql");
        r.replaceWith(e.logicalExpression("||", i, e.assignmentExpression("=", i, t)));
      }
    }(e, r, function (e, r, t, i) {
      var a = Boolean(r.opts && r.opts.haste),
          o = r.opts && r.opts.isDevVariable,
          l = r.opts && r.opts.artifactDirectory,
          u = r.opts && r.opts.buildCommand || "relay-compiler",
          s = "production" !== (process.env.BABEL_ENV || "development");
      return n(e, i, r, {
        artifactDirectory: l,
        buildCommand: u,
        isDevelopment: s,
        isHasteMode: a,
        isDevVariable: o
      });
    }(e, t, 0, a));
  };
}, function (e, r, t) {
  "use strict";

  var n = t(0)(t(6)),
      i = t(7),
      a = t(8),
      o = t(1).print,
      l = "./__generated__/";

  function u(e, r, t) {
    return e.callExpression(e.memberExpression(e.identifier("console"), e.identifier("error")), [e.stringLiteral("The definition of '".concat(r, "' appears to have changed. Run ") + "`" + t + "` to update the generated files to receive the expected data.")]);
  }

  e.exports = function (e, r, t, s) {
    var p = r.name && r.name.value;
    if (!p) throw new Error("GraphQL operations and fragments must contain names");
    var c = p + ".graphql",
        f = s.isHasteMode ? c : s.artifactDirectory ? function (e, r, t) {
      if (null == e.file) throw new Error("Babel state is missing expected file name");
      var n = e.file.opts.filename,
          i = a.relative(a.dirname(n), a.resolve(r));
      return (0 !== i.length && i.startsWith(".") ? "" : "./") + a.join(i, t);
    }(t, s.artifactDirectory, c) : l + c,
        d = i.createHash("md5").update(o(r), "utf8").digest("hex"),
        g = e.callExpression(e.identifier("require"), [e.stringLiteral(f)]),
        m = [e.returnStatement(g)];

    if (null != s.isDevVariable || s.isDevelopment) {
      var b = e.identifier("node"),
          v = e.memberExpression(b, e.identifier("hash")),
          h = [e.variableDeclaration("const", [e.variableDeclarator(b, g)]), e.ifStatement(e.logicalExpression("&&", v, e.binaryExpression("!==", v, e.stringLiteral(d))), e.blockStatement([e.expressionStatement(u(e, p, s.buildCommand))]))];
      null != s.isDevVariable && (h = [e.ifStatement(e.identifier(s.isDevVariable), e.blockStatement(h))]), m.unshift.apply(m, (0, n.default)(h));
    }

    return e.functionExpression(null, [], e.blockStatement(m));
  };
}, function (e, r) {
  e.exports = require("@babel/runtime/helpers/toConsumableArray");
}, function (e, r) {
  e.exports = require("crypto");
}, function (e, r) {
  e.exports = require("path");
}, function (e, r, t) {
  "use strict";

  var n = t(1);

  e.exports = function (e) {
    if (!e.get("tag").isIdentifier({
      name: "graphql"
    })) return null;
    var r = e.node.quasi.quasis;
    if (1 !== r.length) throw new Error("BabelPluginRelay: Substitutions are not allowed in graphql fragments. Included fragments should be referenced as `...MyModule_propName`.");
    var t = r[0].value.raw,
        i = n.parse(t);
    if (0 === i.definitions.length) throw new Error("BabelPluginRelay: Unexpected empty graphql tag.");
    return i;
  };
}]);