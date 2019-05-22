"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function getDriversRouteList(req, res) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err)
            throw err;
        const driverId = parseInt(req.url.replace(/\D+/, ''));
        let driversData;
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData) => driversData.id === driverId);
        if (driver) {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(driver.routes));
        }
        else {
            res.writeHead(404, { 'Message': 'Driver with given id not exists' });
            res.end();
        }
    });
}
exports.getDriversRouteList = getDriversRouteList;
