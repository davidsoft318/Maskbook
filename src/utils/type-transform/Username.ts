import { geti18nString } from '../i18n'
import { PersonIdentifier, GroupIdentifier, PostIdentifier } from '../../database/type'

/**
 * @see https://www.facebook.com/help/105399436216001#What-are-the-guidelines-around-creating-a-custom-username?
 * @unstable
 * ! Start to use this in a breaking change!
 */
export function regularUsername(name: string) {
    if (!name) return null
    // Avoid common mistake
    if (name === 'photo.php') return null
    const n = name.toLowerCase().replace(/\./g, '')
    if (n.match(/^[a-z0-9]{5,}$/)) {
        return n
    }
    return null
}
/**
 * Normalize post url
 */
export function getPostUrlAtFacebook(post: PostIdentifier<PersonIdentifier>) {
    const id = post.identifier
    const { postId } = post
    const { userId } = id
    if (!regularUsername(userId)) throw new TypeError(geti18nString('service_username_invalid'))
    if (parseFloat(userId)) return `https://www.facebook.com/permalink.php?story_fbid=${postId}&id=${userId}`
    return `https://www.facebook.com/${userId}/posts/${postId}`
}
/**
 * Normalize profile url
 */
export function getProfilePageUrlAtFacebook(user: PersonIdentifier | GroupIdentifier) {
    // TODO:
    if (user instanceof GroupIdentifier) throw new Error('Not implemented')
    if (user.network !== 'facebook.com') throw new Error('Not implemented')
    const username = user.userId
    if (!regularUsername(username)) throw new TypeError(geti18nString('service_username_invalid'))
    if (parseFloat(username)) return `https://www.facebook.com/profile.php?id=${username}`
    return `https://www.facebook.com/${username}?fref=pymk`
}
