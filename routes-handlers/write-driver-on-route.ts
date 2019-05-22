import * as fs from "fs";
import {DriverModel} from "../models/driver.model";
import {RouteModel} from "../models/route.model";

export function writeDriverOnRoute(req: any, res: any, driverId: number, routeId: number) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err) throw err;
        let driversData: DriverModel[];
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData: DriverModel) => driversData.id === driverId);
        if (driver && driver.totalHours < 20) {
            fs.readFile('data/routes.json',(err, jsonData) => {
                if (err) throw err;
                let routesData: RouteModel[];
                routesData = JSON.parse(jsonData.toString());
                const route = routesData.find((routesData: RouteModel) => routesData.id === routeId);

                if (route.time + driver.totalHours <= 20) {
                    if (driver.routes.findIndex(routes => routes.id === routeId) === -1) {
                        driver.routes.push({
                            id: route.id,
                            title: route.title,
                            time: route.time,
                            dateOfRecording: new Date().toString()
                        });
                        driver.totalHours += route.time;

                        const driversDataIndex = driversData.findIndex((driversData: DriverModel) => driversData.id === driverId);
                        if (driversDataIndex !== -1) {
                            driversData[driversDataIndex] = driver;
                        }

                        fs.writeFile('data/drivers.json', JSON.stringify(driversData,null,2),err => {
                            if (err) throw err;

                            const routesDataIndex = routesData.findIndex((routesData: RouteModel) => routesData.id === routeId);
                            if (routesDataIndex !== -1) {
                                routesData[routesDataIndex].drivers.push(driverId);
                            }

                            fs.writeFile('data/routes.json', JSON.stringify(routesData,null,2),err => {
                                if (err) throw err;
                                res.writeHead(200,{'Content-type': 'application/json'});
                                res.end(JSON.stringify(driversData));
                            });
                        });
                    }
                }
            });
        }
    });
}