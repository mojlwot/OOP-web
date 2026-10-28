import type { VisualizerStep } from '../core/VisualizerStep';

export interface Scheduler {
	set(fn: () => void, ms: number): unknown;
	clear(handle: unknown): void;
}

const defaultScheduler: Scheduler = {
	set: (fn, ms) => setTimeout(fn, ms),
	clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>)
};

const MIN_SPEED = 0.5;
const MAX_SPEED = 60;
const DEFAULT_SPEED = 5;

export class PlaybackController<TState> {
	#index = 0;
	#playing = false;
	#speed = DEFAULT_SPEED;
	#timer: unknown = null;

	constructor(
		private readonly steps: VisualizerStep<TState>[],
		private readonly scheduler: Scheduler = defaultScheduler,
		private readonly onChange: () => void = () => {}
	) {}

	get index(): number {
		return this.#index;
	}

	get length(): number {
		return this.steps.length;
	}

	get current(): VisualizerStep<TState> | undefined {
		return this.steps[this.#index];
	}

	get isPlaying(): boolean {
		return this.#playing;
	}

	get speed(): number {
		return this.#speed;
	}

	play(): void {
		if (this.steps.length === 0) return;
		if (this.#index >= this.steps.length - 1) this.#index = 0;
		this.#playing = true;
		this.#schedule();
		this.onChange();
	}

	pause(): void {
		this.#stop();
		this.onChange();
	}

	next(): void {
		if (this.#index < this.steps.length - 1) this.#index++;
		this.onChange();
	}

	prev(): void {
		if (this.#index > 0) this.#index--;
		this.onChange();
	}

	reset(): void {
		this.#stop();
		this.#index = 0;
		this.onChange();
	}

	setSpeed(stepsPerSecond: number): void {
		const value = Number.isFinite(stepsPerSecond) ? stepsPerSecond : DEFAULT_SPEED;
		this.#speed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
		if (this.#playing) this.#schedule();
		this.onChange();
	}

	dispose(): void {
		this.#stop();
	}

	#schedule(): void {
		if (this.#timer !== null) this.scheduler.clear(this.#timer);
		this.#timer = this.scheduler.set(() => this.#tick(), 1000 / this.#speed);
	}

	#tick(): void {
		this.#timer = null;
		if (this.#index < this.steps.length - 1) this.#index++;
		if (this.#index >= this.steps.length - 1) this.#playing = false;
		else this.#schedule();
		this.onChange();
	}

	#stop(): void {
		if (this.#timer !== null) this.scheduler.clear(this.#timer);
		this.#timer = null;
		this.#playing = false;
	}
}
