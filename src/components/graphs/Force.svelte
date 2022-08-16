<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import { forceSimulation, forceX, forceY, forceCollide, forceManyBody } from 'd3-force';
  
    const { data, xGet, yGet, zGet, rGet, height, width } = getContext('LayerCake');
  
    // /** @type {Number} [r=4] - The circle radius size in pixels. */
    // export let r = 4;
  
    /** @type {Number} [strokeWidth=1] - The circle's stroke width in pixels. */
    export let strokeWidth = 1;
  
    /** @type {String} [stroke='#fff'] - The circle's stroke color. */
    export let stroke = '#fff';
  
    /** @type {Number} [xStrength=0.95] - The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
    export let xStrength = 0.95;
  
    /** @type {Number} [yStrength=0.075] - The value passed into the `.strength` method on `forceY`. See [the documentation](https://github.com/d3/d3-force#y_strength). */
    export let yStrength = 0.075;

    export let collideStrength = 0.075;
    export let currentStep;

    // /** @type {Function} [getTitle] — An accessor function to get the field on the data element to display as a hover label using a `<title>` tag. */
    // export let getTitle = undefined;

    const dispatch = createEventDispatcher();

    let nodes = $data.map((d, i) => {
      return ({ ...d, y: 500/2, x: i/$data.length * 960 })
    });

    // variables
    let simulation = forceSimulation(nodes)
    let xForce = null;
    let yForce = null;
    let rRatio = 1;
  
    simulation.on("tick", () => {
      nodes = simulation.nodes()
    })
  
    $: {
      if ($width >= $height) {
        xForce = forceX().x(d => $xGet(d)).strength(xStrength)
        yForce = forceY().y($height / 2).strength(yStrength)
      } else {
        rRatio = 0.75
        xForce = forceX().x($width / 2).strength(yStrength)
        yForce = forceY().y(d => $yGet(d)).strength(xStrength)
      }
      
      simulation = simulation
        .force('collide', forceCollide(d => ($rGet(d) * rRatio) + 0.5).strength(collideStrength).iterations(2))
        .force('charge', forceManyBody().strength(-1))
        .force('x', xForce)
        .force('y', yForce)
        .alpha(1)
        .restart();
    }

    function handleMouseOver(e, d) {
      if (currentStep === 3) {
        const { target } = e
        dispatch('mousemove', { e, props: d })

        target.classList.add('active-node')
      }
    }

    function handleMouseOut(e) {
      if (currentStep === 3) {
        const { target } = e
        dispatch('mouseout')

        target.classList.remove('active-node')
      }
    }
</script>
  
<g 
  class='bee-group'
  on:mouseout={(e) => handleMouseOut(e)}
  on:blur={(e) => handleMouseOut(e)}
>
  {#each nodes as node}
    <circle
      class='node'
      fill={$zGet(node)}
      stroke={stroke}
      stroke-width={strokeWidth}
      cx={node.x}
      cy={node.y}
      r={$rGet(node) * rRatio}
      on:mouseover={(e) => handleMouseOver(e, node)}
      on:focus={(e) => handleMouseOver(e, node)}
    >
    </circle>
  {/each}
</g>
