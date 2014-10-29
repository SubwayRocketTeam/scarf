elementIds = ["canv"];
e = {};
canv = null;

mouseX = 0;
mouseY = 0;
mouseDrag = false;

function Vec(x, y)
{
	this.x = x;
	this.y = y;
}

Vec.prototype.clone = function()
{
	return new Vec(this.x, this.y);
}

Vec.prototype.size = function()
{
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vec.prototype.normalize = function()
{
	var size = this.size();
	if (size == 0)
		return this;

	this.x /= size;
	this.y /= size;

	return this;
}

Vec.prototype.add = function(other)
{
	if (typeof other == "object")
		return new Vec(this.x+other.x, this.y+other.y);
	return undefined;
}

Vec.prototype.sub = function(other)
{
	if (typeof other == "object")
		return new Vec(this.x-other.x, this.y-other.y);
	return undefined;
}

Vec.prototype.mul = function(num)
{
	return new Vec(this.x*num, this.y*num);
}

Vec.prototype.dot = function(other)
{
	if (typeof other == "object")
		return this.x*other.x + this.y*other.y;
	return undefined;
}

Vec.prototype.cross = function(other)
{
	if (typeof other == "object")
		return this.x*other.y - this.y*other.x;
	return undefined;
}

Vec.prototype.rotate = function(angle)
{
	return new Vec(Math.cos(angle) * this.x - Math.sin(angle) * this.y, Math.sin(angle) * this.x + Math.cos(angle) * this.y);
}


var scarf = [];
var scarfv = [];
var scarftail = [];
var scarftaildest;
var scarfNodeNum = 20;
var scarfDistance = 5;

function onLoad()
{
	for (var i = 0; i < elementIds.length; i++)
		e[elementIds[i]] = document.getElementById(elementIds[i]);
	canv = e.canv.getContext("2d");

	setInterval(update, 16);

	addEventListener("keydown", function(e){
	});

	addEventListener("mousedown", function(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
		mouseDrag = true;
	});

	addEventListener("mouseup", function(e){
		mouseDrag = false;
	});

	addEventListener("mousemove", function(e){
		

		mouseX = e.clientX;
		mouseY = e.clientY;

		e.preventDefault();
	});

	for (var i = 0; i < scarfNodeNum; i++)
	{
		scarf[i] = new Vec(i*scarfDistance, 0);
		scarfv[i] = new Vec(0, 0);
		scarftail[i] = new Vec(1, 0);
	}
	scarftaildest = new Vec(1, 0);
}

//var gravity = new Vec(0, 1);
var t = 0;
function update()
{
	t = t+0.125;
	canv.clearRect(0, 0, e.canv.width, e.canv.height);
	var mouse = new Vec(mouseX, mouseY);
	scarfv[0] = mouse.sub(scarf[0]);
	if (scarfv[0].size() > 1)
	{
		scarftaildest = scarfv[0].mul(-1).normalize();
	}
	scarftail[0] = scarftail[0].add(scarftaildest.sub(scarftail[0]).mul(0.25));
	scarftaildest = scarftaildest.rotate(Math.sin(t)*0.0625);
	scarf[0] = mouse;

	for (var i = scarfNodeNum - 1; i > 0; i--)
	{
		scarf[i] = scarf[i].add(scarfv[i]);//.add(new Vec(0, Math.sin(t+i*0.25)*i/8));
		scarf[i] = scarf[i].add(scarftail[i-1].sub(scarftail[i]).mul(scarfDistance*i));
		// scarf[i] = scarf[i].add(gravity);
		scarfv[i] = scarfv[i-1];
		scarftail[i] = scarftail[i-1];
	}
	/*
	for (var i = 0; i < scarfNodeNum-1; i++)
	{
		if (scarfv[i].size > 0.1) continue;
		var dest = scarf[i].add(scarftail[i].mul(scarfDistance));
		scarf[i+1] = scarf[i+1].add(dest.sub(scarf[i+1]).mul(0.5));
	}
	*/
	drawScarf();
}


function drawScarf()
{
	canv.beginPath();
	for (var i = 0; i < scarfNodeNum; i++)
	{
		canv.lineTo(scarf[i].x, scarf[i].y);
	}
	canv.strokeStyle = "red";
	canv.lineWidth = 8;
	canv.stroke();
}