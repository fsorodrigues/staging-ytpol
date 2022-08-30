<script lang='ts'>
  import { scaleLinear } from 'd3-scale';

  export let scale : Function;

  const rescaler = scaleLinear()
    .domain([0.4, 3])
    .range([0, 100]);

</script>

<div class='legend-container'>
  <span class='legend-label'>Lower risk</span>
  <svg class='legend-gradient'>
    <defs>
      <linearGradient id="colorGradient" >
        {#each [0.4, 1, 3] as d}
          <stop offset={`${rescaler(d)}%`} stop-color={scale(d)}></stop>
        {/each}
      </linearGradient>
    </defs>
    <rect class='legend-rect' x=0 y=0 width=100 height=30 fill="url('#colorGradient')"></rect>
  </svg>
  <span class='legend-label'>Higher risk</span>
</div>

<style lang='scss'>
  .legend-container{
    display: flex;
    flex-grow: 0;
    align-items: center;
    gap: 5px;
  }

  .legend-gradient {
    height: 15px;
    width: 100px;
    flex-grow: 0;
    flex-shrink: 1;
  }

  .legend-label {
    flex-grow: 1;
    flex-shrink: 0;
    @include fs-xs;
    text-transform: uppercase;
    font-weight: 300;
    color: $dark-grey;
  }
</style>