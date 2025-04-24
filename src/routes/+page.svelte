<script>
	import { browser } from '$app/environment';
	import * as F from '$lib/forth/forth.js';
</script>

<h1>TODO: title...</h1>

<input
	placeholder="Buy milk…"
	<!-- bind:value={} -->
	<!-- on:keydown={(e) => e.key === 'Enter' && add()} -->
/>
<!-- <button on:click={add}>Add</button> -->

<ul>
	<!-- {#each todos as t}
		<li>
			<input type="checkbox" checked={t.done} on:change={() => toggle(t.idx)} />
			<span class:done={t.done}>{t.text}</span>
		</li>
	{/each} -->
</ul>

<style>
	.done {
		text-decoration: line-through;
		color: #888;
	}
</style>
