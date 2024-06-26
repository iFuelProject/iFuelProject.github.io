import { until } from "../lib/directives/until.js";
import { html, nothing } from "../lib/lit-html.js";
import { displayImage, parseData, parseFuelTypes } from "../util.js";

export async function showStats(ctx) {
    return ctx.render(until(renderRefuels(), html`<h2 class="pad-small">Loading refuel stats &hellip;</h2>`));
}

async function renderRefuels() {
    const fuelTypes = await parseFuelTypes();

    if (fuelTypes != undefined) {
        return html`
        <article class="fuel-layout">
            <div class="pad-large">
                <h2 class="center">Refuel statistics</h2>
            </div>
            <p class="details pad-small">Note: Average fuel consumption cannot be accurately calculated if the refuels are not full tank refuels. This is because partial refuels do not provide a consistent measure of fuel usage, leading to inaccurate calculations of liters per 100 kilometers.</p>
            <div class="pad-med fuel-sections">
                ${Object.keys(fuelTypes).map(fuelType => {
            const currFuel = fuelTypes[fuelType];
            if (currFuel.length > 0) {
                const refuelData = parseData(currFuel);

                return refuelsTemplate(refuelData, fuelType.replace("fuel", ""));
            } else {
                return nothing;
            }
        })}
            </div>
        </article>`;
    } else {
        return html`<h2 class="pad-small">Sorry, there aren't any refuels yet! Come back when you add some!</h2>`
    }
}


export function refuelsTemplate(refData, fuelType) {
    refData.fuelSpentPreviousYear = refData.fuelSpentPreviousYear.toFixed(2);
    refData.fuelSpentThisYear = refData.fuelSpentThisYear.toFixed(2);
    refData.fuelSpentThisMonth = refData.fuelSpentThisMonth.toFixed(2);
    refData.fuelSpentPreviousMonth = refData.fuelSpentPreviousMonth.toFixed(2);

    return html`
    <div class="fuel-section">
        <img src="${displayImage(fuelType)}" class="fuel-img">
        <h3>${fuelType}</h3>
        <div class="stats-div">
            <p>${refData.refuelsCountPreviousYear} refuels previous year</p>
            <p>${refData.refuelsCountThisYear} refuels this year</p>
        </div>
        <div class="stats-div">
            <p>${refData.refuelsCountThisMonth} refuels this month</p>
            <p>${refData.refuelsCountPreviousMonth} refuels previous month</p>
        </div>
        <div class="stats-div">
            <h1 class="stats-h1">Fuel spent</h1>
            <p>${refData.fuelSpentPreviousYear} L previous year</p>
            <p>${refData.fuelSpentThisYear} L this year</p>
        </div>
        <div class="stats-div">
            <p>${refData.fuelSpentThisMonth} L this month</p>
            <p>${refData.fuelSpentPreviousMonth} L previous month</p>
        </div>
        <div>
            <h1 class="stats-h1">Average fuel consumption</h1>
            <p class="stats-p">${refData.avgFuelCon} L /100 km.</p>
        </div>
    </div>`;
}