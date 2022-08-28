<script lang="ts">
	// node_modules
	import { Html, LayerCake, Svg } from 'layercake';
	import { scaleOrdinal, scaleTime, scaleLinear } from 'd3-scale'

	// types
	import type Row from '../../types/TimeSeriesRow';

	// components & molecules & atoms
	import Multiline from './atoms/Multiline.svelte';
	import AxisX from './atoms/AxisX.svelte';
	import AxisY from './atoms/AxisY.svelte';
	import SharedTooltip from './tooltips/SharedTooltip.svelte';
	import Caption from './atoms/Caption.svelte';
	import Markers from './atoms/Markers.svelte';

	// import utils
	import colorMap from '../../utils/colors';
	import labelMap from '../../utils/labels';

	// props declaration
	export let caption : string;
	export let activeChart : string;
	export let data : Row[];
	export let url : string;
	export let groupedData : [];
	export let xKey : string;
	export let yKey : string;
	export let zKey : string;
	export let yDomain : number[] = [0, null];
	export let formatTickX : Function;
	export let xTicks : number|Array<number>|Function = 6;
	export let formatTickY : Function = (d : number) => d.toFixed(0);
	export let includeCaption : boolean = true;
	export let spanCol : number
	export let markers : string[]

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
				ticks={xTicks}
				formatTick={formatTickX}
				snapTicks={false}
				tickMarks={true}
				/>
			<AxisY
				ticks={4}
				formatTick={formatTickY}
			/>
			<Markers data={ markers } />
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
	<Caption { caption } { url } type={spanCol === 12 ? 'split-cols' : 'single-cols'} />
{/if}
