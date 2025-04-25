<script>
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	let recentVagueTasks = [];
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

		const isVague = temp.trim().length < 10;
		if (isVague) {
			recentVagueTasks.push(temp.trim());
			if (recentVagueTasks.length >= 5) {
				todos = todos.slice(0, -5);
				recentVagueTasks = [];
				compressTasks();
				return;
			}
		} else {
			recentVagueTasks = [];
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

	function compressTasks() {
		const compressed = {
			idx: todos.length,
			done: false,
			text: "Figure your life out before you continue like wtf man",
			desc: "this what yo tasks think about you"
		};
		todos = [...todos.slice(0, -5), compressed];
		showAlert("compression mode activated", "your vague ass tasks is now 1 entity");
		playRandomSound();
		showRandomImage();
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
