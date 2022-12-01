import metaversefile from 'metaversefile';
import * as THREE from 'three';
import AssetManager from './AssetManager.js';
import {TILE_SIZE} from './Constants.js';
import {
  Direction,
  generate,
  TileLayer,
  TileType,
} from './libs/generate/index.js';
import {Data, Textures} from './libs/utils/index.js';

const {useLocalPlayer} = metaversefile;

export default class Dungeon {
  constructor() {
    this.assets = null;

    //
    // dungeons
    //
    this.dungeon = null;
    this.oldDungeon = null;
    this.tempDungeon = null;

    //
    // Groups
    //
    this.pivot = new THREE.Group();
    this.group = new THREE.Group();
    this.pivot.add(this.group);
    this.oldGroup = new THREE.Group();
    this.pivot.add(this.oldGroup);
    this.tempGroup = new THREE.Group();
    this.pivot.add(this.tempGroup);
  }

  async waitForLoad() {
    const assetManager = new AssetManager();
    this.assets = await assetManager.load();
    const dungeon = generate({
      mapWidth: 40,
      mapHeight: 20,
      mapGutterWidth: 2,
      iterations: 15,
      containerMinimumSize: 4,
      containerMinimumRatio: 0.45,
      containerSplitRetries: 30,
      corridorWidth: 4,
      tileWidth: 32,
      seed: '5ML3875MwgFzyejjoFV9i',
      debug: false,
      rooms: Data.loadRooms(),
    });
    this.drawDungeon(dungeon);
  }

  drawDungeon(dungeon) {
    this.oldDungeon = JSON.parse(JSON.stringify(this.dungeon));
    this.dungeon = JSON.parse(JSON.stringify(dungeon));

    // Clear old group
    this.oldGroup.children.forEach(node => {
      node?.geometry?.dispose();
      node?.material?.dispose();
      this.oldGroup.remove(node);
    });
    this.oldGroup.children = [];

    // Move group into old group
    this.oldGroup.copy(this.group, true);

    // Clear group
    this.group.children.forEach(node => {
      node?.geometry?.dispose();
      node?.material?.dispose();
      this.group.remove(node);
    });
    this.group.children = [];

    // Draw
    this.drawTiles(dungeon.layers.tiles, Textures.tilesTextures(this.assets));
    this.drawProps(dungeon.layers.props, Textures.propsTextures(this.assets));
    this.drawMonsters(
      dungeon.layers.monsters,
      Textures.monstersTextures(this.assets),
    );
  }

  drawTiles = (tilemap, sprites) => {
    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
        const id = tilemap[y][x];
        const texture = sprites[id];
        if (texture) {
          const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
          geometry.rotateX(-Math.PI / 2);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
          });
          const sprite = new THREE.Mesh(geometry, material);
          sprite.userData = {
            x,
            y,
            type: id,
            layer: TileLayer.tiles,
          };
          sprite.position.set(x * TILE_SIZE, 0, y * TILE_SIZE);
          this.group.add(sprite);
        }
      }
    }
  };

  drawProps = (tilemap, sprites) => {
    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
        const id = tilemap[y][x];
        if (id === 0) {
          continue;
        }
        const texture = sprites[id];
        if (texture) {
          const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
          geometry.rotateX(-Math.PI / 2);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
          });
          const sprite = new THREE.Mesh(geometry, material);
          sprite.userData = {
            x,
            y,
            type: id,
            layer: TileLayer.props,
          };
          sprite.position.set(x * TILE_SIZE, 0, y * TILE_SIZE);
          this.group.add(sprite);
        }
      }
    }
  };

  drawMonsters = (tilemap, sprites) => {
    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
        const id = tilemap[y][x];
        if (id === 0) {
          continue;
        }
        const texture = sprites[id];
        if (texture) {
          const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
          geometry.rotateX(-Math.PI / 2);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
          });
          const sprite = new THREE.Mesh(geometry, material);
          sprite.userData = {
            x,
            y,
            type: id,
            layer: TileLayer.monsters,
          };
          sprite.position.set(x * TILE_SIZE, 0, y * TILE_SIZE);
          this.group.add(sprite);
        }
      }
    }
  };

  // createNextDungeon() {
  //   // Detect door in current dungeon
  //   let detectedDoor = this.getDoorPlayerArrived(this.dungeon, this.group);
  //   if (detectedDoor.arrived) {
  //     this.player.material.color.set(0xff0000);

  //     // Create next dungeon
  //     if (this.storeInterface.generateDungeon) {
  //       // Generate new dungeon
  //       const newDungeon = this.storeInterface.generateDungeon();

  //       // Draw next dungeon
  //       this.drawDungeon(newDungeon);

  //       // Move group
  //       this.moveGroupByDoorDirection(detectedDoor.direction);

  //       // Create corridor to connect two dungeons
  //       this.createCorridorToConnectDungeons(detectedDoor);
  //     }
  //   } else {
  //     this.player.material.color.set(0xffff00);

  //     // Detect door in old dungeon
  //     if (this.oldDungeon) {
  //       detectedDoor = this.getDoorPlayerArrived(this.oldDungeon, this.oldGroup);

  //       if (detectedDoor.arrived) {
  //         this.player.material.color.set(0xff0000);

  //         // Create next dungeon
  //         if (this.storeInterface.generateDungeon) {
  //           //Exchange dungeon
  //           this.tempDungeon = JSON.parse(JSON.stringify(this.dungeon));
  //           this.dungeon = JSON.parse(JSON.stringify(this.oldDungeon));
  //           this.oldDungeon = this.tempDungeon;

  //           //Exchange group
  //           this.tempGroup.copy(this.group, true);
  //           this.group.copy(this.oldGroup, true);
  //           this.oldGroup.copy(this.tempGroup, true);

  //           //Clear temp group
  //           this.tempGroup.children.forEach(node => {
  //             node?.geometry?.dispose();
  //             node?.material?.dispose();
  //             this.tempGroup.remove(node);
  //           });
  //           this.tempGroup.children = [];

  //           // Generate new dungeon
  //           const newDungeon = this.storeInterface.generateDungeon();

  //           // Draw next dungeon
  //           this.drawDungeon(newDungeon);

  //           // Move group
  //           this.moveGroupByDoorDirection(detectedDoor.direction);

  //           // Create corridor to connect two dungeons
  //           this.createCorridorToConnectDungeons(detectedDoor);
  //         }
  //       } else {
  //         this.player.material.color.set(0xffff00);
  //       }
  //     }
  //   }
  // }

  // getDoorPlayerArrived = (dungeon, group) => {
  //   const tilemap = dungeon.layers.tiles;
  //   const snapSize = 0.1;
  //   let arrivedAtDoor = false;
  //   let rx = 0;
  //   let ry = 0;
  //   for (let y = 0; y < tilemap.length; y++) {
  //     for (let x = 0; x < tilemap[y].length; x++) {
  //       const id = tilemap[y][x];
  //       if (id === TileType.Door) {
  //         const dx = Math.abs(this.player.position.x - (group.position.x + x * TILE_SIZE));
  //         const dy = Math.abs(this.player.position.z - (group.position.z + y * TILE_SIZE));
  //         if (dx < snapSize && dy < snapSize) {
  //           arrivedAtDoor = true;
  //           rx = x;
  //           ry = y;
  //           break;
  //         }
  //       }
  //     }
  //     if (arrivedAtDoor) {
  //       break;
  //     }
  //   }

  //   // detect direction of door
  //   const top = ry + 1;
  //   const right = dungeon.width - rx;
  //   const bottom = dungeon.height - ry;
  //   const left = rx + 1;
  //   const min = Math.min(top, right, bottom, left);
  //   let dir = Direction.up;
  //   switch (min) {
  //     case top:
  //       dir = Direction.up;
  //       break;
  //     case right:
  //       dir = Direction.right;
  //       break;
  //     case bottom:
  //       dir = Direction.down;
  //       break;
  //     case left:
  //       dir = Direction.left;
  //       break;
  //     default:
  //       break;
  //   }

  //   return {arrived: arrivedAtDoor, x: rx, y: ry, direction: dir};
  // };

  update() {
    const localPlayer = useLocalPlayer();
    console.log(localPlayer);
  }
}
