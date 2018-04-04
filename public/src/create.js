function create () {
  //The first two arguments are the X and Y coordinates where the image
  //Will be positioned. In Phaser 3 all Game Objects are positioned based
  //on their center by default.
  //You can use setOrigin to change this. For example the code:
  //this.add.image(0, 0, 'sky').setOrigin(0, 0)
this.add.image(400, 300, 'sky');


  //We can group together similar objects and control them all as one single
  //unit. You can also check for collision between Groups and other game
  //objects. Groups are capable of creating their own Game Objects via
  //helper functions like create.
  //A Physics Group will automatically create physics enabled children.

  //Static objects are not influenced by physics forces, like mass, gravity,
  //velocity, etc. They are fixed in position and nature.
  platforms = this.physics.add.staticGroup();

  //refreshBody() is required because we have scaled a static physics body,
  //so we have to tell the physics world about the changes we made.
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(100, 300, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(750, 150, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(300);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4}],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //Create cursor controls to move player; keybind in update.js
  cursors = this.input.keyboard.createCursorKeys();

  // Ensures player collides with platform elements
  this.physics.add.collider(player, platforms);

  // Creates a Physics group of stars with 12 child stars evenly spaced apart
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  // Sets a random bounce value for each child star
  // 0 = no bounce, 1 = eternal bounce
  stars.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Ensures stars collide with platform elements
  this.physics.add.collider(stars, platforms);

  // Ensures the player can overlap with stars, and calls the collectStar
  // function when it does.
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // This function disables the star element that the player overlaps with
  function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score)

    // Check how many stars are left; re-spawn if 0
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function(child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    };

    // Pick random x coord for bomb to spawn at opposite end to Player
    var x = (player.x < 400) ?
      Phaser.Math.Between(400, 800) :
      Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);

    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }

  //Create score:
  var score = 0;
  var scoreText;
  var messageText;

  // Set x,y coords, default text, and font settings
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  messageText = this.add.text(270, 300, "", {
    fontSize: '50px',
    fill: 'yellow'
  })

  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this)

  function hitBomb(player, bombs) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    messageText.setText('GAME OVER')
    gameOver = true;
  }

};
