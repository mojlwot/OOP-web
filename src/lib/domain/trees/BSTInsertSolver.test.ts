import { describe, expect, test } from 'vitest';
import { BSTInsertSolver } from './BSTInsertSolver';
import { TreeProblem } from './TreeProblem';
import { shuffledKeys } from './testing';
import { inorder } from './treeOps';

const solve = (keys: number[]) => new BSTInsertSolver().solve(new TreeProblem(keys));
const last = <T>(items: T[]) => items[items.length - 1];

describe('BSTInsertSolver', () => {
	test('starts from an empty tree with every key pending', () => {
		const first = solve([5, 3, 8])[0];
		expect(first.state.root).toBeNull();
		expect(first.state.pending).toEqual([5, 3, 8]);
	});

	test('ends with every key inserted and nothing pending', () => {
		const final = last(solve([5, 3, 8]));
		expect(final.state.pending).toEqual([]);
		expect(inorder(final.state.root)).toEqual([3, 5, 8]);
	});

	test('places smaller keys left and larger keys right', () => {
		const root = last(solve([5, 3, 8])).state.root!;
		expect(root.key).toBe(5);
		expect(root.left?.key).toBe(3);
		expect(root.right?.key).toBe(8);
	});

	test('highlights the visited path and the inserted node', () => {
		const steps = solve([10, 5]);
		expect(steps.some((s) => s.highlights.visiting?.includes(10))).toBe(true);
		expect(steps.some((s) => s.highlights.inserted?.includes(5))).toBe(true);
	});

	test('never rotates: sorted input becomes a chain', () => {
		const steps = solve([1, 2, 3]);
		expect(steps.some((s) => s.highlights.rotating)).toBe(false);
		const root = last(steps).state.root!;
		expect(root.key).toBe(1);
		expect(root.right?.key).toBe(2);
		expect(root.right?.right?.key).toBe(3);
		expect(root.height).toBe(3);
	});

	test('steps are independent snapshots', () => {
		const steps = solve([2, 1, 3]);
		const before = JSON.stringify(steps[3].state);
		steps[0].state.pending.push(999);
		last(steps).state.root!.key = 777;
		expect(JSON.stringify(steps[3].state)).toBe(before);
	});

	test('rejects duplicate keys through validate', () => {
		expect(() => solve([1, 2, 1])).toThrow();
	});

	test('random orders always yield a valid BST containing all keys', () => {
		for (let seed = 1; seed <= 20; seed++) {
			const keys = shuffledKeys(seed, 15);
			const sorted = [...keys].sort((a, b) => a - b);
			expect(inorder(last(solve(keys)).state.root)).toEqual(sorted);
		}
	});
});
