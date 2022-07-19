<script lang="ts">
	// types
	import type Author from '../../types/Authors';

	export let authors : Author[];
</script>

<div class='authors'>
	{#each authors as author, i}
		<div class='author-container'>
			<p>{author.name}</p>
			<div></div>
		</div>
	{/each}
</div>

<style lang='scss'>
	.authors {
		grid-column: 5 / span last-line;
		grid-row: 1 / span 1;
		display: flex;
		flex-wrap: wrap;

		.author-container {
			display: inline-flex;
			align-items: baseline;
			margin: 0 0 5px 0;

			p {
				font-weight: 300;
				display: inline;
			}

			div {
				width: 8px;
				height: 8px;
				border: 1pt solid $black;
			}
		}
	}
</style>