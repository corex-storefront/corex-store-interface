/**
 * Relay v5.0.0
 */
!function (e, t) {
  "object" == typeof exports && "object" == typeof module ? module.exports = t(require("relay-runtime"), require("react"), require("@babel/runtime/helpers/interopRequireDefault"), require("fbjs/lib/invariant"), require("fbjs/lib/areEqual"), require("@babel/runtime/helpers/objectSpread"), require("@babel/runtime/helpers/inheritsLoose"), require("@babel/runtime/helpers/defineProperty"), require("@babel/runtime/helpers/objectWithoutPropertiesLoose"), require("@babel/runtime/helpers/assertThisInitialized"), require("@babel/runtime/helpers/extends"), require("fbjs/lib/warning"), require("fbjs/lib/mapObject"), require("fbjs/lib/forEachObject")) : "function" == typeof define && define.amd ? define(["relay-runtime", "react", "@babel/runtime/helpers/interopRequireDefault", "fbjs/lib/invariant", "fbjs/lib/areEqual", "@babel/runtime/helpers/objectSpread", "@babel/runtime/helpers/inheritsLoose", "@babel/runtime/helpers/defineProperty", "@babel/runtime/helpers/objectWithoutPropertiesLoose", "@babel/runtime/helpers/assertThisInitialized", "@babel/runtime/helpers/extends", "fbjs/lib/warning", "fbjs/lib/mapObject", "fbjs/lib/forEachObject"], t) : "object" == typeof exports ? exports.ReactRelay = t(require("relay-runtime"), require("react"), require("@babel/runtime/helpers/interopRequireDefault"), require("fbjs/lib/invariant"), require("fbjs/lib/areEqual"), require("@babel/runtime/helpers/objectSpread"), require("@babel/runtime/helpers/inheritsLoose"), require("@babel/runtime/helpers/defineProperty"), require("@babel/runtime/helpers/objectWithoutPropertiesLoose"), require("@babel/runtime/helpers/assertThisInitialized"), require("@babel/runtime/helpers/extends"), require("fbjs/lib/warning"), require("fbjs/lib/mapObject"), require("fbjs/lib/forEachObject")) : e.ReactRelay = t(e["relay-runtime"], e.react, e["@babel/runtime/helpers/interopRequireDefault"], e["fbjs/lib/invariant"], e["fbjs/lib/areEqual"], e["@babel/runtime/helpers/objectSpread"], e["@babel/runtime/helpers/inheritsLoose"], e["@babel/runtime/helpers/defineProperty"], e["@babel/runtime/helpers/objectWithoutPropertiesLoose"], e["@babel/runtime/helpers/assertThisInitialized"], e["@babel/runtime/helpers/extends"], e["fbjs/lib/warning"], e["fbjs/lib/mapObject"], e["fbjs/lib/forEachObject"]);
}(window, function (e, t, r, n, o, a, i, s, l, u, c, p, f, h) {
  return function (e) {
    var t = {};

    function r(n) {
      if (t[n]) return t[n].exports;
      var o = t[n] = {
        i: n,
        l: !1,
        exports: {}
      };
      return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
    }

    return r.m = e, r.c = t, r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: n
      });
    }, r.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, r.t = function (e, t) {
      if (1 & t && (e = r(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (r.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var o in e) r.d(n, o, function (t) {
        return e[t];
      }.bind(null, o));
      return n;
    }, r.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };
      return r.d(t, "a", t), t;
    }, r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 17);
  }([function (t, r) {
    t.exports = e;
  }, function (e, r) {
    e.exports = t;
  }, function (e, t, r) {
    "use strict";

    var n = r(1),
        o = r(0).__internal.createRelayContext;

    e.exports = o(n);
  }, function (e, t) {
    e.exports = r;
  }, function (e, t) {
    e.exports = n;
  }, function (e, t) {
    e.exports = o;
  }, function (e, t) {
    e.exports = a;
  }, function (e, t) {
    e.exports = i;
  }, function (e, t) {
    e.exports = s;
  }, function (e, t, r) {
    "use strict";

    function n(e) {
      return e.displayName || e.name || "Component";
    }

    e.exports = {
      getComponentName: n,
      getContainerName: function (e) {
        return "Relay(" + n(e) + ")";
      }
    };
  }, function (e, t) {
    e.exports = l;
  }, function (e, t) {
    e.exports = u;
  }, function (e, t, r) {
    "use strict";

    var n = r(3)(r(13)),
        o = r(1),
        a = r(2),
        i = r(19),
        s = r(4),
        l = r(20),
        u = r(21),
        c = r(9),
        p = c.getComponentName,
        f = c.getContainerName,
        h = r(0).getFragment;

    e.exports = function (e, t, r) {
      var c = f(e);
      i(p(e), t);
      var d = r(e, l(t, h));

      function v(e, t) {
        var r = u(a);
        return null == r && s(!1, "`%s` tried to render a context that was not valid this means that `%s` was rendered outside of a query renderer.", c, c), o.createElement(d, (0, n.default)({}, e, {
          __relayContext: r,
          componentRef: e.componentRef || t
        }));
      }

      d.displayName = c, v.displayName = c;
      var b = o.forwardRef(v);
      return b.__ComponentClass = e, b;
    };
  }, function (e, t) {
    e.exports = c;
  }, function (e, t, r) {
    "use strict";

    var n = r(4),
        o = r(22),
        a = r(23);

    function i(e) {
      return "object" == typeof e && null !== e && !Array.isArray(e) && o(e.environment) && a(e.variables);
    }

    e.exports = {
      assertRelayContext: function (e) {
        return i(e) || n(!1, "RelayContext: Expected `context.relay` to be an object conforming to the `RelayContext` interface, got `%s`.", e), e;
      },
      isRelayContext: i
    };
  }, function (e, t, r) {
    "use strict";

    var n = r(3)(r(8)),
        o = r(4),
        a = r(0),
        i = a.isRelayModernEnvironment,
        s = a.__internal.fetchQuery,
        l = function () {
      function e(e) {
        (0, n.default)(this, "_selectionReferences", []), (0, n.default)(this, "_callOnDataChangeWhenSet", !1), null != e && (this._cacheSelectionReference = e.cacheSelectionReference, this._selectionReferences = e.selectionReferences);
      }

      var t = e.prototype;
      return t.getSelectionReferences = function () {
        return {
          cacheSelectionReference: this._cacheSelectionReference,
          selectionReferences: this._selectionReferences
        };
      }, t.lookupInStore = function (e, t) {
        return e.check(t.root) ? (this._retainCachedOperation(e, t), e.lookup(t.fragment)) : null;
      }, t.execute = function (e) {
        var t = this,
            r = e.environment,
            n = e.operation,
            o = e.cacheConfig,
            a = e.preservePreviousReferences,
            l = void 0 !== a && a,
            u = r.retain(n.root),
            c = null != o ? {
          networkCacheConfig: o
        } : {},
            p = function () {
          t._selectionReferences = t._selectionReferences.concat(u);
        },
            f = function () {
          l || t.disposeSelectionReferences(), t._selectionReferences = t._selectionReferences.concat(u);
        },
            h = function () {
          t._selectionReferences = t._selectionReferences.concat(u);
        };

        return i(r) ? s(r, n, c).do({
          error: p,
          complete: f,
          unsubscribe: h
        }) : r.execute({
          operation: n,
          cacheConfig: o
        }).do({
          error: p,
          complete: f,
          unsubscribe: h
        });
      }, t.setOnDataChange = function (e) {
        this._fetchOptions || o(!1, "ReactRelayQueryFetcher: `setOnDataChange` should have been called after having called `fetch`"), "function" == typeof e && (this._fetchOptions.onDataChangeCallbacks = this._fetchOptions.onDataChangeCallbacks || [], this._fetchOptions.onDataChangeCallbacks.push(e), this._callOnDataChangeWhenSet && (null != this._error ? e({
          error: this._error
        }) : null != this._snapshot && e({
          snapshot: this._snapshot
        })));
      }, t.fetch = function (e, t) {
        var r,
            n,
            o = this,
            a = e.cacheConfig,
            i = e.environment,
            s = e.operation,
            l = e.onDataChange,
            u = !1;
        this.disposeRequest();
        var c = this._fetchOptions && this._fetchOptions.onDataChangeCallbacks;
        this._fetchOptions = {
          cacheConfig: a,
          environment: i,
          onDataChangeCallbacks: c || [],
          operation: s
        }, l && -1 === this._fetchOptions.onDataChangeCallbacks.indexOf(l) && this._fetchOptions.onDataChangeCallbacks.push(l);
        var p = this.execute({
          environment: i,
          operation: s,
          cacheConfig: null !== (r = t) && void 0 !== r ? r : a
        }).finally(function () {
          o._pendingRequest = null;
        }).subscribe({
          next: function () {
            o._callOnDataChangeWhenSet = !0, o._error = null, o._onQueryDataAvailable({
              notifyFirstResult: u
            });
          },
          error: function (e) {
            o._callOnDataChangeWhenSet = !0, o._error = e, o._snapshot = null;
            var t = o._fetchOptions && o._fetchOptions.onDataChangeCallbacks;
            u ? t && t.forEach(function (t) {
              t({
                error: e
              });
            }) : n = e;
          }
        });
        if (this._pendingRequest = {
          dispose: function () {
            p.unsubscribe();
          }
        }, u = !0, n) throw n;
        return this._snapshot;
      }, t.retry = function (e) {
        return this._fetchOptions || o(!1, "ReactRelayQueryFetcher: `retry` should be called after having called `fetch`"), this.fetch({
          cacheConfig: this._fetchOptions.cacheConfig,
          environment: this._fetchOptions.environment,
          operation: this._fetchOptions.operation,
          onDataChange: null
        }, e);
      }, t.dispose = function () {
        this.disposeRequest(), this.disposeSelectionReferences();
      }, t.disposeRequest = function () {
        this._error = null, this._snapshot = null, this._pendingRequest && this._pendingRequest.dispose(), this._rootSubscription && (this._rootSubscription.dispose(), this._rootSubscription = null);
      }, t._retainCachedOperation = function (e, t) {
        this._disposeCacheSelectionReference(), this._cacheSelectionReference = e.retain(t.root);
      }, t._disposeCacheSelectionReference = function () {
        this._cacheSelectionReference && this._cacheSelectionReference.dispose(), this._cacheSelectionReference = null;
      }, t.disposeSelectionReferences = function () {
        this._disposeCacheSelectionReference(), this._selectionReferences.forEach(function (e) {
          return e.dispose();
        }), this._selectionReferences = [];
      }, t._onQueryDataAvailable = function (e) {
        var t = this,
            r = e.notifyFirstResult;
        this._fetchOptions || o(!1, "ReactRelayQueryFetcher: `_onQueryDataAvailable` should have been called after having called `fetch`");
        var n = this._fetchOptions,
            a = n.environment,
            i = n.onDataChangeCallbacks,
            s = n.operation;

        if (!this._snapshot && (this._snapshot = a.lookup(s.fragment), this._rootSubscription = a.subscribe(this._snapshot, function (e) {
          if (null != t._fetchOptions) {
            var r = t._fetchOptions.onDataChangeCallbacks;
            Array.isArray(r) && r.forEach(function (t) {
              return t({
                snapshot: e
              });
            });
          }
        }), this._snapshot && r && Array.isArray(i))) {
          var l = this._snapshot;
          i.forEach(function (e) {
            return e({
              snapshot: l
            });
          });
        }
      }, e;
    }();

    e.exports = l;
  }, function (e, t) {
    e.exports = p;
  }, function (e, t, r) {
    "use strict";

    var n = r(2),
        o = r(18),
        a = r(24),
        i = r(25),
        s = r(27),
        l = r(28),
        u = r(0),
        c = r(29);
    e.exports = {
      QueryRenderer: s,
      LocalQueryRenderer: a,
      MutationTypes: u.MutationTypes,
      RangeOperations: u.RangeOperations,
      ReactRelayContext: n,
      applyOptimisticMutation: u.applyOptimisticMutation,
      commitLocalUpdate: u.commitLocalUpdate,
      commitMutation: u.commitMutation,
      createFragmentContainer: o.createContainer,
      createPaginationContainer: i.createContainer,
      createRefetchContainer: l.createContainer,
      fetchQuery: u.fetchQuery,
      graphql: u.graphql,
      requestSubscription: u.requestSubscription,
      readInlineData_EXPERIMENTAL: c
    };
  }, function (e, t, r) {
    "use strict";

    var n = r(3),
        o = n(r(6)),
        a = n(r(10)),
        i = n(r(11)),
        s = n(r(7)),
        l = n(r(8)),
        u = r(1),
        c = r(5),
        p = r(12),
        f = r(9).getContainerName,
        h = r(14).assertRelayContext,
        d = r(0),
        v = d.createFragmentSpecResolver,
        b = d.getDataIDsFromObject,
        y = d.isScalarAndEqual;

    function _(e, t) {
      var r,
          n,
          p = f(e);
      return n = r = function (r) {
        function n(e) {
          var n;
          n = r.call(this, e) || this, (0, l.default)((0, i.default)(n), "_handleFragmentDataUpdate", function () {
            var e = n.state.resolver;
            n.setState(function (t) {
              return e === t.resolver ? {
                data: t.resolver.resolve(),
                relayProp: m(t.relayProp.environment)
              } : null;
            });
          });
          var o = h(e.__relayContext),
              a = v(o, p, t, e);
          return n.state = {
            data: a.resolve(),
            prevProps: e,
            prevPropsContext: o,
            relayProp: m(o.environment),
            resolver: a
          }, n;
        }

        (0, s.default)(n, r), n.getDerivedStateFromProps = function (e, r) {
          var n = r.prevProps,
              o = h(e.__relayContext),
              a = b(t, n),
              i = b(t, e),
              s = r.resolver;
          if (r.prevPropsContext.environment !== o.environment || r.prevPropsContext.variables !== o.variables || !c(a, i)) return {
            data: (s = v(o, p, t, e)).resolve(),
            prevPropsContext: o,
            prevProps: e,
            relayProp: m(o.environment),
            resolver: s
          };
          s.setProps(e);
          var l = s.resolve();
          return l !== r.data ? {
            data: l,
            prevProps: e,
            prevPropsContext: o,
            relayProp: m(o.environment)
          } : null;
        };
        var f = n.prototype;
        return f.componentDidMount = function () {
          this._subscribeToNewResolver(), this._rerenderIfStoreHasChanged();
        }, f.componentDidUpdate = function (e, t) {
          this.state.resolver !== t.resolver && (t.resolver.dispose(), this._subscribeToNewResolver()), this._rerenderIfStoreHasChanged();
        }, f.componentWillUnmount = function () {
          this.state.resolver.dispose();
        }, f.shouldComponentUpdate = function (e, r) {
          if (r.data !== this.state.data) return !0;

          for (var n = Object.keys(e), o = 0; o < n.length; o++) {
            var a = n[o];

            if ("__relayContext" === a) {
              if (r.prevPropsContext.environment !== this.state.prevPropsContext.environment || r.prevPropsContext.variables !== this.state.prevPropsContext.variables) return !0;
            } else if (!t.hasOwnProperty(a) && !y(e[a], this.props[a])) return !0;
          }

          return !1;
        }, f._rerenderIfStoreHasChanged = function () {
          var e = this.state,
              t = e.data,
              r = e.resolver.resolve();
          t !== r && this.setState({
            data: r
          });
        }, f._subscribeToNewResolver = function () {
          this.state.resolver.setCallback(this._handleFragmentDataUpdate);
        }, f.render = function () {
          var t = this.props,
              r = t.componentRef,
              n = (t.__relayContext, (0, a.default)(t, ["componentRef", "__relayContext"]));
          return u.createElement(e, (0, o.default)({}, n, this.state.data, {
            ref: r,
            relay: this.state.relayProp
          }));
        }, n;
      }(u.Component), (0, l.default)(r, "displayName", p), n;
    }

    function m(e) {
      return {
        environment: e
      };
    }

    e.exports = {
      createContainer: function (e, t) {
        return p(e, t, _);
      }
    };
  }, function (e, t, r) {
    "use strict";

    var n = r(4);

    e.exports = function (e, t) {
      for (var r in t && "object" == typeof t || n(!1, "Could not create Relay Container for `%s`. Expected a set of GraphQL fragments, got `%s` instead.", e, t), t) if (t.hasOwnProperty(r)) {
        var o = t[r];
        (!o || "object" != typeof o && "function" != typeof o) && n(!1, "Could not create Relay Container for `%s`. The value of fragment `%s` was expected to be a fragment, got `%s` instead.", e, r, o);
      }
    };
  }, function (e, t) {
    e.exports = f;
  }, function (e, t, r) {
    "use strict";

    var n = r(1).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
        o = n.ReactCurrentDispatcher,
        a = n.ReactCurrentOwner;

    e.exports = function (e) {
      return (null != o ? o.current : a.currentDispatcher).readContext(e);
    };
  }, function (e, t, r) {
    "use strict";

    e.exports = function (e) {
      return "object" == typeof e && null !== e && "function" == typeof e.check && "function" == typeof e.lookup && "function" == typeof e.retain && "function" == typeof e.sendQuery && "function" == typeof e.execute && "function" == typeof e.subscribe;
    };
  }, function (e, t, r) {
    "use strict";

    e.exports = function (e) {
      return "object" == typeof e && null !== e && !Array.isArray(e);
    };
  }, function (e, t, r) {
    "use strict";

    var n = r(1),
        o = r(2),
        a = n.useLayoutEffect,
        i = n.useState,
        s = n.useRef,
        l = n.useMemo,
        u = r(0),
        c = u.createOperationDescriptor,
        p = u.deepFreeze,
        f = u.getRequest,
        h = r(5);

    e.exports = function (e) {
      var t,
          r,
          u = e.environment,
          d = e.query,
          v = e.variables,
          b = e.render,
          y = (t = v, r = n.useRef(t), h(r.current, t) || (p(t), r.current = t), r.current),
          _ = l(function () {
        var e = f(d);
        return c(e, y);
      }, [d, y]),
          m = l(function () {
        return {
          environment: u,
          variables: {}
        };
      }, [u]),
          C = s(null),
          g = i(null)[1],
          R = s(null),
          x = l(function () {
        u.check(_.root);
        var e = u.lookup(_.fragment);
        C.current = e.data;
        var t = u.retain(_.root),
            r = u.subscribe(e, function (e) {
          C.current = e.data, g(C.current);
        }),
            n = !1;
        return R.current && R.current(), R.current = function () {
          n || (n = !0, R.current = null, t.dispose(), r.dispose());
        }, e;
      }, [u, _]);

      return a(function () {
        var e = R.current;
        return function () {
          e && e();
        };
      }, [x]), n.createElement(o.Provider, {
        value: m
      }, b({
        props: C.current
      }));
    };
  }, function (e, t, r) {
    "use strict";

    var n = r(3),
        o = n(r(13)),
        a = n(r(10)),
        i = n(r(11)),
        s = n(r(7)),
        l = n(r(8)),
        u = n(r(6)),
        c = r(1),
        p = r(2),
        f = r(15),
        h = r(5),
        d = r(12),
        v = r(26),
        b = r(4),
        y = r(16),
        _ = r(9),
        m = _.getComponentName,
        C = _.getContainerName,
        g = r(14).assertRelayContext,
        R = r(0),
        x = R.ConnectionInterface,
        P = R.Observable,
        q = R.createFragmentSpecResolver,
        S = R.createOperationDescriptor,
        F = R.getDataIDsFromObject,
        O = R.getFragmentOwners,
        D = R.getRequest,
        j = R.getVariablesFromObject,
        E = R.isScalarAndEqual,
        w = "forward";

    function A(e) {
      return "function" == typeof e ? {
        error: e,
        complete: e,
        unsubscribe: function (t) {
          "function" == typeof e && e();
        }
      } : e || {};
    }

    function k(e, t, r) {
      var n,
          d,
          _ = m(e),
          R = C(e),
          k = function (e) {
        var t = null,
            r = !1;

        for (var n in e) {
          var o = e[n],
              a = o.metadata && o.metadata.connection;
          void 0 !== o.metadata && (r = !0), a && (1 !== a.length && b(!1, "ReactRelayPaginationContainer: Only a single @connection is supported, `%s` has %s.", n, a.length), t && b(!1, "ReactRelayPaginationContainer: Only a single fragment with @connection is supported."), t = (0, u.default)({}, a[0], {
            fragmentName: n
          }));
        }

        return r && null === t && b(!1, "ReactRelayPaginationContainer: A @connection directive must be present."), t || {};
      }(t),
          U = r.getConnectionFromProps || function (e) {
        var t = e.path;
        return t || b(!1, "ReactRelayPaginationContainer: Unable to synthesize a getConnectionFromProps function."), function (r) {
          for (var n = r[e.fragmentName], o = 0; o < t.length; o++) {
            if (!n || "object" != typeof n) return null;
            n = n[t[o]];
          }

          return n;
        };
      }(k),
          N = r.direction || k.direction;

      N || b(!1, "ReactRelayPaginationContainer: Unable to infer direction of the connection, possibly because both first and last are provided.");

      var I = r.getFragmentVariables || function (e) {
        var t = e.count;
        return t || b(!1, "ReactRelayPaginationContainer: Unable to synthesize a getFragmentVariables function."), function (e, r) {
          return (0, u.default)({}, e, (0, l.default)({}, t, r));
        };
      }(k);

      return d = n = function (n) {
        function d(e) {
          var r;
          r = n.call(this, e) || this, (0, l.default)((0, i.default)(r), "_handleFragmentDataUpdate", function () {
            r.setState({
              data: r._resolver.resolve()
            });
          }), (0, l.default)((0, i.default)(r), "_hasMore", function () {
            var e = r._getConnectionData();

            return !!(e && e.hasMore && e.cursor);
          }), (0, l.default)((0, i.default)(r), "_isLoading", function () {
            return !!r._refetchSubscription;
          }), (0, l.default)((0, i.default)(r), "_refetchConnection", function (e, t, n) {
            if (!r._canFetchPage("refetchConnection")) return {
              dispose: function () {}
            };
            r._refetchVariables = n;
            var o = {
              count: e,
              cursor: null,
              totalCount: e
            };
            return {
              dispose: r._fetchPage(o, A(t), {
                force: !0
              }).unsubscribe
            };
          }), (0, l.default)((0, i.default)(r), "_loadMore", function (e, t, n) {
            if (!r._canFetchPage("loadMore")) return {
              dispose: function () {}
            };

            var o = A(t),
                a = r._getConnectionData();

            if (!a) return P.create(function (e) {
              return e.complete();
            }).subscribe(o), null;
            var i = a.edgeCount + e;
            if (n && n.force) return r._refetchConnection(i, t);
            var s = x.get(),
                l = s.END_CURSOR,
                u = s.START_CURSOR,
                c = a.cursor;
            y(c, "ReactRelayPaginationContainer: Cannot `loadMore` without valid `%s` (got `%s`)", N === w ? l : u, c);
            var p = {
              count: e,
              cursor: c,
              totalCount: i
            };
            return {
              dispose: r._fetchPage(p, o, n).unsubscribe
            };
          });
          var o = g(e.__relayContext);
          return r._isARequestInFlight = !1, r._refetchSubscription = null, r._refetchVariables = null, r._resolver = q(o, R, t, e, r._handleFragmentDataUpdate), r.state = {
            data: r._resolver.resolve(),
            prevContext: o,
            contextForChildren: o,
            relayProp: r._buildRelayProp(o)
          }, r._isUnmounted = !1, r._hasFetched = !1, r;
        }

        (0, s.default)(d, n);
        var m = d.prototype;
        return m.UNSAFE_componentWillReceiveProps = function (e) {
          var r = g(e.__relayContext),
              n = F(t, this.props),
              o = F(t, e);
          r.environment === this.state.prevContext.environment && r.variables === this.state.prevContext.variables && h(n, o) ? this._hasFetched || this._resolver.setProps(e) : (this._cleanup(), this._resolver = q(r, R, t, e, this._handleFragmentDataUpdate), this.setState({
            prevContext: r,
            contextForChildren: r,
            relayProp: this._buildRelayProp(r)
          }));

          var a = this._resolver.resolve();

          a !== this.state.data && this.setState({
            data: a
          });
        }, m.componentWillUnmount = function () {
          this._isUnmounted = !0, this._cleanup();
        }, m.shouldComponentUpdate = function (e, r) {
          if (r.data !== this.state.data || r.relayProp !== this.state.relayProp) return !0;

          for (var n = Object.keys(e), o = 0; o < n.length; o++) {
            var a = n[o];

            if ("__relayContext" === a) {
              if (r.prevContext.environment !== this.state.prevContext.environment || r.prevContext.variables !== this.state.prevContext.variables) return !0;
            } else if (!t.hasOwnProperty(a) && !E(e[a], this.props[a])) return !0;
          }

          return !1;
        }, m._buildRelayProp = function (e) {
          return {
            hasMore: this._hasMore,
            isLoading: this._isLoading,
            loadMore: this._loadMore,
            refetchConnection: this._refetchConnection,
            environment: e.environment
          };
        }, m._getConnectionData = function () {
          var e = this.props,
              t = (e.componentRef, (0, a.default)(e, ["componentRef"])),
              r = (0, u.default)({}, t, this.state.data),
              n = U(r);
          if (null == n) return null;
          var o = x.get(),
              i = o.EDGES,
              s = o.PAGE_INFO,
              l = o.HAS_NEXT_PAGE,
              c = o.HAS_PREV_PAGE,
              p = o.END_CURSOR,
              f = o.START_CURSOR;
          "object" != typeof n && b(!1, "ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`to return `null` or a plain object with %s and %s properties, got `%s`.", _, i, s, n);
          var h = n[i],
              d = n[s];
          if (null == h || null == d) return null;
          Array.isArray(h) || b(!1, "ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`to return an object with %s: Array, got `%s`.", _, i, h), "object" != typeof d && b(!1, "ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`to return an object with %s: Object, got `%s`.", _, s, d);
          var v = N === w ? d[l] : d[c],
              m = N === w ? d[p] : d[f];
          return "boolean" != typeof v || 0 !== h.length && void 0 === m ? (y(!1, "ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. Be sure to fetch %s (got `%s`) and %s (got `%s`).", s, _, N === w ? l : c, v, N === w ? p : f, m), null) : {
            cursor: m,
            edgeCount: h.length,
            hasMore: v
          };
        }, m._getQueryFetcher = function () {
          return this._queryFetcher || (this._queryFetcher = new f()), this._queryFetcher;
        }, m._canFetchPage = function (e) {
          return !this._isUnmounted || (y(!1, "ReactRelayPaginationContainer: Unexpected call of `%s` on unmounted container `%s`. It looks like some instances of your container still trying to fetch data but they already unmounted. Please make sure you clear all timers, intervals, async calls, etc that may trigger `%s` call.", e, R, e), !1);
        }, m._fetchPage = function (e, n, o) {
          var i,
              s,
              l = this,
              c = g(this.props.__relayContext).environment,
              p = this.props,
              f = (p.componentRef, p.__relayContext, (0, a.default)(p, ["componentRef", "__relayContext"])),
              d = (0, u.default)({}, f, this.state.data),
              y = O(t, f);
          v(t, function (e, t) {
            var r,
                n,
                o,
                a = y[t],
                s = Array.isArray(a) ? null !== (r = null === (n = a[0]) || void 0 === n ? void 0 : n.variables) && void 0 !== r ? r : {} : null !== (o = null == a ? void 0 : a.variables) && void 0 !== o ? o : {};
            i = (0, u.default)({}, i, s);
          }), s = j(t, f), s = (0, u.default)({}, i, s, this._refetchVariables);
          var m = r.getVariables(d, {
            count: e.count,
            cursor: e.cursor
          }, s);
          ("object" != typeof m || null === m) && b(!1, "ReactRelayPaginationContainer: Expected `getVariables()` to return an object, got `%s` in `%s`.", m, _), m = (0, u.default)({}, m, this._refetchVariables), s = (0, u.default)({}, m, s);
          var C = o ? {
            force: !!o.force
          } : void 0;
          null != C && null != (null == o ? void 0 : o.metadata) && (C.metadata = null == o ? void 0 : o.metadata);
          var R = D(r.query),
              x = S(R, m),
              q = null;
          this._refetchSubscription && this._refetchSubscription.unsubscribe(), this._hasFetched = !0;

          var F = function () {
            l._refetchSubscription === q && (l._refetchSubscription = null, l._isARequestInFlight = !1);
          };

          return this._isARequestInFlight = !0, q = this._getQueryFetcher().execute({
            environment: c,
            operation: x,
            cacheConfig: C,
            preservePreviousReferences: !0
          }).mergeMap(function (t) {
            return P.create(function (t) {
              !function (t, r) {
                var n = (0, u.default)({}, l.props.__relayContext.variables, s),
                    o = l._resolver.resolve();

                l._resolver.setVariables(I(s, e.totalCount), x.request.node);

                var a = l._resolver.resolve();

                h(o, a) ? r() : l.setState({
                  data: a,
                  contextForChildren: {
                    environment: l.props.__relayContext.environment,
                    variables: n
                  }
                }, r);
              }(0, function () {
                t.next(), t.complete();
              });
            });
          }).do({
            error: F,
            complete: F,
            unsubscribe: F
          }).subscribe(n || {}), this._refetchSubscription = this._isARequestInFlight ? q : null, q;
        }, m._cleanup = function () {
          this._resolver.dispose(), this._refetchVariables = null, this._hasFetched = !1, this._refetchSubscription && (this._refetchSubscription.unsubscribe(), this._refetchSubscription = null, this._isARequestInFlight = !1), this._queryFetcher && this._queryFetcher.dispose();
        }, m.render = function () {
          var t = this.props,
              r = t.componentRef,
              n = (t.__relayContext, (0, a.default)(t, ["componentRef", "__relayContext"]));
          return c.createElement(p.Provider, {
            value: this.state.contextForChildren
          }, c.createElement(e, (0, o.default)({}, n, this.state.data, {
            ref: r,
            relay: this.state.relayProp
          })));
        }, d;
      }(c.Component), (0, l.default)(n, "displayName", R), d;
    }

    e.exports = {
      createContainer: function (e, t, r) {
        return d(e, t, function (e, t) {
          return k(e, t, r);
        });
      }
    };
  }, function (e, t) {
    e.exports = h;
  }, function (e, t, r) {
    "use strict";

    var n = r(3),
        o = n(r(6)),
        a = n(r(7)),
        i = r(1),
        s = r(2),
        l = r(15),
        u = r(5),
        c = r(0),
        p = c.createOperationDescriptor,
        f = c.deepFreeze,
        h = c.getRequest,
        d = {},
        v = "store-and-network",
        b = function (e) {
      function t(t) {
        var r;
        r = e.call(this, t) || this;
        var n,
            a,
            i = {
          handleDataChange: null,
          handleRetryAfterError: null
        };

        if (t.query) {
          var s = t.query;
          a = m(h(s).params, t.variables), n = d[a] ? d[a].queryFetcher : new l();
        } else n = new l();

        return r.state = (0, o.default)({
          prevPropsEnvironment: t.environment,
          prevPropsVariables: t.variables,
          prevQuery: t.query,
          queryFetcher: n,
          retryCallbacks: i
        }, C(t, n, i, a)), r;
      }

      (0, a.default)(t, e), t.getDerivedStateFromProps = function (e, t) {
        if (t.prevQuery !== e.query || t.prevPropsEnvironment !== e.environment || !u(t.prevPropsVariables, e.variables)) {
          var r,
              n = e.query,
              a = t.queryFetcher.getSelectionReferences();

          if (t.queryFetcher.disposeRequest(), n) {
            var i = m(h(n).params, e.variables);
            r = d[i] ? d[i].queryFetcher : new l(a);
          } else r = new l(a);

          return (0, o.default)({
            prevQuery: e.query,
            prevPropsEnvironment: e.environment,
            prevPropsVariables: e.variables,
            queryFetcher: r
          }, C(e, r, t.retryCallbacks));
        }

        return null;
      };
      var r = t.prototype;
      return r.componentDidMount = function () {
        var e = this,
            t = this.state,
            r = t.retryCallbacks,
            n = t.queryFetcher,
            o = t.requestCacheKey;
        o && delete d[o], r.handleDataChange = function (t) {
          var r = null == t.error ? null : t.error,
              n = null == t.snapshot ? null : t.snapshot;
          e.setState(function (e) {
            var t = e.requestCacheKey;
            return t && delete d[t], n === e.snapshot && r === e.error ? null : {
              renderProps: _(r, n, e.queryFetcher, e.retryCallbacks),
              snapshot: n,
              requestCacheKey: null
            };
          });
        }, r.handleRetryAfterError = function (t) {
          return e.setState(function (e) {
            var t = e.requestCacheKey;
            return t && delete d[t], {
              renderProps: {
                error: null,
                props: null,
                retry: null
              },
              requestCacheKey: null
            };
          });
        }, this.props.query && n.setOnDataChange(r.handleDataChange);
      }, r.componentDidUpdate = function () {
        var e = this.state.requestCacheKey;
        e && (delete d[e], delete this.state.requestCacheKey);
      }, r.componentWillUnmount = function () {
        this.state.queryFetcher.dispose();
      }, r.shouldComponentUpdate = function (e, t) {
        return e.render !== this.props.render || t.renderProps !== this.state.renderProps;
      }, r.render = function () {
        var e = this.state,
            t = e.renderProps,
            r = e.relayContext;
        return f(t), i.createElement(s.Provider, {
          value: r
        }, this.props.render(t));
      }, t;
    }(i.Component);

    function y(e, t) {
      return {
        environment: e,
        variables: t
      };
    }

    function _(e, t, r, n) {
      return {
        error: e || null,
        props: t ? t.data : null,
        retry: function (t) {
          var o = r.retry(t);
          o && "function" == typeof n.handleDataChange ? n.handleDataChange({
            snapshot: o
          }) : e && "function" == typeof n.handleRetryAfterError && n.handleRetryAfterError(e);
        }
      };
    }

    function m(e, t) {
      var r = e.id || e.text;
      return JSON.stringify({
        id: String(r),
        variables: t
      });
    }

    function C(e, t, r, n) {
      var o = e.environment,
          a = e.query,
          i = e.variables,
          s = o;
      if (!a) return t.dispose(), {
        error: null,
        relayContext: y(s, i),
        renderProps: {
          error: null,
          props: {},
          retry: null
        },
        requestCacheKey: null
      };
      var l = h(a),
          u = p(l, i),
          c = y(s, u.request.variables);

      if ("string" == typeof n && d[n]) {
        var f = d[n].snapshot;
        return f ? {
          error: null,
          relayContext: c,
          renderProps: _(null, f, t, r),
          snapshot: f,
          requestCacheKey: n
        } : {
          error: null,
          relayContext: c,
          renderProps: {
            error: null,
            props: null,
            retry: null
          },
          snapshot: null,
          requestCacheKey: n
        };
      }

      try {
        var b = e.fetchPolicy === v ? t.lookupInStore(s, u) : null,
            C = t.fetch({
          cacheConfig: e.cacheConfig,
          environment: s,
          onDataChange: r.handleDataChange,
          operation: u
        }) || b;
        return n = n || m(l.params, e.variables), d[n] = {
          queryFetcher: t,
          snapshot: C
        }, C ? {
          error: null,
          relayContext: c,
          renderProps: _(null, C, t, r),
          snapshot: C,
          requestCacheKey: n
        } : {
          error: null,
          relayContext: c,
          renderProps: {
            error: null,
            props: null,
            retry: null
          },
          snapshot: null,
          requestCacheKey: n
        };
      } catch (e) {
        return {
          error: e,
          relayContext: c,
          renderProps: _(e, null, t, r),
          snapshot: null,
          requestCacheKey: n
        };
      }
    }

    e.exports = b;
  }, function (e, t, r) {
    "use strict";

    var n = r(3),
        o = n(r(13)),
        a = n(r(10)),
        i = n(r(6)),
        s = n(r(11)),
        l = n(r(7)),
        u = n(r(8)),
        c = r(1),
        p = r(2),
        f = r(15),
        h = r(5),
        d = r(12),
        v = r(16),
        b = r(9).getContainerName,
        y = r(14).assertRelayContext,
        _ = r(0),
        m = _.Observable,
        C = _.createFragmentSpecResolver,
        g = _.createOperationDescriptor,
        R = _.getDataIDsFromObject,
        x = _.getRequest,
        P = _.getVariablesFromObject,
        q = _.isScalarAndEqual;

    function S(e, t) {
      return {
        environment: e,
        refetch: t
      };
    }

    e.exports = {
      createContainer: function (e, t, r) {
        return d(e, t, function (e, t) {
          return function (e, t, r) {
            var n,
                d,
                _ = b(e);

            return d = n = function (n) {
              function d(e) {
                var o;
                o = n.call(this, e) || this, (0, u.default)((0, s.default)(o), "_handleFragmentDataUpdate", function () {
                  var e = o.state.resolver;
                  o.setState(function (t) {
                    return e === t.resolver ? {
                      data: t.resolver.resolve()
                    } : null;
                  });
                }), (0, u.default)((0, s.default)(o), "_refetch", function (e, t, n, a) {
                  if (o._isUnmounted) return v(!1, "ReactRelayRefetchContainer: Unexpected call of `refetch` on unmounted container `%s`. It looks like some instances of your container still trying to refetch the data but they already unmounted. Please make sure you clear all timers, intervals, async calls, etc that may trigger `refetch`.", _), {
                    dispose: function () {}
                  };
                  var s = y(o.props.__relayContext),
                      l = s.environment,
                      u = s.variables,
                      c = "function" == typeof e ? e(o._getFragmentVariables()) : e;
                  c = (0, i.default)({}, u, c);
                  var p = t ? (0, i.default)({}, c, t) : c,
                      f = a ? {
                    force: !!a.force
                  } : void 0;
                  null != f && null != (null == a ? void 0 : a.metadata) && (f.metadata = null == a ? void 0 : a.metadata);
                  var h,
                      d = "function" == typeof n ? {
                    next: n,
                    error: n
                  } : n || {},
                      b = x(r),
                      C = g(b, c);
                  return o.state.localVariables = c, o._refetchSubscription && o._refetchSubscription.unsubscribe(), "store-or-network" === (null == a ? void 0 : a.fetchPolicy) && null != o._getQueryFetcher().lookupInStore(l, C) ? (o.state.resolver.setVariables(p, C.request.node), o.setState(function (e) {
                    return {
                      data: e.resolver.resolve(),
                      contextForChildren: {
                        environment: o.props.__relayContext.environment,
                        variables: p
                      }
                    };
                  }, function () {
                    d.next && d.next(), d.complete && d.complete();
                  }), {
                    dispose: function () {}
                  }) : (o._getQueryFetcher().execute({
                    environment: l,
                    operation: C,
                    cacheConfig: f,
                    preservePreviousReferences: !0
                  }).mergeMap(function (e) {
                    return o.state.resolver.setVariables(p, C.request.node), m.create(function (e) {
                      return o.setState(function (e) {
                        return {
                          data: e.resolver.resolve(),
                          contextForChildren: {
                            environment: o.props.__relayContext.environment,
                            variables: p
                          }
                        };
                      }, function () {
                        e.next(), e.complete();
                      });
                    });
                  }).finally(function () {
                    o._refetchSubscription === h && (o._refetchSubscription = null);
                  }).subscribe((0, i.default)({}, d, {
                    start: function (e) {
                      o._refetchSubscription = h = e, d.start && d.start(e);
                    }
                  })), {
                    dispose: function () {
                      h && h.unsubscribe();
                    }
                  });
                });
                var a = y(e.__relayContext);
                o._refetchSubscription = null;
                var l = C(a, _, t, e);
                return o.state = {
                  data: l.resolve(),
                  localVariables: null,
                  prevProps: e,
                  prevPropsContext: a,
                  contextForChildren: a,
                  relayProp: S(a.environment, o._refetch),
                  resolver: l
                }, o._isUnmounted = !1, o;
              }

              (0, l.default)(d, n);
              var b = d.prototype;
              return b.componentDidMount = function () {
                this._subscribeToNewResolver();
              }, b.componentDidUpdate = function (e, t) {
                this.state.resolver !== t.resolver && (t.resolver.dispose(), this._queryFetcher && this._queryFetcher.dispose(), this._refetchSubscription && this._refetchSubscription.unsubscribe(), this._subscribeToNewResolver());
              }, d.getDerivedStateFromProps = function (e, r) {
                var n = r.prevProps,
                    o = y(e.__relayContext),
                    a = R(t, n),
                    i = R(t, e),
                    s = r.resolver;
                if (r.prevPropsContext.environment !== o.environment || r.prevPropsContext.variables !== o.variables || !h(a, i)) return {
                  data: (s = C(o, _, t, e)).resolve(),
                  localVariables: null,
                  prevProps: e,
                  prevPropsContext: o,
                  contextForChildren: o,
                  relayProp: S(o.environment, r.relayProp.refetch),
                  resolver: s
                };
                r.localVariables || s.setProps(e);
                var l = s.resolve();
                return l !== r.data ? {
                  data: l,
                  prevProps: e
                } : null;
              }, b.componentWillUnmount = function () {
                this._isUnmounted = !0, this.state.resolver.dispose(), this._queryFetcher && this._queryFetcher.dispose(), this._refetchSubscription && this._refetchSubscription.unsubscribe();
              }, b.shouldComponentUpdate = function (e, r) {
                if (r.data !== this.state.data || r.relayProp !== this.state.relayProp) return !0;

                for (var n = Object.keys(e), o = 0; o < n.length; o++) {
                  var a = n[o];

                  if ("__relayContext" === a) {
                    if (this.state.prevPropsContext.environment !== r.prevPropsContext.environment || this.state.prevPropsContext.variables !== r.prevPropsContext.variables) return !0;
                  } else if (!t.hasOwnProperty(a) && !q(e[a], this.props[a])) return !0;
                }

                return !1;
              }, b._subscribeToNewResolver = function () {
                var e = this.state,
                    t = e.data,
                    r = e.resolver;
                r.setCallback(this._handleFragmentDataUpdate);
                var n = r.resolve();
                t !== n && this.setState({
                  data: n
                });
              }, b._getFragmentVariables = function () {
                return P(t, this.props);
              }, b._getQueryFetcher = function () {
                return this._queryFetcher || (this._queryFetcher = new f()), this._queryFetcher;
              }, b.render = function () {
                var t = this.props,
                    r = t.componentRef,
                    n = (t.__relayContext, (0, a.default)(t, ["componentRef", "__relayContext"])),
                    i = this.state,
                    s = i.relayProp,
                    l = i.contextForChildren;
                return c.createElement(p.Provider, {
                  value: l
                }, c.createElement(e, (0, o.default)({}, n, this.state.data, {
                  ref: r,
                  relay: s
                })));
              }, d;
            }(c.Component), (0, u.default)(n, "displayName", _), d;
          }(e, t, r);
        });
      }
    };
  }, function (e, t, r) {
    "use strict";

    var n = r(4),
        o = r(0),
        a = o.getInlineDataFragment,
        i = o.FRAGMENTS_KEY;

    e.exports = function (e, t) {
      var r,
          o = a(e);
      if (null == t) return t;
      "object" != typeof t && n(!1, "readInlineData(): Expected an object, got `%s`.", typeof t);
      var s = null === (r = t[i]) || void 0 === r ? void 0 : r[o.name];
      return null == s && n(!1, "readInlineData(): Expected fragment `%s` to be spread in the parent fragment.", o.name), s;
    };
  }]);
});