import App from './App.svelte';

// import local data
import data from './data/copy.json'
import authors from './data/authors.json'

const app = new App({
	target: document.body,
	props: {
		title: data.title,
		authors,
	}
});

export default app;
