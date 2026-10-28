import { describe, expect, test } from 'vitest';
import { AVLInsertSolver } from './AVLInsertSolver';
import { ALL_ROTATIONS_KEYS } from './demoKeys';
import { TreeProblem } from './TreeProblem';

describe('ALL_ROTATIONS_KEYS', () => {
	test('is a valid problem whose AVL run shows LL, RR, LR and RL', () => {
		const problem = new TreeProblem(ALL_ROTATIONS_KEYS);
		expect(() => problem.validate()).not.toThrow();
		const flagged = new AVLInsertSolver()
			.solve(problem)
			.filter((s) => s.highlights.unbalanced)
			.map((s) => /(LL|RR|LR|RL) case/.exec(s.description)?.[1]);
		expect(new Set(flagged)).toEqual(new Set(['LL', 'RR', 'LR', 'RL']));
	});
});
