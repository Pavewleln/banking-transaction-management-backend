export const dateofCreatedCard = () => {
    return new Date().toLocaleDateString().split('.').slice(0, 2).join('/')
}