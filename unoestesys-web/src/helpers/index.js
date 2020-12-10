const _31days = [0, 2, 4, 6, 7, 9, 11]
const _months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export const getYear = targetYear => {
    let year = []

    for (let month = 0; month < 12; month++) {
        let months = []
        let maxDay

        if (_31days.includes(month))
            maxDay = 31
        else if (month === 1)
            // eslint-disable-next-line
            maxDay = targetYear % 4 === 0 && targetYear % 100 !== 0 || targetYear % 400 === 0 ? 29 : 28
        else
            maxDay = 30

        for (let day = 0; day < maxDay; day++) {
            let date = new Date(_months[month] + " " + (day + 1) + ", " + targetYear + " 00:00:00")
            months.push({ weekday: date.getDay(), day: date.getDate() })
        }

        year.push({ month, days: months })
    }

    return year
}

const defaultyear = getYear(new Date(Date.now()).getFullYear())

const getMonth = (targetmonth, targetyear = null) => {
    let year = targetyear ? getYear(targetyear)[targetmonth].days : defaultyear[targetmonth].days
    let month = []
    let weeks = []

    for (let i = 0; i < year.length; i++) {
        if (year[i].weekday > 0 && weeks.length === 0) {
            let j = 0
            while (j !== year[i].weekday) {
                weeks.push(null)
                j++
            }
        }

        weeks.push(year[i])

        if (year[i].weekday === 6) {
            month.push(weeks)
            weeks = []
        }
    }

    if (weeks.length > 0) {
        while (weeks.length < 7)
            weeks.push(null)
        month.push(weeks)
    }

    return month
}

export const parseJWT = token => {
    if (token) {
        let base64URL = token.split(".")[1]
        let base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/")
        let jsonPayload = decodeURIComponent(atob(base64).split("").map(c => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(""))

        return JSON.parse(jsonPayload)
    } else return null
}

export default getMonth