<script lang='ts'>
  // node_modules
  import { getContext } from 'svelte';

  const { xScale, height } = getContext('LayerCake');

  export let data : any[];
</script>

{#each data as d, i}
  {@const [text, date] = d.split(' | ')}
  <g transform={`translate(${$xScale(new Date(date))}, 0)`}>
    <line x1=0 x2=0 y1=0 y2={$height}></line>
    <text>{text}</text>
  </g>
{/each}

<style lang='scss'>
  line {
    stroke: $mid-grey;
    stroke-width: 1pt; 
    stroke-dasharray: 1pt;
    stroke-dashoffset: 2pt;
  }

  text {
    transform: translate(12px, 0) rotate(-90deg);
    text-anchor: end;
    @include fs-xxs;
    font-weight: 300;
    text-transform: uppercase;
  }
</style>