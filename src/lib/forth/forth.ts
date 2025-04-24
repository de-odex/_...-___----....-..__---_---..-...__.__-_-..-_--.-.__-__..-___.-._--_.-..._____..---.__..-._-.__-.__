import { onMount } from 'svelte';

import { browser } from '$app/environment';
import WAForth, { withLineBuffer } from "waforth";
import tasksSrc from '$lib/forth/tasks.fth?raw';


export async function boot() {
  if (!browser) return;

  // Initialize WAForth
  const forth = new WAForth();
  forth.onEmit = withLineBuffer((c) =>
    console.log(c)
  );
  await forth.load();



  // Bindings
  forth.bind("prompt", (stack) => {
    const message = stack.popString();
    const result = window.prompt(message);
    if (result === null) return
    stack.push(parseInt(result));
  });



  // Load Forth init code
  forth.interpret(tasksSrc)
}
