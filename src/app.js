// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Start } from './Robi/Robi.js'

// @START-Imports:Routes
import GettingStarted from './Routes/GettingStarted/GettingStarted.js'
// @END-Imports:Routes

// @START
Start({
    // Routes are directly addressable. Ex: https://site#path.
    routes: [
        // @START-Routes        
        // @START-GettingStarted
        {
            path: 'GettingStarted',
            title: 'Getting Started',
            icon: 'bs-arrow-right-circle-fill',
            go: GettingStarted
        }
        // @END-GettingStarted
        // @END-Routes
    ],
    settings: {
        // @START-Settings
        name: /* @START-name */'Robi.js'/* @END-name */,
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        theme: /* @START-theme */'Purple'/* @END-theme */,
        title: /* @START-title */'Robi.js'/* @END-title */,
        appcontainer: null,
        maincontainer: null,
        sidebar: null,
        autoCollapseWidth: 1285
        // @END-Settings
    }
});
// @END
