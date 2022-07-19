import { format } from 'd3-format'

const formatPct = (n) => {
    return format(`.${n}%`)
}

export { formatPct }