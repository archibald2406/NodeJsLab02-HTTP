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
function getAllDrivers(res) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err)
            throw err;
        let driversData;
        driversData = JSON.parse(jsonData.toString());
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify(driversData));
    });
}
exports.getAllDrivers = getAllDrivers;
function createDriver(req, res) {
    let driversData;
    req.setEncoding('utf-8');
    req.on('data', (data) => driversData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/drivers.json', (err, jsonData) => {
            if (err)
                throw err;
            let data;
            data = JSON.parse(jsonData.toString());
            if (data.findIndex(drivers => drivers.id === driversData.id) === -1) {
                data.push(driversData);
                fs.writeFile('data/drivers.json', JSON.stringify(data, null, 2), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, { 'Content-type': 'application/json' });
                    res.end(JSON.stringify(data));
                });
            }
            else {
                res.writeHead(500, { 'Message': 'Driver with same id already exists' });
                res.end();
            }
        });
    });
}
exports.createDriver = createDriver;
function getDriverById(req, res) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err)
            throw err;
        const driverId = parseInt(req.url.replace(/\D+/, ''));
        let driversData;
        driversData = JSON.parse(jsonData.toString());
        const driver = driversData.find((driversData) => driversData.id === driverId);
        if (driver) {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(driver));
        }
        else {
            res.writeHead(404, { 'Message': 'No such driver exists' });
            res.end();
        }
    });
}
exports.getDriverById = getDriverById;
function updateDriverById(req, res) {
    let driverData;
    req.setEncoding('utf-8');
    req.on('data', (data) => driverData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/drivers.json', (err, jsonData) => {
            if (err)
                throw err;
            const driverId = parseInt(req.url.replace(/\D+/, ''));
            let driversData;
            driversData = JSON.parse(jsonData.toString());
            const driversDataIndex = driversData.findIndex((driversData) => driversData.id === driverId);
            if (driversDataIndex !== -1 && driverData) {
                driverData.id = driversData[driversDataIndex].id;
                driversData[driversDataIndex] = driverData;
                fs.writeFile('data/drivers.json', JSON.stringify(driversData, null, 2), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, { 'Content-type': 'application/json' });
                    res.end(JSON.stringify(driversData));
                });
            }
            else {
                res.writeHead(404, { 'Message': 'Driver with given id not exists' });
                res.end();
            }
        });
    });
}
exports.updateDriverById = updateDriverById;
function deleteDriverById(req, res) {
    fs.readFile('data/drivers.json', (err, jsonData) => {
        if (err)
            throw err;
        const driverId = parseInt(req.url.replace(/\D+/, ''));
        let driversData;
        driversData = JSON.parse(jsonData.toString());
        const driversDataIndex = driversData.findIndex((driversData) => driversData.id === driverId);
        if (driversDataIndex !== -1) {
            driversData.splice(driversDataIndex, 1);
            fs.writeFile('data/drivers.json', JSON.stringify(driversData, null, 2), err => {
                if (err)
                    throw err;
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(JSON.stringify(driversData));
            });
        }
        else {
            res.writeHead(404, { 'Message': 'Driver with given id not exists' });
            res.end();
        }
    });
}
exports.deleteDriverById = deleteDriverById;
