import { until } from "../lib/directives/until.js";
import { html, nothing } from "../lib/lit-html.js";
import { parseData, parseFuelTypes, refuelsTemplate } from "../util.js";

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
