import type { Problem } from '../core/Problem';

const MIN_SIZE = 2;
const MAX_SIZE = 100;

export class SortingProblem implements Problem<number[]> {
	readonly id = 'sorting';
	private readonly values: number[];

	constructor(values: number[]) {
		this.values = [...values];
	}

	static random(size: number): SortingProblem {
		return new SortingProblem(Array.from({ length: size }, () => 1 + Math.floor(Math.random() * 100)));
	}

	getInitialState(): number[] {
		return [...this.values];
	}

	validate(): void {
		if (this.values.length < MIN_SIZE || this.values.length > MAX_SIZE) {
			throw new Error(`Array size must be between ${MIN_SIZE} and ${MAX_SIZE}.`);
		}
		if (!this.values.every(Number.isFinite)) {
			throw new Error('All values must be finite numbers.');
		}
	}
}
