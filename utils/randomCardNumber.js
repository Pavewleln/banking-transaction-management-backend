export const randomCardNumber = () => {
    return Math.floor(Math.random() * (9999999999999999 - 1000000000000000 + 1) + 100)
}