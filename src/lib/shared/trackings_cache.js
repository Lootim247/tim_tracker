const store = {
  data: [],
  MAX_SIZE: 10,
  listeners: new Set(),
};

export const tracking_LRUCache = {
    // returns key and places value in MRU
    get(key) {
        const valueIndex = store.data.findIndex(x => {return x.key === key})
        if (valueIndex != -1) {
            const saved = store.data[valueIndex]
            store.data.splice(valueIndex, 1);
            store.data.push(saved);
            return saved.value
        }
        return null;
    },
    
    // set a value, place it in the top spot
    set(key, value) {
        if (store.data.length == store.MAX_SIZE) {
            store.data.shift()
        }
        store.data.push({"key": key, "value": value})
        notify()
    },

    subscribe(fn) {
        store.listeners.add(fn)
        return () => store.listeners.delete(fn)
    },
};


function notify() {
  for (const fn of store.listeners) fn();
}