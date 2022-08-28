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
    export let captions : any[]
    export let markers : string[]
</script>

<div class="section section-1" use:inView={{ once }} on:enter={() => loaded = true }>
        {#if loaded}
            <ChartWrapper config={[{
                    url: 'assets/data/fig2a_ledwich.csv',
                    description: 'User share',
                    type: 'line',
                    xKey: 'date',
                    yKey: 'user_percent',
                    zKey: 'label',
                    includeCaption: true,
                    caption: captions[0].value,
                    formatTickX: (d) => { 
                        if (d.getMonth() === 0) return timeFormat('%Y')(d)
                        return timeFormat('%b %Y')(d)
                    },
                    formatTickY: format('.2~%')
                    
                },
                {
                    url: 'assets/data/fig2b_ledwich.csv',
                    description: 'Total consumption share',
                    type: 'line',
                    xKey: 'date',
                    yKey: 'percentage_duration',
                    zKey: 'label',
                    includeCaption: true,
                    caption: captions[1].value,
                    formatTickX: (d) => { 
                        if (d.getMonth() === 0) return timeFormat('%Y')(d)
                        return timeFormat('%b %Y')(d)
                    },
                    formatTickY: format('.2~%')
                }
            ]}
            title='Community engagement'
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
    .section-1 {
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