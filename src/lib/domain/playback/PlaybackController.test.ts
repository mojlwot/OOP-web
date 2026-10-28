import { describe, expect, test } from 'vitest';
import type { VisualizerStep } from '../core/VisualizerStep';
import { PlaybackController, type Scheduler } from './PlaybackController';

class FakeScheduler implements Scheduler {
	pending: { fn: () => void; ms: number } | null = null;
	cleared = 0;
	set(fn: () => void, ms: number) {
		this.pending = { fn, ms };
		return this.pending;
	}
	clear() {
		this.pending = null;
		this.cleared++;
	}
	fire() {
		const task = this.pending;
		this.pending = null;
		task?.fn();
	}
}

const makeSteps = (n: number): VisualizerStep<number[]>[] =>
	Array.from({ length: n }, (_, i) => ({ state: [i], highlights: {}, description: `s${i}` }));

const setup = (n = 3) => {
	const scheduler = new FakeScheduler();
	let changes = 0;
	const controller = new PlaybackController(makeSteps(n), scheduler, () => changes++);
	return { scheduler, controller, changes: () => changes };
};

describe('PlaybackController', () => {
	test('next and prev stay within bounds', () => {
		const { controller } = setup(3);
		controller.prev();
		expect(controller.index).toBe(0);
		controller.next();
		controller.next();
		controller.next();
		expect(controller.index).toBe(2);
		expect(controller.current?.description).toBe('s2');
	});

	test('reset returns to index 0 and pauses', () => {
		const { controller } = setup(3);
		controller.next();
		controller.play();
		controller.reset();
		expect(controller.index).toBe(0);
		expect(controller.isPlaying).toBe(false);
	});

	test('play advances one step per tick and auto-pauses on the last step', () => {
		const { controller, scheduler } = setup(3);
		controller.play();
		expect(controller.isPlaying).toBe(true);
		scheduler.fire();
		expect(controller.index).toBe(1);
		scheduler.fire();
		expect(controller.index).toBe(2);
		expect(controller.isPlaying).toBe(false);
		expect(scheduler.pending).toBeNull();
	});

	test('play on the last step restarts from index 0', () => {
		const { controller } = setup(3);
		controller.next();
		controller.next();
		controller.play();
		expect(controller.index).toBe(0);
		expect(controller.isPlaying).toBe(true);
	});

	test('pause stops advancing', () => {
		const { controller, scheduler } = setup(3);
		controller.play();
		controller.pause();
		expect(controller.isPlaying).toBe(false);
		expect(scheduler.pending).toBeNull();
		expect(controller.index).toBe(0);
	});

	test('tick delay is 1000 / speed', () => {
		const { controller, scheduler } = setup(3);
		controller.setSpeed(10);
		controller.play();
		expect(scheduler.pending?.ms).toBe(100);
	});

	test('setSpeed(0) and setSpeed(-3) clamp to 0.5; setSpeed(1000) clamps to 60', () => {
		const { controller } = setup(3);
		controller.setSpeed(0);
		expect(controller.speed).toBe(0.5);
		controller.setSpeed(-3);
		expect(controller.speed).toBe(0.5);
		controller.setSpeed(1000);
		expect(controller.speed).toBe(60);
	});

	test('changing speed while playing reschedules the next tick', () => {
		const { controller, scheduler } = setup(3);
		controller.play();
		controller.setSpeed(20);
		expect(scheduler.pending?.ms).toBe(50);
	});

	test('empty steps: current is undefined, next and play do nothing', () => {
		const { controller, scheduler } = setup(0);
		controller.next();
		controller.play();
		expect(controller.current).toBeUndefined();
		expect(controller.index).toBe(0);
		expect(controller.isPlaying).toBe(false);
		expect(scheduler.pending).toBeNull();
	});

	test('dispose clears the pending timer', () => {
		const { controller, scheduler } = setup(3);
		controller.play();
		controller.dispose();
		expect(scheduler.pending).toBeNull();
		expect(controller.isPlaying).toBe(false);
	});

	test('onChange is called after next, prev, reset, play, pause', () => {
		const { controller, changes } = setup(3);
		controller.next();
		expect(changes()).toBe(1);
		controller.prev();
		expect(changes()).toBe(2);
		controller.play();
		expect(changes()).toBe(3);
		controller.pause();
		expect(changes()).toBe(4);
		controller.reset();
		expect(changes()).toBe(5);
	});
});
