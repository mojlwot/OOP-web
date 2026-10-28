<script lang="ts">
	import type { VisualizerStep } from '$lib/domain/core/VisualizerStep';
	import ArrayBars from './ArrayBars.svelte';

	let { step }: { step: VisualizerStep<number[]> } = $props();
</script>

<ArrayBars values={step.state} highlights={step.highlights} />
