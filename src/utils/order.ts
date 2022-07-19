function enforceOrder(arr : any[], order : string[], acc : string|number = null) {
    return order.reduce((p : any, c : any) => {
        // filter
        const filter = Number.isInteger(acc) || acc !== null ? arr.filter(d => d[acc] === c) : arr.filter(d => d === c)
        if (filter.length) filter.forEach(d => p.push(d))
        return p
    }, [])

}

const prefOrder = ['fL', 'L', 'C', 'AW', 'R', 'fR']

export default enforceOrder
export { prefOrder }