import './injections/Welcome' // ? Inject welcome
import './injections/Posts' // ? Inject all posts
import './injections/ProfilePage' // ? Inject to ProfilePage
import './tasks' // ? AutomatedTabTask Run tasks when invoked by background page

import * as HoloflowsKit from '@holoflows/kit'
Object.assign(window, HoloflowsKit)
