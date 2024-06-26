import { html } from "../lib/lit-html.js";
import { backBtn, collectData, onBlur, onFocus, updateNumbers } from "../util.js";

export function showCreate(ctx) {
    ctx.render(createTemplate(ctx));
}

function createTemplate(ctx) {
    return html`
    ${backBtn()}
    <section id="create">
        <article class="narrow">
            <header class="pad-med">
                <h1>New refuel</h1>
            </header>
            <form  id="create-form" class="main-form pad-small" @submit=${(ev) => collectData(ev, ctx, "create")}>
                <div id="onError" class="error"></div>
                <label>Odometer (km): <input class="form-label" type="text" name="odoCounter" value="0" @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Fuel (Liters): <input id="fuelLiters" class="form-label" type="text" name="fuelLiters" value="0" @keyup=${(ev) => updateNumbers(ev)} @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Fuel type: 
                    <select class="form-options" name="options">
                        <option disabled selected>Select fuel</option>
                        <option value="LPG">LPG</option>
                        <option value="95">95</option>
                        <option value="98">98</option>
                        <option value="100">100</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Premium Diesel">Premium Diesel</option>
                    </select>
                </label>
                <label>Fuel price per liter: <input id="pricePerLiter" class="form-label" type="text" name="fuelPricePerLiter" value="0" @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Total cost (лв.): <input id="totalCost" class="form-label" type="text" name="totalCost" value="0" @keyup=${(ev) => updateNumbers(ev)} @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Date:<input id="date" class="form-label" type="date" name="date" value=${new Date()}></label>
                <label>Full tank: <input class="form-checkbox" type="checkbox" name="fullTank"><p class="details">Note: It is not possible to accurately calculate average fuel per 100km for partially full tank refuels</p></label>
                <input class="action cta" type="submit" value="Add refuel">
            </form>
        </article>
    </section>`
}
