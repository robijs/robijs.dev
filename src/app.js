// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Start } from './Robi/Robi.js'

// @START-Imports:Routes
import Route_Stop from './Routes/Stop/Stop.js'
// @END-Imports:Routes

// @START
Start({
    // Routes are directly addressable. Ex: https://site#path.
    routes: [
        // @START-Routes        
        // @START-Stop
        {
            path: 'Stop',
            title: "Hey there",
            icon: 'bs-arrow-right-circle-fill',
            go: Route_Stop
        }
        // @END-Stop
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
        autoCollapseWidth: 940
        // @END-Settings
    }
});
// @END
