const target = document.querySelector("#container");
var colorCount = 100;

var colors = ['#FFCC33', '#FF6666', '#79D7D6', '#A5DE6B', '#EF7E60', '#FE885A', '#6DB5FE', '#FEF6F3', '#9EE2DC'];


for (i = 0; i < colorCount; i++) {
	var randColor = selectColor();
	createPopsicle(randColor);
}


function createPopsicle(randColor) {
	target.innerHTML += `<hr style="background:${randColor}"></hr>`;
}

function selectColor() {
	var x = colors[Math.floor(Math.random() * colors.length)];
	return(x);
}