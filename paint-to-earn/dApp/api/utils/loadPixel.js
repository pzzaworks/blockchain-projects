function loadPixel(io, mysqlPool, currentSelectedPixel) {
    mysqlPool.getConnection((error, connection) => {
        let coordinates = [];
        let coordinateCountPerTable = 50000;
        let coordinateX = 0;
        let coordinateY = -1;
        let rowPixelCount = 999;
        let currentPixelsTableIndex = 0;

        for(let i=0; i < 20; i++) {
            coordinates.push([]);
            for(let j=0; j < coordinateCountPerTable; j++) {
                if(coordinateY === rowPixelCount) {
                    coordinateX++;
                    coordinateY = 0;
                } else {
                    coordinateY++;
                }
                if(coordinateX === parseInt(currentSelectedPixel.left) && coordinateY === parseInt(currentSelectedPixel.top)) {
                    currentPixelsTableIndex = i;
                }
                coordinates[i].push({ x: coordinateX, y: coordinateY });
            }
        }

        let currentPixelsTable = 'pixels' + currentPixelsTableIndex.toString();

        let sql = 'SELECT x, y, color, address FROM ' + currentPixelsTable + ' WHERE x = ? and y = ?';
        let data = [currentSelectedPixel.left.toString(), currentSelectedPixel.top.toString()];
        connection.query(sql, data, (error, rows) => {
            connection.release();
            let loadPixelData = {x: currentSelectedPixel.left, y: currentSelectedPixel.top, color: rows[0].color, address: rows[0].address};
            io.emit("loadPixelData", loadPixelData);
        });
    });
}

module.exports = loadPixel;