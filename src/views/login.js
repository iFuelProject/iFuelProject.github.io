import { html } from "../lib/lit-html.js";
import { collectLoginData } from "../util.js";

export function showLogin(ctx) {
    ctx.render(loginTemplate(ctx));
}

function loginTemplate(ctx) {
    return html`
    <article class="narrow">
        <header class="pad-med">
            <h1>Login User</h1>
        </header>
        <form class="main-form pad-large" @submit=${(ev) => collectLoginData(ev, ctx)}> 
        <div id="onError" class="error"></div>
           <label>E-mail: <input type="text" name="email"></label>
           <label>Password: <input type="password" name="password"></label>
           <input type="submit" class="action cta" value="Login" />  
        </form>
        <footer class="pad-small">Don't have an account? 
            <a href="/register" class="invert">Sign up here</a>
        </footer>
    </article>
    `
}
