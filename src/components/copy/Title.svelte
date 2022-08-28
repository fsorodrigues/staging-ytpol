<script lang="ts">
	export let title : string;
</script>

<h1>{ title }</h1>

<style lang='scss'>
	h1 {
		grid-column: 1 / span 12;
		@include fs-xl;

		@media (min-width: $bp-3) {
			grid-column: 1 / span 6;
			@include fs-xxl;
		}
	}
</style>