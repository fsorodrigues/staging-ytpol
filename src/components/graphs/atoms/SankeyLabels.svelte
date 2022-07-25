<script lang='ts'>
    // node_modules
    import { getContext } from 'svelte';

    // props declaration
    export let source : string
    export let target : string

    const { width, padding } = getContext('LayerCake')

</script>

<div class='source' style="--padding-top: -{$padding.top}px">
    { source }
</div>
<div class='target' style="--padding-bottom: -{$padding.bottom}px">
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
</style>