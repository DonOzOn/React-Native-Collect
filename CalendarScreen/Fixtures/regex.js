const reg = /^\d+$/;

export const checkNumber = (str) => {
    return str.trim().match(reg)
}