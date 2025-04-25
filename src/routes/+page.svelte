<script>
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	// hover roasts
	const 指止譏錄 = [
		'quit staring lil bro',
		'man can we FINISH THIS TASK ALREADY',
		'you straight up scrolled past me THREE TIMES',
		'im still unchecked lil bro',
		'you used to have potential',
		'ignored once again',
		'aint no way you doing me'
	];

	// doom tasks
	// 厄骰 dice of doom
	const 厄骰使令錄 = [
		'Delete your most used app',
		'Drink a glass of mystery water',
		'Sort your 1,000 unread emails',
		'Write a haiku about your guilt',
		'Unplug your router for no reason',
		"Do 3 squats and whisper 'discipline'",
		'Unfollow someone who posts gym selfies',
		'Shave an eyebrow (or pretend to)',
		'Apologize to your past self',
		'Touch a leaf and name it Steve'
		// Add more cursed tasks here
	];

	// labels
	const 標籤錄 = [
		'yo this task lowk weird',
		'man you gotta pick up yo slack',
		'are we being serious right neow',
		'fuck is you doing with yo life',
		'ongod you gotta lock in',
		'who the hell put you up to this',
		'JUST DO THIS TASK',
		'this one can wait ig',
		'this one canNOT wait',
		'im running out of labels'
	];

	// mystery tasks
	const 玄使令錄 = [
		'Touch grass',
		'Do 10 push-ups',
		'Go stare at the sun',
		"DM your ex 'just checking in'",
		'Open a book. Any book.'
	];

	// sound IDs
	const 聲號錄 = [
		'sound-oohmagah',
		'sound-aughhh',
		'sound-alarm',
		'sound-fart',
		'sound-vineboom',
		'sound-whatdahell',
		'sound-bonk'
	];

	// image pool
	const 圖檔名錄 = [
		'/images/brainrot1.jpg',
		'/images/brainrot2.jpg',
		'/images/brainrot3.jpg',
		'/images/brainrot4.jpg',
		'/images/brainrot5.jpg'
	];

	let todos = $state([]);
	let todoInput = $state('');
	let alerts = $state([]);

	// undefined
	let cursedTask = $state({});
	// undefined
	let inactivityTimer = $state({});
	let images = $state([]);
	let showCamera = $state(false);
	let energyLevel = $state(100);
	// undefined
	let camRef = $state({});
	// undefined
	let hoveredTaskIndex = $state({});

	// functions

	function showAlert(title, message) {
		const id = Date.now();
		alerts.push({ id, title, message });
		setTimeout(function () {
			fadeOutAlert(id);
		}, 5000);
	}

	function fadeOutAlert(id) {
		alerts = alerts.filter(function (a) {
			return a.id !== id;
		});
	}

	function add() {
		if (todoInput.trim().length < 3) {
			showAlert('此謬矣', '毋戲。此使令名太短也。');
			playRandomSound();
			return;
		}

		const randomLabel = 標籤錄[Math.floor(Math.random() * 標籤錄.length)];
		const isMystery = Math.random() < 0.02;
		const newTask = {
			idx: todos.length,
			done: false,
			text: isMystery ? '🎁 玄使令開啟矣' : todoInput,
			desc: isMystery ? '擊此以顯玄使令' : randomLabel,
			mystery: isMystery
		};
		todos = [...todos, newTask];
		if (!cursedTask) cursedTask = newTask;
		showAlert('新使令增矣', '友懈見擒，速攝心。');
		playRandomSound();
		showRandomImage();
		todoInput = '';
	}

	function toggle(idx) {
		todos = todos.map((t) => (t.idx === idx ? { ...t, done: !t.done } : t));
	}

	function clear() {
		showAlert('胡爾何其懈？', '謂之易若斯乎？');
		playRandomSound();
	}

	// brainrot

	function rollDoomDice() {
		const task = 厄骰使令錄[Math.floor(Math.random() * 厄骰使令錄.length)];
		const newTask = {
			idx: todos.length,
			done: false,
			text: '🎲 ' + task,
			desc: '厄骰既擲，行之勿怠。'
		};
		todos.push(newTask);
		showAlert('厄骰 🎲', '使令召至矣。');
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
					stream.getTracks().forEach((t) => t.stop());
				}, 4000);
			}
		} catch (err) {
			console.warn('Camera access denied or unavailable', err);
		}
	}

	function showRandomImage() {
		const randomImage = 圖檔名錄[Math.floor(Math.random() * 圖檔名錄.length)];
		const img = document.createElement('img');
		img.src = randomImage;
		img.alt = 'Brainrot image';
		img.style.position = 'absolute';
		img.style.top = (Math.random() * 90).toString() + '%';
		img.style.left = (Math.random() * 90).toString() + '%';
		img.style.width = '200px';
		img.style.zIndex = '10';
		img.style.transition = 'opacity 1s ease-in-out';

		document.body.appendChild(img);

		setTimeout(function () {
			img.style.opacity = '0';
			setTimeout(function () {
				document.body.removeChild(img);
			}, 1000);
		}, 2000);
	}

	function playRandomSound() {
		if (!browser) return;
		const id = 聲號錄[Math.floor(Math.random() * 聲號錄.length)];
		const el = document.getElementById(id);
		if (el) {
			el.volume = 0.5;
			el.currentTime = 0;
			el.play().catch(function (e) {
				console.error('Playback error:', e);
			});
		}
	}

	function revealMystery(idx) {
		todos = todos.map((t) =>
			t.idx === idx && t.mystery
				? {
						...t,
						text: 玄使令錄[Math.floor(Math.random() * 玄使令錄.length)],
						desc: '此即汝命。',
						mystery: false
					}
				: t
		);
		playRandomSound();
		showRandomImage();
	}

	function procrastinate() {
		showAlert('遷延之時', '且去小憩，吾輩俟汝。');
		playRandomSound();
	}

	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(function () {
			showAlert('汝尚在乎？', '十息未動，速攝心。');
			playRandomSound();
		}, 10000);
	}

	if (browser) {
		window.addEventListener('mousemove', resetInactivityTimer);
		window.addEventListener('keydown', resetInactivityTimer);
		resetInactivityTimer();
	}

	$effect(function () {
		if (
			cursedTask &&
			!todos.find(function (t) {
				return t.text === cursedTask.text;
			})
		) {
			var temp = Object.assign({}, cursedTask);
			temp.idx = todos.length;
			todos.push(temp);
			showAlert('善謀哉', '此咒使令不可刪。');
			playRandomSound();
		}
	});

	$effect(function () {
		const undone = todos.filter(function (t) {
			return !t.done;
		}).length;
		energyLevel = Math.max(0, 100 - undone * 10);
		if (energyLevel <= 30) triggerCameraShame();
	});
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
		class="h-5 rounded-full text-center text-xs leading-5 font-bold text-white transition-all duration-300"
		class:bg-red-500={energyLevel <= 30}
		class:bg-yellow-400={energyLevel <= 60 && energyLevel > 30}
		class:bg-green-400={energyLevel > 60}
		style="width: {energyLevel}%"
	>
		氣力猶存{energyLevel}%
	</div>
</div>

<h1 class="mb-10 text-center font-serif text-5xl font-semibold">未辦事目</h1>

<div class="relative">
	<div
		class="absolute top-12 left-1/2 z-10 flex w-[70%] -translate-x-1/2 items-center justify-between rounded-full bg-gray-200 px-4 py-2 shadow-md"
	>
		<input
			class="flex-1 rounded-full border border-gray-400 bg-white px-4 py-2 font-semibold placeholder-gray-500 focus:outline-none"
			placeholder="讀所定篇"
			bind:value={todoInput}
			onkeydown={(e) => e.key === 'Enter' && add()}
		/>
		<div class="ml-4 flex space-x-2">
			<button class="rounded-full bg-gray-800 px-3 py-1 text-white hover:bg-gray-900" onclick={add}>
				立任
			</button>
			<button class="rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700" onclick={clear}>
				刪諸任
			</button>
			<button
				class="rounded-full bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
				onclick={procrastinate}
			>
				遷延
			</button>
			<button
				class="rounded-full bg-purple-700 px-3 py-1 text-white hover:bg-purple-800"
				onclick={rollDoomDice}
			>
				擲厄骰 🎲
			</button>
		</div>
	</div>
</div>

<!-- ✅ THREE-COLUMN LAYOUT -->
<div class="mx-auto mt-20 flex max-w-6xl items-start gap-8 px-6 pt-24">
	<!-- 📝 To-Do List -->
	<section class="flex-1">
		<p class="mb-2 text-lg font-semibold">未辦事目</p>
		<ul class="space-y-2 text-sm">
			{#each todos as t, i}
				<li
					class="flex items-start justify-between gap-2"
					onmouseenter={() => (hoveredTaskIndex = i)}
					onmouseleave={() => (hoveredTaskIndex = null)}
				>
					<label class="flex flex-1 items-start gap-2">
						<input
							type="checkbox"
							class="mt-[3px]"
							checked={t.done}
							onchange={() => toggle(t.idx)}
						/>
						<div class:done={t.done}>
							<p class="font-semibold">{t.text}</p>
							<p class="text-xs">{t.desc}</p>
							{#if hoveredTaskIndex === i}
								<p class="text-[10px] text-red-500 italic">
									{指止譏錄[Math.floor(Math.random() * 指止譏錄.length)]}
								</p>
							{/if}
						</div>
					</label>
					<button class="px-2 text-lg text-red-500 hover:text-red-700" onclick={clear}>
						&times;
					</button>
				</li>
			{/each}
		</ul>
	</section>

	<!-- 🔔 Alerts -->
	<section class="max-h-[90vh] flex-1 space-y-4 overflow-y-auto">
		{#each alerts as a (a.id)}
			<div
				class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm"
				in:fade
				out:fade
			>
				<button
					class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700"
					onclick={() => fadeOutAlert(a.id)}>&times;</button
				>
				<p class="mb-1 font-bold">{a.title}</p>
				<p class="text-sm">{a.message}</p>
				<button
					class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700"
					onclick={() => fadeOutAlert(a.id)}
				>
					Close
				</button>
			</div>
		{/each}
	</section>

	<!-- 🎥 Brainrot Video -->
	<aside class="flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-gray-300">
		<video src="/brainrot.mp4" class="h-full w-full object-cover" autoplay muted loop controls
		></video>
	</aside>
</div>

<!-- 🪞 Camera Shame Overlay -->
{#if showCamera}
	<div
		class="fixed top-4 right-4 z-50 flex flex-col items-center space-y-2 rounded-xl border border-red-300 bg-white p-3 shadow-xl"
	>
		<video bind:this={camRef} autoplay playsinline class="h-32 w-40 rounded object-cover"></video>
		<p class="text-sm font-semibold text-red-500">
			This the face of someone who ain’t doin their tasks 💀
		</p>
	</div>
{/if}

<style>
	.done {
		text-decoration: line-through;
		color: #888;
	}
</style>
