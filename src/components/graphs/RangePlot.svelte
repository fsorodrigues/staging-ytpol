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

	// import utils
	import colorMap from '../../utils/colors';
    import labelMap from '../../utils/labels';
    import { formatPct } from '../../utils/format-numbers'

	// // props declaration
    export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';
    export let includeCaption : boolean = true;
	// export let activeChart : string;
	export let data : any[];
	export let groupedData : any[];
    export let url : string;
	export let xKey : string;
	export let yKey : string;
	export let zKey : string;
    export let formatter : Function = formatPct(0)
	// export let formatTickX : Function = timeFormat('%b %Y');
	// export let formatTickY : Function = (d : number) => d.toFixed(0);

	// variable declaration
	let seriesNames = Array.from(groupedData).map(d => d[0])
	let seriesColors = seriesNames.map(d => colorMap.get(d))
        // variable declaration
	let evt;
	let hideTooltip : boolean|CustomEvent<any> = true;
</script>

<div class='chart-wrapper'>
    <div class="chart range-plot">
        <LayerCake
            padding={{ top: 0, right: 10, bottom: 20, left: 45 }}
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
        >
            <Svg>
                <AxisX
                    gridlines={false}
                    ticks={3}
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
                            <div class="row">Difference in consumption: {formatter(value)}</div>
                        {/each}
                    </Tooltip>
                {/if}
            </Html>
        </LayerCake>
    </div>
    {#if includeCaption}
        <Caption { caption } { url} type={'single-cols'}/>
    {/if}
</div>

<style lang='scss'>
	.chart-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;
        column-gap: 10px;
        grid-row: 4 / span 1;
        grid-column: span 6;
    }

    .cluster-label {
        color: var(--color);
        font-weight: 700;
    }
</style>
