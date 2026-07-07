export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

// directions: [up, down, left, right]
export function generateChunk(directions) {
    const chunk = Array(4).fill().map(() => Array(4).fill(0));
    const [up, down, left, right] = directions;
    
    const coords = [
        [1,1], [1,2], [2,1], [2,2], // center
        ...(up ? [[0,1], [0,2]] : []),
        ...(down ? [[3,1], [3,2]] : []),
        ...(left ? [[1,0], [2,0]] : []),
        ...(right ? [[1,3], [2,3]] : [])
    ];
    
    coords.forEach(([r, c]) => chunk[r][c] = -1);
    return chunk;
}