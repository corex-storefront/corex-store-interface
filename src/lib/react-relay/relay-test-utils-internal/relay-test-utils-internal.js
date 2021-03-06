/**
 * Relay v5.0.0
 */
module.exports = function (e) {
  var t = {};

  function n(r) {
    if (t[r]) return t[r].exports;
    var o = t[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
  }

  return n.m = e, n.c = t, n.d = function (e, t, r) {
    n.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: r
    });
  }, n.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, n.t = function (e, t) {
    if (1 & t && (e = n(e)), 8 & t) return e;
    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
    var r = Object.create(null);
    if (n.r(r), Object.defineProperty(r, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var o in e) n.d(r, o, function (t) {
      return e[t];
    }.bind(null, o));
    return r;
  }, n.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    return n.d(t, "a", t), t;
  }, n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, n.p = "", n(n.s = 7);
}([function (e, t, n) {
  "use strict";

  var r = n(1),
      o = n(3),
      a = n(4),
      i = a.GraphQLEnumType,
      u = a.GraphQLScalarType,
      s = a.GraphQLSchema,
      c = a.Kind,
      l = a.extendSchema,
      f = a.parse;

  function p(e) {
    return e;
  }

  var m,
      d,
      v,
      h,
      x = new u({
    name: "JSON",
    description: "The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).",
    serialize: p,
    parseValue: p,
    parseLiteral: function e(t, n) {
      switch (t.kind) {
        case c.STRING:
        case c.BOOLEAN:
          return t.value;

        case c.INT:
        case c.FLOAT:
          return parseFloat(t.value);

        case c.OBJECT:
          var r = Object.create(null);
          return t.fields.forEach(function (t) {
            r[t.name.value] = e(t.value, n);
          }), r;

        case c.LIST:
          return t.values.map(function (t) {
            return e(t, n);
          });

        case c.NULL:
          return null;

        case c.VARIABLE:
          var o = t.name.value;
          return n ? n[o] : void 0;

        default:
          return;
      }
    }
  });
  e.exports = (m = new i({
    name: "CropPosition",
    values: {
      TOP: {
        value: 1
      },
      CENTER: {
        value: 2
      },
      BOTTOM: {
        value: 3
      },
      LEFT: {
        value: 4
      },
      RIGHT: {
        value: 5
      }
    }
  }), d = new i({
    name: "FileExtension",
    values: {
      JPG: {
        value: "jpg"
      },
      PNG: {
        value: "png"
      }
    }
  }), v = new i({
    name: "TestEnums",
    values: {
      Zuck: {
        value: "zuck"
      },
      Mark: {
        value: "mark"
      }
    }
  }), h = new s({
    types: [m, d, v, x]
  }), h = l(h, f(o.readFileSync(r, "utf8"))), l(h, f("\n      input ProfilePictureOptions {\n        newName: String\n      }\n\n      extend type User {\n        profilePicture2(\n          size: [Int],\n          preset: PhotoSize\n          cropPosition: CropPosition\n          fileExtension: FileExtension\n          additionalParameters: JSON\n          options: ProfilePictureOptions\n        ): Image\n      }\n\n      extend type Image {\n        test_enums: TestEnums\n      }\n    ")));
}, function (e, t, n) {
  "use strict";

  (function (t) {
    var r = n(2);
    e.exports = r.join(t, "testschema.graphql");
  }).call(this, "/");
}, function (e, t) {
  e.exports = require("path");
}, function (e, t) {
  e.exports = require("fs");
}, function (e, t) {
  e.exports = require("graphql");
}, function (e, t, n) {
  "use strict";

  var r = n(4),
      o = r.extendSchema,
      a = r.parse,
      i = n(6),
      u = i.Parser,
      s = i.convertASTDocuments;

  e.exports = function (e, t) {
    var n = a(t),
        r = o(e, n, {
      assumeValid: !0
    });
    return {
      definitions: s(r, [n], [], u.transform.bind(u)),
      schema: r !== e ? r : null
    };
  };
}, function (e, t) {
  e.exports = require("relay-compiler");
}, function (e, t, n) {
  "use strict";

  var r = n(8),
      o = n(0),
      a = n(1),
      i = n(5),
      u = n(10),
      s = n(11),
      c = s.generateAndCompile,
      l = s.generateWithTransforms,
      f = n(12),
      p = f.generateTestsFromFixtures,
      m = f.FIXTURE_TAG,
      d = n(16),
      v = d.createMockEnvironment,
      h = d.unwrapContainer;
  e.exports = {
    createMockEnvironment: v,
    testSchemaPath: a,
    TestSchema: o,
    generateAndCompile: c,
    generateTestsFromFixtures: p,
    generateWithTransforms: l,
    matchers: r,
    simpleClone: u,
    parseGraphQLText: i,
    unwrapContainer: h,
    FIXTURE_TAG: m
  };
}, function (e, t, n) {
  "use strict";

  e.exports = {
    toBeDeeplyFrozen: function (e) {
      return function e(t) {
        if (expect(Object.isFrozen(t)).toBe(!0), Array.isArray(t)) t.forEach(function (t) {
          return e(t);
        });else if ("object" == typeof t && null !== t) for (var n in t) e(t[n]);
      }(e), {
        pass: !0
      };
    },
    toWarn: function (e, t) {
      var r = this.isNot;

      function o(e) {
        return e instanceof RegExp ? e.toString() : JSON.stringify(e);
      }

      function a(e) {
        return "[" + e.map(o).join(", ") + "]";
      }

      function i(e) {
        return e.length ? e.map(function (e) {
          return a([!!e[0]].concat(e.slice(1)));
        }).join(", ") : "[]";
      }

      var u = n(9);
      if (!u.mock) throw new Error("toWarn(): Requires `jest.mock('warning')`.");
      var s = u.mock.calls.length;
      e();
      var c = u.mock.calls.slice(s);
      return t ? (Array.isArray(t) || (t = [t]), {
        pass: !!c.find(function (e) {
          return e.length === t.length + 1 && e.every(function (e, n) {
            if (!n) return !e;
            var r = t[n - 1];
            return r instanceof RegExp ? r.test(e) : e === r;
          });
        }),
        message: function () {
          return "Expected ".concat(r ? "not " : "", "to warn: ") + "".concat(a([!1].concat(t)), " but ") + "`warning` received the following calls: " + "".concat(i(c), ".");
        }
      }) : {
        pass: !!c.filter(function (e) {
          return !e[0];
        }).length,
        message: function () {
          return "Expected ".concat(r ? "not " : "", "to warn but ") + "`warning` received the following calls: " + "".concat(i(c), ".");
        }
      };
    }
  };
}, function (e, t) {
  e.exports = require("fbjs/lib/warning");
}, function (e, t, n) {
  "use strict";

  e.exports = function e(t) {
    if (Array.isArray(t)) return t.map(e);

    if (null != t && "object" == typeof t) {
      var n = {};

      for (var r in t) n[r] = e(t[r]);

      return n;
    }

    return t;
  };
}, function (e, t, n) {
  "use strict";

  var r = n(0),
      o = n(5),
      a = n(6),
      i = a.CodeMarker,
      u = a.GraphQLCompilerContext,
      s = a.IRTransforms,
      c = a.compileRelayArtifacts,
      l = a.transformASTSchema;

  function f(e, t, n, r) {
    var a = l(t, s.schemaExtensions),
        f = new u(t, a).addAll(o(a, e).definitions),
        p = {};
    return c(f, n).forEach(function (e) {
      e[0];
      var t = e[1],
          n = null != r ? i.transform(t, r) : t;
      p["Request" === t.kind ? t.params.name : t.name] = n;
    }), p;
  }

  e.exports = {
    generateAndCompile: function (e, t, n) {
      var o;
      return f(e, t || r, s, null !== (o = n) && void 0 !== o ? o : null);
    },
    generateWithTransforms: function (e, t) {
      return f(e, r, {
        commonTransforms: t || [],
        fragmentTransforms: [],
        queryTransforms: [],
        codegenTransforms: [],
        printTransforms: []
      }, null);
    }
  };
}, function (e, t, n) {
  "use strict";

  var r = n(13)(n(14)),
      o = n(3),
      a = n(15),
      i = n(2),
      u = Symbol.for("FIXTURE_TAG");
  expect.addSnapshotSerializer({
    print: function (e) {
      return Object.keys(e).map(function (t) {
        return "~~~~~~~~~~ ".concat(t.toUpperCase(), " ~~~~~~~~~~\n").concat(e[t]);
      }).join("\n");
    },
    test: function (e) {
      return e && !0 === e[u];
    }
  }), e.exports = {
    generateTestsFromFixtures: function (e, t) {
      var n = o.readdirSync(e);
      test("has fixtures in ".concat(e), function () {
        expect(n.length > 0).toBe(!0);
      });
      var s = n.filter(function (e) {
        return e.startsWith("only.");
      });
      s.length && (test.skip.each(n.filter(function (e) {
        return !e.startsWith("only.");
      }))("matches expected output: %s", function () {}), n = s), test.each(n)("matches expected output: %s", function (n) {
        var s,
            c = o.readFileSync(i.join(e, n), "utf8"),
            l = a(c, t, n);
        expect((s = {}, (0, r.default)(s, u, !0), (0, r.default)(s, "input", c), (0, r.default)(s, "output", l), s)).toMatchSnapshot();
      });
    },
    FIXTURE_TAG: u
  };
}, function (e, t) {
  e.exports = require("@babel/runtime/helpers/interopRequireDefault");
}, function (e, t) {
  e.exports = require("@babel/runtime/helpers/defineProperty");
}, function (e, t, n) {
  "use strict";

  e.exports = function (e, t, n) {
    if (/^# *expected-to-throw/.test(e)) {
      var r;

      try {
        r = t(e);
      } catch (e) {
        return "THROWN EXCEPTION:\n\n".concat(e.toString());
      }

      throw new Error("Expected test file '".concat(n, "' to throw, but it passed:\n").concat(r));
    }

    return t(e);
  };
}, function (e, t) {
  e.exports = require("relay-test-utils");
}]);