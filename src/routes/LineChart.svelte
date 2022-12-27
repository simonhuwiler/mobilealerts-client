<script lang="ts">
  export let data: any = [];
  export let extentY:number[] = []
  export let color:string = ''
  import { line, curveStep, scaleLinear,  extent, scaleTime } from 'd3';
  
  var width = 300;
	var height = 150;
	var margin = { top: 0, bottom: 10, left: 20, right: 0 };
  let el
  
  // Parse dates
  data.forEach((d:any) => {
    d.ts = new Date(d.ts * 1000); // x
	});
  
	// scales
	let extentX = extent(data, (d:any) => d.ts);
	let xScale = scaleTime()
		.domain(extentX)
		.range([margin.left, width - margin.right]);

	let yScale = scaleLinear()
		.domain(extentY)
		.range([height - margin.bottom, margin.top]);
	
	let path = line()
		.x((d:any) => xScale(d.ts))
    .y((d:any) => yScale(d['_value']))
	  .curve(curveStep);  

  // ticks for x axis - first day of each month found in the data
  let xTicks = [extentX[0], extentX[1]];

  let yTicks:number[] = []
  for(let i:number = 0; i < 4; i++)
  {
    let x:number = ((extentY[1] - extentY[0]) / 4 * i) + extentY[0]
    yTicks.push(Math.round( x * 10) / 10)
  }

  let xLabel = (x: Date) => {
    let h:string = `${x.getHours() < 10 ? '0' : ''}${x.getHours()}`;
    let m:string = `${x.getMinutes() < 10 ? '0' : ''}${x.getMinutes()}`;
    return `${h}:${m}`
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
				<line stroke="grey" stroke-width=0.5 x1='5' x2={width - margin.left + 1} />
				<text dy="0.32em" fill="currentColor" x="-{margin.left}" color='grey'>
					{y.toFixed(1)}
				</text>
			</g>
 		{/each}
	</g>
	
	<!-- x axis -->
	<g transform="translate(0, {height})">
		{#each xTicks as x, y} 
			<g class="tick" opacity="1" transform="translate({xScale(x)},0)">
				<text fill="currentColor" y="0" dy="0.71em" text-anchor={y === 0 ? 'start' : 'end'}>
					{xLabel(x)}
				</text>
			</g>
		{/each}
</svg>