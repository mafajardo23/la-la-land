//QWERTY APP ***************************************************
const synth = new Tone.Synth().toDestination();

const keyboard = new AudioKeys();

keyboard.down((key) => {
    console.log(key);
    synth.triggerAttackRelease(key.frequency, "8n");
});