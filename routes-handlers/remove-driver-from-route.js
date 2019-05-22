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
function removeDriverFromRoute(req, res, driverId, routeId) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err)
            throw err;
        let driversData;
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData) => driversData.id === driverId);
        if (driver) {
            fs.readFile('data/routes.json', (err, jsonData) => {
                if (err)
                    throw err;
                let routesData;
                routesData = JSON.parse(jsonData.toString());
                const route = routesData.find((routesData) => routesData.id === routeId);
                if (driver.routes.findIndex(routes => routes.id === routeId) !== -1) {
                    const driverRouteIndex = driver.routes.findIndex(routes => routes.id === routeId);
                    if (driverRouteIndex !== -1) {
                        driver.routes.splice(driverRouteIndex, 1);
                        driver.totalHours -= route.time;
                    }
                    const driversDataIndex = driversData.findIndex((driversData) => driversData.id === driverId);
                    if (driversDataIndex !== -1) {
                        driversData[driversDataIndex] = driver;
                    }
                    fs.writeFile('data/drivers.json', JSON.stringify(driversData, null, 2), err => {
                        if (err)
                            throw err;
                        const routesDataIndex = routesData.findIndex((routesData) => routesData.id === routeId);
                        if (routesDataIndex !== -1) {
                            const routeDriverIdIndex = routesData[routesDataIndex].drivers.findIndex((driversId) => driversId === driverId);
                            if (routeDriverIdIndex !== -1) {
                                routesData[routesDataIndex].drivers.splice(routeDriverIdIndex, 1);
                            }
                        }
                        fs.writeFile('data/routes.json', JSON.stringify(routesData, null, 2), err => {
                            if (err)
                                throw err;
                            res.writeHead(200, { 'Content-type': 'application/json' });
                            res.end(JSON.stringify(driversData));
                        });
                    });
                }
            });
        }
    });
}
exports.removeDriverFromRoute = removeDriverFromRoute;
