require('dotenv').config();
const Web3 = require('web3');

const PaintToEarn = require("../PaintToEarn/PaintToEarn.json");

const canvasSize = { width: 1000, height: 1000 };
const contract = "0x2648e6BC01AA3aE8a8194118Fa5d7FE550a0eb98";

async function fetchAndSaveCanvas(result, mysqlPool) {
    try{
        let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATEKEY);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        const smartContract = new web3.eth.Contract(PaintToEarn.abi, contract);
    
        mysqlPool.getConnection(async (error, connection) => {
            try{
                let truncateSql = 'TRUNCATE pixels';
                connection.query(truncateSql, (error, rows) => {});

                let values = [];
                for(let i = 0; i < canvasSize.width; i++) {
                    for(let j = 0; j < canvasSize.height; j++) {
                        let currentCoordinateColor = await smartContract.methods.getCoordinateColor(i, j).call();
                        let currentCoordinateAddress = await smartContract.methods.getCoordinateAddress(i, j).call();
                        console.log("x: " + i + " y: " + j);
                        let currentValue = [];
                        currentValue.push(i);
                        currentValue.push(j);
                        currentValue.push(currentCoordinateColor.toString());
                        currentValue.push(currentCoordinateAddress.toString());
                        values.push(currentValue);
                    }
                }
        
                let sql = 'INSERT INTO pixels (x, y, color, address) VALUES ?';
                connection.query(sql, [values], (error, rows) => {
                    connection.release();
                    result.send("Canvas fetched and saved.");
                });
            } catch(e) {}
        });
    } catch(e) {}
}

module.exports = fetchAndSaveCanvas;
