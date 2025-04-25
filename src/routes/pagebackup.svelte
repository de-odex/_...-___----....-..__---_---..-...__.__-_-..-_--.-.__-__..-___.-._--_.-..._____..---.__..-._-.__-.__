<script>
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';


	let showCamera = false;
	let energyLevel = 100;
	let camRef;
	let hoveredTaskIndex = null;

	const hoverRoasts = [
	"quit staring lil bro",
	"man can we FINISH THIS TASK ALREADY",
	"you straight up scrolled past me THREE TIMES",
	"im still unchecked lil bro",
	"you used to have potential",
	"ignored once again",
	"aint no way you doing me",
];
	
	const doomTasks = [
	"Delete your most used app",
	"Drink a glass of mystery water",
	"Sort your 1,000 unread emails",
	"Write a haiku about your guilt",
	"Unplug your router for no reason",
	"Do 3 squats and whisper 'discipline'",
	"Unfollow someone who posts gym selfies",
	"Shave an eyebrow (or pretend to)",
	"Apologize to your past self",
	"Touch a leaf and name it Steve"
	// Add more cursed tasks here
];
	function rollDoomDice() {
	const task = doomTasks[Math.floor(Math.random() * doomTasks.length)];
	const newTask = {
		idx: todos.length,
		done: false,
		text: `🎲 ${task}`,
		desc: "You rolled the dice. Now do it."
	};
	todos = [...todos, newTask];
	showAlert("DICE OF DOOM 🎲", "A task has been summoned.");
	playRandomSound();
	showRandomImage();
}


	async function triggerCameraShame() {
	if (!browser) return;

	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		showCamera = true;

		// Wait a tick to let <video> mount
		await tick();

		if (camRef) {
			camRef.srcObject = stream;

			setTimeout(() => {
				showCamera = false;
				stream.getTracks().forEach(t => t.stop());
			}, 4000);
		}
	} catch (err) {
		console.warn("Camera access denied or unavailable", err);
	}
}


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
	
	let todos = [];
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

	const imagePool = [
		"/images/brainrot1.jpg",
		"/images/brainrot2.jpg",
		"/images/brainrot3.jpg",
		"/images/brainrot4.jpg",
		"/images/brainrot5.jpg"
	];

	function showRandomImage() {
		const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
		const img = document.createElement('img');
		img.src = randomImage;
		img.alt = "Brainrot image";
		img.style.position = "absolute";
		img.style.top = `${Math.random() * 90}%`;
		img.style.left = `${Math.random() * 90}%`;
		img.style.width = "200px";
		img.style.zIndex = "10";
		img.style.transition = "opacity 1s ease-in-out";

		document.body.appendChild(img);

		setTimeout(() => {
			img.style.opacity = 0;
			setTimeout(() => {
				document.body.removeChild(img);
			}, 1000);
		}, 2000);
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
		showRandomImage();
		temp = '';
	}

	function revealMystery(idx) {
		todos = todos.map(t =>
			t.idx === idx && t.mystery
				? { ...t, text: mysteryTasks[Math.floor(Math.random() * mysteryTasks.length)], desc: 'This is your fate', mystery: false }
				: t
		);
		playRandomSound();
		showRandomImage();
	}

	function toggle(idx) {
		todos = todos.map((t) => t.idx === idx ? { ...t, done: !t.done } : t);
	}

	function clear() {
		showAlert('Why you so lazy buddy', 'You think it would be that easy?');
		playRandomSound();
	}

	function procrastinate() {
		showAlert('Procrastination Time', 'Go take a nap. We’ll wait.');
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

	$: {
		const undone = todos.filter(t => !t.done).length;
		energyLevel = Math.max(0, 100 - undone * 10);
		if (energyLevel <= 30) triggerCameraShame();
	}
</script>

<audio id="sound-oohmagah" src="/sounds/OOHMAGAH.mp3" preload="auto"></audio>
<audio id="sound-aughhh" src="/sounds/AUGHHH.mp3" preload="auto"></audio>
<audio id="sound-alarm" src="/sounds/ALARM.mp3" preload="auto"></audio>
<audio id="sound-fart" src="/sounds/FART.mp3" preload="auto"></audio>
<audio id="sound-vineboom" src="/sounds/VINE BOOM.mp3" preload="auto"></audio>
<audio id="sound-whatdahell" src="/sounds/WHATDAHELL.mp3" preload="auto"></audio>
<audio id="sound-bonk" src="/sounds/Bonk Sound Effect.mp3" preload="auto"></audio>

<!-- 🧃 Energy Meter -->
<div class="mx-auto mt-8 w-64 rounded-full bg-gray-200 p-1 shadow-inner">
	<div
		class="h-5 rounded-full text-center text-xs font-bold leading-5 text-white transition-all duration-300"
		class:bg-red-500={energyLevel <= 30}
		class:bg-yellow-400={energyLevel <= 60 && energyLevel > 30}
		class:bg-green-400={energyLevel > 60}
		style="width: {energyLevel}%"
	>
		{energyLevel}% Energy
	</div>
</div>

<h1 class="mb-10 text-center font-serif text-5xl font-semibold">
	Lorem Ipsum Dolor Sit Amet
</h1>

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
			<button class="rounded bg-purple-700 px-3 py-1 text-white hover:bg-purple-800" on:click={rollDoomDice}>
				Dice of Doom 🎲
			</button>
		</div>
	</div>
</div>

<!-- ✅ THREE-COLUMN LAYOUT -->
<div class="mx-auto pt-24 mt-20 flex max-w-6xl gap-8 px-6 items-start">
	<!-- 📝 To-Do List -->
	<section class="flex-1">
		<p class="mb-2 text-lg font-semibold">To-Do List</p>
		<ul class="space-y-2 text-sm">
	{#each todos as t, i}
	<li
		class="flex items-start gap-2 justify-between"
		on:mouseenter={() => hoveredTaskIndex = i}
		on:mouseleave={() => hoveredTaskIndex = null}
	>
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
				{#if hoveredTaskIndex === i}
					<p class="text-[10px] italic text-red-500">
						{hoverRoasts[Math.floor(Math.random() * hoverRoasts.length)]}
					</p>
				{/if}
			</div>
		</label>
		<button class="text-red-500 hover:text-red-700 text-lg px-2" on:click={clear}>
			&times;
		</button>
	</li>
{/each}

		</ul>
	</section>

	<!-- 🔔 Alerts -->
	<section class="flex-1 space-y-4 max-h-[90vh] overflow-y-auto">
		{#each alerts as a (a.id)}
			<div class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm" in:fade out:fade>
				<button class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700" on:click={() => fadeOutAlert(a.id)}>&times;</button>
				<p class="mb-1 font-bold">{a.title}</p>
				<p class="text-sm">{a.message}</p>
				<button class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700" on:click={() => fadeOutAlert(a.id)}>
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

<!-- 🪞 Camera Shame Overlay -->
{#if showCamera}
	<div class="fixed top-4 right-4 z-50 flex flex-col items-center space-y-2 rounded-xl border border-red-300 bg-white p-3 shadow-xl">
		<video bind:this={camRef} autoplay playsinline class="w-40 h-32 object-cover rounded"></video>
		<p class="text-sm text-red-500 font-semibold">This the face of someone who ain’t doin their tasks 💀</p>
	</div>
{/if}

<style>
	.done {
		text-decoration: line-through;
		color: #888;
	}
</style>
