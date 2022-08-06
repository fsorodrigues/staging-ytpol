<script>
    import { getContext, createEventDispatcher } from 'svelte';
    // import { sankey, sankeyLeft, sankeyLinkHorizontal } from 'd3-sankey';
    import verticalSankey from '../../../utils/sankey';

    const { data, width, height } = getContext('LayerCake');

    /** @type {Function} [colorLinks=d => 'rgba(0, 0, 0, .2)'] - A function to return a color for the links. */
    export let colorLinks = d => 'rgba(0, 0, 0, .2)';

    /** @type {Function} [colorNodes=d => '#333'] - A function to return a color for each node. */
    export let colorNodes = d => '#333';

    /** @type {Function} [colorNodes=d => '#333'] - A function to return a color for each node. */
    export let labelNodes = d => d;

    /** @type {Function} [colorText=d => '#263238'] - A function to return a color for each text label. */
    export let colorText = d => '#263238';

    /** @type {Number} [nodeWidth=5] - The width of each node, in pixels, passed to [`sankey.nodeWidth`](https://github.com/d3/d3-sankey#sankey_nodeWidth). */
    export let nodeWidth = 5;

    /** @type {Number} [nodePadding=10] - The padding between nodes, passed to [`sankey.nodePadding`](https://github.com/d3/d3-sankey#sankey_nodePadding). */
    export let nodePadding = 10;

    /** @type {Function} [linkSort=null] - How to sort the links, passed to [`sankey.linkSort`](https://github.com/d3/d3-sankey#sankey_linkSort). */
    export let linkSort = null;

    /** @type {Function} [nodeId=d => d.id] - The ID field accessor, passed to [`sankey.nodeId`](https://github.com/d3/d3-sankey#sankey_nodeId). */
    export let nodeId = d => d.id;

    /** @type {Function} [nodeAlign=d3.sankeyLeft] - An alignment function to position the Sankey blocks. See the [d3-sankey documentation](https://github.com/d3/d3-sankey#alignments) for more. */
    // export let nodeAlign = sankeyLeft;

    $: sankeyGen = verticalSankey()
        .nodeWidth(25)
        .nodePadding(5)
        .size([$width, $height])
        .nodes($data.nodes)
        .links($data.links)
        .layout(0)

    $: nodes = sankeyGen.nodes()

    $: links = sankeyGen.links()

    $: link = sankeyGen.link();

    $: fontSize = $width <= 320 ? 8 : 12;

    const dispatch = createEventDispatcher();

    function handleMouseOver(e, d) {
        dispatch('mousemove', { e, props: d })
        document.querySelectorAll('.link')
            .forEach(el => {
                if (el !== e.target) el.classList.add('inactive')
                else el.classList.add('active')
            })
    }

    function handleMouseOut(e) {
        dispatch('mouseout')
        document.querySelectorAll('.link')
            .forEach(el => el.classList.remove('inactive'))
        e.target.classList.remove('active')
    }
</script>

<g class="sankey-layer">
    <g class='link-group'>
        {#each links as d}
            <path
                class='link'
                stroke-width={d.dy} 
                d={link(d)}
                style="--color: {colorLinks(d.sourceName)}"
                on:mouseover={(e) => handleMouseOver(e, d)}
                on:focus={(e) => handleMouseOver(e, d)}
                on:mouseout={(e) => handleMouseOut(e)}
                on:blur={(e) => handleMouseOut(e)}
            />
        {/each}
    </g>
    <g class='rect-group'>
        {#each nodes as d, i}
            {@const [ type, cluster ] = d.id.split('_')}
            <g class='node-group'>
                <rect
                    class={`node node-${type}`}
                    x={d.x}
                    y={d.y + (type === 'source' ? sankeyGen.nodeWidth() - 7.5 : 0)}
                    height={7.5}
                    width={d.dy}
                    fill={colorNodes(cluster)} 
                />
                <text 
                    class='label'
                    x={d.x + (d.dy / 2)}
                    y={d.y + (type === 'source' ? -2.5 : 2.5)}
                    dy="{sankeyGen.nodeWidth() / 2 + (fontSize / 2) - 2}"
                    style="fill: {colorText(d)};
                    font-size: {fontSize}px;">
                    {labelNodes(cluster)}
                </text>
            </g>
        {/each}
        </g>
    </g>

<style lang=scss>
    .label {
        pointer-events: none;
        text-anchor: middle;
    }

    .link {
        fill: none;
        stroke: var(--color);
        stroke-opacity: 0.25;
        transition: stroke-opacity 0.5s;
    }
</style>

<!-- stroke={colorLinks(d.sourceName)}
stroke-opacity=0.25 -->
<!-- height={sankeyGen.nodeWidth()} -->