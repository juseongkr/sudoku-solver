(() => {
	CONFIG.SMALL.FILES.forEach(file => {
		fetch(CONFIG.SMALL.PATH + file)
		.then(res => res.text())
		.then(text => data_small[file] = text.split('\n'))
		.catch(err => console.error(err));
	});

	CONFIG.LARGE.FILES.forEach(file => {
		fetch(CONFIG.LARGE.PATH + file)
		.then(res => res.text())
		.then(text => data_large[file] = text.split('\n'))
		.catch(err => console.error(err));
	});
})();

let map = createMap(CONFIG.SMALL.B_SIZE);