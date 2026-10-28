/** Test-only helper: deterministic pseudo-random distinct keys from 1..99. */
export function shuffledKeys(seed: number, count: number): number[] {
	let s = seed;
	const next = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
	const pool = Array.from({ length: 99 }, (_, i) => i + 1);
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(next() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, count);
}
