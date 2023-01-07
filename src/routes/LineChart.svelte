<script lang="ts">
  export let data: any = [];
  export let extentY:number[] = []
  export let color:string = ''
  import { line, curveNatural, scaleLinear,  extent, scaleTime } from 'd3';
  
  var width = 300;
	var height = 150;
	var margin = { top: 0, bottom: 10, left: 25, right: 0 };
  let el
  
  // Parse dates
  data.forEach((d:any) => {
    d.ts = new Date(d.ts * 1000); // x
	});
  
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
    yTicks.push(Math.round( x * 10) / 10)
  }

  let xLabel = (x: Date) => {
    let h:string = `${x.getHours() < 10 ? '0' : ''}${x.getHours()}`;
    // let m:string = `${x.getMinutes() < 10 ? '0' : ''}${x.getMinutes()}`;
    // return `${h}:${m}`
    return `${h}h`
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

<svg bind:this={el} viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}>
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
</svg>