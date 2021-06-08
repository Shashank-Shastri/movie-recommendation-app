function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

export function shuffle(array) {
    const length = array == null ? 0 : array.length;
    if (!length) {
        return [];
    }
    let index = -1;
    const lastIndex = length - 1;
    const result = JSON.parse(JSON.stringify(array));
    while (++index < length) {
        const rand =
            index + Math.floor(Math.random() * (lastIndex - index + 1));
        const value = result[rand];
        result[rand] = result[index];
        result[index] = value;
    }
    return result;
}

export function asyncDebounce(func, wait) {
    const debounced = debounce((resolve, reject, args) => {
        func(...args)
            .then(resolve)
            .catch(reject);
    }, wait);
    return (...args) =>
        new Promise((resolve, reject) => {
            debounced(resolve, reject, args);
        });
}
