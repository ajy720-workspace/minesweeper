// src/lib/audio.ts
'use client';

export type SoundType = 'click' | 'flag' | 'unflag' | 'chord' | 'win' | 'lose' | 'explosion';

/**
 * Audio manager for Minesweeper game using Web Audio API
 * Generates sounds programmatically for game interactions
 */
class AudioManager {
  private context: AudioContext | null = null;
  private isMuted = false;
  private isInitialized = false;

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      this.context = new (window.AudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Resume audio context if suspended (required by browser autoplay policies)
   */
  private async resumeContext(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Create a tone using oscillator
   */
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.context || this.isMuted) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  /**
   * Create noise burst for explosion sound
   */
  private createNoise(duration: number): void {
    if (!this.context || this.isMuted) return;

    const bufferSize = this.context.sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate pink noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Low-pass filter for warmer sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.context.currentTime);

    // Envelope
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    noise.start(this.context.currentTime);
    noise.stop(this.context.currentTime + duration);
  }

  /**
   * Play sound effect based on game interaction
   */
  async playSound(type: SoundType): Promise<void> {
    if (this.isMuted) return; // Early return if muted
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    await this.resumeContext();

    switch (type) {
      case 'click':
        // Short, pleasant click sound
        this.createTone(800, 0.1, 'sine');
        break;

      case 'flag':
        // Ascending tone for flagging
        if (this.context) {
          const oscillator = this.context.createOscillator();
          const gainNode = this.context.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.context.destination);
          
          oscillator.frequency.setValueAtTime(400, this.context.currentTime);
          oscillator.frequency.linearRampToValueAtTime(600, this.context.currentTime + 0.15);
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, this.context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.08, this.context.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.15);
          
          oscillator.start(this.context.currentTime);
          oscillator.stop(this.context.currentTime + 0.15);
        }
        break;

      case 'unflag':
        // Descending tone for unflagging
        if (this.context) {
          const oscillator = this.context.createOscillator();
          const gainNode = this.context.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.context.destination);
          
          oscillator.frequency.setValueAtTime(600, this.context.currentTime);
          oscillator.frequency.linearRampToValueAtTime(400, this.context.currentTime + 0.12);
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, this.context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.06, this.context.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.12);
          
          oscillator.start(this.context.currentTime);
          oscillator.stop(this.context.currentTime + 0.12);
        }
        break;

      case 'chord':
        // Multi-tone chord for chord clicking
        this.createTone(500, 0.12, 'sine');
        setTimeout(() => this.createTone(750, 0.08, 'sine'), 30);
        break;

      case 'win':
        // Victory fanfare
        const winNotes = [523, 659, 784, 1047]; // C, E, G, C
        winNotes.forEach((note, index) => {
          setTimeout(() => this.createTone(note, 0.3, 'triangle'), index * 150);
        });
        break;

      case 'lose':
        // Descending defeat sound
        if (this.context) {
          const oscillator = this.context.createOscillator();
          const gainNode = this.context.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.context.destination);
          
          oscillator.frequency.setValueAtTime(400, this.context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.5);
          oscillator.type = 'sawtooth';
          
          gainNode.gain.setValueAtTime(0, this.context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.15, this.context.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
          
          oscillator.start(this.context.currentTime);
          oscillator.stop(this.context.currentTime + 0.5);
        }
        break;

      case 'explosion':
        // Noise burst for mine explosion
        this.createNoise(0.3);
        break;
    }
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Set mute state
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  /**
   * Get current mute state
   */
  isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Check if audio is supported and initialized
   */
  isSupported(): boolean {
    return this.isInitialized && this.context !== null;
  }
}

// Export singleton instance
export const audioManager = new AudioManager();