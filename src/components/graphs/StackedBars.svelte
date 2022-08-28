<script lang="ts">
	// node_modules
	import { LayerCake, Svg, Html, flatten } from 'layercake';
	// import { group } from 'd3-array';
	import { scaleBand, scaleOrdinal } from 'd3-scale'
	import { stack } from 'd3-shape'

	// // types
	// import type Row from '../../types/TimeSeriesRow';

	// // components & molecules & atoms
	import BarStacked from './atoms/BarStacked.svelte';
	import AxisY from './atoms/AxisY.svelte';
	import AxisX from './atoms/AxisX.svelte';
	import Tooltip from './tooltips/Tooltip.svelte';
	import Caption from './atoms/Caption.svelte';

	// // import utils
	import colorMap from '../../utils/colors';
	import labelMap from '../../utils/labels';
	import enforceOrder, { prefOrder } from '../../utils/order';
	import { formatPct } from '../../utils/format-numbers';

	// // props declaration
	export let data : any[]|any;
	export let url : string;
	export let yKey : string;
	export let xKey : number[];
	export let zKey : string;
	export let formatter : Function = formatPct(0)
	export let clusterLabelMap : Map<string,string> = labelMap
	export let keyLabelMap : Map<string,string> = labelMap
	export let clusterColorMap : Map<string,string> = colorMap
	export let keyColorMap : Map<string,string> = colorMap
	export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';;
	export let includeCaption : boolean = true;
	export let spanCol : number = 12;
	export let row : number = 4;
	export let customClass : string = 'chart-large';
	export let tooltipType : string = 'arrow';
	export let title : string;

	// // variable declaration
	const columns = data.columns.filter(d => d !== yKey);
	const stacker = stack()
		.keys(columns)
	const stackedData = stacker(data)
	
	let yDomain : any[] = enforceOrder(data.map(d => d[yKey]), prefOrder)
	let zRange : any[] = Array.from(keyColorMap).filter(d => columns.includes(d[0])).map(d => d[1])

	// variable declaration
	let evt;
	let hideTooltip : boolean|CustomEvent<any> = true;
</script>

{#if title}<h3 class="chart-title">{title}</h3>{/if}
<div class='legend-container' style={`--row: ${row-1}`}>
	{#each data.columns.filter(d => d !== 'cluster') as group, i}
		<div class='legend-group'>
			<span class='legend-label' style={`--color: ${keyColorMap.get(group)}`}>{keyLabelMap.get(group)}</span>
		</div>
	{/each}
</div>
<div 
	class={`chart-wrapper ${spanCol === 12 ? 'split-cols' : 'single-cols'}`} 
	style={`--spanCol: ${spanCol}; --row: ${row}`}
>
	<div class={`chart stacked-bar-chart ${customClass}`}>
		<LayerCake
			padding={{ top: 0, right: 0, bottom: 15, left: 55 }}
			flatData={ flatten(stackedData) }
			data={ stackedData }
			x={ xKey }
			y={ d => d.data[yKey] }
			yScale={ scaleBand().paddingInner([0.35]).paddingOuter([0.01]).round(true) }
			{ yDomain }
			z={ zKey }
			zScale={ scaleOrdinal() }
			zDomain={ yDomain }
			zRange={ zRange }
		>
			<Svg>
				<AxisX
					gridlines={false}
					ticks={3}
					snapTicks={true}
					tickMarks={true}
					formatTick={formatter}
				/>
				<AxisY gridlines={ false } formatTick={ d => clusterLabelMap.get(d) } />
				<BarStacked 
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
						{#if tooltipType === 'arrow'}
							{@const tooltipData = { ...detail.props }}
							<div>
								<span
									class='cluster-label'
									style="--color: {keyColorMap.get(tooltipData.key)}"
								>
									{keyLabelMap.get(tooltipData.key)}
								</span> ➞
								<span 
									class='cluster-label' 
									style="--color: {clusterColorMap.get(tooltipData.cluster)}"
								>
									{clusterLabelMap.get(tooltipData.cluster)}
								</span>
							</div>
							{#each ['value'] as key}
								{@const value = tooltipData[tooltipData.key]}
								<div class="row">{formatter(value)}</div>
							{/each}

							{:else}
								{@const tooltipData = { ...detail.props }}
								<div>
									<p>Community: <span 
										class='cluster-label' 
										style="--color: {clusterColorMap.get(tooltipData.cluster)}"
									>
										{clusterLabelMap.get(tooltipData.cluster)}
									</span></p>
									<p>Content: <span
										class='cluster-label'
										style="--color: {keyColorMap.get(tooltipData.key)}"
									>
										{keyLabelMap.get(tooltipData.key)}
									</span></p>
									
								</div>
								{#each ['value'] as key}
									{@const value = tooltipData[tooltipData.key]}
									<div class="row">Share: {formatter(value)}</div>
								{/each}
						{/if}
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
	.chart-title {
		grid-column: 1 / span 12;
	}

	.chart-wrapper {
        display: grid;
        grid-template-columns: 1fr;
		row-gap: 10px;
        column-gap: 10px;
		grid-row: var(--row) / span 1;
        grid-column: 1 / span 12;

        @media (min-width: $bp-3) {
			grid-column: 7 / span var(--spanCol);
			grid-row: 4 / span 1;
        }
    }

	.legend-container {
        grid-row: var(--row) / span 1;
        grid-column: span 12;
        display: flex;
        justify-content: start;
        gap: 2.5px;
		margin: 35px 0 15px 0;

        @media (min-width: $bp-3) {
			grid-row: 3 / span 1;
            grid-column: span 6;
			margin: 15px 0;
        }

        .legend-group {
            display: flex;
            align-items: baseline;

            .legend-label {
                background-color: var(--color);
                color: white;
                padding: 2.5px 5px;
                border-radius: 3px;
                font-weight: 700;
				text-align: center;
				@include fs-sm;
            }
        }
    }

	.cluster-label {
        color: var(--color);
        font-weight: 700;
	}

	.split-cols {
        grid-template-columns: 1fr;
		grid-row: var(--row) / span 1;
        grid-column: 1 / span 12;

        @media (min-width: $bp-3) {
            grid-template-columns: 10fr 2fr;
			grid-column: 1 / span var(--spanCol);
			grid-row: 4 / span 1;
        }
    }

    .single-cols {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }
</style>
