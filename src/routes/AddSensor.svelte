<script lang="ts">

  import { sensors } from './store.ts';

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

      $sensors = [...$sensors, {
  			sensorID: sensorID,
        sensorName: sensorName
  		}];

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

  /* CSS */
  .button-6 {
    align-items: center;
    background-color: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: .25rem;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 1.25;
    margin: 0;
    min-height: 3rem;
    padding: calc(.875rem - 1px) calc(1.5rem - 1px);
    position: relative;
    text-decoration: none;
    transition: all 250ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    width: auto;
  }

  .button-6:hover,
  .button-6:focus {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(0, 0, 0, 0.65);
  }

  .button-6:hover {
    transform: translateY(-1px);
  }

  .button-6:active {
    background-color: #F0F0F1;
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    color: rgba(0, 0, 0, 0.65);
    transform: translateY(0);
  }  

    
</style>
