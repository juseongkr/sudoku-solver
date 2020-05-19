let map = null;
let loaded = [];

CONFIG.SMALL.FILES.forEach(file => {
	loaded.push(fetch(CONFIG.SMALL.PATH + file)
	.then(res => res.text())
	.then(text => data_small[file] = text.split('\n'))
	.catch(err => console.error(err)));
});

CONFIG.LARGE.FILES.forEach(file => {
	loaded.push(fetch(CONFIG.LARGE.PATH + file)
	.then(res => res.text())
	.then(text => data_large[file] = text.split('\n'))
	.catch(err => console.error(err)));
});

Promise.all(loaded)
.then(() => map = createMap(CONFIG.SMALL.B_SIZE))
.catch(err => console.error(err));