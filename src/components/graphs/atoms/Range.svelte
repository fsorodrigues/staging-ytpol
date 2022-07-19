<script lang='ts'>
    // node_modules
    import { getContext, createEventDispatcher } from 'svelte'
    import { scalePow } from 'd3-scale'
    import { extent } from 'd3-array'
    // utils
    // import enforceOrder, { prefOrder } from '../../../utils/order';

    // context
    const { data, xGet, yGet, zGet, xScale, x, yScale } = getContext('LayerCake');

    const r = scalePow()
        .exponent(1/2)
        .domain([2, 4])
        .range([4, 7])

    const dispatch = createEventDispatcher();

    function handleMouseOver(e, d) {
        dispatch('mousemove', { e, props: d })
        document.querySelectorAll('.range-circle')
            .forEach(el => {
                if (el !== e.target) el.classList.add('inactive')
                else el.classList.add('active')
            })
    }

    function handleMouseOut(e) {
        dispatch('mouseout')
        document.querySelectorAll('.range-circle')
            .forEach(el => el.classList.remove('inactive'))
        e.target.classList.remove('active')
    }
</script>

<g class={`vis-group`}>
    {#each $data as group, i}
        {@const extentLine = extent(group[1], $x).map($xScale)}
        <g class={`range-group range-group-${group[0]}`} transform={`translate(0, ${$yScale.bandwidth() / 2})`}>
            <line x1={extentLine[0]} x2={extentLine[1]} y1={$yGet(group[1][0])} y2={$yGet(group[1][0])} stroke='gainsboro' stroke-width={r(2)*2}></line>
            {#each group[1] as d, l}
                <circle 
                    class='range-circle'
                    cx={$xGet(d)} 
                    cy={$yGet(d)} 
                    r={r(d.scenario)} 
                    fill={$zGet(d)}
                    on:mouseover={(e) => handleMouseOver(e, d)}
                    on:focus={(e) => handleMouseOver(e, d)}
                    on:mouseout={(e) => handleMouseOut(e)}
                    on:blur={(e) => handleMouseOut(e)}
                ></circle>
            {/each}
        </g>
    {/each}
  </g>

  <style>
    .range-circle {
        opacity: 0.75;
        transition: opacity 0.25s;
    }
  </style>