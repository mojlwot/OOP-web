import type { Problem } from '../../core/Problem';
import { Solver } from '../../core/Solver';
import type { VisualizerStep } from '../../core/VisualizerStep';

export class BubbleSortSolver extends Solver<number[]> {
	readonly name = 'Bubble Sort';

	protected *run(problem: Problem<number[]>): Generator<VisualizerStep<number[]>> {
		const arr = problem.getInitialState();
		const n = arr.length;
		const sortedFrom = (start: number) =>
			Array.from({ length: n - start }, (_, i) => start + i);
		const step = (
			highlights: VisualizerStep<number[]>['highlights'],
			description: string
		): VisualizerStep<number[]> => ({ state: [...arr], highlights, description });

		yield step({}, 'Initial array.');

		for (let end = n - 1; end > 0; end--) {
			for (let j = 0; j < end; j++) {
				yield step(
					{ comparing: [j, j + 1], sorted: sortedFrom(end + 1) },
					`Compare ${arr[j]} and ${arr[j + 1]}.`
				);
				if (arr[j] > arr[j + 1]) {
					[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
					yield step(
						{ swapped: [j, j + 1], sorted: sortedFrom(end + 1) },
						`Swap ${arr[j + 1]} and ${arr[j]}.`
					);
				}
			}
		}

		yield step({ sorted: sortedFrom(0) }, 'Array is sorted.');
	}
}
