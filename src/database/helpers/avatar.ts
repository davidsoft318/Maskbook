import { PersonIdentifier, GroupIdentifier } from '../type'
import { queryAvatarDB, isAvatarOutdatedDB, storeAvatarDB } from '../avatar'
import { memoizePromise } from '../../utils/memoize'

/**
 * Get a (cached) blob url for an identifier.
 * ? Because of cross-origin restrictions, we cannot use blob url here. sad :(
 */
export const getAvatarDataURL = memoizePromise(
    async function(identifier: PersonIdentifier | GroupIdentifier): Promise<string | undefined> {
        const buffer = await queryAvatarDB(identifier)
        if (!buffer) throw new Error('Avatar not found')
        return ArrayBufferToBase64(buffer)
    },
    id => id.toText(),
)
function ArrayBufferToBase64(buffer: ArrayBuffer) {
    const f = new Blob([buffer], { type: 'image/png' })
    const fr = new FileReader()
    return new Promise<string>(resolve => {
        fr.onload = () => resolve(fr.result as string)
        fr.readAsDataURL(f)
    })
}

/**
 * Store an avatar with a url for an identifier.
 * @param avatar - Avatar to store. If it is a string, will try to fetch it.
 * @param identifier - This avatar belongs to.
 */

export async function storeAvatar(identifier: PersonIdentifier | GroupIdentifier, avatar: ArrayBuffer | string) {
    if (identifier instanceof PersonIdentifier && identifier.isUnknown) return
    try {
        if (typeof avatar === 'string') {
            if (avatar.startsWith('http') === false) return
            if (await isAvatarOutdatedDB(identifier, 'lastUpdateTime')) {
                await storeAvatarDB(identifier, await downloadAvatar(avatar))
            }
            // else do nothing
        } else {
            await storeAvatarDB(identifier, avatar)
        }
    } catch (e) {
        console.error('Store avatar failed', e)
    }
}
/**
 * Download avatar from url
 */
async function downloadAvatar(url: string): Promise<ArrayBuffer> {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Fetch avatar failed.')
    return res.arrayBuffer()
}
