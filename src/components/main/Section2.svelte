<script lang="ts">
    // node_modules
	import { timeFormat } from 'd3-time-format'
    
    // actions
    import inView from "../../actions/inView";

    // components
    import ChartWrapper from "../graphs/ChartWrapper.svelte";
    
    // props
    let loaded : boolean = false;
    export let once : boolean;
    export let copy : any[];
    export let refs : any[];
    export let captions : any[];
    export let markers : string[];
</script>

<div class="section section-2" use:inView={{ once }} on:enter={() => loaded = true }>
    {#if loaded}
            <ChartWrapper config={[{
                url: 'assets/data/fig3a_smoothed.csv',
                description: 'Median monthly minutes on YouTube (total)',
                type: 'line',
                xKey: 'date',
                yKey: 'median_duration',
                zKey: 'label',
                includeCaption: true,
                caption: captions[0].value,
                formatTickX: (d) => { 
                    if (d.getMonth() === 0) return timeFormat('%Y')(d)
                    return timeFormat('%b %Y')(d)
                },
                formatTickY: (d, i, n) => {
                    const val = d.toFixed(0);
                    if (i === n-1) return `${val} minutes`;
                    return val;
                }
            },
            {
                url: 'assets/data/fig3b_smoothed.csv',
                description: 'Median monthly minutes on YouTube (within news cluster)',
                type: 'line',
                xKey: 'date',
                yKey: 'median_user_watchtime',
                zKey: 'label',
                includeCaption: true,
                caption: captions[1].value,
                formatTickX: (d) => { 
                    if (d.getMonth() === 0) return timeFormat('%Y')(d)
                    return timeFormat('%b %Y')(d)
                },
                formatTickY: (d, i, n) => {
                    const val = d.toFixed(0);
                    if (i === n-1) return `${val} minutes`;
                    return val;
                }
            }
        ]} 
        title='YouTube consumption'
        { markers }
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
        {#each refs as d}
            <p>
                {d.value}
            </p>
        {/each}
    </div>
</div>

<style lang='scss'>
    .section-2 {
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