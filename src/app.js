// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Start } from './Robi/Robi.js'

// @START-Imports:Routes
import GettingStarted from './Routes/GettingStarted/GettingStarted.js'
import Test from './Routes/Test/Test.js'
import AnotherRoute2 from './Routes/AnotherRoute2/AnotherRoute2.js'
import Route from './Routes/Route/Route.js'
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
            icon: 'bs-activity',
            go: GettingStarted
        }
        // @END-GettingStarted
        , // @Route        
        // @START-Test
        {
            path: 'Test',
            title: 'Test',
            icon: 'bs-app',
            go: Test
        }
        // @END-Test
        , // @Route        
        // @START-AnotherRoute2
        {
            path: 'AnotherRoute2',
            title: 'Another Route 2',
            icon: 'bs-arrow-down-circle-fill',
            go: AnotherRoute2
        }
        // @END-AnotherRoute2
        , // @Route        
        // @START-Route
        {
            path: 'Route',
            title: 'Route',
            icon: 'bs-arrow-left-cirlce-fill',
            go: Route
        }
        // @END-Route
        // @END-Routes
    ],
    settings: {
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
        // @END-SETTINGS
    }
});
// @END
