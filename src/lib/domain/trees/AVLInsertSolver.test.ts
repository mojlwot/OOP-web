import { describe, expect, test } from 'vitest';
import { AVLInsertSolver } from './AVLInsertSolver';
import { TreeProblem } from './TreeProblem';
import { shuffledKeys } from './testing';
import type { TreeNode } from './TreeState';
import { balanceFactor, inorder } from './treeOps';

const solve = (keys: number[]) => new AVLInsertSolver().solve(new TreeProblem(keys));
const last = <T>(items: T[]) => items[items.length - 1];
const indexOfDescription = (steps: { description: string }[], pattern: RegExp) =>
	steps.findIndex((s) => pattern.test(s.description));

function assertAvl(node: TreeNode | null): number {
	if (!node) return 0;
	const l = assertAvl(node.left);
	const r = assertAvl(node.right);
	expect(Math.abs(l - r)).toBeLessThanOrEqual(1);
	expect(node.height).toBe(1 + Math.max(l, r));
	return node.height;
}

describe('AVLInsertSolver', () => {
	test('no rotation when the tree stays balanced', () => {
		const steps = solve([20, 10, 30]);
		expect(steps.some((s) => s.highlights.unbalanced)).toBe(false);
		expect(steps.some((s) => s.highlights.rotating)).toBe(false);
	});

	test('LL case: flags 30, rotates right at 30, root becomes 20', () => {
		const steps = solve([30, 20, 10]);
		const flagged = steps.find((s) => s.highlights.unbalanced);
		expect(flagged?.highlights.unbalanced).toEqual([30]);
		expect(flagged?.description).toMatch(/LL/);
		const rotation = steps.find((s) => /Rotate right at 30/.test(s.description));
		expect(rotation?.highlights.rotating).toContain(30);
		const root = last(steps).state.root!;
		expect([root.key, root.left?.key, root.right?.key]).toEqual([20, 10, 30]);
	});

	test('RR case: flags 10, rotates left at 10, root becomes 20', () => {
		const steps = solve([10, 20, 30]);
		const flagged = steps.find((s) => s.highlights.unbalanced);
		expect(flagged?.highlights.unbalanced).toEqual([10]);
		expect(flagged?.description).toMatch(/RR/);
		expect(steps.some((s) => /Rotate left at 10/.test(s.description))).toBe(true);
		const root = last(steps).state.root!;
		expect([root.key, root.left?.key, root.right?.key]).toEqual([20, 10, 30]);
	});

	test('LR case: rotates left at 10 first, then right at 30', () => {
		const steps = solve([30, 10, 20]);
		expect(steps.find((s) => s.highlights.unbalanced)?.description).toMatch(/LR/);
		const first = indexOfDescription(steps, /Rotate left at 10/);
		const second = indexOfDescription(steps, /Rotate right at 30/);
		expect(first).toBeGreaterThan(-1);
		expect(second).toBeGreaterThan(first);
		const mid = steps[first].state.root!;
		expect([mid.key, mid.left?.key]).toEqual([30, 20]);
		expect(mid.left?.left?.key).toBe(10);
		const root = last(steps).state.root!;
		expect([root.key, root.left?.key, root.right?.key]).toEqual([20, 10, 30]);
	});

	test('RL case: rotates right at 30 first, then left at 10', () => {
		const steps = solve([10, 30, 20]);
		expect(steps.find((s) => s.highlights.unbalanced)?.description).toMatch(/RL/);
		const first = indexOfDescription(steps, /Rotate right at 30/);
		const second = indexOfDescription(steps, /Rotate left at 10/);
		expect(first).toBeGreaterThan(-1);
		expect(second).toBeGreaterThan(first);
		const root = last(steps).state.root!;
		expect([root.key, root.left?.key, root.right?.key]).toEqual([20, 10, 30]);
	});

	test('rotation below the root re-links the parent', () => {
		// 50,30,70 then 20,10 -> imbalance at 30 (LL), parent 50 must point at 20
		const root = last(solve([50, 30, 70, 20, 10])).state.root!;
		expect(root.key).toBe(50);
		expect(root.left?.key).toBe(20);
		expect(root.left?.left?.key).toBe(10);
		expect(root.left?.right?.key).toBe(30);
	});

	test('sorted input stays balanced (height 4 for 15 keys)', () => {
		const keys = Array.from({ length: 15 }, (_, i) => i + 1);
		const root = last(solve(keys)).state.root!;
		expect(root.height).toBe(4);
		expect(balanceFactor(root)).toBe(0);
	});

	test('random orders end as a valid, balanced BST with correct heights', () => {
		for (let seed = 1; seed <= 30; seed++) {
			const keys = shuffledKeys(seed, 15);
			const root = last(solve(keys)).state.root;
			expect(inorder(root)).toEqual([...keys].sort((a, b) => a - b));
			assertAvl(root);
		}
	});

	test('every intermediate snapshot after a rotation step is a valid BST', () => {
		const steps = solve(shuffledKeys(7, 12));
		for (const step of steps) {
			const keys = inorder(step.state.root);
			expect(keys).toEqual([...keys].sort((a, b) => a - b));
		}
	});

	test('rejects duplicate keys through validate', () => {
		expect(() => solve([3, 3])).toThrow();
	});
});
