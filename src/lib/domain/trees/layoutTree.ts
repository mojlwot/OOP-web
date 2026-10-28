import type { TreeNode } from './TreeState';
import { balanceFactor } from './treeOps';

export interface LayoutNode {
	key: number;
	/** In-order column index. */
	x: number;
	/** Depth, root = 0. */
	y: number;
	balanceFactor: number;
}

export interface LayoutEdge {
	from: number;
	to: number;
}

export interface TreeLayout {
	nodes: LayoutNode[];
	edges: LayoutEdge[];
	columns: number;
	/** Number of levels. */
	depth: number;
}

/** Unit-grid layout: x = in-order position, y = depth. The view scales it. */
export function layoutTree(root: TreeNode | null): TreeLayout {
	const nodes: LayoutNode[] = [];
	const edges: LayoutEdge[] = [];
	let column = 0;
	let levels = 0;

	const visit = (node: TreeNode | null, depth: number): void => {
		if (!node) return;
		visit(node.left, depth + 1);
		nodes.push({ key: node.key, x: column++, y: depth, balanceFactor: balanceFactor(node) });
		levels = Math.max(levels, depth + 1);
		visit(node.right, depth + 1);
		if (node.left) edges.push({ from: node.key, to: node.left.key });
		if (node.right) edges.push({ from: node.key, to: node.right.key });
	};
	visit(root, 0);

	return { nodes, edges, columns: column, depth: levels };
}
