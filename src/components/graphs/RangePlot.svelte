<script lang="ts">
	// node_modules
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal, scaleBand } from 'd3-scale'
	import { timeFormat } from 'd3-time-format'

	// types
	import type Row from '../../types/TimeSeriesRow';

	// components & molecules & atoms
	// import Line from './atoms/Line.svelte';
	// import Multiline from './atoms/Multiline.svelte';
	import AxisX from './atoms/AxisX.svelte';
	import AxisY from './atoms/AxisY.svelte';
    import Range from './atoms/Range.svelte';
    import Tooltip from './tooltips/Tooltip.svelte';
    import Caption from './atoms/Caption.svelte';
    import RangeLabels from './atoms/RangeLabels.svelte';

	// import utils
	import colorMap from '../../utils/colors';
    import labelMap from '../../utils/labels';
    import { formatPct } from '../../utils/format-numbers'

	// // props declaration
    export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';
    export let includeCaption : boolean = true;
	export let data : any[];
	export let groupedData : any[];
    export let url : string;
	export let xKey : string;
	export let yKey : string;
	export let zKey : string;
    export let formatter : Function = formatPct(0)
    export let title : string;

	// variable declaration
	let seriesNames = Array.from(groupedData).map(d => d[0])
	let seriesColors = seriesNames.map(d => colorMap.get(d))
	let evt;
	let hideTooltip : boolean|CustomEvent<any> = true;
</script>

{#if title}<h3 class="chart-title">{title}</h3>{/if}
<div class='chart-wrapper'>
    <div class="chart range-plot">
        <LayerCake
            padding={{ top: 0, right: 10, bottom: 50, left: 55 }}
            flatData = { data }
            data = { Array.from(groupedData) }
            x={ xKey }
            xNice={ true }
            y={ yKey }
            yScale={ scaleBand() }
            yDomain={ seriesNames }
            z={ zKey }
            zScale={ scaleOrdinal() }
            zDomain={ seriesNames }
            zRange={ seriesColors }
            custom={ groupedData }
        >
            <Svg>
                <AxisX
                    gridlines={false}
                    ticks={6}
                    snapTicks={false}
                    tickMarks={true}
                />
                <AxisY gridlines={ false } formatTick={ d => labelMap.get(d) } />
                <Range 
                    on:mousemove={event =>evt = hideTooltip = event}
                    on:mouseout={() => hideTooltip = true}
                />
            </Svg>

            <Html
                pointerEvents={false}
            >
                {#if hideTooltip !== true}
                    <Tooltip
                        {evt}
                        let:detail
                        offset={-15}
                    >
                        {@const tooltipData = { ...detail.props }}
                        <div>
                            <span 
                                class='cluster-label' 
                                style="--color: {colorMap.get(tooltipData.cluster)}"
                            >
                                {labelMap.get(tooltipData.cluster)}
                            </span>
                        </div>
                        <div class="row">Burst length: {tooltipData.scenario} videos</div>
                        {#each ['mean'] as key}
                            {@const value = tooltipData[key]}
                            <div class="row">Difference in consumption: {formatter(value)} minutes</div>
                        {/each}
                    </Tooltip>
                {/if}
                <RangeLabels />
            </Html>
        </LayerCake>
    </div>
    {#if includeCaption}
        <Caption { caption } { url} type={'split-cols'}/>
    {/if}
</div>

<style lang='scss'>
    .chart-title {
        grid-column: 1 / span 12;
        grid-row: 1 / span 1;

        @media (min-width: $bp-3) {
            grid-column: 1 / span 12;
        }
    }

	.chart-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;
        column-gap: 10px;
        grid-column: span 12;
        grid-row: 2 / span 1;
        
        @media (min-width: $bp-3) {
            grid-column: span 12;
            grid-template-columns: 10fr 2fr;
        }
    }

    .cluster-label {
        color: var(--color);
        font-weight: 700;
    }

</style>
