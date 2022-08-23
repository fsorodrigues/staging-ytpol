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
    let url_fig1 : string = 'assets/data/fig1_ledwich.csv'
    let data_fig1 : any[]
    let xKey : number[] = [0,1]
    let yKey : string = 'cluster'
    let zKey : string = 'key'
    let url_fig4 : string = 'assets/data/fig4.csv'
    let data_fig4 : any[]
    let nodes : Node[]
    let links : Link[]
    let cols : string[];

    onMount(async () => {
        const res_fig4 = await csv(url_fig4, autoType)
        data_fig4 = enforceOrder(res_fig4, ['fR', 'R', 'AW', 'C', 'L', 'fL'], 'from')
        cols = enforceOrder(res_fig4.columns, ['fR', 'R', 'AW', 'C', 'L', 'fL'])

        nodes = [ 
            ...data_fig4.map(d => ({ id: `source_${d.from}` })), 
            ...cols.map(d => ({ id: `target_${d}` }))
        ]

        links = flatten(
            data_fig4.map((d, i) => 
                cols.map((e, l) => ({ sourceName: d.from, targetName: e, source: i, target: l + 6, value: d[e] }))
            )
        )
	})
</script>

<div class="section section-4" use:inView={{ once }} on:enter={() => loaded = true }>
    <!-- <h2 class="section-title">Subtitle 2</h2> -->
    {#if loaded && data_fig4}
        <SankeyDiagram 
            { nodes } 
            { links } 
            url={ url_fig4 }
            sourceLabel={ 'Month' }
            targetLabel={ 'Month + 1' }
            caption={captions[0].value}
            title={'Community members tend to remain in their communities, suggesting "stickiness"'}
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
    .section-4 {
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