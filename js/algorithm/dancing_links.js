class Node {
	constructor(i=0) {
		this.rowidx = i;
		this.size = 0;
		this.up = this;
		this.down = this;
		this.left = this;
		this.right = this;
		this.column = this;
	}
}

class DancingLinks {
	constructor(data, random=true) {
		[this.data, this.size] = decodeData(data);
		this.board = getEmptyBoard(this.size);
		this.answer_board = getEmptyBoard(this.size);
		this.matrix = [];
		this.position = [];
		this.solution = [];
		this.solution_log = [];
		this.random = random;
		this.visual = [];

		this.data.forEach((elem, pos) => {
			const [x, y] = getPos(pos, this.size);
			this.board[x][y] = elem;
			if (elem) {
				const k = elem-1;
				let row = Array((this.size**2) * 4).fill(0);
				row[this.curPosition(x, y)] = row[this.rowPosition(x, k)] = row[this.colPosition(y, k)] = row[this.secPosition(x, y, k)] = 1;
				this.matrix.push(row);
				this.position.push([x, y, k+1]);
			} else {
				let iter = Array.from(Array(this.size), (elem, pos) => pos);
				if (this.random) {
					iter = shuffle(iter);
				}
				for (const i of iter) {
					let row = Array((this.size**2) * 4).fill(0);
					row[this.curPosition(x, y)] = row[this.rowPosition(x, i)] = row[this.colPosition(y, i)] = row[this.secPosition(x, y, i)] = 1;
					this.matrix.push(row);
					this.position.push([x, y, i+1]);
				}
			}
		});
	}

	search(head, k=0, time) {
		if (performance.now() - time > 1000) {
			return false;
		}

		if (head.right == head) {
			return true;
		}

		let ptr = null;
		let low = Math.min();
		let it = head.right;
		while (it != head) {
			if (it.size < low) {
				if (it.size == 0)
					return false;
				low = it.size;
				ptr = it;
			}
			it = it.right;
		}
		
		this.cover(ptr);
		it = ptr.down;
		while (it != ptr) {
			let node = it.rowidx;
			this.solution.push(node);
			this.solution_log.push([node, true]);

			let jt = it.right;
			while (jt != it) {
				this.cover(jt.column);
				jt = jt.right;
			}

			if (this.search(head, k+1, time)) {
				return true;
			}
			
			this.solution.pop();
			this.solution_log.push([node, false]);

			jt = it.left;
			while (jt != it) {
				this.uncover(jt.column);
				jt = jt.left;
			}
			
			it = it.down;
		}
		this.uncover(ptr);

		return false;
	}

	build() {
		const len = this.matrix[0].length;
		let column = [...Array(len)].map(x => new Node());
		let head = new Node();

		head.right = column[0];
		head.left = column[len-1];

		column.forEach((col, i) => {
			col.size = 0;
			col.up = col;
			col.down = col;
			if (i === 0) {
				col.left = head;
			} else {
				col.left =  column[i-1];
			}
			if (i === len-1) {
				col.right = head;
			} else {
				col.right = column[i+1];
			}
		});

		let nodes = [];
		this.matrix.forEach((row, i) => {
			let last = null;
			column.forEach((col, j) => {
				if (this.matrix[i][j] === 1) {
					let now = new Node();
					now.rowidx = i;
					now.column = col;
					now.up = col.up;
					now.down = col;
					if (last) {
						now.left = last;
						now.right = last.right;
						last.right.left = now;
						last.right = now;
					} else {
						now.left = now;
						now.right = now;
					}
					col.up.down = now;
					col.up = now;
					col.size++;
					last = now;
					nodes.push(now);
				}
			});
		});

		return head;
	}

	cover(col) {
		col.right.left = col.left;
		col.left.right = col.right;
	
		let rowstart = col.down;
		while (rowstart != col) {
			let node = rowstart.right;
			while (node != rowstart) {
				node.down.up = node.up;
				node.up.down = node.down;
				node.column.size -= 1;
				node = node.right;
			}
			rowstart = rowstart.down;
		}
	}
	
	uncover(col) {
		let rowstart = col.up;
	
		while (rowstart != col) {
			let node = rowstart.left;
			while (node != rowstart) {
				node.column.size += 1;
				node.down.up = node;
				node.up.down = node;
				node = node.left;
			}
			rowstart = rowstart.up;
		}
		col.right.left = col;
		col.left.right = col;
	}

	curPosition(i, j) {
		return i * this.size + j;
	}
		
	rowPosition(i, k) {
		return (this.size**2) + i * this.size + k;
	}

	colPosition(i, k) {
		return (this.size**2) * 2 + i * this.size + k;
	}

	secPosition(i, j, k) {
		return (this.size**2) * 3 + square(i, j, this.size) * this.size + k;
	}

	visualize() {
		const head = this.build();
		const before = performance.now();
		if (!this.search(head, 0, before)) {
			alert('Time Limit Abort');
			return false;
		}
		const after = performance.now();
		console.log(after - before);

		this.solution.forEach(elem => {
			const [x, y, z] = this.position[elem];
			this.answer_board[x][y] = z;
		});
		
		let progress = document.getElementById('progress');

		this.solution_log.forEach((elem, pos) => {
			this.visual.push(setTimeout(() => {
				const [x, y, val] = this.position[elem[0]];
				const ok = elem[1];
				if (ok && !this.board[x][y]) {
					let b = null;
					if (this.size === CONFIG.LARGE.B_SIZE)
						b = jsboard.piece({ text: String.fromCharCode(val+64), background: CONFIG.COLORS.RED, ...CONFIG.STYLE });
					else
						b = jsboard.piece({ text: val, background: CONFIG.COLORS.RED, ...CONFIG.STYLE });
					map.cell([x, y]).place(b.clone());
				} else if (!ok) {
					map.cell([x, y]).rid();
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
		this.search(head, 0, before);
		const after = performance.now();

		return (after - before);
	}
}
