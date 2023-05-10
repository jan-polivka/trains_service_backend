export const getTodayDDMMYY = (date: Date): string => {
    const dateMonth = (date.getMonth() + 1).toString()
    const month = parseInt(dateMonth) < 10 ? "0" + dateMonth : dateMonth
    const year = date.getFullYear().toString().slice(-2)
    return date.getDate().toString() + month + year
}