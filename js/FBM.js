// Adapted from https://thebookofshaders.com/13/
class FBM {

	constructor(amplitude, randomize = false, octaves = 1, lacunarity = 2.0, gain = 0.5) {
		this.octaves = octaves;
		this.amplitude = amplitude;
		this.lacunarity = lacunarity;
		this.gain = gain;
		this.randomize = randomize;
	}

	static noise(st, randomize) {
		let i = Math.floor(st);
		let f = st - i;

		// Four corners in 2D of a tile
		let a = FBM.random([i, i], randomize);
		let b = FBM.random([i + 1, i], randomize);
		let c = FBM.random([i, i + 1], randomize);
		let d = FBM.random([i + 1, i + 1], randomize);

		let u = f * f * (3.0 - 2.0 * f);

		return FBM.mix(a, b, u)
		  + (c - a) * u * (1.0 - f)
		  + (d - b) * f * u
		;
	}

	static mix(x, y, a) {
		return x * (1.0 - a) + y * a;
	}

	static random(st, randomize) {
		if (randomize) {
			return Math.random() * FBM.fract(Math.sin(FBM.dot([st[0], st[1]], [12.9898, 78.233])) * 43758.5453123);
		}
		return FBM.fract(Math.sin(FBM.dot([st[0], st[1]], [12.9898, 78.233])) * 43758.5453123);
	}

	static fract(x) {
		return x - Math.floor(x);
	}

	static dot(vec1, vec2) {
		if (vec1.length !== vec2.length) {
			return null;
		}
		let result = 0;
		const length = vec1.length;
		for (let i = 0; i < length; i++) {
			result += vec1[i] * vec2[i];
		}
		return result;
	}

	fbm(x, amplitude) {
		if (!amplitude) {
			amplitude = this.amplitude;
		}
		let frequency = 1.504;
		let y = 0;
		for (let i = 0; i < this.octaves; i++) {
			y += amplitude * FBM.noise(frequency * x, this.randomize);
			frequency *= this.lacunarity;
			amplitude *= this.gain;
		}
		return y;
	}
}
