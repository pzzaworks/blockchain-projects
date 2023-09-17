function savePixel(result, fields, mysqlPool) {
    mysqlPool.getConnection((error, connection) => {
        if(error) {
            result.status(200).send({
                type: 'error',
                message: "Canvas doesn't exist."
            });
        }

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
                if(coordinateX === parseInt(JSON.parse(fields.currentSelectedPixel).left) && coordinateY === parseInt(JSON.parse(fields.currentSelectedPixel).top)) {
                    currentPixelsTableIndex = i;
                }
                coordinates[i].push({ x: coordinateX, y: coordinateY });
            }
        }

        let currentPixelsTable = 'pixels' + currentPixelsTableIndex.toString();

        let sql = 'UPDATE ' + currentPixelsTable + ' SET color = ?, address = ? WHERE x = ? and y = ?';
        let data = [fields.currentPaintColor, fields.currentAddress, (JSON.parse(fields.currentSelectedPixel).left).toString(), (JSON.parse(fields.currentSelectedPixel).top).toString()];
        connection.query(sql, data, (error, rows) => {
            connection.release();

            result.status(200).send({
                type: 'success',
                message: "Pixel saved."
            });
        });
    });
}

module.exports = savePixel;
