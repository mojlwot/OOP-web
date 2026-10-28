import { describe, expect, test } from 'vitest';
import { layoutTree } from './layoutTree';
import { makeNode } from './treeOps';

describe('layoutTree', () => {
	test('empty tree has no nodes or edges', () => {
		expect(layoutTree(null)).toEqual({ nodes: [], edges: [], columns: 0, depth: 0 });
	});

	test('x is the in-order column and y is the depth', () => {
		const layout = layoutTree(makeNode(2, makeNode(1), makeNode(3)));
		const at = (key: number) => layout.nodes.find((n) => n.key === key)!;
		expect([at(1).x, at(1).y]).toEqual([0, 1]);
		expect([at(2).x, at(2).y]).toEqual([1, 0]);
		expect([at(3).x, at(3).y]).toEqual([2, 1]);
		expect(layout.columns).toBe(3);
		expect(layout.depth).toBe(2);
	});

	test('edges connect each parent to its children', () => {
		const layout = layoutTree(makeNode(2, makeNode(1), makeNode(3)));
		expect(layout.edges).toEqual(
			expect.arrayContaining([
				{ from: 2, to: 1 },
				{ from: 2, to: 3 }
			])
		);
		expect(layout.edges).toHaveLength(2);
	});

	test('nodes carry their balance factor', () => {
		const layout = layoutTree(makeNode(2, makeNode(1), null));
		expect(layout.nodes.find((n) => n.key === 2)!.balanceFactor).toBe(1);
	});
});
