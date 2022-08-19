<script lang="ts">
	export let standfirst : any[];

</script>

<div class='standfirst-wrapper'>
	{#each standfirst as text}
		<p>{ text.value }</p>
	{/each}
</div>


<style lang='scss'>
	.standfirst-wrapper {
		grid-column: 1 / span 12;

		p {
			margin-bottom: 1em;
		}

		@media (min-width: $bp-3) {
			grid-column: 1 / span 5;
		}
	}
</style>