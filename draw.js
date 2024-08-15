
const width = 125;
const height = 125;

setDocDimensions(width, height);

bt.setRandSeed(12381);
const riverOptions = {
    maxAngleTan: 0.2,
    paddingX: 10,
    paddingY: 5,
    maxWidth: 7,
    minWidth: 1
}
const treeOptions = {
    N: 40,
    paddingX: 5,
    paddingY: 15
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
  .step([0,4])
  .step([0,-4])
  .step([1,0])
  .step([0,4])
  .up()
  .step([-0.5,0])
  .down()
  const curls = 5//bt.randIntInRange(3,10)
  for(let i=0;i<curls;i++){
    turtle.arc(-360,-2)
  }
  return bt.translate(turtle.lines(),[x,y])
}
const river = drawRiver()
drawLines(river)
const closedRiver = [...river[0],
...river[1].reverse(),
river[0][0]
]
for (let i = 0; i < treeOptions.N; i++) {
    let x = bt.randInRange(0, width - treeOptions.paddingX)
    let y = bt.randInRange(0, height - treeOptions.paddingY)
    while (
      bt.pointInside([closedRiver], [x, y]) ||
      bt.pointInside([closedRiver], [x+1, y]) ||
      bt.pointInside([closedRiver], [x+2, y]) ||
      bt.pointInside([closedRiver], [x+3, y]) 
    ) {
        x = bt.randInRange(0, width - treeOptions.paddingX)
        y = bt.randInRange(0, height - treeOptions.paddingY)
    }
    drawLines(drawTree(x,y))
}
