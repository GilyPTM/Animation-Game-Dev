export class Player {
  walkSprite = 0;
  noWalkSprites = 7;
  posOx = 0;
  width = 128;

  looksRight = true;
  isDecelerating = false;

  velocityX = 0;
  acceleration = 0.5;
  deceleration = 1;
  maxSpeed = 12;

  incrementSprite(): void {
    this.walkSprite++;
    if (this.walkSprite > this.noWalkSprites) this.walkSprite = 0;
  }
}
