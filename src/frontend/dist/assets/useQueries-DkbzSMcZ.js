var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { a3 as Subscribable, a4 as pendingThenable, a5 as resolveEnabled, a6 as shallowEqualObjects, a7 as resolveStaleTime, a8 as noop, a9 as isServer, aa as isValidTimeout, ab as timeUntilStale, ac as timeoutManager, ad as focusManager, ae as fetchState, af as replaceData, ag as notifyManager, ah as hashKey, ai as getDefaultState, r as reactExports, aj as shouldThrowError, ak as useQueryClient, j as jsxRuntimeExports, n as cn, a as useInternetIdentity, al as createActorWithConfig } from "./index-DT4hGqI0.js";
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: newState.dataUpdateCount > 0 || newState.errorUpdateCount > 0,
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const finalizeThenableIfPossible = (thenable) => {
        if (nextResult.status === "error") {
          thenable.reject(nextResult.error);
        } else if (nextResult.data !== void 0) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (nextResult.status === "error" || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (nextResult.status !== "error" || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (isServer || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (isServer || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
          _a2,
          action.data,
          variables,
          onMutateResult,
          context
        );
        (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
          _c,
          action.data,
          null,
          variables,
          onMutateResult,
          context
        );
      } else if ((action == null ? void 0 : action.type) === "error") {
        (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
          _e,
          action.error,
          variables,
          onMutateResult,
          context
        );
        (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
          _g,
          void 0,
          action.error,
          variables,
          onMutateResult,
          context
        );
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
  if (options.suspense || options.throwOnError || options.experimental_prefetchInRender) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d, _e;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query: client.getQueryCache().get(defaultedOptions.queryHash),
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !isServer && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      (_e = client.getQueryCache().get(defaultedOptions.queryHash)) == null ? void 0 : _e.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function storeSessionParameter(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to store session parameter ${key}:`, error);
  }
}
function getSessionParameter(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to retrieve session parameter ${key}:`, error);
    return null;
  }
}
function clearParamFromHash(paramName) {
  if (!window.history.replaceState) {
    return;
  }
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return;
  }
  const hashContent = hash.substring(1);
  const queryStartIndex = hashContent.indexOf("?");
  if (queryStartIndex === -1) {
    return;
  }
  const routePath = hashContent.substring(0, queryStartIndex);
  const queryString = hashContent.substring(queryStartIndex + 1);
  const params = new URLSearchParams(queryString);
  params.delete(paramName);
  const newQueryString = params.toString();
  let newHash = routePath;
  if (newQueryString) {
    newHash += `?${newQueryString}`;
  }
  const newUrl = window.location.pathname + window.location.search + (newHash ? `#${newHash}` : "");
  window.history.replaceState(null, "", newUrl);
}
function getSecretFromHash(paramName) {
  const existingSecret = getSessionParameter(paramName);
  if (existingSecret !== null) {
    return existingSecret;
  }
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return null;
  }
  const hashContent = hash.substring(1);
  const params = new URLSearchParams(hashContent);
  const secret = params.get(paramName);
  if (secret) {
    storeSessionParameter(paramName, secret);
    clearParamFromHash(paramName);
    return secret;
  }
  return null;
}
function getSecretParameter(paramName) {
  return getSecretFromHash(paramName);
}
const ACTOR_QUERY_KEY = "actor";
function useActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;
      if (!isAuthenticated) {
        return await createActorWithConfig();
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(actorOptions);
      const adminToken = getSecretParameter("caffeineAdminToken") || "";
      await actor._initializeAccessControlWithSecret(adminToken);
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function useGetAllElectricians() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["electricians"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllElectricians();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addElectrician(
        params.name,
        params.specialist,
        params.workAvailability,
        params.qualification,
        params.email,
        params.address,
        params.hourlyRate,
        params.currency,
        params.paymentMethod
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingElectricians"] });
    }
  });
}
function useUpdateElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateElectrician(
        params.id,
        params.name ?? null,
        params.specialist ?? null,
        params.isAvailable ?? null,
        params.workAvailability ?? null,
        params.qualification ?? null,
        params.email ?? null,
        params.address ?? null,
        params.hourlyRate ?? null,
        params.currency ?? null,
        params.paymentMethod ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
    }
  });
}
function useRemoveElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeElectrician(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
    }
  });
}
const STORAGE_KEY = "tt_work_orders";
const STORAGE_ID_KEY = "tt_work_order_next_id";
function loadWorkOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((wo) => ({
      ...wo,
      createdAt: new Date(wo.createdAt)
    }));
  } catch {
    return [];
  }
}
function saveWorkOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
  }
}
function loadNextId() {
  try {
    const raw = localStorage.getItem(STORAGE_ID_KEY);
    return raw ? Number.parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}
function saveNextId(id) {
  try {
    localStorage.setItem(STORAGE_ID_KEY, String(id));
  } catch {
  }
}
let workOrderStore = loadWorkOrders();
let nextWorkOrderId = loadNextId();
function useGetAllWorkOrders() {
  return useQuery({
    queryKey: ["workOrders"],
    queryFn: async () => {
      return [...workOrderStore];
    }
  });
}
function useGetCurrentUserWorkOrders() {
  return useQuery({
    queryKey: ["myWorkOrders"],
    queryFn: async () => {
      return workOrderStore.filter((wo) => wo.status !== "cancelled");
    }
  });
}
function useCreateFixedPriceWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const newOrder = {
        id: nextWorkOrderId++,
        title: params.title,
        description: params.description,
        location: params.location,
        priority: params.priority,
        status: "open",
        applicationStatus: "pending",
        createdAt: /* @__PURE__ */ new Date(),
        customerEmail: params.customerEmail,
        customerAddress: params.customerAddress,
        customerContactNumber: params.customerContactNumber,
        paymentAmount: 1200,
        paymentStatus: { __kind__: "pending" },
        paymentMethod: params.paymentMethod,
        preferredEducation: params.preferredEducation,
        verificationStatus: "pending"
      };
      workOrderStore.push(newOrder);
      saveWorkOrders(workOrderStore);
      saveNextId(nextWorkOrderId);
      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingWorkOrders"] });
    }
  });
}
function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.status = params.status;
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
    }
  });
}
function useUpdateWorkOrderPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.paymentStatus = params.paymentStatus;
      if (params.paymentAmount !== void 0) {
        order.paymentAmount = params.paymentAmount;
      }
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    }
  });
}
function useApplyToWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.workOrderId);
      if (!order) throw new Error("Work order not found");
      order.applicationStatus = "pending";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    }
  });
}
function useSubmitWorkerRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.orderId);
      if (!order) throw new Error("Work order not found");
      order.workerRating = { rating: params.rating, comment: params.comment };
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
    }
  });
}
function useIsSubscribedToJobAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isSubscribedToJobAlerts"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isSubscribedToJobAlerts();
    },
    enabled: !!actor && !isFetching
  });
}
function useSubscribeToJobAlerts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.subscribeToJobAlerts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isSubscribedToJobAlerts"] });
    }
  });
}
function usePendingWorkOrders() {
  return useQuery({
    queryKey: ["pendingWorkOrders"],
    queryFn: async () => {
      workOrderStore = loadWorkOrders();
      return workOrderStore.filter((wo) => wo.verificationStatus === "pending");
    }
  });
}
function usePendingElectricians() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pendingElectricians"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingElectricians();
    },
    enabled: !!actor && !isFetching
  });
}
function usePendingJobApplications() {
  return useQuery({
    queryKey: ["pendingJobApplications"],
    queryFn: async () => {
      workOrderStore = loadWorkOrders();
      return workOrderStore.filter((wo) => wo.applicationStatus === "pending");
    }
  });
}
function usePendingPayments() {
  return useQuery({
    queryKey: ["pendingPayments"],
    queryFn: async () => {
      workOrderStore = loadWorkOrders();
      return workOrderStore.filter(
        (wo) => wo.paymentStatus.__kind__ === "pending"
      );
    }
  });
}
function useApproveWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.verificationStatus = "approved";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingWorkOrders"] });
    }
  });
}
function useRejectWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.verificationStatus = `rejected:${params.reason}`;
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingWorkOrders"] });
    }
  });
}
function useApproveElectrician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      return params.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingElectricians"] });
    }
  });
}
function useRejectElectrician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      return params.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingElectricians"] });
    }
  });
}
function useRejectJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.applicationStatus = "declined";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobApplications"] });
    }
  });
}
function useApprovePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.paymentStatus = { __kind__: "confirmed" };
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    }
  });
}
function useFlagPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.paymentStatus = { __kind__: "flagged", flagged: params.reason };
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    }
  });
}
function useAssignElectricianToWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not available");
      await actor.assignElectricianToWorkOrder(
        BigInt(params.workOrderId),
        params.electricianId
      );
      const order = workOrderStore.find((wo) => wo.id === params.workOrderId);
      if (order) {
        order.issuedElectrician = Number(params.electricianId);
        order.status = "inProgress";
        order.applicationStatus = "accepted";
      }
      saveWorkOrders(workOrderStore);
      return params;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobApplications"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
    }
  });
}
const JOB_APP_KEY = "tt_job_applications";
const JOB_APP_ID_KEY = "tt_job_app_next_id";
function loadJobApps() {
  try {
    const raw = localStorage.getItem(JOB_APP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveJobApps(apps) {
  try {
    localStorage.setItem(JOB_APP_KEY, JSON.stringify(apps));
  } catch {
  }
}
function loadJobAppNextId() {
  try {
    const raw = localStorage.getItem(JOB_APP_ID_KEY);
    return raw ? Number.parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}
function saveJobAppNextId(id) {
  try {
    localStorage.setItem(JOB_APP_ID_KEY, String(id));
  } catch {
  }
}
let jobAppNextId = loadJobAppNextId();
function useSubmitJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const apps = loadJobApps();
      const newApp = {
        ...params,
        id: jobAppNextId++,
        status: "pending",
        submittedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      apps.push(newApp);
      saveJobApps(apps);
      saveJobAppNextId(jobAppNextId);
      return newApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobAppsFull"] });
      queryClient.invalidateQueries({ queryKey: ["activeEmployees"] });
    }
  });
}
function usePendingJobApplicationsFull() {
  return useQuery({
    queryKey: ["pendingJobAppsFull"],
    queryFn: async () => loadJobApps().filter((a) => a.status === "pending")
  });
}
function useActiveEmployees() {
  return useQuery({
    queryKey: ["activeEmployees"],
    queryFn: async () => loadJobApps().filter((a) => a.status === "approved")
  });
}
function useApproveJobApplicationFull() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const apps = loadJobApps();
      const app = apps.find((a) => a.id === id);
      if (!app) throw new Error("Application not found");
      const dob = new Date(app.dob);
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || m === 0 && today.getDate() < dob.getDate()) age--;
      if (age < 19)
        throw new Error(
          "Applicant must be at least 19 years old to be approved"
        );
      app.status = "approved";
      saveJobApps(apps);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobAppsFull"] });
      queryClient.invalidateQueries({ queryKey: ["activeEmployees"] });
    }
  });
}
function useRejectJobApplicationFull() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const apps = loadJobApps();
      const app = apps.find((a) => a.id === params.id);
      if (!app) throw new Error("Application not found");
      app.status = "rejected";
      app.rejectionReason = params.reason;
      saveJobApps(apps);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobAppsFull"] });
      queryClient.invalidateQueries({ queryKey: ["activeEmployees"] });
    }
  });
}
const CASH_TRANSFER_KEY = "tt_cash_transfers";
const CASH_TRANSFER_ID_KEY = "tt_cash_transfer_next_id";
function loadCashTransfers() {
  try {
    const raw = localStorage.getItem(CASH_TRANSFER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCashTransfers(transfers) {
  try {
    localStorage.setItem(CASH_TRANSFER_KEY, JSON.stringify(transfers));
  } catch {
  }
}
function loadCashTransferNextId() {
  try {
    const raw = localStorage.getItem(CASH_TRANSFER_ID_KEY);
    return raw ? Number.parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}
function saveCashTransferNextId(id) {
  try {
    localStorage.setItem(CASH_TRANSFER_ID_KEY, String(id));
  } catch {
  }
}
let cashTransferNextId = loadCashTransferNextId();
function useGetCashTransfers() {
  return useQuery({
    queryKey: ["cashTransfers"],
    queryFn: async () => loadCashTransfers()
  });
}
function useAddCashTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const transfers = loadCashTransfers();
      const newTransfer = { ...params, id: cashTransferNextId++ };
      transfers.push(newTransfer);
      saveCashTransfers(transfers);
      saveCashTransferNextId(cashTransferNextId);
      return newTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashTransfers"] });
    }
  });
}
export {
  useRejectWorkOrder as A,
  useApproveElectrician as B,
  Card as C,
  useRejectElectrician as D,
  useRejectJobApplication as E,
  usePendingJobApplicationsFull as F,
  useApproveJobApplicationFull as G,
  useRejectJobApplicationFull as H,
  useApprovePayment as I,
  useFlagPayment as J,
  useActiveEmployees as K,
  CardContent as a,
  CardHeader as b,
  CardTitle as c,
  CardDescription as d,
  useGetAllWorkOrders as e,
  useIsSubscribedToJobAlerts as f,
  useApplyToWorkOrder as g,
  useSubmitJobApplication as h,
  useSubscribeToJobAlerts as i,
  useGetCurrentUserWorkOrders as j,
  useSubmitWorkerRating as k,
  useGetAllElectricians as l,
  useUpdateWorkOrderStatus as m,
  useAssignElectricianToWorkOrder as n,
  useAddElectrician as o,
  useUpdateElectrician as p,
  useRemoveElectrician as q,
  useUpdateWorkOrderPayment as r,
  useGetCashTransfers as s,
  useAddCashTransfer as t,
  useCreateFixedPriceWorkOrder as u,
  usePendingWorkOrders as v,
  usePendingElectricians as w,
  usePendingJobApplications as x,
  usePendingPayments as y,
  useApproveWorkOrder as z
};
