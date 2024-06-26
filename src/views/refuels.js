import { html } from "../lib/lit-html.js";
import { repeat } from "../lib/directives/repeat.js";
import { until } from "../lib/directives/until.js";
import { deleteById, getAll } from "../data/vehicle.js"
import { calculateMileage, displayImage } from "../util.js";

export async function showRefuels(ctx) {
    ctx.render(until(renderRefuels(ctx), html`<h2>Loading &hellip;</h2>`))
}

async function renderRefuels(ctx) {
    const { results: refuels } = await getAll();
    const refuelsWithMileage = calculateMileage(refuels);
    return html`
    ${refuelBtnTemplate()}
    ${repeat(refuelsWithMileage.reverse(), el => el.id, r => refuelTemplate(r, ctx))}`;
}

function refuelTemplate(r, ctx) {
    return html`
    <article class="layout">
        <img src=${displayImage(r.fuelType)} class="fuel-img left-col">
        <div class="preview">
            <span class="details">
                <p>${new Date(r.date.iso).toDateString()}</p>
            </span>
            <p>${r.odoCounter} km.</p>
            
            <span class="details">
                <p>${r.fuelLiters} l => ${r.fuelPricePerLiter} лв./l</p>
            </span>
            <p>${r.totalCost} лв.</p>
            <p>${r.mileage}</p>
            <div class="refuel-btns">
                <a href=${"/refuels/" + r.objectId} class="action">Edit refuel</a>
                <a href="javascript:void(0)" class="action" @click=${(ev) => deleteById(ev, ctx, r.objectId)}>Delete refuel</a>
            </div>
        </div>
    </article>`
}

function refuelBtnTemplate() {
    return html`
    <div class="ref-btn">
        <a href="/create" class="action">New refuel</a>
    </div>`;
}

