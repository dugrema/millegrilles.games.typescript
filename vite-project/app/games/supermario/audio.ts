// Web Audio API synthesis for Super Mario sound effects
// No external audio files required - all sounds synthesized in real-time

/**
 * Audio Manager using Web Audio API
 * Synthesizes retro-style 8-bit sound effects
 */
class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.3; // Default volume (30%)
  private enabled: boolean = false;

  /**
   * Initialize audio context on first user interaction
   */
  public async enableAudio(): Promise<void> {
    if (this.enabled) return;

    this.audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.audioContext.destination);
    this.enabled = true;
  }

  /**
   * Set master volume (0-1)
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return this.volume;
  }

  /**
   * Toggle audio on/off
   */
  public toggleAudio(): boolean {
    if (!this.enabled) {
      this.enableAudio();
      return true;
    }
    // Mute by setting volume to 0
    this.enabled = false;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
    return false;
  }

  /**
   * Generate Mario's jump sound - sliding pitch down
   */
  public playJump(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "square";
    osc.frequency.value = 180;

    // Pitch slide effect
    osc.frequency.exponentialRampToValueAtTime(
      220,
      this.audioContext.currentTime + 0.1,
    );
    osc.frequency.exponentialRampToValueAtTime(
      150,
      this.audioContext.currentTime + 0.2,
    );

    // Gain envelope
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      0.15,
      this.audioContext.currentTime + 0.02,
    );
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Coin collection sound - high pitched ascending chime
   */
  public playCoin(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "square";

    // Quick ascending notes
    osc.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(
      1200,
      this.audioContext.currentTime + 0.05,
    );
    osc.frequency.linearRampToValueAtTime(
      1800,
      this.audioContext.currentTime + 0.1,
    );

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      0.1,
      this.audioContext.currentTime + 0.02,
    );
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.15);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Power-up collection sound - Mario grows big
   */
  public playPowerUp(): void {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Multi-note ascending arpeggio
    for (let i = 0; i < 4; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.type = "triangle";
      osc.frequency.value = 440 + i * 220;

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.08 + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.1);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.1);
    }
  }

  /**
   * Shrink sound - Mario loses power-up
   */
  public playShrink(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "sawtooth";
    osc.frequency.value = 600;

    // Descending pitch with wobble
    osc.frequency.linearRampToValueAtTime(
      500,
      this.audioContext.currentTime + 0.1,
    );
    osc.frequency.linearRampToValueAtTime(
      400,
      this.audioContext.currentTime + 0.2,
    );
    osc.frequency.linearRampToValueAtTime(
      300,
      this.audioContext.currentTime + 0.3,
    );

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      0.2,
      this.audioContext.currentTime + 0.02,
    );
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.4);
  }

  /**
   * Brick break sound - short crackle burst
   */
  public playBrickBreak(): void {
    if (!this.audioContext || !this.masterGain) return;

    // Use multiple oscillators for crunchy sound
    const numOscillators = 3;

    for (let i = 0; i < numOscillators; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.type = "square";
      osc.frequency.value = 200 + i * 80 + Math.random() * 40;

      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(
        0.1,
        this.audioContext.currentTime + 0.01,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.15,
      );

      osc.start();
      osc.stop(this.audioContext.currentTime + 0.15);
    }
  }

  /**
   * Mushroom spawn sound - question block activation
   */
  public playMushroomSpawn(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "triangle";

    // Bouncy pitch effect
    const now = this.audioContext.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(520, now + 0.05);
    osc.frequency.linearRampToValueAtTime(440, now + 0.1);
    osc.frequency.linearRampToValueAtTime(520, now + 0.15);
    osc.frequency.linearRampToValueAtTime(600, now + 0.2);

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + 0.25);

    osc.start();
    osc.stop(now + 0.25);
  }

  /**
   * Enemy stomp sound - short crunchy impact
   */
  public playStomp(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "sawtooth";
    osc.frequency.value = 300;

    osc.frequency.linearRampToValueAtTime(
      200,
      this.audioContext.currentTime + 0.08,
    );

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      0.2,
      this.audioContext.currentTime + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1,
    );

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Victory melody - play when flagpole is reached
   */
  public playVictory(): void {
    if (!this.audioContext || !this.masterGain) return;

    const notes = [
      { freq: 523.25, duration: 0.15 }, // C5
      { freq: 659.25, duration: 0.15 }, // E5
      { freq: 783.99, duration: 0.15 }, // G5
      { freq: 1046.5, duration: 0.3 }, // C6
      { freq: 783.99, duration: 0.15 }, // G5
      { freq: 659.25, duration: 0.15 }, // E5
      { freq: 523.25, duration: 0.4 }, // C5
    ];

    let currentTime = this.audioContext.currentTime;

    notes.forEach((note) => {
      if (!this.audioContext || !this.masterGain) return;

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.type = "square";
      osc.frequency.value = note.freq;

      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.1, currentTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);

      osc.start(currentTime);
      osc.stop(currentTime + note.duration);

      currentTime += note.duration;
    });
  }

  /**
   * Mushroom collection effect - subtle sparkle
   */
  public playMushroomCollect(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "sine";

    const now = this.audioContext.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.1);

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.start();
    osc.stop(now + 0.2);
  }

  /**
   * Explosion sound - for particle bursts
   */
  public playExplosion(): void {
    if (!this.audioContext || !this.masterGain) return;

    // Multiple oscillators for richer sound
    for (let i = 0; i < 4; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.type = "sawtooth";
      osc.frequency.value = 100 + i * 50 + Math.random() * 30;

      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(
        0.1,
        this.audioContext.currentTime + 0.01,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.2 + i * 0.02,
      );

      osc.start();
      osc.stop(this.audioContext.currentTime + 0.2 + i * 0.02);
    }
  }

  /**
   * Death sound - Mario loses a life (descending sad tone)
   */
  public playDeath(): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "square";
    osc.frequency.value = 400;

    // Descending pitch - sad effect
    osc.frequency.linearRampToValueAtTime(
      300,
      this.audioContext.currentTime + 0.15,
    );
    osc.frequency.linearRampToValueAtTime(
      200,
      this.audioContext.currentTime + 0.3,
    );

    // Longer duration than jump
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      0.15,
      this.audioContext.currentTime + 0.02,
    );
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }
}

// Singleton instance
const audioManager = new AudioManager();

// Export instance and type
export type { AudioManager };
export default audioManager;
