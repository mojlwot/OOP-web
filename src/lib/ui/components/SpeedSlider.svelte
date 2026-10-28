<script lang="ts">
	let { speed, onchange }: { speed: number; onchange: (value: number) => void } = $props();
</script>

<label class="flex items-center gap-3 text-sm">
	Speed
	<input
		type="range"
		min="0.5"
		max="60"
		step="0.5"
		value={speed}
		oninput={(e) => onchange(Number(e.currentTarget.value))}
	/>
	<span class="w-20 tabular-nums">{speed} steps/s</span>
</label>
