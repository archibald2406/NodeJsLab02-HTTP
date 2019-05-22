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
function getAllRoutes(res) {
    fs.readFile('data/routes.json', (err, jsonData) => {
        if (err)
            throw err;
        let routesData;
        routesData = JSON.parse(jsonData.toString());
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify(routesData));
    });
}
exports.getAllRoutes = getAllRoutes;
function createRoute(req, res) {
    let routesData;
    req.setEncoding('utf-8');
    req.on('data', (data) => routesData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/routes.json', (err, jsonData) => {
            if (err)
                throw err;
            let data;
            data = JSON.parse(jsonData.toString());
            if (data.findIndex(routes => routes.id === routesData.id) === -1) {
                data.push(routesData);
                fs.writeFile('data/routes.json', JSON.stringify(data, null, 2), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, { 'Content-type': 'application/json' });
                    res.end(JSON.stringify(data));
                });
            }
            else {
                res.writeHead(500, { 'Message': 'Route with same id already exists' });
                res.end();
            }
        });
    });
}
exports.createRoute = createRoute;
function getRouteById(req, res) {
    fs.readFile('data/routes.json', (err, jsonData) => {
        if (err)
            throw err;
        const routeId = parseInt(req.url.replace(/\D+/, ''));
        let routesData;
        routesData = JSON.parse(jsonData.toString());
        const route = routesData.find((routesData) => routesData.id === routeId);
        if (route) {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(route));
        }
        else {
            res.writeHead(404, { 'Message': 'No such route exists' });
            res.end();
        }
    });
}
exports.getRouteById = getRouteById;
function updateRouteById(req, res) {
    let routeData;
    req.setEncoding('utf-8');
    req.on('data', (data) => routeData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/routes.json', (err, jsonData) => {
            if (err)
                throw err;
            const routeId = parseInt(req.url.replace(/\D+/, ''));
            let routesData;
            routesData = JSON.parse(jsonData.toString());
            const routesDataIndex = routesData.findIndex((routesData) => routesData.id === routeId);
            if (routesDataIndex !== -1 && routeData) {
                routeData.id = routesData[routesDataIndex].id;
                routesData[routesDataIndex] = routeData;
                fs.writeFile('data/routes.json', JSON.stringify(routesData, null, 2), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, { 'Content-type': 'application/json' });
                    res.end(JSON.stringify(routesData));
                });
            }
            else {
                res.writeHead(404, { 'Message': 'Route with given id not exists' });
                res.end();
            }
        });
    });
}
exports.updateRouteById = updateRouteById;
function deleteRouteById(req, res) {
    fs.readFile('data/routes.json', (err, jsonData) => {
        if (err)
            throw err;
        const routeId = parseInt(req.url.replace(/\D+/, ''));
        let routesData;
        routesData = JSON.parse(jsonData.toString());
        const routesDataIndex = routesData.findIndex((routesData) => routesData.id === routeId);
        if (routesDataIndex !== -1) {
            routesData.splice(routesDataIndex, 1);
            fs.writeFile('data/routes.json', JSON.stringify(routesData, null, 2), err => {
                if (err)
                    throw err;
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(JSON.stringify(routesData));
            });
        }
        else {
            res.writeHead(404, { 'Message': 'Route with given id not exists' });
            res.end();
        }
    });
}
exports.deleteRouteById = deleteRouteById;
