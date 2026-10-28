import type { Component } from 'svelte';
import type { Problem } from '$lib/domain/core/Problem';
import type { Solver } from '$lib/domain/core/Solver';
import type { VisualizerStep } from '$lib/domain/core/VisualizerStep';
import { SortingProblem } from '$lib/domain/problems/SortingProblem';
import { sortingSolvers } from '$lib/domain/solvers/sorting';
import { ALL_ROTATIONS_KEYS } from '$lib/domain/trees/demoKeys';
import { avlSolvers, bstSolvers } from '$lib/domain/trees';
import { TreeProblem } from '$lib/domain/trees/TreeProblem';
import type { TreeState } from '$lib/domain/trees/TreeState';
import SortingView from './components/SortingView.svelte';
import TreeView from './components/TreeView.svelte';

/** One entry of the category menu: how to build a problem, which solvers apply, how to draw a step. */
export interface Category<TState> {
	id: string;
	label: string;
	inputLabel: string;
	defaultInput: string;
	solvers: Record<string, () => Solver<TState>>;
	createProblem(input: string): Problem<TState>;
	/** Next value for the input box when the user asks for a new random instance. */
	randomInput(current: string): string;
	view: Component<{ step: VisualizerStep<TState> }>;
	viewProps?: Record<string, unknown>;
}

const keyCount = (input: string) => {
	const n = input.split(',').length;
	return Math.min(15, Math.max(1, n));
};

const sorting: Category<number[]> = {
	id: 'sorting',
	label: 'Sorting',
	inputLabel: 'Size',
	defaultInput: '30',
	solvers: sortingSolvers,
	createProblem: (input) => SortingProblem.random(Number(input)),
	randomInput: (current) => current,
	view: SortingView
};

const treeBase = {
	inputLabel: 'Keys',
	defaultInput: ALL_ROTATIONS_KEYS.join(','),
	createProblem: (input: string) => TreeProblem.parse(input),
	randomInput: (current: string) => TreeProblem.random(keyCount(current)).getInitialState().pending.join(','),
	view: TreeView
};

const bst: Category<TreeState> = {
	...treeBase,
	id: 'bst',
	label: 'BST',
	solvers: bstSolvers,
	viewProps: { showBalance: false }
};

const avl: Category<TreeState> = {
	...treeBase,
	id: 'avl',
	label: 'AVL',
	solvers: avlSolvers,
	viewProps: { showBalance: true }
};

// The page treats every category through the same interface, whatever its state type.
export const categories: Category<any>[] = [sorting, bst, avl];
