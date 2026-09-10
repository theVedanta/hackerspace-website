/**
 * Tiny synth for the game. Everything is an oscillator with an envelope, so
 * there is nothing to load and nothing to license. Created lazily on the
 * first user gesture, which is the Start button.
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
            this.master.gain.value = 0.13;
            this.master.connect(this.ctx.destination);
        }
        if (this.ctx.state === "suspended") void this.ctx.resume();
    }

    private tone(
        freq: number,
        dur: number,
        type: OscillatorType = "square",
        slideTo?: number,
        gain = 1
    ) {
        if (!this.ctx || !this.master || this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        g.gain.setValueAtTime(gain, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g);
        g.connect(this.master);
        osc.start(t);
        osc.stop(t + dur + 0.02);
    }

    brick() {
        this.tone(480 + Math.random() * 160, 0.09, "square", 1100, 0.7);
    }
    paddle() {
        this.tone(210, 0.07, "triangle", 320, 0.9);
    }
    wall() {
        this.tone(160, 0.04, "triangle", undefined, 0.5);
    }
    launch() {
        this.tone(330, 0.09, "square", 660, 0.5);
    }
    lose() {
        this.tone(220, 0.4, "sawtooth", 55, 0.5);
    }
    win() {
        [523, 659, 784, 1047, 1319].forEach((f, i) =>
            window.setTimeout(() => this.tone(f, 0.22, "square", undefined, 0.55), i * 85)
        );
    }

    destroy() {
        void this.ctx?.close();
        this.ctx = null;
        this.master = null;
    }
}
