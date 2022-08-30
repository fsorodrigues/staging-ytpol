<script lang="ts">
    // node_modules
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { autoType } from "d3-dsv";
    import { flatten } from "layercake";

    // import types
    import type Node from '../../types/Node'
    import type Link from '../../types/Link'
    
    // actions
    import inView from "../../actions/inView";

    // components
    import StackedBars from "../graphs/StackedBars.svelte";
    import SankeyDiagram from "../graphs/SankeyDiagram.svelte";

    // utils
    import enforceOrder from "../../utils/order";
    import { formatPct } from '../../utils/format-numbers';

    // props
    let loaded : boolean = false;
    export let once : boolean;
    export let copy : any[]
    export let refs : any[]
    export let captions : any[]

    // variable declaration
    let url_fig1 : string = 'assets/data/fig1_pnas_mean.csv'
    let data_fig1 : any[]
    let xKey : number[] = [0,1]
    let yKey : string = 'cluster'
    let zKey : string = 'key'
    
    onMount(async () => {
        const res_fig1 = await csv(url_fig1, autoType)
        data_fig1 = res_fig1
	})
</script>

<div class="section section-3" use:inView={{ once }} on:enter={() => loaded = true }>
    {#if loaded && data_fig1}
        <StackedBars 
            data={ data_fig1 } 
            { yKey } 
            { xKey } 
            { zKey } 
            formatter={formatPct(2)}
            url={ url_fig1 }
            spanCol={12}
            customClass={'chart-medium'}
            tooltipType={'community'}
            caption={captions[0].value}
            title={'Consumption patterns of individuals strongly align with their clusters'}
        />
    {:else} <div class='chart-placeholder'></div>
    {/if}
    <div class='copy'>
        {#each copy as d, i}
            <p>
                {d.value}
            </p>
        {/each}
    </div>
    <div class='references'>
        {#each refs as d, i}
            <p>
               {d.value}
            </p>
        {/each}
    </div>
</div>

<style lang='scss'>
    .section-3 {
        grid-template-columns: repeat(12, 1fr);
        column-gap: 0;
        grid-template-rows: auto auto auto 1fr auto auto;

        @media (min-width: $bp-3) {
            column-gap: 50px;
            grid-template-rows: auto auto auto 1fr auto;
        }
    }

    .chart-placeholder {
        height: 500px;
        background-color: lightgrey;
    }

    .section-title {
        border-bottom: 1pt solid black;
        margin: 0 0 25px 0;
        grid-row: 1 / span 1;
        grid-column: span 12;
    }

    .copy {
        grid-row: 5 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-column: span 7;
        }
    }

    .references {
        grid-row: 6 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-row: 5 / span 1;
            grid-column: span 5;
        }
    }
</style>