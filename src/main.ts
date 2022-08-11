import App from './App.svelte';

// import local data
import data from './data/copy.json'
import authors from './data/authors.json'

const app = new App({
	target: document.body,
	props: {
		data,
		authors,
	}
});

export default app;
