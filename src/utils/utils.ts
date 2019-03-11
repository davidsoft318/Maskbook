import { Db } from 'typed-db'
import { Newable } from 'typed-db/dist-release/src/db/Db'
import { Store } from 'typed-db/dist-release/src/db/Store'

import 'reflect-metadata'

export const sleep = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time))
export const buildQuery = <Q extends Newable<any>>(db: Db, record: Q) => {
    db.use(record)
    return <T>(
        cb: (tx: Store<InstanceType<Q>>) => Promise<T extends any[] ? T : T | undefined> | void,
        mode: 'readonly' | 'readwrite' = 'readonly',
    ) => db.transaction([record], mode, t => cb(t.for(record)))
}
