import type { Problem } from './Problem';
import type { VisualizerStep } from './VisualizerStep';

export abstract class Solver<TState> {
	abstract readonly name: string;

	protected abstract run(problem: Problem<TState>): Generator<VisualizerStep<TState>>;

	solve(problem: Problem<TState>): VisualizerStep<TState>[] {
		problem.validate();
		return [...this.run(problem)];
	}
}
