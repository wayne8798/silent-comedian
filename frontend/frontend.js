d3.selectAll(".video")
.style("visibility","hidden");

d3.selectAll(".graph")
.style("opacity",0);

function changeVideo(data){
		d3.selectAll(".video")
		.style("visibility","visible");

		d3.selectAll(".graph")
		.style("opacity",0);

		clearGraph();
		setupTitleVideo(data);
		drawGraph(data);
	
}

//changeVideo(frozen);

function setupTitleVideo(data){
	d3.select("#movieTitle")
	.text(data.movieTitle);

	open(data.videoPath);
	// d3.select("#movieSource")
	// .attr("src",data.videoPath);
}

function clearGraph(){
	d3.select(".graph").selectAll("svg").remove();
	var newSVG = d3.select(".graph").append("svg");
	newSVG.append("g").attr("id","axisCanvas");
	newSVG.append("g").attr("id","backCanvas");
	newSVG.append("g").attr("id","slidebarCanvas");
	newSVG.append("g").attr("id","silenceCanvas");
	newSVG.append("g").attr("id","screenshotCanvas")
	.append("image")
	.attr("id","screenshot");
}

function drawGraph(data)
{
	var totalHeight = 250, totalWidth = 800;
	var margin = {top: 50, right:50, left:50, bottom:20};
	var svgWidth = totalWidth - margin.left - margin.right, svgHeight = totalHeight - margin.top - margin.bottom;
	var tickPadding = 10, graphPadding = 20, slidebarPadding = -20;

	var silenceTotalHeight = 50, silenceOffsetY=-50,silenceColor = "black";

	var silenceLimit = 1;

	d3.select("svg")
	.attr("height",totalHeight)
	.attr("width",totalWidth)
	.selectAll("g")
	.attr("transform","translate("+margin.left+","+margin.top+")");

	var svg = d3.select("#backCanvas");

	//set up scale

	var x = d3.scale.linear()
	.range([graphPadding,svgWidth-graphPadding])
	.domain([0,data.totalTime]);

	var maxDB = d3.max(data.bars,function(d){return d.dB;});

	var y = d3.scale.linear()
	.range([0,svgHeight])
	.domain([0,maxDB]);

	var yAxisL = d3.svg.axis()
	.scale(y)
	.tickPadding(0)
	.orient("left");

	var yAxisR = d3.svg.axis()
	.scale(y)
	.tickSize(svgWidth-2*tickPadding)
	.tickPadding(tickPadding)
	.orient("right");

	d3.select("#axisCanvas")
	.append("g")
	.attr("class","y axis left")
	.attr("transform","translate(0,0)")
	.call(yAxisL);

	d3.select("#axisCanvas")
	.append("g")
	.attr("class","y axis right")
	.attr("transform","translate("+tickPadding+",0)")
	.call(yAxisR);

	d3.selectAll(".graph")
	.style("opacity",0)
	.transition()
	.duration(1000)
	.style("opacity",1)


	//Draw stack graph
	var bars = svg.selectAll(".bar")
	.data(data.bars)
	.enter()
	.append("g")
	.on("mouseover",mouseoverBar)
	.on("mouseleave",mouseleaveBar)
	.attr("class","bar")
	.attr("transform",function(d){
		return "translate("+x(d.startTime)+",0)";
	})


	var rects = bars.selectAll(".color")
	.data(function(d,i){
		var res = [], currentY = 0;	
		d.colors.sort(function(a,b){return a.ratio - b.ratio;});

		//Fix Data
		var sumRatio = 0;
		for(var j = 0;j < d.colors.length;j ++)
			sumRatio = sumRatio + d.colors[j].ratio;
		
		for(var j = 0;j < d.colors.length;j ++)
			d.colors[j].ratio = d.colors[j].ratio / sumRatio;


		d.colors.forEach(function(element,index,array){
			var t= {
				color:element.color,
				width: x(d.endTime) - x(d.startTime),
				height: y(d.dB)*element.ratio,
				y:currentY,
				bari:i
			};
			currentY += t.height;
			res.push(t);

		});
		return res;
	})
	.enter()
	.append("rect")
	.attr("class","color")
	.attr("width",function(d){return d.width})
	.attr("x",0)
	.attr("y",0)
	.attr("opacity",1)
	.attr("fill",function(d){return d.color;})
	.attr("height",0)
	.transition()
	.duration(1000)
	.delay(function(d,i){return d.bari*20 + 1000})
	.attr("y",function(d){return d.y;})
	.attr("height",function(d){return d.height})

	drawSilenceBar();

	d3.select("#silenceCanvas").selectAll(".silenceBar")
	.attr("y",0)
	.attr("height",0)
	.transition()
	.duration(1000)
	.delay(function(d,i){return i * 200 + 2000})
	.attr("y",silenceOffsetY)
	.attr("height",silenceTotalHeight)			



	//Draw slide bar
	var slideCircleR = 10;
	var slideSvg = d3.select("#slidebarCanvas");

	slideSvg.append("circle")
	.attr("class","slideComponent")
	.attr("r",slideCircleR)
	.attr("cx",-slideCircleR + slidebarPadding)
	.attr("cy",0);

	slideSvg.append("circle")
	.attr("class","slideComponent")
	.attr("r",slideCircleR)
	.attr("cx",svgWidth+slideCircleR - slidebarPadding)
	.attr("cy",0);

	slideSvg.append("line")
	.attr("class","slideComponent")
	.attr("x1",slidebarPadding)
	.attr("y1",0)
	.attr("x2",svgWidth - slidebarPadding)
	.attr("y2",0)

	slideSvg.append("rect")
	.attr("class","slideComponent")
	.attr("width",svgWidth)
	.attr("height",0)
	.attr("x",0)
	.attr("y",0)
	.attr("fill","white")
	.attr("opacity",0.7)

	slideSvg
	.attr("opacity",0)
	.transition()
	.duration(1000)
	.delay(4000)
	.attr("opacity",1)


	var tY = 0;
	var drag = d3.behavior.drag()
	.origin(function(d){return {x:0,y:tY};})
	.on("drag",dragmove)
	.on("dragend",dragend);

	d3.select("#slidebarCanvas")
	.call(drag);

	function dragmove(d){

		tY = d3.event.y;
		tY = Math.max(0,tY);
		tY = Math.min(svgHeight,tY);
		// d3.select(this)				
		// .attr("transform","translate("+margin.left+","+ (tY+margin.top)+")");

		d3.selectAll("circle.slideComponent")
		.attr("cy",tY);

		d3.selectAll("line.slideComponent")
		.attr("y1",tY)
		.attr("y2",tY);

		d3.selectAll("rect.slideComponent")
		.attr("height",tY);

		silenceTotalHeight = (-silenceOffsetY) + tY;
		updateSilenceHeight();

		document.getElementById("value").innerHTML = y.invert(tY).toFixed(1);

		silenceLimit = y.invert(tY); //update silenceLimit

		drawSilenceBar();
	}

	function dragend()
	{
		
	}

	function updateSilenceHeight(){
		d3.selectAll(".silenceBar")
		.attr("height",silenceTotalHeight);
	}

	function drawSilenceBar()
	{
		var silenceData = [];
		data.bars.slice(0).forEach(function(element,index,array){
			if(element.dB <= silenceLimit)
			{
				if(silenceData.length == 0)
				{
					silenceData.push(
					{
						colors:element.colors,
						dB:element.dB,
						endTime:element.endTime,
						imagePath:element.imagePath,
						startTime:element.startTime
					}
					);
				}
				else
				{
					var lastSilenceData = silenceData[silenceData.length - 1];
					if(element.startTime - lastSilenceData.endTime < 1)
					{
						lastSilenceData.endTime = element.endTime;
					}
					else
					{
						silenceData.push(
						{
							colors:element.colors,
							dB:element.dB,
							endTime:element.endTime,
							imagePath:element.imagePath,
							startTime:element.startTime
						}
						);
					}
				}
			}
		});

		// console.log(silenceData);
		
		var silenceBars = d3.select("#silenceCanvas").selectAll(".silenceBar")
		.data(silenceData);

		silenceBars.exit().remove();

		silenceBars.enter()
		.append("rect")
		.attr("class","silenceBar")
		
		silenceBars
		.on("click",silenceBarClick)
		.attr("x",function(d){return x(d.startTime)})
		.attr("y",silenceOffsetY)
		.attr("width",function(d){return x(d.endTime)-x(d.startTime);})
		.attr("height",silenceTotalHeight)
	}


	function silenceBarClick(d)
	{				
		//document.getElementById("videoTimeTag").innerHTML="Play: "+d.startTime+" to "+d.endTime;
		setTimeRange(d.startTime,d.endTime);
		vidplay();
	}

	function mouseoverBar(d){
		// var video = d3.select("#Video1");		
		d3.select("#screenshot")
		.attr("opacity",1)
		.attr("xlink:href",d.imagePath)		
		.attr("width","500px")
		.attr("height","200px")
		.attr("y",silenceOffsetY)
		.attr("x",function(){
			var xValue = x(d.startTime)
			if(xValue > svgWidth / 2)
			{
				return xValue - 500;
			}
			else
			{
				return xValue;
			}

		})

	}

	function mouseleaveBar () {
		d3.select("#screenshot")
		.attr("opacity",0);
	}
}