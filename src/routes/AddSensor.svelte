<script lang="ts">

  import { storeSensors } from './store.ts';

  var state = 0
  let sensorID = ''
  let sensorName = ''

  let sensorIdEmpty = false
  let sensorNameEmpty = false

  const addSensor = () =>{
    sensorIdEmpty = sensorID == ""
    sensorNameEmpty = sensorName == ""
    
    if(!sensorIdEmpty && !sensorNameEmpty)
    {
      if($storeSensors)
      {
        $storeSensors = [...$storeSensors, {
    			sensorID: sensorID,
          sensorName: sensorName
    		}];
      }
      else
      {
        $storeSensors = [{
    			sensorID: sensorID,
          sensorName: sensorName
    		}];
      }      

      state = 2
    }
  }
</script>

<div class="addsensor box">

  {#if state == 0}

    <h2>Sensor hinzufügen</h2>
    <p>
      Hier kannst Du neue Sensoren hinzufügen. Aktuell werden nur Temperatur- und Feuchtigkeitssensoren unterstützt. Der Sensor muss bereits mindestens ein Messpunkt aufgezeichnet haben, damit er hinzugefügt werden kann. Melde <a href='https://github.com/simonhuwiler/mobilealerts-client/issues' target='_blank'>Dich hier</a>, wenn Dein Sensor nicht unterstützt wird.
    </p>
    <button class="button-6" style='left:50%;transform:translateX(-50%)' on:click={() => state = 1}>Verstanden, Sensor hinzufügen</button>

  {:else if state == 1}

    <div class='form'>
      <input type='text' class={sensorIdEmpty ? 'error' : ''} placeholder="Sensor ID" bind:value={sensorID}/>
      <input type='text' class={sensorNameEmpty ? 'error' : ''}  placeholder="Anzeigename"  bind:value={sensorName}/>
      <button class="button-6" on:click={addSensor}>Sensor hinzufügen</button>
    </div>

  {:else if state == 2}

    <div class='message'>
      <p>
        Der Sensor wurde hinzugefügt. Die aktuelle Konfiguration wurde in Deinen Cookies gespeichert. Um diese Ansicht zu teilen, kopiere die angepasste URL oder setze sie als Lesezeichen.
      </p>
      <button class="button-6" style='left:50%;transform:translateX(-50%)' on:click={() => {
        sensorID = ''
        sensorName = ''
        state = 1
        }}>Weiteren Sensor hinzufügen</button>
    </div>

  {/if}
    
</div>

<style>
	.addsensor {
    background-color: rgb(253, 249, 249);
	}

  h2
  {
    font-weight: 300;
    padding: 0;
    margin: 0;
    /* margin: 0 0 10px; */
    color: grey;
  }

  input
  {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;    
    border-radius: 6px;
    border: 1px solid grey;
    font-size: 16px;
  }

  input.error
  {
    border: 1px solid red;
  }
    
</style>
