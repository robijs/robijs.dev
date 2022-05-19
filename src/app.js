// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Start } from './Robi/Robi.js'

// @START-Imports:Routes
import Route_Route from './Routes/Route/Route.js'
// @END-Imports:Routes

// @START
Start({
    // Routes are directly addressable. Ex: https://site#path.
    routes: [
        // @START-Routes
        // @START-Route
        {
            path: 'Route',
            title: 'Route',
            icon: 'bs-app',
            go: Route_Route
        }
        // @END-Route
        // @END-Routes
    ],
    settings: {
        name: /* @START-name */'App'/* @END-name */,
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        theme: /* @START-theme */'Purple'/* @END-theme */,
        title: /* @START-title */'Title'/* @END-title */,
        appcontainer: null,
        maincontainer: null,
        sidebar: null,
        // @END-SETTINGS
    }
});
// @END
