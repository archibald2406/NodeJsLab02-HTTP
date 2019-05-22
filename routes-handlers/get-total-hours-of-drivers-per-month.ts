import * as fs from "fs";
import {DriverModel} from "../models/driver.model";
import {RouteModel} from "../models/route.model";

export function getTotalHoursPerMonth(req: any, res: any) {
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

                let monthlyTotalHours: number = 0;

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
                res.writeHead(200, {'Content-type': 'application/json'});
                res.end(JSON.stringify({monthlyTotalHours}));
            });
        } else {
            res.writeHead(404, {'Message': 'Route with given id not exists'});
            res.end();
        }
    });
}