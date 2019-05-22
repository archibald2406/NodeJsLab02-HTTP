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
function getRoutesDriverList(req, res) {
    fs.readFile('data/routes.json', (err, jsonData) => {
        if (err)
            throw err;
        const routeId = parseInt(req.url.replace(/\D+/, ''));
        let routesData;
        routesData = JSON.parse(jsonData.toString());
        const route = routesData.find((routesData) => routesData.id === routeId);
        let driversIdList;
        if (route) {
            driversIdList = route.drivers;
            fs.readFile('data/drivers.json', (err, jsonData) => {
                if (err)
                    throw err;
                let driversData;
                driversData = JSON.parse(jsonData.toString());
                let driversList = [];
                for (const driverId of driversIdList) {
                    for (const item of driversData) {
                        if (driverId === item.id) {
                            driversList.push(item);
                        }
                    }
                }
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(JSON.stringify(driversList));
            });
        }
        else {
            res.writeHead(404, { 'Message': 'Route with given id not exists' });
            res.end();
        }
    });
}
exports.getRoutesDriverList = getRoutesDriverList;
