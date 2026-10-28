import { describe, expect, test } from 'vitest';
import { TreeProblem } from './TreeProblem';

const keys = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe('TreeProblem', () => {
	test('initial state is an empty tree with every key pending', () => {
		expect(new TreeProblem([5, 3, 8]).getInitialState()).toEqual({ root: null, pending: [5, 3, 8] });
	});

	test('getInitialState returns a copy', () => {
		const problem = new TreeProblem([5, 3]);
		problem.getInitialState().pending.push(99);
		expect(problem.getInitialState().pending).toEqual([5, 3]);
	});

	test('validate accepts 1 and 15 keys', () => {
		expect(() => new TreeProblem(keys(1)).validate()).not.toThrow();
		expect(() => new TreeProblem(keys(15)).validate()).not.toThrow();
	});

	test('validate throws for 0 and 16 keys', () => {
		expect(() => new TreeProblem([]).validate()).toThrow(/1.*15/);
		expect(() => new TreeProblem(keys(16)).validate()).toThrow(/1.*15/);
	});

	test('validate throws for duplicate keys', () => {
		expect(() => new TreeProblem([1, 2, 1]).validate()).toThrow(/unique|duplicate/i);
	});

	test('validate throws for non-integer keys', () => {
		expect(() => new TreeProblem([1, 2.5]).validate()).toThrow(/integer/);
		expect(() => new TreeProblem([1, NaN]).validate()).toThrow(/integer/);
	});

	test('parse reads comma-separated integers with spaces', () => {
		expect(TreeProblem.parse(' 50, 30 ,20 ').getInitialState().pending).toEqual([50, 30, 20]);
	});

	test('parse rejects tokens that are not integers', () => {
		expect(() => TreeProblem.parse('1, two, 3')).toThrow(/integer/);
		expect(() => TreeProblem.parse('')).toThrow(/integer/);
	});

	test('random(n) gives n distinct keys that pass validate', () => {
		const problem = TreeProblem.random(10);
		const pending = problem.getInitialState().pending;
		expect(new Set(pending).size).toBe(10);
		expect(() => problem.validate()).not.toThrow();
	});
});
