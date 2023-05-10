import { expect, test } from '@jest/globals'
import { getTodayDDMMYY } from "./utility";

test("getTodayDDMMYY returns today's date as DDMMYY", () => {
    const date = new Date('2023-04-22T06:44:00.298Z')
    const res = getTodayDDMMYY(date)
    expect(res).toBe("220423")
})