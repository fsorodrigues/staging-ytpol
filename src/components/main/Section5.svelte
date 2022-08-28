<script lang="ts">
    // node_modules
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { group } from 'd3-array';
    import { autoType } from "d3-dsv";

    // actions
    import inView from "../../actions/inView";

    // components
    import RangePlot from "../graphs/RangePlot.svelte";

    // props
    let loaded : boolean = false;
    export let once : boolean;
    export let copy : any[]
    export let refs : any[]
    export let captions : any[]

    // variable declaration
    const url_fig5 : string = 'assets/data/fig5.csv'
    let data_fig5 : any[]
    let groupedData_fig5 : any[]
    let xKey : string = 'mean'
    let yKey : string = 'cluster'
    let zKey : string = 'cluster'

    onMount(async () => {
        const res_fig5 = await csv(url_fig5, autoType)
        data_fig5 = res_fig5
        groupedData_fig5 = group(data_fig5, d => d[yKey])        
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
            caption={captions[0].value}
            title={'Bursts of political videos impact overall consumption habits differently'}
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
    .section-5 {
        grid-template-columns: repeat(12, 1fr);
        column-gap: 0;
        grid-template-rows: repeat(8, auto);

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