const CANVAS_BORDER_COLOUR = 'black'
const CANVAS_BACKGROUND_COLOUR = 'white'
const SNAKE_COLOUR = 'lightgreen'
const SNAKE_BORDER_COLOUR = 'darkgreen'
const FOOD_COLOUR = 'red'
const FOOD_BORDER_COLOUR = 'darkred'

let gameCanvas = document.getElementById('gameCanvas')
let ctx = gameCanvas.getContext('2d')

let dx = 10
let dy = 0

let foodX = 0
let foodY = 0

let score = 0

let changingDirection = false

let startBtn = document.getElementById('startBtn')

function clearCavas() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOUR
  ctx.strokestyle = CANVAS_BORDER_COLOUR

  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
}
clearCavas()

let snake = [
  { x: 150, y: 150 }, // the head of the snake
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
]

function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOUR
  ctx.strokestyle = SNAKE_BORDER_COLOUR

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
}

function drawSnake() {
  snake.forEach(drawSnakePart)
}

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }
  snake.unshift(head)

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY
  if (didEatFood) {
    score += 10
    document.getElementById('score').innerHTML = score
    createFood()
  } else {
    snake.pop()
  }
}

function changeDirection(event) {
  const UP_KEY = 38
  const RIGHT_KEY = 39
  const DOWN_KEY = 40
  const LEFT_KEY = 37

  if (changingDirection) {
    return
  }
  changingDirection = true

  const keyPressed = event.keyCode
  const goingUp = dy === -10
  const goingRight = dx === 10
  const goingDown = dy === 10
  const goingLeft = dx === -10

  if (keyPressed == UP_KEY && !goingDown) {
    dx = 0
    dy = -10
  }
  if (keyPressed == RIGHT_KEY && !goingLeft) {
    dx = 10
    dy = 0
  }
  if (keyPressed == DOWN_KEY && !goingUp) {
    dx = 0
    dy = 10
  }
  if (keyPressed == LEFT_KEY && !goingRight) {
    dx = -10
    dy = 0
  }
}
document.addEventListener('keydown', changeDirection)

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10)
  foodY = randomTen(0, gameCanvas.height - 10)

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x === foodX && part.y === foodY
    if (foodIsOnSnake) {
      createFood()
    }
  })
}

function drawFood() {
  ctx.fillStyle = FOOD_COLOUR
  ctx.strokestyle = FOOD_BORDER_COLOUR
  ctx.fillRect(foodX, foodY, 10, 10)
  ctx.strokeRect(foodX, foodY, 10, 10)
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[0].x === snake[i].x && snake[0].y === snake[i].y
    if (didCollide) {
      return true
    }
  }

  const hitUpWall = snake[0].y < 0
  const hitRightWall = snake[0].x >= gameCanvas.width
  const hitBottomWall = snake[0].y >= gameCanvas.height
  const hitLeftWall = snake[0].x < 0
  return hitUpWall || hitRightWall || hitBottomWall || hitLeftWall
}

function run() {
  if (didGameEnd()) {
    startBtn.disabled = false
    startBtn.textContent = 'PLAY'
    return
  }
  setTimeout(function onTick() {
    changingDirection = false
    clearCavas()
    advanceSnake()
    drawSnake()
    drawFood()
    run()
  }, 100)
}

function resetSnakeGame() {
  snake = [
    { x: 150, y: 150 }, // the head of the snake
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
  ]
  dx = 10
  dy = 0

  foodX = 0
  foodY = 0

  score = 0

  changingDirection = false

  startBtn.disabled = true
  startBtn.textContent = 'RUNNING'
  run()
  createFood()
}

startBtn.addEventListener('click', resetSnakeGame)
