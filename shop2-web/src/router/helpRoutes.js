import { importComponent } from "./index";
const routes = [
  {
    path: "email-auth",
    name: "email-auth",
    meta: {
      hideInMenu: true
    },
    component: () =>
      importComponent(import(`Views/helps/EmailAuthorizationHelp`))
  }
];

export default routes;
