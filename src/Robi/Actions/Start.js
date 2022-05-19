import { AppContainer } from '../Components/AppContainer.js'
import { SvgDefs } from '../Components/SvgDefs.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { AddLinks } from './AddLinks.js'
import { LaunchApp } from './LaunchApp.js'
import { LogError } from './LogError.js'
import { SetTheme } from './SetTheme.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function Start(param) {
    const {
        settings
    } = param;

    const {
        links,
        name,
        theme
    } = settings;

    // Set app settings
    App.settings(param);

    // Set theme
    SetTheme({ name, theme });

    // toTitleCase string method polyfil
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0]?.toUpperCase()))
            .join(' ');
    };

    // Split Camel Case
    String.prototype.splitCamelCase = function () {
        return this.split(/(?=[A-Z])/).join(' ');
    }

    // Start app on page load
    window.onload = async () => {
        // Add links to head
        AddLinks({
            links
        });

        // Add appcontainer
        const appContainer = AppContainer();

        // Add SVG symbol defs
        const svgDefs = SvgDefs({});

        svgDefs.add();

        Store.add({
            name: 'svgdefs',
            component: svgDefs
        });

        Store.add({
            name: 'appcontainer',
            component: appContainer
        });

        appContainer.add();

        LaunchApp(param);
    };
}
// @END-File
