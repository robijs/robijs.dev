import { GenerateUUID } from './GenerateUUID.js'
import { SetSessionStorage } from './SetSessionStorage.js'
import { Route } from './Route.js'
import { Sidebar } from '../Components/Sidebar.js'
import { MainContainer } from '../Components/MainContainer.js'
import { Routes } from '../Core/Routes.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function LaunchApp(param) {
    const {
        releaseNotes,
        routes,
        settings
    } = param;

    const {
        title,
        sessionStorageData,
        sidebar,
        maincontainer,
        allowFeedback,
        beforeLaunch,
        usersList
    } = settings;
    
    // Set sessions storage
    SetSessionStorage({
        sessionStorageData
    });

    // Get current route
    const path = location.href.split('#')[1];

    /** Attach Router to browser back/forward event */
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            Route(event.state.url.split('#')[1], {
                scrollTop: Store.viewScrollTop()
            });
        }
    });

    // Store routes
    Store.setRoutes(routes.concat(Routes));

    // Get app container
    const appContainer = Store.get('appcontainer');

    // Sidebar
    const sidebarParam = {
        parent: appContainer,
        path
    };

    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    // Main Container
    const mainContainerParam = {
        parent: appContainer
    };

    const mainContainer = maincontainer ? maincontainer(mainContainerParam) : MainContainer(mainContainerParam);

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    // Show App Container
    // FIXME: Is this still necessary?
    // NOTE: The app container is hidden on load and only shown once the sidebar and main container
    // compononets are added to the DOM.
    appContainer.show('flex');

    /** Generate Session Id */
    const sessionId = GenerateUUID();

    // TODO: Use GetLocal();
    // Format Title for Sessin/Local Storage keys
    const storageKeyPrefix = settings.title.split(' ').join('-');

    // Set Session Id
    sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId);

    // Run current route on page load
    Route(path, {
        log: false
    });
}
// @END-File
