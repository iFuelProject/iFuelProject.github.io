import { html } from "../lib/lit-html.js"
import { collectRegisterData } from "../util.js";

export function showRegister(ctx) {
    ctx.render(registerTemplate(ctx))
}

function registerTemplate(ctx) {
    return html`    
    <article class="narrow">
        <header class="pad-med">
            <h1>Register</h1>
        </header>
        <form id="register-form" class="main-form pad-large" @submit=${(ev) => collectRegisterData(ev, ctx)}>
            <div id="onError" class="error"></div>
            <label>E-mail: <input type="text" name="email"></label>
            <label>Username: <input type="text" name="username"></label>
            <label>Password: <input type="password" name="password"></label>
            <label>Repeat: <input type="password" name="repass"></label>
            <input class="action cta" type="submit" value="Create Account">
        </form>
        <footer class="pad-small">Already have an account? 
            <a href="/login" class="invert">Sign in here</a>
        </footer>
    </article>`;
}
