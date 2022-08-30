<script lang='ts'>
  // node_modules
  import { getContext, createEventDispatcher } from 'svelte';

  // getting context values
  const { data, width, height } = getContext('LayerCake');

  // components
  import HeatMapRow from './HeatMapRow.svelte';

  // utils
  import enforceOrder, { prefOrder } from '../../../utils/order'

  // maps
  import labelMap from '../../../utils/labels';

  const dispatch = createEventDispatcher();

  function handleMouseOver(e) {
    dispatch('mousemove', e.detail)
  }

  function handleMouseOut() {
    dispatch('mouseout')
  }
</script>

<div class='heat-map-wrapper'>
  <div class='heat-map-header'>
    {#each Object.keys($data[0]) as header, i}
      <div class='header-value'>{labelMap.has(header) ? labelMap.get(header) : header}</div>
    {/each}
  </div>
  {#each enforceOrder($data, prefOrder, 'from') as row, i}
    <HeatMapRow data={ row } 
      on:mousemove={(event) => handleMouseOver(event)}
      on:mouseout={() => handleMouseOut()}
    />
  {/each}
</div>

<style lang='scss'>
  .heat-map-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    // gap: 2px;
  }

  .heat-map-header {
    display: flex;
    margin: 25px 0 10px 0;
    gap: 2px;
  }

  .header-value {
    flex-grow: 1;
    flex-shrink: 0;
    text-align: center;
    @include fs-xs;
    font-weight: 300;
    color: $dark-grey;
  }

  .header-value:first-of-type {
    width: 65px;
    flex-grow: 0;
    text-align: left;
    visibility: hidden;
  }
</style>