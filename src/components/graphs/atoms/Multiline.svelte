<script lang='ts'>
  import { getContext } from 'svelte';
  import { line, curveBasis } from 'd3-shape';

  const { data, xGet, yGet, zGet } = getContext('LayerCake');

  // prop declaration
  export let activeChart : string;  
  
  // // variable declaration
  // const stroke : string = '#ab00d6';

  $: path = line()
    .x(d => $xGet(d))
    .y(d => $yGet(d))
    .curve(curveBasis)

</script>

<g class={`line-group line-group-${activeChart}`}>
  {#each $data as group, i}
    <path
      class={`path-line path-${group[0]}`}
      d={ path(group[1]) }
      stroke={ $zGet(group[1][0]) }
    ></path>
  {/each}
</g>
  

<style>
  .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-width: 2;
  }
</style>

<!-- $: path = values => {
  return 'M' + values
    .map(d => {
      return $xGet(d) + ',' + $yGet(d);
    })
    .join('L');
}; -->