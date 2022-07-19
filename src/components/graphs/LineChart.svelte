<script lang="ts">
	// node_modules
	import { Html, LayerCake, Svg } from 'layercake';
	import { scaleOrdinal, scaleTime, scaleLinear } from 'd3-scale'

	// types
	import type Row from '../../types/TimeSeriesRow';

	// components & molecules & atoms
	// import Line from './atoms/Line.svelte';
	import Multiline from './atoms/Multiline.svelte';
	import AxisX from './atoms/AxisX.svelte';
	import AxisY from './atoms/AxisY.svelte';
	import SharedTooltip from './tooltips/SharedTooltip.svelte';

	// import utils
	import colorMap from '../../utils/colors';
	import labelMap from '../../utils/labels';

	// // props declaration
    export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';
	export let activeChart : string;
	export let data : Row[];
	export let groupedData : [];
	export let xKey : string;
	export let yKey : string;
	export let zKey : string;
	export let yDomain : number[] = [0, null];
	export let formatTickX : Function;
	export let formatTickY : Function = (d : number) => d.toFixed(0);
	export let includeCaption : boolean = true;

	// variable declaration
	let seriesNames = Array.from(colorMap).map(d => d[0])
	let seriesColors = Array.from(colorMap).map(d => d[1])

</script>

<div class="chart line-chart">
	<LayerCake
		padding={{ top: 20, right: 10, bottom: 20, left: 45 }}
		flatData = { data }
		data = { groupedData }
		x={ xKey }
		xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }
		y={ yKey }
		{ yDomain }
		yNice={ true }
		z={ zKey }
		zScale={ scaleOrdinal() }
		zDomain={ seriesNames }
		zRange={ seriesColors }
	>
		<Svg>
			<AxisX
				gridlines={false}
				ticks={3}
				formatTick={formatTickX}
				snapTicks={true}
				tickMarks={false}
			/>
			<AxisY
				ticks={4}
				formatTick={formatTickY}
			/>
			<Multiline activeChart={activeChart}/>
		</Svg>

		<Html>
			<SharedTooltip
				dataset={data}
				formatTitle={formatTickX}
				formatKey={(d) => labelMap.get(d)}
				formatValue={formatTickY}
			/>
		</Html>
	</LayerCake>
</div>
{#if includeCaption}
	<div class="caption">{ caption }</div>
{/if}
