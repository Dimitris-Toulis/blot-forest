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
  N: 40,
  paddingX: 5,
  paddingY: 15
}
const fishOptions = {
  N: 10,
  padding: 0.025,
  maxSize: 1.5,
  minSize: 0.75,
  angleVariation: 20
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
for (let i = 0; i < treeOptions.N; i++) {
  let x = bt.randInRange(treeOptions.paddingX, width - treeOptions.paddingX)
  let y = bt.randInRange(treeOptions.paddingY, height - treeOptions.paddingY)
  while (
    bt.pointInside([closedRiver], [x - 1, y]) ||
    bt.pointInside([closedRiver], [x, y]) ||
    bt.pointInside([closedRiver], [x + 1, y]) ||
    bt.pointInside([closedRiver], [x - 1, y + 5]) ||
    bt.pointInside([closedRiver], [x, y + 5]) ||
    bt.pointInside([closedRiver], [x + 1, y + 5])
  ) {
    x = bt.randInRange(treeOptions.paddingX, width - treeOptions.paddingX)
    y = bt.randInRange(treeOptions.paddingY, height - treeOptions.paddingY)
  }
  drawLines(drawTree(x, y))
}