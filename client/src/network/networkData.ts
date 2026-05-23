export type UserData = {
    name: string,
    email: string,
    username: string
}

export type ModifyUserData = UserData & {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export type Registration = UserData & {
    password: string
}

export const UNLOADED_USER: UserData = {
    name: "",
    email: "",
    username: ""
}

export const UNLOADED_MODIFY_USER: ModifyUserData = {
    ...UNLOADED_USER,
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
}