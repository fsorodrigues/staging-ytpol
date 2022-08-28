<script lang="ts">
    // node_modules
    import { format } from "d3-format";
    
    // actions
    import inView from "../../actions/inView";

    // components
    import ChartWrapper from "../graphs/ChartWrapper.svelte";

    // props
    let loaded : boolean = false;
    export let once : boolean;
    export let copy : any[]
    export let refs : any[]
    export let captions : any[]
</script>

<div class="section section-7" use:inView={{ once }} on:enter={() => loaded = true }>
    <!-- <h2 class="section-title">Subtitle 2</h2> -->
    {#if loaded}
        <ChartWrapper config={[{
                url: 'assets/data/fig7a.csv',
                description: 'Fraction of videos by session length',
                type: 'line',
                xKey: 'index',
                yKey: 'fraction',
                zKey: 'cluster',
                formatTickX: (d) => format('.2~f')(d / 14),
                xTicks: [0, 14 * 0.25, 14 * 0.5, 14 * 0.75, 14],
                formatTickY: format('.2~%'),
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
        spanCol={12}
        title='Session Analysis'
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
    .section-7 {
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