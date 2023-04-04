<script lang="ts">
	import { onDestroy } from 'svelte';

	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Graph from '$lib/Graph.svelte';

	export let form: ActionData;

	let loadStart: number = 0;

	let elapsedTime = 0;

	const interval = setInterval(() => {
		if (loadStart !== 0) {
			elapsedTime = (new Date().getTime() - loadStart) / 1000;
		}
	}, 100);

	onDestroy(() => clearInterval(interval));
</script>

<form
	method="POST"
	use:enhance={() => {
		loadStart = new Date().getTime();
		return async ({ update }) => {
			loadStart = 0;
			await update({ reset: false });
		};
	}}
>
	<label>
		人名
		<input name="name" type="text" />
	</label>
	<button>generate</button>
</form>

{#if loadStart}
	<p>loading...</p>
	<p>elapsed time: {elapsedTime} sec</p>
{/if}

{#if form && form.success}
	{#if form.output?.concerned.length === 0}
		<p>no data</p>
	{:else if form.output}
		<p>{form.output.name}のソーシャルグラフ</p>
		<Graph graph={form.output} />
	{/if}
{:else if form && !form.success}
	<p>error</p>
	{form.error}
{/if}
