<script>
	import { browser } from '$app/environment';
	import * as F from '$lib/forth/forth.js';

	let todos = $state([
		{ idx: 0, done: false, text: 'temp' },
		{ idx: 1, done: true, text: 'placeholder' }
	]);
	let temp = $state('');

	async function add() {}
	async function toggle(temp) {}
	async function delete_() {}
	async function clear() {}
</script>

<!-- page title -->
<h1 class="mt-8 mb-10 text-center font-serif text-5xl font-semibold">Lorem Ipsum Dolor Sit Amet</h1>

<!-- three-column wrapper -->
<div class="mx-auto flex max-w-6xl gap-8 px-6">
	<!-- TODO: fix todo bar over alerts -->
	<!-- ========= todo list ========= -->
	<section class="flex-1">
		<!-- header bar -->
		<div class="mb-4 flex items-center justify-between rounded-full bg-gray-200 px-4 py-2">
			<!-- <span class="text-lg font-semibold">To-Do List</span> -->
			<!-- _class="flex-grow rounded-full text-lg font-semibold focus:outline-none" -->
			<input
				class="min-w-0 flex-1 rounded-full border border-gray-400 bg-white px-4 py-2 text-lg font-semibold placeholder-gray-500 focus:outline-none"
				placeholder="Buy milk..."
				bind:value={temp}
				onkeydown={(e) => e.key === 'Enter' && add()}
			/>

			<div class="flex shrink-0 space-y-2 text-sm">
				<button class="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-900" onclick={add}>
					Create Task
				</button>
				<button class="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700" onclick={clear}>
					Delete All Tasks
				</button>
			</div>
		</div>

		<!-- task list -->
		<ul class="space-y-2 text-sm">
			{#each todos as t}
				<li>
					<label class="flex items-start gap-2">
						<input
							type="checkbox"
							class="mt-[3px]"
							checked={t.done}
							onchange={() => toggle(t.idx)}
						/>
						<div class:done={t.done}>
							<p class="font-semibold">{t.text}</p>
							<p class="text-xs">Complete the homepage design and prototype interactions.</p>
						</div>
					</label>
				</li>
			{/each}

			<li>
				<label class="flex items-start gap-2">
					<input type="checkbox" class="mt-[3px]" />
					<div>
						<p class="font-semibold">Finish UI mockup</p>
						<p class="text-xs">Complete the homepage design and prototype interactions.</p>
					</div>
				</label>
			</li>

			<!-- Repeat these list items as needed -->
			<li>
				<label class="flex items-start gap-2">
					<input type="checkbox" class="mt-[3px]" />
					<div>
						<p class="font-semibold">Buy groceries</p>
						<p class="text-xs">Get milk, eggs, and bananas for the week.</p>
					</div>
				</label>
			</li>

			<li>
				<label class="flex items-start gap-2">
					<input type="checkbox" class="mt-[3px]" />
					<div>
						<p class="font-semibold">Email professor</p>
						<p class="text-xs">Description</p>
					</div>
				</label>
			</li>
		</ul>
	</section>

	<!-- ========= alerts ========= -->
	<section class="flex-1 space-y-4">
		<!-- alert card -->
		<div class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm">
			<button class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700">
				&times;
			</button>

			<p class="mb-1 font-bold">NEW TASK ADDED</p>
			<p class="text-sm">Buddy is caught lacking, Lock the fuck in</p>

			<button class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700">
				Close
			</button>
		</div>

		<div class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm">
			<button class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700">
				&times;
			</button>

			<p class="mb-1 font-bold">Why you so lazy buddy</p>
			<p class="text-sm">You think it would be that easy?</p>

			<button class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700">
				Close
			</button>
		</div>
	</section>

	<!-- ========= brainrot ========= -->
	<!-- TODO -->
	<aside class="flex-1 rounded-3xl bg-gray-300"></aside>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(html) {
		background-color: theme(--color-gray-100);
	}
	.done {
		text-decoration: line-through;
		color: #888;
	}
</style>
