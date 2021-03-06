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

var Observable = require("./RelayObservable");

var RelayReplaySubject = require("./RelayReplaySubject");

var invariant = require("fbjs/lib/invariant");

var requestCachesByEnvironment = new Map();
/**
 * Fetches the given query and variables on the provided environment,
 * and de-dupes identical in-flight requests.
 *
 * Observing a request:
 * ====================
 * fetchQuery returns an Observable which you can call .subscribe()
 * on. subscribe() takes an Observer, which you can provide to
 * observe network events:
 *
 * ```
 * fetchQuery(environment, query, variables).subscribe({
 *   // Called when network requests starts
 *   start: (subscription) => {},
 *
 *   // Called after a payload is received and written to the local store
 *   next: (payload) => {},
 *
 *   // Called when network requests errors
 *   error: (error) => {},
 *
 *   // Called when network requests fully completes
 *   complete: () => {},
 *
 *   // Called when network request is unsubscribed
 *   unsubscribe: (subscription) => {},
 * });
 * ```
 *
 * In-flight request de-duping:
 * ============================
 * By default, calling fetchQuery multiple times with the same
 * environment, query and variables will not initiate a new request if a request
 * for those same parameters is already in flight.
 *
 * A request is marked in-flight from the moment it starts until the moment it
 * fully completes, regardless of error or successful completion.
 *
 * NOTE: If the request completes _synchronously_, calling fetchQuery
 * a second time with the same arguments in the same tick will _NOT_ de-dupe
 * the request given that it will no longer be in-flight.
 *
 *
 * Data Retention:
 * ===============
 * This function will not retain any query data outside the scope of the
 * request, which means it is not guaranteed that it won't be garbage
 * collected after the request completes.
 * If you need to retain data, you can do so manually with environment.retain().
 *
 * Cancelling requests:
 * ====================
 * If the subscription returned by subscribe is called while the
 * request is in-flight, apart from releasing retained data, the request will
 * also be cancelled.
 *
 * ```
 * const subscription = fetchQuery(...).subscribe(...);
 *
 * // This will cancel the request if it is in-flight.
 * subscription.unsubscribe();
 * ```
 */

function fetchQuery(environment, operation, options) {
  return fetchQueryDeduped(environment, operation.request, function () {
    return environment.execute({
      operation: operation,
      cacheConfig: options === null || options === void 0 ? void 0 : options.networkCacheConfig
    });
  });
}
/**
 * Low-level implementation details of `fetchQuery`.
 *
 * `fetchQueryDeduped` can also be used to share a single cache for
 * requests that aren't using `fetchQuery` directly (e.g. because they don't
 * have an `OperationDescriptor` when they are called).
 */


function fetchQueryDeduped(environment, request, fetchFn) {
  return Observable.create(function (sink) {
    var requestCache = getRequestCache(environment);
    var identifier = request.identifier;
    var cachedRequest = requestCache.get(identifier);

    if (!cachedRequest) {
      fetchFn()["finally"](function () {
        return requestCache["delete"](identifier);
      }).subscribe({
        start: function start(subscription) {
          cachedRequest = {
            identifier: identifier,
            subject: new RelayReplaySubject(),
            subscription: subscription
          };
          requestCache.set(identifier, cachedRequest);
        },
        next: function next(response) {
          getCachedRequest(requestCache, identifier).subject.next(response);
        },
        error: function error(_error) {
          getCachedRequest(requestCache, identifier).subject.error(_error);
        },
        complete: function complete() {
          getCachedRequest(requestCache, identifier).subject.complete();
        }
      });
    }

    !(cachedRequest != null) ? process.env.NODE_ENV !== "production" ? invariant(false, '[fetchQueryInternal] fetchQueryDeduped: Expected `start` to be ' + 'called synchronously') : invariant(false) : void 0;
    return getObservableForCachedRequest(requestCache, cachedRequest).subscribe(sink);
  });
}
/**
 * @private
 */


function getObservableForCachedRequest(requestCache, cachedRequest) {
  return Observable.create(function (sink) {
    var subscription = cachedRequest.subject.subscribe(sink);
    return function () {
      subscription.unsubscribe();
      var cachedRequestInstance = requestCache.get(cachedRequest.identifier);

      if (cachedRequestInstance) {
        var requestSubscription = cachedRequestInstance.subscription;

        if (requestSubscription != null && cachedRequestInstance.subject.getObserverCount() === 0) {
          requestSubscription.unsubscribe();
          requestCache["delete"](cachedRequest.identifier);
        }
      }
    };
  });
}
/**
 * If a request is in flight for the given query, variables and environment,
 * this function will return a Promise that will resolve when that request has
 * completed and the data has been saved to the store.
 * If no request is in flight, null will be returned
 */


function getPromiseForRequestInFlight(environment, request) {
  var requestCache = getRequestCache(environment);
  var cachedRequest = requestCache.get(request.identifier);

  if (!cachedRequest) {
    return null;
  }

  return new Promise(function (resolve, reject) {
    var resolveOnNext = false;
    getObservableForCachedRequest(requestCache, cachedRequest).subscribe({
      complete: resolve,
      error: reject,
      next: function next(response) {
        /*
         * The underlying `RelayReplaySubject` will synchronously replay events
         * as soon as we subscribe, but since we want the *next* asynchronous
         * one, we'll ignore them until the replay finishes.
         */
        if (resolveOnNext) {
          resolve(response);
        }
      }
    });
    resolveOnNext = true;
  });
}
/**
 * If there is a pending request for the given query, returns an Observable of
 * *all* its responses. Existing responses are published synchronously and
 * subsequent responses are published asynchronously. Returns null if there is
 * no pending request. This is similar to fetchQuery() except that it will not
 * issue a fetch if there isn't already one pending.
 */


function getObservableForRequestInFlight(environment, request) {
  var requestCache = getRequestCache(environment);
  var cachedRequest = requestCache.get(request.identifier);

  if (!cachedRequest) {
    return null;
  }

  return getObservableForCachedRequest(requestCache, cachedRequest);
}

function hasRequestInFlight(environment, request) {
  var requestCache = getRequestCache(environment);
  return requestCache.has(request.identifier);
}
/**
 * @private
 */


function getRequestCache(environment) {
  var cached = requestCachesByEnvironment.get(environment);

  if (cached != null) {
    return cached;
  }

  var requestCache = new Map();
  requestCachesByEnvironment.set(environment, requestCache);
  return requestCache;
}
/**
 * @private
 */


function getCachedRequest(requestCache, identifier) {
  var cached = requestCache.get(identifier);
  !(cached != null) ? process.env.NODE_ENV !== "production" ? invariant(false, '[fetchQueryInternal] getCachedRequest: Expected request to be cached') : invariant(false) : void 0;
  return cached;
}

module.exports = {
  fetchQuery: fetchQuery,
  fetchQueryDeduped: fetchQueryDeduped,
  getPromiseForRequestInFlight: getPromiseForRequestInFlight,
  getObservableForRequestInFlight: getObservableForRequestInFlight,
  hasRequestInFlight: hasRequestInFlight
};