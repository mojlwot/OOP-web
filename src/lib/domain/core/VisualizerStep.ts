export interface VisualizerStep<TState> {
	/** Independent snapshot of the state at this step. */
	state: TState;
	/** Indices to emphasize, keyed by role (e.g. comparing, swapped, sorted). */
	highlights: Record<string, number[]>;
	description: string;
}
