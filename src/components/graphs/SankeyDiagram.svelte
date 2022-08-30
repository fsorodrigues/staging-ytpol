<script lang='ts'>
    // node_modules
    import { LayerCake, Svg, Html } from 'layercake';

    // import types
    import type Node from '../../types/Node'
    import type Link from '../../types/Link'

    // import components
    import Sankey from './atoms/Sankey.svelte';
    import Tooltip from './tooltips/Tooltip.svelte'
    import SankeyLabels from './atoms/SankeyLabels.svelte'
    import Caption from './atoms/Caption.svelte';

    // import utils
    import colorMap from '../../utils/colors';
    import labelMap from '../../utils/labels';
    import { formatPct } from '../../utils/format-numbers'

    // props declaration
    export let nodes : Node[]
    export let links : Link[]
    export let url : string;
    export let formatter : Function = formatPct(0)
    export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';
    export let includeCaption : boolean = true;
    export let spanCol : number = 12;
    export let sourceLabel : string = 'Source';
    export let targetLabel : string = 'Target';
    export let title : string;

    // variable declaration
	let evt;
	let hideTooltip : boolean|CustomEvent<any> = true;
    
</script>

{#if title}<h3 class="chart-title {spanCol === 12 ? 'title-split-cols' : 'title-single-cols'}">{title}</h3>{/if}
<div 
    class={`chart-wrapper ${spanCol === 12 ? 'split-cols' : 'single-cols'}`} 
    style={`--spanCol: ${spanCol}`}
>
    <div class="chart sankey-diagram">
        <LayerCake
            data={{ nodes, links }}
            padding={{
                top: 30,
                bottom: 30,
                left: 5,
                right: 5,
            }}
            position={'relative'}
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
                <SankeyLabels source={ sourceLabel } target={ targetLabel } />
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
    {#if includeCaption}
        <Caption { caption } { url} type={spanCol === 12 ? 'split-cols' : 'single-cols'}/>
    {/if}
</div>

<style lang='scss'>
    .title-split-cols {
        grid-column: 1 / span 12;
        grid-row: 1 / span 1;
    }

    .title-single-cols {
        grid-column: 1 / span 12;
        grid-row: 3 / span 1;
        margin-top: 25px;

        @media (min-width: $bp-3) {
            grid-column: 7 / span 6;
            grid-row: 1 / span 1;
            margin-top: 0;
        }
    }

    .chart-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;
        column-gap: 10px;
        grid-row: 2 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-column: span var(--spanCol);
            grid-row: 2 / span 1;
        }
    }

    .cluster-label {
        color: var(--color);
        font-weight: 700;
    }

    .split-cols {
        grid-template-columns: 1fr;

        @media (min-width: $bp-3) {
            grid-template-columns: 10fr 2fr;
        }
    }

    .single-cols {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        grid-row: 4 / span 1;

        @media (min-width: $bp-3) {
            grid-row: 2 / span 1; 
        }
    }
</style>