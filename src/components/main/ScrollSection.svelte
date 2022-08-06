<script lang="ts">
	// node_modules
	import { onMount } from 'svelte';
    import { csv } from 'd3-fetch'
    import { autoType } from 'd3-dsv'
    import { scaleLinear, scaleOrdinal, scaleBand, scaleLog } from 'd3-scale';
    
    // types
    import type Channel from '../../types/Channel';

    // components
    import Scroller from '../scroller/scrolly.svelte';
    import Beeswarm from '../graphs/Beeswarm.svelte';

    // utils import
    import comparator from '../../utils/comparator';

    // // props
    // let loaded : boolean = false;
    // export let once : boolean;
	
    // variable declaration
    let channelData : Channel[];
    let currentStep : number;
    const steps : string[] = [
        "<p>Here are the top 200 YouTube channels we monitor.</p>",
        "<p>Organized by their size.</p>",
        "<p>Clustered together</p>",
        "<p>Explore the data before we dive deeper into the politics of YouTube.</p>"
    ];

    let xKey : string = 'channel';
	let xScale : Function = scaleLinear();
    let xDomain : any[] = [null, null];

    const leftRightScale = scaleOrdinal()
        .domain(['fL', 'L', 'C', 'AW', 'R', 'fR'])
        .range([0, 1, 2, 3, 4, 5]);
    const spectrum = comparator('cluster', leftRightScale);

    onMount(async () => {
		const res = await csv('assets/data/channels_top250.csv', autoType);
		channelData = res
        channelData.sort(spectrum)
        channelData = channelData.map((d, i) => ({...d, channel: i}))
	})

    $: if (currentStep == 0) {
        // console.log('step 0');
    } else if (currentStep == 1) {
        xKey = 'subscribers'
        xScale = scaleLog()
        xDomain = [null, null]
    } else if (currentStep == 2) {
        xKey = 'cluster'
        xScale = scaleBand()
        xDomain = ['fL', 'L', 'C', 'AW', 'R', 'fR']
    } else if (currentStep == 3) {
        xKey = 'index'
        xScale = scaleLinear()
        xDomain = [null, null]
		channelData = channelData.map((d, i) => ({...d, index: i}))
    }
</script>

<div class='scroller-wrapper'>
    {#if channelData && channelData.length}
        <Beeswarm { currentStep } { xKey } { xScale } { xDomain } data={channelData} ></Beeswarm>
    {/if}
    <Scroller bind:value={currentStep}>
        {#each steps as text, i}
            <div class="step" class:active={currentStep === i}>
                <div class="step-content">
                    {@html text}
                </div>
            </div>
        {/each}
    </Scroller>
</div>

<style lang='scss'>
    .scroller-wrapper {
        position: relative;
        grid-column: 1 / span last-line;
		grid-row: 3 / span last-line;
        
        .step {
            height: 100vh;
            pointer-events: none;

            &-content {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: $white;
                box-shadow: 1px 1px 10px $light-grey;
            }
        }
    }
</style>