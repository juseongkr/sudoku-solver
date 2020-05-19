const run = () => {
	sudoku = algo === CONFIG.BACKTRACKING ? new Backtracking(cur_data) : new DancingLinks(cur_data);
	sudoku.visualize();
}

const chooseAlgo = type => {
	algo = type === '0' ? CONFIG.BACKTRACKING : CONFIG.DANCINGLINKS;
}

const chooseSize = type => {
	size = type === '0' ? CONFIG.SMALL.B_SIZE : CONFIG.LARGE.B_SIZE;
}

const removeButton = () => {
	const myNode = document.getElementsByClassName("btn-group mr-2");
	while (myNode[0].lastElementChild) {
   		myNode[0].removeChild(myNode[0].lastElementChild);
	}
}

const createButton = size => {
	removeButton();
	for (let i=0; i<size; ++i) {
		let button = document.createElement('button');
		button.setAttribute('class', 'btn-lg btn-secondary');
		button.appendChild(document.createTextNode(size === CONFIG.SMALL.B_SIZE ? i+1 : String.fromCharCode(i+65)));
		button.addEventListener('click', () => {
			number = button.innerHTML;
		});
		document.getElementsByClassName('btn-group mr-2')[0].appendChild(button);
	}
}

const createMap = size => {
	removeMap();
	let map = jsboard.board({
		attach: 'sudoku-board',
		size: `${size}x${size}`,
		style: "checkerboard",
		stylePattern: ["#C2D7E8", "#A5C4DD"],
	});

	map.cell("each").style({
		...CONFIG.STYLE,
	});

	map.cell("each").on("click", function(event) {
		event.preventDefault();
		if (map.cell(this).get()) {
			map.cell(this).rid();
			if (cur_data) {
				const pos = getPosRev(map.cell(this).where(), size);
				if (size === CONFIG.SMALL.B_SIZE) {
					cur_data = cur_data.substring(0, pos) + 0 + cur_data.substring(pos+1);
				} else {
					cur_data = cur_data.substring(0, pos) + '-' + cur_data.substring(pos+1);
				}
			}
		} else {
			const b = jsboard.piece({ text: number, ...CONFIG.STYLE, color: 'blue' });
			map.cell(this).place(b.clone());
			if (cur_data) {
				const pos = getPosRev(map.cell(this).where(), size);
				if (size === CONFIG.SMALL.B_SIZE) {
					cur_data = cur_data.substring(0, pos) + number + cur_data.substring(pos+1);
				} else {
					cur_data = cur_data.substring(0, pos) + encodeChar(number) + cur_data.substring(pos+1);
				}
			}
		}
	});
	
	map.cell('each').on('contextmenu', function(event) {
		event.preventDefault();
		if (map.cell(this).get()) {
			map.cell(this).rid();
			if (cur_data) {
				const pos = getPosRev(map.cell(this).where(), size);
				if (size === CONFIG.SMALL.B_SIZE) {
					cur_data = cur_data.substring(0, pos) + 0 + cur_data.substring(pos+1);
				} else {
					cur_data = cur_data.substring(0, pos) + '-' + cur_data.substring(pos+1);
				}
			}
		} else {
			const b = jsboard.piece({ text: number, ...CONFIG.STYLE, color: 'gray' });
			map.cell(this).place(b.clone())
		}
	});

	createButton(size);

	return map;
}

const removeMap = () => {
	let element = document.getElementById('sudoku-board');
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

const showData = () => {
	clearData();
	decodeData(cur_data)[0].forEach((elem, pos) => {
		const [x, y] = getPos(pos, size);
		if (elem) {
			let b = null;
			if (size == CONFIG.SMALL.B_SIZE)
				b = jsboard.piece({ text: elem, ...CONFIG.STYLE });
			else
				b = jsboard.piece({ text: String.fromCharCode(elem+64), ...CONFIG.STYLE });
			map.cell([x, y]).place(b.clone());
		}
	});
}

const clearData = () => {
	map.cell("each").rid();
}

const getRandom = len => {
	return Math.floor(Math.random() * len);
}

const getSmallData = () => {
	const lvl = CONFIG.SMALL.FILES[getRandom(CONFIG.SMALL.FILES.length)];
	const idx = getRandom(data_small[lvl].length);
	return data_small[lvl][idx];
}

const getLargeData = () => {
	const lvl = CONFIG.LARGE.FILES[getRandom(CONFIG.LARGE.FILES.length)];
	const idx = getRandom(data_large[lvl].length);
	return data_large[lvl][idx];
}

const getRandomData = () => {
	cur_data = size === CONFIG.SMALL.B_SIZE ? getSmallData() : getLargeData();
	number = size === CONFIG.SMALL.B_SIZE ? 1 : 'A';
	map = createMap(size);
	sudoku = null;
	showData();
}

const decodeData = data => {
	if (data.length === CONFIG.LARGE.B_SIZE**2) {
		return [Array.from(data).map(x => (x === '-') ? 0 : (x.charCodeAt() < 58 ? x.charCodeAt()-47 : x.charCodeAt()-54)), CONFIG.LARGE.B_SIZE];
	} else if (data.length === CONFIG.SMALL.B_SIZE**2) {
		return [Array.from(data).map(x => x.charCodeAt()-48), CONFIG.SMALL.B_SIZE];
	}
	return [null, -1];
}

const encodeChar = x => {
	return x.charCodeAt() < 75 ? x.charCodeAt()-65 : String.fromCharCode(x.charCodeAt()-10);
}

const getEmptyBoard = size => {
	return Array.from({length: size}, () => Array(size).fill(0));
}

const getPos = (k, size) => {
	return [parseInt(k / size), k % size];
}

const getPosRev = (k, size) => {
	const [x, y] = k;
	return x * size + y;
}

const square = (x, y, size) => {
	const _size = Math.sqrt(size);
	return parseInt(x / _size) * _size + parseInt(y / _size);
}

const shuffle = arr => {
	let idx = arr.length;
	while (idx !== 0) {
        let rand = getRandom(idx);
		idx--;
		let temp = arr[idx];
		arr[idx] = arr[rand];
		arr[rand] = temp;
	}
	return arr;
}

const validCheck = () => {
	let check = Array(size).fill(0);
	let board = [];
	if (sudoku) {
		board = algo === 0 ? sudoku.board : sudoku.answer_board;
	} else {
		const data = cur_data.split('').map(x => Number(x));
		while (data.length) {
			board.push(data.splice(0, size));
		}
	}
	
	board.forEach((row, x) => {
		row.forEach((elem, y) => {
			check[square(x, y, size)] += elem;
		});
	});
	
	board.forEach(row => {
		check.push(row.reduce((acc, val) => acc + val));
	});
	board[0].map((col, i) => board.map(row => row[i]));
	board.forEach(row => {
		check.push(row.reduce((acc, val) => acc + val));
	});

	const valid = check.every(elem => elem === parseInt((size * (size+1)) / 2));
	alert(valid ? "Correct!" : "Incorrect");

	return valid;
} 