import { expect, test } from '@jest/globals'
import { loadConfig } from './config_loader'

test("yaml file parsing", async () => {
    const result = await loadConfig("config_test.yaml")
    expect(result.mail.host).toBe("smtp.fakeserver.org")
})