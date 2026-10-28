<script lang="ts">
	import type { VisualizerStep } from '$lib/domain/core/VisualizerStep';
	import { layoutTree } from '$lib/domain/trees/layoutTree';
	import type { TreeState } from '$lib/domain/trees/TreeState';

	let {
		step,
		showBalance = false
	}: { step: VisualizerStep<TreeState>; showBalance?: boolean } = $props();

	const CELL_X = 56;
	const CELL_Y = 68;
	const RADIUS = 18;
	const PAD = 30;

	const layout = $derived(layoutTree(step.state.root));
	const byKey = $derived(new Map(layout.nodes.map((n) => [n.key, n])));
	const px = (x: number) => PAD + x * CELL_X;
	const py = (y: number) => PAD + y * CELL_Y;
	const width = $derived(PAD * 2 + Math.max(layout.columns - 1, 0) * CELL_X);
	const height = $derived(PAD * 2 + Math.max(layout.depth - 1, 0) * CELL_Y);

	function fillFor(key: number): string {
		const h = step.highlights;
		if (h.unbalanced?.includes(key)) return 'fill-rose-500';
		if (h.rotating?.includes(key)) return 'fill-violet-500';
		if (h.inserted?.includes(key)) return 'fill-emerald-500';
		if (h.visiting?.includes(key)) return 'fill-amber-400';
		return 'fill-sky-500';
	}
</script>

<div
	class="rounded-lg border border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900"
>
	<div class="flex h-72 items-center justify-center">
		{#if layout.nodes.length === 0}
			<p class="text-sm text-slate-500">Empty tree</p>
		{:else}
			<svg
				viewBox="0 0 {width} {height}"
				class="max-h-full w-full overflow-visible"
				style="max-width: {width * 1.4}px"
				role="img"
				aria-label="Binary tree"
			>
				{#each layout.edges as edge (`${edge.from}-${edge.to}`)}
					{@const a = byKey.get(edge.from)!}
					{@const b = byKey.get(edge.to)!}
					<line
						x1={px(a.x)}
						y1={py(a.y)}
						x2={px(b.x)}
						y2={py(b.y)}
						class="stroke-slate-400"
						stroke-width="2"
					/>
				{/each}
				{#each layout.nodes as node (node.key)}
					<circle cx={px(node.x)} cy={py(node.y)} r={RADIUS} class={fillFor(node.key)} />
					<text
						x={px(node.x)}
						y={py(node.y)}
						text-anchor="middle"
						dominant-baseline="central"
						class="fill-white text-[13px] font-semibold"
					>
						{node.key}
					</text>
					{#if showBalance}
						<text
							x={px(node.x) + RADIUS + 2}
							y={py(node.y) - RADIUS + 2}
							class="fill-slate-600 text-[10px] dark:fill-slate-300"
						>
							{node.balanceFactor > 0 ? '+' : ''}{node.balanceFactor}
						</text>
					{/if}
				{/each}
			</svg>
		{/if}
	</div>
	<p class="mt-2 text-xs text-slate-600 dark:text-slate-300">
		Remaining keys: {step.state.pending.length ? step.state.pending.join(', ') : '—'}
	</p>
</div>
