//QWERTY APP ***************************************************

// Use a piano sampler instead of a synth
const piano = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3"
    },
    release: 3,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

const keyboard = new AudioKeys();


keyboard.down((key) => {
    console.log(key);
    if (key.frequency) {
        piano.triggerAttackRelease(key.frequency, "8n");
    }
});