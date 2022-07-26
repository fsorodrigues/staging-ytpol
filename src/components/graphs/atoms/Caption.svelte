<script lang='ts'>
    export let caption : string
    export let url : string
    export let type : string
</script>

<div class="caption caption-{type}">
    <span class='caption-text'>{ caption }</span>
    <a class="download-button" href={url} download>
        Download data <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    </a>
</div>

<style lang='scss'>
    .caption {
        line-height: 1.65;
    }

    .caption-text {
        display: block
    }

    .download-button {
        color: $dark-grey;
        background-color: $light-grey;
        border-radius: 3px;
        padding: 2.5px 5px;
        margin: 10px 0 0 0;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }

    .download-button:hover {
        opacity: 0.90;
    }

    .caption-single-cols {
        .download-button {
            margin: 0 !important;
        }
    }

    .feather {
        width: 15px;
        height: 15px;
    }
</style>