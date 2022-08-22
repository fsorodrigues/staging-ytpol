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

    // // local data
    // import copy from '../../data/copy';

    // utils import
    import comparator from '../../utils/comparator';

    // // props
    // let loaded : boolean = false;
    export let steps : any[];
	
    // variable declaration
    let channelData : Channel[];
    let currentStep : number;
    // const steps : string[] = copy.scroller;

    let xKey : string = 'channel';
	let xScale : Function = scaleLinear();
    let xDomain : any[] = [null, null];
    let yKey : string = 'channel';
	let yScale : Function = scaleLinear();
    let yDomain : any[] = [null, null];

    const leftRightScale = scaleOrdinal()
        .domain(['fL', 'L', 'C', 'AW', 'R', 'fR'])
        .range([0, 1, 2, 3, 4, 5]);
    const spectrum = comparator('cluster', leftRightScale);

    function clearActiveNodes() {
        const allActiveNodes = document.getElementsByClassName('active-node')

        if (allActiveNodes || allActiveNodes.length) {
            for (let node of allActiveNodes) {
                node.classList.remove('active-node');
            }
        }
    }

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
        yKey = 'subscribers'
        yScale = scaleLog()
        yDomain = [null, null] 
        clearActiveNodes()
    } else if (currentStep == 2) {
        xKey = 'cluster'
        xScale = scaleBand()
        xDomain = ['fL', 'L', 'C', 'AW', 'R', 'fR']
        yKey = 'cluster'
        yScale = scaleBand()
        yDomain = ['fL', 'L', 'C', 'AW', 'R', 'fR']
        clearActiveNodes()
    } else if (currentStep == 3) {
        xKey = 'index'
        xScale = scaleLinear()
        xDomain = [null, null]
        yKey = 'index'
        yScale = scaleLinear()
        yDomain = [null, null]
		channelData = channelData.map((d, i) => ({...d, index: i}))
        clearActiveNodes()
    }
</script>

<div class='scroller-wrapper'>
    {#if channelData && channelData.length}
        <Beeswarm 
            { currentStep } 
            { xKey } 
            { xScale } 
            { xDomain } 
            { yKey } 
            { yScale } 
            { yDomain } 
            data={channelData} 
        ></Beeswarm>
    {/if}
    <Scroller bind:value={currentStep}>
        {#each steps as d, i}
            <div class="step {d.type}" class:active={currentStep === i}>
                <div class="step-content">
                    {#each d.value as e, l}
                        <p>{e}</p>
                    {/each}
                </div>
            </div>
            <div class='spacer'></div>
        {/each}
    </Scroller>
</div>

<style lang='scss'>
    .scroller-wrapper {
        position: relative;
        grid-column: 1 / span last-line;
		grid-row: 4 / span last-line;

        @media (min-width: $bp-3) {
            grid-row: 3 / span last-line;
        }
        
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

            p {
                margin-bottom: 1em;
            }

            p:last-of-type {
                margin-bottom: 0;
            }
        }

        .spacer {
            height: 20vh;
        }

        .step-content {
            p {
            @include fs-root;

                @media (min-width: $bp-2) {
                    @include fs-md;
                }
            }
        }
    }
</style>