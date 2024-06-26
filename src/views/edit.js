import { html, nothing } from "../lib/lit-html.js";
import { backBtn, collectData, formatDate, onBlur, onFocus, updateNumbers } from "../util.js";

export function showEditRefuel(ctx) {
    ctx.render(editTemplate(ctx));
}

function editTemplate(ctx) {
    const r = ctx.data;

    return html` 
    ${backBtn()}
    <section id="edit">
        <article class="narrow">
            <header class="pad-med">
                <h1>Edit Refuel</h1>
            </header>
            <form id="edit-form" class="main-form pad-small" @submit=${(ev) => collectData(ev, ctx, "edit", ctx.params.id)}>
                <div id="onError" class="error"></div>
                <label>Odometer: <input class="form-label" type="text" name="odoCounter" .value=${r.odoCounter} @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Fuel (Liters): <input id="fuelLiters" class="form-label" type="text" name="fuelLiters" .value=${r.fuelLiters} @keyup=${(ev) => updateNumbers(ev)} @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Fuel type: 
                    <select class="form-options" name="options">
                        <option selected=${r.fuelType == "LPG" ? true : nothing} value="LPG" >LPG</option>
                        <option selected=${r.fuelType == "95" ? true : nothing} value="95">95</option>
                        <option selected=${r.fuelType == "98" ? true : nothing} value="98">98</option>
                        <option selected=${r.fuelType == "100" ? true : nothing} value="100">100</option>
                        <option selected=${r.fuelType == "Diesel" ? true : nothing} value="Diesel">Diesel</option>
                        <option selected=${r.fuelType == "Premium Diesel" ? true : nothing} value="Premium Diesel">Premium Diesel</option>
                    </select>
                </label>
                <label>Fuel price per liter: <input id="pricePerLiter" class="form-label" type="text" name="fuelPricePerLiter" .value=${r.fuelPricePerLiter} @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Total cost: <input id="totalCost" class="form-label" type="text" name="totalCost" .value=${r.totalCost} @keyup=${(ev) => updateNumbers(ev)} @focus=${(ev) => onFocus(ev)} @blur=${(ev) => onBlur(ev)}></label>
                <label>Date:<input id="date" class="form-label" type="date" name="date" .value=${formatDate(r.date.iso)}></label>
                <label>Full tank: 
                    <input class="form-checkbox" type="checkbox" name="fullTank" .checked=${r.fullTank}>
                    <p class="details">Note: It is not possible to accurately calculate average fuel per 100km for partially full tank refuels</p>
                </label>
                <input class="action cta" type="submit" value="Save changes">
            </form>
        </article>
    </section>`
}


