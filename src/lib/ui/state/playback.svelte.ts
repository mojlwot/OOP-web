import type { VisualizerStep } from '$lib/domain/core/VisualizerStep';
import { PlaybackController } from '$lib/domain/playback/PlaybackController';

/** Reactive view over a PlaybackController; forwards everything, owns no logic. */
export function createPlayback<TState>(steps: VisualizerStep<TState>[]) {
	let version = $state(0);
	const controller = new PlaybackController(steps, undefined, () => version++);
	const read = <T>(value: () => T): T => {
		void version;
		return value();
	};

	return {
		get index() {
			return read(() => controller.index);
		},
		get length() {
			return controller.length;
		},
		get current() {
			return read(() => controller.current);
		},
		get isPlaying() {
			return read(() => controller.isPlaying);
		},
		get speed() {
			return read(() => controller.speed);
		},
		play: () => controller.play(),
		pause: () => controller.pause(),
		next: () => controller.next(),
		prev: () => controller.prev(),
		reset: () => controller.reset(),
		setSpeed: (value: number) => controller.setSpeed(value),
		dispose: () => controller.dispose()
	};
}
