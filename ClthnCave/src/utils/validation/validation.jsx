import { conditionDataQuery } from "../firebase/firebase.utils";

export const validate = (val, err) => {
    var r = /\d+/;

    if (val.displayName.length < 6) {
        err.displayName = "The username you typed is too short"
    }
    else if (/[^a-zA-Z0-9\-\/]/.test(val.displayName)) {
        err.displayName = "The username should not consist special characters!"
    }
    else {
        err.displayName = ""
    }
    if (val.email.length < 10) {
        err.email = "The email you typed is too short"
    } else {
        err.email = ""
    }
    if (val.password.length < 8) {
        err.password = "The password should be 8 or more characters!"
        val.confirmPassword = ""
    }
    else if (checkFirstLetter(val.password) === false) {
        err.password = "The password should consist a capital letter"
        val.confirmPassword = ""
    }
    else if (val.password.match(r) === null) {
        err.password = "The password should consist a number!"
        val.confirmPassword = ""
    }
    else {
        err.password = "";
    }
    if (val.confirmPassword != val.password) {
        err.confirmPassword = "The passwords do not match!"
    }
    else {
        err.confirmPassword = ""
    }

    return err
}
export const validateSignIn = (val, err) => {
    if (val.email === '') {
        err.email = "Type in your email";
    }
    else if (val.email) {
        err.email = "The email is invalid";
    }
    else if (val.email.length !== 0) {
        err.email = "";
    }
    else {
        err.email = "";
    }
    return err;
}
export const validateQuery = async (val, err) => {
    if (val.displayNameEmail.match(/@/)) {
        const res = await conditionDataQuery('users', 'email', 'in', val.displayNameEmail)
        if (res.length !== 1) {
            err.displayNameEmail = 'Your username or email do not exist!'
        }
        else {
            err.displayNameEmail = ""
        }
    }
    else {
        const res = await conditionDataQuery('users', 'displayName', 'in', val.displayNameEmail)
        if (res.length !== 1) {
            err.displayNameEmail = 'Your display name or email do not exist!'
        }
        else {
            err.displayNameEmail = ""
        }
    }

    return err
}
export const validatePassword = (val, err) => {
    var r = /\d+/;
    if (val.password.length < 8) {
        err.password = "The password should be 8 or more characters!"
        val.confirmPassword = ""
    }
    else if (checkFirstLetter(val.password) === false) {
        err.password = "The password should consist a capital letter"
        val.confirmPassword = ""
    }
    else if (val.password.match(r) === null) {
        err.password = "The password should consist a number!"
        val.confirmPassword = ""
    }
    else {
        err.password = "";
    }
    if (val.confirmPassword != val.password) {
        err.confirmPassword = "The passwords do not match!"
    }
    else {
        err.confirmPassword = ""
    }
    return err;
}


const checkFirstLetter = (str) => {
    const strTest = str.charAt(0).toUpperCase() + str.slice(1)
    if (strTest === str) {
        return true
    }
    else {
        return false
    }
}