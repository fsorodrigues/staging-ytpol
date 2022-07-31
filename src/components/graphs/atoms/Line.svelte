<script lang='ts'>
import { getContext } from 'svelte';
import { line, curveBasis } from 'd3-shape';

const { data, xGet, yGet } = getContext('LayerCake');

export let stroke : string = '#ab00d6';

$: path = line()
    .x(d => $xGet(d))
    .y(d => $yGet(d))
    .curve(curveBasis)
</script>

<path class='path-line' d={path($data)} { stroke }></path>

<style>
    .path-line {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 2;
    }
</style>