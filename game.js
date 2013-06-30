var hitMax = 1000000;
var hitRanges = [
  hitMax * 0.10,
  hitMax * 0.50,
  hitMax * 0.30,
  hitMax * 0.05
];

var game = function() {
  this.request = require('request');

  this.maxLife = 2;
  this.life = [this.maxLife,this.maxLife,this.maxLife];
  this.stamina = 3;
  this.connected = false;
  this.opponent = {
    host: 'localhost',
    port: '9740'
  };
};

game.prototype._attack = function(power) {
  console.log('Attack: ' + power);
  return (Math.floor(Math.random() * hitMax) < hitRanges[power]);
};

game.prototype.battle = function(power, callback) {
  if(power > this.stamina) {
    power = this.stamina;
  }

  if(this._attack(power)) {
    console.log(this.opponent);
    this.request({
      uri: 'http://' + this.opponent.host + ':' + this.opponent.port + '/attack/' + power,
      method: 'POST'
    }, function(error, response, body) {
      if(error) {
        return callback(error, null);
      }

      if(body && body.length > 0) {
        return callback(body, null);
      }

      callback(null, true);
    });
  } else {
    callback(null, false);
  }
};

game.prototype.damage = function(attack) {
  console.log('Damage: ' + attack);

  if(attack === 3 && this.stamina > 0) {
    this.stamina -= 1;
  }

  for(var a = this.life.length - 1; a >= 0; a--) {
    if(attack < 1) {
      break;
    }

    if(this.life[a] === 0) {
      continue;
    }

    if(this.life[a] >= attack) {
      this.life[a] -= attack;
      attack = 0;
    } else {
      attack -= this.life[a];
      this.life[a] = 0;
    }
  }

  if(this.life[0] === 0) {
    return false;
  } else {
    return true;
  }
};

module.exports = game;