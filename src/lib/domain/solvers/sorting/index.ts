import type { Solver } from '../../core/Solver';
import { BubbleSortSolver } from './BubbleSortSolver';

export const sortingSolvers: Record<string, () => Solver<number[]>> = {
	'bubble-sort': () => new BubbleSortSolver()
};
