const CONFIG = {
	STYLE: {
		width: "40px",
		height: "40px",
		padding: "0px",
		margin: "0px",
		textAlign: "center",
		fontFamily: "Helvetica",
		fontSize: '30px',
		color: 'black',
	},
	
	COLORS: {
		RED: '#C66376',
	},

	SMALL: {
		PATH: 'testcase/9x9/',
		FILES: ['10', '20', '30', '40', '50', '60', '64', '64_2'],
		B_SIZE: 9,
	},

	LARGE: {
		PATH: 'testcase/16x16/',
		FILES: ['10'],
		B_SIZE: 16,
	},

	SPEED: 5000,
	BACKTRACKING: 0,
	DANCINGLINKS: 1,
};

let number = 1;
let size = CONFIG.SMALL.B_SIZE;
let algo = CONFIG.BACKTRACKING;
let data_small = {};
let data_large = {};
let cur_data = null;
let sudoku = null;