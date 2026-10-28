import type { Solver } from '../core/Solver';
import type { TreeState } from './TreeState';
import { AVLInsertSolver } from './AVLInsertSolver';
import { BSTInsertSolver } from './BSTInsertSolver';

export const bstSolvers: Record<string, () => Solver<TreeState>> = {
	'bst-insert': () => new BSTInsertSolver()
};

export const avlSolvers: Record<string, () => Solver<TreeState>> = {
	'avl-insert': () => new AVLInsertSolver()
};
