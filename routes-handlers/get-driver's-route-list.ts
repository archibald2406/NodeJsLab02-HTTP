import * as fs from "fs";
import {DriverModel} from "../models/driver.model";

export function getDriversRouteList(req: any, res: any) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err) throw err;
        const driverId = parseInt(req.url.replace(/\D+/, ''));
        let driversData: DriverModel[];
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData: DriverModel) => driversData.id === driverId);
        if (driver) {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(JSON.stringify(driver.routes));
        } else {
            res.writeHead(404, {'Message': 'Driver with given id not exists'});
            res.end();
        }
    });
}