function loadCanvas(result, mysqlPool) {

    mysqlPool.getConnection((error, connection) => {
        if(error) {
            result.status(200).send({
                type: 'error',
                message: "Canvas doesn't exist."
            });
        }

        let sql = "SELECT x, y, color, address FROM pixels0; ";

        for(let i=1; i < 19; i++) {
            sql = sql + "SELECT x, y, color, address FROM pixels" + i.toString() + "; ";
        }
        sql = sql + "SELECT x, y, color, address FROM pixels19";

        connection.query(sql, (error, rows) => {
            connection.release();
    
            let data = [];
            for(let i=0; i < 20; i++) {
                for(let j=0; j < 50000; j++) {
                    data.push(rows[i][j]);
                }
            }

            result.status(200).send({
                type: 'success',
                data: data,
                message: "Canvas loaded successfully."
            });
        });
    });
}

module.exports = loadCanvas;