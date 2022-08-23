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

    // props
    let loaded : boolean = false;
    export let once : boolean;
    export let copy : any[]
    export let refs : any[]
    export let captions : any[]

    // variable declaration
    let url_fig1 : string = 'assets/data/table2.csv'
    let data_table2 : any[]
    let xKey : number[] = [0,1]
    let yKey : string = 'cluster'
    let zKey : string = 'key'

    onMount(async () => {
        const res = await csv(url_fig1, autoType)
        data_table2 = res
	})

</script>

<div class="section section-6" use:inView={{ once }} on:enter={() => loaded = true }>
    {#if loaded}
        <ChartWrapper config={[{
                    url: 'assets/data/fig7a.csv',
                    description: 'Fraction of videos by session length',
                    type: 'line',
                    xKey: 'index',
                    yKey: 'fraction',
                    zKey: 'cluster',
                    formatTickX: (d) => d,
                    formatTickY: (d) => d.toFixed(2),
                    includeCaption: true,
                    caption: captions[0].value
                },
                {
                    url: 'assets/data/fig7b.csv',
                    description: 'Frequency by session length',
                    type: 'line',
                    xKey: 'length',
                    yKey: 'mean',
                    zKey: 'cluster',
                    formatTickX: (d) => d,
                    formatTickY: (d) => d.toFixed(2),
                    includeCaption: true,
                    caption: captions[1].value
                }
            ]} 
            spanCol={6}
            title='Session Analysis'
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
            url={ url_fig1 }
            spanCol={6}
            row={6}
            title={''}
            caption={captions[2].value}
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
    .section-6 {
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
        grid-row: 7 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-row: 5 / span 1;
            grid-column: span 7;
        }
    }

    .references {
        grid-row: 8 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-row: 5 / span 1;
            grid-column: span 5;
        }
    }
</style>

