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
                <strong>Robi.js</strong> is a framework for building client-side apps for SharePoint that didn't look like SharePoint.
            </div>
            <br />
            <div>It's old and opinionated. I made it because I didn't know how else to build single-page apps for SharePoint 2013. I didn't know ASP or .NET. I couldn't use a view library for government clients. Some clients didn't have access to upload custom DLLs to the app server or SPFX apps to the App Catalogue.</div>
            <br />
            <div>
                It's full of bugs. I wasn't concerned with performance. I tried to make something that appealed to end users, no-code developers, our hosting teams, and software engineers. I don't think it worked that well for anyone but me.
            </div>
            <br />
            <div>
                I think Robi.js was a failure. It didn't have the impact I wanted it to. I had fun building it though. I made some pretty big and complicated apps with it that solved boring problems.
            </div>
            <br />
            <div>
                Please just use <a href="https://react.dev/">React</a> or whatever view library or app framework your team is using.
            </div>
            <br />
            <div>
                <a href="https://github.com/robijs/robijs.dev">The repo</a> is still available for the curious.
            </div>
        `;

        parent.append(component);
    }, { parent });
    // @END-Rows
}
// @END-Stop
