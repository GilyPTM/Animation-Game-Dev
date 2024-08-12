import { Component, HostListener, OnInit } from '@angular/core';
import { Player } from '../player';
import { EnemyInstance } from '../enemy-instance';
import { NumberSymbol } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
})
export class ScreenComponent implements OnInit {
  MIN_NO_ENEMIES = 5;
  MAX_NO_ENEMIES = 12;
  INTERVAL_MOVE_ENEMIES = 500;

  player: Player = new Player();
  enemies: EnemyInstance[] = [];
  noEnemies = 0;
  maxEnemyDistance = 600;
  playerWidth = 128;

  constructor() {}

  moveEntity(entity: any, leftToRight: boolean, howMuch: number): void {
    if (leftToRight) {
      entity.posOx += howMuch;
    } else {
      entity.posOx -= howMuch;
    }

    entity.walkSprite++;
    if (entity.walkSprite > 8) entity.walkSprite = 1;
  }

  makeEnemiesMove(): void {
    setInterval(() => {
      // deplasez inamicii
      for (let enemy of this.enemies) {
        this.moveEntity(enemy, enemy.looksRight, 5);
      }
    }, this.INTERVAL_MOVE_ENEMIES);
  }

  ngOnInit(): void {
    // genereaza inamici
    this.noEnemies = Math.ceil(
      Math.random() * (this.MAX_NO_ENEMIES - this.MIN_NO_ENEMIES + 1) +
        this.MIN_NO_ENEMIES
    );

    console.log('Avem ' + this.noEnemies + ' inamici.');
    for (let i = 0; i < this.noEnemies; i++) {
      let enemy = new EnemyInstance();
      // pune inamicii aleatorii
      enemy.type = Math.round(Math.random());
      // muta la o pozitie random
      enemy.posOx = Math.random() * this.maxEnemyDistance + this.playerWidth;
      // facem inamicul sa se uita stanga sau dreapta
      let looksRnd = Math.random();
      if (looksRnd < 0.5) enemy.looksRight = true;
      else enemy.looksRight = false;

      this.enemies.push(enemy);
    }
    this.makeEnemiesMove();
    this.gameplay();
  }

  // checkCollisions() {
  //   for (let enemy of this.enemies) {
  //     for (let enemy of this.enemies) {
  //       this.checkCollision(this.player, enemy);
  //     }
  //   }
  // }

  gameplay(): void {
    // this.checkCollisions();

    requestAnimationFrame(() => {
      this.gameplay();
    });
  }

  checkCollision(player: Player, enemy: EnemyInstance): boolean {
    if (player.posOx + player.width > enemy.posOx) {
      console.error('coliziune din stanga!');
      return true;
    }
    if (player.posOx < player.width + enemy.posOx) {
      console.error('coliziune din stanga!');
      return true;
    }
    return false;
  }

  // apasam tasta sageata dreapta
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    console.log('s-a apasat o tasta:' + event.key);
    switch (event.key) {
      case 'ArrowRight':
        if (this.player.isDecelerating) break;
        //roteste la dreapta
        if (!this.player.looksRight) {
          this.player.looksRight = true;
        }
        //schimba sprite
        this.player.walkSprite++;
        if (this.player.walkSprite > 7) this.player.walkSprite = 0;
        // muta-l in dreapta
        // this.player.posOx += 5;

        this.player.velocityX =
          this.player.velocityX + this.player.acceleration;

        if (this.player.velocityX > this.player.maxSpeed) {
          this.player.velocityX = this.player.maxSpeed;
        }
        console.log('Velocity: ' + this.player.velocityX);
        this.player.posOx = this.player.posOx + this.player.velocityX;

        break;
      case 'ArrowLeft':
        if (this.player.isDecelerating) break;
        //e cazul sa rotesc
        if (this.player.looksRight) {
          this.player.looksRight = false;
        }
        this.player.walkSprite++;
        if (this.player.walkSprite > 7) this.player.walkSprite = 0;
        //muta-l in stanga
        // this.player.posOx -= 5;

        this.player.velocityX =
          this.player.velocityX + this.player.acceleration;

        if (this.player.velocityX > this.player.maxSpeed) {
          this.player.velocityX = this.player.maxSpeed;
        }

        this.player.posOx = this.player.posOx - this.player.velocityX;

        break;
    }
  }
  // am luat degetul de pe tasta
  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    let intervalDecelerare: any;
    console.log('s-a eliberat tasta:' + event.key);

    switch (event.key) {
      case 'ArrowRight':
        // this.player.velocityX = 0;

        this.player.isDecelerating = true;
        intervalDecelerare = setInterval(() => {
          // schimbar sprite
          this.player.walkSprite++;
          if (this.player.walkSprite > 7) this.player.walkSprite = 0;

          // deceleram
          this.player.velocityX =
            this.player.velocityX - this.player.deceleration;
          console.log(
            'Mai merg un pic (velocityX = ' + this.player.velocityX + ')'
          );
          if (this.player.velocityX <= 0) {
            this.player.velocityX = 0;
            this.player.isDecelerating = false;
            clearInterval(intervalDecelerare);
          }

          // mutam player-ul
          this.player.posOx = this.player.posOx + this.player.velocityX;
        }, 30);
        break;

      case 'ArrowLeft':
        // this.player.velocityX = 0;
        this.player.isDecelerating = true;
        intervalDecelerare = setInterval(() => {
          // schimbar sprite
          this.player.walkSprite++;
          if (this.player.walkSprite > 7) this.player.walkSprite = 0;

          // deceleram
          this.player.velocityX =
            this.player.velocityX - this.player.deceleration;
          console.log(
            'Mai merg un pic (velocityX = ' + this.player.velocityX + ')'
          );
          if (this.player.velocityX <= 0) {
            this.player.velocityX = 0;
            this.player.isDecelerating = false;
            clearInterval(intervalDecelerare);
          }

          // mutam player-ul
          this.player.posOx = this.player.posOx - this.player.velocityX;
        }, 30);

        break;
    }
  }
}
