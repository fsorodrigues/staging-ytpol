<script lang="ts">
    // import from node_modules
    import { getContext } from 'svelte';

    // import utils
    import labelMap from '../../../utils/labels';
    import colorMap from '../../../utils/colors';

    // use context
    const { xScale, yScale, zDomain, width, height } = getContext('LayerCake');

</script>

<div class='label-container'>
    {#each $zDomain as group}
        <div class='label-group'>
            {#if $width >= $height}
                <span 
                    class='label' 
                    style={`--left: ${$xScale(group)}px; --top: 75px; --color: ${colorMap.get(group)}`}
                >{labelMap.get(group)}</span>
            {:else} <span 
                    class='label' 
                    style={`--top: ${$yScale(group)}px; --left: 18px; --color: ${colorMap.get(group)}`}
                >{labelMap.get(group)}</span>
            {/if}
        </div>
    {/each}
</div>



<style lang='scss'>
    .label-container {
		position: relative;

		.label {
			position: absolute;
			left: var(--left);
            top: var(--top);
            font-weight: 700;
            background-color: var(--color);
            color: white;
            transform: translate(-50%, 0);
            border-radius: 3px;
            padding: 2.5px 5px;
		}
	}
</style>
