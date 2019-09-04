import { MessageCenter as MC } from '@holoflows/kit/es'
import { Person } from '../database'
import Serialization from './type-transform/Serialization'

interface UIEvent {
    closeActiveTab: undefined
}
interface KeyStoreEvent {
    newPerson: Person
    generateKeyPair: undefined
    identityUpdated: undefined
}
export interface TypedMessages extends UIEvent, KeyStoreEvent {}
export const MessageCenter = new MC<TypedMessages>('maskbook-events')
MessageCenter.serialization = Serialization
