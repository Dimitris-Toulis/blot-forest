const width = 125;
const height = 125;

setDocDimensions(width, height);

const maxRiverAngleTan = 0.2
const edgeRiverPadding = 10

const river = [
  [],
  []
];

let x = bt.randInRange(0, 125)
let rw = bt.randInRange(3, 10) / 2
river[0].push([x - rw, 0])
river[1].push([x + rw, 0])
for (let y = 0; y < height;) {
  y += bt.randInRange(7, 10)
  if (y > height) y = height
  x += bt.randInRange(x - y * maxRiverAngleTan < edgeRiverPadding + rw ? -x + edgeRiverPadding + rw : -y * maxRiverAngleTan,
                                x + y * maxRiverAngleTan > width - edgeRiverPadding - rw ? width - x - edgeRiverPadding - rw : y * maxRiverAngleTan)
  rw = bt.randInRange(3, 10) / 2
  river[0].push([x - rw, y])
  river[1].push([x + rw, y])
}
drawLines([bt.catmullRom(river[0]), bt.catmullRom(river[1])]);