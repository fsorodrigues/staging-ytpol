<script lang="ts">
    // node_modules
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { group } from 'd3-array';
    import { autoType } from "d3-dsv";
    import { flatten } from "layercake";

    // import types
    import type Node from '../../types/Node'
    import type Link from '../../types/Link'

    // actions
    import inView from "../../actions/inView";

    // components
    import RangePlot from "../graphs/RangePlot.svelte";
    import SankeyDiagram from "../graphs/SankeyDiagram.svelte";

    // local data
    import copy from '../../data/copy';

    // utils
    import enforceOrder from "../../utils/order";

    // props
    let loaded : boolean = false;
    export let once : boolean;

    // variable declaration
    const url_fig5 = 'assets/data/fig5.csv'
    const url_fig6 = 'assets/data/fig6.csv'
    let data_fig5 : any[]
    let groupedData_fig5 : any[]
    let xKey : string = 'mean'
    let yKey : string = 'cluster'
    let zKey : string = 'cluster'
    let data_fig6 : any[]
    let nodes : Node[]
    let links : Link[]
    let cols : string[]
    
    const sankeyTooltipFormatter = d => {
        if (d === 1) return 'Just as likely as average user'
        if (d > 1) return `More likely to consume than average user. Probability: ${d}`
        return `Less likely to consume than average user. Probability: ${d}`
    }

    onMount(async () => {
        const res_fig5 = await csv(url_fig5, autoType)
        data_fig5 = res_fig5
        groupedData_fig5 = group(data_fig5, d => d[yKey])

        const res_fig6 = await csv(url_fig6, autoType)
        data_fig6 = res_fig6
        cols = enforceOrder(data_fig6.columns, ['fR', 'R', 'C', 'L', 'fL'])

        nodes = [ 
            ...data_fig6.map(d => ({ id: `source_${d.from}` })), 
            ...cols.map(d => ({ id: `target_${d}` }))
        ]

        links = flatten(
            data_fig6.map((d, i) => 
                cols.map((e, l) => ({ sourceName: d.from, targetName: e, source: i, target: l + 6, value: d[e] }))
            )
        )
        
	})
</script>

<div class="section section-5" use:inView={{ once }} on:enter={() => loaded = true }>
    {#if loaded && data_fig5}
        <RangePlot 
            data={ data_fig5 }
            groupedData={ groupedData_fig5 } 
            { yKey } 
            { xKey } 
            { zKey } 
            formatter={(d) => d.toFixed(2)}
            url={ url_fig5 }
            caption={'Difference in means of daily consumption change, in the event of bursty consumption from a specific political category. Individuals are assigned either to bursty consumption group in the event of watching 2 to 4 videos, or to a control group, if none of their sessions has more than one video from the same category in their lifetime. The exposure can be driven by user, recommendation, or external sources.'}
        />
        {:else} <div class='chart-placeholder'></div>
    {/if}
    {#if loaded && data_fig6}
        <SankeyDiagram 
            { nodes } 
            { links } 
            formatter={sankeyTooltipFormatter}
            url={ url_fig6 }
            spanCol={6}
            sourceLabel={ 'YouTube' }
            targetLabel={ 'News media' }
            caption={'Risk ratio of consumption of polical content on YouTube from news content of politcal categories on the web.'}
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
    .section-5 {
        grid-template-columns: repeat(12, 1fr);
        column-gap: 50px;
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