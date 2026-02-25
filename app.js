//QWERTY APP ***************************************************

// Use a piano sampler instead of a synth
const piano = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3"
    },
    release: 5,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

const keyboard = new AudioKeys();

keyboard.down((key) => {
    console.log(key);
    if (key.frequency) {
        piano.triggerAttackRelease(key.frequency, "8n");
        // Make the Play button glow
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.classList.add('glow');
            setTimeout(() => {
                playBtn.classList.remove('glow');
            }, 200);
        }

        const keyCodeToLetter = {
            70: 'f',
            72: 'h',
            74: 'j',
            75: 'k',
            68: 'd'
        };
        const pressed = keyCodeToLetter[key.keyCode];
        if (!window.riffKeyIndices) window.riffKeyIndices = {};
        if (pressed) {
            const riffBtns = document.querySelectorAll(`#riff-sequence .riff-key[data-key='${pressed}']`);
            if (riffBtns.length > 0) {
                // Track which riff-key button to light up next for each key
                if (!(pressed in window.riffKeyIndices)) window.riffKeyIndices[pressed] = 0;
                let idx = window.riffKeyIndices[pressed];
                const btn = riffBtns[idx % riffBtns.length];
                btn.classList.add('lit');
                setTimeout(() => {
                    btn.classList.remove('lit');
                }, 200);
                window.riffKeyIndices[pressed] = (idx + 1) % riffBtns.length;
            }
        }
    }
});