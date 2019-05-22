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
function getTotalHoursPerMonth(req, res) {
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
                let monthlyTotalHours = 0;
                for (const driverId of driversIdList) {
                    for (const item of driversData) {
                        if (driverId === item.id) {
                            for (const route of item.routes) {
                                const condition1 = new Date().getMonth() - new Date(route.dateOfRecording).getMonth() === 0
                                    && new Date().getDate() >= new Date(route.dateOfRecording).getDate();
                                const condition2 = new Date().getMonth() - new Date(route.dateOfRecording).getMonth() === 1
                                    && new Date().getDate() <= new Date(route.dateOfRecording).getDate();
                                if (condition1 || condition2) {
                                    monthlyTotalHours += route.time;
                                }
                            }
                        }
                    }
                }
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(JSON.stringify({ monthlyTotalHours }));
            });
        }
        else {
            res.writeHead(404, { 'Message': 'Route with given id not exists' });
            res.end();
        }
    });
}
exports.getTotalHoursPerMonth = getTotalHoursPerMonth;
