<script>
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	const labels = [
		"yo this task lowk weird",
		"man you gotta pick up yo slack",
		"are we being serious right neow",
		"fuck is you doing with yo life",
		"ongod you gotta lock in",
		"who the hell put you up to this",
		"JUST DO THIS TASK",
		"this one can wait ig",
		"this one canNOT wait",
		"im running out of labels"
	];
	
	let todos = [

	];
	let temp = '';
	let alerts = [];
	let cursedTask = null;
	let inactivityTimer;
	let images = [];

	const mysteryTasks = [
		"Touch grass",
		"Do 10 push-ups",
		"Go stare at the sun",
		"DM your ex 'just checking in'",
		"Open a book. Any book."
	];

	const soundIds = [
		"sound-oohmagah",
		"sound-aughhh",
		"sound-alarm",
		"sound-fart",
		"sound-vineboom",
		"sound-whatdahell",
		"sound-bonk"
	];

	// Image pool for brainrot
	const imagePool = [
		"/images/brainrot1.jpg",  // Images should be placed in /static/images/ folder
		"/images/brainrot2.jpg",
		"/images/brainrot3.jpg",
		"/images/brainrot4.jpg",
		"/images/brainrot5.jpg"
	];

	// Function to show random image
	function showRandomImage() {
		const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
		const img = document.createElement('img');
		img.src = randomImage;
		img.alt = "Brainrot image";
		img.style.position = "absolute";
		img.style.top = `${Math.random() * 90}%`;  // Random position
		img.style.left = `${Math.random() * 90}%`;  // Random position
		img.style.width = "200px"; // Adjust size
		img.style.zIndex = "10";  // Ensure it's above other content
		img.style.transition = "opacity 1s ease-in-out"; // Make it fade out

		// Add the image to the page
		document.body.appendChild(img);

		// Fade out and remove after 5 seconds
		setTimeout(() => {
			img.style.opacity = 0;
			setTimeout(() => {
				document.body.removeChild(img);
			}, 1000); // Remove after fade
		}, 2000); // 2 seconds
	}

	function showAlert(title, message) {
		const id = Date.now();
		alerts = [...alerts, { id, title, message }];
		setTimeout(() => fadeOutAlert(id), 5000);
	}

	function fadeOutAlert(id) {
		alerts = alerts.filter(a => a.id !== id);
	}

	function playRandomSound() {
		if (!browser) return;
		const id = soundIds[Math.floor(Math.random() * soundIds.length)];
		const el = document.getElementById(id);
		if (el) {
			el.volume = 0.5;
			el.currentTime = 0;
			el.play().catch(e => console.error("Playback error:", e));
		}
	}

function add() {
	if (temp.trim().length < 3) {
		showAlert("That ain't it", "Be serious. That task name too short.");
		playRandomSound();
		return;
	}


	const randomLabel = labels[Math.floor(Math.random() * labels.length)];
	const isMystery = Math.random() < 0.02;
	const newTask = {
		idx: todos.length,
		done: false,
		text: isMystery ? '🎁 MYSTERY TASK UNLOCKED!' : temp,
		desc: isMystery ? 'Click to reveal mystery task...' : randomLabel,
		mystery: isMystery
	};
	todos = [...todos, newTask];
	if (!cursedTask) cursedTask = newTask;
	showAlert('NEW TASK ADDED', 'Buddy is caught lacking. Lock the fuck in');
	playRandomSound();
	showRandomImage();  // Show random image when task is added

	temp = ''; // 
}

	function revealMystery(idx) {
		todos = todos.map(t =>
			t.idx === idx && t.mystery
				? { ...t, text: mysteryTasks[Math.floor(Math.random() * mysteryTasks.length)], desc: 'This is your fate', mystery: false }
				: t
		);
		playRandomSound();
		showRandomImage();  // Show random image when mystery task is revealed
	}

	function toggle(idx) {
		todos = todos.map((t) => t.idx === idx ? { ...t, done: !t.done } : t);
	}

	function clear() {
		showAlert('Why you so lazy buddy', 'You think it would be that easy?');
		playRandomSound();
	}

	function procrastinate() {
		showAlert('Procrastination Time', 'Go take a lap. We’ll wait.');
		playRandomSound();
	}

	$: {
		if (cursedTask && !todos.find(t => t.text === cursedTask.text)) {
			todos = [...todos, { ...cursedTask, idx: todos.length }];
			showAlert("Nice try", "You can't delete this cursed task.");
			playRandomSound();
		}
	}

	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			showAlert("Still here?", "You ain't moved in 10 seconds. Lock in.");
			playRandomSound();
		}, 10000);
	}

	if (browser) {
		window.addEventListener('mousemove', resetInactivityTimer);
		window.addEventListener('keydown', resetInactivityTimer);
		resetInactivityTimer();
	}

</script>

// Brainrot audio
<audio id="sound-oohmagah" src="/sounds/OOHMAGAH.mp3" preload="auto"></audio>
<audio id="sound-aughhh" src="/sounds/AUGHHH.mp3" preload="auto"></audio>
<audio id="sound-alarm" src="/sounds/ALARM.mp3" preload="auto"></audio>
<audio id="sound-fart" src="/sounds/FART.mp3" preload="auto"></audio>
<audio id="sound-vineboom" src="/sounds/VINE BOOM.mp3" preload="auto"></audio>
<audio id="sound-whatdahell" src="/sounds/WHATDAHELL.mp3" preload="auto"></audio>
<audio id="sound-bonk" src="/sounds/Bonk Sound Effect.mp3" preload="auto"></audio>

<h1 class="mt-8 mb-10 text-center font-serif text-5xl font-semibold">
	Lorem Ipsum Dolor Sit Amet
</h1>

// Task Bar

<div class="relative">
	<div class="absolute z-10 left-1/2 top-12 -translate-x-1/2 flex w-[700px] items-center justify-between rounded-full bg-gray-200 px-4 py-2 shadow-md">
		<input
			class="flex-1 rounded-full border border-gray-400 bg-white px-4 py-2 text-lg font-semibold placeholder-gray-500 focus:outline-none"
			placeholder="Buy milk..."
			bind:value={temp}
			on:keydown={(e) => e.key === 'Enter' && add()}
		/>
		<div class="ml-4 flex space-x-2">
			<button class="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-900" on:click={add}>
				Create Task
			</button>
			<button class="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700" on:click={clear}>
				Delete All Tasks
			</button>
			<button class="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600" on:click={procrastinate}>
				Procrastinate
			</button>
		</div>
	</div>
</div>

// Three column layout

<div class="mx-auto pt-24 mt-20 flex max-w-6xl gap-8 px-6 items-start">
	<!-- 📝 To-Do List -->
	<section class="flex-1">
		<p class="mb-2 text-lg font-semibold">To-Do List</p>
		<ul class="space-y-2 text-sm">
	{#each todos as t}
		<li class="flex items-start gap-2 justify-between">
			<label class="flex items-start gap-2 flex-1">
				<input
					type="checkbox"
					class="mt-[3px]"
					checked={t.done}
					on:change={() => toggle(t.idx)}
				/>
				<div class:done={t.done}>
					<p class="font-semibold">{t.text}</p>
					<p class="text-xs">{t.desc}</p>
				</div>
			</label>
			<!-- ❌ Non-functional X Button -->
			<button
				class="text-red-500 hover:text-red-700 text-lg px-2"
				title="Nice try..."
				on:click={clear}
			>
				&times;
			</button>
		</li>
	{/each}
</ul>

	</section>

    // Alerts
	<section class="flex-1 space-y-4 max-h-[90vh] overflow-y-auto">
		{#each alerts as a (a.id)}
			<div class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm" in:fade out:fade>
				<button
					class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700"
					on:click={() => fadeOutAlert(a.id)}
				>
					&times;
				</button>
				<p class="mb-1 font-bold">{a.title}</p>
				<p class="text-sm">{a.message}</p>
				<button
					class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700"
					on:click={() => fadeOutAlert(a.id)}
				>
					Close
				</button>
			</div>
		{/each}
	</section>

	<!-- 🎥 Brainrot Video -->
	<aside class="flex-1 overflow-hidden rounded-3xl bg-gray-300 flex items-center justify-center">
		<video
			src="/brainrot.mp4"
			class="h-full w-full object-cover"
			autoplay
			muted
			loop
			controls
		></video>
	</aside>
</div>

<style>
	.done {
		text-decoration: line-through;
		color: #888;
	}
	.inverted {
		transform: rotate(180deg);
		filter: hue-rotate(180deg);
		transition: all 0.7s ease-in-out;
	}
</style>
