import { describe, expect, test } from 'vitest';
import type { Problem } from './Problem';
import { Solver } from './Solver';
import type { VisualizerStep } from './VisualizerStep';

class StubProblem implements Problem<number[]> {
	readonly id = 'stub';
	validated = false;
	constructor(private readonly shouldThrow = false) {}
	getInitialState() {
		return [1, 2];
	}
	validate() {
		this.validated = true;
		if (this.shouldThrow) throw new Error('invalid');
	}
}

class CountSolver extends Solver<number[]> {
	readonly name = 'Count';
	started = false;
	protected *run(problem: Problem<number[]>): Generator<VisualizerStep<number[]>> {
		this.started = true;
		yield { state: problem.getInitialState(), highlights: {}, description: 'first' };
		yield { state: [2, 1], highlights: { swapped: [0, 1] }, description: 'second' };
	}
}

describe('Solver.solve', () => {
	test('returns every step yielded by run() in order', () => {
		const steps = new CountSolver().solve(new StubProblem());
		expect(steps.map((s) => s.description)).toEqual(['first', 'second']);
	});

	test('calls problem.validate() before running', () => {
		const solver = new CountSolver();
		expect(() => solver.solve(new StubProblem(true))).toThrow('invalid');
		expect(solver.started).toBe(false);
	});
});
