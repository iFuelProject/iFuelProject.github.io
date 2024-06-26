import { loginUser, registerUser } from "./data/user.js";
import { create, getAll, getById, update } from "./data/vehicle.js";
import { html, render, nothing } from "./lib/lit-html.js";

const root = document.querySelector("main");
const header = document.querySelector("header");
const greetingDiv = document.querySelector("div.greeting");

export function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    next();
}

export function updateNavbar(ctx, next) {
    render(html`
    <nav>
        ${sessionStorage.userData == undefined
            ? html`
        <a href="/login" class="action">Login</a>
        <a href="/register" class="action">Register</a>
        `
            : html`
        <a href="/stats" class="action user">Stats</a>
        <a href="/refuels" class="action user">Refuels</a>
        <a href="/logout" class="action user">Logout</a>`}
    </nav>`, header);

    next();
}

export function updateGreeting(ctx, next) {
    const userData = getSessionStorage();
    render(html`${userData ? html`<p class="greeting-p">Hello, ${userData.username}!</p>` : nothing}`, greetingDiv);
    next();
}

export function addSession(loadData) {
    return function (ctx, next) {
        const userData = loadData();
        if (userData) {
            ctx.userData = userData;
        }
        next();
    };
}

export function pageGuard(ctx, next) {
    if (!ctx.userData) {
        ctx.page.redirect("/login");
    } else {
        next();
    };
}

export function preload(param) {
    return async function (ctx, next) {
        const id = ctx.params[param];

        if (id) {
            const data = await getById(id);
            ctx.data = data;
        }
        next();
    }
}

export function setSessionStorage(data) {
    sessionStorage.setItem("userData", JSON.stringify(data));
}

export function getSessionStorage() {
    return JSON.parse(sessionStorage.getItem("userData"));
}

export function clearSessionStorage() {
    sessionStorage.removeItem("userData");
}

export function createPointer(className, objectId) {
    return { __type: 'Pointer', className, objectId };
}

export function addOwner(record, ownerId) {
    const data = Object.assign({}, record);
    data.ownerId = createPointer('_User', ownerId);

    return data;
}

export function displayErrMsg(message) {
    const errField = document.getElementById("onError");
    errField.textContent = message;
}

export function backBtn() {
    return html`
    <div class="ref-btn">
        <a href="/refuels" class="action">Go back</a>
    </div>`;
}

export function updateNumbers() {
    const pricePerLiterField = document.getElementById("pricePerLiter");
    const fuelLitersField = document.getElementById("fuelLiters");
    const totalCostField = document.getElementById("totalCost");

    const totalCost = Number(totalCostField.value);
    const fuelLiters = Number(fuelLitersField.value);

    if (isNaN(totalCost) || isNaN(fuelLiters) || fuelLiters === 0) {
        pricePerLiterField.value = 0;
    } else {
        pricePerLiterField.value = (totalCost / fuelLiters).toFixed(2);
    };
}

export function onFocus(ev) {
    if (ev.target.value == "0") {
        ev.target.value = "";
    };
}

export function onBlur(ev) {
    if (ev.target.value == "") {
        ev.target.value = "0";
    };
}

export async function collectData(ev, ctx, method, vehicleId) {
    ev.preventDefault();

    let { fuelLiters, fuelPricePerLiter, fullTank, odoCounter, options, totalCost, date } = Object.fromEntries(new FormData(ev.target));

    fuelLiters = Number(fuelLiters);
    fuelPricePerLiter = Number(fuelPricePerLiter);
    odoCounter = Number(odoCounter);
    totalCost = Number(totalCost);
    fullTank == "on" ? fullTank = true : fullTank = false;
    date = { __type: "Date", iso: new Date(date) };
    date.iso == "Invalid Date" ? date = undefined : nothing;

    const fuelType = options;
    
    if (odoCounter && fuelLiters && options && fuelPricePerLiter && totalCost && date) {
        const userData = ctx.userData;
        const userId = userData.objectId;
        
        if (method == "edit") {
            await update(vehicleId, { odoCounter, fuelLiters, fuelType, fuelPricePerLiter, totalCost, fullTank, date }, userId);
        } else if (method == "create") {
            await create({ odoCounter, fuelLiters, fuelType, fuelPricePerLiter, totalCost, fullTank, date }, userId);
        }
        Array.from(ev.target).forEach(el => el.disabled = true);
        ctx.page.redirect("/refuels");
    } else {
        displayErrMsg("Please Fill All Fields");
    };
}

export async function collectRegisterData(ev, ctx) {
    ev.preventDefault();
    const { email, password, repass, username } = Object.fromEntries(new FormData(ev.target));

    if (email === "" || username === "" || password === "") {
        displayErrMsg("Please fill all fields");
    } else if (password !== repass) {
        displayErrMsg("Passwords don\'t match")
    } else {
        try {
            await registerUser(password, username, email);
            ctx.page.redirect("/");
        } catch (err) {
            displayErrMsg(err.message);
        }
    }
}

export async function collectLoginData(ev, ctx) {
    ev.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(ev.target));

    if (email === "" || password === "") {
        displayErrMsg("Email or password cannot be empty");
    } else {
        try {
            await loginUser(email, password);
            ctx.page.redirect("/");
        } catch (err) {
            displayErrMsg(err);
        }
    }
}

export function displayImage(fuelType) {
    const collection = {
        "95": "../images/fuelPump95.svg",
        "98": "../images/fuelPump98.svg",
        "100": "../images/fuelPump100.svg",
        "Diesel": "../images/fuelPumpDiesel.svg",
        "Premium Diesel": "../images/fuelPumpPremiumDiesel.svg",
        "LPG": "../images/fuelPumpLPG.svg",
    }
    if (collection[fuelType] == undefined) {
        return "../images/fuelPumpDefault.svg";
    } else {
        return collection[fuelType];
    }
}

export function calculateMileage(refuels) {
    if (refuels.length === 0) {
        return [];
    }

    const sortedRefuels = [...refuels].sort((a, b) => a.odoCounter - b.odoCounter);
    let fuelTypes = {};
    let totalDistance = 0;

    return sortedRefuels.map((currentRefuel) => {
        let mileage = "";
        const { fuelType: currFuel, fullTank, odoCounter, fuelLiters } = currentRefuel;

        if (!fuelTypes[currFuel]) {
            fuelTypes[currFuel] = { previousFullRefuel: null, totalDistance: 0 };
        }

        if (!fullTank) {
            mileage = "Partially refueled";
        } else {
            const { previousFullRefuel } = fuelTypes[currFuel];

            if (previousFullRefuel) {
                const distance = odoCounter - previousFullRefuel.odoCounter;
                fuelTypes[currFuel].totalDistance += distance;

                if (distance > 0) {
                    const fuelUsed = fuelLiters;
                    const litersPer100km = (fuelUsed / distance) * 100;
                    mileage = `${litersPer100km.toFixed(2)} L/100km`;
                } else {
                    mileage = "Partially refueled";
                }
            } else {
                mileage = "First full refuel";
            }
            fuelTypes[currFuel].previousFullRefuel = currentRefuel;
        }
        totalDistance += odoCounter - (fuelTypes[currFuel].previousFullRefuel ? fuelTypes[currFuel].previousFullRefuel.odoCounter : odoCounter);

        return {
            ...currentRefuel,
            mileage
        }
    })
}

export async function parseFuelTypes() {
    const { results: refuels } = await getAll();

    if (refuels.length > 0) {
        const fuel95 = [];
        const fuel98 = [];
        const fuel100 = [];
        const fuelDiesel = [];
        const fuelPremiumDiesel = [];
        const fuelLPG = [];
    
        refuels.forEach(r => {
            switch (r.fuelType) {
                case "95": fuel95.push(r); 
                    break;
                case "98": fuel98.push(r); 
                    break;
                case "100": fuel100.push(r); 
                    break;
                case "Diesel": fuelDiesel.push(r); 
                    break;
                case "Premium Diesel": fuelPremiumDiesel.push(r); 
                    break;
                case "LPG": fuelLPG.push(r); 
                    break;
            };
        });

        return { fuel95, fuel98, fuel100, fuelDiesel, fuelPremiumDiesel, fuelLPG };
    }
}

export function parseData(refuels) {
    const refuelsThisMonth = getDateRangeRefuels(refuels, "thisMonth");
    const refuelsPrevMonth = getDateRangeRefuels(refuels, "prevMonth");
    const refuelsThisYear = getDateRangeRefuels(refuels, "thisYear");
    const refuelsPrevYear = getDateRangeRefuels(refuels, "prevYear");

    const { fuelSpent: fuelSpentThisMonth, refuels: refuelsCountThisMonth } = calcTimePeroidStats(refuelsThisMonth);
    const { fuelSpent: fuelSpentPreviousMonth, refuels: refuelsCountPreviousMonth } = calcTimePeroidStats(refuelsPrevMonth);
    const { fuelSpent: fuelSpentThisYear, refuels: refuelsCountThisYear } = calcTimePeroidStats(refuelsThisYear);
    const { fuelSpent: fuelSpentPreviousYear, refuels: refuelsCountPreviousYear } = calcTimePeroidStats(refuelsPrevYear);
    const { fuelSpentTotal, refuelsTotal } = calcTimePeroidStats(refuels);

    let avgFuelCon = calcAvgFuelEcon(refuels);
    if (Number.isNaN(Number(avgFuelCon))) {
        avgFuelCon = "--";
    };

    const data = {
        fuelSpentThisMonth, refuelsCountThisMonth, fuelSpentPreviousMonth,
        refuelsCountPreviousMonth, fuelSpentThisYear, refuelsCountThisYear,
        fuelSpentPreviousYear, refuelsCountPreviousYear, fuelSpentTotal,
        refuelsTotal, avgFuelCon
    };

    return data;
}

export function calcTimePeroidStats(refuelsPeriod) {
    let fuelSpent = 0;
    let refuels = 0;

    refuelsPeriod.forEach(r => {
        fuelSpent += r.fuelLiters;
        refuels++;
    });
    return { fuelSpent, refuels };
}

export function calcAvgFuelEcon(refuels) {
    let totalFuelEcon = 0;
    let refuelsCount = 0;
    const refuelsWithMileage = calculateMileage(refuels);

    refuelsWithMileage.forEach(r => {
        let curr = Number(r.mileage.split(" L/100km")[0]);
        if (!Number.isNaN(curr)) {
            totalFuelEcon += curr;
            refuelsCount++;
        };
    });
    const avgFuelCon = totalFuelEcon / refuelsCount;

    return avgFuelCon.toFixed(2);
}

export function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getDateRangeRefuels(arr, range) {
    let start, end;

    if (range == "thisMonth") {
        ({ start, end } = calcThisMonth());
    } else if (range == "prevMonth") {
        ({ start, end } = calcPrevMonth());
    } else if (range == "thisYear") {
        ({ start, end } = calcThisYear());
    } else if (range == "prevYear") {
        ({ start, end } = calcPrevYear());
    };

    const filteredArr = arr.filter(item => {
        const itemDate = new Date(item.date.iso);
        return itemDate >= start && itemDate <= end;
    });

    return filteredArr;
}

export function calcThisMonth() {
    let start = new Date();
    start.setDate(1);
    let end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);

    return { start, end };
}

export function calcPrevMonth() {
    let start = new Date();
    start.setMonth(start.getMonth() - 1);
    start.setDate(1);
    let end = new Date();
    end.setDate(0);

    return { start, end };
}

export function calcThisYear() {
    let start = new Date(new Date().getFullYear(), 0, 1);
    let end = new Date();

    return { start, end };
}

export function calcPrevYear() {
    let start = new Date(new Date().getFullYear() - 1, 0, 1);
    let end = new Date(new Date().getFullYear() - 1, 11, 31);
    
    return { start, end };
}