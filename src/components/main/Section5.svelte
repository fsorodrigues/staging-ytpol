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
    import StackedBars from "../graphs/StackedBars.svelte";
    import ChartWrapper from "../graphs/ChartWrapper.svelte";

    // utils
    import { youTubeMap as labelMap } from "../../utils/labels";
    import { youTubeMap as colorMap } from "../../utils/colors";
    import { formatPct } from '../../utils/format-numbers';

    // local data
    import copy from '../../data/copy';

    // props
    let loaded : boolean = false;
    export let once : boolean;

    // variable declaration
    let data_table2 : any[]
    let xKey : number[] = [0,1]
    let yKey : string = 'cluster'
    let zKey : string = 'key'

    onMount(async () => {
        const res = await csv('assets/data/table2.csv', autoType)
        data_table2 = res
	})

</script>

<div class="section section-5" use:inView={{ once }} on:enter={() => loaded = true }>
    {#if loaded}
        <ChartWrapper config={[{
                    url: 'assets/data/fig7a.csv',
                    description: 'Fraction of videos by session length',
                    type: 'line',
                    xKey: 'index',
                    yKey: 'fraction',
                    zKey: 'cluster',
                    formatTickX: (d) => d,
                    formatTickY: (d) => d.toFixed(2)
                },
                {
                    url: 'assets/data/fig7b.csv',
                    description: 'Frequency by session length',
                    type: 'line',
                    xKey: 'length',
                    yKey: 'mean',
                    zKey: 'cluster',
                    formatTickX: (d) => d,
                    formatTickY: (d) => d.toFixed(2)
                }
            ]} 
            spanCol={6}
        />
    {:else} <div class='chart-placeholder'></div>
    {/if}
    {#if loaded && data_table2}
        <StackedBars 
            data={ data_table2 } 
            { yKey } 
            { xKey } 
            { zKey } 
            formatter={formatPct(2)}
            keyColorMap={ colorMap }
            keyLabelMap={ labelMap }
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
                <span>[{i + 1}]</span> {d.value}
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

