import { describe, expect, test } from 'vitest';
import {
	balanceFactor,
	cloneTree,
	height,
	inorder,
	makeNode,
	rotateLeft,
	rotateRight
} from './treeOps';

describe('treeOps', () => {
	test('height of null is 0 and of a leaf is 1', () => {
		expect(height(null)).toBe(0);
		expect(height(makeNode(1))).toBe(1);
	});

	test('makeNode computes height from its children', () => {
		expect(makeNode(2, makeNode(1), null).height).toBe(2);
	});

	test('balanceFactor is height(left) - height(right)', () => {
		expect(balanceFactor(makeNode(2, makeNode(1), null))).toBe(1);
		expect(balanceFactor(makeNode(2, null, makeNode(3)))).toBe(-1);
		expect(balanceFactor(null)).toBe(0);
	});

	test('rotateRight lifts the left child and fixes heights', () => {
		const z = makeNode(30, makeNode(20, makeNode(10), null), null);
		const y = rotateRight(z);
		expect(y.key).toBe(20);
		expect(y.left?.key).toBe(10);
		expect(y.right?.key).toBe(30);
		expect(y.height).toBe(2);
		expect(y.right?.height).toBe(1);
	});

	test('rotateLeft lifts the right child and fixes heights', () => {
		const z = makeNode(10, null, makeNode(20, null, makeNode(30)));
		const y = rotateLeft(z);
		expect(y.key).toBe(20);
		expect(y.left?.key).toBe(10);
		expect(y.right?.key).toBe(30);
		expect(y.height).toBe(2);
	});

	test('rotation keeps the in-order sequence (moves the inner subtree)', () => {
		const z = makeNode(30, makeNode(20, makeNode(10), makeNode(25)), makeNode(40));
		expect(inorder(rotateRight(z))).toEqual([10, 20, 25, 30, 40]);
	});

	test('cloneTree returns an independent deep copy', () => {
		const original = makeNode(2, makeNode(1), makeNode(3));
		const copy = cloneTree(original);
		copy!.left!.key = 99;
		expect(original.left!.key).toBe(1);
		expect(cloneTree(null)).toBeNull();
	});
});
