class Backtracking {
	constructor(data, random=true) {
		[this.data, this.size] = decodeData(data);
		this.row = getEmptyBoard(this.size);
		this.col = getEmptyBoard(this.size);
		this.section = getEmptyBoard(this.size);
		this.board = getEmptyBoard(this.size);
		this.solution = [];
		this.solution_log = [];
		this.random = random;
		this.visual = [];
	
		this.data.forEach((elem, pos) => {
			const [x, y] = getPos(pos, this.size);
			this.board[x][y] = elem;
			if (elem) {
				this.row[x][elem] = this.col[y][elem] = this.section[square(x, y, this.size)][elem] = true;
			}
		});
	}

	search(k=0, time) {
		if (performance.now() - time > 1000) {
			return false;
		}

		if (k === this.size**2) {
			return true;
		}

		const [x, y] = getPos(k, this.size);
		if (this.board[x][y]) {
			return this.search(k+1, time);
		} else {
			let iter = Array.from(Array(this.size), (elem, pos) => pos+1);
			if (this.random) {
				iter = shuffle(iter);
			}
			for (const i of iter) {
				if (!this.row[x][i] && !this.col[y][i] && !this.section[square(x, y, this.size)][i]) {
					this.row[x][i] = this.col[y][i] = this.section[square(x, y, this.size)][i] = true;
					this.board[x][y] = i;

					this.solution.push([x, y, i]);
					this.solution_log.push([x, y, i]);

					if (this.search(k+1, time)) {
						return true;
					}

					this.solution.pop();
					this.solution_log.push([x, y, -1]);

					this.board[x][y] = 0;
					this.row[x][i] = this.col[y][i] = this.section[square(x, y, this.size)][i] = false;
				}
			}
		}

		return false;
	}

	visualize() {
		const before = performance.now();
		if (!this.search(0, before)) {
			alert('Time Limit Abort');
			return false;
		}
		const after = performance.now();
		console.log(after - before);

		let progress = document.getElementById('progress');

		this.solution_log.forEach((elem, pos) => {
			this.visual.push(setTimeout(() => {
				if (elem[2] > 0) {
					let b = null;
					if (this.size === CONFIG.LARGE.B_SIZE) {
						b = jsboard.piece({ text: String.fromCharCode(elem[2]+64), background: CONFIG.COLORS.RED, ...CONFIG.STYLE });
					} else {
						b = jsboard.piece({ text: elem[2], background: CONFIG.COLORS.RED, ...CONFIG.STYLE });
					}
					map.cell([elem[0], elem[1]]).place(b.clone());
				} else {
					map.cell([elem[0], elem[1]]).rid();
				}
				progress.textContent = ((pos+1) / this.solution_log.length * 100).toFixed(1) + ' %';
			}, CONFIG.SPEED * pos));
		});
	}

	stopVisualize() {
		this.visual.forEach(v => clearTimeout(v));
	}

	benchmark() {
		const before = performance.now();
		this.search();
		const after = performance.now();

		return (after - before);
	}
}