export class MazeGenerator {
    constructor(cols, rows) {
        this.rows = rows;
        this.cols = cols;
        this.maze = [];
        this.visited = [];
        
        this.generate();
    }

    generate() {
        for (let r = 0; r < this.rows; r++) {
            this.maze[r] = [];
            this.visited[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.maze[r][c] = [false, false, false, false];
                this.visited[r][c] = false;
            }
        }
        
        this.generateMaze();
        return this.maze;
    }
    
    generateMaze(row = 0, col = 0) {
        this.visited[row][col] = true;
        
        // вверх, вниз, влево, вправо
        const directions = [
            [-1, 0, 0],
            [1, 0, 1],
            [0, -1, 2],
            [0, 1, 3]
        ];
        
        // TODO: Phaser.Utils.Array.Shuffle(array);
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        
        for (const [dr, dc, dir] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.inBounds(newRow, newCol) && !this.visited[newRow][newCol]) {
                this.removeWall(row, col, newRow, newCol, dir);
                
                this.generateMaze(newRow, newCol);
            }
        }
    }

    inBounds(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    removeWall(row1, col1, row2, col2, dir) {
        this.maze[row1][col1][dir] = true;
        
        let oppositeDir;
        if (dir === 0) oppositeDir = 1;
        else if (dir === 1) oppositeDir = 0;
        else if (dir === 2) oppositeDir = 3;
        else if (dir === 3) oppositeDir = 2;
        
        this.maze[row2][col2][oppositeDir] = true;
    }

    setEntryExit(entryRow, exitRow) {
        this.maze[entryRow][0][2] = true;
        this.maze[exitRow][this.cols-1][3] = true;
    }

    getMaze() {
        return this.maze;
    }
}