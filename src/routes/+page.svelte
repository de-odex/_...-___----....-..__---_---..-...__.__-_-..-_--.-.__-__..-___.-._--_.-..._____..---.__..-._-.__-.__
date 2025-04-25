<script>
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	// hover roasts
	const 指止譏錄 = [
		'小弟，休凝視余',
		'此使可速竟乎？',
		'汝直三度略過余',
		'小弟，余尚未竟也',
		'昔汝有可為之才',
		'余復為人所忘',
		'汝休想竟我也'
	];

	// doom tasks
	// 厄骰 dice of doom
	const 厄骰使令錄 = [
		'刪常用用具',
		'飲一盞玄液',
		'整千封未閱書札',
		'以愧為題，作俳句',
		'無故斷導路器電源',
		'蹲身三度，低語「紀律」',
		'取消關注健身自拍之人',
		'剃眉一側，或詐剃之',
		'向昔我謝罪',
		'觸葉，名之史蒂夫'
		// Add more cursed tasks here
	];

	// labels
	const 標籤錄 = [
		'欤，此使微怪',
		'兄當補汝之懈怠',
		'今我等豈復正經邪？',
		'操，汝生當何為？',
		'實曰，汝必專注',
		'孰焉使汝行此？',
		'直行此使！',
		'此可姑待',
		'此不可待',
		'吾標將罄矣'
	];

	// mystery tasks
	const 玄使令錄 = [
		'出戶觸草',
		'俯伏挺身十遍',
		'仰瞻日輪',
		'馳簡舊愛曰『僅問安否』',
		'啓卷，任取其書'
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

	function 定時限(函式, 遲延) {
		setTimeout(函式, 遲延);
	}

	// show alert
	function 顯警示(題名, 書文) {
		// ^ title, message
		// id
		const 辨號 = Date.now();
		// ..., title, message
		警示錄.push({ 辨號: 辨號, 題名: 題名, 書文: 書文 });
		定時限(function () {
			漸隱警示(辨號);
		}, 5000);
	}

	// fade out alert
	function 漸隱警示(辨號) {
		// ^ id
		警示錄 = 警示錄.filter(function (a) {
			return a.辨號 !== 辨號;
		});
	}

	// add task
	function 增使令() {
		if (使令輸入.trim().length < 3) {
			顯警示('此謬矣', '毋戲。此使令名太短也。');
			播隨機聲();
			return;
		}
		// random label
		const 隨標 = 標籤錄[Math.floor(Math.random() * 標籤錄.length)];
		// is mystery
		const 玄否 = Math.random() < 0.02;
		// new task
		let 新使令 = {
			序: 待行使令錄.length, // idx
			既畢: false, // done
			文字: 使令輸入, // text
			敘述: 隨標, // desc
			玄否: 玄否 // mystery
		};
		if (玄否) {
			新使令.文字 = '🎁 玄使令開啟矣';
			新使令.敘述 = '擊此以顯玄使令';
		}
		待行使令錄.push(新使令);
		if (!咒使令) 咒使令 = 新使令;
		顯警示('新使令增矣', '友懈見擒，速攝心。');
		播隨機聲();
		顯隨機圖();
		使令輸入 = '';
	}

	// toggle task
	function 切換使令(序) {
		// ^ idx
		待行使令錄 = 待行使令錄.map(function (t) {
			if (t.序 === 序) {
				// temp
				var 暫存 = Object.assign({}, t);
				暫存.既畢 = !t.既畢;
				return 暫存;
			} else {
				return t;
			}
		});
	}

	// clear tasks
	function 清使令錄() {
		顯警示('胡爾何其懈？', '謂之易若斯乎？');
		播隨機聲();
	}

	// brainrot

	// roll doom dice
	function 擲厄骰() {
		// task
		const 使令 = 厄骰使令錄[Math.floor(Math.random() * 厄骰使令錄.length)];
		// new task
		const 新使令 = {
			序: 待行使令錄.length,
			既畢: false,
			文字: '🎲 ' + 使令,
			敘述: '厄骰既擲，行之勿怠。'
		};
		待行使令錄.push(新使令);
		顯警示('厄骰 🎲', '使令召至矣。');
		播隨機聲();
		顯隨機圖();
	}

	// trigger camera of shame
	async function 發恥鏡() {
		if (!browser) return;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			顯攝機 = true;

			// Wait a tick to let <video> mount
			await tick();

			if (攝機指) {
				攝機指.srcObject = stream;

				定時限(function () {
					顯攝機 = false;
					stream.getTracks().forEach(function (t) {
						t.stop();
					});
				}, 4000);
			}
		} catch (err) {
			console.warn('Camera access denied or unavailable', err);
		}
	}

	// show random image
	function 顯隨機圖() {
		// random image
		const 隨圖 = 圖檔名錄[Math.floor(Math.random() * 圖檔名錄.length)];
		// image
		const 圖 = document.createElement('img');
		圖.src = 隨圖;
		圖.alt = 'Brainrot image';
		圖.style.position = 'absolute';
		圖.style.top = Math.random() * 90 + '%';
		圖.style.left = Math.random() * 90 + '%';
		圖.style.width = '200px';
		圖.style.zIndex = '10';
		圖.style.transition = 'opacity 1s ease-in-out';

		document.body.appendChild(圖);

		定時限(function () {
			圖.style.opacity = '0';
			定時限(function () {
				document.body.removeChild(圖);
			}, 1000);
		}, 2000);
	}

	// play random sound
	function 播隨機聲() {
		if (!browser) return;
		// ID
		const 辨號 = 聲號錄[Math.floor(Math.random() * 聲號錄.length)];
		// element
		const 素 = document.getElementById(辨號);
		if (素) {
			素.volume = 0.5;
			素.currentTime = 0;
			素.play().catch(function (e) {
				console.error('Playback error:', e);
			});
		}
	}

	// reveal mystery task
	function 顯玄使令(序) {
		// ^ idx
		待行使令錄 = 待行使令錄.map(function (t) {
			if (t.序 === 序 && t.玄否) {
				// temp
				var 暫存 = Object.assign({}, t);
				暫存.文字 = 玄使令錄[Math.floor(Math.random() * 玄使令錄.length)];
				暫存.敘述 = '此即汝命。';
				暫存.玄否 = false;
				return 暫存;
			} else {
				return t;
			}
		});
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
		懈時計 = 定時限(function () {
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
				return t.文字 === 咒使令.文字;
			})
		) {
			// temp
			var 暫存 = Object.assign({}, 咒使令);
			暫存.序 = 待行使令錄.length;
			待行使令錄.push(暫存);
			顯警示('善謀哉', '此咒使令不可刪。');
			播隨機聲();
		}
	});

	$effect(function () {
		const 未畢 = 待行使令錄.filter(function (t) {
			return !t.既畢;
		}).length;
		氣值 = Math.max(0, 100 - 未畢 * 10);
		if (氣值 <= 30) 發恥鏡();
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
							checked={t.既畢}
							onchange={() => 切換使令(t.序)}
						/>
						<div class:既畢={t.既畢}>
							<p class="font-semibold">{t.文字}</p>
							<p class="text-xs">{t.敘述}</p>
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
		{#each 警示錄 as a (a.辨號)}
			<div
				class="relative rounded-md border border-red-300 bg-red-100 p-4 shadow-sm"
				in:fade
				out:fade
			>
				<button
					class="absolute top-2 right-2 text-lg leading-none text-red-500 hover:text-red-700"
					onclick={() => 漸隱警示(a.辨號)}>&times;</button
				>
				<p class="mb-1 font-bold">{a.題名}</p>
				<p class="text-sm">{a.書文}</p>
				<button
					class="mt-3 rounded bg-red-600 px-4 py-1 text-xs text-white hover:bg-red-700"
					onclick={() => 漸隱警示(a.辨號)}
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
	.既畢 {
		text-decoration: line-through;
		color: #888;
	}
</style>
