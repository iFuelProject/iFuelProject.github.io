import { addOwner, getSessionStorage } from "../util.js";
import { del, get, post, put } from "./api.js"

const endpoints = {
    refuelsByUser: (query) => `/classes/Car?where=${query}`,
    createRefuel: `/classes/Car`,
    refuelsById: `/classes/Car/`
}

export async function getAll() {
    const { objectId: userId } = getSessionStorage();
    const query = encodeURIComponent(JSON.stringify({ ownerId: { "__type": "Pointer", "className": "_User", "objectId": userId }}));
    return get(endpoints.refuelsByUser(query));
}

export async function getById(id) {
    return get(endpoints.refuelsById + id);
}

export async function create(vehicleData, userId) {
    return post(endpoints.createRefuel, addOwner(vehicleData, userId));
}

export async function update(vehicleId, vehicleData, userId) {
    return put(endpoints.refuelsById + vehicleId, addOwner(vehicleData, userId));
}

export async function deleteById(ev, ctx, id) {
    ev.preventDefault();
    if (confirm("Are you sure you want to delete the refuel?\nThis action cannot be undone!")) {
        await del(endpoints.refuelsById + id);
        ctx.page.redirect("/refuels");
    };
}

