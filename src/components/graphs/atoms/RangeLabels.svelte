<script lang='ts'>
    // node_modules
    import { getContext } from 'svelte';

    const { custom, padding, xGet } = getContext('LayerCake')
</script>

<div class='x-title' style="--padding: {$padding.bottom / 2}px">Change in consumption (minutes)</div>
{#each $custom.get('fR') as label}
    <div class='label {label.scenario === 4 ? 'last-label' : '' }' style="--left: {$xGet(label)}px">
        <span>{label.scenario}</span>
        {#if label.scenario === 4}
            <span>videos</span>
        {/if}
    </div>
{/each}

<style lang='scss'>
    .x-title {
        color: $dark-grey;
        font-weight: 300 !important;
        @include fs-sm;
        text-transform: uppercase;
        position: absolute;
        top: calc(100% + var(--padding));
        left: 50%;
        transform: translate(-50%, 0);
        white-space: nowrap;
    }

    .label {
        @include fs-xs;
        position: absolute;
        top: 20px;
        left: var(--left);
        transform: translate(-50%, 0);
    }

    .last-label {
        transform: translate(-6%, 0);
    }
</style>