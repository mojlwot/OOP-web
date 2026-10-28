import type { Problem } from '../core/Problem';
import type { TreeState } from './TreeState';

const MIN_KEYS = 1;
const MAX_KEYS = 15;

export class TreeProblem implements Problem<TreeState> {
	readonly id = 'tree';
	private readonly keys: number[];

	constructor(keys: number[]) {
		this.keys = [...keys];
	}

	/** Parses comma-separated integers, e.g. "50, 30, 20". */
	static parse(text: string): TreeProblem {
		const tokens = text.split(',').map((t) => t.trim());
		if (!tokens.every((t) => /^-?\d+$/.test(t))) {
			throw new Error('Keys must be comma-separated integers.');
		}
		return new TreeProblem(tokens.map(Number));
	}

	/** `count` distinct keys from 1..99 in random order. */
	static random(count: number): TreeProblem {
		const pool = Array.from({ length: 99 }, (_, i) => i + 1);
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		return new TreeProblem(pool.slice(0, count));
	}

	getInitialState(): TreeState {
		return { root: null, pending: [...this.keys] };
	}

	validate(): void {
		if (this.keys.length < MIN_KEYS || this.keys.length > MAX_KEYS) {
			throw new Error(`Between ${MIN_KEYS} and ${MAX_KEYS} keys are required.`);
		}
		if (!this.keys.every(Number.isInteger)) {
			throw new Error('Every key must be an integer.');
		}
		if (new Set(this.keys).size !== this.keys.length) {
			throw new Error('Keys must be unique.');
		}
	}
}
