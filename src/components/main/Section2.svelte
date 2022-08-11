<script lang="ts">
    // node_modules
	import { timeFormat } from 'd3-time-format'
    import { format } from 'd3-format'
    
    // actions
    import inView from "../../actions/inView";

    // components
    import ChartWrapper from "../graphs/ChartWrapper.svelte";
    
    // props
    let loaded : boolean = false;
    export let once : boolean;
    export let copy : any[]
    export let refs : any[]
</script>

<div class="section section-2" use:inView={{ once }} on:enter={() => loaded = true }>
    {#if loaded}
        <ChartWrapper config={[{
                url: 'assets/data/fig2a_ledwich.csv',
                description: 'User share',
                type: 'line',
                xKey: 'date',
                yKey: 'user_percent',
                zKey: 'label',
                includeCaption: true,
                caption: 'Percent of users falling into the six political categories.',
                formatTickX: timeFormat('%b %Y'),
                formatTickY: (d) => format('.1%')(d).replace(/[.,]0+/, "")
                
            },
            {
                url: 'assets/data/fig2b_ledwich.csv',
                description: 'Total consumption share',
                type: 'line',
                xKey: 'date',
                yKey: 'percentage_duration',
                zKey: 'label',
                includeCaption: true,
                caption: 'Consumption share of the six political channel categories.',
                formatTickX: timeFormat('%b %Y'),
                formatTickY: (d) => format('.2%')(d).replace(/[.,]0+/, "")
            }
        ]}
        title='Community engagement'
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
        column-gap: 5px;
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