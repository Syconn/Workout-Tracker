import {AccountData} from "../pages/accounts/AccountManager.tsx";

export const Pages = {
    HomePage: "/",
    AccountManager: "/account",
    LoginPage: "login",
    RegisterPage: "register",
    ForgotPage: "forgot",
}

export const Requests = {
    CreateAccount: "createAccount",
    ValidateUsername: "validateUsername",
    SignIn: "signIn",
    forgotPassword: "forgotPassword",
    resetPassword: "resetPassword",
}

export const NoAccount: AccountData = {
    id: -1,
    name: "",
    accessToken: "",
}