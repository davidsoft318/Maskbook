import { batchReplace, regexMatch, regexMatchAll } from '../../../utils/utils'
import { isNil, isNull } from 'lodash-es'

const ICAO9303Checksum = {
    encode: (input: string) => {
        return `${input}${(
            input
                .toUpperCase()
                .replace(/[+=\/]/g, '0')
                .split('')
                .map((d, i) => parseInt(d, 36) * [7, 3, 1][i % 3])
                .reduce(function(l, r) {
                    return l + r
                }) % 19
        )
            .toString(19)
            .toUpperCase()}`
    },
    decode: (input: string) => {
        const content = input.slice(0, input.length - 1)
        const checksum = input.slice(input.length - 1)
        const r = ICAO9303Checksum.encode(content)
        if (checksum === r.slice(r.length - 1)) {
            return content
        } else {
            return null
        }
    },
}

export const twitterEncoding = {
    publicKeyEncoder: (text: string) => `🎭${ICAO9303Checksum.encode(text)}🎭`,
    publicKeyDecoder: (text: string) =>
        (() => {
            const r = regexMatchAll(text, />([\dA-Za-z+=\/]{20,60})</)
            if (isNull(r)) {
                return null
            }
            for (const v of r) {
                const retV = ICAO9303Checksum.decode(v)
                if (isNull(retV)) {
                    continue
                }
                return retV
            }
            return null
        })(),
    payloadEncoder: (text: string) =>
        `https://google.com/${batchReplace(text, [['🎼', '%20'], [':||', '%40'], ['+', '-'], ['=', '_'], ['|', '.']])}`,
    payloadDecoder: (text: string) => {
        let r = regexMatch(text, /https:\/\/google\.com\/%20(.+)%40/, 1)
        if (isNil(r)) {
            return 'null'
        }
        r = batchReplace(r, [['-', '+'], ['_', '='], ['.', '|']])
        return `🎼${r}:||`
    },
}

/**
 * this method tries to find every anchor element inside node with title attribute.
 * It's related to payloadDecoder.
 */
export const postContentParser = (node: HTMLElement) => {
    const contentRoot = node.querySelectorAll<HTMLAnchorElement>('a')
    let sto = ''
    for (const v of contentRoot) {
        sto = sto.concat(`${v.title} `)
    }
    return sto
}
