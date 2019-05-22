import * as fs from "fs";
import {RouteModel} from "../models/route.model";
import {DriverModel} from "../models/driver.model";

export function getRoutesDriverList(req: any, res: any) {
    fs.readFile('data/routes.json',(err, jsonData) => {
        if (err) throw err;
        const routeId = parseInt(req.url.replace(/\D+/, ''));
        let routesData: RouteModel[];
        routesData = JSON.parse(jsonData.toString());
        const route = routesData.find((routesData: RouteModel) => routesData.id === routeId);
        let driversIdList: number[];
        if (route) {
            driversIdList = route.drivers;
            fs.readFile('data/drivers.json',(err, jsonData) => {
                if (err) throw err;
                let driversData: DriverModel[];
                driversData = JSON.parse(jsonData.toString());
                let driversList: DriverModel[] = [];

                for (const driverId of driversIdList) {
                    for (const item of driversData) {
                        if (driverId === item.id) {
                            driversList.push(item);
                        }
                    }
                }
                res.writeHead(200, {'Content-type': 'application/json'});
                res.end(JSON.stringify(driversList));
            });
        } else {
            res.writeHead(404, {'Message': 'Route with given id not exists'});
            res.end();
        }
    });
}