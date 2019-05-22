import * as fs from "fs";
import {DriverModel} from "../models/driver.model";
import {RouteModel} from "../models/route.model";

export function removeDriverFromRoute(req: any, res: any, driverId: number, routeId: number) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err) throw err;
        let driversData: DriverModel[];
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData: DriverModel) => driversData.id === driverId);
        if (driver) {
            fs.readFile('data/routes.json',(err, jsonData) => {
                if (err) throw err;
                let routesData: RouteModel[];
                routesData = JSON.parse(jsonData.toString());
                const route = routesData.find((routesData: RouteModel) => routesData.id === routeId);

                if (driver.routes.findIndex(routes => routes.id === routeId) !== -1) {
                    const driverRouteIndex = driver.routes.findIndex(routes => routes.id === routeId);

                    if (driverRouteIndex !== -1) {
                        driver.routes.splice(driverRouteIndex,1);
                        driver.totalHours -= route.time;
                    }

                    const driversDataIndex = driversData.findIndex((driversData: DriverModel) => driversData.id === driverId);
                    if (driversDataIndex !== -1) {
                        driversData[driversDataIndex] = driver;
                    }

                    fs.writeFile('data/drivers.json', JSON.stringify(driversData,null,2),err => {
                        if (err) throw err;

                        const routesDataIndex = routesData.findIndex((routesData: RouteModel) => routesData.id === routeId);
                        if (routesDataIndex !== -1) {
                            const routeDriverIdIndex = routesData[routesDataIndex].drivers.findIndex((driversId: number) => driversId === driverId);
                            if (routeDriverIdIndex !== -1) {
                                routesData[routesDataIndex].drivers.splice(routeDriverIdIndex,1);
                            }
                        }

                        fs.writeFile('data/routes.json', JSON.stringify(routesData,null,2),err => {
                            if (err) throw err;
                            res.writeHead(200,{'Content-type': 'application/json'});
                            res.end(JSON.stringify(driversData));
                        });
                    });
                }
            });
        }
    });
}