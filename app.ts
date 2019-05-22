import * as http from 'http';
import {getTotalHoursPerMonth} from "./routes-handlers/get-total-hours-of-drivers-per-month";
import {getDriversRouteList} from "./routes-handlers/get-driver's-route-list";
import {writeDriverOnRoute} from "./routes-handlers/write-driver-on-route";
import {removeDriverFromRoute} from "./routes-handlers/remove-driver-from-route";
import {getRoutesDriverList} from "./routes-handlers/get-route's-driver-list";
import {
    createRoute,
    deleteRouteById,
    getAllRoutes,
    getRouteById,
    updateRouteById
} from "./routes-handlers/routes-CRUD";
import {
    createDriver,
    deleteDriverById,
    getAllDrivers,
    getDriverById,
    updateDriverById
} from "./routes-handlers/drivers-CRUD";

let healthCheck: Date;

http.createServer((req, res) => {
    res.setHeader('Server-start-time', `${healthCheck}`);
    res.setHeader('Time-of-last-request', `${new Date()}`);
    res.setHeader('Server-work-duration', `${new Date().getTime() - healthCheck.getTime()} ms`);
    if (req.url === '/routes') {
        switch (req.method) {
            case 'GET':
                getAllRoutes(res);
                break;
            case 'POST':
                createRoute(req, res);
                break;
        }
    } else if (req.url.match(/^\/routes\/\d+$/)) {
        switch (req.method) {
            case 'GET':
                getRouteById(req, res);
                break;
            case 'PUT':
                updateRouteById(req, res);
                break;
            case 'DELETE':
                deleteRouteById(req, res);
                break;
        }
    } else if (req.url === '/drivers') {
        switch (req.method) {
            case 'GET':
                getAllDrivers(res);
                break;
            case 'POST':
                createDriver(req, res);
                break;
        }
    } else if (req.url.match(/^\/drivers\/\d+$/)) {
        switch (req.method) {
            case 'GET':
                getDriverById(req, res);
                break;
            case 'PUT':
                updateDriverById(req, res);
                break;
            case 'DELETE':
                deleteDriverById(req, res);
                break;
        }
    } else if (req.url.match(/^\/routes\/\d+\/drivers-last-month$/)) {
        if (req.method === 'GET') {
            getTotalHoursPerMonth(req, res);
        }
    } else if (req.url.match(/^\/drivers\/\d+\/routes$/)) {
        if (req.method === 'GET') {
            getDriversRouteList(req, res);
        }
    } else if (req.url.match(/^\/drivers\/\d+\/routes\/\d+$/)) {
        const idArray = req.url.replace(/\D+/g,' ').trim().split(' ');
        const driverId = parseInt(idArray[0]);
        const routeId = parseInt(idArray[1]);

        switch (req.method) {
            case 'PUT':
                writeDriverOnRoute(req, res, driverId, routeId);
                break;
            case 'DELETE':
                removeDriverFromRoute(req, res, driverId, routeId);
                break;
        }
    } else if (req.url.match(/^\/routes\/\d+\/drivers$/)) {
        if (req.method === 'GET') {
            getRoutesDriverList(req, res);
        }
    } else {
        res.writeHead(404, {'Message': 'No such route exists'});
        res.end();
    }
}).listen(3000,() => {
    console.log('Running on port 3000');
    healthCheck = new Date();
});