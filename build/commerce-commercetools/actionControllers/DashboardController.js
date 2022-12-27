"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDashboard = exports.getMyDashboard = void 0;
const Request_1 = require("../utils/Request");
const DashboardApi_1 = require("../apis/DashboardApi");
const DASHBOARD_CONTAINER = 'dashboard-container';
const DASHBOARD_KEY_POSTFIX = 'dashboard';
const getDashboardKey = (accountId) => {
    return `${accountId}__${DASHBOARD_KEY_POSTFIX}`;
};
const getMyDashboard = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const dashboardApi = new DashboardApi_1.DashboardApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const accountId = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId;
    if (!accountId) {
        throw new Error('Not logged in');
    }
    let dashboard = null;
    try {
        dashboard = yield dashboardApi.get(getDashboardKey(accountId), DASHBOARD_CONTAINER);
    }
    catch (e) {
        dashboard = yield dashboardApi.create({
            container: DASHBOARD_CONTAINER,
            key: getDashboardKey(accountId),
            value: {
                customer: {
                    id: accountId,
                    typeId: 'customer',
                },
                widgets: [
                    {
                        id: 'OrderList',
                        layout: {
                            i: 'OrderList',
                            x: 0,
                            y: 2,
                            w: 12,
                            h: 3,
                            isDraggable: undefined,
                        },
                    },
                    {
                        id: 'OrderStatus',
                        layout: {
                            i: 'OrderStatus',
                            x: 0,
                            y: 0,
                            w: 5,
                            h: 2,
                            isDraggable: undefined,
                        },
                    },
                    {
                        id: 'RecentPurchase',
                        layout: {
                            i: 'RecentPurchase',
                            x: 6,
                            y: 0,
                            w: 6,
                            h: 2,
                            isDraggable: undefined,
                        },
                    },
                ],
            },
        });
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(dashboard),
        sessionData: request.sessionData,
    };
    return response;
});
exports.getMyDashboard = getMyDashboard;
const updateDashboard = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const dashboardApi = new DashboardApi_1.DashboardApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const { widgets } = JSON.parse(request === null || request === void 0 ? void 0 : request.body);
    const accountId = (_d = (_c = request.sessionData) === null || _c === void 0 ? void 0 : _c.account) === null || _d === void 0 ? void 0 : _d.accountId;
    if (!accountId) {
        throw new Error('Not logged in');
    }
    let dashboard = yield dashboardApi.get(getDashboardKey(accountId), DASHBOARD_CONTAINER);
    if (dashboard) {
        dashboard = yield dashboardApi.create({
            version: dashboard.version,
            container: DASHBOARD_CONTAINER,
            key: getDashboardKey(accountId),
            value: {
                customer: {
                    id: accountId,
                    typeId: 'customer',
                },
                widgets,
            },
        });
    }
    else {
        throw new Error('dashboard does not exist');
    }
    const response = {
        statusCode: 200,
        sessionData: request.sessionData,
    };
    return response;
});
exports.updateDashboard = updateDashboard;
//# sourceMappingURL=DashboardController.js.map