<script lang="ts">

  import { storeSensors, storePhoneID, storeHideAddSensor } from './store.ts';
  import { defaultPhoneID } from './config'

  var state:number = 0
  let sensorID:string = ''
  let sensorName:string = ''

  let sensorIdEmpty:boolean = false
  let sensorNameEmpty:boolean = false

  // Subscribe to PhoneID
  var phoneID: string;
  storePhoneID.subscribe((v:string) => phoneID = v)

  const afterWelcome = () => {
    state = phoneID ? 2 : 1;
  }

  const addSensor = () =>{
    sensorIdEmpty = sensorID == ""
    sensorNameEmpty = sensorName == ""
    
    if(!sensorIdEmpty && !sensorNameEmpty)
    {
      // PhoneID updaten
      if(!phoneID || phoneID === '')
        storePhoneID.set(defaultPhoneID)
       else
        storePhoneID.set(phoneID)


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

      state = 3
    }
  }
</script>

<div class="addsensor box">

  {#if state == 0}

    <h2>Sensor hinzufügen</h2>
    <p>
      Aktuell werden nur Temperatur- und Feuchtigkeitssensoren unterstützt. Der Sensor muss bereits mindestens ein Messpunkt aufgezeichnet haben, damit er hinzugefügt werden kann. Melde <a href='https://github.com/simonhuwiler/mobilealerts-client/issues' target='_blank' rel='noreferrer'>Dich hier</a>, wenn Dein Sensor nicht unterstützt wird.
    </p>

    <button class="button-6" style='left:50%;transform:translateX(-50%);margin:10px 0 20px;' on:click={afterWelcome}>Verstanden, Sensor hinzufügen</button>

    <p style='text-align: center; font-size: 0.8em'>
		  <span class='link' style='color: grey;' on:click={() => storeHideAddSensor.set(true)} on:keydown={() => storeHideAddSensor.set(true)}>Diesen Block ausblenden</span><br />
    </p>


  {:else if state == 1}

    <h2>Smartphone ID (optional)</h2>

    <p>
      Hier kannst Du Deine <b>ID des Smartphones</b> hinterlegen. Du findest Sie in der App unter <i>Einstellungen</i>, <i>Phone ID</i>. Der Server merkt sich, welche Sensoren zu welchen Geräten passen. Du kannst es auch leer lassen, dann wird der Sensor einem allgemeinen Gerät zugeordnet.
    </p>
    <div class='form'>
      <input type='text' placeholder="ID des Smartphones (leer=allgemeines Gerät)" bind:value={phoneID}/>
      <button class="button-6" on:click={() => state = 2}>Weiter</button>
    </div>

  {:else if state == 2}

   <h2>Sensorangaben</h2>

    <div class='formSensorAngaben'>
      <input type='text' class={sensorIdEmpty ? 'error' : ''} placeholder="Sensor ID" bind:value={sensorID}/>
      <input type='text' class={sensorNameEmpty ? 'error' : ''}  placeholder="Anzeigename"  bind:value={sensorName}/>
      <button class="button-6" on:click={addSensor}>Sensor hinzufügen</button>
    </div>

  {:else if state == 3}

    <div class='message'>

      <h2>Erledigt</h2>

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

  .formSensorAngaben
  {
    padding: 20px 0 0 0;
  }
    
</style>
