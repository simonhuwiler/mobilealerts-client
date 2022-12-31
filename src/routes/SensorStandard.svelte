<script lang="ts">

  import { extent } from 'd3';
  import { SensorType } from './sensors'
  import { storeIsDeleteMode, storeRemoveSensorPreview } from './store.ts';
  import LineChart from './LineChart.svelte'
  import DeleteSymbol from './DeleteSymbol.svelte'

  export let data: any = null
  export let sensor:SensorType
  export let sensorName: string = ''
  export let color:string;

  const timestampToDuration = (timestamp: number) => {
    const now: Date = new Date();
    const then: Date = new Date(timestamp * 1000)
    const minutes: number = Math.round((now.getTime() - then.getTime()) / 1000 / 60)
    const hours: number = Math.round(minutes / 60)
    const days: number = Math.round(minutes / 60 / 24)

    if(minutes < 60) return `${minutes} Minuten`
    else if(hours == 1) return `einer Stunde`
    else if(hours < 24) return `${hours} Stunden`
    else if(days == 1) return 'einem Tag'
    else return `${days} Tagen`
  }

  // Calculate Extent for LineChart
  var extentY:number[];
  if(sensor == SensorType.Temperature)
  {
  	extentY = extent(data.measurements, (d:any) => d.t1);
    extentY[0] = Math.floor(extentY[0])
    extentY[1] = Math.ceil(extentY[1]) 
  }
  else if(sensor == SensorType.Humidity)
  {
     extentY = [0, 100]
  }

  // Subscribe to delete Mode
  var isDeleteMode:boolean = false
  storeIsDeleteMode.subscribe((v:boolean) => isDeleteMode = v)

  var isDeleted:boolean = false
  storeRemoveSensorPreview.subscribe((v:string[]) => isDeleted = v.includes(data.deviceid))  

</script>

<div class="chartstandard box" class:deleted={isDeleted}>

   {#if isDeleteMode}
    <DeleteSymbol sensorID = {data.deviceid}/>
  {/if}

  <h2 style:color={color}>{sensorName}</h2>
  {#if data.lowbattery}
    <div class='lowbattery'>Batterie bald leer</div>
  {/if}

  <div class='value'>
    <div class='big' style:color={color}>{data.measurements[0]['_value']}</div>
    <div class='right'>
      <div class='unit' style:color={color}>{sensor == SensorType.Temperature ? '°C' : '%'}</div>
      
      <div class='timestamp'>vor {timestampToDuration(data.measurements[0].ts)}</div>
    </div>
  </div>

  {#if data !== null}
    <LineChart 
      data={data.measurements}
      extentY = {extentY}
      color = {color}
      />
  {/if}
    
</div>

<style>

  .lowbattery
  {
    font-size: 12px;
    color: grey;
  }

  .value
  {
    position: relative;
    width: auto;
  }

  .value .big
  {
    font-weight: bold;
    font-size: 40px;
    padding: 5px 0 15px;
    display: inline;
    float: left;
  }

  .value .right
  {
    padding: 25px 0 0 10px;
    float: left;
  }

  .value .unit
  {
    font-size: 16px;
    line-height: 0.6em;
  }

  .value .timestamp
  {
    color: grey;
    font-size: 12px;
  }

  .value::after {
    content: "";
    clear: both;
    display: table;
  }

  .deleted
  {
    /* height: 400px; */
    animation: shrink 0.5s linear normal forwards;
    overflow: hidden;
  }

  @keyframes shrink {
    from {max-height: 400px}
    to {
      max-height: 0px;
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
    
</style>
