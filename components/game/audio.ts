/**
 * Synth for the Quad. Oscillators with envelopes, nothing to load. Created
 * on the first gesture, which is the Begin button.
 */
export class SoundBank {
    private ctx: AudioContext | null = null;
    private master: GainNode | null = null;
    muted = false;

    unlock() {
        if (!this.ctx) {
            const Ctx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext?: typeof AudioContext })
                    .webkitAudioContext;
            if (!Ctx) return;
            this.ctx = new Ctx();
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.16;
            this.master.connect(this.ctx.destination);
        }
        if (this.ctx.state === "suspended") void this.ctx.resume();
    }

    private tone(
        freq: number,
        dur: number,
        type: OscillatorType = "sine",
        gain = 1,
        slideTo?: number,
        delay = 0
    ) {
        if (!this.ctx || !this.master || this.muted) return;
        const t = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g);
        g.connect(this.master);
        osc.start(t);
        osc.stop(t + dur + 0.05);
    }

    /** A bell: a sine and its slightly detuned partial, long decay. */
    private bell(freq: number, delay = 0, dur = 2.2, gain = 0.8) {
        this.tone(freq, dur, "sine", gain, undefined, delay);
        this.tone(freq * 2.01, dur * 0.6, "sine", gain * 0.25, undefined, delay);
        this.tone(freq * 2.98, dur * 0.35, "sine", gain * 0.12, undefined, delay);
    }

    collect() {
        this.tone(880, 0.09, "square", 0.35, 1320);
    }
    discover() {
        this.tone(659, 0.35, "triangle", 0.5);
        this.tone(988, 0.5, "triangle", 0.45, undefined, 0.09);
    }
    levelUp() {
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, "square", 0.3, undefined, i * 0.07));
    }
    ui() {
        this.tone(440, 0.05, "triangle", 0.25);
    }
    open() {
        this.tone(330, 0.12, "triangle", 0.3, 440);
    }
    chimes() {
        // Denny Chimes plays the Westminster quarters. Close enough.
        const seq = [659, 523, 587, 392, 392, 587, 659, 523];
        seq.forEach((f, i) => this.bell(f, i * 0.55, 2.6, 0.7));
    }

    destroy() {
        void this.ctx?.close();
        this.ctx = null;
        this.master = null;
    }
}
