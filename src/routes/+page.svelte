<script lang="ts">
	import { onDestroy } from 'svelte';
	import { categories } from '$lib/ui/categories';
	import { createPlayback } from '$lib/ui/state/playback.svelte';
	import Controls from '$lib/ui/components/Controls.svelte';
	import SpeedSlider from '$lib/ui/components/SpeedSlider.svelte';

	let categoryId = $state(categories[0].id);
	let algorithmId = $state(Object.keys(categories[0].solvers)[0]);
	let input = $state(categories[0].defaultInput);
	let error = $state('');
	let playback = $state.raw<ReturnType<typeof createPlayback<unknown>> | null>(null);

	const category = $derived(categories.find((c) => c.id === categoryId)!);

	function rebuild() {
		playback?.dispose();
		playback = null;
		error = '';
		try {
			const problem = category.createProblem(input);
			const steps = category.solvers[algorithmId]().solve(problem);
			playback = createPlayback(steps);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function selectCategory(id: string) {
		categoryId = id;
		algorithmId = Object.keys(category.solvers)[0];
		input = category.defaultInput;
		rebuild();
	}

	function regenerate() {
		input = category.randomInput(input);
		rebuild();
	}

	rebuild();
	onDestroy(() => playback?.dispose());

	const tab =
		'rounded-md px-3 py-1.5 text-sm font-medium border border-slate-300 dark:border-slate-600';
</script>

<main class="mx-auto max-w-3xl space-y-4 p-4">
	<h1 class="text-2xl font-semibold">Algorithm Visualizer</h1>

	<div class="flex gap-2" role="tablist" aria-label="Category">
		{#each categories as c (c.id)}
			<button
				role="tab"
				aria-selected={c.id === categoryId}
				class="{tab} {c.id === categoryId
					? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
					: 'hover:bg-slate-100 dark:hover:bg-slate-800'}"
				onclick={() => selectCategory(c.id)}>{c.label}</button
			>
		{/each}
	</div>

	<div class="flex flex-wrap items-end gap-4">
		<label class="text-sm">
			Algorithm
			<select
				class="ml-2 rounded-md border border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600"
				bind:value={algorithmId}
				onchange={rebuild}
			>
				{#each Object.entries(category.solvers) as [id, create] (id)}
					<option value={id}>{create().name}</option>
				{/each}
			</select>
		</label>
		<label class="text-sm">
			{category.inputLabel}
			<input
				class="ml-2 rounded-md border border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600 {categoryId ===
				'sorting'
					? 'w-20'
					: 'w-56'}"
				type="text"
				bind:value={input}
				onchange={rebuild}
			/>
		</label>
		<button
			class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
			onclick={regenerate}>{categoryId === 'sorting' ? 'New array' : 'Random keys'}</button
		>
	</div>

	{#if error}
		<p
			role="alert"
			class="rounded-md bg-rose-100 p-3 text-sm text-rose-800 dark:bg-rose-950 dark:text-rose-200"
		>
			{error}
		</p>
	{/if}

	{#if playback?.current}
		{@const View = category.view}
		<View step={playback.current} {...category.viewProps} />
		<p class="text-sm tabular-nums">
			Step {playback.index + 1} / {playback.length} — {playback.current.description}
		</p>
		<Controls
			isPlaying={playback.isPlaying}
			canPrev={playback.index > 0}
			canNext={playback.index < playback.length - 1}
			onplay={playback.play}
			onpause={playback.pause}
			onnext={playback.next}
			onprev={playback.prev}
			onreset={playback.reset}
		/>
		<SpeedSlider speed={playback.speed} onchange={playback.setSpeed} />
	{/if}
</main>
