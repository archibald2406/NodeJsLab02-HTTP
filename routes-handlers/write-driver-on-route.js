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
function writeDriverOnRoute(req, res, driverId, routeId) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err)
            throw err;
        let driversData;
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData) => driversData.id === driverId);
        if (driver && driver.totalHours < 20) {
            fs.readFile('data/routes.json', (err, jsonData) => {
                if (err)
                    throw err;
                let routesData;
                routesData = JSON.parse(jsonData.toString());
                const route = routesData.find((routesData) => routesData.id === routeId);
                if (route.time + driver.totalHours <= 20) {
                    if (driver.routes.findIndex(routes => routes.id === routeId) === -1) {
                        driver.routes.push({
                            id: route.id,
                            title: route.title,
                            time: route.time,
                            dateOfRecording: new Date().toString()
                        });
                        driver.totalHours += route.time;
                        const driversDataIndex = driversData.findIndex((driversData) => driversData.id === driverId);
                        if (driversDataIndex !== -1) {
                            driversData[driversDataIndex] = driver;
                        }
                        fs.writeFile('data/drivers.json', JSON.stringify(driversData, null, 2), err => {
                            if (err)
                                throw err;
                            const routesDataIndex = routesData.findIndex((routesData) => routesData.id === routeId);
                            if (routesDataIndex !== -1) {
                                routesData[routesDataIndex].drivers.push(driverId);
                            }
                            fs.writeFile('data/routes.json', JSON.stringify(routesData, null, 2), err => {
                                if (err)
                                    throw err;
                                res.writeHead(200, { 'Content-type': 'application/json' });
                                res.end(JSON.stringify(driversData));
                            });
                        });
                    }
                }
            });
        }
    });
}
exports.writeDriverOnRoute = writeDriverOnRoute;
