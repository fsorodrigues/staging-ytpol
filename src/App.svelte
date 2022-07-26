<script lang="ts">
	// types
	import type Author from './types/Authors';
	// sections
	import Header from './components/header/Header.svelte';
	import Footer from './components/footer/Footer.svelte';
	import Main from './components/main/Main.svelte';
	import Section1 from './components/main/Section1.svelte';
	import Section2 from './components/main/Section2.svelte';
	import Section3 from './components/main/Section3.svelte';
	import Section4 from './components/main/Section4.svelte';
	import Section5 from './components/main/Section5.svelte';
	import Section6 from './components/main/Section6.svelte';
	import Supplementary from './components/main/Supplementary.svelte';

	export let title : string = 'Your title goes here';
	export let authors : Author[];
</script>

<Header />
<Main title={ title } authors={ authors } />
<Section1 once={ true } />
<Section2 once={ true } />
<Section3 once={ true } />
<Section4 once={ true } />
<Section5 once={ true } />
<Section6 once={ true } />
<Supplementary once={ true } />
<Footer />

<style lang='scss' global>
	.section {
		max-width: $column-width;
		margin: 1em auto;
		display: grid;
	}

	.chart {
		height: 500px;
	}

	.caption {
		@include fs-sm;
		font-weight: 300;
	}

	.copy {
		margin: 35px 0;

		p {
			margin: 10px 0;
			@include fs-md;
		}
	}

	.references {
		margin: 35px 0;

		p {
			margin: 10px 0;
			line-height: 1.6;
			@include fs-sm;
		}
	}

    .link.inactive {
        stroke-opacity: 0.15 !important;
    }
	.link.active {
        stroke-opacity: 0.5 !important;
    }

	.group-rect.inactive, 
	.range-circle.inactive {
        opacity: 0.5 !important;
    }
	
	.group-rect.active,
	.range-circle.active {
        opacity: 1 !important;
    }

	.active-node {
		stroke: black;
		stroke-width: 2pt; 
	}
</style>