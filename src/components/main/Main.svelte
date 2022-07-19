<script lang="ts">
	// node_modules
	// import { onMount } from 'svelte';
    // import { csv } from 'd3-fetch'

	// types
	import type Author from '../../types/Authors';
	// import type Row from '../../types/TimeSeriesRow';
	import type ChartConfig from '../../types/ChartConfig';

	// components
	import Title from '../copy/Title.svelte';
	import Description from '../copy/Description.svelte';
	import Authors from '../copy/Authors.svelte';
	import ScrollSection from './ScrollSection.svelte';
	// import LineChart from '../graphs/LineChart.svelte';
	// import Beeswarm from '../graphs/Beeswarm.svelte';

	// prop declaration
	export let title : string;
	export let text : string = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi consequatur inventore exercitationem ex perferendis provident, earum cumque maiores quam quidem labore, mollitia odit eaque laborum?'
	export let authors : Author[];

	// variable declaration
	// let data : Row[];
	// let channelData : Channel[];

	// chart config
	const fig3b : ChartConfig = {
		type: 'line',
		xKey: 'date',
		yKey: 'median_user_watchtime',
		zKey: 'label'
	}

</script>

<main>
	<Title title={ title }></Title>
	<Description text={ text }></Description>
	<Authors authors={ authors }></Authors>
	<ScrollSection />
</main>




<style lang='scss'>
	.placeholder {
		height: 1000px;
		background-color: gainsboro;
		grid-column: 1 / span last-line;
		grid-row: 3 / span last-line;
	}

	main {
		@include grid;
		@include centerH;
		// align-items: baseline;
		max-width: $column-width;
		// height: 500px;
		margin: 120px auto 0 auto;
	}
</style>