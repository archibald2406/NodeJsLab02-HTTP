"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const get_total_hours_of_drivers_per_month_1 = require("./routes-handlers/get-total-hours-of-drivers-per-month");
const get_driver_s_route_list_1 = require("./routes-handlers/get-driver's-route-list");
const write_driver_on_route_1 = require("./routes-handlers/write-driver-on-route");
const remove_driver_from_route_1 = require("./routes-handlers/remove-driver-from-route");
const get_route_s_driver_list_1 = require("./routes-handlers/get-route's-driver-list");
const routes_CRUD_1 = require("./routes-handlers/routes-CRUD");
const drivers_CRUD_1 = require("./routes-handlers/drivers-CRUD");
let healthCheck;
http.createServer((req, res) => {
    res.setHeader('Server-start-time', `${healthCheck}`);
    res.setHeader('Time-of-last-request', `${new Date()}`);
    res.setHeader('Server-work-duration', `${new Date().getTime() - healthCheck.getTime()} ms`);
    if (req.url === '/routes') {
        switch (req.method) {
            case 'GET':
                routes_CRUD_1.getAllRoutes(res);
                break;
            case 'POST':
                routes_CRUD_1.createRoute(req, res);
                break;
        }
    }
    else if (req.url.match(/^\/routes\/\d+$/)) {
        switch (req.method) {
            case 'GET':
                routes_CRUD_1.getRouteById(req, res);
                break;
            case 'PUT':
                routes_CRUD_1.updateRouteById(req, res);
                break;
            case 'DELETE':
                routes_CRUD_1.deleteRouteById(req, res);
                break;
        }
    }
    else if (req.url === '/drivers') {
        switch (req.method) {
            case 'GET':
                drivers_CRUD_1.getAllDrivers(res);
                break;
            case 'POST':
                drivers_CRUD_1.createDriver(req, res);
                break;
        }
    }
    else if (req.url.match(/^\/drivers\/\d+$/)) {
        switch (req.method) {
            case 'GET':
                drivers_CRUD_1.getDriverById(req, res);
                break;
            case 'PUT':
                drivers_CRUD_1.updateDriverById(req, res);
                break;
            case 'DELETE':
                drivers_CRUD_1.deleteDriverById(req, res);
                break;
        }
    }
    else if (req.url.match(/^\/routes\/\d+\/drivers-last-month$/)) {
        if (req.method === 'GET') {
            get_total_hours_of_drivers_per_month_1.getTotalHoursPerMonth(req, res);
        }
    }
    else if (req.url.match(/^\/drivers\/\d+\/routes$/)) {
        if (req.method === 'GET') {
            get_driver_s_route_list_1.getDriversRouteList(req, res);
        }
    }
    else if (req.url.match(/^\/drivers\/\d+\/routes\/\d+$/)) {
        const idArray = req.url.replace(/\D+/g, ' ').trim().split(' ');
        const driverId = parseInt(idArray[0]);
        const routeId = parseInt(idArray[1]);
        switch (req.method) {
            case 'PUT':
                write_driver_on_route_1.writeDriverOnRoute(req, res, driverId, routeId);
                break;
            case 'DELETE':
                remove_driver_from_route_1.removeDriverFromRoute(req, res, driverId, routeId);
                break;
        }
    }
    else if (req.url.match(/^\/routes\/\d+\/drivers$/)) {
        if (req.method === 'GET') {
            get_route_s_driver_list_1.getRoutesDriverList(req, res);
        }
    }
    else {
        res.writeHead(404, { 'Message': 'No such route exists' });
        res.end();
    }
}).listen(3000, () => {
    console.log('Running on port 3000');
    healthCheck = new Date();
});
