
//QWERTY APP ***************************************************
// Riff sequence for playback (matches the riff-guide)
const riffSequence = [
    { hold: 'f', duration: 500 }, { hold: 'h', duration: 500 }, { hold: 'j', duration: 500 }, { hold: 'k', duration: 500 }, { hold: 'j', duration: 500 }, { hold: 'h', duration: 500 }, { hold: 'f', duration: 2200 },

    { hold: 'f', duration: 500 }, { hold: 'h', duration: 500 }, { hold: 'j', duration: 500 }, { hold: 'k', duration: 500 }, { hold: 'j', duration: 500 }, { hold: 'h', duration: 500 }, { hold: 'd', duration: 2100 },

    { hold: 'f', duration: 500 }, { hold: 'h', duration: 500 }, { hold: 'j', duration: 500 }, { hold: 'k', duration: 500 }, { hold: 'j', duration: 500 }, { hold: 'h', duration: 500 }, { hold: 'f', duration: 2100 },

];


// Map riff keys to piano notes (adjust as needed)
const riffKeyToNote = {
    'f': 'C4',
    'h': 'D#4',
    'j': 'F#4',
    'k': 'A4',
    'd': 'D#4' // Example: adjust if needed
};

// Helped me still use the same notes from the qwerty tutorial
function getFrequencyForKey(qwertyKey) {
    // AudioKeys default QWERTY mapping (same as used by AudioKeys)
    const keyToMidi = {
        'a': 60, 'w': 61, 's': 62, 'e': 63, 'd': 64, 'f': 65, 't': 66, 'g': 67, 'y': 68, 'h': 69, 'u': 70, 'j': 71, 'k': 72, 'o': 73, 'l': 74, 'p': 75, ';': 76
    };
    const midi = keyToMidi[qwertyKey];
    if (midi === undefined) return undefined;
    // MIDI to frequency formula
    return 440 * Math.pow(2, (midi - 69) / 12);
}

async function playRiff() {
    const riffBtns = document.querySelectorAll('#riff-sequence .riff-key');
    let btnIdx = 0;
    for (let i = 0; i < riffSequence.length; i++) {
        const step = riffSequence[i];
        if (typeof step === 'string') {
            // Play note using QWERTY mapping
            const freq = getFrequencyForKey(step);
            if (freq) piano.triggerAttackRelease(freq, '8n');
            for (; btnIdx < riffBtns.length; btnIdx++) {
                if (riffBtns[btnIdx].getAttribute('data-key') === step) {
                    riffBtns[btnIdx].classList.add('lit');
                    setTimeout(() => {
                        riffBtns[btnIdx].classList.remove('lit');
                    }, 200);
                    btnIdx++;
                    break;
                }
            }
            await new Promise(res => setTimeout(res, 250));
        } else if (step.hold) {
            // Hold note for specified duration using QWERTY mapping
            const freq = getFrequencyForKey(step.hold);
            if (freq) piano.triggerAttackRelease(freq, step.duration / 1000);
            for (; btnIdx < riffBtns.length; btnIdx++) {
                if (riffBtns[btnIdx].getAttribute('data-key') === step.hold) {
                    riffBtns[btnIdx].classList.add('lit');
                    setTimeout(() => {
                        riffBtns[btnIdx].classList.remove('lit');
                    }, step.duration);
                    btnIdx++;
                    break;
                }
            }
            await new Promise(res => setTimeout(res, step.duration));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('play-riff-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playRiff();
        });
    }
});

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