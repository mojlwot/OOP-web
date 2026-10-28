import type { TreeNode } from './TreeState';

export const height = (node: TreeNode | null): number => node?.height ?? 0;

export const balanceFactor = (node: TreeNode | null): number =>
	node ? height(node.left) - height(node.right) : 0;

export function updateHeight(node: TreeNode): void {
	node.height = 1 + Math.max(height(node.left), height(node.right));
}

export function makeNode(
	key: number,
	left: TreeNode | null = null,
	right: TreeNode | null = null
): TreeNode {
	const node: TreeNode = { key, height: 1, left, right };
	updateHeight(node);
	return node;
}

/** Rotates `z` down to the right and returns the new subtree root. Mutates the nodes. */
export function rotateRight(z: TreeNode): TreeNode {
	const y = z.left!;
	z.left = y.right;
	y.right = z;
	updateHeight(z);
	updateHeight(y);
	return y;
}

/** Rotates `z` down to the left and returns the new subtree root. Mutates the nodes. */
export function rotateLeft(z: TreeNode): TreeNode {
	const y = z.right!;
	z.right = y.left;
	y.left = z;
	updateHeight(z);
	updateHeight(y);
	return y;
}

export function cloneTree(node: TreeNode | null): TreeNode | null {
	return node && { ...node, left: cloneTree(node.left), right: cloneTree(node.right) };
}

export function inorder(node: TreeNode | null): number[] {
	return node ? [...inorder(node.left), node.key, ...inorder(node.right)] : [];
}
