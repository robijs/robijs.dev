// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools may break this file.

import { } from '../../Robi/Robi.js'
import { Row } from '../../Robi/RobiUI.js'

// @START-Stop
export default async function Stop({ parent }) {
    // @START-Rows
    Row(async (parent) => {
        const component = /*html*/ `
            <div>
                <strong>Look. </strong> My friend. Here's the thing. You shouldn't use Robi.js.
            </div>
            <br/>
            <div>
                <strong>No, this isn't reverse psychology.</strong> It's a fact. It's old, opinionated, and exists because I didn't know how else to build single-page apps for SharePoint 2013 at the time.
            </div>
            <br/>
            <div>
                <strong>Seriously.</strong> Don't use it.
            <div>
            <br/>
            <div>
                <strong>I'm still proud of it though.</strong> It solved a problem. I had fun building it.
            </div>
            <br/>
            <div>
                <a href="https://github.com/robijs/robijs.dev">Check out the source</a> if you're curious.
            </div>
        `;

        parent.append(component);
    }, { parent });
    // @END-Rows
}
// @END-Stop
