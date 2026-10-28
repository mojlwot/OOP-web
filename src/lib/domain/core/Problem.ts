export interface Problem<TState> {
	readonly id: string;
	/** Returns a fresh copy of the initial state on every call. */
	getInitialState(): TState;
	/** Throws an Error describing the violated constraint. */
	validate(): void;
}
