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

	// // import utils
	import colorMap from '../../utils/colors';
	import labelMap from '../../utils/labels';
	import enforceOrder, { prefOrder } from '../../utils/order';
	import { formatPct } from '../../utils/format-numbers';

	// // props declaration
    export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';
	export let data : any[];
	export let yKey : string;
	export let xKey : number[];
	export let zKey : string;
	export let formatter : Function = formatPct(0)
	export let clusterLabelMap : Map<string,string> = labelMap
	export let keyLabelMap : Map<string,string> = labelMap
	export let clusterColorMap : Map<string,string> = colorMap
	export let keyColorMap : Map<string,string> = colorMap
	// export let activeChart : string;
	// export let groupedData : [];
	// export let xKey : string;
	// export let zKey : string;
	// export let yDomain : number[] = [0, null];
	// export let formatTickX : Function = timeFormat('%b %Y');
	// export let formatTickY : Function = (d : number) => d.toFixed(0);

	// // variable declaration
	// let seriesNames = Array.from(colorMap).map(d => d[0])
	// let seriesColors = Array.from(colorMap).map(d => d[1])
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

<div class='chart-wrapper'>
	<div class="chart stacked-bar-chart">
		<LayerCake
			padding={{ top: 0, right: 0, bottom: 10, left: 45 }}
			flatData={ flatten(stackedData) }
			data={ stackedData }
			x={ xKey }
			y={ d => d.data[yKey] }
			yScale={ scaleBand().paddingInner([0.25]).paddingOuter([0.01]).round(true) }
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
						{@const tooltipData = { ...detail.props }}
						<div>
							<span 
								class='cluster-label' 
								style="--color: {clusterColorMap.get(tooltipData.cluster)}"
							>
								{clusterLabelMap.get(tooltipData.cluster)}
							</span> ➞
							<span
								class='cluster-label'
								style="--color: {keyColorMap.get(tooltipData.key)}"
							>
								{keyLabelMap.get(tooltipData.key)}
							</span>
						</div>
						{#each ['value'] as key}
							{@const value = tooltipData[tooltipData.key]}
							<div class="row">{formatter(value)}</div>
						{/each}
					</Tooltip>
				{/if}
			</Html>
		</LayerCake>
	</div>
	<!-- <div class="caption">{ caption }</div> -->
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
