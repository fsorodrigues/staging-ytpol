function comparator(val : string, scaler: Function) {
    return function(a, b) { return scaler(a[val]) - scaler(b[val]) }
}

export default comparator;
  