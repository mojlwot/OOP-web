<script lang="ts">
	let {
		isPlaying,
		canPrev,
		canNext,
		onplay,
		onpause,
		onnext,
		onprev,
		onreset
	}: {
		isPlaying: boolean;
		canPrev: boolean;
		canNext: boolean;
		onplay: () => void;
		onpause: () => void;
		onnext: () => void;
		onprev: () => void;
		onreset: () => void;
	} = $props();

	const button =
		'rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-600 dark:hover:bg-slate-800';
</script>

<div class="flex flex-wrap gap-2">
	<button class={button} onclick={onprev} disabled={!canPrev}>Step Back</button>
	{#if isPlaying}
		<button class={button} onclick={onpause}>Pause</button>
	{:else}
		<button class={button} onclick={onplay}>Play</button>
	{/if}
	<button class={button} onclick={onnext} disabled={!canNext}>Step Next</button>
	<button class={button} onclick={onreset}>Reset</button>
</div>
