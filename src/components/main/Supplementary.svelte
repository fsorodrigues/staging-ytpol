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
    import enforceOrder, { prefOrder } from "../../utils/order";

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

<main class='supplementary'>
    <div class="section section-supplementary" use:inView={{ once }} on:enter={() => loaded = true }>
        <h2 class="section-title">Supplementary information appendix</h2>
        {#if loaded}
            <ChartWrapper config={[{
                        url: 'assets/data/fig7a.csv',
                        description: 'Fraction of videos by session length',
                        type: 'line',
                        xKey: 'index',
                        yKey: 'fraction',
                        zKey: 'cluster',
                        formatTickX: (d) => d,
                    },
                ]} 
                spanCol={12}
            />
        {:else} <div class='chart-placeholder'></div>
        {/if}
        <div class='copy'>
            {#each copy['section-two']['copy'] as d, i}
                <p>
                    {d.value}
                </p>
            {/each}
            {#each copy['section-two']['copy'] as d, i}
                <p>
                    {d.value}
                </p>
            {/each}
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
</main>

<style lang='scss'>
    .supplementary {
        padding: 50px 0;
        background-color: gainsboro;
    }
    .section-supplementary {
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

    .copy {
        p {
            @include fs-base;
        }
    }
</style>