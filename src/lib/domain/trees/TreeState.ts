export interface TreeNode {
	key: number;
	/** Leaf = 1, empty subtree = 0. */
	height: number;
	left: TreeNode | null;
	right: TreeNode | null;
}

export interface TreeState {
	root: TreeNode | null;
	/** Keys not yet inserted, in insertion order. */
	pending: number[];
}
