<script lang="ts">
	let {
		values,
		highlights
	}: { values: number[]; highlights: Record<string, number[]> } = $props();

	const max = $derived(Math.max(1, ...values.map((v) => Math.abs(v))));

	function colorFor(index: number): string {
		if (highlights.swapped?.includes(index)) return 'bg-rose-500';
		if (highlights.comparing?.includes(index)) return 'bg-amber-400';
		if (highlights.sorted?.includes(index)) return 'bg-emerald-500';
		return 'bg-sky-500';
	}
</script>

<div
	class="flex h-72 items-end gap-px rounded-lg border border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900"
	role="img"
	aria-label="Array values as bars"
>
	{#each values as value, i (i)}
		<div
			class="flex-1 rounded-t transition-colors {colorFor(i)}"
			style="height: {(Math.abs(value) / max) * 100}%"
			title={String(value)}
		></div>
	{/each}
</div>
