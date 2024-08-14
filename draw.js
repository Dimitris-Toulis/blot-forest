const width = 125;
const height = 125;

setDocDimensions(width, height);

const maxRiverAngleTan = 0.2
const edgeRiverPadding = 10

const river = [];

let x = bt.randInRange(0, 125)
river.push([x, 0])
for (let y = 0; y < height;) {
    y += bt.randInRange(7, 10)
    if (y > height) y = height
        x += bt.randInRange(x - y * maxRiverAngleTan < 0 ? -x + edgeRiverPadding : -y * maxRiverAngleTan,
                            x + y * maxRiverAngleTan > width ? width - x - edgeRiverPadding : y * maxRiverAngleTan)
        river.push([x, y])
}

drawLines([bt.catmullRom(river)],{stroke:"blue",width: 5});