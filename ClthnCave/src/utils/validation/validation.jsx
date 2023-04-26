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
        if (!res.length) {
            console.log(res)
            err.displayNameEmail = 'Your username or email do not exist!'
        }
        else {
            err.displayNameEmail = ""
        }
    }
    else {
        const res = await conditionDataQuery('users', 'displayName', 'in', val.displayNameEmail)
        if (!res.length) {
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

export const productValidation = (data, err) => {
    if (data.title.length < 3) {
        err.title = "The title is too short"
    }
    else if (!checkFirstLetter(data.title)) {
        err.title = "The title should start with a capital letter"
    }
    else {
        err.title = ""
    }
    if (data.description.length < 10) {
        err.description = "The description is too short"
    }
    else {
        err.description = ""
    }
    if (Number(data.price) < 1) {
        err.price = "The price is invalid!"
    }
    else {
        err.price = ""
    }
    if (!data.imageUrls.length) {
        err.imageUrls = "Upload picture(s) for this product!"
    }
    else {
        err.imageUrls = ""
    }
    if (Array.from(data.sizes).length === 0) {
        err.sizes = "Please select a size(s) for your product!"
    }
    else {
        err.sizes = ""
    }

    return err
}

export const checkoutValidation = (data, err) => {
    if (data.name.length < 3) {
        err.name = "Your name is too short!"
    }
    else if (!checkFirstLetter(data.name)) {
        err.name = 'Your name must start with a capital letter!'
    }
    else {
        err.name = ""
    }
    if (data.address.length < 5) {
        err.address = "Your address is invalid!"
    }
    else if (!/\d/.test(data.address)) {
        err.address = "Your address is invalid!"
    }
    else {
        err.address = ""
    }
    if (data.phone.length !== 9) {
        err.phone = "Your phone is invalid!"
    }
    else {
        err.phone = ""
    }
    if (!data.email.match(/@/)) {
        err.email = "The email is invalid!"
    }
    else {
        err.email = ""
    }
    if (data.city.length < 2) {
        err.city = "The city is invalid!"
    }
    else if (!checkFirstLetter(data.name)) {
        err.city = "The city must start with a capital letter!"
    }
    else {
        err.city = ""
    }
    if (data.postcode.length == 0) {
        err.postcode = "The postcode length is invalid!"
    }
    else if (!/\d/.test(data.postcode)) {
        err.postcode = "The postcode is invalid!"
    }
    else {
        err.postcode = ""
    }

    return err
}

export const productValidate = (data, err) => {
    const { quantity, size } = data

    if (quantity === 0) {
        err.quantity = "Please select a quantity for this product!"
    }
    else {
        err.quantity = ""
    }
    if (size === '') {
        err.size = "Please select a size for this product!"
    } else {
        err.size = ""
    }

    return err
}
