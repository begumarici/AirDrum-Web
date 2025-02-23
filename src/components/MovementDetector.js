export default class MovementDetector {
  constructor(soundTrigger) {
    this.previousRightWristY = null;
    this.previousLeftWristY = null;
    this.previousRightKneeY = null; // the previous position of the right knee
    this.isKneeUp = false; // check if the knee is in the up position

    this.threshold = 0.02; // Snare
    this.hihatThreshold = 0.01; // Hi-hat
    this.bassThreshold = 0.02; // Bass Kick
    this.movementThreshold = 0.3; // Crash and Cymbal

    this.soundTrigger = soundTrigger;

    this.snareTriggered = false;
    this.hihatTriggered = false;
    this.crashTriggered = false;
    this.cymbalTriggered = false;
    this.bassKickTriggered = false;
  }

  detectMovement(landmarks) {
    const rightHandTip = landmarks[20]; // The tip of the right hand
    const leftHandTip = landmarks[19]; // the tip of the left hand

    const rightKnee = landmarks[26]; // right knee
    const leftShoulder = landmarks[11]; // left shouulder
    const rightShoulder = landmarks[12]; // right shoulder

    const leftHip = landmarks[23]; // left hip
    const rightHip = landmarks[24]; // right hip

    const bodyCenterX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipCenterY = (leftHip.y + rightHip.y) / 2; // the line between the two hips

    // Hi-Hat  
    if (
      this.previousRightWristY !== null &&
      rightHandTip.y - this.previousRightWristY > this.hihatThreshold && // top to bottom movement
      Math.abs(rightHandTip.y - hipCenterY) < 0.05 && //on the line between two hips
      Math.abs(rightHandTip.x - bodyCenterX) < 0.1 // close to the body center
    ) {
      if (!this.hihatTriggered) {
        this.soundTrigger.playSound("hihat", {
          x: rightHandTip.x,
          y: rightHandTip.y,
        });
        this.hihatTriggered = true;
      }
    } else {
      this.hihatTriggered = false;
    }

    // Snare 
    if (
      this.previousLeftWristY !== null &&
      leftHandTip.y - this.previousLeftWristY > this.threshold && // top to bottom movement
      Math.abs(leftHandTip.y - hipCenterY) < 0.05 && // on the line between two hips
      Math.abs(leftHandTip.x - bodyCenterX) < 0.1 // close to the body center
    ) {
      if (!this.snareTriggered) {
        this.soundTrigger.playSound("snare", {
          x: leftHandTip.x,
          y: leftHandTip.y,
        });
        this.snareTriggered = true;
      }
    } else {
      this.snareTriggered = false;
    }

    // Crash 
    if (
      this.previousRightWristY !== null &&
      rightHandTip.y - this.previousRightWristY > this.threshold && // top to bottom movement
      rightHandTip.x < leftShoulder.x - this.movementThreshold && // right hand should move outside the left shoulder
      Math.abs(rightHandTip.z - leftShoulder.z) < 0.4 // right hand depth should align with left shoulder
    ) {
      if (!this.crashTriggered) {
        this.soundTrigger.playSound("crash", {
          x: rightHandTip.x,
          y: rightHandTip.y,
        });
        this.crashTriggered = true;
      }
    } else {
      this.crashTriggered = false;
    }

    // Cymbal
    if (
      this.previousLeftWristY !== null &&
      leftHandTip.y - this.previousLeftWristY > this.threshold && 
      leftHandTip.x > rightShoulder.x + this.movementThreshold && 
      Math.abs(leftHandTip.z - rightShoulder.z) < 0.4 
    ) {
      if (!this.cymbalTriggered) {
        this.soundTrigger.playSound("cymbal", {
          x: leftHandTip.x,
          y: leftHandTip.y,
        });
        this.cymbalTriggered = true;
      }
    } else {
      this.cymbalTriggered = false;
    }

    // Bass Kick 
    if (this.previousRightKneeY !== null) {
      
      if (
        !this.isKneeUp && 
        this.previousRightKneeY - rightKnee.y > this.bassThreshold 
      ) {
        this.isKneeUp = true; 
      }


      if (
        this.isKneeUp && 
        rightKnee.y - this.previousRightKneeY > this.bassThreshold 
      ) {
        this.soundTrigger.playSound("bass", {
          x: rightKnee.x,
          y: rightKnee.y,
        });
        this.isKneeUp = false; 
      }
    }

    // get previous positions
    this.previousRightWristY = rightHandTip.y;
    this.previousLeftWristY = leftHandTip.y;
    this.previousRightKneeY = rightKnee.y;
  }
}
