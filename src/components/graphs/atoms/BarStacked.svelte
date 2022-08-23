<script>
    import { getContext, createEventDispatcher } from 'svelte';
  
    const { data, xGet, yGet, zGet, yScale, zScale } = getContext('LayerCake');

    $: columnWidth = d => {
        const xVals = $xGet(d);
        return xVals[1] - xVals[0];
    };


    const dispatch = createEventDispatcher();

    function handleMouseOver(e, d) {
        dispatch('mousemove', { e, props: d })
        document.querySelectorAll('.group-rect')
            .forEach(el => {
                if (el !== e.target) el.classList.add('inactive')
                else el.classList.add('active')
            })
    }

    function handleMouseOut(e) {
        dispatch('mouseout')
        document.querySelectorAll('.group-rect')
            .forEach(el => el.classList.remove('inactive'))
        e.target.classList.remove('active')
    }
</script>

<g class="bar-group">
    {#each $data as series}
        <g class={`series-group series-${series.key}`}>
            {#each series as d, i}
                <rect
                    class='group-rect'
                    data-id="{i}"
                    x="{$xGet(d)[0]}"
                    y="{$yGet(d)}"
                    height={$yScale.bandwidth()}
                    width="{columnWidth(d)}"
                    fill={$zGet(series)}
                    stroke='white'
                    on:mouseover={(e) => handleMouseOver(e, { key: series.key, ...d.data })}
                    on:focus={(e) => handleMouseOver(e, { key: series.key, ...d.data })}
                    on:mouseout={(e) => handleMouseOut(e)}
                    on:blur={(e) => handleMouseOut(e)}
                ></rect>
            {/each}
        </g>
    {/each}
</g>

<style lang=scss>
    .group-rect {
        opacity: 1;
        transition: opacity 0.25s;
    }
</style>