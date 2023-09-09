function matrixMultiply(matrixA, matrixB) {
    let rowsA = matrixA.length;
    let colsA = matrixA[0].length;
    let rowsB = matrixB.length;
    let colsB = matrixB[0].length;

    if (colsA !== rowsB) {
        throw new Error("Number of columns in matrixA must be equal to number of rows in matrixB");
    }

    let result = [];

    for (let i = 0; i < rowsA; i++) {
        result[i] = [];
        for (let j = 0; j < colsB; j++) {
            result[i][j] = 0;
            for (let k = 0; k < colsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}

const lineSize = 15;
const center = 400/2;


const points = [
  {x : center - 15 ,  y : center - 15, z: -lineSize  },
  {x : center + 15 , y : center - 15,  z: -lineSize  },
  {x : center - 15,  y :  center + 15, z: -lineSize  },
  {x :  center + 15 , y :  center + 15, z: -lineSize  },

  {x : center - 15 ,  y : center - 15, z: lineSize  },
  {x : center + 15 , y : center - 15,  z: lineSize  },
  {x : center - 15,  y :  center + 15, z: lineSize  },
  {x :  center + 15 , y :  center + 15, z: lineSize  },
];

const projection = [
  [1,0,0],
  [0,1,0],
];

const radius = 2;
let angle = 0;

function rotationMatrixX(angle) {
    return [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)],
    ];
}

function rotationMatrixY(angle) {
    return [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)],
    ];
}

function rotationMatrixZ(angle) {
    return [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1],
    ];
}

let showGuideLines = false;


function draw() {
    
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    
    if(showGuideLines) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "orange";
        ctx.beginPath(); 
        ctx.moveTo(200, 0);
        ctx.lineTo(200, 400);
        ctx.stroke();
        ctx.moveTo(0, 200);
        ctx.lineTo(400, 200);
        ctx.stroke();
    }
    
    const centerX = 400 / 2;
    const centerY = 400 / 2;
    const projected = [];

    for(let i in points) {
        ctx.beginPath();

        const a = [
            [points[i].x - centerX],
            [points[i].y - centerY],
            [points[i].z],
        ];

        let b = matrixMultiply(rotationMatrixY(angle), a);
        b = matrixMultiply(rotationMatrixX(angle), b);
        b = matrixMultiply(rotationMatrixZ(angle), b);
        b = matrixMultiply(projection, b);

        
        let x = b[0][0] + centerX;
        let y = b[1][0] + centerY;
        
        projected.push({x, y});
        ctx.arc(x , y, radius, 0, Math.PI*2, true);

        ctx.closePath();
        ctx.fill();
    }
    

    ctx.lineWidth = 2;
    ctx.beginPath();

    const lines = [
        [0, 1], [0, 2], [1, 3], [2, 3],
        [0, 4], [1, 5], [2, 6], [3, 7],
        [4, 5], [4, 6], [5, 7], [6, 7]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [startIdx, endIdx] = lines[i];
        ctx.moveTo(projected[startIdx].x, projected[startIdx].y);
        ctx.lineTo(projected[endIdx].x, projected[endIdx].y);
    }

    ctx.stroke();

    angle += 0.01;
    
  requestAnimationFrame(draw);
}

draw();
