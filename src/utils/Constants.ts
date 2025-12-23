import {AccountData} from "../pages/accounts/AccountManager.tsx";

export const Pages = {
    HomePage: "/",
    ProfilePage: "/profile",
    AccountManager: "/account",
    TrackerPage: "/tracker",
    LoginPage: "login",
    RegisterPage: "register",
    ForgotPage: "forgot",
}

export const Requests = {
    CreateAccount: "createAccount",
    ValidateUsername: "validateUsername",
    SignIn: "signIn",
    ForgotPassword: "forgotPassword",
    ResetPassword: "resetPassword",
    Form: "form",
    ValidSession: "validSession",
    ModifyForm: "modifyForm"
}

export const NoAccount: AccountData = {
    id: -1,
    name: "",
    accessToken: "",
}