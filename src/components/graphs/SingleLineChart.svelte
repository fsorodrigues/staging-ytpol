<script lang="ts">
	// node_modules
	import { Html, LayerCake, Svg } from 'layercake';
	import { scaleTime, scaleLinear } from 'd3-scale'

	// types
	// import type Row from '../../types/TimeSeriesRow';

	// components & molecules & atoms
	import Line from './atoms/Line.svelte';
	import AxisX from './atoms/AxisX.svelte';
	import AxisY from './atoms/AxisY.svelte';
	import SingleLineTooltip from './tooltips/SingleLineTooltip.svelte';
	import Caption from './atoms/Caption.svelte';

	// import utils
	// import colorMap from '../../utils/colors';
	import labelMap from '../../utils/labels';
	import { formatThousandsComma } from '../../utils/format-numbers'


	// // props declaration
    export let caption: string;
	export let data : any[];
	export let url : string;
	export let xKey : string;
	export let yKey : string;
	export let yDomain : number[] = [0, null];
	export let formatTickX : Function;
	export let formatTickY : Function = (d : number) => d.toFixed(0);
	export let includeCaption : boolean = true;
	export let spanCol : number
	export let stroke : string

	// // variable declaration
	// let seriesNames = Array.from(colorMap).map(d => d[0])
	// let seriesColors = Array.from(colorMap).map(d => d[1])

</script>

<div 
	class={`chart-wrapper ${spanCol === 12 ? 'split-cols' : 'single-cols'}`} 
	style={`--spanCol: ${spanCol}`}
>
	<div class="chart line-chart">
		<LayerCake
			padding={{ top: 20, right: 10, bottom: 20, left: 45 }}
			{ data }
			x={ xKey }
			xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }
			y={ yKey }
			{ yDomain }
			yNice={ true }
		>
			<Svg>
				<AxisX
					gridlines={false}
					ticks={8}
					formatTick={formatTickX}
					snapTicks={false}
					tickMarks={false}
				/>
				<AxisY
					ticks={4}
					formatTick={formatTickY}
				/>
				<Line { stroke } />
			</Svg>
	
			<Html>
				<SingleLineTooltip
					dataset={data}
					formatTitle={formatTickX}
					formatKey={(d) => labelMap.get(d)}
					formatValue={formatThousandsComma}
				/>
			</Html>
		</LayerCake>
	</div>
	{#if includeCaption}
		<Caption { caption } { url } type={spanCol === 12 ? 'split-cols' : 'single-cols'} />
	{/if}
</div>

<style lang='scss'>
	.chart-wrapper {
        display: grid;
        grid-template-columns: 10fr 2fr;
        column-gap: 10px;
        row-gap: 10px;
        grid-row: 4 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-column: span var(--spanCol);
        }
    }

	.split-cols {
        grid-template-columns: 1fr;

        @media (min-width: $bp-3) {
            grid-template-columns: 10fr 2fr;
        }
    }

    .single-cols {
        grid-template-columns: 1fr;
    }
</style>
