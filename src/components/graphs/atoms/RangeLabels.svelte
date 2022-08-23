<script lang='ts'>
    // node_modules
    import { getContext } from 'svelte';

    const { padding } = getContext('LayerCake')

</script>

<div class='x-title' style="--padding: {$padding.bottom / 2}px">Change in consumption (minutes)</div>

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
</style>