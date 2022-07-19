<script lang="ts">
	// node_modules
	import { group } from 'd3-array'
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleLinear, scaleOrdinal } from 'd3-scale';
	// import { line } from 'd3-shape'

	// types
	import type Channel from '../../types/Channel';

	// components
	import Force from './Force.svelte';
	import Labels from './atoms/Labels.svelte';
	import Tooltip from './tooltips/Tooltip.svelte';

	// utils
	import colorMap from '../../utils/colors';


	// props declaration
    // export let caption: string = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?';
	export let data : Channel[];
	export let currentStep : number = 0;
	// x scale
	export let xKey : string = 'channel';
	export let xScale : Function = scaleLinear();
	export let xDomain : any[] = [null, null];
	// z scale
	export let zKey : string = 'cluster';
	export let zScale : Function = scaleOrdinal();
	export let zDomain : any[] = Array.from(new Set(data.map(d => d.cluster)))
	export let zRange : any[] = zDomain.map(d => colorMap.get(d));
	// r scale
	export let rKey : string = 'subscribers';
	export let rRange : number[] = [2, 25];

	// variable declaration
	let evt;
	let hideTooltip : boolean|CustomEvent<any> = true;

</script>

<div class="chart beeswarm-chart">
	<LayerCake
		x={ xKey }
		{ xScale }
		{ xDomain }
		z={ zKey }
		{ zScale }
		{ zDomain }
		{ zRange }
		r={ rKey }
		{ rRange }
		{ data }
	>

    <Svg>
      <Force
        strokeWidth={0}
        xStrength={0.1}
        yStrength={0.05}
		collideStrength={1}
		on:mousemove={event => evt = hideTooltip = event}
		on:mouseout={() => hideTooltip = true}
      />
    </Svg>
	<Html
		pointerEvents={false}
	>
		{#if currentStep === 2}
			<Labels />
		{/if}

		{#if hideTooltip !== true && currentStep === 3}
			<Tooltip
				{evt}
				let:detail
			>
				{@const tooltipData = { ...detail.props }}
				<div>{tooltipData.channel}</div>
				<div>{tooltipData.cluster}</div>
				{#each ['total_videos', 'subscribers'] as key}
					{@const keyCapitalized = key.replace(/^\w/, d => d.toUpperCase())}
					{@const value = tooltipData[key]}
					<div class="row"><span>{keyCapitalized}:</span> {value}</div>
				{/each}
			</Tooltip>
		{/if}
	</Html>
  </LayerCake>
</div>

<style lang='scss'>
	.chart {
		width: 100%;
		height: 500px;
		position: sticky;
		top: 10px;
	}
</style>