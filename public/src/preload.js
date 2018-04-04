function preload () {
  //The first parameter, also known as the asset key (i.e. 'sky', 'bomb')
  // is a link to the loaded asset and is what you'll use in your code when
  //creating Game Objects. You're can use any valid JS string as the key.
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}
