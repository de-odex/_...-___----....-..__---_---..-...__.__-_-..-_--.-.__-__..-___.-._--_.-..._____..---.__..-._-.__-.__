<script>
	import { browser } from '$app/environment';
	import * as F from '$lib/forth/forth.js';

	let todos = $state([]);
	let temp = $state('');

	async function add() {}
	async function toggle(temp) {}
	async function delete_() {}
	async function clear() {}
</script>

<h1>TODO: title...</h1>

<input placeholder="Buy milk..." bind:value={temp} onkeydown={(e) => e.key === 'Enter' && add()} />
<button onclick={add}>Create Task</button> -->
<button onclick={clear}>Delete All Tasks</button>

<ul>
	{#each todos as t}
		<li>
			<input type="checkbox" checked={t.done} onchange={() => toggle(t.idx)} />
			<span class:done={t.done}>{t.text}</span>
		</li>
	{/each}
</ul>

<style>
	.done {
		text-decoration: line-through;
		color: #888;
	}
</style>
