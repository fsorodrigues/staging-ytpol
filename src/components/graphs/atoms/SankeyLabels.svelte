<script lang='ts'>
    // node_modules
    import { getContext } from 'svelte';

    // props declaration
    export let source : string
    export let target : string

    const { width, padding } = getContext('LayerCake')

</script>

<div class='sankey-label source' style="--padding-top: -{3 * $padding.top / 4}px">
    { source }
</div>
<div class='sankey-label target' style="--padding-bottom: -{3 * $padding.bottom / 4}px">
    { target }
</div>

<style lang='scss'>
    .source, .target {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }
    .source {
        top: var(--padding-top);
    }

    .target {
        bottom: var(--padding-bottom);
    }

    .sankey-label {
        color: $dark-grey;
        font-weight: 300 !important;
        @include fs-sm;
        text-transform: uppercase;
    }
</style>