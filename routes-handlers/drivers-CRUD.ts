import * as fs from "fs";
import {DriverModel} from "../models/driver.model";

export function getAllDrivers(res: any) {
    fs.readFile('data/drivers.json',(err, jsonData) => {
        if (err) throw err;
        let driversData: DriverModel[];
        driversData = JSON.parse(jsonData.toString());
        res.writeHead(200,{'Content-type': 'application/json'});
        res.end(JSON.stringify(driversData));
    });
}

export function createDriver(req: any, res: any) {
    let driversData: DriverModel;
    req.setEncoding('utf-8');
    req.on('data', (data: string) => driversData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/drivers.json',(err, jsonData) => {
            if (err) throw err;
            let data: DriverModel[];
            data = JSON.parse(jsonData.toString());
            if (data.findIndex(drivers => drivers.id === driversData.id) === -1) {
                data.push(driversData);
                fs.writeFile('data/drivers.json', JSON.stringify(data,null,2),err => {
                    if (err) throw err;
                    res.writeHead(200,{'Content-type': 'application/json'});
                    res.end(JSON.stringify(data));
                });
            } else {
                res.writeHead(500, {'Message': 'Driver with same id already exists'});
                res.end();
            }
        });
    });
}

export function getDriverById(req: any, res: any) {
    fs.readFile('data/drivers.json',(err, jsonData) => {
        if (err) throw err;
        const driverId = parseInt(req.url.replace(/\D+/,''));
        let driversData: DriverModel[];
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData: DriverModel) => driversData.id === driverId);
        if (driver) {
            res.writeHead(200,{'Content-type': 'application/json'});
            res.end(JSON.stringify(driver));
        } else {
            res.writeHead(404, {'Message': 'No such driver exists'});
            res.end();
        }
    });
}

export function updateDriverById(req: any, res: any) {
    let driverData: DriverModel;
    req.setEncoding('utf-8');
    req.on('data', (data: string) => driverData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/drivers.json',(err, jsonData) => {
            if (err) throw err;
            const driverId = parseInt(req.url.replace(/\D+/,''));
            let driversData: DriverModel[];
            driversData = JSON.parse(jsonData.toString());
            const driversDataIndex = driversData.findIndex((driversData: DriverModel) => driversData.id === driverId);

            if (driversDataIndex !== -1 && driverData) {
                driverData.id = driversData[driversDataIndex].id;
                driversData[driversDataIndex] = driverData;
                fs.writeFile('data/drivers.json', JSON.stringify(driversData,null,2),err => {
                    if (err) throw err;
                    res.writeHead(200,{'Content-type': 'application/json'});
                    res.end(JSON.stringify(driversData));
                });
            } else {
                res.writeHead(404, {'Message': 'Driver with given id not exists'});
                res.end();
            }
        });
    });
}

export function deleteDriverById(req: any, res: any) {
    fs.readFile('data/drivers.json',(err, jsonData) => {
        if (err) throw err;
        const driverId = parseInt(req.url.replace(/\D+/,''));
        let driversData: DriverModel[];
        driversData = JSON.parse(jsonData.toString());
        const driversDataIndex = driversData.findIndex((driversData: DriverModel) => driversData.id === driverId);

        if (driversDataIndex !== -1) {
            driversData.splice(driversDataIndex,1);
            fs.writeFile('data/drivers.json', JSON.stringify(driversData,null,2),err => {
                if (err) throw err;
                res.writeHead(200,{'Content-type': 'application/json'});
                res.end(JSON.stringify(driversData));
            });
        } else {
            res.writeHead(404, {'Message': 'Driver with given id not exists'});
            res.end();
        }
    });
}