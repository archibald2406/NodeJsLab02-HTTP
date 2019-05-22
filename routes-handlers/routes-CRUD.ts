import * as fs from "fs";
import {RouteModel} from "../models/route.model";

export function getAllRoutes(res: any) {
    fs.readFile('data/routes.json',(err, jsonData) => {
        if (err) throw err;
        let routesData: RouteModel[];
        routesData = JSON.parse(jsonData.toString());
        res.writeHead(200,{'Content-type': 'application/json'});
        res.end(JSON.stringify(routesData));
    });
}

export function createRoute(req: any, res: any) {
    let routesData: RouteModel;
    req.setEncoding('utf-8');
    req.on('data', (data: string) => routesData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/routes.json',(err, jsonData) => {
            if (err) throw err;
            let data: RouteModel[];
            data = JSON.parse(jsonData.toString());
            if (data.findIndex(routes => routes.id === routesData.id) === -1) {
                data.push(routesData);
                fs.writeFile('data/routes.json', JSON.stringify(data,null,2),err => {
                    if (err) throw err;
                    res.writeHead(200,{'Content-type': 'application/json'});
                    res.end(JSON.stringify(data));
                });
            } else {
                res.writeHead(500, {'Message': 'Route with same id already exists'});
                res.end();
            }
        });
    });
}

export function getRouteById(req: any, res: any) {
    fs.readFile('data/routes.json',(err, jsonData) => {
        if (err) throw err;
        const routeId = parseInt(req.url.replace(/\D+/,''));
        let routesData: RouteModel[];
        routesData = JSON.parse(jsonData.toString());
        const route = routesData.find((routesData: RouteModel) => routesData.id === routeId);
        if (route) {
            res.writeHead(200,{'Content-type': 'application/json'});
            res.end(JSON.stringify(route));
        } else {
            res.writeHead(404, {'Message': 'No such route exists'});
            res.end();
        }
    });
}

export function updateRouteById(req: any, res: any) {
    let routeData: RouteModel;
    req.setEncoding('utf-8');
    req.on('data', (data: string) => routeData = JSON.parse(data));
    req.on('end', () => {
        fs.readFile('data/routes.json',(err, jsonData) => {
            if (err) throw err;
            const routeId = parseInt(req.url.replace(/\D+/,''));
            let routesData: RouteModel[];
            routesData = JSON.parse(jsonData.toString());
            const routesDataIndex = routesData.findIndex((routesData: RouteModel) => routesData.id === routeId);

            if (routesDataIndex !== -1 && routeData) {
                routeData.id = routesData[routesDataIndex].id;
                routesData[routesDataIndex] = routeData;
                fs.writeFile('data/routes.json', JSON.stringify(routesData,null,2),err => {
                    if (err) throw err;
                    res.writeHead(200,{'Content-type': 'application/json'});
                    res.end(JSON.stringify(routesData));
                });
            } else {
                res.writeHead(404, {'Message': 'Route with given id not exists'});
                res.end();
            }
        });
    });
}

export function deleteRouteById(req: any, res: any) {
    fs.readFile('data/routes.json',(err, jsonData) => {
        if (err) throw err;
        const routeId = parseInt(req.url.replace(/\D+/,''));
        let routesData: RouteModel[];
        routesData = JSON.parse(jsonData.toString());
        const routesDataIndex = routesData.findIndex((routesData: RouteModel) => routesData.id === routeId);

        if (routesDataIndex !== -1) {
            routesData.splice(routesDataIndex,1);
            fs.writeFile('data/routes.json', JSON.stringify(routesData,null,2),err => {
                if (err) throw err;
                res.writeHead(200,{'Content-type': 'application/json'});
                res.end(JSON.stringify(routesData));
            });
        } else {
            res.writeHead(404, {'Message': 'Route with given id not exists'});
            res.end();
        }
    });
}