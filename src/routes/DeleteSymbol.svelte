<script lang="ts">
  import { storeRemoveSensorPreview } from './store.ts';
  export var sensorID:string;

  const update = () => {
    storeRemoveSensorPreview.update((values:string[]) => [...values, sensorID])
  }

</script>

<div class='deletesymbol' on:click={update}>
  <span>x</span>
</div>
<div class='deleteoverlay' />

<style>
  .deletesymbol
  {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 40px;
    height: 40px;
    background-color: rgb(102, 102, 102);
    color: rgb(236, 236, 236);
    border-radius: 50%;
    text-align: center;
    font-size: 25px;
    font-family: Verdana;
    display: inline-block;
    z-index: 2000;
  }

  .deletesymbol span
  {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 2px;
  }

  .deleteoverlay
  {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 15px;
    z-index: 1000;
  }
</style>