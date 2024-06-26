import { clearSessionStorage, setSessionStorage } from "../util.js";
import { post } from "./api.js";

const endpoints = {
    logout: "/logout"
}
export async function registerUser(password, username, email) {
    const { objectId, sessionToken } = await post("/users", { password, username, email });

    const userData = {
        objectId,
        email,
        username,
        sessionToken
    };

    setSessionStorage(userData);
}

export async function loginUser(email, password) {
    const { username, objectId, sessionToken } = await post("/login", { email, password });
    
    const userData = {
        objectId,
        email,
        username,
        sessionToken
    };

    setSessionStorage(userData);
}

export async function logoutUser(ctx) {
    try {
        await post(endpoints.logout);
    } catch (err) {
        console.log(err);
    } finally {
        clearSessionStorage();
        ctx.page.redirect("/");
    }
}
