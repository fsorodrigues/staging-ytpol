<script lang="ts">
    // node_modules
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { autoType } from "d3-dsv";
    import { timeFormat } from 'd3-time-format'

    // import types

    // actions
    import inView from "../../actions/inView";

    // components
    import SingleLineChart from "../graphs/SingleLineChart.svelte";
    import TableWrapper from "../table/TableWrapper.svelte";

    // utils
    import { formatThousands } from '../../utils/format-numbers'

    // local data
    import copy from '../../data/copy';

    // props
    let loaded : boolean = false;
    export let once : boolean;

    // variable declaration
    let videos_url : string = 'assets/data/video_count.csv'
    let data_videos : any[]
    let channels_url : string = 'assets/data/channels_top250.csv'
    let data_channels : any[]
    let xKey : string = 'date'
    let yKey : string = 'count'

    onMount(async () => {
        const res_videos = await csv(videos_url, autoType)
        data_videos = res_videos

        const res_channels = await csv(channels_url, autoType)
        data_channels = res_channels
	})

</script>

<main class='supplementary'>
    <div class="section section-supplementary" use:inView={{ once }} on:enter={() => loaded = true }>
        <h2 class="section-title">Supplementary information appendix</h2>
        {#if loaded}
            <SingleLineChart
                data={ data_videos }
                url={ videos_url }
                { xKey }
                { yKey }
                formatTickX={ timeFormat('%b %Y') }
                formatTickY={ formatThousands }
                caption={ 'Montly videos crawled.' }
                spanCol={ 12 }
                stroke={ '#E08A00' }
            />
        {:else} <div class='chart-placeholder'></div>
        {/if}
        <div class='copy copy-part1'>
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
        {#if loaded}
            <div class='table-wrapper'>
                <TableWrapper data={data_channels} pageSize={20} />
            </div>
        {/if}
        <div class='copy copy-part2'>
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
</main>

<style lang='scss'>
    .supplementary {
        padding: 50px 0;
        background-color: gainsboro;
    }
    .section-supplementary {
        grid-template-columns: repeat(12, 1fr);
        column-gap: 50px;
        grid-template-rows: auto auto auto 1fr auto auto auto;
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
        grid-column: span 7;
    }

    .copy-part1 {
        grid-row: 5 / span 1;    
    }

    .copy-part2 {
        grid-row: 7 / span 1; 
    }
    
    .references {
        grid-row: 5 / span 1;
        grid-column: span 4;
    }

    .table-wrapper {
        grid-row: 6 / span 1;
        grid-column: 1 / span 10;
    }

    .copy {
        p {
            @include fs-base;
        }
    }
</style>