import { describe, expect, test } from 'vitest';
import { SortingProblem } from './SortingProblem';

const sized = (n: number) => Array.from({ length: n }, (_, i) => i);

describe('SortingProblem', () => {
	test('getInitialState returns a copy', () => {
		const problem = new SortingProblem([3, 1, 2]);
		problem.getInitialState().push(99);
		expect(problem.getInitialState()).toEqual([3, 1, 2]);
	});

	test('constructor does not alias the input array', () => {
		const input = [3, 1, 2];
		const problem = new SortingProblem(input);
		input[0] = 100;
		expect(problem.getInitialState()).toEqual([3, 1, 2]);
	});

	test('validate accepts sizes 2 and 100', () => {
		expect(() => new SortingProblem(sized(2)).validate()).not.toThrow();
		expect(() => new SortingProblem(sized(100)).validate()).not.toThrow();
	});

	test('validate throws for size 1 and size 101', () => {
		expect(() => new SortingProblem(sized(1)).validate()).toThrow(/2.*100/);
		expect(() => new SortingProblem(sized(101)).validate()).toThrow(/2.*100/);
	});

	test('validate throws for NaN and Infinity', () => {
		expect(() => new SortingProblem([1, NaN]).validate()).toThrow(/finite/);
		expect(() => new SortingProblem([1, Infinity]).validate()).toThrow(/finite/);
	});

	test('random(n) produces n integers in 1..100 and passes validate', () => {
		const problem = SortingProblem.random(30);
		const values = problem.getInitialState();
		expect(values).toHaveLength(30);
		expect(values.every((v) => Number.isInteger(v) && v >= 1 && v <= 100)).toBe(true);
		expect(() => problem.validate()).not.toThrow();
	});
});
