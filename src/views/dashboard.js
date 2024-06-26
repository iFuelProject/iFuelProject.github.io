import { html } from "../lib/lit-html.js";

export function showDashboard(ctx) {
    return ctx.render(html`
    <div class="pad-small">
    <h1>Welcome to iFuel</h1>
    <p>Your ultimate companion for car refuels and maintenance tracking.</p>
    </div>
    <section id="home">
        <article class="hero layout">
            <img src="../images/bmwe90m3.svg" class="left-col pad-med">
            <div class="pad-med tm-hero-col">
                <div>
                    <h2 class="">Do you wonder if your car is properly maintained?</h2>
                    <p class="">Join our family =)</p>
                    <p class="">Track your expences, distance travelled and maintenance periods!</p>
                    <p class="">Give your car the care it deserves!</p>
                </div>
                ${sessionStorage.getItem("userData")
                ? html`<a href="/stats" class="action cta">Get started</a>`
                : html`<a href="/register" class="action cta">Sign Up Now</a>`}   
            </div>
        </article>
    </section>`);
}
