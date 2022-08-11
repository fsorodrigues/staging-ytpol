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
		grid-column: 1 / span 6;

		p {
			margin-bottom: 1em;
		}
	}
</style>