const width = 125;
const height = 125;

setDocDimensions(width, height);

const riverOptions = {
    maxAngleTan: 0.2,
    paddingX: 10,
    paddingY: 5,
    maxWidth: 7,
    minWidth: 1
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
drawLines(drawRiver())