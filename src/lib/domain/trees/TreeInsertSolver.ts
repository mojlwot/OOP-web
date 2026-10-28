import type { Problem } from '../core/Problem';
import { Solver } from '../core/Solver';
import type { VisualizerStep } from '../core/VisualizerStep';
import type { TreeNode, TreeState } from './TreeState';
import { cloneTree, makeNode, updateHeight } from './treeOps';

type Step = VisualizerStep<TreeState>;

/** Mutable working state shared with subclass hooks while one key is inserted. */
export interface InsertContext {
	tree: { root: TreeNode | null };
	/** Nodes from the root down to the newly inserted node. */
	path: TreeNode[];
	snapshot(highlights: Step['highlights'], description: string): Step;
}

/**
 * Template method for inserting keys one by one into a binary search tree.
 * The descent and insertion are shared; subclasses decide what happens afterwards.
 */
export abstract class TreeInsertSolver extends Solver<TreeState> {
	/** Called after each insertion (heights already updated). Default: do nothing. */
	protected *rebalance(_ctx: InsertContext): Generator<Step> {}

	protected *run(problem: Problem<TreeState>): Generator<Step> {
		const keys = problem.getInitialState().pending;
		const tree: { root: TreeNode | null } = { root: null };
		let remaining = [...keys];

		const snapshot = (highlights: Step['highlights'], description: string): Step => ({
			state: { root: cloneTree(tree.root), pending: [...remaining] },
			highlights,
			description
		});

		yield snapshot({}, 'Start with an empty tree.');

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			remaining = keys.slice(i + 1);
			const path: TreeNode[] = [];

			if (!tree.root) {
				tree.root = makeNode(key);
				path.push(tree.root);
				yield snapshot({ inserted: [key] }, `Insert ${key} as the root.`);
			} else {
				let node = tree.root;
				for (;;) {
					path.push(node);
					const side = key < node.key ? 'left' : 'right';
					yield snapshot(
						{ visiting: [node.key] },
						`Compare ${key} with ${node.key}: go ${side}.`
					);
					const child = node[side];
					if (child === null) {
						const created = makeNode(key);
						node[side] = created;
						path.push(created);
						for (let p = path.length - 2; p >= 0; p--) updateHeight(path[p]);
						yield snapshot({ inserted: [key] }, `Insert ${key} as the ${side} child of ${node.key}.`);
						break;
					}
					node = child;
				}
			}

			yield* this.rebalance({ tree, path, snapshot });
		}

		remaining = [];
		yield snapshot({}, 'All keys inserted.');
	}
}
