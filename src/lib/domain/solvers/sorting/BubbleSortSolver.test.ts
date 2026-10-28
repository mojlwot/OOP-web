import { describe, expect, test } from 'vitest';
import { SortingProblem } from '../../problems/SortingProblem';
import { BubbleSortSolver } from './BubbleSortSolver';
import { sortingSolvers } from './index';

const solve = (values: number[]) => new BubbleSortSolver().solve(new SortingProblem(values));
const last = <T>(items: T[]) => items[items.length - 1];

describe('BubbleSortSolver', () => {
	test('final step state is sorted ascending', () => {
		expect(last(solve([5, 1, 4, 2, 8])).state).toEqual([1, 2, 4, 5, 8]);
	});

	test('handles duplicates and negatives', () => {
		expect(last(solve([3, -1, 3, 0, -1])).state).toEqual([-1, -1, 0, 3, 3]);
	});

	test('already sorted input still ends fully marked sorted', () => {
		const final = last(solve([1, 2, 3, 4]));
		expect(final.state).toEqual([1, 2, 3, 4]);
		expect([...final.highlights.sorted].sort()).toEqual([0, 1, 2, 3]);
	});

	test('reversed input of size 5 produces the same step count on every run', () => {
		const a = solve([5, 4, 3, 2, 1]).length;
		const b = solve([5, 4, 3, 2, 1]).length;
		expect(a).toBe(b);
		expect(a).toBeGreaterThan(5);
	});

	test('steps are independent copies', () => {
		const steps = solve([3, 2, 1]);
		const before = [...steps[1].state];
		steps[0].state.push(999);
		expect(steps[1].state).toEqual(before);
	});

	test('final step highlights every index under sorted', () => {
		const final = last(solve([2, 1, 3]));
		expect([...final.highlights.sorted].sort()).toEqual([0, 1, 2]);
	});

	test('emits comparing and swapped highlights', () => {
		const steps = solve([2, 1]);
		expect(steps.some((s) => s.highlights.comparing?.length === 2)).toBe(true);
		expect(steps.some((s) => s.highlights.swapped?.length === 2)).toBe(true);
	});

	test("registry creates a BubbleSortSolver for 'bubble-sort'", () => {
		expect(sortingSolvers['bubble-sort']()).toBeInstanceOf(BubbleSortSolver);
	});
});
