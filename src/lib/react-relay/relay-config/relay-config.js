/**
 * Relay v5.0.0
 */
var RelayConfig = function (e) {
  var n = {};

  function r(o) {
    if (n[o]) return n[o].exports;
    var t = n[o] = {
      i: o,
      l: !1,
      exports: {}
    };
    return e[o].call(t.exports, t, t.exports, r), t.l = !0, t.exports;
  }

  return r.m = e, r.c = n, r.d = function (e, n, o) {
    r.o(e, n) || Object.defineProperty(e, n, {
      enumerable: !0,
      get: o
    });
  }, r.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, r.t = function (e, n) {
    if (1 & n && (e = r(e)), 8 & n) return e;
    if (4 & n && "object" == typeof e && e && e.__esModule) return e;
    var o = Object.create(null);
    if (r.r(o), Object.defineProperty(o, "default", {
      enumerable: !0,
      value: e
    }), 2 & n && "string" != typeof e) for (var t in e) r.d(o, t, function (n) {
      return e[n];
    }.bind(null, t));
    return o;
  }, r.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    return r.d(n, "a", n), n;
  }, r.o = function (e, n) {
    return Object.prototype.hasOwnProperty.call(e, n);
  }, r.p = "", r(r.s = 0);
}([function (e, n, r) {
  "use strict";

  var o = r(1),
      t = o("relay", {
    searchPlaces: ["relay.config.js", "relay.config.json", "package.json"],
    loaders: {
      ".json": o.loadJson,
      ".yaml": o.loadYaml,
      ".yml": o.loadYaml,
      ".js": o.loadJs,
      ".es6": o.loadJs,
      noExt: o.loadYaml
    }
  });
  e.exports = {
    loadConfig: function () {
      var e = t.searchSync();
      if (e) return e.config;
    }
  };
}, function (e, n) {
  e.exports = cosmiconfig;
}]);