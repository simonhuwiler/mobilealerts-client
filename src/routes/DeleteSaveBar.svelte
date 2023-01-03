<script lang="ts">
  import { storeIsDeleteMode, storeRemoveSensorPreview, storeSensors } from './store.ts';

  // Subscribe to registered sensors
  var sensors:any[] = []
  storeSensors.subscribe((v:string[]) => sensors = v)

  var removeSensorPreview:string[] = []
  storeRemoveSensorPreview.subscribe((v:string[]) => removeSensorPreview = v)

  // Abort function. Reset state.
  const abort = () => {
    storeRemoveSensorPreview.set([])
    storeIsDeleteMode.set(false)
  }

  // Update sensors
  const save = () => {
    const newSensors = sensors.filter((sensor:any) => !removeSensorPreview.includes(sensor.sensorID))
    storeSensors.set(newSensors)

    // Restore layout
    storeRemoveSensorPreview.set([])
    storeIsDeleteMode.set(false)
  }

</script>

<div class='deletesavebar'>
  <button class="button-6" on:click={abort}>Abbrechen</button>
  <button class="button-6 save" on:click={save}>Speichern</button>
</div>

<style>
  .deletesavebar
  {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 100%;
    padding: 5px;
    background-color: rgba(63, 63, 63, 0.866);
    box-shadow: 0px 0px 15px 10px rgba(0,0,0,0.1);
    border-radius: 5px;
    z-index: 3000;
    display: inline-block;
    text-align: center;
  }

  button
  {
    background-color: rgb(255, 255, 255);
    display: inline-block !important;
  }

  button.save
  {
    background-color: rgb(238, 255, 236);
  }
</style>