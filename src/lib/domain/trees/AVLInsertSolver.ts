import type { VisualizerStep } from '../core/VisualizerStep';
import type { TreeNode, TreeState } from './TreeState';
import { type InsertContext, TreeInsertSolver } from './TreeInsertSolver';
import { balanceFactor, rotateLeft, rotateRight, updateHeight } from './treeOps';

type Step = VisualizerStep<TreeState>;
type Case = 'LL' | 'RR' | 'LR' | 'RL';

/** BST insertion followed by AVL rebalancing, with each rotation shown as its own step. */
export class AVLInsertSolver extends TreeInsertSolver {
	readonly name = 'AVL Insert';

	protected *rebalance(ctx: InsertContext): Generator<Step> {
		const { path, tree } = ctx;

		// Walk up from the new node's parent; only the first unbalanced node needs fixing.
		for (let i = path.length - 2; i >= 0; i--) {
			const z = path[i];
			const bf = balanceFactor(z);
			if (Math.abs(bf) <= 1) continue;

			const kind = this.classify(z, bf);
			yield ctx.snapshot(
				{ unbalanced: [z.key] },
				`Node ${z.key} is unbalanced (balance factor ${bf}): ${kind} case.`
			);

			const relink = (sub: TreeNode) => {
				const parent = path[i - 1];
				if (!parent) tree.root = sub;
				else if (parent.left === z) parent.left = sub;
				else parent.right = sub;
			};

			if (kind === 'LR') {
				const y = z.left!;
				z.left = rotateLeft(y);
				yield ctx.snapshot(
					{ rotating: [y.key, z.left.key] },
					`Rotate left at ${y.key}: ${z.left.key} moves up.`
				);
			} else if (kind === 'RL') {
				const y = z.right!;
				z.right = rotateRight(y);
				yield ctx.snapshot(
					{ rotating: [y.key, z.right.key] },
					`Rotate right at ${y.key}: ${z.right.key} moves up.`
				);
			}

			const goesRight = kind === 'LL' || kind === 'LR';
			const sub = goesRight ? rotateRight(z) : rotateLeft(z);
			relink(sub);
			for (let p = i - 1; p >= 0; p--) updateHeight(path[p]);
			yield ctx.snapshot(
				{ rotating: [z.key, sub.key] },
				`Rotate ${goesRight ? 'right' : 'left'} at ${z.key}: ${sub.key} moves up.`
			);
			return;
		}
	}

	private classify(z: TreeNode, bf: number): Case {
		if (bf > 1) return balanceFactor(z.left) >= 0 ? 'LL' : 'LR';
		return balanceFactor(z.right) <= 0 ? 'RR' : 'RL';
	}
}
