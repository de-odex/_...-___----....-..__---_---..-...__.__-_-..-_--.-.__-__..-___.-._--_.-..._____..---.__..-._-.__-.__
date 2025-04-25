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

	// todos
	let 待行使令錄 = $state([]);
	// todo input
	let 使令輸入 = $state('');
	// alerts
	let 警示錄 = $state([]);

	// cursed task, undefined
	let 咒使令 = $state(null);
	// inactivity timer, undefined
	let 懈時計 = $state(null);
	// images
	let 圖錄 = $state([]);
	// show camera
	let 顯攝機 = $state(false);
	// energy level
	let 氣值 = $state(100);
	// camera reference, undefined
	let 攝機指 = $state(null);
	// hover task index, undefined
	let 指止使令序 = $state(null);

	// functions

	// show alert
	function 顯警示(title, message) {
		const id = Date.now();
		警示錄.push({ id, title, message });
		setTimeout(function () {
			漸隱警示(id);
		}, 5000);
	}

	// fade out alert
	function 漸隱警示(id) {
		警示錄 = 警示錄.filter(function (a) {
			return a.id !== id;
		});
	}

	// add task
	function 增使令() {
		if (使令輸入.trim().length < 3) {
			顯警示('此謬矣', '毋戲。此使令名太短也。');
			播隨機聲();
			return;
		}

		const randomLabel = 標籤錄[Math.floor(Math.random() * 標籤錄.length)];
		const isMystery = Math.random() < 0.02;
		const newTask = {
			idx: 待行使令錄.length,
			done: false,
			text: isMystery ? '🎁 玄使令開啟矣' : 使令輸入,
			desc: isMystery ? '擊此以顯玄使令' : randomLabel,
			mystery: isMystery
		};
		待行使令錄 = [...待行使令錄, newTask];
		if (!咒使令) 咒使令 = newTask;
		顯警示('新使令增矣', '友懈見擒，速攝心。');
		播隨機聲();
		顯隨機圖();
		使令輸入 = '';
	}

	// toggle task
	function 切換使令(idx) {
		待行使令錄 = 待行使令錄.map((t) => (t.idx === idx ? { ...t, done: !t.done } : t));
	}

	// clear tasks
	function 清使令錄() {
		顯警示('胡爾何其懈？', '謂之易若斯乎？');
		播隨機聲();
	}

	// brainrot

	// roll doom dice
	function 擲厄骰() {
		const task = 厄骰使令錄[Math.floor(Math.random() * 厄骰使令錄.length)];
		const newTask = {
			idx: 待行使令錄.length,
			done: false,
			text: '🎲 ' + task,
			desc: '厄骰既擲，行之勿怠。'
		};
		待行使令錄.push(newTask);
		顯警示('厄骰 🎲', '使令召至矣。');
		播隨機聲();
		顯隨機圖();
	}

	async function triggerCameraShame() {
		if (!browser) return;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			顯攝機 = true;

			// Wait a tick to let <video> mount
			await tick();

			if (攝機指) {
				攝機指.srcObject = stream;

				setTimeout(() => {
					顯攝機 = false;
					stream.getTracks().forEach((t) => t.stop());
				}, 4000);
			}
		} catch (err) {
			console.warn('Camera access denied or unavailable', err);
		}
	}

	// show random image
	function 顯隨機圖() {
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

	// play random sound
	function 播隨機聲() {
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

	// reveal mystery task
	function 顯玄使令(idx) {
		待行使令錄 = 待行使令錄.map((t) =>
			t.idx === idx && t.mystery
				? {
						...t,
						text: 玄使令錄[Math.floor(Math.random() * 玄使令錄.length)],
						desc: '此即汝命。',
						mystery: false
					}
				: t
		);
		播隨機聲();
		顯隨機圖();
	}

	// procrastinate
	function 遷延() {
		顯警示('遷延之時', '且去小憩，吾輩俟汝。');
		播隨機聲();
	}

	// reset inactivity timer
	function 復懈時計() {
		clearTimeout(懈時計);
		懈時計 = setTimeout(function () {
			顯警示('汝尚在乎？', '十息未動，速攝心。');
			播隨機聲();
		}, 10000);
	}

	if (browser) {
		window.addEventListener('mousemove', 復懈時計);
		window.addEventListener('keydown', 復懈時計);
		復懈時計();
	}

	$effect(function () {
		if (
			咒使令 &&
			!待行使令錄.find(function (t) {
				return t.text === 咒使令.text;
			})
		) {
			var temp = Object.assign({}, 咒使令);
			temp.idx = 待行使令錄.length;
			待行使令錄.push(temp);
			顯警示('善謀哉', '此咒使令不可刪。');
			播隨機聲();
		}
	});

	$effect(function () {
		const undone = 待行使令錄.filter(function (t) {
			return !t.done;
		}).length;
		氣值 = Math.max(0, 100 - undone * 10);
		if (氣值 <= 30) triggerCameraShame();
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
		class:bg-red-500={氣值 <= 30}
		class:bg-yellow-400={氣值 <= 60 && 氣值 > 30}
		class:bg-green-400={氣值 > 60}
		style="width: {氣值}%"
	>
		氣力猶存{氣值}%
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
			bind:value={使令輸入}
			onkeydown={(e) => e.key === 'Enter' && 增使令()}
		/>
		<div class="ml-4 flex space-x-2">
			<button
				class="rounded-full bg-gray-800 px-3 py-1 text-white hover:bg-gray-900"
				onclick={增使令}
			>
				立任
			</button>
			<button
				class="rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700"
				onclick={清使令錄}
			>
				刪諸任
			</button>
			<button
				class="rounded-full bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
				onclick={遷延}
			>
				遷延
			</button>
			<button
				class="rounded-full bg-purple-700 px-3 py-1 text-white hover:bg-purple-800"
				onclick={擲厄骰}
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
			{#each 待行使令錄 as t, i}
				<li
					class="flex items-start justify-between gap-2"
					onmouseenter={() => (指止使令序 = i)}
					onmouseleave={() => (指止使令序 = null)}
				>
					<label class="flex flex-1 items-start gap-2">
						<input
							type="checkbox"
							class="mt-[3px]"
							checked={t.done}
							onchange={() => 切換使令(t.idx)}
						/>
						<div class:done={t.done}>
							<p class="font-semibold">{t.text}</p>
							<p class="text-xs">{t.desc}</p>
							{#if 指止使令序 === i}
								<p class="text-[10px] text-red-500 italic">
									{指止譏錄[Math.floor(Math.random() * 指止譏錄.length)]}
								</p>
							{/if}
						</div>
					</label>
					<button class="px-2 text-lg text-red-500 hover:text-red-700" onclick={清使令錄}>
						&times;
					</button>
				</li>
			{/each}
		</ul>
	</section>

	<!-- 🔔 Alerts -->
	<section class="max-h-[90vh] flex-1 space-y-4 overflow-y-auto">
		{#each 警示錄 as a (a.id)}
			<div
				class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm"
				in:fade
				out:fade
			>
				<button
					class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700"
					onclick={() => 漸隱警示(a.id)}>&times;</button
				>
				<p class="mb-1 font-bold">{a.title}</p>
				<p class="text-sm">{a.message}</p>
				<button
					class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700"
					onclick={() => 漸隱警示(a.id)}
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
{#if 顯攝機}
	<div
		class="fixed top-4 right-4 z-50 flex flex-col items-center space-y-2 rounded-xl border border-red-300 bg-white p-3 shadow-xl"
	>
		<video bind:this={攝機指} autoplay playsinline class="h-32 w-40 rounded object-cover"></video>
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
