/*
# Blot Forest

A blot script that generates a random river and some trees

## Configuration

You can set a random seed by uncommenting `bt.setRandSeed()` and putting in a seed

### River Options
- maxAngleTan: Tangent of maximum angle the river can make from the vertical axis
- paddingX: Padding from the sides
- paddingY: Padding from the top and bottom for the second and last control point respectively
- maxWidth: Maximum width of the river
- minWidth: Minimum width of the river

### Tree Options 
- N: number of trees
- paddingX: Padding from the sides
- paddingY: Padding from the top and bottom
*/

const width = 125;
const height = 125;

setDocDimensions(width, height);

//bt.setRandSeed()
const riverOptions = {
  maxAngleTan: 0.2,
  paddingX: 10,
  paddingY: 5,
  maxWidth: 7,
  minWidth: 2
}
const treeOptions = {
  N: 30,
  paddingX: 5,
  paddingY: 15
}
const fishOptions = {
  N: 12,
  padding: 0.025,
  maxSize: 1.5,
  minSize: 0.75,
  angleVariation: 20
}
const houseOptions = {
  padding: 8,
  skipChance: 0.5,
  treeReplaceChance: 0.4,
  chimneyChance: 0.5,
  windowChance: 0.2,
  criticalSize: 15
}
const roadsOptions = {
  dashSize: 0.25
}

function drawRiver() {
  const river = [
    [],
    []
  ];
  const { maxAngleTan, paddingX, paddingY, maxWidth, minWidth } = riverOptions;
  let rw = bt.randInRange(minWidth, maxWidth)
  let x = bt.randInRange(paddingX + rw, width - paddingX - rw)
  river[0].push([x - rw, 0])
  river[1].push([x + rw, 0])
  for (let y = 0; y < height;) {
    y += bt.randInRange(10, 22)
    if (y > height - paddingY) y = height

    rw += bt.randInRange(rw - 1 <= minWidth ? minWidth - rw : -1, rw + 1 >= maxWidth ? maxWidth - rw : 1)

    x += bt.randInRange(x - y * maxAngleTan < paddingX + rw ? -x + paddingX + rw : -y * maxAngleTan,
      x + y * maxAngleTan > width - paddingX - rw ? width - x - paddingX - rw : y * maxAngleTan)

    river[0].push([x - rw, y])
    river[1].push([x + rw, y])
  }
  return [bt.catmullRom(river[0]), bt.catmullRom(river[1])]
}

function drawTree(x, y) {
  const turtle = new bt.Turtle()
    .down()
    .step([0, 4])
    .step([0, -4])
    .step([1, 0])
    .step([0, 4])
    .up()
    .step([-1, 0])
    .down()
  const curls = bt.randIntInRange(1, 3) * 2 + 1
  for (let i = 0; i < curls; i++) {
    turtle.arc(-360, -0.4)
    turtle.up().step([1 / ((curls - 1)), i > curls / 2 - 1 ? -0.4 : 0.4]).down()
  }
  const cutter1 = turtle.lines().filter((_, i) => i != 0 && (i - 1) % 2 == 1).map(a => a.map(b => [...b]))
  const cutter1copy = cutter1.map(a => a.map(b => [...b]))
  const cutter2 = turtle.lines().filter((_, i) => i != 0 && (i - 1) % 2 == 0).map(a => a.map(b => [...b]))
  let finalLines = [turtle.lines()[0]]
  finalLines = [...finalLines, ...bt.cover(cutter1, cutter2), ...bt.cover(cutter2, cutter1copy)]
  bt.cover(finalLines, [ // hacky way to remove remaining inside bits
    [
      [0, 4],
      [0.2, 4 + 0.4 * ((curls - 1) / 2) + 0.25],
      [0.8, 4 + 0.4 * ((curls - 1) / 2) + 0.25],
      [1, 4],
      [0, 4]
    ]
  ])
  finalLines.push([
    [0, 4],
    [1, 4]
  ])
  return bt.translate(finalLines, [x, y])
}
function drawFish([x, y], angle) {
  const turtle = new bt.Turtle()
    .down()
    .setAngle(angle)
    .right(90)
    .up()
    .forward(0.5)
    .right(180)
    .down()
    .forward(1)
    .right(120)
    .forward(1)
    .right(120)
    .forward(1)
    .up()
    .right(180)
    .forward(1)
    .down()
    .arc(-60, 2)
    .up()
    .arc(60, -2)
    .down()
    .right(60)
    .arc(60, 2)
    .up()
    .setAngle(angle)
    .forward(-0.6)
    .right(90)
    .down()
    .arc(-360, -0.1)
  return bt.scale(bt.translate(turtle.lines(), [x, y]), bt.randInRange(fishOptions.minSize, fishOptions.maxSize))
}

const river = drawRiver()
drawLines(river)

const riverCenter = river[0].map((p, i) => ([(p[0] + river[1][i][0]) / 2, (p[1] + river[1][i][1]) / 2]))
let t = 0
for (let i = 0; i < fishOptions.N; i++) {
  t += bt.randInRange(fishOptions.padding, Math.min((1 - t) / (fishOptions.N - i), 1 - t - fishOptions.padding))
  drawLines(drawFish(bt.getPoint([riverCenter], t), bt.getAngle([riverCenter], t) + bt.randInRange(-fishOptions.angleVariation, fishOptions.angleVariation)))
}

const closedRiver = [...river[0],
...river[1].reverse(),
river[0][0]
]

class Queue {
  constructor() {
    this._elements = [];
    this._offset = 0;
  }
  enqueue(element) {
    this._elements.push(element);
    return this;
  }
  dequeue() {
    if (this.size() === 0) return null;

    const first = this.front();
    this._offset += 1;

    if (this._offset * 2 < this._elements.length) return first;

    this._elements = this._elements.slice(this._offset);
    this._offset = 0;
    return first;
  }
  front() {
    return this.size() > 0 ? this._elements[this._offset] : null;
  }
  back() {
    return this.size() > 0 ? this._elements[this._elements.length - 1] : null;
  }
  size() {
    return this._elements.length - this._offset;
  }
  isEmpty() {
    return this.size() === 0;
  }
}

function drawHouse(pos) {
  const turtle = new bt.Turtle()
    .down()
    .left(90)
  for (let i = 0; i < 4; i++) {
    turtle.forward(3)
    turtle.right(90)
  }
  turtle
    .forward(3)
    .right(30)
    .forward(3)
    .right(120)
    .forward(3)
  if (bt.rand() < houseOptions.chimneyChance) {
    turtle
      .forward(-1.5)
      .setAngle(90)
      .forward(1)
      .right(90)
      .forward(0.5)
      .right(90)
      .forward(1 + 0.5 * Math.sqrt(3))
  }
  if(bt.rand()<houseOptions.windowChance){
    turtle
      .jump([1,4])
      .setAngle(90)
      .arc(360,-0.5)
      .right(90)
      .forward(1)
      .jump([1.5,4.5])
      .setAngle(270)
      .forward(1)
  }
  turtle
    .jump([1.25,0])
    .setAngle(90)
    .forward(1)
    .right(90)
    .forward(0.5)
    .right(90)
    .forward(1)
  return bt.translate(turtle.lines(), pos)
}

let size = 1
const queue = new Queue()
const visited = []
const setVisited = ([x, y]) => visited[x + (width + 1) * y] = true
const getVisited = ([x, y]) => visited[x + (width + 1) * y]

function randWithCond(min, max, cond) {
  let x = bt.randIntInRange(min, max)
  let y = bt.randIntInRange(min, max)
  while (!cond(x, y)) {
    x = bt.randIntInRange(min, max)
    y = bt.randIntInRange(min, max)
  }
  return [x, y]
}
function nearRiver([x, y], dist = 6) {
  for (let ox = -dist; ox <= dist; ox++) {
    for (let oy = -dist; oy <= dist; oy++) {
      if (bt.pointInside([closedRiver], [x + ox, y + oy])) return true
    }
  }
  return false
}
const firstHouse = randWithCond(houseOptions.padding, width - houseOptions.padding, (x, y) => !nearRiver([x, y],10))
queue.enqueue(firstHouse)
setVisited(firstHouse)

const cityPoints = []

while (!queue.isEmpty()) {
  const [x, y] = queue.dequeue()
  if (bt.rand() < (1-houseOptions.skipChance)) {
    drawLines(drawHouse([x, y]))
    size++
    cityPoints.push([x, y])
    cityPoints.push([x + 3, y])
    cityPoints.push([x, y + 6])
    cityPoints.push([x + 3, y + 6])
  } else if (bt.rand() < houseOptions.treeReplaceChance) {
    drawLines(drawTree(x+1, y))
    cityPoints.push([x, y])
    cityPoints.push([x, y + 6])
  }
  for (let ox = -5; ox <= 5; ox += 5) {
    if (x + ox < houseOptions.padding || x + ox > width - houseOptions.padding) continue
    for (let oy = -8; oy <= 8; oy += 8) {
      if (y + oy < houseOptions.padding || y + oy > height - houseOptions.padding) continue
      if (bt.rand() < (size <= houseOptions.criticalSize ? 1 : 1 / (size - houseOptions.criticalSize)) && !getVisited([x + ox, y + oy]) && !nearRiver([x + ox, y + oy])) {
        queue.enqueue([x + ox, y + oy])
        setVisited([x + ox, y + oy])
      }
    }
  }
}

function convexHull(points) {
  points.sort(function (a, b) {
    return a[0] != b[0] ? a[0] - b[0] : a[1] - b[1];
  });

  var n = points.length;
  var hull = [];

  for (var i = 0; i < 2 * n; i++) {
    var j = i < n ? i : 2 * n - 1 - i;
    while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], points[j]))
      hull.pop();
    hull.push(points[j]);
  }

  hull.pop();
  return hull;
}

function removeMiddle(a, b, c) {
  var cross = (a[0] - b[0]) * (c[1] - b[1]) - (a[1] - b[1]) * (c[0] - b[0]);
  var dot = (a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1]);
  return cross < 0 || cross == 0 && dot <= 0;
}
const cityHull = convexHull(cityPoints)
cityHull.push(cityHull[0])

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(bt.rand() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function createRoad([x, y]) {
  const points = [[x, y]]
  const sides = [[],[]]
  const offsets = [[5, 0], [-5, 0], [0, 8], [0, -8]]
  while (true) {
    shuffle(offsets)
    for (let i = 0; i < 4; i++) {
      if (points.findIndex((a) => (a[0] == x + offsets[i][0] && a[1] == y + offsets[i][1])) != -1 ||
        !bt.pointInside([cityHull], [x + offsets[i][0], y + offsets[i][1]])) continue
      x += offsets[i][0]
      y += offsets[i][1]
      break
    }
    const last = (points.at(-1)[0] == x && points.at(-1)[1] == y)

    if(points.length == 1){
      if(points[0][0] == x){
        sides[0].push([points.at(-1)[0]+Math.sign(points.at(-1)[1]-y)*0.5,points.at(-1)[1]])
        sides[1].push([points.at(-1)[0]-Math.sign(points.at(-1)[1]-y)*0.5,points.at(-1)[1]])
      }
      if(points[0][1] == y){
        sides[0].push([points.at(-1)[0],points.at(-1)[1]-Math.sign(points.at(-1)[0]-x)*0.5])
        sides[1].push([points.at(-1)[0],points.at(-1)[1]+Math.sign(points.at(-1)[0]-x)*0.5])
      }
      points.push([x, y])
      continue
    }
    
    if(y == points.at(-1)[1] && y == points.at(-2)[1]){
      sides[0].push([points.at(-1)[0],points.at(-1)[1]-Math.sign(points.at(-2)[0]-x)*0.5])
      sides[1].push([points.at(-1)[0],points.at(-1)[1]+Math.sign(points.at(-2)[0]-x)*0.5])
    }
    else if(x == points.at(-1)[0] && x == points.at(-2)[0] ){
      sides[0].push([points.at(-1)[0]+Math.sign(points.at(-2)[1]-y)*0.5,points.at(-1)[1]])
      sides[1].push([points.at(-1)[0]-Math.sign(points.at(-2)[1]-y)*0.5,points.at(-1)[1]])
    } else if(x == points.at(-1)[0] && points.at(-1)[1] == points.at(-2)[1]){
      sides[0].push([points.at(-1)[0]+Math.sign(points.at(-1)[1]-y)*0.5,points.at(-1)[1]-Math.sign(points.at(-2)[0]-x)*0.5])
      sides[1].push([points.at(-1)[0]-Math.sign(points.at(-1)[1]-y)*0.5,points.at(-1)[1]+Math.sign(points.at(-2)[0]-x)*0.5])
    } else if(y == points.at(-1)[1] && points.at(-1)[0] == points.at(-2)[0]){
      sides[0].push([points.at(-1)[0]+Math.sign(points.at(-2)[1]-y)*0.5,points.at(-1)[1]-Math.sign(points.at(-1)[0]-x)*0.5])
      sides[1].push([points.at(-1)[0]-Math.sign(points.at(-2)[1]-y)*0.5,points.at(-1)[1]+Math.sign(points.at(-1)[0]-x)*0.5])
    }
    
    if(last) break;
    points.push([x, y])
  }
  console.log(points)
  return [sides,[points]]
}
let [sides,main] = (createRoad([firstHouse[0] - 1, firstHouse[1] - 1]))
sides = [...sides, [sides[0][0],sides[1][0]], [sides[0].at(-1),sides[1].at(-1)] ]
bt.resample(main,roadsOptions.dashSize)
let i = 0;
bt.iteratePoints(main,(pt,t)=> (i++)%3==0 ? "BREAK": pt)
drawLines(sides)
drawLines(main)

function nearCity([x, y]) {
  for (let ox = -6; ox <= 6; ox++) {
    for (let oy = -6; oy <= 6; oy++) {
      if (bt.pointInside([cityHull], [x + ox, y + oy])) return true
    }
  }
  return false
}
const trees = []
function onTree([x, y]) {
  return trees.some(([tx, ty]) => {
    if (Math.abs(y - ty) <= 4 && Math.abs(x - tx) <= 2) return true
    return false
  })
}
for (let i = 0; i < treeOptions.N; i++) {
  let x = bt.randInRange(treeOptions.paddingX, width - treeOptions.paddingX)
  let y = bt.randInRange(treeOptions.paddingY, height - treeOptions.paddingY)
  while (
    nearCity([x, y]) || nearRiver([x, y]) || onTree([x, y])
  ) {
    x = bt.randInRange(treeOptions.paddingX, width - treeOptions.paddingX)
    y = bt.randInRange(treeOptions.paddingY, height - treeOptions.paddingY)
  }
  trees.push([x, y])
  drawLines(drawTree(x, y))
}