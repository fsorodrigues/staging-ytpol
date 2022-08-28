<script lang='ts'>
    // node_modules
	import { onMount } from 'svelte';
    import { csv } from 'd3-fetch'
    import { groups } from 'd3-array'
    import { autoType } from 'd3-dsv'

    // components
    import LineChart from "../graphs/LineChart.svelte";

    // types
    import type TimeSeriesRow from '../../types/TimeSeriesRow';
    import type ChartConfig from '../../types/ChartConfig';

    // utils
    import labelMap from '../../utils/labels';
    import colorMap from '../../utils/colors';
    import enforceOrder, { prefOrder } from '../../utils/order';

    // property declaration
    export let config : ChartConfig[]|ChartConfig;
    export let spanCol : number = 12;
    export let xTicks : number = 6;
    export let title : string;
    export let markers : string[] = [];

    // variable declaration
    let data : {} = {};
    let groupedData : [];
    let activeData : TimeSeriesRow[];
    let activeFig : ChartConfig;
    let activeChart : string;

    onMount(async () => {
        // check is url is string or array and then load data
        (Array.isArray(config) ? config : [config]).map(async (file, i) => {
            // load data
            const d = await csv(file.url, autoType)
            // parse date and store in upper scope variable
            data[file.url] = d.map(d => ({ ...d, date: new Date(d.year, d.month, 1) }))

            if (i === 0) {
                activeChart = file.url
                activeFig = file
            }
        })
	})

    $: activeData = data ? data[activeChart] : []
    $: activeFig = Array.isArray(config) ? config.filter((x) => x.url === activeChart)[0] : config
    $: groupedData = activeData ? groups(activeData, d => d[activeFig.zKey]) : []
</script>

{#if activeChart && activeFig }
    <h3 class="chart-title">{title}
        {#if Array.isArray(config) && config.length >= 2}
            <select class='dropdown-menu' type="select" bind:value={activeChart}>
                {#each config as file, i}
                    <option value={file.url}>{file.description}</option>
                {/each}
            </select>
        {/if}
    </h3>
    <div class='legend-container'>
        {#each enforceOrder(groupedData.map(d => d[0]), prefOrder) as group, i}
            <div class='legend-group'>
                <span class='legend-label' style={`--color: ${colorMap.get(group)}`}>{labelMap.get(group)}</span>
                <!-- <div class='legend-icon' style={`--color: ${colorMap.get(group[0])}`}></div> -->
            </div>
        {/each}
    </div>
    <div 
        class={`chart-wrapper ${spanCol === 12 ? 'split-cols' : 'single-cols'}`} 
        style={`--spanCol: ${spanCol}`}
    >
        <LineChart
            data={ activeData }
            url={activeChart}
            { groupedData }
            xKey={ activeFig.xKey }
            yKey={ activeFig.yKey }
            zKey={ activeFig.zKey }
            activeChart={ activeChart }
            includeCaption={ activeFig.includeCaption }
            caption={ activeFig.caption }
            formatTickX={ activeFig.formatTickX }
            xTicks={ activeFig.xTicks || xTicks }
            formatTickY={ activeFig.formatTickY }
            { spanCol }
            { markers }
        />
    </div>
{/if}


<style lang="scss">
    .chart-wrapper {
        display: grid;
        column-gap: 10px;
        row-gap: 10px;
        grid-row: 4 / span 1;
        grid-column: span 12;

        @media (min-width: $bp-3) {
            grid-column: span var(--spanCol);
        }
    }

    .split-cols {
        grid-template-columns: 1fr;

        @media (min-width: $bp-3) {
            grid-template-columns: 10fr 2fr;
        }
    }

    .single-cols {
        grid-template-columns: 1fr;
    }

    .chart-title {
        grid-row: 2 / span 1;
        grid-column: span 12;
    }

    .legend-container {
        grid-row: 3 / span 1;
        grid-column: span 12;
        display: flex;
        justify-content: start;
        gap: 2.5px;
        margin: 15px 0;

        @media (min-width: $bp-3) {
            grid-column: span 6;
        }

        .legend-group {
            display: flex;
            align-items: baseline;

            .legend-label {
                background-color: var(--color);
                color: white;
                padding: 2.5px 5px;
                border-radius: 3px;
                font-weight: 700;
                @include fs-sm;
            }
        }
    }

    .dropdown-menu {
        @include fs-sm;

        @media (min-width: $bp-3) {
            @include fs-root;
        }
    }
</style>