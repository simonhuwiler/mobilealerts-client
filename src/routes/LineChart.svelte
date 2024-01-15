<script lang="ts">
  export let data: any = [];
  export let extentY:number[] = []
  export let color:string = ''
	export let setCurrentValue:any = () => {}
  import { line, curveNatural, scaleLinear,  extent, scaleTime, pointer } from 'd3';
  
  var width = 300;
	var height = 150;
	var margin = { top: 0, bottom: 10, left: 25, right: 0 };
  let el:any;
	var tooltipPoint = {x: 0, y: 0, value: "xx"}
	var tooltipActive = false
    
	// scales
	let extentX = extent(data, (d:any) => d.ts);
	let xScale = scaleTime()
		.domain(extentX)
		// .range([margin.left, width - margin.right]);
		.range([0, width - margin.right]);

	let yScale = scaleLinear()
		.domain(extentY)
		.range([height - margin.bottom, margin.top]);
	
	let path = line()
		.x((d:any) => xScale(d.ts))
    .y((d:any) => yScale(d['_value']))
	  .curve(curveNatural);  

  // ticks for x axis - first day of each month found in the data
	// Round to next Hour
	let tick1:Date = new Date(extentX[0])
	tick1.setMinutes(tick1.getMinutes() + 60) // To next hour
	tick1.setMinutes(0, 0, 0) // Round

	
	let tick2:Date = new Date(extentX[1])
	tick2.setMinutes(0, 0, 0) // Round

	// Add Midnight-Tick?
	let tickMidnight:Date = new Date(extentX[0])
	tickMidnight.setHours(24, 0, 0, 0)

	var xTicks:Date[] = []
	var xTicksPosition:string[]
	if(
		((tick1.getTime() + 2 * 60 * 60 * 1000) < tickMidnight.getTime()) &&
		((tick2.getTime() - 2 * 60 * 60 * 1000) > tickMidnight.getTime()) &&
		(tickMidnight < tick2)
	)
	{
  	xTicks = [tick1, tickMidnight, tick2];
		xTicksPosition = ['start', 'middle', 'end']
	}
	else
	{
		xTicks = [tick1, tick2];
		xTicksPosition = ['start', 'end']
	}

  let yTicks:number[] = []
  for(let i:number = 0; i < 4; i++)
  {
    let x:number = ((extentY[1] - extentY[0]) / 4 * i) + extentY[0]
    yTicks.push(Math.round(x * 10) / 10)
  }

  let xLabel = (x: Date) => {
    let h:string = `${x.getHours() < 10 ? '0' : ''}${x.getHours()}`;
    return `${h}h`
  }

	const handleMouseMove = (event:any) => {
		// Check if Touchevent. Quite dirty...
		if("touches" in event)
		{
			event = event.touches[0]
		}

		const dt = xScale.invert(pointer(event, el)[0] - margin.left)
		tooltipActive = true

		// That could be done better...
		var difference = Math.abs(data[0].ts - dt)
		var dataFound = data[0]
		for(var d of data)
		{
			if(Math.abs(d.ts - dt) < difference)
			{
				difference = Math.abs(d.ts - dt)
				dataFound = d
			}
		}

		if(dataFound)
		{
			setCurrentValue(dataFound)
			tooltipPoint.x = xScale(dataFound.ts)
			tooltipPoint.y = yScale(dataFound._value)
			tooltipPoint.value = `${dataFound.ts.getHours()}:${dataFound.ts.getMinutes() < 10 ? '0' : ''}${dataFound.ts.getMinutes()}`
		}

	}

	const handleMouseLeave = () => {
		tooltipActive = false
		setCurrentValue(data[0])
	}

</script>

<style>
	svg {
		width: 100%;
		/* height: 100%; */
    position: relative;
    left: 0;

	}

	.tick {
		font-size: 11px;
	}

</style>

<svg 
  bind:this={el}
	viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}
	on:mousemove={handleMouseMove}
	on:touchmove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
>
	<g>
		<!-- line -->
			<path 
		  	transform="translate({margin.left}, 0)"
				d="{path(data)}"
				fill="none"
				stroke={color}
        stroke-width=1.5
			/>
	</g>
	
	<!-- y axis -->
	<g transform="translate({margin.left}, 0)">
		{#each yTicks as y} 
			<g class="tick" opacity="1" transform="translate(0,{yScale(y)})">
				<line stroke="grey" stroke-width=0.5 x1='0' x2={width} />
				<text dy="0.32em" fill="currentColor" x="-{margin.left}" color='grey'>
					{y.toFixed(1)}
				</text>
			</g>
 		{/each}
	</g>
	
	<!-- Add Midnight-Line -->
	<g transform="translate({margin.left}, {height})">
		<g class="tick" opacity="1" transform="translate({xScale(tickMidnight)},0)">
		  <line stroke="grey" x=0 stroke-width=0.2 y1='-10' y2={-yScale(yTicks[0])} />
		</g>
	</g>

	<!-- x axis -->
	{#if !tooltipActive}
		<g transform="translate({margin.left}, {height})">
			{#each xTicks as x, i} 
				<g class="tick" opacity="1" transform="translate({xScale(x)},0)">
					<line stroke="grey" x=0 stroke-width=0.2 y1='-7' y2='-13' />
					<text fill="currentColor" y="0" dy="0.71em" text-anchor={xTicksPosition[i]}>
						{xLabel(x)}
					</text>
				</g>
			{/each}
		</g>
	{/if}

	{#if tooltipActive}
		<!-- Tooltip Point-->
		<g transform="translate({margin.left}, 0)">
			<circle
			  class="point"
				cx={tooltipPoint.x}
				cy={tooltipPoint.y}
				r="4"
				fill = {color} 
			/>
		</g>	

		<!-- Tooltip Label -->
		<g transform="translate({margin.left}, {height})">
			<g class="tick" opacity="1" transform="translate({tooltipPoint.x},0)">
				<line stroke="grey" x=0 stroke-width=0.2 y1='-7' y2='-13' />
				<text fill="currentColor" y="0" dy="0.71em" text-anchor="middle">
					{tooltipPoint.value}
				</text>
			</g>
		</g>
	{/if}

</svg>

