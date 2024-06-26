import { default as page } from "./lib/page.mjs";
import { addSession, decorateContext, getSessionStorage, pageGuard, preload, updateGreeting, updateNavbar } from "./util.js";
import { logoutUser } from "./data/user.js";
import { showCreate } from "./views/create.js";
import { showDashboard } from "./views/dashboard.js";
import { showEditRefuel } from "./views/edit.js";
import { showLogin } from "./views/login.js";
import { showRefuels } from "./views/refuels.js";
import { showRegister } from "./views/register.js";
import { showStats } from "./views/stats.js";

page(decorateContext);
page(updateNavbar);
page(updateGreeting);
page(addSession(getSessionStorage));
page("/index.html", "/");
page("/", showDashboard);
page("/refuels", pageGuard, showRefuels);
page("/refuels/:id", pageGuard, preload("id"), showEditRefuel);
page("/create", pageGuard, showCreate);
page("/stats", pageGuard, showStats);
page("/login", showLogin);
page("/register", showRegister);
page("/logout", pageGuard, logoutUser);

page.start();