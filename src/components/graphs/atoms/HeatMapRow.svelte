<script lang='ts'>
  // // node_modules
  import { getContext } from 'svelte';

  const { custom } = getContext('LayerCake');

  // types
  import type HeatMapRow from '../../../types/HeatMapRow'
  
  // maps
  import labelMap from '../../../utils/labels';

  export let data : HeatMapRow;
</script>

<div class='heat-map-row'>
  <span class='heat-map-row-name'>{labelMap.get(data.from)}</span>
  {#each Object.entries(data).filter(d => d[0] !== 'from') as d, i}
    <div class='heat-map-cell' style="--color: {$custom.scaleColor(d[1])}"></div>
  {/each}
</div>

<style lang="scss">
  .heat-map-row {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-grow: 1;
    flex-shrink: 0;
  }

  .heat-map-cell {
    height: 100%;
    flex-grow: 1;
    flex-shrink: 0;
    background-color: var(--color);
  }

  .heat-map-row-name {
    width: 65px;
    @include fs-xs;
    font-weight: 300;
    color: $dark-grey;
  }
</style>