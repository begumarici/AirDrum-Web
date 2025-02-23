export default class SoundTrigger {
  constructor() {
    this.sounds = {
      snare: new Audio("/sounds/Ensoniq-ESQ-1-Snare.wav"),
      hihat: new Audio("/sounds/Closed-Hi-Hat-1.wav"),
      crash: new Audio("/sounds/Crash-Cymbal-1.wav"),
      cymbal: new Audio("/sounds/Ensoniq-SQ-1-Ride-Cymbal.wav"),
      bass: new Audio("/sounds/Bass-Drum-2.wav"),
    };
  
    Object.values(this.sounds).forEach((sound) => {
      sound.load();
    });
  
    this.onPlaySound = null; 
  }
  

  playSound(soundName, position) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; 
      sound.play().catch((err) => {
        console.error(`Audio play error for ${soundName}:`, err);
      });
  
      if (position && this.onPlaySound) {
        this.onPlaySound(soundName, position);
      }
    }
  }
  
}