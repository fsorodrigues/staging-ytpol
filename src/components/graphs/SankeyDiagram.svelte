<script lang='ts'>
    import { LayerCake, Svg, Html } from 'layercake';

    // import types
    import type Node from '../../types/Node'
    import type Link from '../../types/Link'

    // import components
    import Sankey from './atoms/Sankey.svelte';
    import Tooltip from './tooltips/Tooltip.svelte'

    // import utils
    import colorMap from '../../utils/colors';
    import labelMap from '../../utils/labels';
    import { formatPct } from '../../utils/format-numbers'

    // props declaration
    export let nodes : Node[]
    export let links : Link[]
    export let formatter : Function = formatPct(0)

    // variable declaration
	let evt;
	let hideTooltip : boolean|CustomEvent<any> = true;
    
</script>

<div class='chart-wrapper'>
    <div class="chart sankey-diagram">
        <LayerCake
            data={{ nodes, links }}
        >
            <Svg>
                <defs>
                    <linearGradient id="gradient" gradientTransform="rotate(90)">
                        <stop offset="0" stop-color="var(--color-source)" />
                        <stop offset="100%" stop-color="var(--color-target)" />
                    </linearGradient>
                </defs>
                <Sankey
                    colorNodes={d => colorMap.get(d)}
                    labelNodes={d => labelMap.get(d)}
                    colorLinks={d => colorMap.get(d)}
                    on:mousemove={event => evt = hideTooltip = event}
                    on:mouseout={() => hideTooltip = true}
                />
            </Svg>
            <Html
                pointerEvents={false}
            >
                {#if hideTooltip !== true}
                    <Tooltip
                        {evt}
                        offset={-10}
                        let:detail
                    >
                        {@const tooltipData = { ...detail.props }}
                        <div>
                            <span 
                                class='cluster-label' 
                                style="--color: {colorMap.get(tooltipData.sourceName)}"
                            >
                                {labelMap.get(tooltipData.sourceName)}
                            </span> ➞
                            <span
                                class='cluster-label'
                                style="--color: {colorMap.get(tooltipData.targetName)}"
                            >
                                {labelMap.get(tooltipData.targetName)}
                            </span>
                        </div>
                        {#each ['value'] as key}
                            {@const value = tooltipData[key]}
                            <div class="row">{formatter(value)}</div>
                        {/each}
                    </Tooltip>
                {/if}
            </Html>
        </LayerCake>
  </div>
</div>

<style lang='scss'>
    .chart-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        column-gap: 10px;
        grid-row: 4 / span 1;
        grid-column: span 6;
    }

    .cluster-label {
        color: var(--color);
        font-weight: 700;
    }
</style>