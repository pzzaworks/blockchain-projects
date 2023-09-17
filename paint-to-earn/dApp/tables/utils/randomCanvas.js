const canvasSize = { width: 1000, height: 1000 };

function randomCanvas(result, mysqlPool) {
    mysqlPool.getConnection((error, connection) => {

        let truncateSql = 'TRUNCATE pixels';
        connection.query(truncateSql, (error, rows) => {});

        const colorPaletteItems = [
            {name: 'Yellow', code: '#FFD635'},
            {name: 'Light Orange', code: '#FFA800'},
            {name: 'Orange', code: '#FF4500'},
            {name: 'Red', code: '#BE0039'},
            {name: 'Light Purple', code: '#B44AC0'},
            {name: 'Purple', code: '#811E9F'},
            {name: 'Dark Blue', code: '#493AC1'},
            {name: 'Blue', code: '#3690EA'},
            {name: 'Green', code: '#00A368'},
            {name: 'Light Green', code: '#00CC78'},
            {name: 'White', code: '#FFFFFF'},
            {name: 'Light Gray', code: '#D4D7D9'},
            {name: 'Gray', code: '#898D90'},
            {name: 'Black', code: '#000000'}
        ];

        let values = [];
        for(let i = 0; i < canvasSize.width; i++) {
            for(let j = 0; j < canvasSize.height; j++) {
                let currentValue = [];
                currentValue.push(i);
                currentValue.push(j);
                let currentColor = colorPaletteItems[Math.floor((Math.random() * colorPaletteItems.length))].code;
                currentValue.push(currentColor);
                currentValue.push("0x0000000000000000000000000000000000000000");
                values.push(currentValue);
            }
        }


        let sql = 'INSERT INTO pixels (x, y, color, address) VALUES ?';
        connection.query(sql, [values], (error, rows) => {
            if(error) { console.log(error); }
            connection.release();
            result.send("Canvas filled with random colors!");
        });
    });
}

module.exports = randomCanvas;