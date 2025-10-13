export function resolvePromise(prms, promiseState) {
    promiseState.promise = prms;
    promiseState.data = null;
    promiseState.error = null;

    function promiseDataACB(result) {
        promiseState.promise === prms && (promiseState.data = result);
    }
    

    function catchErrorACB(result) {
        promiseState.promise === prms && (promiseState.error = result);
    }
    
    if (prms != null) {
        prms.then(promiseDataACB).catch(catchErrorACB);
    }
}