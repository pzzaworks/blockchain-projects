const canvasSize = { width: 1000, height: 1000 };

function emptyCanvas(result, mysqlPool) {
    mysqlPool.getConnection((error, connection) => {

        let truncateSql = "TRUNCATE pixels0; ";

        for(let i=1; i < 19; i++) {
            truncateSql = truncateSql + "TRUNCATE pixels" + i.toString() + "; ";
        }
        truncateSql = truncateSql + "TRUNCATE pixels19";

        connection.query(truncateSql, (error, rows) => {});

        let values = [];
        let coordinateCountPerTable = 50000;
        let coordinateX = 0;
        let coordinateY = -1;
        let rowPixelCount = 999;

        for(let i=0; i < 20; i++) {
            values.push([]);
            for(let j=0; j < coordinateCountPerTable; j++) {
                if(coordinateY === rowPixelCount) {
                    coordinateX++;
                    coordinateY = 0;
                } else {
                    coordinateY++;
                }
                let currentValue = [];
                currentValue.push(coordinateX);
                currentValue.push(coordinateY);
                currentValue.push("#000000");
                currentValue.push("0x0000000000000000000000000000000000000000");
                values[i].push(currentValue);
            }
        }

        let sql = "INSERT INTO pixels0 (x, y, color, address) VALUES ?; ";

        for(let i=1; i < 19; i++) {
            sql = sql + "INSERT INTO pixels" + i.toString() + " (x, y, color, address) VALUES ?; ";
        }
        sql = sql + "INSERT INTO pixels19 (x, y, color, address) VALUES ?";

        connection.query(sql, 
            [   values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7],
                values[8], values[9], values[10], values[11], values[12], values[13], values[14], values[15], 
                values[16], values[17], values[18], values[19]  ], (error, rows) => {
            if(error) { console.log(error); }
            connection.release();
            result.send("Canvas cleared!");
        });
    });
}

module.exports = emptyCanvas;