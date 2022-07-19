<script lang="ts">
    // import from node_modules
    import { getContext } from 'svelte';

    // import utils
    import labelMap from '../../../utils/labels';
    import colorMap from '../../../utils/colors';

    // use context
    const { xScale, zDomain, zScale } = getContext('LayerCake');

</script>

<div class='label-container'>
    {#each $zDomain as group}
        <!-- <div class='label' style="--left: {$xScale(group)}px; --color: {$zScale(group)}">{labelMap.get(group)}</div> -->
        <div class='label-group'>
            <span class='label' style={`--left: ${$xScale(group)}px; --color: ${colorMap.get(group)}`}>{labelMap.get(group)}</span>
        </div>
    {/each}
</div>



<style lang='scss'>
    .label-container {
		position: relative;

		.label {
			position: absolute;
			left: var(--left);
            top: 75px;
            font-weight: 700;
            // color: var(--color);
            background-color: var(--color);
            color: white;
            transform: translate(-50%, 0);
            border-radius: 3px;
            padding: 2.5px 5px;
		}
	}
</style>
