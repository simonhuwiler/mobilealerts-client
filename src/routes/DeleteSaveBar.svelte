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
    width: 252px;
    padding: 5px;
    background-color: rgb(161, 161, 161);
    border: 1px solid rgb(228, 228, 228);
    border-radius: 5px;
    z-index: 3000;
    display: inline-block;
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