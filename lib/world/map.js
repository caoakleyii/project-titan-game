if (process.env.server) {
  require('node-easel');
}
const jsonfile = require('jsonfile');

class Map {
  constructor(file, stage){
    this.stage = stage;
    this.mapData = undefined;
    this.tileset = undefined;
    this.world = new createjs.Container();
    this.render(file, stage);
  }
  render(file, stage) {

    if(!stage){
      stage = new createjs.Stage("canvas");
    }
    this.stage = stage;
    // read json map data into object.
    this.mapData = jsonfile.readFileSync(file);
    // create EaselJS image for tileset
    this.tileset = new Image();
    // get the src of the imagefile from the tileset
    this.tileset.src = this.mapData.tilesets[0].image;
    // callback for loading layers after the tileset is loaded
    this.tileset.onLoad = this.initLayers();
  }
  initLayers() {
    // compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
  	let w = this.mapData.tilesets[0].tilewidth;
  	let h = this.mapData.tilesets[0].tileheight;
  	let imageData = {
  		images : [ this.tileset ],
  		frames : {
  			width : w,
  			height : h
  		}
  	};

    // create spritesheet
  	let tilesetSheet = new createjs.SpriteSheet(imageData);

  	// loading each layer at a time
  	for (let idx = 0; idx < this.mapData.layers.length; idx++) {
  		let layerData = this.mapData.layers[idx];
  		if (layerData.type == 'tilelayer' && layerData.visible)
  			this.initLayer(layerData, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight);
  	}
    this.stage.addChild(this.world);
  }

  initLayer(layerData, tilesetSheet, tilewidth, tileheight) {
  	for ( let y = 0; y < layerData.height; y++) {
  		for ( let x = 0; x < layerData.width; x++) {
  			// create a new Bitmap for each cell
  			let cellBitmap = new createjs.Sprite(tilesetSheet);
  			// layer data has single dimension array
  			let idx = x + y * layerData.width;
        // add custom properties if they exist
        Object.assign(cellBitmap, this.mapData.tilesets[0].tileproperties[idx]);
        if(cellBitmap.solid){
          console.log('true');
        }
  			// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
  			cellBitmap.gotoAndStop(layerData.data[idx] - 1);
  			// isometrix tile positioning based on X Y order from Tiled
  			cellBitmap.x = x * tilewidth;
  			cellBitmap.y = y * tileheight;
  			// add bitmap to stage
  			this.world.addChild(cellBitmap);
  		}
  	}
  }
}
module.exports = Map;
