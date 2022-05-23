// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools may break this file.

import { GetArticle } from '../../Robi/Robi.js'
import { Row } from '../../Robi/RobiUI.js'

// @START-${name}
export default async function GettingStarted({ parent }) {
    // @START-Rows
    Row(async (parent) => {
        const md = await GetArticle({
            route: 'GettingStarted',
            name: 'Test'
        });
        
        parent.append(md);
    }, { parent });
    // @END-Rows
}
// @END-${name}