class Game {
  constructor () {
    this.maxPower = 20
    this.turn = 0
    this.appendTanks()
    this.tanks = [new Tank(this, 1), new Tank(this, 2)]
    this.command = this.commandTank.bind(this)
    this.startPowerBar = this.powerBar.bind(this)
    this.stopPower = this.stopPowerBar.bind(this)
    this.powerBarInterval = null
    this.counter = 20
    this.power = 0
    this.timer = this.countdown.call(this)
    this.windAngle = Math.round(Math.random() * 360)
    this.windSpeed = (Math.round(Math.random() * 5))
    this.spaceBarPressed = false
    this.playerTurn = null
  }

  startGame () {
    this.tanks.forEach(function(tank, index, tanks) {
      tank.findEnemyTank.call(tank)
      $(`p#tank-${tank.id}-health`).html(`HP: ${tank.hp}`)
    })
    this.setWind()
    // do every turn instead
    this.newTurn()
  }

  setWind() {
    $('p.wind-speed').html(`${this.windSpeed}`)
    $('p.wind-angle').html(`${this.windAngle}`)
    $('div#wind-arrow').css({transform: `rotate(${-(this.windAngle - 90)}deg)`})
  }

  appendTanks() {
    $('#game').append("<div class='tank' id='tank-1' style='left: 90px;'><div class='cover'><div class='wheel-1'><div class='rim-1'></div><div class='rim-2'></div></div><div class='wheel-2'><div class='rim-1'></div><div class='rim-2'></div></div></div></div>")
    $('#game').append("<div class='tank' id='tank-2' style='left: 670px;'><div class='cover'><div class='wheel-1'><div class='rim-1'></div><div class='rim-2'></div></div><div class='wheel-2'><div class='rim-1'></div><div class='rim-2'></div></div></div></div>")
  }

  nextTurn() {
    this.turn += 1
    this.counter = 15
    setTimeout(this.newTurn.bind(this), 1000)
  }

  newTurn() {
    this.removeEventListnen()
    this.timer
    this.power = 0
    $('p.angle').html(`0 &#176`)
    var player = this.turn % 2 + 1
    $('p.player').html(`Player ${player}'s Turn`)
    if (player === 1) {
      $('.result').css({background: "yellow"})
      $('#status').css({background: "yellow"})
      $('.angle').css({background: "yellow"})
      $('.timer').css({background: "yellow"})
    } else if (player === 2) {
      $('.result').css({background: "purple"})
      $('#status').css({background: "purple"})
      $('.angle').css({background: "purple"})
      $('.timer').css({background: "purple"})
    }
    $('.power-bar-fill').css({width: `${(this.power*100)/this.maxPower}%`})
    $(document).on("keydown", this.command)
    $(document).on('keypress', this.startPowerBar)
    $(document).on('keyup', this.stopPower)

    this.playerTurn = this.tanks[player - 1]
  }

  countdown() {
    var self = this
    $('.timer').html(`${this.counter}`)
    setInterval(function() {
      self.countDownTimer()
    }, 1000)
  }

  countDownTimer() {
      if (this.counter === 0) {
        clearInterval(this.timer)
        $(document).off("keydown", this.command)
        this.nextTurn()
      } else if (this.counter === -1) {
      } else {
        this.counter -= 1
        $('.timer').html(`${this.counter}`)
      }
    }

  commandTank(e) {
    if (e.which === 37) {
      this.playerTurn.moveTankLeft()
    } else if (e.which === 39) {
      this.playerTurn.moveTankRight()
    } else if (e.which === 38) {
      this.playerTurn.gun.rotateGunRight()
    } else if (e.which === 40) {
      this.playerTurn.gun.rotateGunLeft()
    }
  }

  powerBar(e) {
    if (e.which === 32 && !this.spaceBarPressed) {
      this.spaceBarPressed = true
      this.power = 0
      this.powerBarInterval = setInterval(() => {
        if (this.power < this.maxPower && this.power >= 0) {
          this.power += 1;
          $('.power-bar-fill').css({width: `${(this.power*100)/this.maxPower}%`})
        }
      }, 40)
      
    }
  }

  stopPowerBar(e) {

    if (e.which === 32) {
      this.spaceBarPressed = false
      clearInterval(this.powerBarInterval)
      this.playerTurn.gun.shoot(this.power)
      this.removeEventListnen()
    }
  }

  removeEventListnen() {
    $(document).off("keydown", this.command)
    $(document).off('keypress', this.startPowerBar)
    $(document).off('keyup', this.stopPower)
  }

  endGame() {
    this.counter = -1
    if (this.tanks[0].hp === 0) {
      $('p.player').html('Terminator Wins')
      //change later to accept players
    } else if (this.tanks[1].hp === 0) {
      $('p.player').html('Red Baron Wins')
    }
  }
}
