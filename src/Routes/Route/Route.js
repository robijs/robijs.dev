// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools may break this file.

import { } from '../../Robi/Robi.js'
import { Row } from '../../Robi/RobiUI.js'

// @START-Route4
export default async function Route({ parent }) {
    // @START-Rows
    Row((parent) => {
        parent.append(/*html*/ `
            <div>Hello, world!</div>
        `);
    }, { parent });
    // @END-Rows
}
// @END-Route4
