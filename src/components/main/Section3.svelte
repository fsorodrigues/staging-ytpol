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

    // local data
    import copy from '../../data/copy';

    // utils
    import enforceOrder from "../../utils/order";
    import { formatPct } from '../../utils/format-numbers';

    // props
    let loaded : boolean = false;
    export let once : boolean;

    // variable declaration
    let url_fig1 : string = 'assets/data/fig1_pnas_mean.csv'
    let data_fig1 : any[]
    let xKey : number[] = [0,1]
    let yKey : string = 'cluster'
    let zKey : string = 'key'
    // let url_fig4 : string = 'assets/data/fig4.csv'
    // let data_fig4 : any[]
    // let nodes : Node[]
    // let links : Link[]
    // let cols : string[];

    onMount(async () => {
        const res_fig1 = await csv(url_fig1, autoType)
        data_fig1 = res_fig1
	})
</script>

<div class="section section-3" use:inView={{ once }} on:enter={() => loaded = true }>
    <h2 class="section-title">Subtitle 1</h2>
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
            caption={'The archetypes of news consumption behavior on YouTube for each political category.'}
        />
    {:else} <div class='chart-placeholder'></div>
    {/if}
    <div class='copy'>
        {#each copy['section-two']['copy'] as d, i}
            <p>
                {d.value}
            </p>
        {/each}
    </div>
    <div class='references'>
        {#each copy['section-two']['references'] as d, i}
            <p>
               {d.value}
            </p>
        {/each}
    </div>
</div>

<style lang='scss'>
    .section-3 {
        grid-template-columns: repeat(12, 1fr);
        column-gap: 5px;
        grid-template-rows: auto auto auto 1fr auto;
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
        grid-column: span 7;
    }

    .references {
        grid-row: 5 / span 1;
        grid-column: span 4;
    }
</style>