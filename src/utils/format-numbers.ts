import { format } from 'd3-format'

const formatPct = (n) => {
    return format(`.${n}~%`)
}

const formatThousands = format(',.0s')

export { formatPct, formatThousands }