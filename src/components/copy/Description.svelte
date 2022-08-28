<script lang="ts">
	// components
	import LinkButton from "./LinkButton.svelte";
	
	// property definitions
	export let standfirst : any[];

</script>

<div class='standfirst-wrapper'>
	{#each standfirst as text}
		<p>{ text.value }</p>
	{/each}
	<LinkButton url={'https://www.pnas.org/doi/10.1073/pnas.2101967118'} />
</div>


<style lang='scss'>
	.standfirst-wrapper {
		grid-column: 1 / span 12;
		
		@media (min-width: $bp-3) {
			grid-column: 1 / span 8;
		}

		p {
			margin-bottom: 1em;
			@include fs-root;

			@media (min-width: $bp-3) {
				@include fs-md;
				line-height: 1.4;
			}
		}

		
	}
</style>