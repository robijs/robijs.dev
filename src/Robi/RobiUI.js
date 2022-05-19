// Copyright 2022 Stephen Matheis

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER
// RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
// CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import {
    AddRoute,
    AttachFiles,
    BlurOnSave,
    CheckLists,
    Component,
    CreateApp,
    CreateItem,
    CustomEditForm,
    CustomNewForm,
    DeleteApp,
    DeleteAttachments,
    DeleteItem,
    DeleteRoutes,
    EditLayout,
    Editor,
    GenerateUUID,
    Get,
    GetLocal,
    GetRequestDigest,
    GetSiteUsers,
    HTML,
    HideRoutes,
    ModifyFile,
    ModifyForm,
    ModifyRoutes,
    OrderRoutes,
    ReinstallApp,
    RemoveLocal,
    ResetApp,
    Route,
    SetLocal,
    SetTheme,
    Shimmer,
    Style,
    UpdateApp,
    UpdateColumn,
    UpdateItem,
    UploadFile,
    Wait,
    App,
    Store,
    Lists,
    QuestionModel,
    QuestionsModel,
    StartAndEndOfWeek,
    Themes
} from './Robi.js'

/**
 *
 * @param {*} param
 */
export async function AccountInfo({ parent }) {
    // Card
    const accountInfoCard = Container({
        width: '100%',
        display: 'block',
        parent
    });

    accountInfoCard.add();

    // Destructure user properties
    const {
        Id,
        Title,
        LoginName,
        Email,
        Roles
    } = Store.user();

    // Name
    const nameCtr = Container({
        parent: accountInfoCard,
        align: 'end',
        margin: '0px 0px 20px 0px'
    });

    nameCtr.add();

    const nameField = SingleLineTextField({
        label: 'Name',
        fieldMargin: '0px',
        value: Title,
        readOnly: true,
        parent: nameCtr
    });

    nameField.add();

    const editName = Button({
        type: 'robi-light',
        icon: 'bs-pencil-square',
        size: '18px',
        fill: 'var(--primary)',
        classes: ['ml-3'],
        parent: nameCtr,
        action() {
            // Edit name form
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                centered: true,
                showFooter: false,
                async addContent(modalBody) {
                    // Modify modal style
                    modalBody.classList.add('install-modal');
                    modal.find('.modal-dialog').style.maxWidth = 'fit-content';
                    modal.find('.modal-dialog').style.minWidth = '675px';
        
                    // Heading
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='mb-3'>
                            Edit name
                        </h3>
                    `);

                    // Name
                    const nameField = SingleLineTextField({
                        label: 'Name',
                        value: Store.user().Title,
                        parent: modalBody
                    });

                    nameField.add();

                    // Save button
                    const startBtn = Button({
                        async action(event) {
                            startBtn.disable();
                            startBtn.get().innerHTML = /*html*/ `
                                <span class="spinner-border" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 3px"></span>
                            `;

                            const newName = nameField.value();

                            if (newName !== Title) {
                                // Modify user item
                                Store.user().Title = newName;

                                // Update user item
                                await UpdateItem({
                                    list: 'Users',
                                    itemId: Id,
                                    data: {
                                        Title: newName
                                    }
                                });
                            }
                            
                            // Resolve promise on modal close
                            $(modal.get()).on('hidden.bs.modal', event => {
                                Route('Settings/Account');
                            });
    
                            modal.close();
                        },
                        classes: ['w-100 mt-3'],
                        width: '100%',
                        parent: modalBody,
                        type: 'robi',
                        value: 'Save'
                    });
        
                    startBtn.add();

                    // Cancel button
                    const cancelBtn = Button({
                        async action(event) {
                            modal.close();
                        },
                        classes: ['w-100 mt-3'],
                        width: '100%',
                        parent: modalBody,
                        type: '',
                        value: 'Cancel'
                    });
        
                    cancelBtn.add();
                },
            });
        
            modal.add();
        }
    });

    editName.add();
    editName.get().style.padding = '0px';

    // Login Name
    const accountField = SingleLineTextField({
        label: 'Login Name',
        value: LoginName,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    accountField.add();

    // Email
    const emailField = SingleLineTextField({
        label: 'Email',
        value: Email,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    emailField.add();

    // Role
    const roleCtr = Container({
        parent: accountInfoCard,
        align: 'end',
        margin: '0px 0px 20px 0px'
    });

    roleCtr.add();

    const roleField = SingleLineTextField({
        label: 'Roles',
        value: Roles.results.join(', '),
        readOnly: true,
        fieldMargin: '0px',
        parent: roleCtr
    });

    roleField.add();

    const editRole = Button({
        type: 'robi-light',
        icon: 'bs-pencil-square',
        size: '18px',
        fill: 'var(--primary)',
        classes: ['ml-3'],
        parent: roleCtr,
        action() {
            // Edit name form
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                centered: true,
                showFooter: false,
                async addContent(modalBody) {
                    // Modify modal style
                    modalBody.classList.add('install-modal');
                    modal.find('.modal-dialog').style.maxWidth = 'fit-content';
                    modal.find('.modal-dialog').style.minWidth = '675px';
        
                    // Heading
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='mb-3'>
                            Edit role
                        </h3>
                    `);

                    // Role
                    const roleField = SquareField({
                        // FIXME: Return array instead
                        // TODO: Allow SquareField to accept arrays and strings
                        value: Roles.results.filter(r => !['Administrator', 'Developer', 'User'].includes(r))[0],
                        items: [
                            {
                                label: 'Action Officer',
                                html: /*html*/ `
                                    <div>
                                        <div style='font-size: 45px; font-weight: 500; text-align: center;'>AO</div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Action Officer</div>
                                    </div>
                                `
                            },
                            {
                                label: 'Data Scientist',
                                html: /*html*/ `
                                    <div>
                                        <div style='font-size: 45px; font-weight: 500; text-align: center;'>DS</div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Data Scientist</div>
                                    </div>
                                `
                            },
                            {
                                label: 'Visitor',
                                html: /*html*/ `
                                    <div class=''>
                                        <div class='d-flex align-items-center justify-content-center' style='height: 67.5px;'>
                                            <svg class='icon' style='font-size: 55px; fill: var(--color);'>
                                                <use href='#icon-bs-person-badge'></use>
                                            </svg>
                                        </div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Visitor</div>
                                    </div>
                                `
                            }
                        ],
                        parent: modalBody
                    });

                    roleField.add();
        
                    // Save button
                    const startBtn = Button({
                        async action(event) {
                            startBtn.disable();
                            startBtn.get().innerHTML = /*html*/ `
                                <span class="spinner-border" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 3px"></span>
                            `;

                            // Set new roles array
                            const roles = [];

                            if (Roles.results.includes('Administrator')) {
                                roles.push('Administrator');
                            }

                            if (Roles.results.includes('Developer')) {
                                roles.push('Developer');
                            }

                            if (Roles.results.includes('User')) {
                                roles.push('User');
                            }

                            roles.push(roleField.value());

                            // Modify user
                            Store.user().Roles.results = roles;

                            // Update user item
                            await UpdateItem({
                                list: 'Users',
                                itemId: Id,
                                data: {
                                    Roles: {
                                        results: roles
                                    }
                                }
                            });
                            
                            // Resolve promise on modal close
                            $(modal.get()).on('hidden.bs.modal', event => {
                                Route('Settings/Account');
                            });
    
                            modal.close();
                        },
                        classes: ['w-100 mt-4'],
                        width: '100%',
                        parent: modalBody,
                        type: 'robi',
                        value: 'Save'
                    });
        
                    startBtn.add();

                    // Cancel button
                    const cancelBtn = Button({
                        async action(event) {
                            modal.close();
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modalBody,
                        type: '',
                        value: 'Cancel'
                    });
        
                    cancelBtn.add();
                },
            });
        
            modal.add();
        }
    });

    editRole.add();
    editRole.get().style.padding = '0px';
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function ActionsCards({ parent, path }) {
    // NOTE:

    // const originalRes = await fetch('../../import.txt');
    // const original = await originalRes.json();
    // const measuresRes = await fetch('../../measures.json');
    // const measures = await measuresRes.json();

    // let output = [...Array(508).keys()].map(num => {
    //     const measure = measures.find(m => parseInt(m.ID) === num + 1) || { MeasureName: 'PLACEHOLDER'};
    //     const originalItem = original.find(m => parseInt(m.ID) === num + 1) || { MeasureName: 'PLACEHOLDER'};

    //     if (measure.Status === 'Under Development') {
    //         measure.Publisher = null;
    //         measure.Published = null;
    //     }

    //     if (measure.MeasureName !== 'PLACEHOLDER') {
    //         measure.ModifiedByAccount = originalItem.ModifiedByAccount;
    //     }

    //     const keys = Object.keys(measure);
        
    //     keys.forEach(key => {
    //         if (measure[key] === '') {
    //             measure[key] = null;
    //         }
    //     });

    //     delete measure['Item Type'];
    //     delete measure['Path'];
        
    //     measure.ModifiedByAccount = originalItem.ModifiedByAccount;
        
    //     return measure;
    // });

    // console.log(output);

    // return;

    // NOTE:

    // const measuresRes = await fetch('../../intakes.json');
    // const measuresRes = await fetch('../../import.txt');
    // const measures = await measuresRes.json();

    // const toMapRes = await fetch('../../file-types.json');
    // const toMapItems = await toMapRes.json();

    // let output = measures.map(item => {
    //     const { ID } = item;
    //     const toMap = toMapItems.filter(a => parseInt(a['Measure ID']) === ID);

    //     item.FileTypes = JSON.stringify(
    //         toMap.map(i => {
    //             return {
    //                 name: i.Title,
    //                 type: i['File Type']
    //             }
    //         })
    //     );

    //     return item;
    // });

    // console.log(output);

    // // Ex: "[{\"name\":\"Test\",\"type\":\"Excel\"},{\"name\":\"Test 2\",\"type\":\"Text\"}]"
    // output = measures.map((measure, index) => {
    //     // https://stackoverflow.com/a/31102605
    //     const ordered = Object.keys(measure).sort().reduce(
    //         (obj, key) => {
    //           obj[
    //             key
    //             .replaceAll(`'`,'')
    //             .replaceAll(`-`,'')
    //             .replaceAll(`_`,'')
    //             .replaceAll(` `,'')
    //             .replaceAll(`/`,'')
    //             .replaceAll(`(`,'')
    //             .replaceAll(`)`,'')
    //             .replaceAll(`+`,'')
    //           ] = measure[key]; 
    //           return obj;
    //         }, 
    //         {}
    //     );

    //     return ordered;
    // });

    // console.log('Output', output);

    // const measuresRes = await fetch('https://info.health.mil/staff/analytics/cp/ModernDev/create-app/measures-library-dev/App/combined.txt');
    // const measures = await measuresRes.json();

    // const names = [
    //     // Override system fields
    //     {
    //         newName: 'ID',
    //         oldName: 'ID'
    //     },
    //     {
    //         newName: 'Modified',
    //         oldName: 'Modified'
    //     },
    //     {
    //         newName: 'ModifiedByEmail',
    //         oldName: 'ModifiedBy'
    //     },
    //     {
    //         newName: 'Created',
    //         oldName: 'Created'
    //     },
    //     {
    //         newName: 'CreatedByEmail',
    //         oldName: 'CreatedBy2'
    //     },
    //     // Measures Fields
    //     {
    //         newName: 'AOEmail',
    //         oldName: 'AOsEmail'
    //     },
    //     {
    //         newName: 'AOName',
    //         oldName: 'ActionOfficer'
    //     },
    //     {
    //         newName: 'AOOffice',
    //         oldName: 'AOsOfficeDivision'
    //     },
    //     {
    //         newName: 'AltAOEmail',
    //         oldName: 'AltAOsEmail'
    //     },
    //     {
    //         newName: 'AltAOName',
    //         oldName: 'AlternateAO'
    //     },
    //     {
    //         newName: 'AltAOOffice',
    //         oldName: 'AltAOsOfficeDivision'
    //     },
    //     {
    //         newName: 'AltDSEmail',
    //         oldName: 'AltDSEmail'
    //     },
    //     {
    //         newName: 'AltDSName',
    //         oldName: 'AltDataScientist'
    //     },
    //     {
    //         newName: 'AltDSOffice',
    //         oldName: 'AltDSOfficeDivision'
    //     },
    //     {
    //         newName: 'AnnualUpdateSchedule',
    //         oldName: 'AnnualUpdateSchedule'
    //     },
    //     {
    //         newName: 'ArchivedDataSources',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Baseline',
    //         oldName: 'Baseline'
    //     },
    //     {
    //         newName: 'BaselineValue',
    //         oldName: 'BaselineValue'
    //     },
    //     {
    //         newName: 'Benchmarks',
    //         oldName: 'BenchmarksFY21'
    //     },
    //     {
    //         newName: 'CareAvailability',
    //         oldName: 'DataLevelAvailability'
    //     },
    //     {
    //         newName: 'CreatedOriginal',
    //         oldName: 'Created',
    //     },
    //     {
    //         newName: 'DSEmail',
    //         oldName: 'DSEmail'
    //     },
    //     {
    //         newName: 'DSName',
    //         oldName: 'DataScientist'
    //     },
    //     {
    //         newName: 'DSOffice',
    //         oldName: 'DSOfficeDivision'
    //     },
    //     {
    //         newName: 'DashboardLinks',
    //         oldName: 'DashboardLinks'
    //     },
    //     {
    //         newName: 'DataAggLevels',
    //         oldName: 'DataAggregationLevel'
    //     },
    //     {
    //         newName: 'DataLagUnit',
    //         oldName: 'DataLagUnit'
    //     },
    //     {
    //         newName: 'DataLagValue',
    //         oldName: 'DataLag'
    //     },
    //     {
    //         newName: 'DataLatency',
    //         oldName: 'DataLatency'
    //     },
    //     {
    //         newName: 'DataSource',
    //         oldName: 'SourceofData'
    //     },
    //     {
    //         newName: 'Denominator',
    //         oldName: 'Denominator'
    //     },
    //     {
    //         newName: 'Description',
    //         oldName: 'Description'
    //     },
    //     {
    //         newName: 'Exclusions',
    //         oldName: 'Exclusions'
    //     },
    //     {
    //         newName: 'FileTypes',
    //         oldName: ''
    //     },
    //     // TODO: Map choices
    //     // Ex: Annual/Annually -> Yearly
    //     // Ex: Hoc/Ad Hoc -> Irregular
    //     {
    //         newName: 'Frequency',
    //         oldName: 'ReportingFrequency'
    //     },
    //     {
    //         newName: 'GenesisIncluded',
    //         oldName: 'GENESISSiteIncluded'
    //     },
    //     {
    //         newName: 'Inclusions',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'IsAllDataMIP',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'IsAutomated',
    //         oldName: 'Automated'
    //     },
    //     {
    //         newName: 'Limitations',
    //         oldName: 'Limitations'
    //     },
    //     {
    //         newName: 'MIPNameLoc',
    //         oldName: 'MIPLocation'
    //     },
    //     {
    //         newName: 'MeasureAbr',
    //         oldName: 'MeasureAbbreviation'
    //     },
    //     {
    //         newName: 'MeasureCategory',
    //         oldName: 'MeasureCategory'
    //     },
    //     {
    //         newName: 'MeasureId',
    //         oldName: 'MeasureNumber'
    //     },
    //     {
    //         newName: 'MeasureName',
    //         oldName: 'MeasureName'
    //     },
    //     {
    //         newName: 'MeasureSet',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasuresBranchRep',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasuresBranchRepEmail',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasureStatus',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasureType',
    //         oldName: 'MeasureType'
    //     },
    //     {
    //         newName: 'NumberOfUploads',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Numerator',
    //         oldName: 'Numerator'
    //     },
    //     {
    //         newName: 'OnHoldComments',
    //         oldName: 'OnHoldComments'
    //     },
    //     {
    //         newName: 'OnHoldEnd',
    //         oldName: 'OnHoldEstEnd'
    //     },
    //     {
    //         newName: 'OnHoldName',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'OnHoldStart',
    //         oldName: 'OnHoldStart'
    //     },
    //     {
    //         newName: 'PQACategory',
    //         oldName: 'QuadAim'
    //     },
    //     // FIXME: Missing main field from source?
    //     {
    //         newName: 'ProgLang',
    //         oldName: 'OtherProgName'
    //     },
    //     {
    //         newName: 'Publisher',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Published',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Rationale',
    //         oldName: 'Rationale'
    //     },
    //     {
    //         newName: 'RawDataLocation',
    //         oldName: 'RawDataLoc'
    //     },
    //     {
    //         newName: 'ReviewFocusArea',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'RiskAdjusted',
    //         oldName: 'RiskAdjusted'
    //     },
    //     {
    //         newName: 'SQLNameLoc',
    //         oldName: 'SQLLocation'
    //     },
    //     {
    //         newName: 'ScheduledRefreshDay',
    //         oldName: 'ScheduledRefreshDay'
    //     },
    //     {
    //         newName: 'ScheduledRefreshMonth',
    //         oldName: 'ScheduledRefreshMonth'
    //     },
    //     {
    //         newName: 'Status',
    //         oldName: 'MeasureStatus'
    //     },
    //     {
    //         newName: 'Tags',
    //         oldName: 'Tags'
    //     },
    //     {
    //         newName: 'Targets',
    //         oldName: 'FY21Target'
    //     }
    // ];

    // const newSchema = output.map(measure => {
    //     const data = {};

    //     for (let fieldPair in names) {
    //         const { oldName, newName } = names[fieldPair];

    //         if (oldName) {
    //             data[newName] = measure[oldName] || null;
    //         }
    //     }

    //     return data;
    // });

    // const newItems = newSchema.map(record => {
    //     record.ID = parseInt(record.ID);
    //     record.MeasureId = parseInt(record.ID);
    //     record.DataLagValue = parseInt(record.DataLagValue);
    //     record.DataAggLevels = {
    //         results: record.DataAggLevels?.split(';#') || []
    //     }
    //     record.ProgLang = {
    //         results: record.ProgLang?.split(';#') || []
    //     }
    //     record.MeasureCategory = {
    //         results: record.MeasureCategory?.split(';#') || []
    //     }
    //     record.MeasureType = {
    //         results: record.MeasureType?.split(';#') || []
    //     }
    //     record.DataSource = {
    //         results: record.DataSource?.split(';#') || []
    //     }

    //     return record;
    // });

    // console.log('New Schema:', newSchema);
    // console.log('New Items:', newItems);

    let run = false;

    const timer = Timer({
        parent,
        classes: ['w-100'],
        start() {
            run = true;
            console.log(`Run: ${run}`);

            create();
        },
        stop() {
            run = false;
            console.log(`Run: ${run}`);
        },
        reset() {
            console.log('reset');
        }
    });
  
    timer.add();

    async function create() {
        // Override read only fields
        await UpdateColumn({
            list: 'Measures',
            field: {
                name: 'Created',
                readOnly: false
            }
        });

        await UpdateColumn({
            list: 'Measures',
            field: {
                name: 'Modified',
                readOnly: false
            }
        });

        // Items
        const items = await Get({
            list: 'Measures',
            select: `*,Author/Title,Editor/Title`,
            expand: `File,Author,Editor`
        });

        console.log(items);

        // {"Title":"First Last","Email":"first.mi.last.ctr@mail.mil","LoginName":"0987654321@mil","Roles":{"results":["Developer","Visitor"]},"SiteId":1,"Settings":"{\"searches\":{},\"watched\":[]}","AuthorId":1,"Author":{"Title":"First Last","LoginName":"0987654321@mil"},"EditorId":1,"Editor":{"Title":"First Last","LoginName":"0987654321@mil"},"Created":"Sat, 26 Feb 2022 22:28:51 GMT","Modified":"Sat, 26 Feb 2022 22:30:12 GMT","Id":1}
        for (let [i, item] of items.entries()) {
            if (run) {
                const { ID, Author, Editor } = item;
                const { Created, Modified } = measures.find(m => parseInt(m.ID) === ID);

                // console.log(item, measure);
                console.log({
                    Modified,
                    Published: Created,
                    Publisher: Author
                });

                continue;

                const updatedItem = await UpdateItem({
                    list: 'Measures',
                    itemId: ID,
                    data: {
                        // Published: 
                    }
                })

                if (i === measures.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');
  
                break;
            }
        }
    }

    return;

    // TODO: Make actions directly addressable ( how to make sure unique path betwen user and shared names/ids? )

    let userSettings = JSON.parse(Store.user().Settings);
    let myActions = userSettings.actions || [];
    const sharedActions = await Get({
        list: 'Actions'
    });

    Style({
        name: 'action-cards',
        style: /*css*/ `
            .actions-title {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 20px;
            }

            .action-card-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, 150px); /* passed in size or 22 plus (15 * 2 for padding) */
                justify-content: space-between;
                width: 100%;
            }

            .action-card {
                cursor: pointer;
                height: 150px;
                width: 150px;
                border-radius: 20px;
                background: var(--background);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: 500;
            }

            .action-btn {
                margin-right: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                cursor: pointer;
            }

            .action-btn .icon {
                fill: var(--primary);
            }
        `
    });

    // My Actions
    parent.append(/*html*/ `
        <div class='actions-title'>My Actions</div>
        <div class='action-card-container'>
            ${
                HTML({
                    items: myActions,
                    each(item) {
                        const { Name, FileNames } = item;
                        
                        return /*html*/ `
                            <div class='action-card' data-files='${FileNames}'>${Name}</div>
                        `
                    }
                })
            }
        </div>
    `);

    parent.findAll('.action-card').forEach(card => {
        card.addEventListener('click', event => {
            parent.empty();

            ActionsEditor({ parent, files: event.target.dataset.files });
        });
    });
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function ActionsEditor({ parent, files }) {
    parent.get().style.height = '100%';
    parent.append(/*html*/ `
        <div class='mb-2 d-flex justify-content-center'>

            <div class='action-btn' onclick='alert("Save");'>
                <svg class="icon" style='font-size: 20px;'>
                    <use href="#icon-bs-arrow-left-cirlce-fill"></use>
                </svg>
            </div>
                    
            <div class='action-btn' onclick='alert("Save");'>
                <svg class="icon" style='font-size: 20px;'>
                    <use href="#icon-save"></use>
                </svg>
            </div>

            <div class='action-btn' onclick='alert("Run");'>
                <svg class="icon" style='font-size: 24px;'>
                    <use href="#icon-play3"></use>
                </svg>
            </div>

            <div class='action-btn' onclick='alert("Stop");'>
                <svg class="icon" style='font-size: 32px;'>
                    <use href="#icon-bs-stop-fill"></use>
                </svg>
            </div>

        </div>
        <div class='d-flex flex-column w-100' style='height: 100%; padding-bottom: 30px;'>
            <div class='rs-box code-box alert w-100 mb-0 p-0' style='height: 50%; background: #1e1e1e; color: #d4d4d4;'>
            <!-- CodeMirror injected here -->
            </div>
            <div class='output-box alert alert-robi-secondary w-100 mb-0' style='flex: 1;'></div>
        </div>
    `);

    $('.rs-box').resizable({
        handles: 's'
    });

    // FIXME: Testing
    const path = 'App/src/Robi/Components';
    const file = 'Settings.js';

    const loading = LoadingSpinner({
        message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
        type: 'white',
        classes: ['h-100', 'loading-file'],
        parent:  parent.find('.code-box')
    });

    loading.add();

    document.querySelector('.code-box').insertAdjacentHTML('beforeend', /*html*/ `
        <textarea class='code-mirror-container robi-code-background h-100'></textarea>
    `);

    let shouldReload = false;

    const editor = CodeMirror.fromTextArea(parent.find('.code-mirror-container'), {
        mode: 'javascript',
        indentUnit: 4,
        lineNumbers: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        foldGutter: true,
        matchBrackets: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        keyword: {
            "import": "special",
            "export": "special",
            "default": "special",
            "await": "special",
        }
    });
    editor.setSize(0, 0);
    editor.setOption('extraKeys', {
        // "Ctrl-Space": "autocomplete",
        'Tab': 'indentMore',
        'Shift-Tab': 'indentLess',
        'Ctrl-/'(cm) {
            editor.toggleComment({
                // this prop makes sure comments retain indented code
                // https://github.com/codemirror/CodeMirror/issues/3765#issuecomment-171819763
                indent: true
            });
        },
        async 'Ctrl-S'(cm) {
            // TODO: only save file if changed
            console.log('save file');

            // Save file
            await saveFile();

            // Add changed message
            const changedMessaage = parent.find('.changed-message');

            if (!changedMessaage) {
                parent.find('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='changed-message' style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                `);
            }

            // Set reload flag
            shouldReload = true;

        }
    });

    // Autocomplete
    const ExcludedIntelliSenseTriggerKeys = {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause",
        "20": "capslock",
        "27": "escape",
        "32": "space",
        "33": "pageup",
        "34": "pagedown",
        "35": "end",
        "36": "home",
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down",
        "45": "insert",
        "46": "delete",
        "91": "left window key",
        "92": "right window key",
        "93": "select",
        "107": "add",
        "109": "subtract",
        "110": "decimal point",
        "111": "divide",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "numlock",
        "145": "scrolllock",
        "186": "semicolon",
        "187": "equalsign",
        "188": "comma",
        "189": "dash",
        "190": "period",
        "191": "slash",
        "192": "graveaccent",
        "220": "backslash",
        "222": "quote"
    }
      
    // editor.on("keyup", function (cm, event) {
    //     if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
    //         !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()]) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
    //       CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
    //     }
    // });

    // END 

    let fileValueRequest;
    let requestDigest;

    if (App.isProd()) {
        const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

        requestDigest = await GetRequestDigest();

        fileValueRequest = await fetch(sourceSiteUrl, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': requestDigest
            }
        });

    } else {
        fileValueRequest = await fetch(`http://127.0.0.1:8080/libraries/Actions/${files}`);
        await Wait(1000);
    }

    // Overriden on save
    // FIXME: Doesn't work with app.js.
    let value = await fileValueRequest.text();

    // Always wait an extra 100ms for CodeMirror to settle.
    // For some reason, gutter width's won't apply 
    // correctly if the editor is modified too quickly.
    setTimeout(() => {
        // Remove loading message
        loading.remove();

        // Set codemirror
        setEditor();
    }, 100);

    // FIXME: Remember initial codemirorr doc value
    // compare this with current doc value
    let docValue;

    function setEditor() {
        editor.setSize('100%', '100%');
        editor.setOption('viewportMargin', Infinity);
        editor.setOption('theme', 'vscode-dark');
        editor.getDoc().setValue(value);
        editor.focus();

        docValue = editor.doc.getValue();

        // Watch for changes
        editor.on('change', event => {
            if (docValue === editor.doc.getValue()) {
                console.log('unchanged');

                const dot = parent.find('.changed-dot');

                if (dot) {
                    dot.remove();
                }
            } else {
                console.log('changed');

                const dot = parent.find('.changed-dot');

                if (!dot) {
                    // parent.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                    //     <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                    // `);
                }
            }
        });

        // // Scrollbar
        // editor.on()
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Alert(param) {
    const {
        text,
        classes,
        close,
        margin,
        width,
        parent,
        position,
        top,
        delay
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type} ${classes?.join(' ')}' role='alert'>
                ${text || ''}
                ${
                    close ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `: ''
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 10px;
                border: none;
                margin: ${margin || '0px 0px 10px 0px'};
            }

            #id.alert-blank {
                padding: 0px;
            }

            #id.shadow {
                box-shadow: var(--box-shadow);
            }
            
            ${
                width ?
                /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''
            }

            
            @keyframes alert-in {
                0% {
                    transform: scale(0);
                    transform-origin: center;
                    opacity: 0;
                }

                100% {
                    transform: scale(1);
                    transform-origin: center;
                    opacity: 1;
                }
            }

            .alert-in {
                position: absolute;
                top: ${top || 0}px;
                animation: alert-in 200ms ease-in-out forwards, alert-in 200ms ease-in-out ${delay || 5000}ms reverse forwards;
                z-index: 10000;
            }
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType, text: newText
        } = param;

        const alert = component.get();

        if (type) {
            alert.classList.remove(`alert-${type}`);
            alert.classList.add(`alert-${newType}`);

            type = newType;
        }

        if (text) {
            alert.innerHTML = newText;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function Alerts({ parent }) {
    const btn = Button({
        value: 'Edit',
        type: 'robi',
        parent,
        action() {
            BannerMenu();
        }
    });

    btn.add();
}

/**
 *
 * @returns
 */
export function AppContainer() {
    const cancelButton = `background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' style='fill: ${App.get('prefersColorScheme') === 'dark' ? 'darkgray' : 'darkgray' };'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");`

    const component = Component({
        name: 'appcontainer',
        html: /*html*/ `
            <div class='appcontainer'></div>
        `,
        style: /*css*/ `
            /* Override html prefers-color-scheme media query in app.aspx */
            /* TODO: Move to style or css file that loads sooner */

            /* NOTE: Testing */

            .custom-control-label::before {
                background-color: var(--secondary);
                border: solid 1px var(--input-border-color);
            }

            /* NOTE: END */

            html {
                background: var(--secondary);
            }

            .appcontainer {
                /* FIXME: show immediately */
                display: none;
                background: var(--secondary);
            }
            
            *, ::after, ::before {
                box-sizing: border-box;
            }

            .appcontainer,
            .appcontainer {
                transition: background-color 300ms;
            }
            
            body {
                padding: 0px;
                margin: 0px;
                box-sizing: border-box;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                color: var(--color);
            }
            
            body::-webkit-scrollbar { 
                display: none; 
            }
            
            ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            
            ::-webkit-scrollbar-track {
                background: inherit;
            }
            
            ::-webkit-scrollbar-thumb {
                background: var(--scrollbar);
                width: 8px;
                height: 8px;
                border: 3px solid transparent;
                border-radius: 8px;
                background-clip: content-box;
            }
            
            table {
                border-collapse: collapse;
            }

            .smooth-tranisition {
                transition: all 300ms ease-in-out;
            }
            
            /* Stop Chrome from changing input background color when autocomplete enabled */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active  {
                box-shadow: 0 0 0 30px white inset !important;
            }

            /* Font Weight */
            .font-weight-500 {
                font-weight: 500;
            }

            /* Icon */
            .icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                stroke-width: 0;
            }

            /* Wait */
            .appcontainer.wait,
            .appcontainer.wait * {
                pointer-events: none;
                cursor: wait !important;
            }

            /* Links */
            a:hover {
                color: var(--primary);
                text-decoration: underline;
            }
            
            a {
                color: var(--primary);
                text-decoration: none;
                background-color: transparent;
            }

            /* Code */
            code {
                font-size: 1em;
                color: var(--primary);
            }

            /* Button */
            button:focus {
                outline: none;
            }

            .btn {
                font-size: 14px;
                border-radius: 10px;
                color: var(--color);
            }

            .btn:hover {
                color: var(--color);
            }

            .btn:focus,
            .btn:active {
                box-shadow: none !important;
            }

            .btn-primary {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-primary:hover {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-primary:active,
            .btn-primary:focus {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-robi-reverse,
            .btn-robi-reverse:hover {
                background: var(--primary);
                color: var(--secondary) !important;
                font-weight: 500;
            }

            .btn-robi,
            .btn-robi:hover {
                color: var(--primary);
                background: var(--button-background);
                font-weight: 500;
            }

            .btn-robi-success,
            .btn-robi-success:hover {
                color: seagreen;
                background: var(--button-background);
                font-weight: 500;
            }

            .btn-robi-light,
            .btn-robi-light:hover {
                color: var(--primary);
                background: inherit;
                font-weight: 500;
            }

            .btn-outline-robi {
                color: var(--primary);
                background-color: initial;
                border-color: var(--primary);
            }

            .btn-light:hover {
                color: #212529 !important;
                background-color: #f8f9fa !important;
                border-color: #f8f9fa !important;
            }

            .btn-light:active,
            .btn-light:focus {
                color: #212529 !important;
                background-color: #f8f9fa !important;
                border-color: #f8f9fa !important;
            }

            .btn-outline-primary {
                color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-outline-primary:hover {
                background-color: initial !important;
                color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-subtle-primary {
                color: royalblue !important;
                border-color: var(--background) !important;
                background-color: var(--background) !important;
            }

            .btn-subtle-primary:hover {
                color: royalblue !important;
                border-color: var(--background) !important;
                background-color: var(--background) !important;
            }

            .btn-success {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-success:hover {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-success:active,
            .btn-success:focus {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-danger {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-danger:hover {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-danger:active,
            .btn-danger:focus {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-danger {
                color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-danger:hover {
                color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-success {
                color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-outline-success:hover {
                color: seagreen !important;
                border-color: seagreen !important;
            }

            /* Cards */
            .card-footer {
                border-top: solid 1px var(--border-color);
            }

            /* Form Controls */
            .form-field {
                display: flex;
                flex-direction: column;
                /* justify-content: space-between; */
            }

            .form-field .form-field-description {
                height: 100%;
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .btn.dropdown-toggle {
                font-size: 13px !important;
                background: var(--inputBackground);
            }

            .input-group-text {
                background: var(--background);
                font-size: 13px !important;
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .input-group-text {
                border: 1px solid var(--border-color);
            }

            .form-control:focus,
            .form-field-multi-line-text.editable:focus,
            .btn.dropdown-toggle:focus {
                border: 1px solid var(--border-color);
                background: var(--inputBackground);
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .btn.dropdown-toggle,
            .dropdown-menu {
                border-radius: 10px !important;
            }

            .input-group .input-group-text {
                color: var(--color);
                border-radius: 10px 0px 0px 10px !important;
            }

            .input-group .form-control {
                border-radius: 0px 10px 10px 0px !important;
            }

            .form-control:not(.dataTables_length .custom-select):focus,
            .custom-select:not(.dataTables_length .custom-select):focus,
            .form-field-multi-line-text.editable:focus,
            .btn.dropdown-toggle:focus {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px var(--primary-6b) !important;
            }

            .custom-select,
            .cusomt-select:focus,
            .form-control,
            .form-control:focus {
                color: var(--color);
            }

            .custom-select {
                background: var(--inputBackground) !important;
                border-color: var(--border-color);
            }

            input[type='search'] {
                background: var(--button-background) !important;
                border-color: transparent;
            }

            input[type='search']:active,
            input[type='search']:focus,
            select:focus,
            select:focus {
                outline: none;
            }

            input[type='search']:active,
            input[type='search']:focus {
                box-shadow: none !important;
            }

            input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                ${cancelButton};
            }            

            /* Alert */
            .alert {
                font-size: 14px;
                border: none;
                border-radius: 10px;
            }
            
            @keyframes fade-in-bottom {
                0% {
                    bottom: -10px;
                    transform: scale(.5);
                    opacity: 0;
                }
            
                100% {
                    bottom: 10px;
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .alert-robi-primary {
                background: var(--primary-20) !important;
                color: var(--primary-hsl-5) !important;
            }

            .alert-robi-primary *:not(.btn) {
                color: var(--primary-hsl-5) !important;
            }

            .alert-robi-primary-high-contrast {
                background: var(--primary-19) !important;
                color: var(--primary-hsl-10) !important;
            }

            .alert-robi-primary-high-contrast *:not(.btn) {
                color: var(--primary-hsl-10) !important;
            }

            .alert-robi-reverse {
                background: var(--primary) !important;
                color: var(--secondary) !important;
            }

            .alert-robi-secondary {
                background: var(--background) !important;
                color: var(--color) !important;
            }

            .alert-robi-secondary *:not(.btn) {
                color: var(--color) !important;
            }

            .alert-robi-primary hr,
            .alert-robi-primary-high-contrast hr {
                border-top: 1px solid var(--primary-30);
            }

            .alert-robi-secondary hr {
                border-top: 1px solid var(--background-HSL-5);
            }
            
            /** Badge */
            .badge-success {
                background: seagreen !important;
            }

            /* Text */
            .text-robi {
                color: var(--primary) !important;
            }

            /** Code mirror */
            .CodeMirror * {
                color: unset;
                font-family: 'Inconsolata', monospace;
                font-size: 14px;
            }

            .robi-code-background {
                background: #1e1e1e;
            }

            .loading-file {
                font-family: 'Inconsolata', monospace;    
            }

            .file-title {
                width: 100%;
                background-color: #1e1e1e;
                display: flex;
                align-items: center;
                padding-bottom: .75rem;
            }

            .file-title * {
                font-family: 'Inconsolata', monospace; 
                font-size: 14px;
                color: white;
            }

            .file-icon-container {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 10px;
                margin-left: .75rem;
            }

            .file-icon {
                font-size: 16px;
            }

            .file-icon-css {
                fill: dodgerblue !important;
            }

            .file-icon-html {
                fill: dodgerblue !important;
            }

            .file-icon-js {
                fill: #F7DF1E !important;
            }

            /* Install Console */
            .console {
                width: 100%;
                height: 100%;
                overflow: overlay;
                background: var(--background);
            }

            .console * {
                color: var(--color) !important;
            }

            .console::-webkit-scrollbar {
                width: 15px;
            }

            .console::-webkit-scrollbar-thumb {
                min-height: 50px;
                border-radius: 20px;
            }

            .line-number {
                display: inline-block;
                font-weight: 600;
                width: 30px;
            }

            .install-modal {
                padding: 60px;
            }

            .install-alert {
                left: 10px;
                right: 10px;
                bottom: 10px;
                border-radius: 10px;
                padding: 10px 15px;
                border: none;
                background: var(--background);
                color: white !important;
                animation: fade-in-bottom 200ms ease-in-out forwards;
            };

            .install-alert * {
                color: white !important;
            };

            @keyframes fade-alert {
                0% {
                    bottom: -10px;
                    transform: scale(.5);
                    opacity: 0;
                }

                100% {
                    bottom: 10px;
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Dialog boxes */
            @keyframes dialog-fade {
                0% {
                    transform: scale(.5);
                    opacity: 0;
                }

                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .dialog-box {
                animation: dialog-fade 200ms ease-in-out forwards;
            }

            /* Taggle */
            @keyframes bounce {
                0%,
                20%,
                50%,
                80%,
                100% {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }
                40% {
                    -webkit-transform: translateY(-16px);
                    transform: translateY(-16px);
                }
                60% {
                    -webkit-transform: translateY(-7px);
                    transform: translateY(-7px);
                }
            }

            .bounce {
                -webkit-animation-name: bounce;
                animation-name: bounce;
            }

            /* Shrink app */
            @keyframes shrink-app {
                from {
                    transform: scale(1);
                }

                to {
                    transform: scale(.95);
                }
            }

            .shrink-app {
                animation: 400ms ease-in-out forwards shrink-app;
            }

            /* Switches */
            .custom-control-input:checked ~ .custom-control-label::before {
                color: #fff;
                border-color: var(--primary);
                background-color: var(--primary);
            }

            .custom-control-input:focus ~ .custom-control-label::before {
                box-shadow: 0 0 0 4px var(--primary-6b) !important;
            }

            .custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
                border-color: var(--primary-6b);
            }
            
            .custom-control-input:active {
                background: var(--primary);
            }

            /* Dropdown */
            .dropdown-toggle {
                min-height: 33.5px;
                min-width: 160px;
                font-size: 13px;
                border-radius: 0.125rem 0px;
                border: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .dropdown-menu {
                background: var(--inputBackground);
                margin: .125rem;
                padding: .125rem;
                border: solid 1px var(--border-color);
                background: var(--inputBackground);
            }
            
            .scroll-container {
                overflow: overlay;
            }

            .dropdown-item {
                color: var(--color);
                cursor: pointer;
                font-size: 13px;
                border-radius: 8px;
            }

            .dropdown-item:active {
                color: initial;
                background-color: initial;
            }

            .dropdown-item:focus,
            .dropdown-item:hover {
                color: var(--color);
                text-decoration: none;
                background-color: var(--primary-20);
            }

            /* Sortable */
            .ui-sortable-handle {
                cursor: grab !important;
            }

            .ui-sortable-helper {
                cursor: grabbing !important;
            }

            /* Row */
            .robi-row {
                /* transition: background-color 250ms ease, padding 250ms ease, margin 250ms ease, transform 250ms ease, box-shadow 250ms ease; */
                border-radius: 20px !important;
            }

            .robi-row-transition {
                transition: background-color 250ms ease, padding 250ms ease, margin 250ms ease, transform 250ms ease, box-shadow 250ms ease;
            }

            .robi-row.ui-sortable-handle {
                margin: 20px 0px !important;
                padding: 20px !important;
                background: var(--secondary) !important;
                box-shadow: 0px 0px 0px 2px var(--primary) !important;
            }

            .robi-row.ui-sortable-helper {
                box-shadow: var(--sort-shadow) !important;
                transform: scale(1.05);
            }

            /* Menu */
            .grow-in-top-left,
            .grow-in-center {
                background: var(--inputBackground);
                box-shadow: var(--box-shadow);
            }

            @keyframes grown-in-top-left {
                from {
                    transform: scale(0);
                    transform-origin: top left;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: top left;
                    opacity: 1;
                }
            }
            
            .dt-button-collection {
                animation: 150ms ease-in-out forwards grown-in-top-left;
            }

            .grow-in-top-left {
                animation: 150ms ease-in-out forwards grown-in-top-left;
                border-radius: 10px;
                padding: .5rem;
            }

            .grow-in-center {
                border-radius: 20px;
                padding: 10px;
                display: flex;
            }

            .dropdown-divider {
                border-color: var(--border-color);
            }

            /* hr */
            .alert-robi-primary hr, .alert-robi-primary-high-contrast hr {
                border-top: 1px solid var(--primary-30);
            }
            
            hr {
                margin-top: 1rem;
                margin-bottom: 1rem;
                border: 0;
                border-top: 1px solid rgba(0,0,0,.1);
                height: 0;
                overflow: visible;
                box-sizing: content-box;
            }
        `,
        position: 'afterbegin',
        events: []
    });

    component.wait = (value) => {
        if (value) {
            component.get().classList.add('wait');
        } else {
            component.get().classList.remove('wait');
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function AttachFilesButton(param) {
    const {
        value, list, id, margin, onAdd, parent, action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='attach-files'>
                <div class='attach-files-button'>${value}</div>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
            </div>
        `,
        style: /*css*/ `
            #id .attach-files-button {
                cursor: pointer;
                margin: ${margin || '0px 20px 0px 0px'};
                padding: 5px 10px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: var(--secondary);
                background: mediumseagreen;
                border: solid 2px seagreen;
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id .attach-files-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;
                    if (files.length > 0) {
                        const attachedFiles = await AttachFiles({
                            list,
                            id,
                            files
                        });

                        if (onAdd) {
                            onAdd(attachedFiles);
                        }
                    }
                }
            }
        ]
    });

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function AttachFilesField(param) {
    const {
        parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- Attachments -->
            <div class='form-field-row'>
                <div class='form-field-label'>Supporting documents</div>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
                <!-- File Drop Zone UI -->
                <div class='drop-zone'>
                    <div class='drop-zone-preview-container'>
                        <svg class="icon"><use href="#icon-drawer2"></use></svg>
                    </div>
                    <span class='drop-zone-button-container'>
                        <span class='drop-zone-button'>Choose files</span>
                        <span class='drag-message'>or drag them here</span>
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
        /* Rows */
            .form-field-row {
                margin-bottom: 20px;
            }

            /* Labels */
            .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            /* File Drop Zone */
            .drop-zone {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                min-height: 200px;
                border-radius: 4px;
                border: solid 2px var(--color);
            }

            .drop-zone-button-container { 
                height: 30%;
            }

            .drop-zone-button { 
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                background: var(--primary);
                color: white;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
            }

            .drop-zone-preview-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .drag-over {
                background: white;
                border: solid 2px var(--primary);
            }

            .drop-zone-preview-container .icon {
                font-size: 4.5em;
                stroke: var(--color);
                fill: var(--color);
            }

            .file-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .file-preview-name {
                text-align: center;
                width: 115px;
                margin-bottom: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .file-preview-remove {
                cursor: pointer;
                font-size: .7em;
                padding: 1px 3px;
                background: crimson;
                color: white;
                border-radius: 4px;
                border: solid 1px var(--border-color);
            }

            .file-icon {
                position: relative;
            }

            .file-icon .page {
                font-size: 4em;
            }

            .file-icon .type {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                font-size: 1.5em;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '.drop-zone',
                event: 'dragover drop',
                listener: preventFileOpen
            },
            {
                selector: '.drop-zone',
                event: 'dragover dragenter',
                listener: addDragAndDropClass
            },
            {
                selector: '.drop-zone',
                event: 'dragleave dragend dragexit drop',
                listener: removeDragAndDropClass
            },
            {
                selector: '.drop-zone',
                event: 'drop',
                listener: drop
            },
            {
                selector: '.drop-zone-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    fileInput.click();
                }
            },
            {
                selector: `input[type='file']`,
                event: 'change',
                listener(event) {
                    addFiles(event.target.files);
                }
            }
        ]
    });

    /**
     * File upload preview
     */
    function updateFilePreview() {
        var input = component.find('#file_uploads');

        var curFiles = input.files;

        if (curFiles.length === 0) {
            preview.innerHTML = 'No files currently selected for upload';
        } else {
            var html = '<table style="border-collapse: collapse; border-spacing: 0px;">';

            for (var i = 0; i < curFiles.length; i++) {
                html += '<tr>' +
                    '<th style="text-align: left; border-bottom: solid 1px gray; padding: 4px">' + curFiles[i].name + '</th>' +
                    '<td style="text-align: right; border-bottom: solid 1px gray; padding: 4px">' + returnFileSize(curFiles[i].size) + '</td>' +
                    '</tr>';
            }

            html += '</table>';

            preview.innerHTML = html;
        }
    }

    function returnFileSize(number) {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        }
    }

    /**
     * Drag and Drop
     */
    function preventFileOpen(event) {
        console.log(event);
        event.preventDefault();

        return false;
    }

    function togglePointerEvents(value) {
        const dropZone = component.find('.drop-zone');

        [...dropZone.children].forEach(child => {
            child.style.pointerEvents = value;
        });
    }

    function addDragAndDropClass(event) {
        console.log(event);
        togglePointerEvents('none');

        event.target.classList.add('drag-over');
    }

    function removeDragAndDropClass(event) {
        togglePointerEvents('unset');

        event.target.classList.remove('drag-over');
    }

    /**
     * Attach Files
     */
    let files = [];

    function drop(event) {
        addFiles(event.dataTransfer.files);
    }

    function addFiles(fileList) {
        // Use DataTransferItemList interface to access the file(s)
        [...fileList].forEach(file => {
            const alreadyDropped = files.find(droppedFile => droppedFile.name === file.name);

            if (!alreadyDropped) {
                files.push(file);
            } else {
                console.log('File already added!');
            }
        });

        updateFilePreview();
    }

    function updateFilePreview() {
        let html = '';

        files.forEach(file => {
            const ext = file.name.split('.').pop();

            html += /*html*/ `
                <div class='file-preview' draggable='true'>
                    <div class='file-icon'>
                        <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                        <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                    </div>
                    <div class='file-preview-name'>${file.name}</div>
                    <span class='file-preview-remove'>Remove</span>
                </div>
            `;
        });

        const previewContainer = component.find('.drop-zone-preview-container');

        previewContainer.innerHTML = html;

        const icons = component.findAll('.file-preview');

        icons.forEach(icon => {
            const removeButton = icon.querySelector('.file-preview-remove');

            removeButton.addEventListener('click', removeFilePreview);

            // icon.addEventListener('dragstart', event => {
            //     event.dataTransfer.setData('text/plain', 'This node may be dragged');
            //     event.dataTransfer.effectAllowed = 'move';
            // });
            // window.addEventListener('dragover', event => {
            //     event.preventDefault();
            //     event.dataTransfer.dropEffect = 'move'
            //     togglePointerEvents('none');
            // });
        });
    }

    function removeFilePreview(event) {
        const fileName = this.previousElementSibling.innerText;
        const file = files.find(file => file.name === fileName);
        const index = files.indexOf(file);

        files.splice(index, 1);

        this.closest('.file-preview').remove();
    }

    function selectIcon(ext) {
        switch (ext) {
            case 'doc':
            case 'docx':
                return 'microsoftword';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'microsoftpowerpoint';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'microsoftexcel';
            case 'pdf':
                return 'adobeacrobatreader';
            default:
                return 'file-text2';
        }
    }

    component.getFieldData = () => {
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Attachments(param) {
    const {
        attachments, list, itemId, label, labelWeight, labelSize, parent, position, onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='attachments'>
                ${label ? /*html*/ `<div class='attachments-label'>${label}</div>` : ''}
                <div class='attachments-links-container'>
                    ${addLinks()}
                </div>
            </div>
        `,
        style: /*css*/ `
            .attachments-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding-bottom: 5px;
            }

            #id .attachment-row {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }

            #id .remove-row {
                cursor: pointer;
                padding: 2px 4px;
                margin-left: 5px;
                /* margin-left: 20px; */
                /* background: firebrick;
                color: white; */
                color: darkslategray;
                border-radius: 4px;
                /* font-size: .8em; */
                font-size: 1.5em;
                line-height: 0;
            }

            /** Icons */
            .file-icon {
                display: inline-block;
                position: relative;
                margin-right: 5px;
            }

            .file-icon .page {
                font-size: 2em;
                stroke: ${App.defaultColor};
                fill: ${App.defaultColor}
            }

            .file-icon .type {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                font-size: 1em;
            }
            
            /** None */
            #id .none {
                font-size: 1em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .remove-row',
                event: 'click',
                listener: removeRow
            }
        ]
    });

    function addLinks() {
        let html = '';

        if (attachments.length > 0) {
            attachments.forEach(file => {
                html += linkTemplate(file);
            });
        } else {
            html += /*html*/ `
                <div class='none'>None</div>
            `;
        }

        return html;
    }

    function linkTemplate(file) {
        const ext = file.FileName.split('.').pop();

        // console.log(file);
        return /*html*/ `
            <div class='attachment-row' data-uri='${file.__metadata.uri}' data-name='${file.FileName}'>
                <div class='file-icon'>
                    <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                    <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                </div>
                <span>
                    <a href='${file.ServerRelativeUrl}' target='_blank'>${file.FileName}</a>
                </span>
                <span class='remove-row'>&times;</span>
            </div>
        `;
    }

    function selectIcon(ext) {
        switch (ext.toLowerCase()) {
            case 'doc':
            case 'docx':
                return 'microsoftword';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'microsoftpowerpoint';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'microsoftexcel';
            case 'pdf':
                return 'adobeacrobatreader';
            default:
                return 'file-text2';
        }
    }

    async function removeRow(event) {
        const row = event.target.closest('.attachment-row');
        const check = confirm(`Are you sure you want to delete '${row.dataset.name}'?`);

        if (check) {
            await DeleteAttachments({
                list,
                itemId,
                fileNames: [
                    row.dataset.name
                ]
            });

            row.remove();

            const rows = component.findAll('.attachment-row');

            if (rows.length === 0) {
                component.find('.attachments-links-container').innerHTML = /*html*/ `<div class='none'>None</div>`;
            }

            if (onDelete) {
                onDelete();
            }
        }
    }

    /**
     * This is the eager way to do it.
     *
     * @todo check if file already present
     */
    component.refresh = (attachments) => {
        /** Set HTML */
        if (attachments.length > 0) {
            component.find('.attachments-links-container').innerHTML = attachments.map(file => linkTemplate(file)).join('\n');
        }

        /** Add event listeners */
        component.findAll('.remove-row').forEach(item => {
            item.addEventListener('click', removeRow);
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function BannerMenu() {
    const confirmModal = Modal({
        scrollable: true,
        centered: true,
        disableBackdropClose: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            confirmModal.find('.modal-dialog').style.maxWidth = '700px';

            Style({
                name: 'edit-banner',
                style: /*css*/`
                    .field .alert:focus {
                        outline: none;
                    }

                    .field .label {
                        width: 100px;
                        font-weight: 500;
                        font-size: 15px;
                    }

                    .field-row {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                    }
                    
                    .field-row .field-cell {
                        flex: 1;
                        font-size: 13px;
                        border-radius: 10px;
                        padding: 6px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 150ms ease-in-out;
                    }

                    .field-row .field-cell:not(:last-child) {
                        margin-right: 10px;
                    }

                    .field-row .default {
                        background: var(--primary-20);
                        color: var(--primary-hsl-5);
                    }

                    .field-row .default.heavy {
                        background: var(--primary);
                        color: var(--secondary);
                    }

                    .field-row .greeting {
                        background: #c3e9c7;
                        color: #1d7130;
                    }

                    .field-row .greeting.heavy {
                        background: seagreen;
                        color: var(--secondary);
                    }

                    .field-row .position {
                        background: lightgray;
                    }
                `
            });

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <!-- Title -->
                <h3 class='mb-3'>Banner</h3>
                <!-- Switch -->
                <div class='d-flex align-items-center'>
                    <div style='font-size: 14px; font-weight: 500;'>Display a banner on all routes?</div>
                    <div class="custom-control custom-switch grab switch">
                        <input type="checkbox" class="custom-control-input" id='os-switch' data-mode='os'>
                        <label class="custom-control-label" for="os-switch"></label>
                    </div>
                </div>
                <!-- Field -->
                <div class='field'>
                    <!-- Instructions -->
                    <div class='form-field-description text-muted mb-3' style='font-size: 14px;'>
                        Enter your message in the banner below.
                    </div>
                    <!-- Message -->
                    <div style='margin-bottom: 40px;'>
                        <!-- <div class='label mb-3'>Message</div> -->
                        <div class='d-flex justify-content-between' style='font-size: 13px; margin-bottom: 10px;'>
                            <div>Bold</div>
                            <div>Italic</div>
                            <div>Underline</div>
                            <div>Horizontal Rule</div>
                            <div>Heading</div>
                            <div>Paragraph</div>
                            <div>List</div>
                        </div>
                        <div class='alert alert-robi-primary mb-0 w-100' contenteditable='true'>
                            Test
                        </div>
                    </div>
                    <!-- Color -->
                    <div class='d-flex mb-3'>
                        <div class='label'>Color</div>
                        <div class='w-100'>
                            <!-- Light -->
                            <div class='field-row mb-2'>
                                <div class='field-cell default'>
                                    Default
                                </div>
                                <div class='field-cell greeting'>
                                    Greeting
                                </div>
                                <div class='field-cell notice'>
                                    Notice
                                </div>
                                <div class='field-cell warning'>
                                    Warning
                                </div>
                                <div class='field-cell error'>
                                    Error
                                </div>
                            </div>
                            <!-- Heavy -->
                            <div class='field-row'>
                                <div class='field-cell default heavy'>
                                    Default
                                </div>
                                <div class='field-cell greeting heavy'>
                                    Greeting
                                </div>
                                <div class='field-cell notice heavy'>
                                    Notice
                                </div>
                                <div class='field-cell warning heavy'>
                                    Warning
                                </div>
                                <div class='field-cell error heavy'>
                                    Error
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Position -->
                    <div class='d-flex'>
                        <div class='label'>Position</div>
                        <div class='field-row'>
                            <div class='field-cell position'>
                                Top
                            </div>
                            <div class='field-cell position'>
                                Right
                            </div>
                            <div class='field-cell position'>
                                Bottom
                            </div>
                            <div class='field-cell position'>
                                Left
                            </div>
                        </div>
                    </div>
                </div>
            `);

            const btnContainer = Container({
                margin: '50px 0px 0px 0px',
                width: '100%',
                parent: modalBody
            });

            btnContainer.add();

            const leftContainer = Container({
                flex: 2,
                align: 'start',
                parent: btnContainer
            });

            leftContainer.add();

            const previewBtn = Button({
                async action() {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        
                    });

                    confirmModal.close();
                },
                classes: ['p-0'],
                parent: leftContainer,
                type: 'robi-light',
                value: 'Preview'
            });

            previewBtn.add();

            const rightContainer = Container({
                parent: btnContainer
            });

            rightContainer.add();

            const cancelBtn = Button({
                action(event) {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        
                    });

                    confirmModal.close();
                },
                classes: [],
                parent: rightContainer,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            const okBtn = Button({
                async action() {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        
                    });

                    confirmModal.close();
                },
                // disabled: true,
                classes: [],
                parent: rightContainer,
                type: 'robi',
                value: 'OK'
            });

            okBtn.add();
        }
    });

    confirmModal.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function BootstrapTextarea(param) {
    const {
        label, parent, position, classes, value,
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='form-group'>
                    <label>${label}</label>
                    <textarea class='form-control' rows='3' ${value ? `value=${value}` : ''}></textarea>
                </div>
            </div>
        `,
        style: /*css*/ `
           #id label {
               font-weight: 500;
           }
        `,
        parent,
        position,
        events: [],
        onAdd() {
        }
    });

    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function BuildInfo({ parent }) {
    const card = Container({
        width: '100%',
        direction: 'column',
        padding: '0px 20px',
        margin: '0px 0px 40px 0px',
        height: '100px',
        parent
    });

    card.add();

    // Show loading
    const loadingIndicator = LoadingSpinner({
        message: 'Loading robi build',
        type: 'robi',
        parent: card
    });

    loadingIndicator.add();

    // Settings
    const appSettings = await Get({
        list: 'Settings',
        filter: `Key eq 'Build' or Key eq 'Version'`
    });

    // Remove loading
    loadingIndicator.remove();

    // Version
    const nameField = SingleLineTextField({
        label: 'Version',
        value: appSettings.find(item => item.Key === 'Version')?.Value,
        readOnly: true,
        parent: card
    });

    nameField.add();

    // Build
    const accountField = SingleLineTextField({
        label: 'Build',
        value: appSettings.find(item => item.Key === 'Build')?.Value,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: card
    });

    accountField.add();

    const upgrade = UpgradeAppButton({
        parent
    });

    upgrade.add();
}

/**
 * {@link https://getbootstrap.com/docs/4.5/components/buttons/}
 *
 * @example btn-robi-primary
 * @example btn-secondary
 * @example btn-success
 * @example btn-danger
 * @example btn-warning
 * @example btn-info
 * @example btn-light
 * @example btn-dark
 *
 * @example btn-outline-robi-primary
 * @example btn-outline-secondary
 * @example btn-outline-success
 * @example btn-outline-danger
 * @example btn-outline-warning
 * @example btn-outline-info
 * @example btn-outline-light
 * @example btn-outline-dark
 *
 * @param {Object} param
 * @returns
 */
export function Button(param) {
    const {
        action, disabled, parent, position, classes, style, type, value, icon, size, fill
    } = param;

    const component = Component({
        html: /*html*/ `
            <button type="button" class="btn btn-${type} ${classes?.join(' ')}" ${disabled ? 'disabled' : ''} ${style ? `style='${style}'` : ''}>
                ${value ? value : ''}
                ${
                    icon ? /*html*/ `
                        <svg class='icon' style='font-size: ${size}; fill: ${fill || 'var(--color)'};'>
                            <use href='#icon-${icon}'></use>
                        </svg>
                    ` : ''
                }
            </button>
        `,
        style: /*css*/ `
            #id.w-fc {
                width: fit-content;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener: action
            }
        ]
    });

    component.enable = () => {
        component.get().disabled = false;
    };

    component.disable = () => {
        component.get().disabled = true;
    };

    return component;
}

/**
 * Modified from: https://codepen.io/zellwk/pen/xNpKwp
 * 
 * @param {*} param
 * @returns
 */
export function Calendar(param) {
    const {
        wide,
        onChange,
        parent,
        position
    } = param;

    let events = param.events || [];

    let date = param.date ? new Date(param.date) : new Date();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const component = Component({
        html: /*html*/ `
            <div class='calendar'>
                <div class='month'>
                    <svg class='icon prev'>
                        <use href='#icon-bs-chevron-compact-left'></use>
                    </svg>
                    <div class='date'>
                        ${title()}
                    </div>
                    <svg class='icon next'>
                        <use href='#icon-bs-chevron-compact-right'></use>
                    </svg>
                </div>
                <div class='weekdays'>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class='days'>
                    ${days()}
                </div>
            </div>
        `,
        style: /*css*/ `
            .calendar {
                width: ${wide ? '100%' : '364px'};
                border-radius: 30px;
                -webkit-border-radius: 30px;
                -moz-border-radius: 30px;
                -ms-border-radius: 30px;
                -o-border-radius: 30px;
                user-select: none;
            }
            
            .month {
                width: 100%;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-align: center;
            }
            
            .month .icon {
                cursor: pointer;
                font-size: 22px;
                fill: var(--primary);
            }
            
            .month h6 {
                margin-bottom: 4px;
                font-weight: 700;
                color: var(--primary);
            }
            
            .month time {
                cursor: pointer;
                font-size: 13px;
            }
            
            .weekdays {
                width: 100%;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
            }
            
            .weekdays div {
                font-size: 14px;
                width: ${wide ? 'calc(100% / 7)' : 'calc(364px / 7)'};
                ${wide ? 'margin: 6px;' : ''}
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .days {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
            }
            
            .days div {
                margin: 6px;
                font-size: 13px;
                width: ${wide ? 'calc(( 100% - 84px ) / 7)' : 'calc(280px / 7)'};
                height: ${wide ? '50px' : '40px'};
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background-color 0.2s;
                -webkit-transition: background-color 0.2s;
                -moz-transition: background-color 0.2s;
                -ms-transition: background-color 0.2s;
                -o-transition: background-color 0.2s;
            }
            
            .prev-date,
            .next-date {
                opacity: 0.5;
            }
            
            .today {
                background-color: var(--primary);
                color: var(--secondary);
                border-radius: 10px;
            }

            .event {
                font-weight: 500;
                background-color: var(--primary-19);
                color: var(--primary);
                border-radius: 10px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .prev',
                event: 'click',
                listener(event) {
                    rebuild(-1);
                }
            },
            {
                selector: '#id .next',
                event: 'click',
                listener(event) {
                    rebuild(1);
                }
            },
            {
                selector: '#id .month time',
                event: 'click',
                listener(event) {
                    rebuild();
                }
            }
        ],
        onAdd() {

        }
    });

    function title() {
        return /*html*/ `
            <h6>${months[date.getMonth()]} ${date.getFullYear()}</h6>       
            <time datetime='${date.getFullYear()}-${date.toLocaleDateString('en-US', { month: '2-digit' })}'>
                ${new Date().toDateString()}
            </time>
        `
    }

    function days() {
        // console.log('Events:', events.map(d => d.toDateString()));

        date.setDate(1);

        const lastDay = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();

        const prevLastDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            0
        ).getDate();

        const firstDayIndex = date.getDay();

        const lastDayIndex = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDay();

        const nextDays = 7 - lastDayIndex - 1;

        let days = '';

        for (let x = firstDayIndex; x > 0; x--) {
            const day = prevLastDay - x + 1;
            const { dateTime, isEvent } = getDate(day, -1);

            days += /*html*/ `
                <div class='prev-date ${isEvent ? 'event' : ''}'>
                    <time datetime='${dateTime}'>${day}</time>
                </div>
            `;
        }

        for (let i = 1; i <= lastDay; i++) {
            const { dateTime, isEvent } = getDate(i);

            days += /*html*/ `
                <div class='${i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear() ? 'today' : ''} ${isEvent ? 'event' : ''}'>
                    <time datetime='${dateTime}'>${i}</time>
                </div>
            `;
        }

        for (let j = 1; j <= nextDays; j++) {
            const { dateTime, isEvent } = getDate(j, 1);

            days += /*html*/ `
                <div class='next-date ${isEvent ? 'event' : ''}'>
                    <time datetime='${dateTime}'>${j}</time>
                </div>
            `;
        }

        return days;
    }

    function getDate(d, m = 0) {
        const day = new Date(date.getFullYear(), date.getMonth() + m, d);
        const dateTime = day.toISOString().split('T')[0];
        const isEvent = events.map(date => date.toLocaleDateString()).includes(day.toLocaleDateString());

        // console.log('Day:', day.toLocaleDateString());

        return {
            day,
            dateTime: dateTime,
            isEvent
        }
    }

    function rebuild(offset) {
        if (typeof offset === 'number') {
            date.setMonth(date.getMonth() + offset);
        } else {
            date = new Date();
        }

        if (onChange) {
            onChange(date);
        }

        render();
    }

    function render() {
        component.find('.date').innerHTML = title();
        component.find('.days').innerHTML = days();

        component.find('.month time').on('click', () => {
            rebuild();
        })
    }

    component.setEvents = (newEvents) => {
        events = newEvents;
    }

    component.setDate = (d) => {
        date = new Date(d);

        // if (onChange) {
        //     onChange(date);
        // }

        render();
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Card(param) {
    const {
        action,
        background,
        classes,
        description,
        margin,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        padding,
        parent,
        position,
        radius,
        title,
        titleBackground,
        titleBorder,
        titleColor,
        titleWeight,
        width
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='round-card ${classes ? classes.join(' ') : ''}'>
                ${title ? /*html*/ `<div class='round-card-title'>${title}</div>` : ''}
                ${description ? /*html*/ `<div class='mt-2 round-card-description'>${description}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.round-card {
                display: inline-flex;
                flex-direction: column;
                background: ${background ||'var(--secondary)'};
                padding: ${padding || title ? '20px' : '0px 20px'};
                margin: ${margin || '0px'};
                min-width: ${minWidth || 'initial'};
                min-height: ${minHeight || 'initial'};
                max-width: ${maxWidth || 'initial'};
                max-height: ${maxHeight || 'initial'};
                width: ${width || 'initial'};
                border-radius: ${radius || '10px'};
                border: none;
                cursor: ${action ? 'pointer' : 'initial'};
            }

            #id .round-card-title {
                font-size: 20px;
                margin: ${padding === '0px' ? `0px` : '-20px -20px 0px -20px'}; /** FIXME: will break with passed in padding  */
                padding: 10px 20px; /** FIXME: will break with passed in padding  */
                font-weight: ${titleWeight || '700'};
                background: ${titleBackground || 'inherit'}; /** FIXME: Experimental */ /* alternate color: #d0d0d04d */
                border-radius: 20px 20px 0px 0px;
                color: ${titleColor || 'var(--color)'};
                border-bottom: ${titleBorder || `solid 1px var(--border-color)`};
            }

            #id .round-card-description {
                
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener: (event) => {
                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Cell(render, options = {}) {
    const { 
        parent,
        height,
        minHeight,
        maxWidth,
        display,
        flex,
        background,
        radius,
        padding,
        type,
        narrowPadding,
        narrowWidth,
        responsive
    } = options;
    
    const id = Store.getNextCell();

    const component = Component({
        html: /*html*/ `
            <div class='robi-cell ${type}' data-row='${id}'></div>
        `,
        style: /*css*/ `
            #id.robi-cell {
                display: ${display || 'block'};
                ${height ? `height: ${height};` : ''}
                ${minHeight ? `min-height: ${minHeight};` : ''}
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${flex ? `flex: ${flex};` : ''}
                ${background ? `background: ${background};` : ''}
                ${radius ? `border-radius: ${radius};` : ''}
                ${padding ? `padding: ${padding};` : ''}
            }

            /* NOTE: Testing */
            #id.robi-cell.bordered {
                padding: 30px;
                border: solid 1px var(--border-color);
                box-shadow: 4px 4px 0px 0px var(--border-color);
                border-radius: 30px;
            }
        `,
        parent: parent || Store.get('viewcontainer'),
        events: [],
        onAdd() {
            render(component);

            if (responsive) {
                resize();

                window.addEventListener('resize', resize);

                function resize() {
                    const node = component.get();

                    if (!node) {
                        return;
                    }

                    if (window.innerWidth <= 1600) {
                        node.style.maxWidth = '100%';
                        node.style.marginBottom = '30px';
                        node.style.marginRight = '0px';
                    } else {
                        node.style.maxWidth = maxWidth || 'fit-content';
                        node.style.marginBottom = '0px';
                        node.style.marginRight = '30px';
                    }
                }
            }

            // if (responsive) {
            //     const node = component.get();

            //     if (!node) {
            //         return;
            //     }

            //     if (window.innerWidth <= 1600) {
            //         node.style.padding = narrowPadding || '0px';
            //         node.style.maxWidth = 'unset';
            //         node.style.margin = '0px';
            //     } else {
            //         node.style.padding = padding || '0px';
            //         node.style.margin = '0px';
            //         node.style.maxWidth = maxWidth || 'unset';
            //     }

            //     window.addEventListener('resize', event => {
            //         const node = component.get();

            //         if (!node) {
            //             return;
            //         }

            //         if (window.innerWidth <= 1600) {
            //             node.style.padding = narrowPadding || '0px';
            //             node.style.maxWidth = 'unset';
            //             node.style.margin = '0px';
            //         } else {
            //             node.style.padding = padding || '0px';
            //             node.style.maxWidth = 'unset';
            //             node.style.maxWidth = maxWidth || 'unset';
            //         }
            //     });
            // }
        }
    });

    component.add();
}

/**
 * 
 * @param {*} param 
 */
export function ChangeTheme(param) {
    const { parent } = param;

    const card = Container({
        display: 'block',
        width: '100%',
        maxWidth: '995px',
        margin: '0px 0px 30px 0px',
        parent
    });

    card.add();

    // Theme
    const themeField = ThemeField({
        selected: App.get('theme'),
        margin: '0px 0px 30px 0px',
        label: false,
        parent: card
    });

    themeField.add();

    // Button
    const updateThemeBtn = Button({
        type: 'robi',
        value: 'Change theme',
        classes: ['w-100'],
        parent: card,
        async action() {
            const { primary } = Themes.find(theme => theme.name === themeField.value());

            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                shadow: true,
                async addContent(modalBody) {
                    modal.find('.modal-content').style.width = 'unset';

                    const loading = LoadingSpinner({
                        message: `<span style='color: ${primary};'>Changing theme<span>`,
                        color: primary,
                        classes: ['p-4'],
                        parent: modalBody
                    });
        
                    loading.add();
                },
                centered: true,
                showFooter: false,
                position: 'afterend'
            });

            modal.add();

            // Blur entire app
            document.querySelector('#app').style.transition = 'filter 150ms';
            document.querySelector('#app').style.filter = 'blur(5px)';

            let digest;
            let request;

            if (App.isProd()) {
                digest = await GetRequestDigest();
                request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                    method: 'GET',
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': digest
                    }
                });
            } else {
                request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                await Wait(1000);
            }

            let content = await request.text();
            
            // Update theme
            content = content.replace(/\/\* @START-theme \*\/([\s\S]*?)\/\* @END-theme \*\//, `/* @START-theme */'${themeField.value()}'/* @END-theme */`);

            let setFile;

            if (App.isProd()) {
                // TODO: Make a copy of app.js first
                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                    method: 'POST',
                    body: content, 
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': digest
                    }
                });
            } else {
                setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                    method: 'POST',
                    body: content
                });
                await Wait(1000);
            }

            console.log('Saved:', setFile);

            if (App.isProd()) {
                // Wait additional 2s
                console.log('Waiting...');
                await Wait(5000);
                location.reload();
            } else { 
                location.reload();
            }

            modal.close();
        }
    });

    updateThemeBtn.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ChartButtons(param) {
    const {
        margin, padding, data, parent, position, onClick
    } = param;

    const {
        visits,
    } = data;

    const component = Component({
        html: /*html*/ `
            <div class='chart-container'>
                <!-- Chart -->
                <div class='chart' style='flex: 4;'>
                    <div class='chart-title'></div>
                    <div class='chart-canvas'>
                        <canvas class="myChart" height='300'></canvas>
                    </div>
                </div>
                <!-- Text -->
                <div class='chart' style='flex: 1'>
                    <div class='visits-label'>Visits</div>
                    ${createInfoGroup('Today', 'today')}
                    ${createInfoGroup('This Week', 'week')}
                    ${createInfoGroup('This Month', 'month')}
                    ${createInfoGroup('This Year', 'year')}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                background: var(--secondary);
                border-radius: 4px;
                display: flex;
                overflow: auto;
            }

            /** Left/Right Containers */
            #id .chart {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
            }

            /** Text */
            #id .visits-label {
                text-align: center;
                font-weight: 700;
                font-size: 18px;
                margin-bottom: 12px;
            }

            #id .info-group {
                cursor: pointer;
                margin: 5px 0px;
            }

            #id .chart-container-info {
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }

            #id .chart-container-info.smaller {
                font-size: .8em;
            }

            #id .chart-container-info-label {
                font-weight: 500;
                margin-right: 30px;
            }

            /** Chart */
            #id .chart-canvas {
                position: relative;
                margin-right: 15px;
                margin-bottom: 15px;
            }

            #id .chart-title {
                margin-top: 15px;
                color: var(--color);
                font-size: 1.1em;
                font-weight: 700;
                text-align: center;
            }

            /** Label */
            #id .info-group {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }

            #id .info-group button {
                flex: 1;
                white-space: nowrap;
            }

            #id .info-count {
                border-radius: 8px;
                padding: 5px;
                border: none;
                width: 70px;
                text-align: center;
                font-weight: 700;
            }

            /* Testing Placeholder shimmer */
            .shimmer {
               background: #f6f7f8;
               background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
               background-repeat: no-repeat;
               background-size: 800px 104px; 
               display: inline-block;
               position: relative; 
               
               -webkit-animation-duration: 1s;
               -webkit-animation-fill-mode: forwards; 
               -webkit-animation-iteration-count: infinite;
               -webkit-animation-name: placeholderShimmer;
               -webkit-animation-timing-function: linear;
            }
             
             @-webkit-keyframes placeholderShimmer {
                0% {
                    background-position: -468px 0;
                }
               
                100% {
                    background-position: 468px 0; 
                }
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .info-group',
                event: 'click',
                listener(event) {
                    const label = this.dataset.label;

                    if (label) {
                        onClick(label);
                    }
                }
            }
        ]
    });

    function createInfoGroup(label, property) {
        return /*html*/ `
            <div class="info-group" data-label='${property}'>
                <div class="info-count">${visits[property].length}</div>
                <button type='button' class='btn btn-robi'>${label}</button>
            </div>
        `;
    }

    component.setTitle = (text) => {
        const title = component.find('.chart-title');

        title.innerText = text;
    };

    component.clearChart = () => {
        const chartContainer = component.find('.chart-canvas');

        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" height='300'></canvas>`;
    };

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ChartJs(param) {
    const {
        margin, padding, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='chart'>
                <div class='chart-title'></div>
                <div class='chart-container'>
                    <canvas class="chart-canvas" height='300'></canvas>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                border-radius: 10px;
                width: 100%;
            }

            /** Chart */
            #id .chart-container {
                position: relative;
                margin-top: 10px;
            }

            #id .chart-title {
                min-height: 27px;
                color: var(--color);
                font-size: 18px;
                font-weight: 500;
                text-align: center;
                transition: opacity 500ms ease;
                opacity: 0;
            }
        `,
        parent,
        position,
        events: [

        ]
    });

    // TODO: This should live in Chart component
    // Add chart
    component.setChart = (param) => {
        const { data, stepSize } = param;

        const chart = component.getChart();

        if (!chart) {
            return;
        }

        return new Chart(chart, {
            type: 'bar',
            data,
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            // borderColor: App.get('primaryColor'),
                            borderColor: App.get('borderColor'),
                            // display: false
                        },
                        stacked: true,
                        ticks: {
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                            },
                            color: App.get('defaultColor'),
                            beginAtZero: true
                        }
                    },
                    y: {
                        grid: {
                            // borderColor: App.get('primaryColor'),
                            borderColor: App.get('borderColor'),
                            // display: false
                        },
                        stacked: true,
                        ticks: {
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                            },
                            color: App.get('defaultColor'),
                            min: 0,
                            stepSize
                        }
                    }
                }
            }
        });
    }

    component.setTitle = (text) => {
        const title = component.find('.chart-title');

        if (title) {
            title.innerText = text;
            title.style.opacity = '1';
        }
    };

    component.clearChart = () => {
        const chartContainer = component.find('.chart-container');

        chartContainer.innerHTML = /*html*/ `<canvas class="chart-canvas" height='300'></canvas>`;
    };

    component.getChart = () => {
        return component.find('.chart-canvas')?.getContext('2d');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ChoiceField(param) {
    const {
        onChange,
        buttonStyle,
        classes,
        description,
        fillIn,
        fieldMargin,
        flex,
        label,
        maxHeight,
        maxWidth,
        onFocusout,
        options,
        padding,
        parent,
        position,
        readOnly,
        value,
        valueType,
        validate
    } = param;

    if (fillIn) {
        const choices = options.map(o => o.label);
        const component = Component({
            html: /*html*/ `
                <div class='form-field'>
                    ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                    ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                    <div class='checkbox-container'>
                        ${
                            choices.map(choice => {
                                const id = GenerateUUID();
    
                                return /*html*/ `
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="${id}" data-label='${choice}' ${value === choice ? 'checked' : ''}>
                                        <label class="custom-control-label" for="${id}">${choice}</label>
                                    </div>
                                `;
                            }).join('\n')
                        }
                        ${
                            (() => {
                                const id = GenerateUUID();
                                // FIXME: this wil probably break if fill in choice is the same as one of the choices
                                const otherValue = value && !choices.includes(value) ? value : '';
    
                                return /*html*/ `
                                    <div class="custom-control custom-checkbox d-flex align-items-center">
                                        <input type="checkbox" class="custom-control-input other-checkbox" id="${id}" data-label='Other' ${otherValue ? 'checked' : ''}>
                                        <label class="custom-control-label d-flex align-items-center other-label" for="${id}">Other</label>
                                        <input type='text' class='form-control ml-2 Other' value='${otherValue || ''}' list='autocompleteOff' autocomplete='new-password'>
                                    </div>
                                `;
                            })()
                        }
                    </div>
                </div>
            `,
            style: /*css*/ `
                #id.form-field {
                    position: relative;
                    margin: ${fieldMargin || '0px 0px 20px 0px'};
                    width: inherit;
                    ${flex ? `flex: ${flex};` : ''}
                }
    
                #id label {
                    font-weight: 500;
                }
    
                #id .form-field-description {
                    font-size: 14px;
                    margin-bottom:  0.5rem;
                }
                
                #id .custom-control-label {
                    font-size: 13px;
                    font-weight: 400;
                    white-space: nowrap;
                }
                
                #id .checkbox-container {
                    border-radius: 10px;
                }
            `,
            parent: parent,
            position,
            events: [
                {
                    selector: '#id .custom-control-input',
                    event: 'change',
                    listener(event) {
                        console.log(event.target.checked);

                        // Deselect all
                        component.findAll('.custom-control-input').forEach(node => node.checked = false);

                        // Except current
                        event.target.checked = true;

                        // FIXME: is this necessary?
                        // Remove other text if not selected
                        if (!event.target.classList.contains('other-checkbox')) {
                            component.find('.Other').value = '';
                        }
    
                        if (validate) {
                            validate();
                        }
    
                        if (onChange) {
                            onChange(event);
                        }
                    }
                },
                {
                    selector: '#id .Other',
                    event: 'click',
                    listener(event) {
                        // Deselect all
                        component.findAll('.custom-control-input').forEach(node => node.checked = false);

                        // But not .other-checkbox
                        component.find('input[data-label="Other"]').checked = true;
                    }
                },
                {
                    selector: '#id .Other',
                    event: 'focusout',
                    listener(event) {
                        if (!event.target.value) {
                            component.find('input[data-label="Other"]').checked = false;
                        }
                    }
                },
                {
                    selector: '#id .Other',
                    event: 'keyup',
                    listener(event) {
                        if (event.target.value && onChange) {
                            onChange(event);
                        }
                    }
                },
                {
                    selector: '#id .Other',
                    event: 'focusout',
                    listener(event) {
                        if (validate) {
                            validate(event);
                        }
                    }
                }
            ],
        });
    
        component.isValid = (state) => {
            const node = component.find('.is-valid-container');
    
            if (node) {
                node.remove();
            }
    
            if (state) {
                setState('bs-check-circle-fill', 'seagreen');
            } else {
                setState('bs-exclamation-circle-fill', 'crimson');
            }

            function setState(icon, color) {
                component.find('.field-label').style.color = color;
                component.append(/*html*/ `
                    <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                        <svg class='icon' style='fill: ${color}; font-size: 22px;'>
                            <use href='#icon-${icon}'></use>
                        </svg>
                    </div>
                `);
            }
        };
    
        // TODO: Set value
        component.value = (param, options = {}) => {
            const checked = component.find('.custom-control-input:checked');

            if (checked.classList.contains('other-checkbox')) {
                console.log(component.find('.Other').value);
                return component.find('.Other').value;
            } else {
                return checked.dataset.label;
            }
        };
    
        return component;
    }

    const id = GenerateUUID();

    const component = Component({
        html: /*html*/ `
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='dropdown'>
                    ${
                        readOnly ? 
                        /*html*/ `
                            ${
                                (() => {
                                    const { label, path, id } = value;

                                    return /*html*/ `
                                        <div class='btn btn-choice' style='cursor: initial;' data-id='${id}'>
                                            <span data-path='${path || ''}' >${label}</span>
                                        </div>
                                    `;
                                })()
                            }
                        ` : 
                        /*html*/ `
                            <button class='btn btn-choice dropdown-toggle' ${buttonStyle ? `style='${buttonStyle}'` : ''} type='button' id='${id}' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                ${value || `<span style='opacity: 0;'>Choose</span>`}
                            </button>
                            <div class='dropdown-menu' aria-labelledby='${id}'>
                                <div class='scroll-container'>
                                    ${buildDropdown(options)}
                                </div>
                            </div>   
                        `
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                padding: ${padding || '0px'};
                ${flex ? `flex: ${flex};` : ''}
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .dropdown-item {
                font-size: 13px;
                cursor: pointer;
            }

            #id .dropdown-menu {
                margin: 5px 0px 0px 0px;
                padding: .125rem;
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${maxWidth ? `min-width: ${maxWidth};` : ''}
            }

            #id .dropdown-item {
                border-radius: 8px;
            }

            #id .dropdown-item:hover {
                background: var(--primary-20);
            }

            #id .scroll-container {
                overflow: overlay;
                ${maxHeight ? `max-height: ${maxHeight};` : ''}
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
            }

            #id .scroll-container::-webkit-scrollbar-thumb {
                min-height: 20px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener: selectOption
            },
            {
                selector: `#id .dropdown-toggle`,
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    function buildDropdown(items) {
        return items
            .map(dropdown => dropdownTemplate(dropdown))
            .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label, path, id
        } = dropdown;

        return /*html*/ `
            <button type='button' class='dropdown-item' data-path='${path || ''}' data-id='${id}'>${label}</button>
        `;
    }

    function selectOption(event) {
        if (valueType === 'html') {
            // component.find('.dropdown-toggle').innerHTML = this.querySelector('[data-target="true"').innerHTML;
            component.find('.dropdown-toggle').innerHTML = this.innerHTML;
        } else {
            component.find('.dropdown-toggle').innerText = event.target.innerText;
        }

        component.find('.dropdown-toggle').dataset.id = this.dataset.id;

        if (onChange) {
            onChange(event);
        }
    }

    component.setDropdownMenu = (list) => { // Edited by LBunker on 2022-03-21
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', selectOption);
        });
    };

    component.value = (param) => {
        const field = component.find('.btn-choice');
        
        if (param !== undefined) {
            let label = typeof param === 'object' ? param.label : param;
            if (valueType === 'html') {
                field.innerHTML = label;
            } else {
                field.innerText = label;
            }
            if (param.id) {
                field.dataset.id = param.id;
            }
            if (param.path) {
                field.dataset.path = param.path;
            }
        } else {
            if (valueType === 'html') {
                return component.find('.btn-choice');
            } else {
                return field.innerText === 'Choose' ? '' : field.innerText;
            }
        }
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };

    component.selected = () => {
        const field = component.find('.btn-choice');

        return readOnly ? value.path : options.find(item => item.label === field.innerText)?.path;
    };

    component.data = () => {
        return readOnly ? value : options[parseInt(component.find('.btn-choice').dataset.id)];
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Comments(param) {
    const {
        comments, parent, position, width, parentId
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <!-- Border -->
                <div class='comments-border'>
                    <div class='comments-border-count-container'>
                        <div class='comments-border-count'>
                            <span>${comments.length}</span>
                        </div>
                    </div>
                    <div class='comments-border-name'>
                        <div>${comments.length > 1 || comments.length === 0 ? 'Comments' : 'Comment'}</div>
                    </div>
                    <div class='comments-border-line-container'>
                        <div class='comments-border-line'></div>
                    </div>
                </div>
                <!-- Comments -->
                <div class='comments'>
                    <div class='reverse'>
                        ${createCommentsHTML()}
                    </div>
                </div>
                <!-- New Comment -->
                <div class='new-comment-container'>
                    <div class='new-comment' contenteditable='true'></div>
                    <!-- Button -->
                    <div class='new-comment-button-container'>
                        <div class='new-comment-button'>
                            <svg class='icon'>
                                <use href='#icon-arrow-up2'></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .comments-container {
                width: ${width || '100%'};
                max-height: 80vw;
                padding-bottom: 20px;
                /* border-bottom: solid 2px var(--primary); */
            }

            .comments-border {
                display: flex;
                flex-direction: row;
                margin-top: 30px;
            }

            .comments-border-count {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 5px 5px 5px 0px;
                background: var(--primary);
                display: grid;
                place-content: center;
            }

            .comments-border-count span {
                color: white;
                font-size: 1.5em;
                font-weight: 700;
            }

            .comments-border-name {
                display: grid;
                place-content: center;
                font-size: 1.5em;
                font-weight: 700;
            }

            .comments-border-line-container {
                flex: 2;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 10px 0px 10px 10px;
            }

            .comments-border-line {
                height: 2px;
                flex: 1;
                margin-top: 7px;
                background: var(--primary);
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: white;
                border-radius: 4px;
                margin: 10px 30px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                font-size: .9em;
                font-weight: 500;
                padding: 10px 20px;
                border-radius: 4px 0px 0px 4px;
                border-left: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 1px var(--primary);
                border-top: solid 1px var(--primary);
                border-bottom: solid 1px var(--primary);
            }

            #id .new-comment-button-container,
            #id .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px var(--primary);
                border-top: solid 1px var(--primary);
                border-bottom: solid 1px var(--primary);
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: inline-block;
                margin: 5px;
                padding: 5px 7.5px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: white;
                background: var(--primary);
            }

            #id .new-comment-button .icon {
                font-size: 1.2em;
            }

            /* Comments */
            #id .comments {
                display: flex;
                flex-direction: column-reverse;
                max-height: 60vh;
                padding: 0px 30px;
                overflow: overlay;
            }

            /* Comment */
            #id .comment-container {
                display: flex;
                justify-content: flex-start;
            }

            #id .comment {
                margin: 10px 0px;
                padding: 7.5px 15px;
                border-radius: 4px;
                background: rgba(${App.get('primaryColorRGB')}, .1);
                border: solid 1px rgba(0, 0, 0, .05);
                max-width: 70%;
            }

            #id .comment-date-container {
                display: flex;
                align-items: center;
                font-size: .8em;
            }

            #id .comment-author {
                font-weight: 500;
                padding-right: 10px;
            }

            #id .comment-text {
                display: flex;
                flex-direction: column;
                padding-top: 5px;
            }

            /* Current User Comment */
            #id .comment-container.mine {
                justify-content: flex-end;
            }

            #id .comment-container.mine .comment {
                background: rgba(${App.get('primaryColorRGB')}, .8);
                border: solid 1px transparent;
            }

            #id .comment-container.mine .comment * {
                color: white;
            }

            /** New Comment */
            /*
            #id .animate-new-comment {
                animation: slide-up 1000ms ease-out 0s forwards;
            }

            @keyframes slide-up {
                0% {
                    transform: translateY(100%);
                }

                100% {
                    transform: translateY(0%);
                }
            }
            */
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const Comment = field.innerHTML;
                    const SubmittedBy = Store.user().Title;
                    const LoginName = Store.user().LoginName;

                    if (Comment) {
                        const newItem = await CreateItem({
                            list: 'Comments',
                            data: {
                                FK_ParentId: parseInt(parentId),
                                Comment,
                                SubmittedBy,
                                LoginName
                            }
                        });

                        component.addComment(newItem, true);

                        field.innerHTML = '';
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    function createCommentsHTML() {
        let html = '';

        comments.forEach(item => {
            html += commentTemplate(item);
        });

        return html;
    }

    function dateTemplate(date) {
        const d = new Date(date);

        return /*html*/ `
            <div class='comment-date'>${d.toLocaleDateString()} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
        `;
    }

    function commentTemplate(comment, isNew) {
        return /*html*/ `
            <div class='comment-container${comment.LoginName === Store.user().LoginName ? ' mine' : ''}${isNew ? ' animate-new-comment' : ''}' data-itemid='${comment.Id}'>
                <div class='comment'>
                    <div class='comment-date-container'>
                        ${comment.LoginName !== Store.user().LoginName ? /*html*/ `<div class='comment-author'>${comment.SubmittedBy}</div>` : ''}
                        ${dateTemplate(comment.Created)}
                    </div>
                    <div class='comment-text'><div>${comment.Comment}</div></div>
                </div>
            </div>
        `;
    }

    component.addComment = (comment, scroll) => {
        const comments = component.findAll('.comment-container');
        const itemIds = [...comments].map(node => parseInt(node.dataset.itemid));

        if (itemIds.length > 0) {
            // console.log('new\t', itemIds, comment.Id);
            itemIds.push(comment.Id);
            itemIds.sort((a, b) => a - b);

            // console.log('sort\t', itemIds);
            const index = itemIds.indexOf(comment.Id);

            // console.log('index\t', index);
            comments[index - 1].insertAdjacentHTML('afterend', commentTemplate(comment, true));
        } else {
            component.find('.reverse').insertAdjacentHTML('beforeend', commentTemplate(comment, true));
        }


        if (scroll) {
            component.find('.comments').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // container.insertAdjacentHTML('beforeend', commentTemplate(comment, true));
        const counter = component.find('.comments-border-count span');
        const newCount = parseInt(counter.innerText) + 1;

        counter.innerText = newCount;

        const text = component.find('.comments-border-name');

        text.innerText = newCount > 1 ? 'Comments' : 'Comment';
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function CommentsContainer(param) {
    const {
        parentId, parent, position, width
    } = param;

    /** Comments */
    const comments = await Get({
        list: 'Comments',
        filter: `FK_ParentId eq ${parentId}`,
        sort: 'Id desc'
    });

    const commentsComponent = Comments({
        comments,
        width,
        parent,
        position,
        parentId
    });

    commentsComponent.add();

    /** Start polling */
    let start = new Date();
    let end = new Date();

    // setInterval(startPoll, 2000);
    async function startPoll() {
        console.log('Start:\t', start.toLocaleTimeString());
        console.log('End:\t', end.toLocaleTimeString());

        const newComments = await Get({
            list: 'Comments',
            filter: `Account ne '${App.user.Account}' and FK_ParentId eq ${parentId} and Created ge datetime'${start.toISOString()}' and Created lt datetime'${end.toISOString()}'`
        });

        console.log(newComments);

        newComments.forEach(comment => {
            commentsComponent.addComment(comment);
        });

        start = end;
        end = new Date();
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Container(param) {
    const {
        name,
        html,
        align,
        background,
        border,
        borderBottom,
        borderLeft,
        borderRight,
        borderTop,
        classes,
        display,
        flex,
        flexwrap,
        shadow,
        direction,
        height,
        justify,
        margin,
        padding,
        parent,
        position,
        radius,
        width,
        maxHeight,
        minHeight,
        maxWidth,
        minWidth,
        overflow,
        overflowX,
        overflowY,
        userSelect,
        layoutPosition,
        transition,
        top,
        bottom,
        left,
        right,
        zIndex,
        shimmer
    } = param;

    let unsubscribeShimmer;

    const component = Component({
        html: /*html*/ `
            <div class='container${classes ? ` ${classes?.join(' ')}` : ''}' data-name='${name || ''}'>${html || ''}</div>
        `,
        style: /*css*/ `
            #id {
                user-select: ${userSelect || 'initial'};
                -webkit-user-select: ${userSelect || 'initial'};
                -moz-user-select: ${userSelect || 'initial'};
                -ms-user-select: ${userSelect || 'initial'};
                background-color: ${background || 'unset'};
                flex-wrap: ${flexwrap || 'unset'};
                flex-direction: ${direction || 'row'};
                justify-content: ${justify || 'flex-start'};
                align-items: ${align || 'flex-start'};
                height: ${height || 'unset'};
                width: ${width || 'unset'};
                max-height: ${maxHeight || 'unset'};
                min-height: ${minHeight || 'unset'};
                max-width: ${maxWidth || 'unset'};
                min-width: ${minWidth || 'unset'};
                margin: ${margin || '0'};
                padding: ${padding || '0'};
                border-radius: ${radius || 'unset'};
                border: ${border || 'initial'};
                border-top: ${borderTop || 'none'};
                border-right: ${borderRight || 'none'};
                border-bottom: ${borderBottom || 'none'};
                border-left: ${borderLeft || 'none'};
                box-shadow: ${shadow || 'none'};
                flex: ${flex || 'unset'};
                display: ${display || 'flex'};
                /** @todo is this the best method? */
                ${background ?
                `background: ${background};` :
                ''}
                ${overflow ?
                `overflow: ${overflow}` :
                ''}
                ${overflowX ?
                `overflow-x: ${overflowX}` :
                ''}
                ${overflowY ?
                `overflow-y: ${overflowY}` :
                ''}
                ${zIndex ?
                `z-index: ${zIndex};` :
                ''}
                ${layoutPosition ?
                `position: ${layoutPosition};` :
                ''}
                ${top ?
                `top: ${top};` :
                ''}
                ${bottom ?
                `bottom: ${bottom};` :
                ''}
                ${left ?
                `left: ${left};` :
                ''}
                ${right ?
                `right: ${right};` :
                ''}
                ${transition ? `transition: ${transition};` : ''}
            }

            #id.robi-row {
                width: 100%;
                display: block;
            }
        `,
        parent,
        position,
        events: [],
        onAdd() {
            if (shimmer) {
                unsubscribeShimmer = Shimmer(component, { backgroundColor: background || 'var(--background)'});
            }
        }
    });

    component.shimmerOff = () => {
        unsubscribeShimmer.off();
    };

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = '40px'; // 15px 30px;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DashboardBanner(param) {
    const {
        margin, padding, parent, data, background, position, width, weight
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-banner'>
                ${buildDashboard()}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
                background: ${background || 'var(--secondary)'};
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                ${width ? `width: ${width};` : ''}
            }

            #id .dashboard-banner-group {
                background-color: var(--background);
                color: var(--color);
                min-height: 88px;
                flex: 1;
                padding: 8px;
                border-radius: 8px;
                font-weight: ${weight || 'normal'};
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #id .dashboard-banner-group.selected {
                background: var(--button-background) !important;
            }

            #id .dashboard-banner-group:not(:last-child) {
                margin-right: 10px;
            }

            #id .dashboard-banner-group[data-action='true'] {
                cursor: pointer;
            }

            #id .dashboard-banner-label,
            #id .dashboard-banner-value,
            #id .dashboard-banner-description {
                transition: opacity 500ms ease;
            }

            #id .dashboard-banner-label,
            #id .dashboard-banner-description {
                white-space: nowrap;
                font-size: 13px;
            }

            #id .dashboard-banner-value {
                white-space: nowrap;
                font-size: 22px;
                font-weight: 600;
            }

            #id .opacity-0 {
                opacity: 0;
            }

            #id .opacity-1 {
                opacity: 0;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: `#id .dashboard-banner-group[data-action='true']`,
                event: 'click',
                listener(event) {
                    const item = data.find(item => item.label === this.dataset.label);

                    item?.action(item);
                }
            }
        ]
    });

    function buildDashboard() {
        let html = '';

        data.forEach(item => {
            const {
                label, value, description, action, color, background, loading, hide
            } = item;

            html += /*html*/ `
                <div class='dashboard-banner-group ${loading ? 'shimmer' : ''}' ${background ? `style='background: ${background};'` : ''} data-label='${label}' data-action='${action ? 'true' : 'false'}'>
                    <div class='dashboard-banner-label ${hide ? 'opacity-0' : ''}' ${color ? `style='background: ${color};'` : ''}>${label}</div>
                    <div class='dashboard-banner-value ${hide ? 'opacity-0' : ''}' ${color ? `style='background: ${color};'` : ''}>${value || ''}</div>
                    <div class='dashboard-banner-description ${hide ? 'opacity-0' : ''}' ${color ? `style='background: ${color};'` : ''}>${description || ''}</div>
                </div>
            `;
        });

        return html;
    }

    component.group = (label) => {
        const group = component.find(`.dashboard-banner-group[data-label='${label}']`);

        if (group) {
            return {
                group,
                data: {
                    label: group.querySelector('.dashboard-banner-label').innerHTML,
                    value: group.querySelector('.dashboard-banner-value').innerHTML,
                    description: group.querySelector('.dashboard-banner-description').innerHTML
                }
            };
        }
    };

    component.select = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.add('selected');
    };

    component.deselect = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.remove('selected');
    };

    component.deselectAll = () => {
        component.findAll(`.dashboard-banner-group`).forEach(group => group?.classList.remove('selected'));
    };

    component.update = (groups) => {
        groups.forEach(item => {
            const {
                label, value, description,
            } = item;

            component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-label`)?.classList.remove('opacity-0');

            const valueField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-value`);

            if (valueField && value !== undefined) {
                valueField.innerText = value;
                valueField.classList.remove('opacity-0');
            }

            const descriptionField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-description`);

            if (descriptionField && description !== undefined) {
                descriptionField.innerText = description;
                descriptionField.classList.remove('opacity-0');
            }
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DataTable(param) {
    const {
        buttonColor,
        headers,
        headerFilter,
        columns,
        buttons,
        cursor,
        checkboxes,
        striped,
        border,
        paging,
        search,
        info,
        ordering,
        order,
        rowId,
        addCSS,
        data,
        onRowClick,
        onSearch,
        onDraw,
        fontSize,
        nowrap,
        onSelect,
        onDeselect,
        rowCallback,
        createdRow,
        width,
        parent,
        position,
        pageLength
    } = param;

    const component = Component({
        html: /*html*/ `
            <table class=
                'table table-sm 
                hover
                w-100 
                ${striped !== false ? 'table-striped' : 'table-not-striped'} 
                ${border !== false ? 'table-bordered' : 'table-not-bordered'} 
                animated 
                fadeIn
                ${nowrap !== false ? 'nowrap' : ''}'
            >
                <thead>
                    ${buildHeader()}
                </thead>    
            </table>
        `,
        style: /*css*/ `
            /** Horizontal scroll */
            #id_wrapper .row-2 {
                width: inherit;
            }

            #id_wrapper .row-2 .col-md-12 {
                overflow-x: overlay;
                padding-right: 0px;
                padding-left: 0px;
                padding-bottom: 10px;
                margin-right: 15px;
                margin-left: 15px;
            }

            /** Table */
            #id_wrapper {
                width: ${width || 'initial'};
                /* overflow-x: overlay; */
            }

            #id_wrapper .table {
                color: var(--color);
            }

            #id_wrapper tr {
                cursor: ${cursor || 'pointer'};
            }
            
            #id_wrapper tr td.dataTables_empty {
                cursor: default;
            }

            #id_wrapper table.dataTable.table-sm > thead > tr > th:not(.sorting_disabled) {
                padding-right: 25px;
            }

            /* 
            Toolbar 
            paging: false,
            search: false,
            ordering: false,
            */
            ${paging === false && search === false && ordering === false ?
                /*css*/ `
                    #id_wrapper .datatable-toolbar {
                        margin: 0px !important;
                    }
                ` :
                ''}

            #id_wrapper .datatable-toolbar {
                padding: 0px 15px;
                margin: 0px 0px 10px 0px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
            }

            #id_wrapper .datatable-toolbar .cell {
                display: flex;
                align-items: center;
            }

            #id_wrapper .datatable-toolbar .dataTables_length label,
            #id_wrapper .datatable-toolbar .dataTables_filter label {
                margin: 0px;
            }

            /* Striped */
            #id_wrapper .table-striped tbody tr:nth-of-type(odd) {
                background-color: var(--background);
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(even) td {
                background-color: inherit;
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(odd) td:first-child {
                border-radius: 10px 0px 0px 10px;
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(odd) td:last-child {
                border-radius: 0px 10px 10px 0px;
            }

            #id_wrapper .table-striped tbody tr:first-child td:first-child {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }

            #id_wrapper .table-striped tbody tr:first-child td:last-child {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }

            /** Buttons */
            #id_wrapper .btn {
                font-size: 13px;
                border-radius: 10px;
                margin-right: 10px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary {
                border-color: transparent;
                margin-right: 10px;
                border-radius: 8px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary:focus {
                box-shadow: none;
            }

            /** Add Item Button */
            #id_wrapper .datatable-toolbar .plus-icon {
                background: var(--button-background);
                margin-right: 20px;
            }

            #id_wrapper .datatable-toolbar .plus-icon span {
                font-weight: 500;
                white-space: nowrap;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--primary);
            }

            #id_wrapper .datatable-toolbar .plus-icon .icon {
                font-size: 19px;
                margin-right: 6px;
                fill: var(--primary);;
            }

            /** Disabled Button */
            #id_wrapper .datatable-toolbar .disabled .icon {
                stroke: gray !important;
                fill: gray !important;
            }

            /** Delete Item Button */
            #id_wrapper .datatable-toolbar .delete-item {
                font-size: 19px;
                background: ${buttonColor || 'var(--button-background)'} !important;
            }

            #id_wrapper .datatable-toolbar .delete-item span {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #id_wrapper .datatable-toolbar .delete-item .icon {
                fill: var(--primary);
            }

            /** HTML5 Buttons */
            #id_wrapper .dt-buttons {
                flex-wrap: nowrap !important;
            }

            #id_wrapper .buttons-html5.ml-50 {
                margin-left: 50px;
            }

            #id_wrapper .buttons-html5 {
                color: #444;
                font-weight: 500;
                padding: 0px;
                flex: 1;
                display: flex;
            }

            #id_wrapper .buttons-html5:hover {
                background: none !important;
            }

            #id_wrapper .buttons-html5 span{
                color: var(--color) !important;
                display: inline-block;
                margin: 0px 10px;
                padding: 4px 24px;
                flex: 1;
                text-align: center;
                border-radius: 8px;
            }

            #id_wrapper .buttons-html5 span:hover {
                background-color: var(--primary-20);
            }

            #id_wrapper .buttons-html5:first-child span {
                margin-top: 10px;
            }

            #id_wrapper .buttons-html5:last-child span {
                margin-bottom: 10px;
            }

            /* Buttons Collection */
            #id_wrapper .dt-button-collection {
                width: calc(100% - 12px);
            }

            #id_wrapper .dt-button-collection .dropdown-menu {
                top: 4px;
                padding: 0px;
                display: flex;
                flex-direction: column;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                border: none;
            }

            #id_wrapper .buttons-collection {
                background: ${buttonColor || 'var(--button-background)'} !important;
                border: none;
            }

            #id_wrapper .buttons-collection span {
                display: flex;
                color: #444;
                font-weight: 500;
            }

            #id_wrapper .buttons-collection span .icon {
                font-size: 19px;
                fill: var(--primary);
            }

            /* Select and Search */
            #id_wrapper .custom-select,
            #id_wrapper input[type='search'] {
                background: ${buttonColor || 'var(--button-background)'} !important;
            }

            #id_wrapper .dataTables_filter label {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: ${buttonColor || 'var(--button-background)'} !important;
                padding-left: 10px;
            }

            #id_wrapper .dataTables_filter label:focus-within {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px var(--primary-6b) !important;
            }

            #id_wrapper input[type='search'] {
                border-color: transparent !important;
                box-shadow: none !important;
            }

            /** Footer */
            #id_wrapper .datatable-footer {
                padding: 0px 15px;
                width: 100%;
                font-size: 12px;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
            }

            #id_wrapper .datatable-footer .cell.left {
                display: flex;
                align-items: center;
            }

            /** Info */
            #id_wrapper .dataTables_info {
                padding: 0px;
            }

            /** Pagination */
            #id_wrapper .page-item .page-link {
                background: transparent;
                color: unset;
                border: none; /* FIXME: Experimental */
                padding: 3px 7px;
                border-radius: 6px;
            }

            #id_wrapper .page-item .page-link:focus {
                box-shadow: none;
            }

            #id_wrapper .page-item.active .page-link {
                color: white;
                background: var(--primary);;
                border: solid 1px var(--primary);
            }

            #id_wrapper .page-link:hover {
                background: rgb(${App.get('primaryColorRGB')}, .15);
            }

            /** Form control */
            #id_wrapper .form-control:focus {
                box-shadow: none;
                outline: none;
            }

            /** Table */
            #id_wrapper .dataTable {
                border-collapse: collapse !important;
                font-size: ${fontSize || '13px'};
            }

            /** Not Bordered*/
            #id_wrapper .table-not-bordered {
                border: none;
            }
            
            #id_wrapper .table-not-bordered thead td,
            #id_wrapper .table-not-bordered thead th {
                border-top: none;
            }
            
            /** Headers */
            #id_wrapper .table-border thead th {
                border-bottom: solid 1px rgb(${App.get('primaryColorRGB')}, .3);
                background: rgb(${App.get('primaryColorRGB')}, .2);
                color: var(--primary);
            }

            #id_wrapper :not(.table-border) thead th {
                vertical-align: top;
                border-bottom-width: 1px;
            }

            #id_wrapper .table-striped:not(.table-border) thead th {
                vertical-align: top;
                border-bottom-width: 0px;
            }

            /* Select all */
            #id_wrapper thead th .custom-control-label::before {
                border: solid 2px ${App.get('prefersColorScheme') === 'dark' ? '#444' : 'lightgray' };
            }

            #id_wrapper thead th .custom-control-input:checked ~ .custom-control-label::before {
                border: solid 2px var(--primary);
            }

            /** Cells */
            #id_wrapper td,
            #id_wrapper th {
                border-top: none;
            }
            
            #id_wrapper td:focus {
                outline: none;
            }

            #id_wrapper td.bold {
                font-weight: 500;
            }

            /** Sorting */
            #id_wrapper .sorting_asc::before,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::before,
            #id_wrapper .sorting_desc::after {
                color: var(--primary);
            }

            #id_wrapper .sorting::after,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::after {
                right: .2em;
            }

            #id_wrapper .sorting::before {
                content: '▲';
            }

            #id_wrapper .sorting::after {
                content: '▼';
            }

            /** Select Checkbox */
            #id_wrapper tbody td.select-checkbox {
                vertical-align: middle;
            }

            #id_wrapper tbody td.select-checkbox:before, 
            #id_wrapper tbody th.select-checkbox:before {
                content: ' ';
                margin: 0 auto;
                border: solid 2px ${App.get('prefersColorScheme') === 'dark' ? '#444' : 'lightgray' };
                border-radius: 4px;
                position: initial;
                display: block;
                width: 16px;
                height: 16px;
                box-sizing: border-box;
            }

            #id_wrapper tbody td.select-checkbox:after, 
            #id_wrapper tbody th.select-checkbox:after {
                margin-top: -18px;
                top: auto;
                text-shadow: none;
                color: var(--primary);
                font-weight: bolder;
                font-size: 10pt;
            }

            /* Selected Row */
            #id_wrapper tbody > tr.selected {
                background-color: inherit !important;
            }

            #id_wrapper tbody > tr.selected td {
                background-color: var(--selected-row) !important;
                color:  var(--primary);
            }

            #id_wrapper tbody tr.selected a, 
            #id_wrapper tbody th.selected a,
            #id_wrapper tbody td.selected a {
                color: var(--primary);
            }

            #id_wrapper tbody > tr.selected td:first-child {
                border-radius: 10px 0px 0px 10px;
            }

            #id_wrapper tbody > tr.selected td:last-child {
                border-radius: 0px 10px 10px 0px;
            }

            #id .btlr-10 {
                border-top-left-radius: 10px;
            }
            
            #id .btrr-10 {
                border-top-right-radius: 10px;
            }

            #id .bbrr-10 {
                border-bottom-right-radius: 10px;
            }

            #id .bblr-10 {
                border-bottom-left-radius: 10px;
            }

            #id .btlr-0 {
                border-top-left-radius: 0px !important;
            }
            
            #id .btrr-0 {
                border-top-right-radius: 0px !important;
            }

            #id .bbrr-0 {
                border-bottom-right-radius: 0px !important;
            }

            #id .bblr-0 {
                border-bottom-left-radius: 0px !important;
            }

            /* Overflow MLOT field */
            #id_wrapper tbody td .dt-mlot {
                max-width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            /* Bootstrap 5 overrides */
            #id_wrapper .table>:not(caption) > * > * {
                border-bottom-width: 0px;
            } 

            #id_wrapper .table > :not(:first-child) {
                border-top: none;
            }

            #id_wrapper .table thead {
                border-bottom-color: lightgray;
            }

            /* Toolbar row limit selector */
            #id_wrapper .dataTables_length label {
                display: flex;
                align-items: center;
            }

            #id_wrapper .dataTables_length label select {
                border-radius: 8px;
                margin: 0px 10px;
            }

            /** Dropdown menu */
            #id_wrapper .dropdown-menu {
                background: var(--inputBackground);
                box-shadow: var(--box-shadow);
            }

            ${addCSS || ''}
        `,
        parent,
        position,
        events: [

        ],
        onAdd() {
            setData({
                columns,
                data,
                onRowClick,
            });
        }
    });

    function buildHeader() {
        let html = /*html*/ `
            <tr>
        `;

        headers.forEach(item => {
            html += /*html*/ `
                <th>${item}</th>
            `;
        });

        html += /*html*/ `
            </tr>
        `;
        return html;
    }

    function setData(param) {
        const {
            columns, data, onRowClick,
        } = param;

        if (!component.get()) {
            return;
        }

        const tableId = `#${component.get().id}`;

        const options = {
            dom: `
                <'row'
                    <'datatable-toolbar'
                        <'cell left'
                            B
                        >
                        <'cell right'
                            ${search !== false ? 'f' : ''}
                        >
                    >
                >
                <'row row-2'
                    <'col-md-12'
                        t
                    >
                >
                <'row'
                    <'datatable-footer'
                        <'cell left'
                            ${info !== false ? 'i' : ''}
                        >
                        <'cell right'
                            p
                        >
                    >
                >
            `,
            language: {
                search: /*html*/ `
                    <span class='filter-search-icon d-inline-flex justify-content-center align-items-center'>
                        <svg class='icon' style='font-size: 16px; fill: #adb5bd;'>
                            <use href='#icon-bs-search'></use>
                        </svg>
                    </span>
                `
            },
            rowId,
            processing: true,
            // responsive: true,
            deferRender: true, // https://datatables.net/reference/option/deferRender
            order: order || [[1, 'asc']],
            columns,
            buttons: {
                dom: {
                  button: {
                    className: 'btn btn-robi'
                  }
                },
                buttons: buttons || []
            }
            // buttons: buttons || []
        };

        if (paging === false) {
            options.paging = false;
        } else {
            options.pageLength = 20;
        }

        if (ordering === false) {
            options.ordering = false;
        }

        if (checkboxes) {
            options.columnDefs = [
                {
                    targets: 0,
                    defaultContent: '',
                    orderable: false,
                    className: 'select-checkbox'
                }
            ];

            options.select = {
                style: 'multi+shift',
                selector: 'td:first-child'
            };
        } else {
            // options.select = 'single';
        }

        if (rowCallback) {
            options.rowCallback = rowCallback;
        }

        if (createdRow) {
            options.createdRow = createdRow;
        }

        if (headerFilter) {
            options.initComplete = function () {
                console.log('footer filter');

                var footer = $(this).append('<tfoot><tr></tr></tfoot>');

                // Apply the search
                this.api().columns().every(function (index) {
                    var that = this;

                    var data = this.data();

                    if (index === 6) {
                        return;
                    }

                    // Append input
                    // $(`${tableId} tfoot tr`).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');
                    $(footer).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');

                    $('input', this.footer()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw();
                        }
                    });
                });
            };
        }

        // console.log('Table options:', options);
        // FIXME: Experimental
        options.preDrawCallback = function (settings) {
            var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
            pagination.toggle(this.api().page.info().pages > 1);
        };

        if (pageLength && pageLength > 0) {
            options.pageLength = pageLength
        } 

        /** Create table. */
        const table = $(tableId).DataTable(options)
            .on('click', 'tr', function (rowData) {
                /** DO NOT Change this to an arrow function! this reference required */
                if (rowData.target.classList.contains('select-checkbox')) {
                    return;
                }

                if (rowData.target.tagName.toLowerCase() === 'a') {
                    console.log(`Clicked link. Didn't fire onRowClick().`);

                    return;
                }

                rowData = $(tableId).DataTable().row(this).data();

                if (rowData && onRowClick) {
                    onRowClick({
                        row: this,
                        item: rowData
                    });
                }
            });

        /** Search event callback */
        if (onSearch) {
            table.on('search.dt', function (e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());
                onSearch({
                    jqevent: e,
                    table: table
                });
            });
        }

        /** Draw event callback */
        if (onDraw) {
            table.on('draw', function (e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());
                onDraw({
                    jQEvent: e,
                    table: table
                });
            });
        }

        /** Select callback */
        if (onSelect) {
            table.on('select', function (e, dt, type, indexes) {
                onSelect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Deselect callback */
        if (onDeselect) {
            table.on('deselect', function (e, dt, type, indexes) {
                onDeselect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Load and draw data. */
        table.rows.add(data).draw();

        /** Adjust columns */
        // NOTE: Is this still necessary?
        // FIXME: Redraw runs render functions again
        table.columns.adjust().draw();

        /** Header filter */
        if (headerFilter) {
            $(`${tableId} tfoot th`).each(function () {
                var title = $(this).text();
                $(this).html('<input type="text" placeholder="Search ' + title + '" />');
            });
        }
    }

    component.DataTable = () => {
        return $(`#${component.get()?.id}`)?.DataTable();
    };

    component.search = (term, column) => {
        $(`#${component.get().id}`).DataTable().columns(column).search(term).draw();
    };

    component.findRowById = (id) => {
        return $(`#${component.get().id}`).DataTable().row(`#${id}`);
    };

    component.updateRow = (param) => {
        const {
            row, data
        } = param;

        $(`#${component.get().id}`).DataTable().row(row).data(data).draw();
    };

    component.selected = () => {
        return $(`#${component.get().id}`).DataTable().rows({ selected: true }).data().toArray();
    };

    component.addRow = (param) => {
        const {
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row.add(data).draw();
    };

    component.removeRow = (itemId) => {
        $(`#${component.get().id}`).DataTable().row(`#${itemId}`).remove().draw();
    };

    component.getButton = (className) => {
        return component.get().closest('.dataTables_wrapper').querySelector(`button.${className}`);
    };

    component.wrapper = () => {
        return component.get().closest('.dataTables_wrapper');
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DateField(param) {
    const {
        label, labelStyle, description, parent, position, margin, value, onChange
    } = param;
 
    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input class='form-field-date form-control' type='date' ${value ? `value=${new Date(value).toISOString().split('T')[0]}` : ''}>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            ${
                labelStyle ? 
                /*css*/ `
                    #id label {
                        ${labelStyle.whiteSpace ? `white-space: ${labelStyle.whiteSpace}` : ''}
                    }
                ` : ''
            }

            #id .form-field-date {
                width: auto;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id input',
                event: 'change',
                listener: onChange
            }
        ]
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            // NOTE: Dates are hard: https://stackoverflow.com/a/31732581
            return new Date(field.value.replace(/-/g, '\/')).toLocaleDateString();
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DevConsole(param) {
    const { parent, position } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='dev-console'>
                    <div style='margin-bottom: 20px; background: var(--background); border-radius: 20px;'>
                        <div class='dev-console-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Edit settings</div>
                                <div class='dev-console-description'>Edit app initialization settings right in the browser</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button modify-app'>Settings</button>
                            </div>
                        </div>
                        <div class='dev-console-row update-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Sync lists</div>
                                <div class='dev-console-description'>Sync app with list schemas</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button update'>Sync lists</button>
                            </div>
                        </div>
                        <div class='dev-console-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Refresh lists</div>
                                <div class='dev-console-description'>Delete and recreate select lists. All items from selected lists will be deleted.</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button reset'>Choose lists</button>
                            </div>
                        </div>
                        <div class='dev-console-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Reset</div>
                                <div class='dev-console-description'>Reset all lists and settings. All items will be deleted.</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button reinstall'>Reset all lists and settings</button>
                            </div>
                        </div>
                    </div>
                    <div class='dev-console-row alert-robi-secondary'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Backup</div>
                            <div class='dev-console-description'>Download a backup of all lists, settings, and source code. You can use backups to reinstall the app or port it to another site.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button delete'>Backup lists, data, and code</button>
                        </div>
                    </div>
                    <div class='dev-console-row alert-robi-primary'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Delete everything</div>
                            <div class='dev-console-description'>Delete all lists and settings. All items will be deleted. You can install the app again later.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi-reverse dev-console-button delete'>Delete all lists and data</button>
                        </div>
                    </div>
                    <hr class='w-100' style='margin-bottom: 40px;'>
                    <div class='dev-console-row alert-robi-primary' style='margin-bottom: 100px;'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Create Subsite</div>
                            <div class='dev-console-description'></div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi-reverse dev-console-button create-subsite'>Create Subsite</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id .alert {
                border: none;
                border-radius: 20px;
            }

            #id .dev-console-title {
                font-size: 1.5em;
                font-weight: 700;
                color: #24292f;
                margin-bottom: 10px;
            }

            #id .dev-console {
                width: 100%;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
            }

            #id .dev-console-row {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
                border-radius: 20px;
                padding: 20px 30px;
            }

            #id .dev-console-text {
                max-width: 700px;
            }

            #id .dev-console-label {
                font-weight: 600;
            }

            #id .dev-console-row:not(:last-child) {
                margin-bottom: 20px;
            }

            #id .dev-console-button {
                font-weight: 600;
                font-size: 14px;
                padding: 10px;
                height: fit-content;
                border-radius: 10px;
                width: 300px;
                position: relative;
            }

            #id .btn-danger {
                background: firebrick;
            }

            #id .btn-code {
                background: #292D3E;
                border-color: #292D3E;
                color: white;
            }

            #id .btn-secondary {
                background: white;
                color: firebrick;
                border-color: firebrick;
            }

            #id .dev-console-button:focus,
            #id .dev-console-button:active {
                box-shadow: none;
            }

            /* Changed */
            #id .changed {
                /* border-radius: 20px;
                position: absolute;
                width: 100%;
                left: 0px;
                top: 45px;*/
                border-radius: 20px;
                position: absolute;
                width: 300px;
                right: 30px;
                top: 80%;
                text-align: center;
            }

            #id .changed-text {
                font-size: 13px;
                font-weight: 500;
                transition: opacity 400ms;
                opacity: 0;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .modify-app',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    ModifyFile({
                        path: 'App/src',
                        file: 'app.js'
                    });
                }
            },
            {
                selector: '#id .update',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    UpdateApp();
                }
            },
            {
                selector: '#id .reset',
                event: 'click',
                listener(event) {
                    console.log('Button:', event.target.innerText);

                    ResetApp();
                }
            },
            {
                selector: '#id .reinstall',
                event: 'click',
                listener(event) {
                    console.log('Button:', event.target.innerText);

                    ReinstallApp();
                }
            },
            {
                selector: '#id .delete',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    DeleteApp();
                }
            },
            {
                selector: '#id .create-subsite',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    CreateApp();
                }
            }
        ],
        async onAdd() {
            component.find('.update-row .dev-console-button').parentNode.insertAdjacentHTML('beforeend', /*html*/ `
                <div class='changed'>
                    <div class="spinner-grow text-robi" style='width: 16px; height: 16px;'>
                        <span class="sr-only">Checking on list changes...</span>
                    </div>
                </div>
            `);

            if (App.isProd()) {
                const {
                    diffToDelete,
                    toCreate,
                    toDelete,
                    schemaAdd,
                    schemaDelete
                } = await CheckLists();
    
                if (
                    diffToDelete.length ||
                    toCreate.length ||
                    toDelete.length ||
                    schemaAdd.length ||
                    schemaDelete.length
                ) {
                    addAlert('robi-primary', 'Changes pending');
                } else {
                    addAlert('success', 'Up to date');
                }
            } else {
                addAlert('robi-primary', 'Dev Mode');
            }
        }
    });

    function addAlert(type, message) {
        if (component.find('.changed')) {
            component.find('.changed').innerHTML = /*html*/ `
                <div class='changed-text alert alert-${type}' style='padding: 5px 10px; border-radius: 10px;'>${message}</div>
            `;

            setTimeout(() => {
                component.find('.changed-text').style.opacity = '1';
            }, 0);
        }
    }

    return component;
}

/**
 *
 * @param {*} param
 */
export async function DeveloperLinks(param) {
    const {
        parent,
    } = param;

    const lists = App.lists().sort((a, b) => a.list.localeCompare(b.list));

    addSection({
        title: '',
        buttons: [
            {
                value: `Add list`,
                url: `${App.get('site')}/_layouts/15/addanapp.aspx`
            },
            {
                value: `Contents`,
                url: `${App.get('site')}/_layouts/15/viewlsts.aspx`
            },
            {
                value: 'Permissions',
                url: `${App.get('site')}/_layouts/15/user.aspx`
            },
            {
                value: 'Settings',
                url: `${App.get('site')}/_layouts/15/settings.aspx`
            }
        ]
    });

    addSection({
        title: `Core Libraries`,
        buttons: [
            {
                value: `App`,
                url: `${App.get('site')}/App`
            },
            {
                value: `Documents`,
                url: `${App.get('site')}/Shared%20Documents`
            }
        ]
    });

    addSection({
        title: `Core Lists`,
        buttons: Lists()
        .sort((a, b) => a.list.localeCompare(b.list))
        .filter(item => item.template !== 101)
        .map(item => {
            const { list, options } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`,
                files: options?.files,
                bin: options?.recyclebin
            };
        })
    });

    addSection({
        title: `App Libraries`,
        buttons: lists
        .filter(item => item.template === 101)
        .map(item => {
            const { list } = item;

            return {
                value: list,
                url: `${App.get('site')}/${list}`
            };
        })
    });

    addSection({
        title: `App Lists`,
        buttons: lists
        .filter(item => item.template !== 101)
        .map(item => {
            const { list, options } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`,
                files: options?.files,
                bin: options?.recyclebin
            };
        })
    });

    function addSection(param) {
        const {
            title, buttons
        } = param;

        if (!buttons.length) {
            return;
        }

        const card = Card({
            title,
            width: '100%',
            margin: '0px 0px 20px 0px',
            parent
        });

        card.add();

        buttons.forEach(button => {
            const {
                value, url, files, bin
            } = button;


            if (files || bin) {
                const buttonContainer = Container({
                    classes: ['mt-2'],
                    parent: card
                });

                buttonContainer.add();

                const settingsButton = Button({
                    type: 'robi',
                    value,
                    classes: ['mr-2'],
                    parent: buttonContainer,
                    async action(event) {
                        window.open(url);
                    }
                });
    
                settingsButton.add();

                if (files) {
                    const filesButton = Button({
                        type: 'robi',
                        value: `${value}Files`,
                        classes: ['mr-2'],
                        parent: buttonContainer,
                        async action(event) {
                            window.open(`${App.get('site')}/${value}Files`);
                        }
                    });
        
                    filesButton.add();
                }

                if (bin) {
                    const binBtn = Button({
                        type: 'robi',
                        value: `${value}RecycleBin`,
                        classes: ['mr-2'],
                        parent: buttonContainer,
                        async action(event) {
                            window.open(`${App.get('site')}/Lists/${value}RecycleBin`);
                        }
                    });
        
                    binBtn.add();
                }
            } else {
                const settingsButton = Button({
                    type: 'robi',
                    value,
                    classes: ['mt-2', 'w-fc'],
                    parent: card,
                    async action(event) {
                        window.open(url);
                    }
                });
    
                settingsButton.add();
            }
        });
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Dialog(param) {
    const {
        classes, message, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dialog-container'>
                <div class='dialog-box ${classes?.join(' ')}'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id {
                position: fixed;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }

            #id .dialog-box {
                min-width: 300px;
                min-height: 150px;
                padding: 30px;
                background: white;
                border-radius: 20px;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DropDownField(param) {
    const {
        label, labelAfter, description, value, direction, required, parent, position, width, editable, fieldMargin, maxWidth, focusout, onError, onEmpty, onSetValue
    } = param;

    let {
        list, dropDownOptions, disabled
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field ${disabled ? 'disabled' : ''} ${direction}'>
                <div class='form-field-label'>
                    <span>${label || ''}</span>
                    <!-- ${required ? /*html*/ `<span class='required'>Required</span>` : ''} -->
                </div>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
                <div class='form-field-drop-down-container'>
                    <div class='form-field-drop-down' contenteditable='${editable !== false ? 'true' : 'false'}'>${dropDownOptions.map(item => item.value).includes(value) ? value : ''}</div> 
                    <!-- List options go here -->
                </div>
                ${labelAfter ? /*html*/ `<div class='form-field-label'><span>${labelAfter || ''}</span></div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
            }

            #id.form-field.row {
                display: flex;
                align-items: center;
            }

            #id.form-field.row .form-field-drop-down-container {
                margin-left: 5px;
                margin-right: 5px;
            }

            #id.form-field.disabled {
                opacity: 0.75;
                pointer-events: none;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-drop-down-container {
                position: relative;
            }

            #id .form-field-drop-down {
                width: ${width || '150px'};
                ${editable === false ? 'min-height: 36px;' : ''}
                font-weight: 500;
                font-size: 1em;
                padding: 5px 10px;
                margin: 2px 0px 4px 0px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-drop-down:active,
            #id .form-field-drop-down:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px var(--primary);
            }

            /* Validation */
            #id .bad {
                background: lightpink;
                box-shadow: 0px 0px 0px 2px crimson;
                border-radius: 4px;
            }

            /* Required */
            #id .required {
                font-size: .8em;
                font-weight: 400;
                color: red;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-drop-down`,
                event: 'keyup',
                listener(event) {
                    const data = dropDownOptions.filter(item => {
                        const query = event.target.innerText;

                        return query ? item.value.toLowerCase().includes(query.toLowerCase()) : item;
                    });

                    showDropDownMenu(event, data);
                }
            },
            {
                selector: `#id .form-field-drop-down`,
                event: 'click',
                listener(event) {
                    /** Remove menu on second click */
                    if (menu) {
                        cancelMenu();

                        return;
                    }

                    /** @todo remove menu on click outside */
                    showDropDownMenu(event, dropDownOptions);
                }
            },
            {
                selector: `#id .form-field-drop-down`,
                event: 'focusout',
                listener(event) {
                    /** Get  */
                    const value = event.target.innerText;

                    /** Check that value is valid */
                    if (value === '') {
                        cancelMenu();

                        if (onEmpty) {
                            onEmpty();
                        }
                    } else if (!dropDownOptions.map(item => item.value).includes(value)) {
                        console.log('not a valid option');

                        component.addError('Not a valid option. Please enter or select an option from the menu.');

                        if (onError) {
                            onError(value);
                        }
                    } else {
                        component.removeError();

                        cancelMenu();

                        if (focusout) {
                            focusout(event);
                        }
                    }
                }
            }
        ]
    });

    let menu;

    function cancelMenu(param = {}) {
        const {
            removeEvents
        } = param;

        if (menu) {
            if (removeEvents) {
                menu.removeEvents();
            }

            menu.cancel();
            menu = undefined;
        }
    }

    function showDropDownMenu(event, data) {
        const key = event.key;

        if (key && key.includes('Arrow') || key === 'Enter') {
            event.preventDefault();

            return;
        }

        if (data.length === 0) {
            console.log('no options to show');

            return;
        }

        /** Cancel menu */
        cancelMenu({
            removeEvents: true,
        });

        // Set menu
        menu = DropDownMenu({
            dropDownField: component,
            field: event.target,
            data,
            list,
            onSetValue(data) {
                cancelMenu();

                if (onSetValue) {
                    onSetValue(data);
                }
            }
        });

        // Add to DOM
        menu.add();
    }

    component.enable = () => {
        disabled = false;

        component.get().classList.remove('disabled');
    };

    component.disable = () => {
        disabled = true;

        component.get().classList.add('disabled');
    };

    component.setOptions = (param) => {
        const {
            list: newList, options: newOptions
        } = param;

        list = newList;
        dropDownOptions = newOptions;
    };

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
            /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `;

        component.find('.form-field-drop-down').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find('.form-field-drop-down');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    component.getValueItemId = () => {
        return component.find('.form-field-drop-down').dataset.itemid;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DropDownMenu(param) {
    const {
        dropDownField, field, data, list, onSetValue
    } = param;

    const component = Component({
        html: createList(),
        style: /*css*/ `
            /* List Containers */
            .drop-down-menu-container {
                position: relative;
            }

            /* Data list text field */
            .form-list-text {
                width: ${field.offsetWidth}px;
                font-weight: 500;
                font-size: .9em;
                padding: 5px;
                background: white;
                margin: 5px 10px;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            .form-list-text:focus,
            .form-list-text:active {
                outline: none;
            }

            /* Drop Down Menu */
            .drop-down-menu {
                width: ${field.offsetWidth}px;
                white-space: nowrap;
                font-weight: 500;
                padding: 5px 0px;
                background: white;
                margin: 5px 0px;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
                z-index: 10;
                position: absolute;
                top: 0px;
                left: 0px;
                overflow: auto;
            }

            .list-option {
                cursor: pointer;
                padding: 0px 10px;
                border-radius: 4px;
            }

            .list-option-selected {
                background: var(--primary);
                color: var(--secondary)
            }
             
            .list-option:hover {
                background: var(--primary);
                color: var(--secondary)
            }

            /** Loading Shimmer */
            .loading-item {
                border-radius: 4px;
                padding: 5px 10px;
                margin: 5px 10px;
                /* height: 21px; */
                background: #777;
            }
            
            .animate {
                animation: shimmer 2s infinite linear;
                background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
            }

            @keyframes fullView {
                100% {
                    width: 100%;
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: -1000px 0;
                }
                100% {
                    background-position: 1000px 0;
                }
            }
        `,
        parent: field,
        position: 'afterend',
        events: [
            {
                selector: '#id .list-option',
                event: 'click',
                listener(event) {
                    const value = event.target.innerText;
                    const id = event.target.dataset.itemid;
                    const index = event.target.dataset.index;

                    addSelectionToField(value, id, index);
                }
            },
            {
                selector: field,
                event: 'keydown',
                listener: selectListOptionWithCursorKeys
            },
            {
                selector: '#id.drop-down-menu-container',
                event: 'mouseenter',
                listener(event) {
                    event.target.allowCancel = false;
                }
            },
            {
                selector: '#id.drop-down-menu-container',
                event: 'mouseleave',
                listener(event) {
                    event.target.allowCancel = true;
                }
            }
        ]
    });

    /** Create List HTML */
    function createList() {
        const fieldPositions = field.getBoundingClientRect();
        const maxHeight = window.innerHeight - fieldPositions.bottom - field.offsetHeight;

        let html = /*html*/ `
            <div class='drop-down-menu-container'>
                <div class='drop-down-menu' style='max-height: ${maxHeight}px'>
        `;

        if (data) {
            data.forEach((option, index) => {
                const {
                    id, value
                } = option;

                html += /*html*/ `
                    <div class='list-option' data-itemid='${id || 0}' data-index='${index}'>${value}</div>
                `;
            });
        } else {
            html += /*html*/ `
                <div class='loading-item animate'>Searching...</div>
            `;
        }

        html += /*html*/ `
                </div>
            </div>
        `;

        return html;
    }

    /** Set field value */
    async function addSelectionToField(value, id, index) {
        const previousValue = field.innerText;

        field.innerText = value;
        field.dataset.itemid = id;

        field.dispatchEvent(new Event('input'), {
            bubbles: true,
            cancelable: true,
        });

        if (list) {
            /** Get item */
            const item = await Get({
                list,
                filter: `Id eq ${id}`
            });

            onSetValue({
                previousValue,
                newValue: item[0]
            });
        } else {
            onSetValue({
                previousValue,
                newValue: data[parseInt(index)]
            });
        }

        dropDownField.removeError();
        component.remove();
    }

    /** Select next option with Up/Down Cursor Keys */
    function selectListOptionWithCursorKeys(event) {
        const key = event.key;

        // Exit if key pressed is not an arrow key or Enter
        if (!key.includes('Arrow') && key !== 'Enter') {
            return;
        } else {
            event.preventDefault();
        }

        const listOptions = component.findAll('.list-option');
        const currentSelected = component.find('.list-option-selected');

        // Add current selection to field if exits and Enter key pressed
        if (key === 'Enter' && currentSelected) {
            const value = currentSelected.innerText;
            const id = currentSelected.dataset.itemid;
            const index = currentSelected.dataset.index;

            addSelectionToField(value, id, index);

            return;
        }

        const currentIndex = [...listOptions].indexOf(currentSelected);
        const nextIndex = key === 'ArrowUp' ? currentIndex - 1 : key === 'ArrowDown' ? currentIndex + 1 : currentIndex;

        if (currentIndex === -1) {
            listOptions[0].classList.add('list-option-selected');
        } else {
            currentSelected.classList.remove('list-option-selected');

            if (listOptions[nextIndex]) {
                listOptions[nextIndex].classList.add('list-option-selected');
            } else if (nextIndex >= listOptions.length) {
                listOptions[0].classList.add('list-option-selected'); // Go back to beginning
            } else if (nextIndex === -1) {
                const lastIndex = listOptions.length - 1; //Go to end

                listOptions[lastIndex].classList.add('list-option-selected');
            }
        }

        scrollToListOptions();
    }

    /** Scroll current selection into view as needed */
    function scrollToListOptions() {
        // Get current selected option
        const currentSelected = component.find('.list-option-selected');

        currentSelected.scrollIntoView({
            block: 'nearest',
            inline: 'start'
        });
    }

    component.cancel = () => {
        const menuContainer = component.get();

        if (menuContainer && menuContainer.allowCancel !== false) {
            component.remove();
        }
    };

    component.removeEvents = () => {
        field.removeEventListener('keydown', selectListOptionWithCursorKeys);
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export function DropZone(param) {
    const {
        allowDelete,
        parent,
        label,
        description,
        list,
        itemId,
        onChange,
        beforeChange,
        onUpload,
        library,
        multiple,
        path,
    } = param;

    let { value } = param;
    value = value || [];

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        label: 'Loading files',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    const card = Container({
        width: '100%',
        direction: 'column',
        margin: '0px 0px 10px 0px',
        parent
    });

    card.add();

    const filesContainer = FilesField({
        label,
        allowDelete,
        description,
        multiple,
        beforeChange,
        onChange,
        path,
        files: itemId ? value?.map(item => {
            if (item.url) {
                return item;
            }

            // FIXME: Passed in object should only contain this props
            return {
                url: item.OData__dlc_DocIdUrl.Url,
                name: item.File.Name,
                size: item.File.Length,
                created: item.Created,
                author: item.Author.Title
            };
        }) : value,
        itemId,
        library: library || `${list}Files`,
        async onUpload(file) {
            if (onUpload === false) {
                return;
            }

            if (!itemId) {
                return;
            }

            console.log(file);

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Queued';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'up next';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div style='width: 22px; height: 22px; background: var(--border-color); border-radius: 50%;'></div>
            `;

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploading';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'please wait';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div class='spinner-grow text-secondary' role='status' style='width: 22px; height: 22px;'></div>
            `;

            // FIXME: DropZone, FilesField, FormSection, and UploadFile are too tightly coupled
            const testUpload = await UploadFile({
                library: library || `${list}Files`,
                path,
                file,
                data: {
                    ParentId: itemId
                }
            });

            console.log(testUpload);
            console.log(`Measure #${itemId} Files`, value);
            value.push(testUpload);

            onChange(value);

            filesContainer.find(`.pending-count`).innerText = '';
            filesContainer.find(`.pending-count`).classList.add('hidden');
            filesContainer.find(`.count`).innerText = `${parseInt(filesContainer.find(`.count`).innerText) + 1}`;

            // filesList.find(`.remove-container[data-filename='${file.name}']`).dataset.itemid = testUpload.Id;
            // filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploaded!';
            // filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = `${'ontouchstart' in window ? 'tap' : 'click'} to undo`;
            // filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
            //     <svg class='icon undo'><use href='#icon-bs-arrow-left-circle-fill'></use></svg>
            // `;

            // Attach file remove listener
            const removeContainer = filesContainer.find(`.remove-container[data-filename='${file.name}']`);

            removeContainer.insertAdjacentHTML('afterend', /*html*/ `
                <div class='remove-container delete-on-remove' data-filename='${file.name}'>
                    <div class='remove-label'>
                        <div class='status'>Added on ${new Date(testUpload?.Created).toLocaleDateString()} By ${testUpload?.Author.Title?.split(' ').slice(0, 2).join(' ')}</div>
                        <div class='tip'>${'ontouchstart' in window ? 'tap' : 'click'} to delete</div>
                    </div>
                    <div class='remove-icon'>
                        <svg class='icon remove'>
                            <use href='#icon-bs-x-circle-fill'></use>
                        </svg>
                    </div>
                </div>
            `);

            removeContainer.remove();

            filesContainer.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).addEventListener('click', filesContainer.delete);

            // dropZone.find('.upload').classList.add('hidden');
            // dropZone.find('.upload').innerHTML = 'Upload';
            // dropZone.find('.upload').style.pointerEvents = 'all';
            // dropZone.find('.undo-all').classList.remove('hidden');
            // dropZone.find('.reset').classList.remove('hidden');
        },
        parent: card
    });

    loadingIndicator.remove();

    Store.add({
        name: 'files',
        component: filesContainer
    });

    return filesContainer;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function EditForm({ fields, item, list, parent }) {
    if (!Array.isArray(fields)) {
        return false;
    }

    const components = fields.filter(field => field.name !== 'Id').map(field => {
        const { name, display, type, validate, choices, fillIn } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
            case 'choice':
                component = ChoiceField({
                    label: display || name,
                    value: item[name],
                    setWidthDelay: 200,
                    options: choices.map(choice => {
                        return {
                            label: choice
                        };
                    }),
                    parent,
                    action: onFocusout 
                });
                break;
            case 'multichoice':
                component = MultiChoiceField({
                    label: display || name,
                    fillIn,
                    choices,
                    value: item[name].results,
                    parent,
                    validate: onFocusout
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
        }

        function onFocusout() {
            return !validate ? undefined : (() => {
                const value = component.value();

                console.log('validate');
    
                if (validate(value)) {
                    component.isValid(true);
                } else {
                    component.isValid(false);
                }
            })();
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onUpdate() {
            let isValid = true;

            const data = {};

            components.forEach(item => {
                const { component, field } = item;
                const { name, type, validate } = field;

                const value = component.value();

                console.log(name, value);

                switch (type) {
                    case 'slot':
                    case 'mlot':
                    case 'choice':
                    case 'date':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = value;
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value) {
                            data[name] = value;
                        }
                        break;
                    case 'multichoice':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = {
                                    results: value
                                };
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value.length) {
                            data[name] = {
                                results: value
                            };
                        }
                        break;
                    case 'number':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = value;
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value) {
                            data[name] = parseInt(value);
                        }
                        break;
                }
            });

            console.log(isValid, data);

            if (!isValid) {
                return false;
            }

            const updatedItem = await UpdateItem({
                list,
                itemId: item.Id,
                data
            });

            return updatedItem;
        },
        async onDelete() {
            const deletedItem = await DeleteItem({
                list,
                itemId: item.Id
            });

            return deletedItem;
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function EditQuestion(param) {
    const {
        question, parent, modal
    } = param;

    const {
        Title, Body
    } = question;

    /** Title */
    const titleField = SingleLineTextField({
        label: 'Question',
        value: Title,
        parent,
        onKeydown(event) {
            if (event.target.innerText) {
                modal.getButton('Update').disabled = false;
            } else {
                modal.getButton('Update').disabled = true;
            }

            submit(event);
        }
    });

    titleField.add();

    /** Body */
    const bodyField = MultiLineTextField({
        label: 'Description',
        value: Body,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });

    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Update');

            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            };

            if (!data.Title) {
                /** @todo field.addError() */
                return false;
            }

            return data;
        }
    };
}

/**
 * EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function ErrorForm(param) {
    const {
        row, table, item, parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        },
        {
            internalFieldName: 'SessionId',
            displayName: 'Session Id'
        },
        {
            internalFieldName: 'Source',
            displayName: 'Source'
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message',
            type: 'mlot'
        },
        {
            internalFieldName: 'Error',
            displayName: 'Error',
            type: 'mlot'
        },
        {
            internalFieldName: 'Created',
            displayName: 'Created',
            type: 'date'
        },
        {
            internalFieldName: 'Author',
            displayName: 'Author'
        }
    ];

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName, displayName, type
        } = field;

        let value = item[internalFieldName]?.toString();

        if (type === 'date') {
            value = new Date(item[internalFieldName]);
        }

        else if (type === 'mlot') {
            value = item[internalFieldName]?.split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title;
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Status */
    const statusField = StatusField({
        async action(event) {
            statusField.value(event.target.innerText);

            const updatedItem = await UpdateItem({
                list: 'Errors',
                itemId: item.Id,
                select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
                expand: 'Author/Id',
                data: {
                    Status: event.target.innerText
                }
            });

            console.log(`Error Item Id: ${item.Id} updated.`, updatedItem);

            /** Update Table Row */
            table.updateRow({
                row,
                data: updatedItem
            });

            /** Show toast */
            const toast = Toast({
                text: `Id <strong>${item.Id}</strong> set to <strong>${updatedItem.Status}</strong>!`,
                type: 'bs-toast',
                parent: Store.get('maincontainer')
            });

            toast.add();
        },
        parent,
        label: 'Status',
        margin: '0px 20px 40px 20px',
        value: item.Status || 'Not Started'
    });

    statusField.add();

    /** Logs */
    Logs({
        sessionId: item.SessionId,
        parent,
    });

    /** Comments */
    CommentsContainer({
        parentId: item.Id,
        padding: '0px 20px',
        parent,
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}

/**
 *
 * @param {*} param
 */
export async function Errors(param) {
    const {
        sessionId, parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    /** Get Errors */
    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(errors);

    if (errors.length === 0) {
        const alertCard = Alert({
            text: 'No errors associated with this Session Id',
            type: 'success',
            margin: '0px 20px',
            parent: errorsContainer
        });

        alertCard.add();
    } else {
        const legendHeading = Heading({
            text: `<strong>Errors:</strong> ${errors.length}`,
            size: '1.3em',
            color: 'crimson',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        legendHeading.add();
    }

    /** Add Errors to Alert */
    errors.forEach((item, index) => {
        const alertCard = Alert({
            text: '',
            type: 'danger',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        alertCard.add();

        const goToErrorButton = Button({
            action(event) {
                Route(`Developer/Errors/${item.Id}`);
            },
            parent: alertCard,
            margin: '20px 0px',
            type: 'btn-danger',
            value: `Go to error ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'Message',
                displayName: 'Message',
                type: 'mlot'
            },
            {
                internalFieldName: 'Error',
                displayName: 'Error',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            },
            {
                internalFieldName: 'Status',
                displayName: 'Status'
            }
        ];

        readOnlyFields.forEach(field => addReadOnlyField(field));

        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName, displayName, type
            } = field;

            let value = item[internalFieldName]?.toString();

            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName]?.split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Author') {
                value = item.Author.Title;
            }

            else if (internalFieldName === 'Status') {
                switch (item.Status) {
                    case 'Not Started':
                    default:
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-danger'>Not Started</span>`;
                        break;
                    case 'In Progress':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-info'>Not Started</span>`;
                        break;
                    case 'Completed':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-success'>Not Started</span>`;
                        break;
                }
            }

            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });

            component.add();
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

// Modified from: https://codepen.io/Nahrin/pen/OKYYpX
export async function Feedback() {
    Style({
        name: 'feedback',
        locked: true,
        style: /*css*/ `
            .feedback-button-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                z-index: 100;
            }

            .show-feedback-form {
                display: flex;
                align-items: center;
                border: none;
                background: var(--primary);
                box-shadow: var(--box-shadow);
                border-radius: 62px;
                height: 44px;
                width: 44px;
                transition: all 450ms;
            }

            .show-feedback-form:hover {
                border-radius: 62px;
                justify-content: start;
                width: 180px;
            }

            .show-feedback-form-label {
                opacity: 0;
                width: 0px;
                color: var(--secondary);
                white-space: nowrap;
                font-size: 16px;
                font-weight: 500;
                transition: all 450ms;
            }

            .show-feedback-form:hover .show-feedback-form-label {
                margin-left: 10px;
                opacity: 1;
            }
        `
    });

    Store.get('appcontainer').append(/*html*/ `
        <div class='feedback-button-container'>
            <button type='buton' class='show-feedback-form'>
                <svg class="icon" style='font-size: 32px; fill: var(--secondary);'>
                    <use href="#icon-bs-emoji-laughing"></use>
                </svg>
                <span class='show-feedback-form-label'>Share feedback?</span>
            </button>
        </div>
    `);

    Store.get('appcontainer').find('.show-feedback-form').on('click', showForm);

    function showForm() {
        // Set store
        let newFeedbackData = Store.getData(`new feedback data`);

        if (newFeedbackData) {
            console.log(`Found exisiting new feedback data.`, newFeedbackData);
        } else {
            newFeedbackData = {
                Summary: null,
                Description: null,
                URL: null,
                LocalStorage: null,
                SessionStorage: null,
                Status: 'Submitted',
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                UserAgent: ua
            };

            Store.setData(`new feedback data`, newFeedbackData);
            console.log('Created new feedback data', newFeedbackData);
        }

        let newFeedbackRecording = Store.getData(`new feedback recording`);

        console.log('Recording', newFeedbackRecording);

        const modal = Modal({
            title: false,
            // scrollable: true,
            close: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-3'>Share Feedback</h3>
                `);
    
                // Short description
                const summary = SingleLineTextField({
                    label: 'Short summary',
                    description: 'Just a few words to help us categorize the issue',
                    parent: modalBody,
                    value: newFeedbackData.Summary,
                    onKeyup() {
                        if (summary.value()) {
                            newFeedbackData.Summary = summary.value();
                            submitBtn.enable();
                        } else {
                            newFeedbackData.Summary = null;
                            submitBtn.disable();
                        }
                    },
                    onFocusout() {
                        if (summary.value()) {
                            submitBtn.enable();
                        } else {
                            submitBtn.disable();
                        }
                    }
                });
    
                summary.add();

                // Description
                const description = MultiLineTextField({
                    label: 'Description',
                    description: /*html*/ `
                        <p class='mb-1'>Please describe the issue in greater detail.</p>
                        <p class='mb-1'>If a feature isn't working properly, or you expected diferent behavior, please help us identity the cause by answering the following questions.</p>
                        <ul>
                            <li>What action was taken? (Example: Clicked a button, opened a form, created an item, etc.)</li>    
                            <li>What happened immediately afterward?</li>
                            <li>What did you expect to happen instead?</li>
                            <li>Does this issue occur every time, or only under certain conditions? (If no, what conditions?)</li>
                        </ul>
                        <p class='m-0'>Of course, if everything's working smoothly and you just wanted to let us know, we appreciate hearing that too!</p>
                    `,
                    value: newFeedbackData.Description,
                    parent: modalBody,
                    onKeyup() {
                        if (summary.value()) {
                            newFeedbackData.Description = summary.value();
                            submitBtn.enable();
                        } else {
                            newFeedbackData.Description = null;
                            submitBtn.disable();
                        }
                    },
                    onFocusout() {
                        if (summary.value()) {
                            submitBtn.enable();
                        } else {
                            submitBtn.disable();
                        }
                    }
                });
    
                description.add();

                // TODO: Remove recording button
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div style='font-weight: 500; margin-bottom: .5rem;'>Attach a screen recording</div>
                    <div class='text-muted' style='font-size: 14px; font-size: 14px; margin-bottom:'>
                        <p class='mb-1'>Please read all instructions before starting.</p>
                        <ol>
                            <li>
                                Select the <strong>Start recording</strong> button below. In <strong>Choose what to share</strong>, select the image with this browser window.
                            </li>
                            <li>
                                Select the blue <strong>Share</strong>. 
                                A ${App.get('theme').toLowerCase()} border will surround the application, and a preview is displayed in the lower right corner. 
                                You can move the preview if it's in the way.
                            </li>
                            <li>Recreate the issue as thoroughly as possible.</li>
                            <li>
                                When finished, select <strong>Stop recording</strong>. This form will reappear with the video attached here. You can watch the recording, redo, or remove it before submitting.
                                
                            </li>
                        </ol>
                    </div>
                    <button id='startButton' type='buton' class='btn btn-robi mt-4' style='height: 35px;'>
                        <span class='d-flex align-items-center justify-content-center'>
                            <svg class="icon" fill='var(--primary)' style='font-size: 18px;'>
                                <use href="#icon-bs-record-circle"></use>
                            </svg>
                            <span class='ml-2 startButton-label' style='line-height: 0;'>${newFeedbackRecording ? 'Redo recording' : 'Start recording'}</span>
                        </span>
                    </button>
                    <!-- Recording -->
                    ${
                        newFeedbackRecording ? /*html*/ `
                            <div class='d-flex mt-4 new-feedback-recording'>
                                <div class='' style='max-width: 680px;'>
                                    <div style='font-weight: 500; margin-bottom: .5rem;'>Recording</div>
                                    <video src='${newFeedbackRecording.src}' id='recording' width='680px' height='400px' controls></video>
                                </div>
                                <div class='bottom d-none'>
                                    <a id='downloadButton' class='button'>Download</a>
                                    <pre id='log'></pre>
                                </div>
                            </div>
                            <button id='removeButton' type='buton' class='btn btn-robi mt-4' style='height: 35px;'>Remove recording</button>
                        ` : ''
                    }
                `);

                const startButton =  modal.find('#startButton');

                startButton.on('click', () => {
                    RecordScreen({
                        onShare() {
                            // Hide feedback button
                            Store.get('appcontainer').find('.feedback-button-container').classList.add('d-none');

                            // Close form
                            modal.close();
                        },
                        onStop() {
                            // Show feedback button
                            Store.get('appcontainer').find('.feedback-button-container').classList.remove('d-none');

                            // Open form
                            showForm();
                        }
                    });
                });

                if (newFeedbackRecording) {
                    const removeButton =  modal.find('#removeButton');

                    removeButton.on('click', () => {
                        newFeedbackRecording = undefined;
                        Store.setData('new feedback recording', undefined);
                        modal.find('.new-feedback-recording').remove();
                        startButton.querySelector('.startButton-label').innerText = 'Start recording';
                        removeButton.remove();
                    });
                }

                const submitBtn = Button({
                    async action() {
                        submitBtn.disable();
                        submitBtn.get().innerHTML = /*html*/ `
                            <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span> Submitting
                        `;

                        newFeedbackData.SessionStorage = JSON.stringify(Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])));
                        newFeedbackData.LocalStorage = JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
                        // newFeedbackData.Logs = JSON.stringify(console.dump()); // NOTE: often too large for SP MLOT fields
                        newFeedbackData.RequestedDate = new Date().toLocaleDateString();
                        newFeedbackData.RequestedBy = Store.user().Title;
                        newFeedbackData.URL = location.href;

                        // Create list item
                        const newItem = await CreateItem({
                            list: 'Feedback',
                            data: newFeedbackData
                        });

                        console.log(newItem);
                        
                        // Upload video
                        if (newFeedbackRecording) {
                            const file = new File([newFeedbackRecording.blob], `${newItem.Id}-Recording.webm`, { type: 'video/webm' });
                            console.log(file);

                            const newRecording = await UploadFile({
                                library: 'FeedbackFiles',
                                file,
                                data: {
                                    ParentId: newItem.Id
                                }
                            });

                            console.log(newRecording);
                        }

                        // Reset data
                        Store.setData('new feedback data', undefined);
                        Store.setData('new feedback recording', undefined);

                        submitBtn.get().innerHTML = /*html*/ `
                            <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span> Submitted!
                        `;

                        modalBody.style.transition = 'all 400ms';
                        modalBody.style.height = `${modalBody.offsetHeight}px`;
                        modalBody.style.opacity = '1';
                        setTimeout(() => {
                            modalBody.style.opacity = '0';
                        }, 0);

                        setTimeout(() => {
                            modalBody.style.opacity = '1';
                            modalBody.style.height = '345px';
                            modalBody.innerHTML = /*html*/ `
                                <h3 class='mb-5'>Thank you!</h3>
                                <p>Your feedback helps make <strong>${App.get('title')}</strong> better for everyone.</p>
                                <p>We review all feedback, and may contact you at <strong><em>${Store.user().Email}</em></strong> if more information is needed.</p>
                            `;
                        }, 600);

                        // Close modal
                        // modal.close();
                    },
                    disabled: newFeedbackData.Summary ? false : true,
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Submit'
                });
    
                submitBtn.add();
    
                const cancelBtn = Button({
                    action(event) {
                        console.log('Cancel add route');
    
                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Cancel'
                });
    
                cancelBtn.add();
            },
            // centered: true,
            showFooter: false,
        });

        modal.add();
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function FilesField(param) {
    const {
        allowDelete,
        beforeChange,
        description,
        itemId,
        label,
        width,
        library,
        multiple,
        onUndo,
        onUpload,
        onChange,
        padding,
        margin,
        path,
        parent,
        position
    } = param;

    let {
        files
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class="form-field-description text-muted">${description}</div>` : ''}
                <div class='files-list'>
                    <input type='file' style='display: none;' id='drop-zone-files' ${multiple !== false ? 'multiple' : ''}>
                    <div class='drop-zone'>
                        <!-- Hidden files input -->
                        <div class='files-list-container'>
                            ${renderFiles()}
                        </div>
                        ${
                            multiple !== false ?
                            /*html*/ `
                                <div class='count-undo-container'>
                                    <div class='count-container'>
                                        <span class='count'>${files?.length || 0}</span>
                                        <span>${files?.length === 1 ? 'file' : 'files'}</span>
                                        <span class='pending-count hidden'></span>
                                    </div>
                                    <!-- <span class='undo-all'>Delete all</span> -->
                                </div>
                            ` : ''
                        }
                    </div>
                </div>
                <button type='button' class='clear btn btn-robi-light ${files?.length === 0 || allowDelete === false ? 'd-none' : ''}' style='position: absolute; bottom: -20px; right: 0px;'>Clear</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: ${width || '100%'};
                min-width: 350px;
                position: relative;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom: 0.5rem;
            }

            #id .files-list {
                width: ${width || '100%'};
                border-radius: 20px;
                background: var(--background);
                transition: all 300ms ease-in-out;
            }

            /* Drag */
            #id .drag-over {
                position: relative;
                background: rgba(${App.get('primaryColorRGB')}, .15);
            }

            /* Hidden */
            #id .hidden {
                display: none !important;
            }

            #id .count-undo-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin: 5px 0px;
                min-height: 20px;
            }

            #id .count-container {
                font-weight: 500;
                padding-left: 15px;
                font-size: 14px;
            }

            /* Remove all */
            #id .undo-all {
                cursor: pointer;
                background: crimson;
                border-radius: 4px;
                background: crimson;
                color: white;
                padding: 2px 4px;
                font-size: 10px;
                font-weight: 500;
            }

            /* File Drop Zone */
            #id .drop-zone {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 136.75px;
                position: relative;
                transition: all 150ms;
                margin: ${margin || '10px'};
                padding: ${padding || '40px'};
                border-radius: 20px;
            }

            #id .drop-zone-button-container {
                font-size: 14px;
            }

            #id .drop-zone-button { 
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                background: var(--primary);
                color: white;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
            }

            #id .files-list-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            #id .files-list-container .file-preview:not(:first-child) {
                margin-top: 10px;
            }

            #id .files-list-container .file-preview:last-child {
                margin-bottom: 5px;
            }

            #id .file-icon-container {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                ${itemId ? 'cursor: pointer;' : ''}
            }

            #id .file-name-container {
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            #id .file-icon {
                display: flex;
            }

            #id .remove-container {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                min-width: 105px;
            }

            #id .remove-container .remove-icon {
                display: flex;
                cursor: pointer;
            }
            
            #id .removed {
                transform: scale(0);
                display: none;
            }

            /* Light 

            #id .file-preview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                background: #595E68;
                transition: all 200ms;
            }

            #id .drag-over {
                background: white;
            }

            #id .file-preview-name {
                font-weight: 500;
                margin: 0px 5px;
                color: white;
                font-size: 13px;
            }

            #id .file-size {
                font-weight: 400;
                margin: 0px 5px;
                color: white;
                font-size: 11px;
            }

            #id .file-icon .type {
                font-size: 1.5em;
                stroke: white;
                fill: white;
            }

            #id .icon.remove {
                cursor: pointer;
                font-size: 1.2em;
                stroke: white;
                fill: white;
            }

            */

            /* Dark */
            #id .file-preview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 9px 12px;
                /* padding: 9px 0px; */
                border-radius: 15px;
                background: var(--secondary);
                transition: all 200ms;
            }

            #id .file-preview-name {
                font-weight: 500;
                margin: 0px 20px 0px 5px;
                font-size: 12px;
            }

            #id .file-size {
                font-weight: 400;
                margin: 0px 20px 0px 5px;
                font-size: 10.5px;
                color: gray;
            }

            /** Icons */

            #id .file-icon .type {
                font-size: 1.5em;
                fill: var(--color);
            }

            #id .file-icon .bs-file-earmark-word {
                fill: #2B579A;
            }

            #id .file-icon .bs-file-earmark-ppt {
                fill: #B7472A;
            }

            #id .file-icon .bs-file-earmark-excel {
                fill: #217346;
            }

            #id .file-icon .bs-file-earmark-pdf {
                fill: #B30B00;
            }

            #id .file-icon .bs-file-earmark {
                fill: var(--color);
            }

            #id .remove-label {
                display: flex;
                flex-direction: column;
                margin-right: 10px;
            }

            #id .remove-label .status {
                text-align: right;
                font-size: 12px;
                white-space: nowrap;
            }

            #id .remove-label .tip {
                text-align: right;
                font-size: 10px;
            }

            #id .remove-icon {
                min-width: 26px;
            }

            #id .icon {
                font-size: 22px;
            }

            #id .icon.remove {
                fill: var(--primary);
            }

            #id .icon.undo {
                fill: mediumseagreen;
            }

            /** Spinner */
            .spinner {
                text-align: center;
            }
            
            .spinner > div {
                width: 10px;
                height: 10px;
                background-color: white;
                border-radius: 100%;
                display: inline-block;
                -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            }
            
            .spinner .bounce1 {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }
            
            .spinner .bounce2 {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
            
            @-webkit-keyframes sk-bouncedelay {
                0%, 80%, 100% { -webkit-transform: scale(0) }
                40% { -webkit-transform: scale(1.0) }
            }
            
            @keyframes sk-bouncedelay {
                0%, 80%, 100% { 
                    -webkit-transform: scale(0);
                    transform: scale(0);
                } 40% { 
                    -webkit-transform: scale(1.0);
                    transform: scale(1.0);
                }
            }

            /* https://codepen.io/sdras/pen/aOgMON */
            #id .shake {
                animation: shake 820ms cubic-bezier(.36,.07,.19,.97) both;
            }

            /* Shake */
            @keyframes shake {
                10%, 90% {
                  transform: translate3d(-1px, 0, 0);
                }
                
                20%, 80% {
                  transform: translate3d(2px, 0, 0);
                }
              
                30%, 50%, 70% {
                  transform: translate3d(-4px, 0, 0);
                }
              
                40%, 60% {
                  transform: translate3d(4px, 0, 0);
                }
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .drop-zone',
                event: 'dragover drop',
                listener: preventFileOpen
            },
            {
                selector: '#id .drop-zone',
                event: 'dragover dragenter',
                listener: addDragAndDropClass
            },
            {
                selector: '#id .drop-zone',
                event: 'dragleave dragend dragexit drop',
                listener: removeDragAndDropClass
            },
            {
                selector: '#id .drop-zone',
                event: 'drop',
                listener: drop
            },
            {
                selector: '.remove-container:not(.delete-on-remove)',
                event: 'click',
                listener: removeFilePreview
            },
            {
                selector: '.remove-container.delete-on-remove .remove-icon',
                event: 'click',
                listener(event) {
                    component.delete(event);
                }
            },
            {
                selector: `input[type='file']`,
                event: 'change',
                listener(event) {
                    renderFiles(event.target.files);
                }
            },
            {
                selector: `#id .file-name-container`,
                event: 'click',
                listener() {
                    const name = files.find(file => file.name = this.dataset.filename).name;
                    const link = `${App.get('site')}/${library}/${name}`;

                    console.log('Open file:', link);

                    window.open(link);
                }
            },
            {
                selector: `#id .clear`,
                event: 'click',
                listener() {
                    files = [];

                    component.find('.files-list-container').innerHTML = '';

                    event.target.classList.add('d-none');
                }
            }
        ]
    });

    // Drag and drop
    function preventFileOpen(event) {
        event.preventDefault();

        return false;
    }

    function togglePointerEvents(value) {
        const dropZone = component.find('.drop-zone');

        [...dropZone.children].forEach(child => {
            child.style.pointerEvents = value;
        });
    }

    function addDragAndDropClass(event) {
        togglePointerEvents('none');

        // event.target.classList.add('drag-over');
        component.find('.files-list').classList.add('drag-over');
    }

    function removeDragAndDropClass(event) {
        togglePointerEvents('unset');

        // event.target.classList.remove('drag-over');
        component.find('.files-list').classList.remove('drag-over');
    }

    function drop(event) {
        let canAdd = true;

        if (beforeChange) {
            canAdd = beforeChange([...event.dataTransfer.files])
        }

        console.log(canAdd);

        if (canAdd) {
            addFiles(event.dataTransfer.files);
        }
    }

    // Files
    function addFiles(fileList) {
        console.log(multiple, fileList.length);
        
        if (multiple === false) {
            files = [];
    
            component.find('.files-list-container').innerHTML = '';

            if (fileList.length > 1) {
                component.find('.files-list').classList.add('shake');
    
                setTimeout(() => {
                    const message = Alert({
                        type: 'robi-reverse',
                        text: `Only one file can be uploaded at a time`,
                        classes: ['alert-in', 'shadow', 'w-100'],
                        top: component.get().offsetHeight - 5,
                        delay: 3000,
                        parent: component
                    });
        
                    message.add();
    
                    setTimeout(() => {
                        message.remove();
                    }, 3400);
                }, 410);
    
                setTimeout(() => {
                    component.find('.files-list').classList.remove('shake');
                }, 820);
    
                return;
            }
        }

        // Use DataTransferItemList interface to access the file(s)
        const newFiles = [...fileList]
        .filter(file => {
            const { name } = file;
            const exists = files.find(file => file.name === name);

            if (!exists) {
                return file;
            } else {
                console.log('Toast: File already added/uploaded.');

                const message = Alert({
                    type: 'danger',
                    text: `File already added`,
                    classes: ['alert-in', 'w-100'],
                    top: component.get().offsetHeight - 5,
                    parent: component
                });

                message.add();

                setTimeout(() => {
                    message.remove();
                }, 3000);
            } 
        })
        .map(file => {
            addPreview(file);

            // If item already created, upload right away
            if (itemId) {
                onUpload(file);
            }

            return file;
        });

        files = files.concat(newFiles);

        if (onChange) {
            onChange(files);
        }

        if (multiple !== false) {
            if (newFiles.length) {
                if (fileList.length) {
                    component.find('.pending-count').innerText = `(${fileList.length} pending)`;
                    component.find('.pending-count').classList.remove('hidden');
                } 
            } else {
                console.log('Toast: no new files added.');
            }
        }

        toggleClearButton();
    }

    function toggleClearButton() {
        if (files?.length) {
            component.find('.clear').classList.remove('d-none');
        } else {
            component.find('.clear').classList.add('d-none');
        }
    }

    function returnFileSize(number) {
        if (number < 1024) {
            return number + ' bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + ' KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + ' MB';
        }
    }

    function addPreview(file) {
        component.find('.files-list-container').insertAdjacentHTML('beforeend', fileTemplate(file));

        // Add remove file preview event listener
        component.find(`.remove-container[data-filename='${file.name}']`).addEventListener('click', removeFilePreview);
    }

    function renderFiles() {
        return files ? files.map(file => fileTemplate(file)).join('\n') : '';
    }

    function fileTemplate(file) {
        const {
            name, size, created, author, uri
        } = file;

        const ext = name.split('.').pop();
        const icon = selectIcon(ext);

        console.log('allow delete', allowDelete);

        // TODO: add event listener for deleting items that have already been uploaded
        return /*html*/ `
            <div class='file-preview' data-filename='${name}'>
                <div class='file-icon-container'>
                    <div class='file-icon'>
                        <svg class='icon type ${icon}'><use href='#icon-${icon}'></use></svg>
                    </div>
                    <div class='file-name-container' data-filename='${name}'>
                        <div class='file-preview-name'>${name}</div>
                        <div class='file-size'>${returnFileSize(size)}</div>
                    </div>
                </div>
                <div class='remove-container ${created && allowDelete !== false ? 'delete-on-remove' : ''}' data-filename='${name}'>
                    ${
                        allowDelete !== false ?
                        /*html*/ `
                            <div class='remove-label'>
                                <div class='status'>${created ? `Added on ${new Date(created).toLocaleDateString()} By ${author.split(' ').slice(0, 2).join(' ')}` : 'Pending'}</div>
                                <div class='tip'>${created ? `${'ontouchstart' in window ? 'tap' : 'click'} to delete` : `remove`}</div>
                            </div>
                            <div class='remove-icon'>
                                <svg class='icon remove'><use href='#icon-bs-${created ? 'x-circle-fill' : 'dash-circle-fill'}'></use></svg>
                            </div>
                        ` : ''
                    }
                </div>
            </div>
        `;
    }

    // Remove file node
    function removeFilePreview(event) {
        const fileName = this.dataset.filename;
        const file = files.find(file => file.name === fileName);
        const index = files.indexOf(file);

        console.log(fileName, file, files, index);

        files.splice(index, 1);

        if (onChange) {
            onChange(files);
        }

        if (multiple !== false) {
            if (!files.length) {
                component.find('.pending-count').classList.remove('hidden');
                component.find('.pending-count').innerText = '';
            } else {
                component.find('.pending-count').innerText = `(${files.length} pending)`;
            }
        }

        this.closest('.file-preview').classList.add('removed');

        setTimeout(() => {
            this.closest('.file-preview').remove();
        }, 150);

        toggleClearButton();
    }

    function selectIcon(ext) {
        switch (ext) {
            case 'doc':
            case 'docx':
                return 'bs-file-earmark-word';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'bs-file-earmark-ppt';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'bs-file-earmark-excel';
            case 'pdf':
                return 'bs-file-earmark-pdf';
            default:
                return 'bs-file-earmark';
        }
    }

    component.delete = async (event) => {
        const container = event.target.closest('.remove-container');
        const file = files.find(file => file.name === container.dataset.filename);
        const name = file.name;
        const index = files.indexOf(file);

        console.log(name, file, files, index);

        files.splice(index, 1);

        if (onChange) {
            onChange(files);
        }

        const countContainer = component.find('.count-container');
        
        if (countContainer) {
            countContainer.innerHTML = /*html*/ `
                <div class="count-container">
                    <span class="count">${files.length}</span>
                    <span>${files.length === 1 ? 'file' : 'files'}</span>
                    <span class="pending-count hidden"></span>
                </div>
            `;
        }

        container.closest('.file-preview').classList.add('removed');

        setTimeout(() => {
            container.closest('.file-preview').remove();
        }, 150);

        const digest = await GetRequestDigest();
        const response = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path || library}')/Files('${name}')`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest,
                'If-Match': '*'
            }
        });

        console.log(response);

        toggleClearButton();
    };

    component.upload = () => {
        files.forEach(file => {
            onUpload(file);
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function FilesTable(param) {
    const {
        remove, files, list, label, labelWeight, labelSize, parent, position, onAdd, onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='files'>
                ${label ? /*html*/ `<div class='files-label'>${label}</div>` : ''}
                <div class='files-table-container'>
                    ${createFilesTable(files)}
                </div>
                <div class='files-add-button-container'>
                    <div class='files-add-button'>Add file</div>
                    <!-- Hidden file input -->
                    <input type='file' multiple style='display: none;' id='drop-zone-files'>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .files-table-container {
                border: solid 1px rgba(0, 0, 0, .05);
                padding: 10px;
                background: white;
                border-radius: 4px;
            }

            .files-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding: 5px 0px;
            }

            #id th,
            #id td {
                padding: 5px 15px;
                /* white-space: nowrap; */
            }

            #id td:nth-child(2) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
            }

            #id .remove {
                cursor: pointer;
                /* margin-left: 20px; */
                /* background: firebrick;
                color: white; */
                color: crimson;
                font-weight: 700;
                border-radius: 4px;
                /* font-size: .8em; */
                font-size: 1.5em;
                line-height: 0;
            }

            /** Icons */
            .file-icon {
                display: inline-block;
                position: relative;
                margin-right: 5px;
            }

            .file-icon .page {
                font-size: 2em;
                stroke: var(--color);
                fill: var(--color)
            }

            .file-icon .type {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                font-size: 1em;
            }
            
            /** None */
            #id .none {
                font-size: 1em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
            }

            /** Button */
            .files-add-button-container {
                display: flex;
                justify-content: flex-end;
                margin: 10px 0px 0px 0px;
            }

            .files-add-button {
                cursor: pointer;
                padding: 5px 10px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: var(--secondary);
                background: var(--primary);
                border: solid 2px var(--primary);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .files-add-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    /** Empty files value */
                    fileInput.value = '';

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;

                    if (files.length > 0 && onAdd) {
                        onAdd(files);
                    }
                }
            },
            {
                selector: '#id .remove',
                event: 'click',
                listener: removeRow
            }
        ]
    });

    function createFilesTable(files) {
        let html = '';

        if (files.length > 0) {
            html += /*html*/ `
                <table class='files-table'>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Created</th>
                            <!-- <th>Author</th> -->
                            <th>Modified</th>
                            <!-- <th>Editor</th> -->
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            files.forEach(file => {
                html += fileTemplate(file);
            });

            html += /*html*/ `
                    </tbody>
                </table>
            `;
        } else {
            html += /*html*/ `
                <div class='none'>None</div>
            `;
        }

        return html;
    }

    function fileTemplate(file) {
        const {
            id, name, created, author, authorAccount, modified, editor, uri
        } = file;

        const ext = name.split('.').pop();

        return /*html*/ `
            <tr class='file-row' data-uri="${uri}" data-itemid='${id}' data-name='${name}'>
                <td>
                    <div class='file-icon'>
                        <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                        <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                    </div>
                </td>
                <td>
                    <span>
                        <a href='../../${list}/${name}' title='${name}' target='_blank'>${name}</a>
                    </span>
                </td>
                <td>
                    <div>${author}</div>
                    <div>${created}</div>
                </td>
                <!-- <td>${author}</td> -->
                <td>
                    <div>${editor}</div>
                    <div>${modified}</div>
                </td>
                <!-- <td>${editor}</td> -->
                <td>
                    ${remove || authorAccount === App.user.Account ? /*html*/ `<span class='remove'>&times;</span>` : ''}
                </td>
            </tr>
        `;
    }

    function selectIcon(ext) {
        switch (ext.toLowerCase()) {
            case 'doc':
            case 'docx':
                return 'microsoftword';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'microsoftpowerpoint';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'microsoftexcel';
            case 'pdf':
                return 'adobeacrobatreader';
            default:
                return 'file-text2';
        }
    }

    async function removeRow(event) {
        const row = event.target.closest('.file-row');
        const check = confirm(`Are you sure you want to delete '${row.dataset.name}'?`);

        if (check) {
            await DeleteItem({
                list,
                itemId: parseInt(row.dataset.itemid)
            });

            row.remove();

            const rows = component.findAll('.file-row');

            if (rows.length === 0) {
                component.find('.files-table-container').innerHTML = createFilesTable([]);
            }

            if (onDelete) {
                onDelete();
            }
        }
    }


    component.addFile = (file) => {
        /** Check if file already exists in table */
        const row = component.find(`.file-row[data-itemid='${file.id}']`);

        if (row) {
            console.log('already in table');

            return;
            /** add updated message */
        }

        /** Add file row to table */
        const tbody = component.find('.files-table tbody');

        if (tbody) {
            tbody.insertAdjacentHTML('beforeend', fileTemplate(file));
        } else {
            component.find('.files-table-container').innerHTML = createFilesTable([file]);
        }

        /** Add remove event listener*/
        component.find(`.file-row[data-itemid='${file.id}'] .remove`).addEventListener('click', removeRow);
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function FixedToast(param) {
    const {
        top, type, bottom, left, right, title, message, action, onClose, parent, position
    } = param;

    const component = Component({
        locked: true,
        html: /*html*/ `
            <div class='fixed-toast slide-in ${type || 'inverse-colors'}'>
                <div class='fixed-toast-title'>
                    <strong class='mr-auto'>${title}</strong>
                    <button type='button' class='ml-4 mb-1 close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </div>
                <div class='fixed-toast-message'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.fixed-toast {
                cursor: ${action ? 'pointer' : 'initial'};
                position: fixed;
                z-index: 1000;
                font-size: 1em;
                max-width: 385px;
                padding: 20px;
                border-radius: 20px;
                ${top ?
                `top: ${top};` :
                ''}
                ${bottom ?
                `bottom: ${bottom};` :
                ''}
                ${left ?
                `left: ${left};` :
                ''}
                ${right ?
                `right: ${right};` :
                ''}
            }

            #id.robi {
                background: var(--primary);
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
            }

            #id.robi * {
                color: white;
            }

            #id.success {
                background: #d4edda;
            }

            #id.success * {
                color: #155724;
            }

            #id.inverse-colors {
                background: var(--primary);
            }

            #id.inverse-colors * {
                color: white;
            }

            /** Slide In */
            .slide-in {
                animation: slidein 500ms ease-in-out forwards;
            }

            /** Slide Out */
            .slide-out {
                animation: slideout 500ms ease-in-out forwards;
            }

            /* Close */
            #id .close {
                outline: none;
            }

            /* Title */
            #id .fixed-toast-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }

            @keyframes slideout {
                from {
                    /* opacity: 0; */
                    transform: translate(-10px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(400px);
                }
            }
        `,
        position,
        parent,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: '#id .close',
                event: 'click',
                listener(event) {
                    event.stopPropagation();

                    /** Run close callback */
                    if (onClose) {
                        onClose(event);
                    }

                    /** Animate and remove component */
                    component.get().addEventListener('animationend', event => {
                        console.log('end slide out');

                        component.remove();
                    });

                    component.get().classList.remove('slide-in');
                    component.get().classList.add('slide-out');
                }
            }
        ]
    });

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function FoldingCube(param) {
    const {
        label, margin, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='folding-cube-container'>
                <div class='folding-cube-label'>${label || ''}</div>
                <div class="sk-folding-cube">
                    <div class="sk-cube1 sk-cube"></div>
                    <div class="sk-cube2 sk-cube"></div>
                    <div class="sk-cube4 sk-cube"></div>
                    <div class="sk-cube3 sk-cube"></div>
                </div>
            <div>
        `,
        style: /*css*/ `
            /** Container */
            .folding-cube-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: ${margin || '0px'};;
            }

            /** Label */
            .folding-cube-label {
                font-weight: 400;
                color: var(--primary);
            }

            /** Folding cube1 */
            .sk-folding-cube {
                margin: 20px auto;
                width: 40px;
                height: 40px;
                position: relative;
                -webkit-transform: rotateZ(45deg);
                transform: rotateZ(45deg);
            }

            .sk-folding-cube .sk-cube {
                float: left;
                width: 50%;
                height: 50%;
                position: relative;
                -webkit-transform: scale(1.1);
                -ms-transform: scale(1.1);
                transform: scale(1.1); 
            }

            .sk-folding-cube .sk-cube:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--primary);
                -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
                animation: sk-foldCubeAngle 2.4s infinite linear both;
                -webkit-transform-origin: 100% 100%;
                -ms-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
            }

            .sk-folding-cube .sk-cube2 {
                -webkit-transform: scale(1.1) rotateZ(90deg);
                transform: scale(1.1) rotateZ(90deg);
            }

            .sk-folding-cube .sk-cube3 {
                -webkit-transform: scale(1.1) rotateZ(180deg);
                transform: scale(1.1) rotateZ(180deg);
            }

            .sk-folding-cube .sk-cube4 {
                -webkit-transform: scale(1.1) rotateZ(270deg);
                transform: scale(1.1) rotateZ(270deg);
            }

            .sk-folding-cube .sk-cube2:before {
                -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s;
            }

            .sk-folding-cube .sk-cube3:before {
                -webkit-animation-delay: 0.6s;
                animation-delay: 0.6s; 
            }

            .sk-folding-cube .sk-cube4:before {
                -webkit-animation-delay: 0.9s;
                animation-delay: 0.9s;
            }

            @-webkit-keyframes sk-foldCubeAngle {
                0%, 10% {
                    -webkit-transform: perspective(140px) rotateX(-180deg);
                    transform: perspective(140px) rotateX(-180deg);
                    opacity: 0; 
                } 
                
                25%, 75% {
                    -webkit-transform: perspective(140px) rotateX(0deg);
                    transform: perspective(140px) rotateX(0deg);
                    opacity: 1; 
                } 
                
                90%, 100% {
                    -webkit-transform: perspective(140px) rotateY(180deg);
                    transform: perspective(140px) rotateY(180deg);
                    opacity: 0; 
                } 
            }
          
            @keyframes sk-foldCubeAngle {
                0%, 10% {
                    -webkit-transform: perspective(140px) rotateX(-180deg);
                    transform: perspective(140px) rotateX(-180deg);
                    opacity: 0; 
                } 
                
                25%, 75% {
                    -webkit-transform: perspective(140px) rotateX(0deg);
                    transform: perspective(140px) rotateX(0deg);
                    opacity: 1; 
                } 
                
                90%, 100% {
                    -webkit-transform: perspective(140px) rotateY(180deg);
                    transform: perspective(140px) rotateY(180deg);
                    opacity: 0; 
                }
            }
        `,
        parent,
        position,
        events: []
    });

    return component;
}

/**
 *
 * @param {*} param
 */
export function FormSection(param) {
    const { section, listInfo, item, parent: parentConatiner, heading } = param;
    const { name, path, info, rows } = section;
    const { list, fields } = listInfo;

    const parent = Container({
        display: 'block',
        width: '100%',
        padding: '0px 0px 30px 0px',
        parent: parentConatiner
    });

    parent.add();

    if (heading) {
        const headingContainer = Container({
            padding: '0px 10px',
            parent,
        });

        headingContainer.add();

        const sectionTitle = Alert({
            type: 'robi-secondary',
            width: '100%',
            margin: '0px 0px 20px 0px',
            text: /*html*/ `
                <h6 class='mb-0'>${heading}</h6>
            `,
            parent: headingContainer
        });

        sectionTitle.add();
    }

    if (section.info) {
        const infoAlert = Alert({
            type: 'robi-secondary',
            text: info,
            margin: '0px 10px 20px 10px',
            parent
        });

        infoAlert.add();
    }

    // TODO: Pass form name in, this is supposed to be generic
    const formType = item ? 'Edit' : 'New';
    const formData = item ? Store.getData(`edit measure ${item.Id}`) : Store.getData('new measure');

    // console.log('Form Data:', formData);

    let components = [];

    rows.forEach(row => {
        const { name: rowName, fields: rowFields, description: rowDescription, type } = row;

        // console.log(rowName, rowDescription);
        const rowContainer = type ?
            Alert({
                margin: '10px 20px',
                type,
                parent
            }) :
            Container({
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                parent
            });

        rowContainer.add();

        if (rowName) {
            rowContainer.append(/*html*/ `
                <div class='mb-1'>
                    <h6 style='color: var(--color); font-weight: 700'>${rowName}</h6>
                </div>
            `);
        }

        if (rowDescription) {
            rowContainer.append(/*html*/ `
                <div class="mb-4" style='font-size: 14px;'>${rowDescription}</div>
            `);
        }

        const fieldRow = Container({
            display: 'flex',
            align: 'stretch',
            width: '100%',
            parent: rowContainer
        });

        fieldRow.add();

        Style({
            name: `form-row-${fieldRow.get().id}`,
            style: /*css*/ `
                #${fieldRow.get().id} .form-field {
                    flex: 1;
                }

                #${fieldRow.get().id} .form-field:not(:last-child) {
                    margin-right: 20px;
                }
            `
        });

        rowFields?.forEach(field => {
            const { 
                name,
                label,
                style,
                onKeyup,
                onKeydown,
                onPaste,
                component: customComponent,
                description: customDescription
            } = field;
            const parent = fieldRow;
            let fieldMargin = '0px';
            let component = {};

            // Render passed in component
            if (customComponent) {
                component = customComponent({
                    formType,
                    item,
                    parent,
                    formData,
                    getComponent() {
                        return component;
                    } 
                });
            }
            
            // If field name is Files, render drop zone
            else if (name === 'Files') {
                component = DropZone({
                    label: label || display || name,
                    description: customDescription,
                    // value: formData[name],
                    value: formData.Files,
                    list,
                    itemId: item?.Id,
                    path: item ? `${list}Files/${item.Id}` : undefined,
                    parent,
                    fieldMargin,
                    onChange(files) {
                        console.log('files value', files);
                        formData.Files = files;
                    }
                });
            }
            
            // Render field by type
            else {
                const { display, description: defaultDescription, type, choices, fillIn, action } = fields?.find(item => item.name === name);
                // const description = customDescription || defaultDescription;
                
                let description;

                if (customDescription === false) {
                    description = '';
                } else if (customDescription) {
                    description = customDescription;
                } else if (defaultDescription === false) {
                    description = '';
                } else if (defaultDescription) {
                    description = defaultDescription;
                }

                switch (type) {
                    case 'slot':
                        let placeholder = '';
                        let addon = '';

                        if (name.toLowerCase().includes('email')) {
                            // placeholder = 'first.mi.last.civ@mail.mil';
                            addon = '@';
                        } else if (name.toLowerCase().includes('name')) {
                            // placeholder = 'First Last'
                        } else if (name.toLowerCase().includes('office')) {
                            // placeholder = 'Example: J-5 AED'
                        }
                        
                        const originalData = formData[name];

                        component = SingleLineTextField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            placeholder,
                            action,
                            addon,
                            parent,
                            fieldMargin,
                            // TODO: Complete compare against published measures
                            onPaste,
                            onKeydown,
                            async onKeyup(event) {
                                // Set form data
                                formData[name] = component.value();

                                if (onKeyup) {
                                    onKeyup(event);
                                }

                                // // Drop down Menu
                                // const query = event.target.value;
                                // const menu = component.find('.dropdown-menu');

                                // // console.log(query);

                                // if (query) {
                                //     if (!menu) {
                                //         // console.log('add menu');

                                //         const height = component.get().offsetHeight;
                                //         const width = component.get().offsetWidth;

                                //         component.find('.form-control').insertAdjacentHTML('afterend', /*html*/ `
                                //             <div class='dropdown-menu show' style='font-size: 13px; position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
                                //                 <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                                //                     <div style='color: var(--primary);'>Searching for measures with similar names...</div>
                                //                     <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
                                //                 </div> 
                                //             </div>
                                //         `);

                                //         // Get list items
                                //         const listItems = await Get({
                                //             list: 'Measures'
                                //         });

                                //     } else {
                                //         // console.log('menu already added');
                                //     }
                                // } else {
                                //     if (menu) {
                                //         // console.log('remove menu');
                                //         menu.remove();
                                //     } else {
                                //         // console.log('menu already removed');
                                //     }
                                // }
                            },
                            onFocusout(event) {
                                if (formType === 'Edit') {
                                    // console.clear();
                                    console.log('original:', originalData);
                                    console.log('current:', formData[name]);
    
                                    if (formData[name] !== originalData) {
                                        console.log('changed');
                                        Store.setData('canRoute', false);
                                    } else {
                                        console.log('not changed');
                                    }
                                }
                            }
                        });
                        break;
                    case 'mlot':
                        // TODO: Dark mode
                        // TODO: Pass type or custom component instead of assuming intent by field name
                        if (name.toLowerCase() === 'tags') {
                            component = TaggleField({
                                label: label || display || name,
                                description,
                                tags: formData[name],
                                parent,
                                fieldMargin,
                                onTagAdd(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                },
                                onTagRemove(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        // TODO: Pass type or custom component instead of assuming intent by field name
                        } else if (name.toLowerCase() === 'dashboardlinks' || name.toLowerCase() === 'links') {
                            component = LinksField({
                                label: label || display || name,
                                links: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onChange(event) {
                                    // Set form data
                                    formData[name] = JSON.stringify(component.value());
                                }
                            });
                        } else {
                            component = MultiLineTextField({
                                label: label || display || name,
                                value: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onPaste,
                                onKeydown,
                                onKeyup(event) {
                                    // Set form data
                                    formData[name] = component.value();

                                    if (onKeyup) {
                                        onKeyup(event);
                                    }
                                }
                            });
                        }

                        break;
                    case 'number':
                        component = NumberField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            fieldMargin,
                            parent,
                            onKeyup(event) {
                                // Set form data
                                console.log(formData, formData[name], component.value());
                                formData[name] = component.value();
                            }
                        });
                        break;
                    case 'choice':
                        component = ChoiceField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            fillIn,
                            options: choices.map(choice => {
                                return {
                                    label: choice
                                };
                            }),
                            parent,
                            fieldMargin,
                            onChange() {
                                formData[name] = component.value();
                            }
                        });
                        break;
                    case 'multichoice':
                        component = MultiChoiceField({
                            label: label || display || name,
                            description,
                            choices,
                            fillIn,
                            value: formData[name]?.results,
                            parent,
                            fieldMargin,
                            onChange(event) {
                                formData[name] = {
                                    results: component.value()
                                };
                            }
                        });
                        break;
                    default:
                        console.log('missing component for field type: ', type);
                        return;
                }
            }

            // Add component to DOM
            component.add();

            // Apply passed in styles
            if (style) {
                for (const property in style) {
                    // console.log(`${property}: ${style[property]}`);
                    component.get().style[property] = style[property];
                }
            }

            // Push component to list of components
            components.push({
                component,
                field
            });
        });
    });

    return components;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function FormTools(param) {
    const {
        type,
        list,
        parent,
        container,
        position
    } = param;

    let isOpen = false;

    const component = Component({
        html: /*html*/ `
            <div class='viewtools'>
                <button class='btn tools' type='button'>•••</button>
                <div class='grow-in-center'>
                    <!-- Add Field -->
                    <button class='dropdown-item add-table' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 48px;'>
                                <use href='#icon-bs-input-cursor'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Add field</div>
                    </button>
                    <!-- Divider -->
                    <div class='dropdown-divider'></div>
                    <!-- Edit Layout -->
                    <button class='dropdown-item edit-layout' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-grid-1x2'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Layout</div>
                    </button>
                    <!-- Edit Source -->
                    <button class='dropdown-item edit-source' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-code'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Source</div>
                    </button>
                    <!-- Divider -->
                    <div class='dropdown-divider'></div>
                    <!-- Publish -->
                    <button class='dropdown-item edit-source' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: #208738;'>
                                <use href='#icon-bs-cloud-arrow-up'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: #208738;'>Publish Changes</div>
                    </button>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                right: 0px;
                width: 100%;
                color: var(--primary);
            }

            #id .tools {
                cursor: pointer;
                color: var(--primary);
                font-size: 20px;
                transition: transform 300ms ease, background-color 250ms ease;
                padding: 6px 11.82px; /* sets button width to an even 50px */
            }

            #id .scale-up {
                transform: scale(2);
            }

            #id .menu {

            }

            #id .grow-in-center {
                z-index: 10000;
                top: 5px;
                position: absolute;
                transform: scale(0);
                transform-origin: top;
                opacity: 0;
                transition: transform 150ms ease, opacity 150ms ease;
            }

            #id .grow-in-center.open {
                transform: scale(1);
                transform-origin: top;
                opacity: 1;
            }

            #id .dropdown-divider {
                height: unset;
                margin: .5rem;
                overflow: hidden;
                border-left: 2px solid var(--button-background);
                border-top: none;
            }

            #id .dropdown-item {
                position: relative;
                display: flex;
                flex-direction: column;
                color: var(--primary);
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 20px;
                transition: filter 300ms ease, background-color 150ms ease;
            }

            #id .dropdown-item .icon {
                fill: var(--primary);
            }

            /* Border */
            #id .border {
                border: solid 2px var(--primary);
            }

            #id .icon-container {
                border-radius: 20px;
                padding: 10px;
                width: 90px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .save-edit-layout,
            .cancel-edit-layout {
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                height: 50px;
                padding: 0px 30px;
                border-radius: 10px;
            }

            .save-edit-layout {
                left: 0px;
            }

            .cancel-edit-layout {
                right: 0px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .tools',
                event: 'click',
                listener(event) {
                    this.classList.add('scale-up');

                    if (!isOpen) {
                        isOpen = true;

                        component.find('.grow-in-center').classList.add('open');
                        setTimeout(() => {
                            container.on('click', close);
                        }, 0);
                    } else {
                        close();
                    }
                }
            },
            {
                selector: '#id .edit-layout',
                event: 'click',
                listener: editLayout
            },
            {
                selector: '#id .edit-source',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Lists/${list}`,
                        file: `${type}Form.js`
                    });
                }
            }
        ],
        onAdd() {
            editMode();
        }
    });

    function editLayout() {
        // Hide tools
        component.find('.tools').classList.add('d-none');

        // Add Save and Cancel buttons
        component.append(/*html*/ `
            <div class='edit-layout-buttons'>
                <div class='save-edit-layout'>
                    <button type='button' class='btn'>
                        <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Done</span>
                    </button>
                </div>
                <div class='cancel-edit-layout'>
                    <button type='button' class='btn'>
                        <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Cancel</span>
                    </button>
                </div>
            </div>
        `);

        // Save
        component.find('.save-edit-layout').on('click', () => {
            // NOTE: 
            // Row IDs increment every time a row is created (even it's not added to the DOM). 
            // We could set the internal counter to 0 when a new set of rows is built.
            // But it would require a call to something like Store.resetRow() at the right time, every time.
            // Instead, we map the indexOf value of the new order to their starting indices.
            //
            // Example:
            // Five rows are created with IDs: [5, 6, 7, 8, 9].
            // If their order is changed to [9, 7, 8, 5, 6], we map each integer to their starting indices of [0, 1, 2, 3, 4].
            // The new array we send to EditLayout would look like this: [4, 2, 3, 0, 1].
            // 
            // START
            // [5, 6, 7, 8, 9]
            //  ↓  ↓  ↓  ↓  ↓
            // [0, 1, 2, 3, 4]
            //
            // FINISH
            // [9, 7, 8, 5, 6]
            //  ↓  ↓  ↓  ↓  ↓
            // [4, 2, 3, 0, 1]
            const startOrder = [...container.findAll('.robi-row')]
                .sort((a, b) => parseInt(a.dataset.row.split('row-')[1]) - parseInt(b.dataset.row.split('row-')[1]))
                .map(row => parseInt(row.dataset.row.split('row-')[1]));
            const finishOrder = [...container.findAll('.robi-row')].map(row => parseInt(row.dataset.row.split('-')[1]));
            const newOrder = finishOrder.map(num => startOrder.indexOf(num));

            // console.log('start:', startOrder);
            // console.log('new:', finishOrder);
            // console.log('transformed:', newOrder);

            // Edit file
            EditLayout({
                order: newOrder,
                path: `App/src/Lists/${list}`,
                file: `${type}Form.js`
            });
        });

        // TODO: Change to Preview
        // Cancel
        component.find('.cancel-edit-layout').on('click', turnOfSortable);

        // Turn off sortable
        function turnOfSortable() {
            // Reset order
            [...container.findAll('.robi-row')]
                .sort((a, b) => parseInt(a.dataset.row.split('row-')[1]) - parseInt(b.dataset.row.split('row-')[1]))
                .forEach(row => row.parentElement.append(row));

            setTimeout(() => {
                $(`#${container.get().id}`).sortable('destroy');
                $(`#${container.get().id} .robi-row > *`).css({'pointer-events': 'auto', 'user-select': 'auto'});
            }, 0);

            // Remove buttons
            component.find('.edit-layout-buttons').remove();

            // Show tools
            component.find('.tools').classList.remove('d-none');
        }

        // Turn on sortable
        $(`#${container.get().id}`).sortable({ items: '.robi-row' });
        $(`#${container.get().id} .robi-row > *`).css({'pointer-events': 'none', 'user-select': 'none'});
    }

    function editMode() {
        
    }

    function close(event) {
        isOpen = false;

        component.find('.grow-in-center').classList.remove('open');
        component.find('.tools').classList.remove('scale-up');

        container.off('click', close);
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Heading(param) {
    const {
        text, size, color, height, weight, margin, padding, parent, width, align
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='heading'>
                <div class='text'>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                height: ${height || 'unset'};
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: ${margin || '50px 0px 20px 0px'};
                padding: ${padding || '0px'};
                width: ${width || 'initial'};
            }    

            #id .text {
                font-size: ${size || '1.25em'};
                font-weight: ${weight || '500'};
                color: ${color || 'var(--color)'};
                margin: 0px;
                text-align: ${align || 'left'};
            }

            #id .text * {
                color: ${color || 'var(--color)'};
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: []
    });

    component.setHeading = (newTitle) => {
        component.find('.text').innerText = newTitle;
    };

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Help(param) {
    const { parent } = param;

    const routeTitle = Title({
        title: `Help`,
        parent
    });

    routeTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    const requestAssistanceInfo = RequestAssitanceInfo({
        data: [
            {
                label: 'For help with this app, please contact:',
                name: 'First Last',
                title: 'TItle, Branch',
                email: 'first.last.civ@mail.mil',
                phone: '(555) 555-5555'
            }
        ],
        parent: viewContainer
    });

    requestAssistanceInfo.add();
}

/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function IconField(param) {
    const {
        classes,
        label,
        description,
        parent,
        position,
        size, // must be in px
        value,
        icons
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- <div class='icon-field d-flex flex-wrap ${classes ? classes.join(' ') : ''}'> -->
            <div class='icon-field ${classes ? classes.join(' ') : ''}'>
                ${label ? /*html*/ `<label class='form-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    HTML({
                        items: icons,
                        each(icon) {
                            const { id, fill} = icon;

                            return /*html*/ `
                                <div class='icon-container d-flex justify-content-center ${`icon-${value}` === id ? 'selected' : ''}' data-icon='${id.replace('icon-', '')}' title='${id.replace('icon-', '')}'>
                                    <svg class='icon' style='font-size: ${size || '32'}px; fill: ${fill || 'var(--primary)'};'>
                                        <use href='#${id}'></use>
                                    </svg>
                                </div>
                            `
                        }
                    })
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                display: grid;
                grid-template-columns: repeat(auto-fill, 72px); /* passed in size or 22 plus (15 * 2 for padding) */
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .icon-container {
                transform: scale(.7);
                cursor: pointer;
                padding: 20px;
                /* margin: 0px 20px 20px 0px; */
                background-color: var(--background);
                border-radius: 15px;
                transition: background-color 150ms ease, transform 150ms ease;
            }

            #id .icon-container.selected {
                box-shadow: 0px 0px 0px 2px var(--primary);
                background-color: var(--primary-20); 
            }

            #id .icon-container:hover {
                background-color: var(--primary-20);
                transform: scale(1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .icon-container',
                event: 'click',
                listener(event) {
                    // Deselect all 
                    component.findAll('.icon-container').forEach(node => node.classList.remove('selected'));

                    // Select clicked
                    this.classList.add('selected');
                }
            }
        ],
        onAdd() {

        }
    });

    component.value = (value) => {
        if (value === '') {
            component.find('.icon-container.selected')?.classList.remove('selected');
        } else if (value !== undefined) {
            const icon = component.find(`.icon-container[data-icon='${value}']`);

            if (icon) {
                // Deselect all 
                component.findAll('.icon-container').forEach(node => node.classList.remove('selected'));

                // Select value
                icon.classList.add('selected');
            }
        } else {
            return component.find('.icon-container.selected')?.dataset.icon;
        }
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function InstallConsole(param) {
    const {
        text, close, margin, width, parent, position
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type}' role='alert'${margin ? ` style='margin: ${margin};'` : ''}>
                ${text}
                ${close ?
            /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 20px;
                border: none;
            }
            
            #id *:not(button) {
                color: inherit;
            }

            #id.alert-blank {
                padding: 0px;    
            }
            
            ${width ?
            /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''}
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType, text: newText
        } = param;

        const alert = component.get();

        if (type) {
            alert.classList.remove(`alert-${type}`);
            alert.classList.add(`alert-${newType}`);

            type = newType;
        }

        if (text) {
            alert.innerHTML = newText;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ItemInfo(param) {
    const {
        item, width, maxWidth, position, parent,
    } = param;

    const {
        Created, Modified, Editor, Author
    } = item;

    const createdDate = new Date(Created);
    const modifiedDate = new Date(Modified);

    const component = Component({
        html: /*html*/ `
            <div>
                <table>
                    <tr>
                        <th>Created</th>
                        <td>${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                        <th class='gap'></th>
                        <td class='gap'>${Author.Title}</td>
                    </tr>
                    <tr>
                        <th>Last modified</th>
                        <td>${modifiedDate.toLocaleDateString()} ${modifiedDate.toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>${Editor.Title}</td>
                    </tr>
                </table>
            </div>

            <!--
            <div class='item-info'>
                <div class=item-info-group>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Created</span>
                        <span class='item-info-value'>${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</span>
                    </div>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Created by</span>
                        <span class='item-info-value'>${Author.Title}</span>
                    </div>
                </div>
                <div class=item-info-group>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Last Modified</span>
                        <span class='item-info-value'>${modifiedDate.toLocaleDateString()} ${modifiedDate.toLocaleTimeString()}</span>
                    </div>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Last Modified by</span>
                        <span class='item-info-value'>${Editor.Title}</span>
                    </div>
                </div>
            </div>
            -->
        `,
        style: /*css*/ `
            #id {
                font-size: .8em;
                margin-top: 40px;
                width: ${width || '100%'};
                max-width: ${maxWidth || '100%'};
                display: flex;
                justify-content: flex-end;
            }

            #id table th {
                text-align: right;
                padding-right: 10px;
            }

            #id table .gap {
                padding-bottom: 15px;
            }

            /*
            #id .item-info-group {
                margin-bottom: 15px;
            }

            #id .item-info-label {
                font-weight: 500;
                min-width: 120px;
            }
            */
        `,
        parent,
        position,
        events: []
    });

    component.modified = item => {
        const {
            Modified, Editor,
        } = item;

        const modifiedDate = new Date(Modified);
        const node = component.find('.item-info-modified');

        node.innerHTML = /*html*/ `<b>Last modified on</b> ${modifiedDate.toLocaleDateString()} <b>at</b> ${modifiedDate.toLocaleTimeString()} <b>by</b> ${Editor.Title}`;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LinksField(param) {
    const {
        label, description, fieldMargin, maxWidth, links, parent, position, onChange
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class="d-flex align-items-center">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Display</div>
                        </div>
                        <input type="text" class="form-control display" placeholder="My Dashboard">
                    </div>
                    <div class="input-group ml-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Address</div>
                        </div>
                        <input type="text" class="form-control url" placeholder="https://site.domain">
                    </div>
                    <button class="btn btn-robi ml-2">Add link</button>
                </div>
                <div class='links-container mt-3'>
                    <!-- Formatted links go here -->
                    ${
                        links ?
                        (() => {
                            try {
                                return JSON.parse(links).map(link => {
                                    const { url, display } = link;
        
                                    return /*html*/ `
                                        <div class='link' data-display='${display}' data-url='${url}'>
                                            <a href='${url}' target='_blank'>${display}</a>
                                            <button type="button" class="close remove-link" data-dismiss="modal" aria-label="Close">
                                                <span class="icon-container">
                                                    <svg class="icon x-circle-fill">
                                                        <use href="#icon-bs-x-circle-fill"></use>
                                                    </svg>
                                                    <svg class="icon circle-fill">
                                                        <use href="#icon-bs-circle-fill"></use>
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    `;
                                }).join('\n')
                            } catch (e) {
                                return links;
                            }
                        })() : ''
                }
                </div>
                <div class='mt-2 d-flex justify-content-end align-items-center'>
                    <button type='button' class='btn btn-robi-light'>Reset</button>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .links-container {
                position: relative;
                min-height: 56px;
                width: 100%;
                border-radius: 10px;
                border: 1px solid var(--border-color);
                padding: 10px;
            }
            
            #id .input-group {
                flex: 4
            }

            #id .btn {
                flex: 1;
                padding: 5.25px 12px;
            }

            #id .link {
                display: inline-flex;
                border-radius: 10px;
                padding: 5px 5px 5px 20px;
                background: var(--button-background);
                color: #007bff;
                font-weight: 500;
                font-size: 13px;
            }

            #id .link:not(:last-child) {
                margin-right: 10px;
            }
            
            #id .link *,
            #id .link *:active,
            #id .link *:focus {
                color: #007bff;
                text-decoration: none;
            }

            /* Remove */
            #id .close:focus {
                outline: none;
            }

            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
                margin-left: 15px;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                position: absolute;
                fill: white ;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .icon-container:hover > .circle-fill {
                fill: var(--primary);
            }

            #id .close .x-circle-fill {
                width: .85em;
                height: .85em;
                fill: darkgray;
                z-index: 10;
            }

            #id .close .circle-fill {
                width: .7em;
                height: .7em;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    addLink(event);
                }
            },
            {
                selector: '#id .url',
                event: 'keyup',
                listener(event) {
                    if (event.key == 'Enter') {
                        event.preventDefault();
                        event.stopPropagation();

                        addLink(event);
                    }
                }
            },
            {
                selector: '#id .remove-link',
                event: 'click',
                listener: removeLink
            }
        ],
        onAdd() {
        }
    });

    function addLink(event) {
        const display = component.find('.display');
        const url = component.find('.url');

        if (display.value && url.value) {
            component.find('.links-container').insertAdjacentHTML('beforeend', /*html*/ `
                <div class='link' data-display='${display.value}' data-url='${url.value}'>
                    <a href='${url.value}' target='_blank'>${display.value}</a>
                    <button type="button" class="close remove-link" data-display='${display.value}' data-dismiss="modal" aria-label="Close">
                        <span class="icon-container">
                            <svg class="icon x-circle-fill">
                                <use href="#icon-bs-x-circle-fill"></use>
                            </svg>
                            <svg class="icon circle-fill">
                                <use href="#icon-bs-circle-fill"></use>
                            </svg>
                        </span>
                    </button>
                </div>
            `);

            component.find(`.remove-link[data-display='${display.value}']`).addEventListener('click', removeLink);

            display.value = '';
            url.value = '';

            display.focus();

            if (onChange) {
                onChange(event);
            }
        } else {
            // TODO: change to dialog box
            alert('Please enter both display text and a valid address.');
        }
    }

    // FIXME: doesn't work
    function removeLink(event) {
        console.log('remove link');

        this.closest('.link').remove();

        if (onChange) {
            onChange(event);
        }
    }

    component.value = () => {
        // TODO: return formatted links to store in mlot field
        const links = component.findAll('.link');

        console.log(links);

        return [...links].map(link => {
            return {
                url: link.dataset.url,
                display: link.dataset.display
            };
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingBar(param) {
    const {
        displayTitle, displayLogo, displayText, loadingBar, onReady, parent, totalCount
    } = param;

    const logoPath = App.isProd() ? '../Images' : `${App.get('site')}/src/Images`;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar'>
                <div class='loading-message'>
                    <!-- <div class='loading-message-logo'></div> -->
                    <!-- <img class='loading-message-logo' src='${logoPath}/${displayLogo}' /> -->
                    <div class='loading-message-title'>${displayTitle}</div>
                    <div class='loading-bar-container ${loadingBar || ''}'>
                        <div class='loading-bar-status'></div>
                    </div>
                    <div class='loading-message-text'>${displayText || ''}</div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .loading-bar {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 50%;
                height: 100%;
                margin: auto;
                position: absolute;
                top: 0px; 
                left: 0; 
                bottom: 0;
                right: 0;
                animation: fadein 350ms ease-in-out forwards;
                transform: translateY(36px);
            }

            .loading-message {
                /* width: 90%; */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .loading-message-title{
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
                font-size: 3em; /* original value 3em */
                font-weight: 700;
                text-align: center;
            }

            /** TURNED OFF */
            .loading-message-text {
                display: none;
                min-height: 36px;
                font-size: 1.5em;
                font-weight: 400;
                text-align: center;
            }

            .loading-bar-container {
                width: 90%; /** original value 15% */
                margin-top: 15px;
                background: var(--background);
                border-radius: 10px;
            }
            
            .loading-bar-status {
                width: 0%;
                height: 15px;
                background: var(--primary);
                border-radius: 10px;
                transition: width 100ms ease-in-out;
            }

            .hidden {
                opacity: 0;
            }

            /* Logo */
            #id .loading-message-logo {
                max-width: 193px;
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                    transform: scale(0);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .fadeout {
                animation: fadeout 350ms ease-in-out forwards;
            }

            @keyframes fadeout {
                from {
                    opacity: 1;
                    transform: scale(1);
                    
                }

                to {
                    opacity: 0;
                    transform: scale(0);
                }
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '.loading-bar',
                event: 'listItemsReturned',
                listener() {
                    component.update(++counter);
                }
            },
            {
                selector: '.loading-bar',
                event: 'animationend',
                listener: ready
            }
        ]
    });

    function ready(event) {
        if (onReady) {
            onReady(event);
        }

        component.get().removeEventListener('animationend', ready);
    }

    let counter = 1;

    component.update = (param = {}) => {
        const {
            newDisplayText
        } = param;

        const progressBar = component.get();
        const statusBar = progressBar.querySelector('.loading-bar-status');
        const text = progressBar.querySelector('.loading-message-text');
        const percentComplete = (counter / totalCount) * 100;

        if (newDisplayText) {
            text.innerText = newDisplayText;
        }

        if (statusBar) {
            statusBar.style.width = `${percentComplete}%`;
            counter++;
        }
    };

    component.end = () => {
        return new Promise((resolve, reject) => {
            const loadingBar = component.get();

            if (loadingBar) {
                loadingBar.classList.add('fadeout');

                loadingBar.addEventListener('animationend', (event) => {
                    loadingBar.remove();
                    resolve(true);
                });
            }
        });
    };

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingSpinner(param) {
    const {
        font, type, color, message, classes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center ${classes?.join(' ')}'>
                <div class="mb-2 loading-message ${type ? `text-${type}` : 'text-robi'}" style='${`${color} !important` || 'darkgray'}; font-weight: 600;'>${message || 'Loading'}</div>
                <div class="spinner-grow ${type ? `text-${type}` : 'text-robi'}" style='color: ${`${color} !important` || 'darkgray'};' role="status"></div>
            </div>
        `,
        style: /*css*/ `
            #id * {
                color: inherit;
            }

            ${font ?
            /*css */ `
                    #id * {
                        font-family: ${font}
                    }
                ` : ''
            }
        `,
        parent,
        position,
        events: []
    });

    return component;
}

/**
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function LogForm(param) {
    const {
        item, parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        },
        {
            internalFieldName: 'SessionId',
            displayName: 'SessionId'
        },
        {
            internalFieldName: 'Title',
            displayName: 'Type'
        },
        {
            internalFieldName: 'FiscalYear',
            displayName: 'FiscalYear'
        },
        {
            internalFieldName: 'Module',
            displayName: 'Module',
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message'
        },
        {
            internalFieldName: 'StackTrace',
            displayName: 'Stack Trace',
            type: 'mlot'
        },
        {
            internalFieldName: 'Created',
            displayName: 'Created',
            type: 'date'
        },
        {
            internalFieldName: 'Author',
            displayName: 'Author'
        }
    ];

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName, displayName, type
        } = field;

        let value = item[internalFieldName]?.toString();

        if (type === 'date') {
            value = new Date(item[internalFieldName]);
        }

        else if (type === 'mlot') {
            value = item[internalFieldName].split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Message') {
            const data = JSON.parse(item.Message);

            value = /*html*/ `
                <table>
            `;

            for (const property in data) {
                value += /*html*/ `
                    <tr>
                        <th style='padding-right: 15px;'>${property}</th>
                        <td>${data[property]}</td>
                    </tr>
                `;
            }

            value += /*html*/ `
                </table>
            `;
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title;
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline;' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Errors */
    Errors({
        sessionId: item.SessionId,
        parent
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}

/**
 *
 * @param {*} param
 */
export async function Logs(param) {
    const {
        sessionId, parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    /** Get Errors */
    const logs = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(logs);

    /** Summary Card */
    const alertCard = Alert({
        text: logs.length > 0 ?
            /*html*/ `
                <h5>Logs: ${logs.length}</h5>
                <hr>
            ` :
            'No logs associated with this Session Id',
        type: logs.length > 0 ? 'info' : 'warning',
        margin: '0px 20px',
        parent: errorsContainer
    });

    alertCard.add();

    /** Add Errors to Alert */
    logs.forEach((item, index) => {
        const goToErrorButton = Button({
            action(event) {
                Route(`Developer/Logs/${item.Id}`);
            },
            parent: alertCard,
            margin: '0px 0px 20px 0px',
            type: 'btn-info',
            value: `Go to log: ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'FiscalYear',
                displayName: 'FiscalYear'
            },
            {
                internalFieldName: 'Module',
                displayName: 'Module',
            },
            {
                internalFieldName: 'Message',
                displayName: 'Message',
            },
            {
                internalFieldName: 'StackTrace',
                displayName: 'Stack Trace',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ];

        readOnlyFields.forEach(field => addReadOnlyField(field));

        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName, displayName, type
            } = field;

            let value = item[internalFieldName]?.toString();

            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName].split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Message') {
                const data = JSON.parse(item.Message);

                value = /*html*/ `
                    <table>
                `;

                for (const property in data) {
                    value += /*html*/ `
                        <tr>
                            <th style='padding-right: 15px;'>${property}</th>
                            <td>${data[property]}</td>
                        </tr>
                    `;
                }

                value += /*html*/ `
                    </table>
                `;
            }

            else if (internalFieldName === 'Author') {
                value = item.Author.Title;
            }

            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });

            component.add();
        }

        if (index < logs.length - 1) {
            alertCard.get().insertAdjacentHTML('beforeend', '<hr>');
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function LogsContainer({ parent }) {
    const logLoadingIndicator = LoadingSpinner({
        message: 'Loading logs',
        type: 'robi',
        parent: parent
    });

    logLoadingIndicator.add();

    const log = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        // top: '25',
    });

    const logCard = Card({
        background: 'var(--background)',
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        margin: '0px 0px 40px 0px',
        parent: parent
    });

    logCard.add();

    await Table({
        heading: 'Logs',
        headingMargin: '0px 0px 20px 0px',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttons: [],
        buttonColor: App.get('prefersColorScheme') === 'dark' ? '#303336' : '#dee2e6',
        showId: true,
        addButton: false,
        checkboxes: false,
        formTitleField: 'Id',
        order: [[0, 'desc']],
        items: log,
        editForm: LogForm,
        editFormTitle: 'Log',
        parent: logCard
    });

    logLoadingIndicator.remove();

    const errorsLoadingIndicator = LoadingSpinner({
        message: 'Loading errors',
        type: 'robi',
        parent: parent
    });

    errorsLoadingIndicator.add();

    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        // top: '25'
    });

    const errorsCard = Card({
        background: 'var(--background)',
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        margin: '0px 0px 40px 0px',
        parent: parent
    });

    errorsCard.add();

    await Table({
        heading: 'Errors',
        headingMargin: '0px 0px 20px 0px',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttonColor: App.get('prefersColorScheme') === 'dark' ? '#303336' : '#dee2e6',
        showId: true,
        addButton: false,
        checkboxes: false,
        formFooter: false,
        formTitleField: 'Id',
        order: [[0, 'desc']],
        items: errors,
        editForm: ErrorForm,
        editFormTitle: 'Error',
        parent: errorsCard
    });

    errorsLoadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LookupField(param) {
    const {
        label, description, fieldMargin, parent, position, onSelect, onClear, onSearch, onFocusout
    } = param;

    /*
        <!--<div class='dropdown-menu show' style='position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
            <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                <div style='color: var(--primary);'>Searching...</div>
                <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
            </div> 
        </div> -->
    */
    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
                <div class=''>
                    <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        <input class='form-field-search form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search'>
                    </div>
                    <div class='dropdown-menu'>
                        <!-- Show search spinner by -->
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: var(--primary);'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary); font-size: 13px;' role='status'></div>
                        </div> 
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: .9em;
                padding: 5px 0px;
            }

            #id .form-field-search {
                margin-top: 2px;
                margin-bottom: 4px;
                margin-right: 20px;
                min-height: 36px;
                min-width: 300px;
                padding: 5px 10px;
                background: white;
                border-radius: 4px;
            }

            #id .form-field-search::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            #id .form-field-search:active,
            #id .form-field-search:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px var(--primary);
            }

            /** Errors */
            #id span.alert-link:hover {
                cursor: pointer;
                text-decoration: underline;
            }

            /** Dropdown */
            #id .dropdown-menu {
                padding: 0px;
                overflow-y: overlay;
            }

            #id .dropdown-item-container {
                overflow-y: overlay;
            }

            #id .dropdown-menu a {
                outline: none;
                border: none;
            }
            
            #id .dropdown-item,
            #id .dropdown-item:focus,
            #id .dropdown-item:active, {
                cursor: pointer;
                outline: none;
                border: none;
            }

            /* Scroll container */
            #id .scroll-container {
                max-height: 300px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id input[type='search']`,
                event: 'focusout',
                listener(event) {
                    if (onFocusout) {
                        onFocusout(event);
                    }
                }
            },
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !component.find('.dropdown-menu').classList.contains('show')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return false;
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (!event.target.value) {
                        if (component.find('.dropdown-menu').classList.contains('show')) {
                            component.find('.toggle-search-list').click();
                        }

                        return;
                    }

                    /** Show dropdown menu  */
                    if (!component.find('.dropdown-menu').classList.contains('show')) {
                        component.find('.toggle-search-list').click();
                    }

                    /** Get menu node */
                    const menu = component.find('.dropdown-menu');

                    /** Reset list */
                    menu.innerHTML = /*html*/ `
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: var(--primary); font-size: 13px;'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
                        </div>
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
                    `;

                    /** Search accounts */
                    searchSiteUsers(event);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'keydown',
                listener(event) {
                    if (event.key === 'Escape' || event.key === 'Backspace') {
                        component.find('.toggle-search-list').click();
                        component.find(`input[type='search']`).focus();

                        event.preventDefault();

                        return false;
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    // console.log(event.target.innerText);
                    /** Set input value */
                    component.find('.form-field-search').value = event.target.innerText;

                    /** Get item */
                    // console.log(data);
                    const item = data.find(item => item.dmis_facility_name_label === event.target.innerText);

                    /** Call passed in onSelect function */
                    onSelect({
                        event,
                        item
                    });
                }
            }
        ]
    });

    /** Dropdown */
    function dropdownItemTemplate(item) {
        const { dmis_facility_name_label } = item;

        return /*html*/ `
            <div class='dropdown-item'>${dmis_facility_name_label}</div>
        `;
    }

    component.showSearchList = (param) => {
        const {
            items
        } = param;

        /** Get menu node */
        const menu = component.find('.dropdown-menu');

        /** Check if items exist*/
        if (items.length > 0) {
            /** Show if not open  */
            if (!menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }

            menu.innerHTML = /*html*/ `
                <div class='dropdown-item-container'>
                    <div class='scroll-container'>
                        ${items.map(item => dropdownItemTemplate(item)).join('\n')}
                    </div>
                </div>
            `;
        } else {
            if (menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }
        }
    };

    /** Search site users */
    let queries = [];
    let data = [];

    async function searchSiteUsers(event) {
        event.preventDefault();

        /** Abort previous queries */
        queries.forEach(query => {
            query.abortController.abort();
        });

        const query = event.target.value.toLowerCase();

        if (query === '') {
            event.target.dataset.itemid = '';

            // resetMenu();
            // removeSpinner();
            // console.log('reset');

            return;
        }

        removeNonefoundMessage();
        // addSpinner();

        const newSearch = await Get({
            abort: true,
            path: 'https://carepoint.health.mil/sites/J5',
            list: 'DMISDemo',
            filter: [
                `substringof('${query}', dmis_facility_name_label)`,
                `substringof('${query}', parent_dmis)`,
                `substringof('${query}', parent_dmis_name)`,
                `substringof('${query}', market_name)`,
                `substringof('${query}', reporting_market_name)`
            ].join(' or ')
        });

        queries.push(newSearch);
        // console.log(newSearch);

        const response = await newSearch.response;

        if (response) {
            // console.log(response);

            data = response;
            // data = response.map(user => {
            //     const {
            //         Name
            //     } = user;

            //     return {
            //         value: Name,
            //         info: user
            //     };
            // });

            if (data.length > 0) {
                // removeSpinner();
                // addDropDownMenu(event, data);
                component.showSearchList({
                    items: data
                });
            } else {
                // removeSpinner();
                addNoneFoundMessage();
            }
        }
    }

    /** Add none found message */
    function addNoneFoundMessage() {
        console.log('none found');

        // const message = component.find('.none-found');

        // if (!message) {
        //     const html = /*html*/ `
        //         <span class='none-found' style='color: firebrick;'>
        //             No accounts found that match this name.
        //         </span>
        //     `;

        //     component.get().insertAdjacentHTML('beforeend', html);
        // }
    }

    /** Remove none found message */
    function removeNonefoundMessage() {
        const message = component.find('.none-found');

        if (message) {
            message.remove();
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-search');

        setTimeout(() => {
            field.focus();
        }, 0);
    };

    component.addError = (param) => {
        /** Remove previous errors */
        component.removeError();

        /** Param can be a string or an object */
        let text = typeof param === 'object' ? param.text : param;

        /** Build error HTML */
        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
            /*html*/ ` 
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `;

        /** Add HTML to DOM */
        component.find('.form-field-search').insertAdjacentHTML('beforebegin', html);

        /** Add Event Listeners to embedded links */
        component.findAll('.alert .alert-link').forEach(link => {
            link.addEventListener('click', event => {
                if (event.target.dataset.route) {
                    Route(event.target.dataset.route);
                }
            });
        });
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find(`.form-field-search`);

        if (param !== undefined) {
            field.value = param;
        } else {
            return data.find(item => item.dmis_facility_name_label === field.value);
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function MainContainer(param) {
    const {
        parent
    } = param;

    const component = Component({
        name: 'maincontainer',
        html: /*html*/ `
            <div class='maincontainer'></div>
        `,
        style: /*css*/ `
            .maincontainer {
                position: relative;
                flex: 1;
                height: 100vh;
                overflow: overlay;
            }

            .maincontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        position: 'beforeend',
        events: []
    });

    component.dim = (toggle) => {
        const maincontainer = component.get();

        if (toggle) {
            maincontainer.classList.add('dim');
        } else {
            maincontainer.classList.remove('dim');
        }
    };

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    };

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    };

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Missing({ parent }) {
    const alertBanner = Alert({
        type: 'robi-primary',
        text: `Sorry! That page doesn't exist.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Modal(param) {
    const { 
        title,
        classes,
        titleStyle,
        headerStyle,
        footerStyle,
        closeStyle,
        close,
        addContent,
        buttons,
        centered,
        fade,
        background,
        fullSize,
        showFooter,
        scrollable,
        contentPadding,
        parent,
        disableBackdropClose,
        position,
        shadow 
    } = param;
    
    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <!-- <div class='modal${fade ? ' fade' : ''}' tabindex='-1' role='dialog' aria-hidden='true'> -->
            <div class='modal fade ${ classes?.length ? classes.join(' ') : ''}' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content'>
                        ${
                            !title ?
                            /*html*/ `
                                <button type='button' class='close ${close ? '' : 'd-none'}' style='position: absolute; right: 0px; ${closeStyle || ''}' data-dismiss='modal' aria-label='Close'>
                                    <!-- <span class='icon-container' style='right: 20px; top: 20px;'> -->
                                    <span class='icon-container'>
                                        <svg class='icon x-circle-fill'>
                                            <use href='#icon-bs-x-circle-fill'></use>
                                        </svg>
                                        <svg class='icon circle-fill' style='z-index: 1;'>
                                            <use href='#icon-bs-circle-fill'></use>
                                        </svg>
                                    <span>
                                </button>
                            ` :
                            /*html*/ `
                                <div class='modal-header' ${headerStyle ? `style='${headerStyle}'` : ''}>
                                    <h5 class='modal-title' ${titleStyle ? `style='${titleStyle}'` : ''}>${title || ''}</h5>
                                    ${
                                        close !== false ?
                                        /*html*/ `
                                            <button type='button' class='close' ${closeStyle ? `style='${closeStyle}'` : ''} data-dismiss='modal' aria-label='Close'>
                                                <span class='icon-container'>
                                                    <svg class='icon x-circle-fill'>
                                                        <use href='#icon-bs-x-circle-fill'></use>
                                                    </svg>
                                                    <svg class='icon circle-fill'>
                                                        <use href='#icon-bs-circle-fill'></use>
                                                    </svg>
                                                <span>
                                            </button>
                                        ` : ''
                                    }
                                </div>
                            `
                        }
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}' ${footerStyle ? `style='${footerStyle}'` : ''}>
                            ${addFooterButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /** Title */
            #id .modal-title {
                color: var(--primary);
            }

            #id.modal {
                overflow-y: overlay; 
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 20px;
                border: none;
                background: ${background || 'var(--secondary)'};
                padding: ${contentPadding || '0px'};
            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
                /* cursor: move; */
            }
            
            /** Footer */
            #id .modal-footer {
                border-top: none;
            }

            /** Button radius */
            #id .btn {
                border-radius: 10px;
            }

            #id .btn * {
                color: inherit;
            }

            /** Button color */
            #id .btn-success {
                background: seagreen;
                border: solid 1px seagreen;
            }

            #id .btn-robi-primary {
                background: royalblue;
                border: solid 1px royalblue;
            }

            #id .btn-danger {
                background: firebrick;
                border: solid 1px firebrick;
            }

            #id .btn-secondary {
                background: none;
                border: solid 1px transparent;
                color: var(--color);
                font-weight: 500;
            }

            /** Button focus */
            #id .btn:focus {
                box-shadow: none;
            }

            /** Close focus */
            #id .close:focus {
                outline: none;
            }

            /** Close */
            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
                width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                width: 20px;
                height: 20px;
                position: absolute;
                fill: darkgray;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .x-circle-fill {
                width: 24px;
                height: 24px;
                fill: var(--button-background);
                z-index: 10;
            }

            /** Footer */
            #id .modal-footer.hidden {
                display: none;
            }

            /** Zoom in */
            #id.fade {
                transition: opacity 75ms linear;
            }

            #id.modal.fade .modal-dialog {
                transition: transform 150ms ease-out, -webkit-transform 150ms ease-out;
            }

            #id.modal.fade .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(.5);
                transform: translate(0,0)scale(.5);
            }
            #id.modal.show .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(1);
                transform: translate(0,0)scale(1);
            }

            /** Override bootstrap defaults */
            ${fullSize ?
            /*css*/ `
                    #id .modal-lg, 
                    #id .modal-xl,
                    #id .modal-dialog {
                        max-width: initial !important;
                        margin: 40px !important;
                    }
                ` :
            ''}
            
            /* Passed in classes */
            /* #id.scrollbar-wide .modal-body::-webkit-scrollbar {
                width: 35px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-thumb {
                min-height: 50px;
            } */

            #id .modal-dialog-scrollable .modal-body {
                overflow-y: overlay;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar {
                width: 15px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-thumb {
                border: 4px solid transparent;
                border-radius: 20px;
                min-height: 75px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-button {
                height: 12px;
            }

            ${
                shadow ? 
                /* css */ `
                    #id .modal-content {
                        box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                    }
                ` : ''
            }

            /* No title */
            ${
                !title ?
                /*css*/ `
                    #id .modal-body::-webkit-scrollbar {
                        width: 60px;
                    }

                    #id .modal-body::-webkit-scrollbar-thumb {
                        border: 27px solid transparent;
                        border-radius: 60px;
                    }

                    #id .modal-body::-webkit-scrollbar-button {
                        height: 30px;
                    }
                ` : ''
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .btn`,
                event: 'click',
                listener(event) {
                    const button = buttons.footer.find(item => item.value === event.target.dataset.value);

                    if (button && button.onClick) {
                        button.onClick(event);
                    }
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).modal();

            if (addContent) {
                addContent(component.getModalBody());
            }

            // Draggable
            // $('.modal-header').on('mousedown', function(event) {
            //     const draggable = $(this);
            //     const extra = contentPadding ? parseInt(contentPadding.replace('px', '')) : 0;
            //     const x = event.pageX - ( draggable.offset().left - extra);
            //     const y = event.pageY - ( draggable.offset().top - extra);

            //     $('body').on('mousemove.draggable', function(event) {
            //         draggable.closest('.modal-content').offset({
            //             left: event.pageX - x,
            //             top: event.pageY - y
            //         });
            //     });

            //     $('body').one('mouseup', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     $('body').one('mouseleave', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     draggable.closest('.modal').one('bs.modal.hide', function() {
            //         $('body').off('mousemove.draggable');
            //     });
            // });

            /** Close listener */
            $(component.get()).on('hidden.bs.modal', function (e) {
                component.remove();
            });

            if (title) {
                /** Scroll listener */
                component.find('.modal-body').addEventListener('scroll', event => {
                    if (event.target.scrollTop > 0) {
                        event.target.style.borderTop = `solid 1px ${App.get('sidebarBorderColor')}`;
                    } else {
                        event.target.style.borderTop = `none`;
                    }
                });
            }
        }
    });

    function addFooterButtons() {
        let html = '';

        if (buttons && buttons.footer && Array.isArray(buttons.footer) && buttons.footer.length > 0) {
            // Delete button on left
            const deleteButton = buttons.footer.find(button => button.value.toLowerCase() === 'delete');

            if (deleteButton) {
                const { value, disabled, data, classes, inlineStyle } = deleteButton;
                html += /*html*/ `
                    <div style='flex: 2'>
                        <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                    </div>
                `;
            }

            html += /*html*/ `
                <div>
            `;

            // All other buttons on right
            buttons.footer
                .filter(button => button.value.toLowerCase() !== 'delete')
                .forEach(button => {
                    const {
                        value, disabled, data, classes, inlineStyle
                    } = button;

                    html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
                });

            html += /*html*/ `
                </div>
            `;
        }

        return html;
    }

    function buildDataAttributes(data) {
        if (!data) {
            return '';
        }

        return data
            .map(attr => {
                const {
                    name, value
                } = attr;

                return `data-${name}='${value}'`;
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    };

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    };

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    };

    component.getModal = () => {
        return $(`#${component.get().id}`);
    };

    component.getHeader = () => {
        return component.find('.modal-header');
    };

    component.close = (onClose) => {
        if (onClose) {
            $(component.get()).on('hidden.bs.modal', event => {
                onClose(event);
            });
        }

        $(`#${component.get().id}`).modal('hide');
    };

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    };

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    };

    component.setTitle = (text) => {
        const node = component.find('.modal-title');

        if (node) {
            node.innerHTML = text;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ModalSlideUp(param) {
    const {
        title, titleStyle, headerStyle, footerStyle, close, addContent, buttons, centered, fade, background, fullSize, showFooter, scrollable, contentPadding, parent, disableBackdropClose, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <div class='modal animate' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content animate-bottom'>
                        ${
                            !title ?
                            /*html*/ `` :
                            /*html*/ `
                                <div class='modal-header' ${headerStyle ? `style='${headerStyle}'` : ''}>
                                    <h5 class='modal-title' ${titleStyle ? `style='${titleStyle}'` : ''}>${title || ''}</h5>
                                    ${
                                        close !== false ?
                                        /*html*/ `
                                            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                                <span class='icon-container'>
                                                    <svg class='icon x-circle-fill'>
                                                        <use href='#icon-bs-x-circle-fill'></use>
                                                    </svg>
                                                    <svg class='icon circle-fill'>
                                                        <use href='#icon-bs-circle-fill'></use>
                                                    </svg>
                                                <span>
                                            </button>
                                        ` : ''
                                    }
                                </div>
                            `
                        }
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}' ${footerStyle ? `style='${footerStyle}'` : ''}>
                            ${addFooterButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /** Title */
            #id .modal-title {
                color: var(--primary);
            }

            #id.modal {
                overflow-y: hidden;
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 20px 20px 0px 0px;
                border: none;
                background: ${background || ''};
                padding: ${contentPadding || '0px'};
            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
                /* cursor: move; */
            }

            /* Body */
            #id .modal-body {
                padding-bottom: 100px;
            }
            
            /** Footer */
            #id .modal-footer {
                border-top: none;
            }

            /** Button radius */
            #id .btn {
                border-radius: 10px;
            }

            #id .btn * {
                color: inherit;
            }

            /** Button color */
            #id .btn-success {
                background: seagreen;
                border: solid 1px seagreen;
            }

            #id .btn-robi-primary {
                background: royalblue;
                border: solid 1px royalblue;
            }

            #id .btn-danger {
                background: firebrick;
                border: solid 1px firebrick;
            }

            #id .btn-secondary {
                background: none;
                border: solid 1px transparent;
                color: var(--color);
                font-weight: 500;
            }

            /** Button focus */
            #id .btn:focus {
                box-shadow: none;
            }

            /** Close focus */
            #id .close:focus {
                outline: none;
            }

            /** Close */
            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                position: absolute;
                fill: darkgray;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .icon-container:hover > .circle-fill {
                fill: var(--primary);
            }

            #id .close .x-circle-fill {
                width: 1.2em;
                height: 1.2em;
                fill: var(--button-background);
                z-index: 10;
            }

            /** Footer */
            #id .modal-footer.hidden {
                display: none;
            }

            /** Zoom in */
            #id.fade {
                transition: opacity 75ms linear;
            }

            #id.modal.fade .modal-dialog {
                transition: transform 150ms ease-out, -webkit-transform 150ms ease-out;
            }

            #id.modal.fade .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(.5);
                transform: translate(0,0)scale(.5);
            }
            #id.modal.show .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(1);
                transform: translate(0,0)scale(1);
            }

            /** Override bootstrap defaults */
            ${fullSize ?
            /*css*/ `
                    #id .modal-lg, 
                    #id .modal-xl,
                    #id .modal-dialog {
                        max-width: initial !important;
                        margin: 40px !important;
                    }
                ` :
            ''}

            /* Slide up animation */
            #id .modal-dialog {
                position: relative;
                transform: translateY(30px) !important;
                width: calc(100vw - 10px);
                max-width: 100%;
            }

            .animate-bottom {
                min-height: 100vh;
                animation: animatebottom 500ms ease-in-out;
            }
              
            @keyframes animatebottom {
                from {
                    bottom: -300px;
                    opacity: 0;
                }
                
                to {
                    bottom: 0;
                    opacity: 1;
                }
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .btn`,
                event: 'click',
                listener(event) {
                    const button = buttons.footer.find(item => item.value === event.target.dataset.value);

                    if (button && button.onClick) {
                        button.onClick(event);
                    }
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).modal();

            if (addContent) {
                addContent(component.getModalBody());
            }

            // Draggable
            // $('.modal-header').on('mousedown', function(event) {
            //     const draggable = $(this);
            //     const extra = contentPadding ? parseInt(contentPadding.replace('px', '')) : 0;
            //     const x = event.pageX - ( draggable.offset().left - extra);
            //     const y = event.pageY - ( draggable.offset().top - extra);

            //     $('body').on('mousemove.draggable', function(event) {
            //         draggable.closest('.modal-content').offset({
            //             left: event.pageX - x,
            //             top: event.pageY - y
            //         });
            //     });

            //     $('body').one('mouseup', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     $('body').one('mouseleave', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     draggable.closest('.modal').one('bs.modal.hide', function() {
            //         $('body').off('mousemove.draggable');
            //     });
            // });

            /** Close listener */
            $(component.get()).on('hidden.bs.modal', function (e) {
                component.remove();
            });

            if (title) {
                /** Scroll listener */
                component.find('.modal-body').addEventListener('scroll', event => {
                    if (event.target.scrollTop > 0) {
                        event.target.style.borderTop = `solid 1px ${App.get('sidebarBorderColor')}`;
                    } else {
                        event.target.style.borderTop = `none`;
                    }
                });
            }
        }
    });

    function addFooterButtons() {
        let html = '';

        if (buttons && buttons.footer && Array.isArray(buttons.footer) && buttons.footer.length > 0) {
            // Delete button on left
            const deleteButton = buttons.footer.find(button => button.value.toLowerCase() === 'delete');

            if (deleteButton) {
                const { value, disabled, data, classes, inlineStyle } = deleteButton;
                html += /*html*/ `
                    <div style='flex: 2'>
                        <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                    </div>
                `;
            }

            html += /*html*/ `
                <div>
            `;

            // All other buttons on right
            buttons.footer
                .filter(button => button.value.toLowerCase() !== 'delete')
                .forEach(button => {
                    const {
                        value, disabled, data, classes, inlineStyle
                    } = button;

                    html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
                });

            html += /*html*/ `
                </div>
            `;
        }

        return html;
    }

    function buildDataAttributes(data) {
        if (!data) {
            return '';
        }

        return data
            .map(attr => {
                const {
                    name, value
                } = attr;

                return `data-${name}='${value}'`;
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    };

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    };

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    };

    component.getModal = () => {
        return $(`#${component.get().id}`);
    };

    component.close = () => {
        return $(`#${component.get().id}`).modal('hide');
    };

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    };

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function MultiChoiceField(param) {
    const {
        choices,
        description,
        fieldMargin,
        fillIn,
        label,
        onChange,
        parent,
        position,
        validate,
        value
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='checkbox-container'>
                    ${
                        choices.map(choice => {
                            const id = GenerateUUID();

                            return /*html*/ `
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="${id}" data-label='${choice}' ${value?.includes(choice) ? 'checked' : ''}>
                                    <label class="custom-control-label" for="${id}">${choice}</label>
                                </div>
                            `;
                        }).join('\n')
                    }
                    ${
                        fillIn ?
                        (() => {
                            const id = GenerateUUID();
                            // FIXME: this wil probably break if fill in choice is the same as one of the choices
                            const otherValue = value ? value.find(item => !choices.includes(item)) : '';

                            return /*html*/ `
                                <div class="custom-control custom-checkbox d-flex align-items-center">
                                    <input type="checkbox" class="custom-control-input other-checkbox" id="${id}" data-label='Other' ${otherValue ? 'checked' : ''}>
                                    <label class="custom-control-label d-flex align-items-center other-label" for="${id}">Other</label>
                                    <input type='text' class='form-control ml-2 Other' value='${otherValue || ''}' list='autocompleteOff' autocomplete='new-password'>
                                </div>
                            `;
                        })() : ''
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
            
            #id .custom-control-label {
                font-size: 13px;
                font-weight: 400;
                white-space: nowrap;
            }
            
            #id .checkbox-container {
                border-radius: 10px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .custom-control-input',
                event: 'change',
                listener(event) {
                    console.log(event.target.checked);

                    if (validate) {
                        validate();
                    }

                    if (onChange) {
                        onChange(event);
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'click',
                listener(event) {
                    component.find('input[data-label="Other"]').checked = true;
                }
            },
            {
                selector: '#id .Other',
                event: 'focusout',
                listener(event) {
                    if (!event.target.value) {
                        component.find('input[data-label="Other"]').checked = false;
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'keyup',
                listener(event) {
                    if (event.target.value && onChange) {
                        onChange(event);
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'focusout',
                listener(event) {
                    if (validate) {
                        validate(event);
                    }
                }
            }
        ],
    });

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };

    component.value = (param, options = {}) => {
        const checked = component.findAll('.custom-control-input:not(.other-checkbox):checked');
        const results = [...checked].map(node => node.dataset.label);
        const other = component.find('.custom-control-input.other-checkbox:checked');

        if (fillIn && other) {
            results.push(component.find('.Other').value);
        }

        return results;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function MultiLineTextField(param) {
    const {
        label,
        description,
        optional,
        value,
        readOnly,
        placeHolder,
        parent,
        position,
        minHeight,
        width,
        fieldMargin,
        padding,
        onKeydown,
        onKeyup,
        onFocusout,
        onPaste
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label class='field-label'>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${readOnly ? /*html*/ `<div class='form-field-multi-line-text readonly'>${value || placeHolder}</div>` : /*html*/ `<div class='form-field-multi-line-text editable' contenteditable='true'>${value || ''}</div>`}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .form-field-multi-line-text {
                color: var(--color);
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 0.375rem 0.75rem;
            }

            #id .form-field-multi-line-text > * {
                color: var(--color);
            }

            #id .form-field-multi-line-text.editable {
                min-height: ${minHeight || `200px`};
                width: ${width || 'unset'};
                border-radius: 4px;
                border: 1px solid var(--border-color);
            }

            #id .form-field-multi-line-text.editable:active,
            #id .form-field-multi-line-text.editable:focus {
                outline: none;
            }

            /** Readonly */
            #id .form-field-multi-line-text.readonly {
                user-select: none;
                background: transparent;
                border: solid 1px rgba(0, 0, 0, .05);
                background: white;
                border-radius: 4px;
            }

            /* Optional */
            #id .optional {
                margin: 0px 5px;
                font-size: .8em;
                color: gray;
                font-weight: 400;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'paste',
                listener: onPaste
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-multi-line-text');

        field.focus();
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };

    component.value = (param, options = {}) => {
        const field = component.find('.form-field-multi-line-text');

        if (param !== undefined) {
            field.innerHTML = param;
        } else {
            if (options.plainText === true) {
                return field.innerText;
            } else {
                return field.innerHTML;
            }
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function MyTheme(param) {
    const {
        parent, position, margin
    } = param;

    const theme = Themes.find(item => item.name === App.get('theme'));

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='themes'>
                    ${containerTemplate({ theme, mode: 'light' })}
                    ${containerTemplate({ theme, mode: 'dark' })}
                </div>
                <div class='d-flex align-items-center'>
                    <div>Operating System Preference</div>
                    <div class="custom-control custom-switch grab switch">
                        <input type="checkbox" class="custom-control-input" id='os-switch' data-mode='os'>
                        <label class="custom-control-label" for="os-switch"></label>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id .themes {
                display: flex;
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .theme-app-container:not(:last-child) {
                margin-right: 30px;
            }

            #id .theme-app {
                cursor: pointer;
                display: flex;
                height: 150px;
                width: 200px;
                border-radius: 10px;
            }

            #id .theme-sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                border-radius: 10px 0px 0px 10px;
                flex: 1;
            }

            #id .theme-sidebar-title {
                margin: 8px 4px 0px 4px;
                padding: 0px 8px;
                font-weight: 700;
                font-size: 13px;
            }

            #id .theme-nav {
                margin: 0px 4px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 11px;
                white-space: nowrap;
            }

            #id .theme-nav.selected {
                margin: 4px 4px 0px 4px;
            }

            #id .theme-maincontainer {
                display: flex;
                flex-direction: column;
                flex: 2;
                border-radius: 0px 10px 10px 0px;
                padding: 8px;
            }

            #id .theme-title {
                font-weight: 700;
                font-size: 13px;
                margin-bottom: 8px;
            }

            #id .theme-maincontainer .btn {
                font-size: 10.25px;
                padding: 6px 9px;
            }

            #id .theme-maincontainer .background {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                border-radius: 10px;
                margin-top: 8px;
                font-size: 14px;
                font-weight: 500;                
            }

            /* Switch */
            #id .custom-control-input:checked
            #id .custom-control-input:checked ~ label {
                pointer-events: none;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .custom-control-input',
                event: 'change',
                listener(event) {
                    // Selected mode
                    const mode = event.target.dataset.mode;

                    // Deselect both switches
                    component.findAll('.custom-control-input').forEach(node => node.checked = false);

                    // Always select current switch
                    event.target.checked = true;

                    if (mode == 'os') {
                        // Remove key from local storage
                        RemoveLocal("prefersColorScheme");
                    } else {
                        // Save user preference to local storage
                        SetLocal('prefersColorScheme', mode);
                    }

                    // Reset theme
                    SetTheme();
                }
            }
        ],
        onAdd() {
            if (!GetLocal('prefersColorScheme')) {
                // Deselect mode
                component.find('.custom-control-input:checked').checked = false;

                // Select OS switch
                component.find('.custom-control-input[data-mode="os"]').checked = true;
            }
        }
    });

    function containerTemplate({theme, mode}) {
        const { name } = theme;

        return /*html*/ `
            <div class='theme-app-container d-flex flex-column justify-content-center align-items-center mb-4' data-theme='${name}'>
                ${themeTemplate({theme, mode})}
                <!-- Toggle Light/Dark Mode -->
                <div class='d-flex justify-content-center align-items-center'>
                    <div class="mode mr-2">
                        <div class="custom-control custom-switch grab switch">
                            <input type="checkbox" class="custom-control-input" id='${mode}-switch' data-mode='${mode}' ${App.get('prefersColorScheme') === mode ? 'checked' : ''}>
                            <label class="custom-control-label" for="${mode}-switch"></label>
                        </div>
                    </div>
                    <div class='mode-text' data-toggleid="toggle-${name}">${mode === 'light' ? 'Light' : 'Dark'}</div>
                </div>
            </div>
        `
    }

    function themeTemplate({theme, mode}) {
        const { name } = theme;
        const { primary, secondary, background, color, borderColor, buttonBackgroundColor } = theme[mode];

        return /*html*/ `
            <div class='theme-app' style='color: ${color}; border: solid 1px ${borderColor}' data-theme='${name}'>
                <div class='theme-sidebar' style='background: ${background}; border-right: solid 1px ${borderColor};'>
                    <div class='theme-sidebar-title'>Title</div>
                    <div class='theme-nav selected' style='background: ${primary}; color: white;'>Route 1</div>
                    <div class='theme-nav'>Route 2</div>
                    <div class='theme-nav'>Route 3</div>
                </div>
                <div class='theme-maincontainer' style='background: ${secondary};'>
                    <div class='theme-title'>${name}</div>
                    <div>
                        <div class="btn" style='background: ${buttonBackgroundColor}; color: ${primary}'>Button</div>
                        <div class="btn" style='background: ${primary}; color: ${secondary}'>Button</div>
                    </div>
                    <div class='background' style='background: ${background}'>
                        Aa
                    </div>
                </div>
            </div>
        `;
    }

    // TODO: Set value
    component.value = () => {
        return component.find('.theme-app.selected')?.dataset.theme;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NameField(param) {
    const {
        label, description, fieldMargin, parent, position, onSelect, onClear, onSearch
    } = param;

    /*
        <!--<div class='dropdown-menu show' style='position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
            <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                <div style='color: var(--primary);'>Searching...</div>
                <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
            </div> 
        </div> -->
    */
    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
                <div class=''>
                    <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        <input class='form-field-name form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search'>
                    </div>
                    <div class='dropdown-menu'>
                        <!-- Show search spinner by -->
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: var(--primary);'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary); font-size: 13px;' role='status'></div>
                        </div> 
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: .9em;
                padding: 5px 0px;
            }

            #id .form-field-name {
                margin-top: 2px;
                margin-bottom: 4px;
                margin-right: 20px;
                min-height: 36px;
                min-width: 300px;
                padding: 5px 10px;
                background: white;
                border-radius: 4px;
            }

            #id .form-field-name::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            #id .form-field-name:active,
            #id .form-field-name:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px var(--primary);
            }

            /** Errors */
            #id span.alert-link:hover {
                cursor: pointer;
                text-decoration: underline;
            }

            /** Dropdown */
            #id .dropdown-menu {
                padding: 0px;
                overflow-y: overlay;
            }

            #id .dropdown-item-container {
                overflow-y: overlay;
            }

            #id .dropdown-menu a {
                outline: none;
                border: none;
            }
            
            #id .dropdown-item,
            #id .dropdown-item:focus,
            #id .dropdown-item:active, {
                cursor: pointer;
                outline: none;
                border: none;
            }

            /* Scroll container */
            #id .scroll-container {
                max-height: 300px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !component.find('.dropdown-menu').classList.contains('show')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return false;
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (!event.target.value) {
                        if (component.find('.dropdown-menu').classList.contains('show')) {
                            component.find('.toggle-search-list').click();
                        }

                        return;
                    }

                    /** Show dropdown menu  */
                    if (!component.find('.dropdown-menu').classList.contains('show')) {
                        component.find('.toggle-search-list').click();
                    }

                    /** Get menu node */
                    const menu = component.find('.dropdown-menu');

                    /** Reset list */
                    menu.innerHTML = /*html*/ `
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: var(--primary); font-size: 13px;'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
                        </div>
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
                    `;

                    /** Search accounts */
                    searchSiteUsers(event);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'keydown',
                listener(event) {
                    if (event.key === 'Escape' || event.key === 'Backspace') {
                        component.find('.toggle-search-list').click();
                        component.find(`input[type='search']`).focus();

                        event.preventDefault();

                        return false;
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    /** Set input value */
                    component.find('.form-field-name').value = event.target.innerText;

                    /** Get item */
                    const item = data.find(user => user.info.Account === event.target.dataset.account);

                    /** Call passed in onSelect function */
                    onSelect({
                        event,
                        users: item.Info
                    });
                }
            }
        ]
    });

    /** Dropdown */
    function dropdownItemTemplate(item) {
        const {
            value, info
        } = item;

        const {
            Account
        } = info;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-account='${Account}'>${value}</a>
        `;
    }

    component.showSearchList = (param) => {
        const {
            items
        } = param;

        /** Get menu node */
        const menu = component.find('.dropdown-menu');

        /** Check if items exist*/
        if (items.length > 0) {
            /** Show if not open  */
            if (!menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }

            menu.innerHTML = /*html*/ `
                <div class='dropdown-item-container'>
                    <div class='scroll-container'>
                        ${items.map(item => dropdownItemTemplate(item)).join('\n')}
                    </div>
                </div>
            `;
        } else {
            if (menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }
        }
    };

    /** Search site users */
    let queries = [];
    let data = [];

    async function searchSiteUsers(event) {
        event.preventDefault();

        /** Abort previous queries */
        queries.forEach(query => {
            query.abortController.abort();
        });

        const query = event.target.value.toLowerCase();

        if (query === '') {
            event.target.dataset.itemid = '';

            // resetMenu();
            // removeSpinner();
            console.log('reset');

            return;
        }

        removeNonefoundMessage();
        // addSpinner();
        const newSearch = GetSiteUsers({
            query
        });

        queries.push(newSearch);

        // console.log(newSearch);

        const response = await newSearch.response;

        if (response) {
            console.log(response);

            data = response.map(user => {
                const {
                    Name
                } = user;

                return {
                    value: Name,
                    info: user
                };
            });

            if (data.length > 0) {
                // removeSpinner();
                // addDropDownMenu(event, data);
                component.showSearchList({
                    items: data
                });
            } else {
                // removeSpinner();
                addNoneFoundMessage();
            }
        }
    }

    /** Add none found message */
    function addNoneFoundMessage() {
        console.log('none found');

        // const message = component.find('.none-found');

        // if (!message) {
        //     const html = /*html*/ `
        //         <span class='none-found' style='color: firebrick;'>
        //             No accounts found that match this name.
        //         </span>
        //     `;

        //     component.get().insertAdjacentHTML('beforeend', html);
        // }
    }

    /** Remove none found message */
    function removeNonefoundMessage() {
        const message = component.find('.none-found');

        if (message) {
            message.remove();
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-name');

        setTimeout(() => {
            field.focus();
        }, 0);
    };

    component.addError = (param) => {
        /** Remove previous errors */
        component.removeError();

        /** Param can be a string or an object */
        let text = typeof param === 'object' ? param.text : param;

        /** Build error HTML */
        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
            /*html*/ ` 
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `;

        /** Add HTML to DOM */
        component.find('.form-field-name').insertAdjacentHTML('beforebegin', html);

        /** Add Event Listeners to embedded links */
        component.findAll('.alert .alert-link').forEach(link => {
            link.addEventListener('click', event => {
                if (event.target.dataset.route) {
                    Route(event.target.dataset.route);
                }
            });
        });
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const nameField = component.find(`.form-field-name`);

        if (param) {
            nameField.innerText = param;
        } else if (param === '') {
            nameField.innerText = '';
        } else {
            const nameAndAccount = nameField.innerText.replace(' (US)', '').split(' - ');
            const fullName = nameAndAccount[0];
            const nameParts = fullName.split(', ');
            const lastName = nameParts[0];
            const firstNameParts = nameParts[1].split(' ');
            const firstName = firstNameParts[0];
            const command = firstNameParts[firstNameParts.length - 1];
            const accountParts = nameAndAccount[1].split('\\');
            const domain = accountParts[0];
            const account = accountParts[1];

            return {
                fullName,
                lastName,
                firstName,
                domain,
                account,
                command
            };
        }
    };

    return component;
}

/**
 * 
 * @param {*} param
 * @returns 
 */
export async function NewForm({ fields, list, parent }) {
    if (!Array.isArray(fields)) {
        return false;
    }

    const components = fields.filter(field => field.name !== 'Id').map(field => {
        const { name, display, type, value, validate, choices, fillIn } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'choice':
                component = ChoiceField({
                    label: display || name,
                    value,
                    options: choices.map(choice => {
                        return {
                            label: choice
                        };
                    }),
                    parent,
                    action: onFocusout 
                });
                break;
            case 'multichoice':
                component = MultiChoiceField({
                    label: display || name,
                    value,
                    fillIn,
                    choices,
                    parent,
                    validate: onFocusout
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
        }

        function onFocusout() {
            return !validate ? undefined : (() => {
                const value = component.value();

                console.log('validate');
    
                if (validate(value)) {
                    component.isValid(true);
                } else {
                    component.isValid(false);
                }
            })();
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onCreate() {
            let isValid = true;

            const data = {};

            components.forEach(item => {
                const { component, field } = item;
                const { name, type, validate } = field;

                const value = component.value();

                console.log(name, value);

                switch (type) {
                    case 'slot':
                    case 'mlot':
                    case 'choice':
                    case 'date':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = value;
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value) {
                            data[name] = value;
                        }
                        break;
                    case 'multichoice':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = {
                                    results: value
                                };
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value.length) {
                            data[name] = {
                                results: value
                            };
                        }
                        break;
                    case 'number':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = value;
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value) {
                            data[name] = parseInt(value);
                        }
                        break;
                }
            });

            console.log(isValid, data);

            if (!isValid) {
                return false;
            }

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NewQuestion(param) {
    const {
        parent, modal
    } = param;

    /** First Name */
    const titleField = SingleLineTextField({
        label: 'Question',
        description: '',
        width: '100%',
        parent,
        onKeydown(event) {
            if (event.target.value) {
                console.log(modal.getButton('Submit'));
                modal.getButton('Submit').disabled = false;
            } else {
                modal.getButton('Submit').disabled = true;
            }

            submit(event);
        }
    });

    titleField.add();

    /** Middle Name */
    const bodyField = MultiLineTextField({
        label: 'Description',
        description: '',
        width: '100%',
        optional: true,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });

    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Submit');

            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            };

            if (!data.Title) {
                /** @todo field.addError() */
                return false;
            }

            return data;
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NewReply(param) {
    const {
        width, action, parent, position, margin
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <div class='new-reply-label'>New reply</div>
                <!-- New Comment -->
                <div class='new-comment-container'>
                    <div class='new-comment' contenteditable='true'></div>
                    <!-- Button -->
                    <div class='new-comment-button-container'>
                        <div class='new-comment-button'>
                            <svg class='icon'>
                                <use href='#icon-arrow-up2'></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .comments-container {
                width: ${width || '100%'};
                max-height: 80vw;
                padding-bottom: 20px;
                margin: ${margin || '20px 0px 0px 0px'};
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: #F8F8FC;
                border-radius: 20px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                /* font-size: 13px; */
                /* font-weight: 500; */
                padding: 10px 20px;
                border-radius: 20px 0px 0px 20px;
                border-left: solid 3px #F8F8FC;
                border-top: solid 3px #F8F8FC;
                border-bottom: solid 3px #F8F8FC;
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 3px var(--primary-6b);
                border-top: solid 3px var(--primary-6b);
                border-bottom: solid 3px var(--primary-6b);
            }

            #id .new-comment-button-container {
                display: flex;
                align-items: end;
                border-radius: 0px 20px 20px 0px;
                border-right: solid 3px #F8F8FC;
                border-top: solid 3px #F8F8FC;
                border-bottom: solid 3px #F8F8FC;
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 20px 20px 0px;
                border-right: solid 3px var(--primary-6b);
                border-top: solid 3px var(--primary-6b);
                border-bottom: solid 3px var(--primary-6b);
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: flex;
                margin: 6px;
                padding: 8px;
                font-weight: bold;
                text-align: center;
                border-radius: 50%;
                color: white;
                background: var(--button-background);
            }

            #id .new-comment-button .icon {
                fill: var(--primary);
            }

            /* Label */
            #id .new-reply-label {
                font-weight: 500;
                margin-bottom: 5px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.ctrlKey && event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment',
                event: 'paste',
                async listener(event) {
                    // cancel paste
                    event.preventDefault();

                    // get text representation of clipboard
                    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

                    // insert text manually
                    event.target.innerText = text;
            }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const value = field.innerHTML;

                    if (value) {
                        action({
                            value,
                            button: this,
                            field,
                        });
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    component.focus = () => {
        component.find('.new-comment').focus();
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function NewUser(param) {
    const {
        table, modal, parent, list, event
    } = param;

    /** Name */
    // const nameField = NameField({
    //     label: 'Search CarePoint Accounts',
    //     description: 'If an account is found, Account and Email Fields will be set automatically.',
    //     fieldMargin: '0px 40px 20px 40px',
    //     parent,
    //     onInput(event) {
    //         const value = event.target.innerText;
    //         if (!value) {
    //             accountField.value('');
    //             emailField.value('');
    //         }
    //     },
    //     async onSetValue(data) {
    //         const {
    //             info
    //         } = data.newValue;
    //         if (info) {
    //             const {
    //                 Account,
    //                 WorkEmail
    //             } = info;
    //             /** Check if account exists */
    //             if (Account !== '')  {
    //                 const userItem = await Get({
    //                     list: 'Users',
    //                     select: 'Id,LoginName',
    //                     filter: `LoginName eq '${Account.split('|')[2]}'`
    //                 });
    //                 if (userItem[0]) {
    //                     readOnlyCard.update({
    //                         type: 'secondary'
    //                     });
    //                     accountField.value('None');
    //                     emailField.value('None');
    //                     nameField.value('');
    //                     const link = `Users/${userItem[0].Id}`;
    //                     nameField.addError({
    //                         text: /*html*/ `
    //                             An account for this user already exists. <span class='alert-link' data-route='${link}'>Click here to view it.</span> Or search for another name.
    //                         `
    //                     });
    //                     return;
    //                 } else {
    //                     nameField.removeError();
    //                 }
    //             }
    //             readOnlyCard.update({
    //                 type: 'success'
    //             });
    //             if (Account) {
    //                 accountField.value(Account.split('|')[2]);
    //             }
    //             if (WorkEmail) {
    //                 emailField.value(WorkEmail);
    //             }
    //         }
    //     }
    // });
    // nameField.add();
    
    /** Name Field */
    const nameField = NameField({
        label: 'Name',
        // description: 'If an account is found, Account and Email Fields will be set automatically.',
        parent,
        onSearch(query) {
            console.log(query);
        },
        onSelect(data) {
            const {
                event, user
            } = param;

            console.log(data);
        },
        onClear(event) {
            console.log('clear name fields');
        }
    });

    nameField.add();

    /** Read Only Card */
    const readOnlyCard = Alert({
        text: '',
        type: 'robi-secondary',
        parent
    });

    readOnlyCard.add();

    /** Account */
    const accountField = SingleLineTextField({
        label: 'Account',
        value: 'None',
        readOnly: true,
        parent: readOnlyCard
    });

    accountField.add();

    /** Email */
    const emailField = SingleLineTextField({
        label: 'Email',
        value: 'None',
        readOnly: true,
        parent: readOnlyCard
    });

    emailField.add();

    const roles = await Get({
        list: 'Roles'
    });

    /** Role */
    const roleField = ChoiceField({
        label: 'Role',
        value: 'User',
        options: roles.map(item => {
            const { Title } = item;

            return { label: Title };
        }),
        width: '200px',
        parent
    });

    roleField.add();

    return {
        async onCreate(event) {
            // Create user
            console.log(event);
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NumberField(param) {
    const {
        label, description, value, parent, position, fieldMargin, onChange, onKeydown, onKeyup, onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='field-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input type="number" class="form-control" value="${value !== undefined ? parseFloat(value) : ''}">
            </div>
        `,
        style: /*css*/ `
            #id {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id input',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id input',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id input',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id input',
                event: 'change',
                listener: onChange
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };

    component.value = (param) => {
        const field = component.find('input');

        if (param !== undefined) {
            console.log(param);
            field.value = parseFloat(param);
        } else {
            return parseFloat(field.value) || undefined;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function PercentField(param) {
    const {
        label, description, value, readOnly, parent, position, width, margin, padding, background, borderRadius, flex, maxWidth, fieldMargin, optional, onKeydown, onFocusout
    } = param;

    let percentage = value !== undefined ? Math.round(parseFloat(value) * 100) : '';

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                <div class="input-group mb-3 ${setColor(percentage)}">
                    <input type="number" class="form-control" value="${percentage}" ${readOnly ? 'readonly' : ''}>
                    <div class="input-group-append">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                ${margin ? `margin: ${margin};` : ''}
            }

            #id label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
                margin-bottom: 0px;
            }

            #id input[readonly] {
                pointer-events: none;
            }

            /* Green */
            #id .input-group.green input,
            #id .input-group.green .input-group-text {
                background: #d4edda;
                border: solid 1px #c3e6cb;
                color: #155724;
            }

            /* Yellow */
            #id .input-group.yellow input,
            #id .input-group.yellow .input-group-text {
                background: #fff3cd;
                border: solid 1px #ffeeba;
                color: #856404;
            }

            /* Red */
            #id .input-group.red input,
            #id .input-group.red .input-group-text {
                background: #f8d7da;
                border: solid 1px #f5c6cb;
                color: #721c24;
            }

            #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px var(--primary);
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-single-line-text',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-field-single-line-text',
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    function setColor(percentage) {
        if (percentage >= 100) {
            return 'green';
        }

        if (percentage < 100 && percentage >= 50) {
            return 'yellow';
        }

        if (percentage < 50) {
            return 'red';
        }

        if (!percentage || isNaN(percentage)) {
            return '';
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
    };

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
            /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find('input');

        if (param !== undefined) {
            percentage = Math.round(parseFloat(param) * 100);

            field.value = percentage;

            const inputGroup = component.find('.input-group');
            const color = setColor(percentage);

            inputGroup.classList.remove('green', 'yellow', 'red');

            if (color) {
                inputGroup.classList.add(color);
            }
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function PhoneField(param) {
    const {
        label, parent, position, onSetValue
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                <div class='form-field-phone'>
                    <div class='form-field-phone-number form-field-phone-open'>(</div>
                    <div class='form-field-phone-number form-field-phone-areacode' contenteditable='true'></div>
                    <div class='form-field-phone-number form-field-phone-close'>)</div>
                    <div class='form-field-phone-number form-field-phone-prefix' contenteditable='true'></div>
                    <div class='form-field-phone-number form-field-phone-hyphen'>-</div>
                    <div class='form-field-phone-number form-field-phone-linenumber' contenteditable='true'></div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin-bottom: 10px;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            #id .form-field-phone {
                width: 140px;
                font-size: .9em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: solid 1px var(--border-color);
            }

            #id .form-field-phone-number {
                display: inline-block;
            }

            #id .form-field-phone-number:active,
            #id .form-field-phone-number:focus {
                outline: none;
                border: none;
            }

            #id .form-field-phone-areacode {
                width: 22px;
            }

            #id .form-field-phone-prefix {
                width: 25px;
            }

            #id .form-field-phone-linenumber {
                width: 35px;
            }
            
            /** Focused */
            #id .focused {
                box-shadow: 0px 0px 0px 2px var(--primary);
                border: solid 1px transparent;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-phone-number`,
                event: 'focusin',
                listener(event) {
                    component.find('.form-field-phone').classList.add('focused');
                }
            },
            {
                selector: `#id .form-field-phone-number`,
                event: 'focusout',
                listener(event) {
                    component.find('.form-field-phone').classList.remove('focused');
                }
            },
            {
                selector: `#id .form-field-phone-areacode`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 3) {
                        component.find('.form-field-phone-prefix').focus();
                    }
                }
            },
            {
                selector: `#id .form-field-phone-prefix`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 3) {
                        component.find('.form-field-phone-linenumber').focus();
                    }
                }
            },
            {
                selector: `#id .form-field-phone-linenumber`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 4) {
                        component.find('.form-field-phone-prefix').focus();

                        onSetValue();
                    }
                }
            },
        ]
    });

    component.value = (param) => {
        const areacode = component.find('.form-field-phone-areacode');
        const prefix = component.find('.form-field-phone-prefix');
        const linenumber = component.find('.form-field-phone-linenumber');

        if (param) {
            const number = param.replace(/[^a-zA-Z0-9 ]/g, '');

            areacode.innerText = number.slice(0, 3);
            prefix.innerText = number.slice(3, 6);
            linenumber.innerText = number.slice(6, 10);
        } else {
            return areacode.innerText + prefix.innerText + linenumber.innerText;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function Preferences({ parent }) {
    const themePreference = MyTheme({
        parent
    });

    themePreference.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ProgressBar(param) {
    const {
        primary, parent, totalCount
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar-container'>
                <div class='loading-bar-status'></div>
            </div>
        `,
        style: /*css*/ `
            #id.loading-bar-container {
                width: 100%;
                margin: 1rem 0rem;
                background: var(--background);
                border-radius: 10px;
            }
            
            #id .loading-bar-status {
                width: 0%;
                height: 15px;
                background: ${primary || 'var(--primary)'};
                border-radius: 10px;
                transition: width 100ms ease-in-out;
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '.loading-bar',
                event: 'listItemsReturned',
                listener() {
                    component.update(++counter);
                }
            }
        ]
    });

    let counter = 1;

    component.update = () => {
        const progressBar = component.get();
        const statusBar = progressBar.querySelector('.loading-bar-status');
        const percentComplete = (counter / totalCount) * 100;

        if (statusBar) {
            statusBar.style.width = `${percentComplete}%`;
            counter++;
        }
    };

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Question(param) {
    const {
        question, margin, parent, onEdit, position
    } = param;

    const {
        Title, Body, Featured, Author, Editor, Created, Modified, replies
    } = question;

    console.log(question);

    const replyCount = replies.length;
    const lastReply = replies[0];

    const component = Component({
        html: /*html*/ `
            <div class='question'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>
                            <span class='title-text'>${Title}</span>
                            ${
                                Featured ?
                                /*html*/ `
                                    <span class='badge badge-info' role='alert'>Featured</span>
                                ` : ''
                            }
                        </h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${Author.Title.split(' ').slice(0, 2).join(' ')} • ${formatDate(Created)}</h6>
                        <div class='card-text mb-2'>${Body || ''}</div>
                        <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                    </div>
                    ${buildFooter(lastReply)}
                </div>
                    ${
                        // Author.Name on LaunchPad, Author.LoginName on CarePoint
                        ( Author.Name ? Author.Name.split('|').at(-1) : Author.LoginName.split('|').at(-1) ) === Store.user().LoginName ?
                        /*html*/ `
                            <div class='edit-button-container'>
                                <button type='button' class='btn btn-robi-light edit'>Edit</button>
                            </div>
                        ` : ''
                    }
                <div class='reply-count'>
                    <span class='reply-count-value'>
                        <span>${replyCount}</span>
                    </span>
                    <span class='reply-count-label'>${replyCount === 1 ? 'Reply' : 'Replies'}</span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
            }

            #id .card {
                background: var(--background);
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            #id .card-footer {
                border-radius: 0px 0px 20px 20px;
                background: inherit;
            }

            #id .edit-button-container {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 20px;
            }

            #id .edit-button-container .btn {
                font-size: 15px;
            }

            /** Replies */
            #id .reply-count {
                margin: 20px 0px;
                font-size: 16px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: end;
            }
            
            #id .reply-count-value {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
                width: 30px;
                margin: 5px;
                padding: 5px;
                font-weight: bold;
                text-align: center;
                border-radius: 50%;
                color: white;
                background: var(--primary);
            }

            #id .reply-count-value * {
                color: white;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .edit',
                event: 'click',
                listener: onEdit
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
                hour: 'numeric',
                minute: 'numeric'
            })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function buildFooter(lastReply) {
        if (lastReply) {
            return /*html*/ `
                <div class='card-footer question-last-reply'>
                   ${lastReplyTemplate(lastReply)}
                </div>
            `;
        } else {
            return '';
        }
    }

    function lastReplyTemplate(lastReply) {
        const {
            Author, Body, Created
        } = lastReply;

        return /*html*/ `
            <span class='text-muted' style='font-size: 14px;'>
                <span>Last reply by ${Author.Title.split(' ').slice(0, 2).join(' ')}</span>
                on
                <span>${formatDate(Created)}</span>
            </span>
            <p class='card-text mt-2'>${Body}</p>
        `;
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);
        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    component.setQuestion = (param) => {
        const {
            Title, Body, Modified, Editor
        } = param;

        component.find('.title-text').innerHTML = Title;
        component.find('.card-text').innerHTML = Body || '';
        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    };

    component.addCount = () => {
        const replyCount = component.find('.reply-count-value');

        replyCount.innerText = parseInt(replyCount.innerText) + 1;
    };

    component.updateLastReply = (reply) => {
        let footer = component.find('.card-footer');

        if (footer) {
            footer.innerHTML = lastReplyTemplate(reply);
        } else {
            component.find('.card').insertAdjacentHTML('beforeend', buildFooter(reply));
        }

    };

    component.editButton = () => {
        return component.find('.edit');
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function QuestionAndReplies({ parent, path, itemId, title }) {
    title.remove();

    /** View Title */
    let routeTitle;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

        setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        routeTitle = Title({
            title: 'Question',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent
        });

        routeTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');

        // setTitle(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`))
    }

    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (routeTitle) {
            routeTitle.remove();
        }

        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        const currentType = types.find(item => item.path === path);

        /** Set new title with drop down options */
        routeTitle = Title({
            title: 'Question',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types.map(facility => {
                        const {
                            title, path
                        } = facility;

                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                },
                {
                    name: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    dataName: 'loading-questions',
                    items: []
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin'
        });

        routeTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        maxWidth: '800px',
        parent
    });

    viewContainer.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading question',
        type: 'robi',
        parent: viewContainer
    });

    loadingIndicator.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await QuestionsModel({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);

        console.log('Model_Questions stored.');
    }

    const question = questions.find(question => question.Id === itemId);

    routeTitle.updateDropdown({
        name: 'loading-questions',
        replaceWith: {
            name: question.Title,
            dataName: question.Id,
            items: questions
                //.filter(question => question.Id !== itemId) /** filter out current question */
                .map(question => {
                    const {
                        Id, Title
                    } = question;

                    return {
                        label: Title,
                        path: `Questions/${path}/${Id}`
                    };
                })
        }
    });

    /** Question */
    QuestionContainer({
        question,
        parent: viewContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 */
export async function QuestionBoard({ parent, path, title }) {
    title.remove();

    /** View Title */
    let routeTitle;
    let currentType;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

        setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        routeTitle = Title({
            title: 'Questions',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent
        });

        routeTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');

        setTitle(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));
    }

    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (routeTitle) {
            routeTitle.remove();
        }

        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        currentType = types.find(item => item.path === path);

        /** Set new title with drop down options */
        routeTitle = Title({
            title: 'Questions',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types
                        //.filter(item => item.path !== path) /** filter out current selection */
                        .map(facility => {
                            const {
                                title, path
                            } = facility;

                            return {
                                label: title,
                                path: `Questions/${path}`
                            };
                        })
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin'
        });

        routeTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        parent
    });

    viewContainer.add();

    /** New Question Form */
    let newQuestionForm;

    /** Toolbar */
    const qppQuestionsToolbar = QuestionsToolbar({
        selected: 'All',
        onFilter(filter) {
            console.log(filter);

            /** param */
            const param = {
                path,
                parent: questionsContainer
            };

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            switch (filter) {
                case 'All':
                    param.questions = questions;
                    break;
                case 'Mine':
                    param.questions = questions.filter(question => {
                        // console.log(question.Author.Title, Store.user().Title);
                        return question.Author.Title === Store.user().Title;
                    });
                    break;
                case 'Unanswered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);
                        return question.replies.length === 0;
                    });
                    break;
                case 'Answered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);
                        return question.replies.length !== 0;
                    });
                    break;
                case 'Featured':
                    param.questions = questions.filter(question => {
                        // console.log(question.Featured);
                        return question.Featured;
                    });
                    break;
                default:
                    break;
            }

            /** Add new list of cards */
            questionCards = QuestionCards(param);
        },
        onSearch(query) {
            console.log('query: ', query);

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            const filteredQuestions = questions.filter(question => {
                const {
                    Title, Body, Author, Created
                } = question;

                const date = `${new Date(Created).toLocaleDateString()} ${new Date(Created).toLocaleTimeString('default', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}`.toLowerCase();

                if (Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Title: ${Title}.`);

                    return question;
                } else if (Body && Body.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Body: ${Body}.`);

                    return question;
                } else if (Author.Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Author name: ${Author.Title}.`);

                    return question;
                } else if (date.includes(query)) {
                    console.log(`SEARCH - Found in Created date: ${date}.`);

                    return question;
                }
            });

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions: filteredQuestions,
                parent: questionsContainer
            });
        },
        onClear(event) {
            console.log(event);

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions,
                parent: questionsContainer
            });
        },
        onAsk() {
            const modal = Modal({
                title: 'Ask a question',
                contentPadding: '30px',
                showFooter: true,
                background: 'var(--secondary)',
                addContent(modalBody) {
                    newQuestionForm = NewQuestion({
                        parent: modalBody,
                        modal
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: '',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Submit',
                            classes: 'btn-robi',
                            disabled: true,
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting
                                `;

                                const fieldValues = newQuestionForm.getFieldValues();

                                fieldValues.ParentId = 0;
                                fieldValues.QuestionType = path;

                                /** Create Question */
                                const newItem = await CreateItem({
                                    list: 'Questions',
                                    data: fieldValues
                                });

                                /** Set QuestionId */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: newItem.Id,
                                    data: {
                                        QuestionId: newItem.Id
                                    }
                                });

                                console.log(Store.get('Model_Questions'));

                                const question = QuestionModel({
                                    question: updatedItem
                                });

                                Store.get('Model_Questions').push(question);

                                console.log(Store.get('Model_Questions'));

                                /** Add new quesiton card to DOM */
                                questionCards.addCard(question);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Submitted!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        },
        parent: viewContainer
    });

    qppQuestionsToolbar.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading questions',
        type: 'robi',
        parent: viewContainer
    });

    loadingIndicator.add();

    /** Questions Container */
    const questionsContainer = Container({
        display: 'flex',
        direction: 'column',
        width: '100%',
        margin: '30px 0px',
        parent: viewContainer
    });

    questionsContainer.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await QuestionsModel({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);

        console.log('Model_Questions stored.');
    }

    /** Add all question cards to DOM */
    let questionCards = QuestionCards({
        path,
        questions,
        parent: questionsContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionCard(param) {
    const {
        question, label, path, margin, parent, position
    } = param;

    const {
        Id, Title, Body, Featured, Author, Editor, Created, Modified, replies
    } = question;

    const replyCount = replies.length;
    const lastReply = replies.sort((a, b) => {
        a = a.Id;
        b = b.Id;

        /** Descending */
        if (a > b) {
            return -1;
        }

        if (a < b) {
            return 1;
        }

        // names must be equal
        return 0;
    })[0];

    const component = Component({
        html: /*html*/ `
            <div class='card'>
                <div class='card-body'>
                    <h5 class='card-title'>
                        <span>${Title}</span>
                        ${
                            Featured ?
                            /*html*/ `
                                <span class='badge badge-info' role='alert'>Featured</span>
                            ` : ''
                        }
                        ${
                            label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-success' role='alert'>New</span>
                            ` : ''
                        }
                        ${
                            replyCount ?
                            /*html*/ `
                                <span class='reply-count'>
                                    <span class='reply-count-label'>Replies</span>
                                    <span class='badge badge-secondary'>${replyCount}</span>
                                </span>
                            ` : ''
                        }
                    </h5>
                    <!-- <h6 class='card-subtitle mb-2 text-muted'>Asked by ${Author.Title} ${formatDate(Created)}</h6> -->
                    <h6 class='card-subtitle mb-2 text-muted'>${Author.Title.split(' ').splice(0, 2).join(' ')} ${formatDate(Created)}</h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title.split(' ').splice(0, 2).join(' ')} ${formatDate(Modified)} ` : ''}</h6>
                </div>
                ${buildFooter(lastReply)}
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                cursor: pointer;
                background: var(--background);
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            #id .card-title .badge {
                font-size: 12px;
                font-weight: 500;
                padding: 5px 10px;
                border-radius: 8px;
            }

            #id .reply-count {
                margin-left: 1.25rem;
            }

            #id .reply-count-label {
                font-size: .8em;
                font-weight: 400;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            #id .question-last-reply {
                font-size: .8em;
                font-weight: 400;
            }

            #id .card-footer {
                border-radius: 0px 0px 20px 20px;
                background: inherit;
            }

            /** Alert */
            #id .badge-info {
                font-size: .8em;
                padding: 4px 8px;
                margin: 0px;
                font-weight: 400;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`${path}/${Id}`);
                }
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }


    function buildFooter(lastReply) {
        if (lastReply) {
            const {
                Author, Body, Created
            } = lastReply;

            return /*html*/ `
                <div class='card-footer question-last-reply'>
                    <span>
                        <span>Last reply by ${Author.Title.split(' ').splice(0, 2).join(' ')}</span>
                        <span>${formatDate(Created)}</span>
                    </span>
                    <p class='card-text mt-2'>${Body}</p>
                </div>
            `;
        } else {
            return '';
        }
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);
        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionCards({ parent, path, questions }) {
    if (typeof parent === 'object' && parent.empty) {
        parent.empty();
    }

    /** Info Alert Container */
    const alertContainer = Container({
        parent,
        display: 'flex',
        width: '100%',
    });

    alertContainer.add();

    /** Light Alert */
    const lightAlert = Alert({
        type: 'blank',
        text: `${questions.length} question${questions.length === 1 ? '' : 's'}`,
        margin: '20px 0px 10px 0px',
        parent: alertContainer
    });

    lightAlert.add();

    /** Questions */
    questions
        .sort((a, b) => {
            a = a.Id;
            b = b.Id;

            /** Descending */
            if (a > b) {
                return -1;
            }

            if (a < b) {
                return 1;
            }

            // names must be equal
            return 0;
        })
        .forEach(question => {
            const questionCard = QuestionCard({
                question,
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent
            });

            questionCard.add();
        });

    return {
        addCard(question) {
            /** Add card to DOM */
            const questionCard = QuestionCard({
                question,
                label: 'new',
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent: alertContainer,
                position: 'afterend'
            });

            questionCard.add();

            /** Update count */
            const refreshedQuestions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            lightAlert.get().innerHTML = `${refreshedQuestions.length} question${refreshedQuestions.length === 1 ? '' : 's'}`;
        }
    };
}

/**
 *
 * @param {*} param
 */
export function QuestionContainer(param) {
    const {
        question, parent
    } = param;

    /** New Question Form */
    let editQuestionForm;

    /** Question */
    const questionComponent = Question({
        question,
        parent,
        onEdit(event) {
            const modal = Modal({
                title: 'Edit Question',
                contentPadding: '30px',
                showFooter: true,
                addContent(modalBody) {
                    editQuestionForm = EditQuestion({
                        question,
                        modal,
                        parent: modalBody
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: '',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Update',
                            classes: 'btn-robi',
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating
                                `;

                                /** Update question */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: question.Id,
                                    data: editQuestionForm.getFieldValues()
                                });

                                const updatedQuestion = QuestionModel({
                                    question: updatedItem,
                                    replies: question.replies
                                });

                                const questions = Store.get('Model_Questions');
                                const index = questions.indexOf(question);

                                console.log(index);

                                questions.splice(index, 1, updatedQuestion);

                                /** Add new quesiton card to DOM */
                                questionComponent.setQuestion(updatedQuestion);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Updated!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        }
    });

    questionComponent.add();

    /** Replies */
    const {
        replies
    } = question;

    replies
        .sort((a, b) => {
            a = a.Id;
            b = b.Id;

            /** Ascending */
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            // names must be equal
            return 0;
        })
        .forEach(reply => {
            const replyComponent = Reply({
                reply,
                margin: '0px 0px 10px 0px',
                parent,
                onEdit(value) {
                    replyOnEdit({
                        reply,
                        replyComponent,
                        value
                    });
                }
            });

            replyComponent.add();
        });

    async function replyOnEdit(param) {
        const {
            reply, replyComponent, value
        } = param;

        if (value !== reply.Body) {
            /** Update question */
            const updatedItem = await UpdateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                itemId: reply.Id,
                data: {
                    Body: value
                }
            });

            const index = replies.indexOf(reply);

            console.log('reply index: ', index);

            replies.splice(index, 1, updatedItem);

            /** Updated modified text */
            replyComponent.setModified(updatedItem);
        }
    }

    /** New Reply */
    const newReply = NewReply({
        width: '100%',
        parent,
        async action({ value, button, field }) {
            // Disable button - Prevent user from clicking this item more than once
            button.disabled = true;
            button.querySelector('.icon').classList.add('d-none');
            button.insertAdjacentHTML('beforeend', /*html*/ `
                <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span>
            `);

            /** Create item */
            const newItem = await CreateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                data: {
                    Title: 'Reply',
                    Body: value,
                    ParentId: question.Id,
                    QuestionId: question.Id,
                    QuestionType: question.QuestionType
                }
            });

            /** Update Last Reply footer */
            questionComponent.updateLastReply(newItem);

            /** Increment replies */
            questionComponent.addCount();

            /** Add to replies */
            replies.push(newItem);

            /** Add to DOM */
            const replyComponent = Reply({
                reply: newItem,
                label: 'new',
                margin: '0px 0px 10px 0px',
                parent: newReply,
                position: 'beforebegin',
                onEdit(value) {
                    replyOnEdit({
                        reply: newItem,
                        replyComponent,
                        value
                    });
                }
            });

            replyComponent.add();

            // Reset field
            field.innerHTML = '';

            // Enable button
            button.querySelector('.spinner-border').remove();
            button.querySelector('.icon').classList.remove('d-none');
            button.disabled = false;
        }
    });

    newReply.add();

    /** Register event */
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            questionComponent.editButton().click();
        }

        if (event.ctrlKey && event.altKey && event.key === 'r') {
            newReply.focus();
        }
    });
}

/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionType(param) {
    const {
        title, path, questions, parent, position
    } = param;

    const lastEntry = questions[questions.length - 1];

    // Compare Modified dates
    const dates = questions.map(item => new Date(item.Modified));
    const lastModifiedDate = new Date(Math.max(...dates));

    const { Editor, Modified } = lastEntry || { Editor: '', Modified: '' };
    
    const questionCount = questions.filter(item => item.ParentId === 0).length;
    const replyCount = questions.filter(item => item.ParentId !== 0).length;

    const component = Component({
        html: /*html*/ `
            <div class='question-type mb-3'>
                <div class='question-type-title mb-1'>${title}</div>
                <div class='question-count mb-1'>${questionCount} ${questionCount === 1 ? 'question' : 'questions'} (${replyCount} ${replyCount === 1 ? 'reply' : 'replies'})</div>
                <div class='question-date'>${Modified ? `Last updated by ${Editor.Title.split(' ').slice(0, 2).join(' ')} on ${formatDate(lastModifiedDate)}` : ''}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                border-radius: 20px;
                padding: 20px;
                background: var(--background);
                cursor: pointer;
            }

            #id .question-type-title {
                font-weight: 600;
            }

            #id .question-count {
                font-size: 14px;
            }

            #id .question-date {
                font-size: 14px;
                color: gray;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`Questions/${path}`);
                }
            }
        ]
    });

    function formatDate(date) {
        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function QuestionTypes(param) {
    const { parent } = param;

    // View Container
    const container = Container({
        display: 'block',
        width: '100%',
        margin: '30px 0px 0px 0px',
        parent
    });

    container.add();

    const questionTypes = [
        {
            title: 'General',
            path: 'General'
        }
    ];

    const questions = [];

    questionTypes.forEach(type => {
        const {
            title, path
        } = type;

        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent: container
        });

        questionType.add();
    });
}

/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionsToolbar(param) {
    const {
        selected, parent, onFilter, onSearch, onClear, onAsk, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar mb-3' role='toolbar'>
                <button type='button' class='btn ask-a-question'>Ask a question</button>
                <div class='ml-2 mr-2'>
                    <input class='form-control mr-sm-2 search-questions' type='search' placeholder='Search' aria-label='Search'>
                </div>    
                <div class='btn-group mr-2' role='group'>
                    ${buildFilters()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px 0px 0px 0px;
                align-items: center;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }

            #id .ask-a-question {
                background: var(--button-background);
                color: var(--primary);
                font-weight: 500;
            }
            
            #id .search-questions {
                background: var(--button-background) !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-robi-primary {
                color: white;
                background: var(--primary);
            }

            #id .btn-outline-robi-primary {
                color: var(--primary);
                background-color: initial;
                border-color: var(--primary);
            }

            /* #id .btn-outline-robi-primary:active {
                color: royalblue;
                background-color: initial;
                border-color: royalblue;
            } */
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    const isSelected = event.target.classList.contains('btn-outline-robi-primary');

                    /** Deselect all options */
                    component.findAll('.filter').forEach(button => {
                        button.classList.remove('btn-robi-primary');
                        button.classList.add('btn-outline-robi-primary');
                    });

                    if (isSelected) {
                        event.target.classList.remove('btn-outline-robi-primary');
                        event.target.classList.add('btn-robi-primary');
                    } else {
                        event.target.classList.remove('btn-robi-primary');
                        event.target.classList.add('btn-outline-robi-primary');
                    }

                    onFilter(event.target.innerText);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    onSearch(event.target.value.toLowerCase());
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .ask-a-question`,
                event: 'click',
                listener: onAsk
            }
        ]
    });

    function buildFilters() {
        const filterOptions = [
            'All',
            'Mine',
            'Unanswered',
            'Answered',
            'Featured'
        ];

        return filterOptions.map(option => {
            return /*html*/ `
                <button type='button' class='btn ${selected === option ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${option}</button>
            `;
        }).join('\n');
    }

    return component;
}

// Modified from: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
export function RecordScreen({ onShare, onStop }) {
    Style({
        name: 'recording',
        locked: true,
        style: /*css*/ `
            video {
                border-radius: 10px;
                background: var(--body-dark);
            }

            .preview-container.ui-draggable {
                cursor: grab;
            }

            .preview-container.ui-draggable-dragging {
                cursor: grabbing;
            }
        `
    });
    
    // parent.append(/*html*/ `
    //     <div class='d-flex'>
    //         <div class='' style='max-width: 175px;'>
    //             <div style='font-weight: 500;'>Recording</div>
    //             <video id='recording' width='175px' height='120px' style='' controls></video>
    //         </div>
    //         <div class='bottom d-none'>
    //             <a id='downloadButton' class='button'>Download</a>
    //             <pre id='log'></pre>
    //         </div>
    //     </div>
    // `);

    let stopButton;
    let preview;
    let recording;
    let downloadButton;
    let recordingTimeMS;

    navigator.mediaDevices
        .getDisplayMedia({
            video: true,
            audio: true
        })
        .then((stream) => {
            if (onShare) {
                onShare(stream);
            }

            // Add UI
            Store.get('appcontainer').append(/*html*/ `
                <div class='preview-container p-3 d-flex flex-column justify-content-center align-items-center' style='position: absolute; bottom: 20px; right: 20px; width: max-content; height: max-content; 20px; box-shadow: var(--box-shadow); background: var(--body-dark); border-radius: 16px; z-index: 10000;'>
                    <video id='preview' width='200px' height='150px' autoplay muted></video>
                    <button id='stopButton' type='buton' class='btn btn-robi w-100 mt-2'>
                        <span class='d-flex align-items-center justify-content-center'>
                            <svg class="icon" fill='var(--primary)' style='font-size: 18px;'>
                                <use href="#icon-bs-stop-fill"></use>
                            </svg>
                            <span class='ml-2' style='line-height: 0;'>Stop recording</span>
                        </span>
                    </button>
                </div>
                <div class='recording-border w-100 h-100 m-0 p-0' style='box-shadow: inset 0px 0px 0px 4px var(--primary); z-index: 10000; position: absolute; top: 0px; left: 0px; pointer-events: none;'></div>
            `);

            $(".preview-container").draggable();

            preview = Store.get('appcontainer').find('#preview');
            // recording = Store.get('appcontainer').find('#recording');
            stopButton = Store.get('appcontainer').find('#stopButton');
            // downloadButton = Store.get('appcontainer').find('#downloadButton');
            recordingTimeMS = 10000;

            // Set stream
            preview.srcObject = stream;
            // downloadButton.href = stream;
            preview.captureStream = preview.captureStream || preview.mozCaptureStream;

            return new Promise((resolve) => (preview.onplaying = resolve));
        })
        .then(() => startRecording(preview.captureStream()))
        .then((recordedChunks) => {
            let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });

            // recording.src = URL.createObjectURL(recordedBlob);
            // downloadButton.href = recording.src;
            // downloadButton.download = 'RecordedVideo.webm';

            Store.get('appcontainer').find('.recording-border')?.remove();
            Store.get('appcontainer').find('.preview-container')?.remove();

            // Set file
            // TODO: Check if file already exists?
            // FIXME: Will override everytime.
            const recording = {
                blob: recordedBlob,
                src: URL.createObjectURL(recordedBlob)
            };

            Store.setData('new feedback recording', recording);

            if (onStop) {
                onStop(recording);
            }

            console.log(
                'Successfully recorded ' +
                recordedBlob.size +
                ' bytes of ' +
                recordedBlob.type +
                ' media.'
            );
        })
        .catch((error) => console.log(error));

    function wait(stream) {
        return new Promise((resolve) => {
            // Listen for 'stop sharing'
            stream.getVideoTracks()[0].onended = stopRecording;

            // Stop recording button
            stopButton.addEventListener('click', stopRecording);

            function stopRecording() {
                Store.get('appcontainer').find('.preview-container').classList.add('wink-out');

                console.log('building video...');

                stop(preview.srcObject);

                resolve();
            };
        });
    }

    async function startRecording(stream) {
        // Enable stop
        stopButton.disabled = false;

        // Start
        let recorder = new MediaRecorder(stream);
        let data = [];

        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.start();

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = (event) => reject(event.name);
        });

        let recorded = wait(stream).then(() => recorder.state == 'recording' && recorder.stop());

        await Promise.all([stopped, recorded]);
        return data;
    }

    function stop(stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function RecurrenceMenu(param) {
    const {
        classes,
        parent,
        position
    } = param;

    let value = param.value || {};

    const component = Component({
        html: /*html*/ `
            <div class='recurrence-menu ${classes ? classes.join(' ') : ''}'>
                <!-- Pattern and Range container -->
                <div class='d-flex flex-column'>
                    <!-- Label-->
                    <label class='font-weight-500'>Data Refresh Recurrence Pattern</label>
                    <!-- Pattern container -->
                    <div class='d-flex' style='min-height: 235px;'>
                        <!-- Pattern buttons -->
                        <div class='pattern-buttons' style='padding: 21px 16px;'>
                            ${
                                [
                                    'Daily',
                                    'Weekly',
                                    'Monthly',
                                    'Quarterly',
                                    'Yearly',
                                    'Irregular'
                                ]
                                .map(label => buttonTemplate(label))
                                .join('\n')
                            }
                        </div>
                        <!-- Divider -->
                        <div style='height: auto; width: 1px; margin: 21px 0px; background: var(--border-color);'></div>
                        <!-- Pattern menu -->
                        <div class='pattern-menu p-3'>
                            <!-- Inserted later -->
                        </div>
                    </div>
                    <!-- Label-->
                    <label class='font-weight-500'>Range of Recurrence</label>
                    <!-- Range container -->
                    <div class='range-container d-flex align-items-start'>
                        <!-- Start date -->
                        <div class='d-flex align-items-center mr-3'>
                            <div>Start:</div>
                            <input class='form-control ml-3' id='start-date' type='date'>
                        </div>
                        <!-- End date -->
                        <div>
                            <!-- End by -->
                            <div class='d-flex align-items-center mb-2'>
                                <div class='custom-control custom-radio'>
                                    <input type='radio' id='end-by' name='range-end' class='custom-control-input'>
                                    <label class='custom-control-label' for='end-by'></label>
                                </div>
                                <div class='d-flex align-items-center radio-label' data-for='end-by'>
                                    <div style='width: 79px;'>End by:</div>
                                    <input type='date' class='form-control ml-3' id='end-by-date'>
                                </div>
                            </div>
                            <!-- End after -->
                            <div class='d-flex align-items-center mb-2'>
                                <div class='custom-control custom-radio'>
                                    <input type='radio' id='end-after' name='range-end' class='custom-control-input'>
                                    <label class='custom-control-label' for='end-after'></label>
                                </div>
                                <div class='d-flex align-items-center radio-label' data-for='end-after'>
                                    <div style='width: 122px;'>End after:</div>
                                    <input type='number' class='form-control ml-3 mr-3' id='end-after-value' style='width: 75px;'>
                                    <div class='w-100'>occurrences</div>
                                </div>
                            </div>
                            <!-- No end date -->
                            <div class='d-flex align-items-center'>
                                <div class='custom-control custom-radio'>
                                    <input type='radio' id='no-end-date' name='range-end' class='custom-control-input'>
                                    <label class='custom-control-label' for='no-end-date'></label>
                                </div>
                                <div class='d-flex align-items-center radio-label' data-for='no-end-date' style='height: 33.5px;'>
                                    <div class='w-100' style='line-height: 0;'>No end date</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                max-width: 650px;
            }

            #id .form-control {
                padding: 2px 4px;
            }

            #id .custom-control-label {
                font-size: 13px;
                line-height: 1.8;
            }

            #id .pattern-menu,
            #id .range-container {
                font-size: 13px;
            }

            #id .pattern-buttons .custom-radio:not(:last-child) {
                margin-bottom: 8px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .pattern-radio',
                event: 'change',
                listener(event) {
                    // Set pattern
                    if (value.pattern !== this.id) {
                        value.pattern = this.id;
                        value.value = {};
                    }

                    // Add menu
                    menus[this.id]();

                    console.log(value);
                }
            },
            {
                selector: '#id .range-container .radio-label',
                event: 'click',
                listener(event) {
                    component.find(`.range-container #${this.dataset.for}`).click();
                }
            },
            {
                selector: '#id #end-by',
                event: 'change',
                listener(event) {
                    if (event.target.checked) {
                        value.end = {
                            option: 'End by d'
                        }

                        component.find('#end-after-value').value = '';
                    }
                }
            },
            {
                selector: '#id #end-after',
                event: 'change',
                listener(event) {
                    if (event.target.checked) {
                        value.end = {
                            option: 'End after n occurrences'
                        }

                        component.find('#end-by-date').value = '';
                    }
                }
            },
            {
                selector: '#id #no-end-date',
                event: 'change',
                listener(event) {
                    if (event.target.checked) {
                        value.end = {
                            option: 'No end date'
                        }

                        component.find('#end-by-date').value = '';
                        component.find('#end-after-value').value = '';
                    }
                }
            },
            {
                selector: '#id #end-after-value',
                event: 'change',
                listener(event) {
                    if (event.target.value) {
                        value.end.n = parseInt(event.target.value);
                    } else {
                        delete value.end.n;
                    }
                }
            },
            {
                selector: '#id #end-by-date',
                event: 'change',
                listener(event) {
                    if (event.target.value) {
                        const endDate = new Date(event.target.value.replace(/-/g, '\/')).toLocaleDateString();
                        value.end.d = endDate;
                    } else {
                        delete value.end.d;
                    }
                }
            },
            {
                selector: '#id #start-date',
                event: 'change',
                listener(event) {
                    if (event.target.value) {
                        const startDate = new Date(event.target.value.replace(/-/g, '\/')).toLocaleDateString();
                        value.start = startDate;

                        console.log(value);
                    }
                }
            }
        ],
        onAdd() {
            // Select pattern
            if (value.pattern) {
                // console.log(value);
                
                // Add menu
                menus[value.pattern]();

                // Check pattern radio button
                component.find(`#${value.pattern}.pattern-radio`).checked = true;
            } else {
                value = {
                    pattern: 'Daily',
                    value: {}
                }

                // Add menu
                menus.Daily();

                // Default: Daily
                component.find('#Daily.pattern-radio').checked = true;
            }


            // Set start date
            if (!value.start) {
                value.start = new Date().toLocaleDateString();
            }
            
            component.find('#start-date').value = new Date(value.start).toISOString().split('T')[0];

            // Set end date
            if (value.end) {
                const { option } = value.end;

                // #1
                // option: 'No end date',
                if (option === 'No end date') {
                    component.find('#no-end-date').checked = true;
                }

                // #2
                // option: 'End by d',
                // d: '3/1/2023',
                else if (option === 'End by d') {
                    component.find('#end-by').checked = true;
                    component.find('#end-by-date').value = new Date(value.end.d).toISOString().split('T')[0];
                }
                
                // #3
                // option: 'End after n occurrences',
                // n: 900
                else if (option === 'End after n occurrences') {
                    component.find('#end-after').checked = true;
                    component.find('#end-after-value').value = parseInt(value.end.n);
                }
            } else {
                component.find('#no-end-date').checked = true;

                value.end = {
                    option: 'No end date'
                }
            }     
        }
    });

    function buttonTemplate(label) {
        return /*html*/ `
            <div class='custom-control custom-radio'>
                <input type='radio' id='${label}' name='pattern-radio' class='custom-control-input pattern-radio'>
                <label class='custom-control-label' for='${label}'>${label}</label>
            </div>
        `
    }

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const menus = {
        /**
         * @example
         * value = {
         *   pattern: 'Daily',
         *   value: {
         *       option: 'Every n day(s)',
         *       n: 36
         *   }
         * }
         */
        Daily() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='days' name='daily' class='custom-control-input' ${setOption('days')}>
                            <label class='custom-control-label' for='days'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='days'>
                            <div>Every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='days-value' style='width: 75px;' value='${setDays()}'>
                            <div>day(s)</div>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='weekday' name='daily' class='custom-control-input' ${setOption('weekday')}>
                            <label class='custom-control-label' for='weekday'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='radio-label' data-for='weekday'>Every weekday</div>
                    </div>
                </div>
            `;

            // Set default value

            if (isEmpty(value.value)) {
                value.value = {
                    option: 'Every n day(s)',
                    n: 1
                }

                console.log(value);
            }

            function setOption(option) {
                if (option === 'days' && value.value?.option === 'Every n day(s)') {
                    return 'checked';
                } else if (option === 'weekday' && value.value?.option === 'Every weekday') {
                    return 'checked';
                } else if (option === 'days') {
                    return 'checked'
                }
            }

            function setDays() {
                if (value.value?.option === 'Every n day(s)') {
                    return value.value.n;
                } else if (value.value?.option !== 'Every weekday') {
                    return 1
                }
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function(event) {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });

            // Set value.option
            component.findAll(`.pattern-menu input[type='radio']`).forEach(radio => {
                radio.addEventListener('change', event => {
                    if (event.target.checked) {
                        console.log(radio);

                        const id = radio.id;

                        // Set value.option to 'Every n day(s)'
                        if (id === 'days') {
                            const option = 'Every n day(s)';

                            value.value = {
                                option
                            }
                        }

                        // Set value.option to 'Every weekday'
                        else if (id === 'weekday') {
                            const option = 'Every weekday';

                            value.value = {
                                option
                            }
                        }

                        console.log(value);
                    }
                });
            });

            // Set value.n
            component.find(`.pattern-menu input[type='number']`).addEventListener('change', event => {
                const n = event.target.value;

                if (value.value) {
                    value.value.n = n;
                } else {
                    value.value = {
                        n
                    }
                }

                console.log(value);
            });
        },
        /**
         * @example
         * value = {
         *     pattern: 'Weekly',
         *     value: {
         *         weeks: 6,
         *         days: [
         *             'Saturday',
         *         ]
         *     }
         * }
         */
        Weekly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <input type='number' class='form-control ml-3 mr-3' id='weeks-value' style='width: 75px;' value='${setWeeks()}'>
                        <div>week(s) on:</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex flex-wrap'>
                        <!-- Days -->
                        ${
                            [
                                'Sunday',
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday'
                            ]
                            .map(day => dayTemplate(day))
                            .join('\n')
                        }
                    </div>
                </div>
            `;

            // Set default value
            if (isEmpty(value.value)) {
                value.value = {
                    weeks: 1,
                    days: []
                }

                console.log(value);
            }

            function setWeeks() {
                return value.value?.weeks || 1;
            }

            // TODO: select if value present
            function dayTemplate(day) {
                return /*html*/ `
                    <div class='custom-control custom-checkbox' style='width: 100px; height: 30px;'>
                        <input type='checkbox' class='custom-control-input weeks-day' id='${day}' ${setOption(day)}>
                        <label class='custom-control-label' for='${day}'>${day}</label>
                    </div>
                `;
            }

            function setOption(day) {
                if (value.value?.days?.includes(day)) {
                    return 'checked';
                } else {
                    return '';
                }
            }

            // Set value.weeks
            component.find('.pattern-menu #weeks-value').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.weeks = parseInt(event.target.value);
                }

                console.log(value);
            });

            // Set value.days
            component.findAll('.pattern-menu .weeks-day').forEach(checkbox => {
                checkbox.addEventListener('change', event => {
                    value.value.days = [...component.findAll(`.pattern-menu .weeks-day:checked`)].map(node => node.id);
                });
            });
        },
        /**
         * @example
         * value = {
         *     pattern: 'Monthly',
         *     value: {
         *         option: 'Day n of every m month(s)',
         *         n: 10,
         *         m: 3
         *     }
         * }
         * 
         * @example
         * value = {
         *     pattern: 'Monthly',
         *     value: {
         *         option: 'The i d of every m month(s)',
         *         i: 'fourth',
         *         d: 'weekday',
         *         m: 1
         *     }
         * }
         * 
         */
        Monthly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='day' name='monthly' class='custom-control-input' ${setRadio('day')}>
                            <label class='custom-control-label' for='day'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='day'>
                            <div>Day</div>
                            <input type='number' class='form-control ml-3 mr-3' id='day-value' style='width: 75px;' value=${setDay()}>
                            <div>of every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='month-value' style='width: 75px;' value=${setMonth()}>
                            <div>month(s)</div>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='the' name='monthly' class='custom-control-input' ${setRadio('the')}>
                            <label class='custom-control-label' for='the'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='the'>
                            <div>The</div>
                            <select class='form-control ml-3' id='the-interval' style='width: fit-content;'>
                                <option value='first' ${setI('first')}>first</option>
                                <option value='second' ${setI('second')}>second</option>
                                <option value='third' ${setI('third')}>third</option>
                                <option value='fourth' ${setI('fourth')}>fourth</option>
                                <option value='last' ${setI('last')}>last</option>
                            </select>
                            <select class='form-control ml-3 mr-3' id='the-day' style='width: fit-content;'>
                                <option value='day' ${setD('day')}>day</option>
                                <option value='weekday' ${setD('weekday')}>weekday</option>
                                <option value='weekend day' ${setD('weekend day')}>weekend day</option>
                                <option value='Monday' ${setD('Monady')}>Monday</option>
                                <option value='Tuesday' ${setD('Tuesday')}>Tuesday</option>
                                <option value='Wednesday' ${setD('Wednesday')}>Wednesday</option>
                                <option value='Thursday' ${setD('Thursday')}>Thursday</option>
                                <option value='Friday' ${setD('Friday')}>Friday</option>
                                <option value='Saturday' ${setD('Saturday')}>Saturday</option>
                                <option value='Sunday' ${setD('Sunday')}>Sunday</option>
                            </select>
                            <div>of every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='the-month' style='width: 75px;' value=${setMonth()}>
                            <div>month(s)</div>
                        </div>
                    </div>
                </div>
            `;

            // Set default value
            if (isEmpty(value.value)) {
                value.value = {
                    option: 'Day n of every m month(s)'
                }

                console.log(value);
            }

            // Set which option is checked
            function setRadio(option) {
                if (option === 'day' && value.value.option === 'Day n of every m month(s)') {
                    return 'checked';
                } else if (option === 'the' && value.value.option === 'The i d of every m month(s)') {
                    return 'checked';
                } else if (option === 'day') {
                    return 'checked';
                }
            }

            function setDay() {
                return value.value?.n || '';
            }

            function setMonth() {
                return value.value?.m || '';
            }

            function setI(option) {
                return value.value?.i === option ? 'selected' : ''
            }

            function setD(option) {
                return value.value?.d === option ? 'selected' : ''
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });

            // Set value.option
            component.findAll(`.pattern-menu input[type='radio']`).forEach(radio => {
                radio.addEventListener('change', event => {
                    if (event.target.checked) {
                        const id = radio.id;

                        // Set value.option to ''Day n of every m month(s)'
                        if (id === 'day') {
                            value.value = {
                                option: 'Day n of every m month(s)'
                            }

                            // Empty fields
                            component.find('.pattern-menu #the-interval').value = 'first';
                            component.find('.pattern-menu #the-day').value = 'day';
                            component.find('.pattern-menu #the-month').value = new Date().getDate();
                        }

                        // Set value.option to 'The i d of every m month(s)'
                        else if (id === 'the') {
                            value.value = {
                                option: 'The i d of every m month(s)',
                                i: 'first',
                                d: 'day'
                            }

                            // Empty fields
                            component.find('.pattern-menu #day-value').value = '';
                            component.find('.pattern-menu #month-value').value = '';
                        }

                        console.log(value);
                    }
                });
            });

            // Set value.value.n
            component.find('.pattern-menu #day-value').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.n = parseInt(event.target.value);
                }

                console.log(value);
            });

            // Set value.value.m
            component.find('.pattern-menu #month-value').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.m = parseInt(event.target.value);
                }

                console.log(value);
            });

            // Set value.value.i
            component.find('.pattern-menu #the-interval').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.i = event.target.value;
                }

                console.log(value);
            });

            // Set value.value.d
            component.find('.pattern-menu #the-day').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.d = event.target.value;
                }

                console.log(value);
            });

            // Set value.value.m
            component.find('.pattern-menu #the-month').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.m = parseInt(event.target.value);
                }

                console.log(value);
            });
        },
        /**
         * @example
         * let recurrence = {
         *     pattern: 'Quarterly',
         *     value: {
         *         type: 'Calendar Year',
         *         quarters: [
         *             'First',
         *             'Fourth'
         *         ]
         *     }
         * }
         */
        Quarterly() {
            /*
                Calendar Year
                -------------
                Q1 1st Quarter: January 1st – March 31st
                Q2 2nd Quarter: April 1st – June 30th
                Q3 3rd Quarter: July 1st – September 30th
                Q4 4th Quarter: October 1st – December 31st

                Fiscal Year
                -----------
                Q1 1st quarter: October 1st – December 31st
                Q2 2nd quarter: January 1st – March 31st
                Q3 3rd quarter: April 1st – June 30th
                Q4 4th quarter: July 1st – September 30th
            */
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <select class='form-control ml-3 mr-3 type' id='' style='width: fit-content;'>
                            <option value='Calendar Year'>Calendar Year</option>
                            <option value='Fiscal Year'>Fiscal Year</option>
                        </select>
                        <div> on the:</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='mb-2 options'>
                        ${
                            [
                                'First',
                                'Second',
                                'Third',
                                'Fourth'
                            ]
                            .map(quarter => quarterTemplate(quarter, value.value?.type || 'Calendar Year'))
                            .join('\n')
                        }
                    </div>
                    <div class='d-flex align-items-center'>
                        quarter(s)
                    </div>
                </div>
            `;

            // Set default value
            if (isEmpty(value.value)) {
                value.value = {
                    type: 'Calendar Year',
                    quarters: []
                }

                console.log(value);
            }

            // TODO: select if value present
            function quarterTemplate(quarter, type) {
                let label = '';

                if (type === 'Calendar Year') {
                    switch(quarter) {
                        case 'First':
                            label = 'January 1st'
                            break
                        case 'Second':
                            label = 'April 1st'
                            break
                        case 'Third':
                            label = 'July 1st'
                            break
                        case 'Fourth':
                            label = 'October 1st'
                            break
                    }
                } else if (type === 'Fiscal Year') {
                    switch(quarter) {
                        case 'First':
                            label = 'October 1st'
                            break
                        case 'Second':
                            label = 'January 1st'
                            break
                        case 'Third':
                            label = 'April 1st'
                            break
                        case 'Fourth':
                            label = 'July 1st'
                            break
                    }
                }

                return /*html*/ `
                    <div class='custom-control custom-checkbox' style='height: 30px;'>
                        <input type='checkbox' class='custom-control-input quarter' id='${quarter}' ${setQtr(quarter)}>
                        <label class='custom-control-label' for='${quarter}' style=''>
                            <span style='display: inline-block; width: 70px;'>${quarter}</span> 
                            <span class='text-muted' style=''>${label}</span>
                        </label>
                    </div>
                `;
            }

            function setQtr(qtr) {
                return value.value?.quarters?.includes(qtr) ? 'checked' : '';
            }

            // Change options labels
            component.find('.pattern-menu .type').on('change', event => {
                component.find('.pattern-menu .options').innerHTML = [
                    'First',
                    'Second',
                    'Third',
                    'Fourth'
                ]
                .map(quarter => quarterTemplate(quarter, event.target.value))
                .join('\n');

                addQtr();
            });

            addQtr();

            function addQtr() {
                // Add qtr to value.value.quarters
                component.findAll('.pattern-menu .quarter').forEach(checkbox => {
                    checkbox.addEventListener('change', event => {
                        value.value.quarters = [...component.findAll(`.pattern-menu .quarter:checked`)].map(node => node.id);

                        console.log(value);
                    });
                });
            }
        },
        /**
         * @example
         * let recurrence = {
         *     pattern: 'Yearly',
         *     value: {
         *         years: 1,
         *         option: 'On m d',
         *         m: 'February',
         *         d: 15
         *     }
         * }
         * 
         * @example
         * let recurrence = {
         *     pattern: 'Yearly',
         *     value: {
         *         years: 1,
         *          option: 'On the i d of m',
         *          i: 'third',
         *          d: 'day',
         *          m: 'August'
         *     }
         * }
         */ 
        Yearly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <input type='number' class='form-control ml-3 mr-3' id='year-value' style='width: 75px;' value='${setYears()}'>
                        <div>year(s)</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='yearly-day' name='yearly' class='custom-control-input' ${setRadio('yearly-day')}>
                            <label class='custom-control-label' for='yearly-day'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='yearly-day'>
                            <div>On:</div>
                            <select class='form-control ml-3 mr-3' id='yearly-day-month' style='width: fit-content;'>
                                ${months.map(m => monthTemplate(m)).join('\n')}
                            </select>
                            <select class='form-control' id='yearly-date' style='width: fit-content;'>
                                ${[...Array(31).keys()].map(m => dayTemplate(m)).join('\n')}
                            </select>
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='yearly-week' name='yearly' class='custom-control-input' ${setRadio('yearly-week')}>
                            <label class='custom-control-label' for='yearly-week'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='yearly-week'>
                            <div>On the:</div>
                            <select class='form-control ml-3' id='yearly-week-interval' style='width: fit-content;'>
                                <option value='first'>first</option>
                                <option value='second'>second</option>
                                <option value='third'>third</option>
                                <option value='fourth'>fourth</option>
                                <option value='last'>last</option>
                            </select>
                            <select class='form-control ml-3 mr-3' id='yearly-week-day' style='width: fit-content;'>
                                <option value='day'>day</option>
                                <option value='weekday'>weekday</option>
                                <option value='weekend day'>weekend day</option>
                                <option value='Monday'>Monday</option>
                                <option value='Tuesday'>Tuesday</option>
                                <option value='Wednesday'>Wednesday</option>
                                <option value='Thursday'>Thursday</option>
                                <option value='Friday'>Friday</option>
                                <option value='Saturday'>Saturday</option>
                                <option value='Sunday'>Sunday</option>
                            </select>
                            <div>of</div>
                            <select class='form-control ml-3' id='yearly-week-month' style='width: fit-content;'>
                                ${months.map(m => monthTemplate(m)).join('\n')}
                            </select>
                        </div>
                    </div>
                </div>
            `;

            if (isEmpty(value.value)) {
                // Set month and day
                const month = months[new Date().getMonth()];
                const day = new Date().getDate();

                value.value = {
                    option: 'On m d',
                    month,
                    day
                }

                component.find('.pattern-menu #yearly-day-month').value = month;
                component.find('.pattern-menu #yearly-date').value = day;

                console.log(value);
            }

            function monthTemplate(month) {
                let selected = value.value?.m === month || month === months[new Date().getMonth()] ? 'selected' : '';

                return /*html*/ `
                    <option value='${month}' ${selected}>${month}</option>
                `;
            }

            function dayTemplate(day) {
                day = day + 1;

                return /*html*/ `
                    <option value='${day}' ${value.value?.d === day ? 'selected' : ''}>${day}</option>
                `;
            }

            function setYears() {
                return value.value?.years || 1;
            }

            // Set which option is checked
            function setRadio(option) {
                if (option === 'yearly-day' && value.value.option === 'On m d') {
                    return 'checked';
                } else if (option === 'yearly-week' && value.value.option === 'On the i d of m') {
                    return 'checked';
                } else if (option === 'yearly-day') {
                    return 'checked';
                }
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });

            // Set value.option
            component.findAll(`.pattern-menu input[type='radio']`).forEach(radio => {
                radio.addEventListener('change', event => {
                    if (event.target.checked) {
                        const id = radio.id;
                        const month = months[new Date().getMonth()];
                        const day = new Date().getDate();

                        // Set value.option to 'On m d'
                        if (id === 'yearly-day') {
                            value.value = {
                                option: 'On m d',
                                month,
                                day
                            }

                            // Empty fields
                            component.find('.pattern-menu #yearly-week-interval').value = 'first';
                            component.find('.pattern-menu #yearly-week-day').value = 'day';
                            component.find('.pattern-menu #yearly-week-month').value = month;
                        }

                        // Set value.option to 'On the i d of m'
                        else if (id === 'yearly-week') {
                            value.value = {
                                option: 'On the i d of m',
                                i: 'first',
                                d: 'day',
                                m: month
                            }

                            // Empty fields
                            component.find('.pattern-menu #yearly-day-month').value = month;
                            component.find('.pattern-menu #yearly-date').value = day;
                        }

                        console.log(value);
                    }
                });
            });

            // Set value.value.years
            component.find('.pattern-menu #year-value').addEventListener('change', event => {
                value.value.years = parseInt(event.target.value);

                console.log(value);
            });

            // Set value.value.m #1
            component.find('.pattern-menu #yearly-day-month').addEventListener('change', event => {
                value.value.m = event.target.value;

                console.log(value);
            });

            // Set value.value.m #2
            component.find('.pattern-menu #yearly-week-month').addEventListener('change', event => {
                value.value.m = event.target.value;

                console.log(value);
            });

            // Set value.value.d #1
            component.find('.pattern-menu #yearly-date').addEventListener('change', event => {
                value.value.d = parseInt(event.target.value);

                console.log(value);
            });

            // Set value.value.d #1
            component.find('.pattern-menu #yearly-week-day').addEventListener('change', event => {
                value.value.d = event.target.value;

                console.log(value);
            });

            // Set value.value.i
            component.find('.pattern-menu #yearly-week-interval').addEventListener('change', event => {
                value.value.i = event.target.value;

                console.log(value);
            });
        },
        /**
         * @example
         * let recurrence = {
         *     pattern: 'Irregular',
         *     value: [
         *         {
         *             m: 'January',
         *             d: 3
         *         },
         *         {
         *             m: 'May',
         *             d: 9
         *         },
         *         {
         *             m: 'November',
         *             d: 21
         *         }
         *     ]
         * }
         */
        Irregular() {
            if (!Array.isArray(value.value)) {
                value.value = [];

                console.log(value);
            }
            
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <div>Recur every:</div>
                    </div>
                    <div class='d-flex flex-wrap'>
                        ${months.map(m => monthTemplate(m)).join('\n')}
                    </div>
                </div>
            `;

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).checked = true;
                });
            });

            // TODO: select if value present
            function monthTemplate(month) {
                const { m, d } = value.value.find(item => item.m === month) || {};

                return /*html*/ `
                    <div class='month-container d-flex align-items-center mb-2 justify-content-between mr-3' style='width: 150px;'>
                        <div class='custom-control custom-checkbox' style=''>
                            <input type='checkbox' class='custom-control-input month' id='${month}' ${m ? 'checked' : ''}>
                            <label class='custom-control-label' for='${month}'>${month}</label>
                        </div>
                        <select class='day radio-label form-control ml-3' style='width: fit-content;' data-for='${month}'>
                            ${[...Array(31).keys()].map(day => dayTemplate(day, d)).join('\n')}
                        </select>
                    </div>
                `;
            }

            function dayTemplate(day, d) {
                day = day + 1;

                return /*html*/ `
                    <option value='${day}' ${day === d ? 'selected' : ''}>${day}</option>
                `;
            }

            // Set value.value
            component.findAll('.pattern-menu .month').forEach(checkbox => {
                checkbox.addEventListener('change', event => {
                    value.value =  [...component.findAll(`.pattern-menu .month:checked`)].map(node => {
                        const d = node.closest('.month-container').querySelector('.day ').value;

                        return {
                            m: node.id,
                            d: parseInt(d)
                        }
                    });

                    console.log(value);
                });
            });
        }
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    // TODO: Add validation
    component.value = () => {
        return value;
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ReleaseNotes(param) {
    const {
        version, notes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='release-notes'>
                <div class='release-notes-version'>Version <strong>${version}</strong></div>
                ${buildNotes(notes)}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin-top: 10px;
            }

            #id .release-notes-version {
                font-size: 1.4em;
                color: var(--primary);
                margin-bottom: 10px;
            }

            #id .release-notes-version strong {
                color: var(--primary);
            }
        `,
        parent: parent,
        position,
        events: []
    });

    function buildNotes(notes) {
        let html = /*html*/ `
            <ul>
        `;

        notes.forEach(note => {
            const {
                Summary, Description
            } = note;

            html += /*html*/ `
                <li>
                    <strong>${Summary}</strong>
                    &mdash;
                    ${Description}
                </li>
            `;
        });

        html += /*html*/ `
            </ul>
        `;

        return html;
    }

    return component;
}

/**
 *
 * @param {*} param
 */
export async function ReleaseNotesContainer(param) {
    const {
        parent, margin, padding, title
    } = param;

    const releaseNotesCard = Card({
        title: title !== '' ? 'Release Notes' : '',
        width: '100%',
        margin: margin || '0px',
        padding: padding || undefined,
        parent
    });

    releaseNotesCard.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading release notes',
        type: 'robi',
        parent: releaseNotesCard
    });

    loadingIndicator.add();

    /** Get Items */
    const releaseNotes = await Get({
        list: 'ReleaseNotes',
        select: 'Id,Summary,Description,MajorVersion,MinorVersion,PatchVersion,ReleaseType',
        filter: `Status eq 'Published'`
    });

    if (releaseNotes?.length === 0) {
        const alertInfo = Alert({
            text: 'None',
            type: 'robi-primary',
            // margin: '10px 0px 0px 0px',
            parent: releaseNotesCard
        });

        alertInfo.add();
    }

    const groups = {};

    releaseNotes?.forEach(note => {
        const {
            MajorVersion, MinorVersion, PatchVersion
        } = note;

        const version = `${MajorVersion}.${MinorVersion}.${PatchVersion}`;

        if (!groups[version]) {
            groups[version] = [];
        }

        groups[version].push(note);
    });

    const versions = [];

    for (const key in groups) {
        versions.push(key);
    }

    for (let i = versions.length - 1; i >= 0; i--) {
        const releaseNotesComponent = ReleaseNotes({
            version: versions[i],
            notes: groups[versions[i]],
            parent: releaseNotesCard
        });

        releaseNotesComponent.add();
    }

    /** Remove loading indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Reply(param) {
    const {
        reply, label, margin, onEdit, parent, position
    } = param;

    const {
        Body, Author, Editor, Created, Modified
    } = reply;

    // FIXME: Edit button doesn't show up if author of reply
    const component = Component({
        html: /*html*/ `
            <div class='card'>
                ${
                    Author.Name === Store.user().LoginName ?
                    /*html*/ `
                        <div class='button-group'>
                            <button type='button' class='btn btn-secondary cancel'>Cancel</button>
                            <button type='button' class='btn btn-robi-primaryColor edit'>Edit reply</button>
                        </div>
                    ` : ''
                }
                <div class='card-body'>
                    <h6 class='card-subtitle text-muted'>
                        <span>${Author.Title.split(' ').slice(0, 2).join(' ')} • ${formatDate(Created)}</span>
                        ${
                            label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-success' role='alert'>New</span>
                            ` : ''
                        }
                    </h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title.slice(0, 2).join(' ')} ${formatDate(Modified)} ` : ''}</h6>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                position: relative;
                background: var(--background);
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: 14px;
                font-weight: 400;
                text-align: right;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            /* #id .card-text {
                font-size: 13px;
            } */

            /* Reply */
            #id .button-group {
                position: absolute;
                display: none;
                top: 5px;
                right: 5px;
            }

            #id .button-group .btn {
                margin-left: 5px;
            }
            
            #id .edit,
            #id .cancel {
                font-size: .8em;
                padding: .275rem .75rem;
            }

            #id .cancel {
                display: none;
            }

            #id:hover .button-group {
                display: flex !important;
            }

            #id .btn-robi-primaryColor {
                background: var(--primary);
                color: white;
            }

            #id .btn-robi-primaryColor:focus,
            #id .btn-robi-primaryColor:active {
                box-shadow: none;
            }

            #id .editable {
                padding: 10px;
                margin-top: 20px;
                border: solid 2px mediumseagreen;
                border-radius: 4px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .cancel',
                event: 'click',
                listener(event) {
                    event.target.style.display = 'none';

                    const editButton = component.find('.edit');
                    editButton.innerText = 'Edit reply';
                    editButton.classList.add('btn-robi-primaryColor');
                    editButton.classList.remove('btn-success');

                    const buttonGroup = component.find('.button-group');
                    buttonGroup.style.display = 'none';

                    const cardText = component.find('.card-text');
                    cardText.setAttribute('contenteditable', false);
                    cardText.classList.remove('editable');
                }
            },
            {
                selector: '#id .edit',
                event: 'click',
                listener(event) {
                    const cardText = component.find('.card-text');
                    const buttonGroup = component.find('.button-group');
                    const cancelButton = component.find('.cancel');

                    if (event.target.innerText === 'Edit reply') {
                        event.target.innerText = 'Update';
                        event.target.classList.remove('btn-robi-primaryColor');
                        event.target.classList.add('btn-success');

                        cardText.setAttribute('contenteditable', true);
                        cardText.classList.add('editable');
                        cardText.focus();

                        cancelButton.style.display = 'block';
                        buttonGroup.style.display = 'flex';
                    } else {
                        onEdit(cardText.innerHTML);

                        event.target.innerText = 'Edit reply';
                        event.target.classList.add('btn-robi-primaryColor');
                        event.target.classList.remove('btn-success');

                        cardText.setAttribute('contenteditable', false);
                        cardText.classList.remove('editable');

                        cancelButton.style.display = 'none';
                        buttonGroup.style.display = 'none';
                    }
                }
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);
        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    component.setModified = (param) => {
        const {
            Modified, Editor
        } = param;

        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function RequestAssitanceInfo(param) {
    const {
        data, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class="request-assitance-info w-100">
                ${buildInfo()}
                <div class="alert alert-robi-primary" role="alert">
                    <p class="mb-3">For general CarePoint issues, please contact:</p>
                    <div>
                        <h6 class="mb-2">DHA Global Service Center (GSC)</h6>
                        <p class="mb-1">
                            <a href="tel:18006009332" class="alert-link">1 (800) 600-9332</a>
                        </p>
                        <p class="mb-2">Use the keyword <strong><i>MHS Information Platform</i></strong> or <strong><i>MIP</strong></i></p>
                        <p class="mb-1">
                            <a href="mailto:dhagsc@mail.mil" class="alert-link">dhagsc@mail.mil</a>
                        </p>
                        <p class="mb-0">
                            <a href="https://gsc.health.mil/" class="alert-link">https://gsc.health.mil</a>
                        </p>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id p {
                font-size: 14px;
            }

            #id .alert {
                border-radius: 20px;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    function buildInfo() {
        return data.map(item => {
            const {
                label, name, title, email, phone,
            } = item;

            return /*html*/ `
                <div class="alert alert-robi-secondary" role="alert">
                    <p class="mb-3">${label}</p>
                    <div>
                        <h5 class="mb-1">${name}</h5>
                        <p class="mb-2">${title}</p>
                        <p class="mb-1">
                            <a href="mailto:${email}" class="alert-link">${email}</a>
                        </p>
                        <p class="mb-0">
                            <a href="tel:${phone.replace(/([()-.\s])+/g, '')}" class="alert-link">${phone}</a>
                        </p>
                    </div>
                </div>
            `;
        }).join('\n');
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Row(render, options = {}) {
    const { parent, display, height, minHeight, flex, align, responsive } = options;
    
    const id = Store.getNextRow();

    const component = Component({
        html: /*html*/ `
            <div class='robi-row' data-row='${id}'></div>
        `,
        style: /*css*/ `
            /* TODO: Make flex work */
            #id.robi-row {
                width: 100%;
                display: ${display || 'block'};
                ${height ? `height: ${height};` : ''}
                ${minHeight ? `min-height: ${minHeight};` : ''}
                ${flex ? `flex: ${flex};` : ''}
                ${align ? `align-items: ${align};` : ''}
            }

            .robi-row:not(:last-child) {
                margin-bottom: 30px;
            }
        `,
        // FIXME: Do I like this? Does it assume too much?
        parent: parent || Store.get('viewcontainer'),
        events: [],
        async onAdd() {
            // NOTE: This is awfully imperative. Is there a better way?
            if (render.constructor.name === 'AsyncFunction') {
                const viewcontainer = Store.get('viewcontainer').get();
                
                if (viewcontainer) {
                    viewcontainer.style.display = 'flex';
                    viewcontainer.style.flexDirection = 'column';
                }

                if (component) {
                    component.get().style.flex = '1';
                    component.get().style.background = 'var(--background)';
                    // component.get().style.display = 'flex';
                    // component.get().style.justifyContent = 'center';
                    // component.get().style.alignItems = 'center';

                    const unsubscribeShimmer = Shimmer(component, { background: 'var(--background)' });

                    // NOTE: Testing
                    // const loadingMsg = LoadingSpinner({
                    //     message: 'Loading Dashboard', 
                    //     parent: component, 
                    // });

                    // loadingMsg.add();
                    
                    await render(component);

                    component.get().style.flex = 'unset';
                    component.get().style.background = 'var(--secondary)';

                    // loadingMsg.remove();
                    unsubscribeShimmer.off();
                }
            } else {
                render(component);
            }

            if (responsive) {
                const node = component.get();

                if (!node) {
                    return;
                }

                if (window.innerWidth <= 1600) {
                    node.style.flexDirection = 'column';
                } else {
                    node.style.flexDirection = 'row';
                }

                window.addEventListener('resize', event => {
                    const node = component.get();

                    if (!node) {
                        return;
                    }

                    if (window.innerWidth <= 1600) {
                        node.style.flexDirection = 'column';
                    } else {
                        node.style.flexDirection = 'row';
                    }
                });
            }
        }
    });

    component.add();
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SearchField(param) {
    const {
        margin, parent, onFilter, onSearch, onClear, onSelect, position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <!-- <input class='form-control mr-sm-2' type='search' data-toggle='dropdown' placeholder='Search markets and facilites' aria-label='Search'> -->
                <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                    <input class='form-control mr-sm-2' type='search' placeholder='Search markets & facilities' aria-label='Search'>
                </div>
                <div class='dropdown-menu'>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .form-inline {
                flex-flow: initial;
            }

            #id input[type='search'] {
                width: 100%;
                border-radius: .25rem;
                font-size: 13px;
                border: none;
                background: var(--button-background);
            }

            #id input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 20px;
                width: 20px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            /** Override Bootstrap input element active/focus style */
            #id input:active,
            #id input:focus {
                outline: none;
                border: none;
                box-shadow: none;
            }

            /** Dropdown */
            #id .dropdown-header {
                color: var(--primary)
            }

            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 50vh;
                overflow-y: overlay;
                /* box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px; */
                box-shadow: rgb(0 0 0 / 16%) 0px 10px 36px 0px, rgb(0 0 0 / 2%) 0px 0px 0px 1px;
                border: none;
            }

            #id .dropdown-menu::-webkit-scrollbar-track {
                background: white;
            }
            
            #id .dropdown-item {
                cursor: pointer;
                font-size: 13px;
            }

            #id .dropdown-item:focus,
            #id .dropdown-item:hover {
                color: #16181b;
                text-decoration: none;
                background-color: rgba(${App.get('primaryColorRGB')}, .1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    console.log(event.key);

                    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !component.find('.dropdown-menu').classList.contains('show')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return false;
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (!event.target.value) {
                        if (component.find('.dropdown-menu').classList.contains('show')) {
                            component.find('.toggle-search-list').click();
                        }

                        return;
                    }

                    onSearch(event.target.value.toLowerCase());
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'keydown',
                listener(event) {
                    if (event.key === 'Escape' || event.key === 'Backspace') {
                        component.find('.toggle-search-list').click();
                        component.find(`input[type='search']`).focus();

                        event.preventDefault();

                        return false;
                    }

                    if (event.key === 'Enter') {
                        onSelect(event);
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    onSelect(event);
                }
            }
        ]
    });

    function dropdownItemTemplate(item) {
        const {
            label, path
        } = item;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-path='${path}'>${label}</a>
        `;
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SectionStepper(param) {
    const {
        title, sections, selected, route, padding, parent, position, numbers, backButton
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='section-stepper'>
                <div class='title-container'>
                    ${
                        backButton ? /*html*/ `
                        <button type='button' class='btn'>
                            <div class='d-flex back-btn' style='' title='Back'>
                                <svg class='icon' style='fill: var(--primary); font-size: 26px;'>
                                    <use href='#icon-bs-arrow-left-cirlce-fill'></use>
                                </svg>
                            </div>
                        </button>               
                        ` : ''
                    }
                    ${
                        title ? /*html*/ `
                            <!-- <div class='section-title'>${title.text}</div> -->

                            <div class='section-group title pt-0' data-path=''>
                                <div class='section-circle' data-name='' style='opacity: 0;'>0</div>
                                <span class='section-title' data-name=''>${title.text}</span>
                            </div>
                        ` : ''
                    }

                </div>
                <div class='section-title-group'>
                    <div class='section-group-container'>
                        ${createHTML()}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Root */
            #id.section-stepper {
                display: flex;
                flex-direction: column;
                padding: ${padding || '0px'};
                border-radius: 10px;
                min-width: ${window.innerWidth > 1366 ? '200px' : '125px'};
                transition: width 300ms, min-width 300ms;
            }

            /* Title */
            #id .title-container {
                display: flex;
                position: relative;
            }

            #id .title-container .btn {
                padding: 0px;
                height: 37px;
                position: absolute;
                /* Align with prev and next view back button */
                top: -1px;
                left: -3px;
            }

            #id .section-title {
                flex: 1;
                font-size: 18px;
                font-weight: 700;
                color: var(--primary);
                /* Align baseline with view title */
                transform: translateY(8px);
                cursor: pointer;
            }


            /* Buttons */
            #id .btn-secondary {
                background: #dee2e6;
                color: #444;
                border-color: transparent;
            }

            /* Sections */
            #id .section-group-container {
                font-weight: 500;
                padding: 0px;
                border-radius: 10px;
            }

            #id .section-title-group {
                overflow: overlay;
            }
            
            #id .section-group {
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                border-radius: 10px;
                width: 100%;
                padding: 10px 20px;
            }
            
            #id .section-group.selected {
                background: var(--primary);
                color: white;
            }

            #id .section-group.selected * {
                color: var(--secondary);
            }

            /* Number */
            #id .section-circle {
                min-width: 10px;
                color: var(--primary);
                margin-right: 10px;
            }

            /* Name */
            #id .section-name {
                width: 100%;
                white-space: nowrap;
                font-weight: 500;
            }

            #id .section-name-text {
                font-size: 15px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .section-group',
                event: 'click',
                listener(event) {
                    const path = this.dataset.path;
                    Route(`${route}/${path}`);
                }
            },
            {
                selector: '#id .section-title',
                event: 'click',
                listener(event) {
                    if (title && title.action) {
                        title.action(event);
                    }
                }
            },
            {
                selector: '#id .back-btn',
                event: 'click',
                listener(event) {
                    if (backButton.action) {
                        backButton.action(event);
                    }
                }
            }
        ],
        onAdd() {
            // Window resize event
            window.addEventListener('resize', event => {
                const node = component.get();

                if (window.innerWidth > 1366) {
                    if (node && node.style) {
                        node.style.minWidth = '200px';
                    }
                } else {
                    if (node && node.style) {
                        node.style.minWidth = '125px';
                    }
                }
            });
        }
    });

    function createHTML() {
        let html = '';

        sections.forEach((section, index) => {
            const {
                name, path
            } = section;

            html += /*html*/ `
                <div class='section-group${name === selected ? ' selected' : ''}' data-path='${path}'>
                    ${numbers !== false ? /*html*/ `<div class='section-circle' data-name='${name}'>${index + 1}</div>` : ''}
            `;

            html += /*html*/ `
                    <div class='section-name'>
                        <span class='section-name-text' data-name='${name}'>${name}</span>
                    </div>
                </div>
            `;
        });

        return html;
    }

    component.select = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        // console.log(name);
        if (name) {
            name.classList.add('selected');
        }
    };

    component.deselect = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        if (name) {
            name.classList.remove('selected');
        }
    };

    component.update = sections => {
        sections.forEach(section => {
            const {
                name, status
            } = section;

            const circle = component.find(`.section-circle[data-name='${name}']`);

            circle.classList.remove('complete', 'started', 'not-started');
            circle.classList.add(status);
        });
    };

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Settings({ parent, pathParts, title }) {
    title.remove();
    
    // Routed selection, default to Account if none
    const path = pathParts[1] || 'Help';

    // All users see Account and Release Notes
    let sections = [
        {
            name: 'Help',
            path: 'Help'
        },
        {
            name: 'Preferences',
            path: 'Preferences'
        },
        {
            name: 'Release Notes',
            path: 'ReleaseNotes'
        }
    ];

    // Turn off view container default padding
    parent.paddingOff();
        
    // Form Container
    const formContainer = Container({
        height: '100%',
        width: '100%',
        padding: '0px',
        parent
    });

    formContainer.add();

    // Left Container
    const leftContainer = Container({
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        padding: '62px 20px 20px 20px',
        borderRight: `solid 1px var(--border-color)`,
        parent: formContainer
    });

    leftContainer.add();

    // Right Container
    const rightContainer = Container({
        flex: '1',
        height: '100%',
        direction: 'column',
        overflowX: 'overlay',
        padding: '62px 0px 0px 0px',
        parent: formContainer
    });

    rightContainer.add();

    // Title Container
    const titleContainer = Container({
        display: 'block',
        width: '100%',
        parent: rightContainer
    });

    titleContainer.add();

    const section = sections.find(item => item.path === path)?.name;

    // Route Title
    const routeTitle = Title({
        title: 'Settings',
        subTitle: section || 'Account',
        padding: '0px 30px 15px 30px',
        width: '100%',
        parent: titleContainer,
        type: 'across',
        action(event) {
            projectContainer.get().scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    routeTitle.add();

    // Project Container
    const projectContainer = Container({
        name: 'project',
        padding: '0px',
        width: '100%',
        height: '100%',
        direction: 'column',
        overflow: 'overlay',
        align: 'center',
        parent: rightContainer
    });

    projectContainer.add();

    // TODO: Move to Container method
    // Scroll listener
    projectContainer.get().addEventListener('scroll', event => {
        if (event.target.scrollTop > 0) {
            projectContainer.get().style.borderTop = `solid 1px var(--border-color)`;
        } else {
            projectContainer.get().style.borderTop = `none`;
        }
    });

    // Plan Container
    const planContainer = Container({
        width: '100%',
        name: 'plan',
        padding: '15px 30px',
        direction: 'column',
        parent: projectContainer
    });

    planContainer.add();

    // Section Stepper
    const sectionStepperContainer = Container({
        direction: 'column',
        parent: leftContainer
    });

    sectionStepperContainer.add();

    const sectionStepper = SectionStepper({
        numbers: false,
        route: 'Settings',
        sections: sections.sort((a, b) => a.name.localeCompare(b.name)),
        selected: section,
        parent: sectionStepperContainer
    });

    sectionStepper.add();

    // Show section based on path
    switch (section) {
        case 'Help':
            const requestAssistanceInfo = RequestAssitanceInfo({
                data: [
                    {
                        label: 'For help with this app, please contact:',
                        name: 'First Last',
                        title: 'TItle, Branch',
                        email: 'first.last.civ@mail.mil',
                        phone: '(555) 555-5555'
                    }
                ],
                parent: planContainer
            });
        
            requestAssistanceInfo.add();
            break;
        case 'Preferences':
            Preferences({
                parent: planContainer
            });
            break;
        case 'Release Notes':
            ReleaseNotesContainer({
                title: '',
                padding: '0px',
                maring: '0px',
                parent: planContainer
            });
            break;
        case 'Theme':
            ChangeTheme({
                parent: planContainer
            });
            break;
        default:
            Route('404');
            break;
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Sidebar({ parent, path }) {
    const component = Component({
        name: 'sidebar',
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <div class='w-100 d-flex justify-content-between align-items-center collapse-container'>
                    <span class='icon-container collapse'>
                        <svg class='icon'>
                            <use href='#icon-bs-layout-sidebar-nested'></use>
                        </svg>
                    </span>
                    <!-- Developer options --> 
                    ${
                        App.isDev() ?
                        (() => {
                            const id = GenerateUUID();

                            return /*html*/ `
                                <div class='dev-buttons-container'>
                                    <div class='dropdown'>
                                        <button class='btn w-100 open-dev-menu' type='button' id='${id}' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                            Edit
                                        </button>
                                        <div class='dropdown-menu' aria-labelledby='${id}'>
                                            <div class='grow-in-top-left'>
                                                <button class='dropdown-item modify-routes' type='button'>Modify routes</button>
                                                <button class='dropdown-item reorder-routes' type='button'>Reorder routes</button>
                                                <button class='dropdown-item hide-routes' type='button'>Hide routes</button>
                                                <div class='dropdown-divider'></div>
                                                <button class='dropdown-item delete-routes' type='button'>Delete routes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        })() : ''
                    }
                </div>
                <div class='title-container position-relative'>
                    ${
                        (() => {
                            const initialWidth = window.innerWidth;
                            
                            return initialWidth >= 1305 ? /*html*/ `
                                <h3 class='title'>${App.get('title')}</h3>
                            ` : /*html*/ `
                                <h3 class='placeholder' style='opacity: 0;'>${App.get('title')[0]}</h3>
                            `;
                        })()
                    }
                </div>
                <div class='nav-container'>
                    ${buildNav()}
                </div>
                <!-- <div style='padding: 0px 15px; overflow: hidden;'> -->
                <div style='padding: 0px 15px;'>
                ${
                    App.isDev() ?
                    /*html*/ `
                        <span class='nav add-route'>
                            <span class='icon-container' style='padding: 0px;'>
                                <span class='square d-flex' style='padding: 3px; margin: 7px'>
                                    <svg class='icon' style='font-size: 22px;'><use href='#icon-bs-plus'></use></svg>
                                </span>
                            </span>
                            <span class='text' data-width='200px' style='white-space: nowrap; color: var(--primary); font-size: 14px;'>New Route</span>
                        </span>
                    `: ''
                }
                </div>
                <!-- Settings -->
                <div class='settings-container'>
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <span class='icon-container-wide'>
                            <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        </span>
                        <span class='text'>Settings</span>
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.sidebar {
                position: relative;
                user-select: none;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                background: var(--background);
                border-right: solid 1px var(--border-color);
                height: 100vh;
                transition: width 300ms, min-width 300ms, background-color 300ms;
            }

            #id.sidebar.closed {
                min-width: 0vw;
            }

            /* Title */
            #id h3 {
                padding: 0px 20px 10px 20px;
                margin: 0px;
                font-weight: 700;
                width: 100%;
                white-space: nowrap;
            }

            /* Nav Container */
            .nav-container {
                position: relative;
                overflow: overlay;
                width: 100%;
                padding: 0px 15px;
                overflow-x: hidden;
                transition: height 300ms ease;
                /* NOTE: had to add height after hiding questions: why? */
                /* FIXME: What affect will this have? */
                height: 100%;
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: calc(100% - 30px);
                margin: 20px 15px;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                height: 42.5px;
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                border-radius: 10px;
                transition: width 300ms ease;
            }

            /* .sidebar .nav:not(.nav-selected):hover {
                background-color: var(--primary-20);
            } */

            .sidebar .icon-container {
                display: flex;
                padding: 10px 10px;
            }

            .sidebar .icon-container-wide {
                display: flex;
                padding: 10px 10px;
            }

            .sidebar .nav .icon {
                fill: var(--primary);
                font-size: 22px;
            }

            .sidebar .text {
                flex: 1;
                font-size: 15px;
                font-weight: 500;
                padding: 10px 0px;
                min-width: 200px;
                white-space: nowrap;
                transition: width 300ms, min-width 300ms, opacity 400ms;
            }

            .sidebar .text.collapsed {
                min-width: 0px;
                overflow: hidden;
                flex: 0;
            }

            /* Selected */
            .sidebar .nav-selected {
                background: var(--primary);
            }

            .sidebar .nav.nav-selected  .icon {
                fill: var(--background);
            }

            .sidebar .nav.nav-selected .text {
                color: var(--background);
            }

            @media (max-width: 1300px) {
                #id.sidebar .nav .text.closed {
                    display: none;
                }
    
                #id.sidebar .logo.closed {
                    image-rendering: pixelated;
                    width: 40px;
                }
    
                #id.sidebar .open-close.closed {
                    justify-content: center;
                }
            }

            /* Edit menu */
            #id .collapse-container {
                padding: 10px 15px;
            }

            #id .collapse-container .btn {
                color: var(--primary);
                font-weight: 500;
            }

            #id .collapse-container .icon {
                fill: var(--primary);
                font-size: 22px;
            }
            
            #id .collapse-container .icon-container {
                cursor: pointer;
            }

            #id .dropdown-menu {
                /* box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px; */
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: none;
            }

            #id .dev-buttons-container {
                position: relative;
                width: 50.41px;
                transition: width 150ms ease, opacity 150ms ease;
            }

            #id .dev-buttons-container.closed {
                display: none !important;
            }

            #id .dev-buttons-container .open-dev-menu {
                font-weight: 500;
                font-size: 15px;
            }

            #id .dev-buttons-container .dropdown-toggle:focus {
                box-shadow: none !important;
            }

            #id .dev-buttons-container .dropdown-item {
                outline: none;
                font-size: 14px;
            }

            #id .dev-buttons-container .delete-routes {
                color: var(--primary);
            }

            #id .square {
                background: var(--button-background);
                border-radius: 6px;
            }

            #id .add-route {
                transition: width 150ms ease, opacity 150ms ease;
            }

            @keyframes fade-out-left {
                from {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
                to {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
            }

            @keyframes fade-out {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fade-in-right {
                from {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
                to {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
            }

            @keyframes grab-show {
                from {
                    width: 0px;
                    opacity: 0;
                }
                to {
                    width: 22px;
                    opacity: 1;
                }
            }

            @keyframes grab-show-switch {
                from {
                    width: 0px;
                    opacity: 0;
                }
                to {
                    width: 44px;
                    opacity: 1;
                }
            }

            .fade-out {
                animation: 300ms ease-in-out fade-out;
            }
            
            .fade-in {
                animation: 150ms ease-in-out fade-in;
            }

            .fade-out-left {
                animation: 150ms ease-in-out fade-out-left;
            }

            .fade-in-right {
                animation: 300ms ease-in-out fade-in-right;
            }

            .grab:not(.switch) {
                width: 22px;
                opacity: 1;
                padding: 10px 0px;
                display: flex;
            }

            .grab.switch {
                width: 44px;
                transform: translateX(44px);
                height: 42.5px;
                opacity: 1;
                padding: 10px 0px;
            }

            .grab-show:not(.switch) {
                animation: 300ms ease-in-out grab-show;
            }

            .grab-show.switch {
                animation: 300ms ease-in-out grab-show-switch;
            }

            .grab-show-reverse:not(.switch) {
                animation: 300ms ease-in-out forwards grab-show;
                animation-direction: reverse;
            }

            .grab-show-reverse.switch {
                animation: 300ms ease-in-out forwards grab-show-switch;
                animation-direction: reverse;
            }

            #id .nav.ui-sortable-handle {
                width: auto;
                background: var(--background);
            }

            #id .nav.ui-sortable-helper {
                width: auto;
                background: var(--background);
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
            }

            #id .edit-buttons {
                position: absolute;
                top: 0px;
                right: 0px;
                height: 100%;
                display: flex;
                align-items: center;
                opacity: 0;
                transition: opacity 150ms ease;
            }

            #id .save-edit,
            #id .cancel-edit {
                cursor: pointer;
                font-size: 15px;
            }

            #id .save-edit {
                margin-right: 10px;
                font-weight: 500;
                opacity: 0;
                pointer-events: none;
                transition: opacity 150ms ease;
            }

            #id .save-edit * {
                color: var(--primary);
            }

            /* Hidden nav */
            #id .nav.hidden {
                pointer-events: none;
                opacity: 0;
                height: 0px;
                transition: all 300ms ease;
            }
        `,
        parent: parent,
        position: 'afterbegin',
        permanent: true,
        events: [
            {
                selector: '.nav:not(.control):not(.add-route):not(.hidden)',
                event: 'click',
                listener: routeToView
            },
            {
                selector: '.logo',
                event: 'click',
                listener(event) {
                    Route(this.dataset.path);
                }
            },
            {
                selector: '#id .collapse',
                event: 'click',
                listener: toggleSidebarMode
            },
            {
                selector: '#id .add-route',
                event: 'click',
                listener: AddRoute
            },
            {
                selector: '#id .modify-routes',
                event: 'click',
                listener: ModifyRoutes
            },
            {
                selector: '#id .reorder-routes',
                event: 'click',
                listener: reorderRoutes
            },
            {
                selector: '#id .hide-routes',
                event: 'click',
                listener: hideRoutes
            },
            {
                selector: '#id .delete-routes',
                event: 'click',
                listener: deleteRoutes
            }
        ],
        onAdd() {
            setTimeout(() => {
                // Set nav width
                component.findAll('.text').forEach(node => {
                    node.style.width = `${node.offsetWidth}px`;
                    node.dataset.width = `${node.offsetWidth}px`;
                });
            }, 0);

            // Window resize event
            const mode = component.get().dataset.mode;

            if (window.innerWidth <= 1305) {
                closeSidebar(mode);
            } else {
                openSidebar(mode);
            }

            window.addEventListener('resize', event => {
                const mode = component.get().dataset.mode;

                if (window.innerWidth <= 1305) {
                    closeSidebar(mode);
                } else {
                    openSidebar(mode);
                }
            });
        }
    });

    // TODO: blur maincontainer (add transition) and remove pointer events
    function reorderRoutes(event) {
        console.log('reorder routes');

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
            node.classList.remove('nav-selected');
            node.dataset.shouldroute = 'no';
            // node.style.cursor = 'initial';
        });

        // Find sortable nav
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');
        const startOrder = [...nav].map(node => node.dataset.path);

        console.log(startOrder);

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Transition
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', event => {
                console.log('cancel end');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove sortable
            $(`#${component.get().id} .nav-container`).sortable('destroy');

            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Updating route order'
            });

            await OrderRoutes({
                routes: [...component.findAll('.nav-container .nav:not([data-type="system"])')].map(node => node.dataset.path)
            });

            await blur.off((event) => {
                console.log(event);
                location.reload();
            });
        });

        // Show grab handle
        nav.forEach(node => {
            node.insertAdjacentHTML('afterbegin', /*html*/ `
                <div class='grab'>
                    <svg class='icon'><use href='#icon-bs-list'></use></svg>
                </div>
            `);

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        // Make sortable
        $(`#${component.get().id} .nav-container`).sortable({
            items: '.nav:not([data-type="system"])'
        });
        
        $(`#${component.get().id} .nav-container`).disableSelection();

        $(`#${component.get().id} .nav-container`).on('sortstop', (event, ui) => {
            const newOrder = [...component.findAll('.nav-container .nav:not([data-type="system"])')].map(node => node.dataset.path);
            // console.log(startOrder,  newOrder, arraysMatch(startOrder, newOrder));

            if (arraysMatch(startOrder, newOrder)) {
                component.find('.save-edit').style.opacity = '0';
                component.find('.save-edit').style.pointerEvents = 'none';
            } else {
                component.find('.save-edit').style.opacity = '1';
                component.find('.save-edit').style.pointerEvents = 'auto';
            }
        });

        function arraysMatch(arr1, arr2) {
            // Check if the arrays are the same length
            if (arr1.length !== arr2.length) return false;
        
            // Check if all items exist and are in the same order
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;
            }
        
            // Otherwise, return true
            return true;
        };
    }

    // TODO: show hidden routes in order
    // TODO: blur maincontainer (add transition) and remove pointer events
    function hideRoutes(event) {
        console.log('hide routes');

        // NOTE: Testing showing hidden routes

        component.findAll('.nav-container .nav.hidden').forEach(node => {
            node.style.height = '42.5px';
            node.style.opacity = '1';
        });

        // NOTE: END TESTING

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
            node.classList.remove('nav-selected');
            node.dataset.shouldroute = 'no';
            node.style.cursor = 'initial';
        });

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Make visible
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', () => {
            component.findAll('.nav-container .nav.hidden').forEach(node => {
                node.style.height = '0px';
                node.style.opacity = '0';
            });

            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', () => {
                console.log('end cancel');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Remove hide
                // console.log(component.find('.hide-label'));
                component.find('.hide-label')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Saving changes'
            });

            const paths = getHideState();

            await HideRoutes({
                paths
            });

            if (App.isProd()) {
                await Wait(5000);
            }

            // TODO: Route away from path if hidden
            await blur.off(() => {
                // If current route changed, route to home
                const currentPath = location.href.split('#')[1].split('/')[0];
                const hide = paths.find(p => p.path === currentPath).hide;

                console.log(currentPath, hide);

                if (hide) {
                    location.href = location.href.split('#')[0];
                    return;
                }
                
                location.reload();
            });
        });

        // Add hide label
        component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex justify-content-end position-absolute hide-label' style='bottom: -5px; right: 25px; font-size: 14px; font-weight: 500;'>
                <div>Hide</div>
            </div>
        `);

        // Show hide switch
        component.findAll('.nav-container .nav:not([data-type="system"])').forEach(node => {
            const id = GenerateUUID();

            const path = node.dataset.path;
            const { hide } = Store.routes().find(item => item.path === path);

            node.insertAdjacentHTML('beforeend', /*html*/ `
                <div class="custom-control custom-switch grab switch">
                    <input type="checkbox" class="custom-control-input" id='${id}'${hide ? ' checked' : ''}>
                    <!-- <label class="custom-control-label" for="${id}">Hide</label> -->
                    <label class="custom-control-label" for="${id}"></label>
                </div>
            `);

            // Switch change
            node.querySelector('.custom-control-input').addEventListener('change', event => {
                // FIXME: Return data structure changed. This will always trigger, only show save if a change has been made.
                const checked = getHideState();
                console.log(checked);

                if (checked.length) {
                    component.find('.save-edit').style.opacity = '1';
                    component.find('.save-edit').style.pointerEvents = 'auto';
                } else {
                    component.find('.save-edit').style.opacity = '0';
                    component.find('.save-edit').style.pointerEvents = 'none';
                }
            });

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        function getHideState() {
            return [...component.findAll('.nav .custom-control-input')].map(node => {
                return {
                    path: node.closest('.nav').dataset.path,
                    hide: node.checked
                }
            });
        }
    }

    // TODO: blur maincontainer (add transition) and remove pointer events
    function deleteRoutes(event) {
        // Show modal
        console.log('Delete routes');

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
            node.classList.remove('nav-selected');
            node.dataset.shouldroute = 'no';
            node.style.cursor = 'initial';
        });

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Make visible
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
        // Enable route
        component.findAll('.nav-container .nav').forEach(node => {
            node.dataset.shouldroute = 'yes';
            node.style.cursor = 'pointer';
        });

        // Animate cancel fade out
        component.find('.cancel-edit').addEventListener('animationend', event => {
            console.log('end cancel');

            // Select node
            const selected = location.href.split('#')[1].split('/')[0];
            component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
            component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
            setTimeout(() => {
                component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
            }, 200);

            // Remove cancel edit button
            component.find('.edit-buttons')?.remove();

            // Remove hide
            // console.log(component.find('.hide-label'));
            component.find('.hide-label')?.remove();

            // Turn edit back on
            component.find('.open-dev-menu').disabled = false;
            component.find('.open-dev-menu').style.opacity = '1';
        });
        component.find('.cancel-edit').classList.add('fade-out');

        // Remove grab handles
        component.findAll('.nav-container .nav .grab').forEach(node => {
            node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Deleting routes'
            });

            //TODO: remove nav from DOM
            const routes = toDelete();

            component.findAll('.nav-container .nav:not([data-type="system"])').forEach(node => {
                if (routes.includes(node.dataset.path)) {
                    node.remove();
                }
            })

            await DeleteRoutes({
                routes
            });

            // Wait an additional 3 seconds
            console.log('Waiting...')
            await Wait(3000);

            await blur.off((event) => {
                console.log(event);
                location.reload();
            });
        });

        // Add hide label
        // TODO: add absolutely positioned hide label
        component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex justify-content-end position-absolute hide-label' style='bottom: -5px; right: 25px; font-size: 14px; font-weight: 500;'>
                <div>Delete</div>
            </div>
        `);

        // Show hide switch
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');

        nav.forEach(node => {
            const id = GenerateUUID();

            node.insertAdjacentHTML('beforeend', /*html*/ `
                <div class="custom-control custom-switch grab switch">
                    <input type="checkbox" class="custom-control-input" id='${id}'>
                    <!-- <label class="custom-control-label" for="${id}">Hide</label> -->
                    <label class="custom-control-label" for="${id}"></label>
                </div>
            `);

            // Switch change
            node.querySelector('.custom-control-input').addEventListener('change', event => {
                const checked = toDelete();
                console.log(checked);

                if (checked.length) {
                    component.find('.save-edit').style.opacity = '1';
                    component.find('.save-edit').style.pointerEvents = 'auto';
                } else {
                    component.find('.save-edit').style.opacity = '0';
                    component.find('.save-edit').style.pointerEvents = 'none';
                }
            });

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        function toDelete() {
            return [...component.findAll('.nav .custom-control-input:checked')].map(node => node.closest('.nav').dataset.path);
        }
    }

    // TODO: Replace ModifyRoutes with this
    function modifyRoutes(event) {
        console.log('modify routes');

        // NOTE: Testing showing hidden routes
        // FIXME: Maybe hide current nav and add this on on top of it?
        component.find('.nav-container').innerHTML =  Store.routes()
        .filter(route => !route.ignore)
        .map(route => {
            const {
                path, title, icon, roles, type
            } = route;

            if (roles) {
                if (roles.some(r => Store.user().hasRole(r))) {
                    return navTemplate(path, icon, type, title);
                } else {
                    return '';
                }
            } else {
                return navTemplate(path, icon, type, title);
            }
        }).join('\n');
        // NOTE: END TESTING

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
            node.classList.remove('nav-selected');
            node.dataset.shouldroute = 'no';
            node.style.cursor = 'initial';
        });

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Make visible
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', event => {
                console.log('end cancel');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Remove hide
                // console.log(component.find('.hide-label'));
                component.find('.hide-label')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Hiding routes'
            });

            //TODO: remove nav from DOM
            const routes = toHide();
            
            component.findAll('.nav-container .nav:not([data-type="system"])').forEach(node => {
                if (routes.includes(node.dataset.path)) {
                    node.remove();
                }
            })

            await HideRoutes({
                routes
            });

            if (App.isProd()) {
                await Wait(5000);
            }

            await blur.off(() => {
                Route('');
                location.reload();
            });
        });

        // Add hide label
        // TODO: add absolutely positioned hide label
        component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex justify-content-end position-absolute hide-label' style='bottom: -5px; right: 25px; font-size: 14px; font-weight: 500;'>
                <div>Hide</div>
            </div>
        `);

        // Show hide switch
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');
        nav.forEach(node => {
            const id = GenerateUUID();

            const path = node.dataset.path;
            const { hide } = Store.routes().find(item => item.path === path);

            node.insertAdjacentHTML('beforeend', /*html*/ `
                <div class="custom-control custom-switch grab switch">
                    <input type="checkbox" class="custom-control-input" id='${id}'${hide ? ' checked' : ''}>
                    <!-- <label class="custom-control-label" for="${id}">Hide</label> -->
                    <label class="custom-control-label" for="${id}"></label>
                </div>
            `);

            // Switch change
            node.querySelector('.custom-control-input').addEventListener('change', event => {
                const checked = toHide();
                console.log(checked);

                if (checked.length) {
                    component.find('.save-edit').style.opacity = '1';
                    component.find('.save-edit').style.pointerEvents = 'auto';
                } else {
                    component.find('.save-edit').style.opacity = '0';
                    component.find('.save-edit').style.pointerEvents = 'none';
                }
            });

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        function toHide() {
            return [...component.findAll('.nav .custom-control-input:checked')].map(node => node.closest('.nav').dataset.path);
        }
    }

    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }
    
    function closeSidebar(mode) {
        if (mode !== 'closed') {
            // Collapse nav text nodes
            component.findAll('.text').forEach(item => {
                item.classList.add('collapsed');
                item.style.width = '0px';
                item.style.opacity = '0';
            });

            // Fade out long title to the left
            const title = component.find('.title');

            if (title) {
                component.find('.title').addEventListener('animationend', event => {
                    event.target.remove();

                    // Set short title
                    component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='fade-in title' style='text-align: center;'>${App.get('title')[0]}</h3>
                    `);
                });

                component.find('.title').classList.add('fade-out-left');
            } else {
                component.find('.title-container .placeholder')?.remove();

                // Set short title
                component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='title' style='text-align: center;'>${App.get('title')[0]}</h3>
                `);
            }

            if (App.isDev()) {
                // Fade out Edit
                component.find('.dev-buttons-container').style.opacity = '0';
                component.find('.dev-buttons-container').style.pointerEvents = 'none';
                
                component.find('.dev-buttons-container').style.width = '0px';

                // Fade out New route
                component.find('.add-route').style.opacity = '0';
                component.find('.add-route').style.pointerEvents = 'none';
            }
            // Set mode
            component.get().dataset.mode = 'closed';
        }
    }

    function openSidebar(mode) {
        if (mode !== 'open') {
            // Reset nav text node width
            component.findAll('.text').forEach(item => {
                item.classList.remove('collapsed');
                item.style.width = item.dataset.width;
                item.style.opacity = '1';
            });

            // Fade in long title from the left
            component.find('.title').remove();
            component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='title fade-in-right'>${App.get('title')}</h3>
            `);
            component.find('.title').addEventListener('animationend', event => {
                // console.log(event.target);
                event.target.classList.remove('fade-in-right');
            });

            if (App.isDev()) {
                // Fade in Edit
                component.find('.dev-buttons-container').style.opacity = '1';
                component.find('.dev-buttons-container').style.pointerEvents = 'auto';
                // TODO: Get actual width on load
                // FIXME: remove hard coded width
                component.find('.dev-buttons-container').style.width = '50.41px';

                // Fade in New route
                component.find('.add-route').style.opacity = '1';
                component.find('.add-route').style.pointerEvents = 'auto';
            }
            
            // Set mode
            component.get().dataset.mode = 'open';
        }
    }

    function buildNav() {
        return Store.routes()
            // .filter(route => route.path !== 'Settings' && !route.hide)
            .filter(route => !route.ignore)
            .map(route => {
                const {
                    path, title, icon, roles, type, hide
                } = route;

                if (roles) {
                    if (roles.some(r => Store.user().hasRole(r))) {
                        return navTemplate(path, icon, type, title, hide);
                    } else {
                        return '';
                    }
                } else {
                    return navTemplate(path, icon, type, title, hide);
                }

            }).join('\n');
    }

    function navTemplate(routeName, icon, type, title, hide) {
        const firstPath = path ? path.split('/')[0] : undefined;

        return /*html*/ `
            <span class='nav ${(firstPath === routeName || firstPath === undefined && routeName === App.get('defaultRoute')) ? 'nav-selected' : ''}${hide ? ' hidden' : ''}' data-path='${routeName}' data-type='${type || ''}'>
                <span class='icon-container'>
                    <svg class='icon'><use href='#icon-${icon}'></use></svg>
                </span>
                <span class='text'>${title || routeName.split(/(?=[A-Z])/).join(' ')}</span>
            </span>
        `;
    }

    function routeToView() {
        if (this.classList.contains('ui-sortable-handle') || this.dataset.shouldroute === 'no') {
            console.log(`don't route when sorting`);

            return;
        }

        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        this.classList.add('nav-selected');

        Route(this.dataset.path);
    }

    component.selectNav = (path) => {
        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        const nav = component.find(`.nav[data-path='${path}']`);

        if (nav) {
            nav.classList.add('nav-selected');
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SingleLineTextField(param) {
    const {
        addon,
        background,
        borderRadius,
        classes,
        description,
        fieldMargin,
        flex,
        fontSize,
        label,
        margin,
        maxWidth,
        onFocusout,
        onKeydown,
        onKeypress,
        onKeyup,
        onPaste,
        optional,
        padding,
        parent,
        placeholder,
        position,
        readOnly,
        value,
        width
    } = param;

    const component = Component({
        html: /*html*/ `
            
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    addon ?
                    /*html*/ `
                        <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>${addon}</div>
                            </div>
                            ${Field()}
                        </div>    
                    ` :
                    /*html*/ `
                        ${Field()}
                    `
                }
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            ${
                readOnly ?
                /*css*/ `
                    #id label {
                        margin-bottom: 0px;
                        font-weight: 500;
                    }
                ` :
                /*css*/ `
                    #id label {
                        font-weight: 500;
                    }
                `
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .slot-field {
                width: ${width || 'unset'};
                font-size: ${fontSize || '13px'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .slot-field.readonly {
                font-size: 13px;
                font-weight: 400;
                color: var(--color); 
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                padding: 0px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-control',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-control',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id .form-control',
                event: 'keypress',
                listener: onKeypress
            },
            {
                selector: '#id .form-control',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id .form-control',
                event: 'paste',
                listener: onPaste
            }
        ]
    });

    // NOTE: Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work
    function Field() {
        return readOnly ?
        /*html*/ `
            <div type='text' class='slot-field readonly'>${value || ''}</div>
        ` :
        /*html*/ `
            <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
        `;
    }

    component.focus = () => {
        const field = component.find('.form-control');

        field?.focus();
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };
    
    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function SiteUsageContainer({ parent }) {
    // Card container
    const chartCard = Container({
        display: 'block',
        shimmer: true,
        background: 'var(--secondary)',
        width: '100%',
        parent
    });

    chartCard.add();

    // Top banner
    const topBanner = DashboardBanner({
        data: [
            {
                label: 'Total Page Views',
                hide: true
            },
            {
                label: 'Unique Page Views',
                hide: true
            },
            {
                label: 'Unique Users', // NOTE: Same as Active users, making it redundant
                hide: true
            },
            {
                label: 'Unique Roles',
                hide: true
            }
        ],
        parent: chartCard
    });

    topBanner.add();

    // Middle container
    const middleContainer = Container({
        background: 'var(--background)',
        radius: '10px',
        radius: '10px',
        transition: 'background-color 300ms ease',
        margin: '10px 0px',
        parent: chartCard
    });

    middleContainer.add();

    // Chart container
    const chartContainer = Container({
        radius: '10px',
        width: '100%',
        parent: middleContainer
    });

    chartContainer.add();

    // Chart
    const chart = ChartJs({
        parent: chartContainer
    });

    chart.add();

    // Button Container
    const buttonContainer = Container({
        parent: middleContainer
    });

    buttonContainer.add();

    // Bottom banner
    const bottomBanner = DashboardBanner({
        data: [
            {
                label: 'Most Popular Page',
                hide: true
            },
            {
                label: 'Most Active Role',
                hide: true
            },
            {
                label: 'Most Active User',
                hide: true
            },
            {
                label: 'Last used',
                hide: true
            }
        ],
        parent: chartCard
    });

    bottomBanner.add();

    if (App.isDev()) {
        await Wait(2000);
    }

    // EACH BUTTON PRESS WILL RUN CODE BELOW HERE
    // TODO: set selectedChart and selectedData on button press like before

    // Set worker path based on env mode
    const workerPath = App.isProd() ? '../' : `http://127.0.0.1:8080/src/`;

    // Initialize worker
    const worker = new Worker(`${workerPath}Robi/Workers/SiteUsage.js`, {
        type: 'module'
    });

    // Send data to worker
    worker.postMessage({
        envMode: App.get('mode'),
        site: App.get('site'),
        date: new Date(),
        type: 'today'
    });

    // Store worker so it can be terminated if user routes away
    Store.addWorker(worker);

    // Receive output from worker
    worker.onmessage = event => {
        const { data } = event;
        const { topBannerData, bottomBannerData, chartData } = data;

        topBanner.update(topBannerData);
        bottomBanner.update(bottomBannerData);

        setChart({
            type: 'today',
            data: chartData
        });

        chartCard.shimmerOff();

        const node = middleContainer.get();

        if (node) {
            node.style.background = 'var(--secondary)';
        }
    };

    // TODO: This should live in Chart component
    // Add chart
    function setChart(param) {
        const { type, data } = param;

        const max0 = Math.max(...data[0].data.map(set => set.length)); // Largest number from dataset
        const max1 = 0;
        const max = (Math.ceil((max0 + max1) / 10) || 1) * 10; // Round sum of max numbers to the nearest multiple of 10 

        let stepSize;
        let labels;
        let text;

        if (max < 50) {
            stepSize = 1;
        } else {
            stepSize = 10;
        }

        switch (type) {
            case 'today':
                labels = [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00'
                ];
                text = new Date().toLocaleDateString('default', {
                    dateStyle: 'full'
                });
                break;
            case 'week':
                const options = {
                    month: 'long',
                    day: 'numeric'
                };
                const startAndEndOfWeek = StartAndEndOfWeek();
                const sunday = startAndEndOfWeek.sunday.toLocaleString('default', options);
                const saturday = startAndEndOfWeek.saturday.toLocaleString('default', options);

                labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                text = `${sunday} - ${saturday}, ${startAndEndOfWeek.sunday.getFullYear()}`;
                break;
            case 'month':
                labels = data[0].data.map((item, index) => index + 1);
                text = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                text = new Date().getFullYear();
                break;
            default:
                console.log('missing type');
                break;
        }

        chart.setTitle(text);

        chart.setChart({
            data: {
                labels,
                datasets: data.map((set, index) => {
                    return {
                        data: set.data.map(item => item.length),
                        label: set.label,
                        backgroundColor: App.get('primaryColor'),
                        hoverBackgroundColor: App.get('primaryColor'),
                        borderWidth: 0,
                        borderRadius: 3
                    };
                })
            },
            stepSize
        });
    }
}

/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function SquareField(param) {
    const {
        classes,
        label,
        description,
        parent,
        position,
        value,
        items
    } = param;

    // TODO: Allow multiple selections
    const component = Component({
        html: /*html*/ `
            <div class='square-field ${classes ? classes.join(' ') : ''}'>
                ${label ? /*html*/ `<label class='form-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    HTML({
                        items,
                        each(icon) {
                            const { label, html } = icon;

                            return /*html*/ `
                                <div class='square-container d-flex justify-content-center ${label === value ? 'selected' : ''}' data-value='${label}'>
                                    ${html}
                                </div>
                            `
                        }
                    })
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                display: grid;
                gap: 10px;
                grid-template-columns: repeat(auto-fill, calc((100% - ${items.length * 10}px) / ${items.length}));
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .square-container {
                display: flex;
                justify-content: center;
                align-items: center;
                aspect-ratio: 1.5 / 1;
                cursor: pointer;
                padding: 20px;
                background-color: var(--background);
                border-radius: 15px;
                transition: background-color 150ms ease, transform 150ms ease;
            }

            #id .square-container.selected {
                box-shadow: 0px 0px 0px 2px var(--primary);
                background-color: var(--primary-20); 
            }

            #id .square-container:hover {
                background-color: var(--primary-20);
                transform: scale(1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .square-container',
                event: 'click',
                listener(event) {
                    // Deselect all 
                    component.findAll('.square-container').forEach(node => node.classList.remove('selected'));

                    // Select clicked
                    this.classList.add('selected');
                }
            }
        ],
        onAdd() {

        }
    });

    component.value = (value) => {
        if (value === '') {
            component.find('.square-container.selected')?.classList.remove('selected');
        } else if (value !== undefined) {
            const icon = component.find(`.square-container[data-value='${value}']`);

            if (icon) {
                // Deselect all 
                component.findAll('.square-container').forEach(node => node.classList.remove('selected'));

                // Select value
                icon.classList.add('selected');
            }
        } else {
            return component.find('.square-container.selected')?.dataset.value;
        }
    }

    return component;
}

/**
 * {@link https://getbootstrap.com/docs/4.5/components/dropdowns/}

 * @param {Object} param
 * @returns
 */
export function StatusField(param) {
    const {
        action, label, parent, position, value, margin, padding
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='label'>${label}</div>
                <div class="dropdown">
                    <button class="btn ${setClass(value)} dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${value || "Not Started"}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <div class='dropdown-item'>Not Started</div>
                        <div class='dropdown-item'>In Progress</div>
                        <div class='dropdown-item'>Completed</div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
            }

            #id .label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .dropdown-item {
                cursor: pointer;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    /** Remove classes */
                    component.find('.dropdown-toggle').classList.remove('btn-outline-danger', 'btn-outline-info', 'btn-outline-success');

                    /** Add new class */
                    component.find('.dropdown-toggle').classList.add(setClass(event.target.innerText));

                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    function setClass(value) {
        switch (value) {
            case 'Not Started':
                return 'btn-outline-danger';
            case 'In Progress':
                return 'btn-outline-info';
            case 'Completed':
                return 'btn-outline-success';
            default:
                break;
        }
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', action);
        });
    };

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    return component;
}

/**
 * @example             
 * <svg class='icon'>
 *     <use href='#icon-[id]'></use>
 * </svg>
 * @param {*} param
 * @returns
 */
export function SvgDefs({ parent, position }) {
    const bootstrap = [
        {
            id: 'icon-bs-activity',
            paths: [
                '<path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"></path>'
            ]
        },
        {
            id: 'icon-bs-app',
            paths: [
                '<path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/>'
            ]
        },
        {
            id: 'icon-bs-arrow-down-circle-fill',
            paths: [
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>'
            ]
        },
        {
            id: 'icon-bs-arrow-left-cirlce-fill',
            paths: [
                '<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"></path>'
            ]
        },
        {
            id: 'icon-bs-bar-chart',
            paths: [
                '<path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"></path>'
            ]
        },
        {
            id: 'icon-bs-book',
            paths: [
                '<path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"></path>'
            ]
        },
        {
            id: 'icon-bs-bookmark-plus',
            paths: [
                '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"></path>',
                '<path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"></path>'
            ]
        },
        {
            id: 'icon-bs-bookmark-x',
            paths: [
                '<path fill-rule="evenodd" d="M6.146 5.146a.5.5 0 0 1 .708 0L8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 0 1 0-.708z"></path>',
                '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"></path>'
            ]
        },
        {
            id: 'icon-bs-card-checklist',
            paths: [
                '<path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"></path>',
                '<path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"></path>'
            ]
        },
        {
            id: 'icon-bs-chat-right-text',
            paths: [
                '<path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"></path>',
                '<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path>'
            ]
        },
        {
            id: 'icon-bs-check-circle',
            paths: [
                '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>',
                '<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"></path>'
            ]
        },
        {
            id: 'icon-bs-check-circle-fill',
            paths: [
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>'
            ]
        },
        {
            id: 'icon-bs-checks-grid',
            paths: [
                '<path d="M2 10h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm9-9h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm0 9a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-3zm0-10a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-3zM2 9a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H2zm7 2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3zM0 2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.354.854a.5.5 0 1 0-.708-.708L3 3.793l-.646-.647a.5.5 0 1 0-.708.708l1 1a.5.5 0 0 0 .708 0l2-2z"/>'
            ]
        },
        {
            id: 'icon-bs-chevron-compact-left',
            paths: [
                '<path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>'
            ]
        },
        {
            id: 'icon-bs-chevron-compact-right',
            paths: [
                '<path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>'
            ]
        },
        {
            id: 'icon-bs-clock',
            paths: [
                '<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>',
                '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>'
            ]
        },
        {
            id: 'icon-bs-circle-fill',
            paths: [
                '<circle cx="8" cy="8" r="8"/>'
            ]
        },
        {
            id: 'icon-bs-clipboard-check',
            paths: [
                '<path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path>',
                '<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>',
                '<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>'
            ]
        },
        {
            id: 'icon-bs-cloud-arrow-up',
            paths: [
                '<path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"></path>',
                '<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"></path>'
            ]
        },
        {
            id: 'icon-bs-code',
            paths: [
                '<path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"></path>'
            ]
        },
        {
            id: 'icon-bs-code-slash',
            paths: [
                '<path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"></path>'
            ]
        },
        {
            id: 'icon-bs-code-square',
            paths: [
                '<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>',
                '<path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"></path>'
            ]
        },
        {
            id: 'icon-bs-cursor-text',
            paths: [
                '<path d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.165 4.165 0 0 1 10.5 1.5a.5.5 0 0 1 0 1c-.638 0-1.177.213-1.564.434a3.49 3.49 0 0 0-.436.294V7.5H9a.5.5 0 0 1 0 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 0 1 0 1 4.165 4.165 0 0 1-2.06-.566A4.561 4.561 0 0 1 8 13.65a4.561 4.561 0 0 1-.44.285 4.165 4.165 0 0 1-2.06.566.5.5 0 0 1 0-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 0 1 0-1h.5V3.228a3.49 3.49 0 0 0-.436-.294A3.166 3.166 0 0 0 5.5 2.5.5.5 0 0 1 5 2zm3.352 1.355zm-.704 9.29z"/>'
            ]
        },
        {
            id: 'icon-bs-dash-circle-fill',
            paths: [
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"></path>'
            ]
        },
        {
            id: 'icon-bs-emoji-laughing',
            paths: [
                '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>',
                '<path d="M12.331 9.5a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5zM7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5z"/>'
            ]
        },
        {
            id: 'icon-bs-exclamation-circle-fill',
            paths: [
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>'
            ]
        },
        {
            id: 'icon-bs-file-arrow-down',
            paths: [
                '<path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>',
                '<path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>'
            ]
        },
        {
            id: 'icon-bs-file-earmark',
            paths: [
                '<path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"></path>'
            ]
        },
        {
            id: 'icon-bs-file-earmark-arrow-up',
            paths: [
                '<path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707V11.5z"/>',
                '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>'
            ]
        },
        {
            id: 'icon-bs-file-earmark-excel',
            paths: [
                '<path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"></path>',
                '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"></path>'
            ]
        },
        {
            id: 'icon-bs-file-earmark-pdf',
            paths: [
                '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"></path>',
                '<path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"></path>'
            ]
        },
        {
            id: 'icon-bs-file-earmark-ppt',
            paths: [
                '<path d="M7 5.5a1 1 0 0 0-1 1V13a.5.5 0 0 0 1 0v-2h1.188a2.75 2.75 0 0 0 0-5.5H7zM8.188 10H7V6.5h1.188a1.75 1.75 0 1 1 0 3.5z"></path>',
                '<path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"></path>'
            ]
        },
        {
            id: 'icon-bs-file-earmark-word',
            paths: [
                '<path d="M5.485 6.879a.5.5 0 1 0-.97.242l1.5 6a.5.5 0 0 0 .967.01L8 9.402l1.018 3.73a.5.5 0 0 0 .967-.01l1.5-6a.5.5 0 0 0-.97-.242l-1.036 4.144-.997-3.655a.5.5 0 0 0-.964 0l-.997 3.655L5.485 6.88z"></path>',
                '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"></path>'
            ]
        },
        {
            id: 'icon-bs-file-earmarked-ruled',
            paths: [
                '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h7v1a1 1 0 0 1-1 1H6zm7-3H6v-2h7v2z"></path>'
            ]
        },
        {
            id: 'icon-bs-folder',
            paths: [
                '<path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>'
            ]
        },
        {
            id: 'icon-bs-gear',
            paths: [
                '<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"></path>',
                '<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"></path>'
            ]
        },
        {
            id: 'icon-bs-grid-1x2',
            paths: [
                '<path d="M6 1H1v14h5V1zm9 0h-5v5h5V1zm0 9v5h-5v-5h5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5z"/>'                
            ]
        },
        {
            id: 'icon-bs-hash',
            paths: [
                '<path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"></path>'
            ]
        },
        {
            id: 'icon-bs-info',
            paths: [
                '<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>'
            ]
        },
        {
            id: 'icon-bs-info-circle',
            paths: [
                '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>',
                '<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>'
            ]
        },
        {
            id: 'icon-bs-input-cursor',
            paths: [
                '<path d="M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z"/>',
                '<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 8 1z"/>'
            ]  
        },
        {
            id: 'icon-bs-journals',
            paths: [
                '<path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path>',
                '<path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path>'
            ]
        },
        {
            id: 'icon-bs-layout-sidebar-nested',
            paths: [
                '<path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"></path>',
                '<path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"></path>'
            ]
        },
        {
            id: 'icon-bs-list',
            paths: [
                '<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>'
            ]
        },
        {
            id: 'icon-bs-list-ul',
            paths: [
                '<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>'
            ]
        },
        {
            id: 'icon-bs-pause-btn',
            paths: [
                '<path d="M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"></path>',
                '<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"></path>'
            ]
        },
        {
            id: 'icon-bs-pencil-square',
            paths: [
                '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>',
                '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>'
            ]
        },
        {
            id: 'icon-bs-people',
            paths: [
                '<path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>'
            ]
        },
        {
            id: 'icon-bs-person-badge',
            paths: [
                '<path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
                '<path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"/>'
            ]
        },
        {
            id: 'icon-bs-person-plus',
            paths: [
                '<path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>',
                '<path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path>'
            ]
        },
        {
            id: 'icon-bs-plus',
            paths: [
                '<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>'
            ]
        },
        {
            id: 'icon-bs-plus-circle-fill',
            paths: [
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>'
            ]
        },
        {
            id: 'icon-bs-plus-lg',
            paths: [
                '<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>'
            ]
        },
        {
            id: 'icon-bs-record-circle',
            paths: [
                '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>',
                '<path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>'
            ]
        },
        {
            id: 'icon-bs-speedometer',
            paths: [
                `<path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z"/>`,
                `<path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"/>`
            ]
        },
        {
            id: 'icon-bs-star',
            paths: [
                `<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>`
            ]
        },
        {
            id: 'icon-bs-star-fill',
            paths: [
                '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'
            ]
        },
        {
            id: 'icon-bs-stop-circle',
            paths: [
                '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>',
                '<path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z"/>'
            ]
        },
        {
            id: 'icon-bs-stop-fill',
            paths: [
                '<path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>'
            ]
        },
        {
            id: 'icon-bs-search',
            paths: [
                '<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>'
            ]
        },
        {
            id: 'icon-bs-table',
            paths: [
                '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>'
            ]
        },
        {
            id: 'icon-bs-thumbs-up',
            paths: [
                '<path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>'
            ]
        },
        {
            id: 'icon-bs-tools',
            paths: [
                '<path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"></path>'
            ]
        },
        {
            id: 'icon-bs-trash',
            paths: [
                '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>',
                '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>'
            ]
        },
        {
            id: 'icon-bs-type',
            paths: [
                '<path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"></path>'
            ]
        },
        {
            id: 'icon-bs-x',
            paths: [
                '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>'
            ]
        },
        {
            id: 'icon-bs-x-circle-fill',
            paths: [
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>'
            ]
        },
        {
            id: 'icon-bs-x-lg',
            paths: [
                '<path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path>'
            ]
        }
    ];

    const icomoon = [
        {
            id: "icon-aid-kit",
            paths: [
                '<path d="M28 8h-6v-4c0-1.1-0.9-2-2-2h-8c-1.1 0-2 0.9-2 2v4h-6c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-16c0-2.2-1.8-4-4-4zM12 4h8v4h-8v-4zM24 22h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"></path>'
            ]
        },
        {
            id: "icon-alarm",
            paths: [
                '<path d="M16 4c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14zM16 29.25c-6.213 0-11.25-5.037-11.25-11.25s5.037-11.25 11.25-11.25c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25zM29.212 8.974c0.501-0.877 0.788-1.892 0.788-2.974 0-3.314-2.686-6-6-6-1.932 0-3.65 0.913-4.747 2.331 4.121 0.851 7.663 3.287 9.96 6.643v0zM12.748 2.331c-1.097-1.418-2.816-2.331-4.748-2.331-3.314 0-6 2.686-6 6 0 1.082 0.287 2.098 0.788 2.974 2.297-3.356 5.838-5.792 9.96-6.643z"></path>',
                '<path d="M16 18v-8h-2v10h8v-2z"></path>'
            ]
        },
        {
            id: "icon-arrow-down",
            paths: [
                '<path d="M16 31l15-15h-9v-16h-12v16h-9z"></path>'
            ]
        },
        {
            id: "icon-arrow-left",
            paths: [
                '<path d="M1 16l15 15v-9h16v-12h-16v-9z"></path>'
            ]
        },
        {
            id: "icon-arrow-right",
            paths: [
                '<path d="M31 16l-15-15v9h-16v12h16v9z"></path>'
            ]
        },
        {
            id: "icon-arrow-up",
            paths: [
                '<path d="M16 1l-15 15h9v16h12v-16h9z"></path>'
            ]
        },
        {
            id: "icon-arrow-up2",
            paths: [
                '<path d="M27.414 12.586l-10-10c-0.781-0.781-2.047-0.781-2.828 0l-10 10c-0.781 0.781-0.781 2.047 0 2.828s2.047 0.781 2.828 0l6.586-6.586v19.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-19.172l6.586 6.586c0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586c0.781-0.781 0.781-2.047 0-2.828z"></path>'
            ]
        },
        {
            id: "icon-assignment_turned_in",
            viewBox: '0 0 24 24',
            paths: [
                '<path d="M9.984 17.016l8.016-8.016-1.406-1.406-6.609 6.563-2.578-2.578-1.406 1.406zM12 3q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.727 0.703 0.305 0.703-0.305 0.281-0.727-0.281-0.703-0.703-0.281zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path>'
            ]
        },
        {
            id: "icon-bin2",
            paths: [
                '<path d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>'
            ]
        },
        {
            id: "icon-blocked",
            paths: [
                '<path d="M27.314 4.686c-3.022-3.022-7.040-4.686-11.314-4.686s-8.292 1.664-11.314 4.686c-3.022 3.022-4.686 7.040-4.686 11.314s1.664 8.292 4.686 11.314c3.022 3.022 7.040 4.686 11.314 4.686s8.292-1.664 11.314-4.686c3.022-3.022 4.686-7.040 4.686-11.314s-1.664-8.292-4.686-11.314zM28 16c0 2.588-0.824 4.987-2.222 6.949l-16.727-16.727c1.962-1.399 4.361-2.222 6.949-2.222 6.617 0 12 5.383 12 12zM4 16c0-2.588 0.824-4.987 2.222-6.949l16.727 16.727c-1.962 1.399-4.361 2.222-6.949 2.222-6.617 0-12-5.383-12-12z"></path>'
            ]
        },
        {
            id: "icon-book",
            paths: [
                '<path d="M28 4v26h-21c-1.657 0-3-1.343-3-3s1.343-3 3-3h19v-24h-20c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24v-28h-2z"></path>',
                '<path d="M7.002 26v0c-0.001 0-0.001 0-0.002 0-0.552 0-1 0.448-1 1s0.448 1 1 1c0.001 0 0.001-0 0.002-0v0h18.997v-2h-18.997z"></path>'
            ]
        },
        {
            id: "icon-bookmarks",
            paths: [
                '<path d="M8 4v28l10-10 10 10v-28zM24 0h-20v28l2-2v-24h18z"></path>'
            ]
        },
        {
            id: "icon-calendar",
            paths: [
                '<path d="M10 12h4v4h-4zM16 12h4v4h-4zM22 12h4v4h-4zM4 24h4v4h-4zM10 24h4v4h-4zM16 24h4v4h-4zM10 18h4v4h-4zM16 18h4v4h-4zM22 18h4v4h-4zM4 18h4v4h-4zM26 0v2h-4v-2h-14v2h-4v-2h-4v32h30v-32h-4zM28 30h-26v-22h26v22z"></path>'
            ]
        },
        {
            id: "icon-checkbox-checked",
            paths: [
                '<path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>'
            ]
        },
        {
            id: "icon-checkmark",
            paths: [
                '<path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>'
            ]
        },
        {
            id: "icon-clipboard-add-solid",
            paths: [
                '<path d="M21 27h-3v-1h3v-3h1v3h3v1h-3v3h-1v-3zM24 20.498v-13.495c0-1.107-0.891-2.004-1.997-2.004h-1.003c0 0.002 0 0.003 0 0.005v0.99c0 1.111-0.897 2.005-2.003 2.005h-8.994c-1.109 0-2.003-0.898-2.003-2.005v-0.99c0-0.002 0-0.003 0-0.005h-1.003c-1.103 0-1.997 0.89-1.997 2.004v20.993c0 1.107 0.891 2.004 1.997 2.004h9.024c-0.647-1.010-1.022-2.211-1.022-3.5 0-3.59 2.91-6.5 6.5-6.5 0.886 0 1.73 0.177 2.5 0.498v0zM12 4v-1.002c0-1.1 0.898-1.998 2.005-1.998h0.99c1.111 0 2.005 0.895 2.005 1.998v1.002h2.004c0.551 0 0.996 0.447 0.996 0.999v1.002c0 0.556-0.446 0.999-0.996 0.999h-9.009c-0.551 0-0.996-0.447-0.996-0.999v-1.002c0-0.556 0.446-0.999 0.996-0.999h2.004zM14.5 4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5v0zM21.5 32c3.038 0 5.5-2.462 5.5-5.5s-2.462-5.5-5.5-5.5c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5v0z"></path>'
            ]
        },
        {
            id: "icon-cross",
            paths: [
                '<path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>'
            ]
        },
        {
            id: "icon-display",
            viewBox: '0 0 100 100',
            paths: [
                '<path d="M0 6.25v62.5h100v-62.5h-100zM93.75 62.5h-87.5v-50h87.5v50zM65.625 75h-31.25l-3.125 12.5-6.25 6.25h50l-6.25-6.25z"></path>'
            ]
        },
        {
            id: "icon-download",
            paths: [
                '<path d="M16 18l8-8h-6v-8h-4v8h-6zM23.273 14.727l-2.242 2.242 8.128 3.031-13.158 4.907-13.158-4.907 8.127-3.031-2.242-2.242-8.727 3.273v8l16 6 16-6v-8z"></path>'
            ]
        },
        {
            id: "icon-drawer",
            paths: [
                '<path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>',
                '<path d="M23 16h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>',
                '<path d="M25 20h-18c-0.552 0-1-0.448-1-1s0.448-1 1-1h18c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>'
            ]
        },
        {
            id: "icon-drawer2",
            paths: [
                '<path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>'
            ]
        },
        {
            id: "icon-earth",
            paths: [
                '<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 30c-1.967 0-3.84-0.407-5.538-1.139l7.286-8.197c0.163-0.183 0.253-0.419 0.253-0.664v-3c0-0.552-0.448-1-1-1-3.531 0-7.256-3.671-7.293-3.707-0.188-0.188-0.442-0.293-0.707-0.293h-4c-0.552 0-1 0.448-1 1v6c0 0.379 0.214 0.725 0.553 0.894l3.447 1.724v5.871c-3.627-2.53-6-6.732-6-11.489 0-2.147 0.484-4.181 1.348-6h3.652c0.265 0 0.52-0.105 0.707-0.293l4-4c0.188-0.188 0.293-0.442 0.293-0.707v-2.419c1.268-0.377 2.61-0.581 4-0.581 2.2 0 4.281 0.508 6.134 1.412-0.13 0.109-0.256 0.224-0.376 0.345-1.133 1.133-1.757 2.64-1.757 4.243s0.624 3.109 1.757 4.243c1.139 1.139 2.663 1.758 4.239 1.758 0.099 0 0.198-0.002 0.297-0.007 0.432 1.619 1.211 5.833-0.263 11.635-0.014 0.055-0.022 0.109-0.026 0.163-2.541 2.596-6.084 4.208-10.004 4.208z"></path>'
            ]
        },
        {
            id: "icon-file-empty",
            paths: [
                '<path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>'
            ]
        },
        {
            id: "icon-file-text2",
            paths: [
                '<path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>',
                '<path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>',
                '<path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>',
                '<path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>'
            ]
        },
        {
            id: "icon-flag",
            paths: [
                '<path d="M0 0h4v32h-4v-32z"></path>',
                '<path d="M26 20.094c2.582 0 4.83-0.625 6-1.547v-16c-1.17 0.922-3.418 1.547-6 1.547s-4.83-0.625-6-1.547v16c1.17 0.922 3.418 1.547 6 1.547z"></path>',
                '<path d="M19 1.016c-1.466-0.623-3.61-1.016-6-1.016-3.012 0-5.635 0.625-7 1.547v16c1.365-0.922 3.988-1.547 7-1.547 2.39 0 4.534 0.393 6 1.016v-16z"></path>'
            ]
        },
        {
            id: "icon-images",
            viewBox: '0 0 36 32',
            paths: [
                '<path d="M34 4h-2v-2c0-1.1-0.9-2-2-2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h2v2c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2zM4 6v20h-1.996c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993c0.001 0.001 0.003 0.002 0.004 0.004v1.996h-24c-1.1 0-2 0.9-2 2v0zM34 29.996c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993c0.001 0.001 0.003 0.002 0.004 0.004v23.993z"></path>',
                '<path d="M30 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>',
                '<path d="M32 28h-24v-4l7-12 8 10h2l7-6z"></path>'
            ]
        },
        {
            id: "icon-info",
            paths: [
                '<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>',
                '<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>',
                '<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>'
            ]
        },
        {
            id: "icon-microsoftexcel",
            paths: [
                '<path fill="#217346" style="fill: var(--color4, #217346)" d="M31.404 4.136h-10.72v1.984h3.16v3.139h-3.16v1h3.16v3.143h-3.16v1.028h3.16v2.972h-3.16v1.191h3.16v2.979h-3.16v1.191h3.16v2.996h-3.16v2.185h10.72c0.169-0.051 0.311-0.251 0.424-0.597 0.113-0.349 0.172-0.633 0.172-0.848v-21.999c0-0.171-0.059-0.273-0.172-0.309-0.113-0.035-0.255-0.053-0.424-0.053zM30.013 25.755h-5.143v-2.993h5.143v2.996zM30.013 21.571h-5.143v-2.98h5.143zM30.013 17.4h-5.143v-2.959h5.143v2.961zM30.013 13.4h-5.143v-3.139h5.143v3.14zM30.013 9.241h-5.143v-3.12h5.143v3.14zM0 3.641v24.801l18.88 3.265v-31.416l-18.88 3.36zM11.191 22.403c-0.072-0.195-0.411-1.021-1.011-2.484-0.599-1.461-0.96-2.312-1.065-2.555h-0.033l-2.025 4.82-2.707-0.183 3.211-6-2.94-6 2.76-0.145 1.824 4.695h0.036l2.060-4.908 2.852-0.18-3.396 6.493 3.5 6.624-3.065-0.18z"></path>'
            ]
        },
        {
            id: "icon-microsoftpowerpoint",
            paths: [
                '<path fill="#d24726" style="fill: var(--color2, #d24726)" d="M31.312 5.333h-11.389v4.248c0.687-0.52 1.509-0.784 2.473-0.784v4.131h4.099c-0.020 1.159-0.42 2.136-1.201 2.924-0.779 0.789-1.757 1.195-2.917 1.221-0.9-0.027-1.72-0.297-2.439-0.82v2.839h8.959v1.393h-8.961v1.724h8.953v1.376h-8.959v3.12h11.391c0.461 0 0.68-0.243 0.68-0.716v-19.976c0-0.456-0.219-0.68-0.68-0.68zM23.040 12.248v-4.165c1.16 0.027 2.133 0.429 2.917 1.213 0.781 0.784 1.188 1.768 1.208 2.952zM11.008 12.317c-0.071-0.268-0.187-0.476-0.351-0.629-0.16-0.149-0.376-0.259-0.644-0.328-0.3-0.081-0.609-0.12-0.92-0.12l-0.96 0.019v3.999h0.035c0.348 0.021 0.713 0.021 1.1 0 0.38-0.020 0.74-0.12 1.079-0.3 0.417-0.3 0.667-0.7 0.748-1.219 0.080-0.521 0.052-1.021-0.085-1.481zM0 4.079v23.928l18.251 3.153v-30.32zM13.617 14.861c-0.5 1.159-1.247 1.9-2.245 2.22-0.999 0.319-2.077 0.443-3.239 0.372v4.563l-2.401-0.279v-12.536l3.812-0.199c0.707-0.044 1.405 0.033 2.088 0.24 0.687 0.203 1.229 0.612 1.631 1.229 0.4 0.615 0.625 1.328 0.68 2.14 0.049 0.812-0.057 1.563-0.325 2.249z"></path>'
            ]
        },
        {
            id: "icon-microsoftword",
            paths: [
                '<path fill="#2b579a" style="fill: var(--color1, #2b579a)" d="M31.999 4.977v22.063c0 0.188-0.067 0.34-0.199 0.461-0.135 0.125-0.295 0.184-0.48 0.184h-11.412v-3.060h9.309v-1.393h-9.317v-1.705h9.309v-1.392h-9.303v-1.72h9.307v-1.376h-9.307v-1.724h9.307v-1.392h-9.307v-1.705h9.307v-1.391h-9.307v-1.74h9.307v-1.325h-9.307v-3.457h11.416c0.199 0 0.36 0.064 0.477 0.199 0.14 0.132 0.2 0.293 0.199 0.475zM18.2 0.855v30.296l-18.2-3.149v-23.912l18.2-3.24zM15.453 9.799l-2.279 0.14-1.461 9.047h-0.033c-0.072-0.428-0.34-1.927-0.82-4.489l-0.852-4.351-2.139 0.107-0.856 4.244c-0.5 2.472-0.779 3.911-0.852 4.315h-0.020l-1.3-8.333-1.96 0.104 2.1 10.511 2.179 0.14 0.82-4.091c0.48-2.4 0.76-3.795 0.82-4.176h0.060c0.081 0.407 0.341 1.832 0.82 4.28l0.82 4.211 2.36 0.14 2.64-11.8z"></path>'
            ]
        },
        {
            id: "icon-notification",
            paths: [
                '<path d="M16 3c-3.472 0-6.737 1.352-9.192 3.808s-3.808 5.72-3.808 9.192c0 3.472 1.352 6.737 3.808 9.192s5.72 3.808 9.192 3.808c3.472 0 6.737-1.352 9.192-3.808s3.808-5.72 3.808-9.192c0-3.472-1.352-6.737-3.808-9.192s-5.72-3.808-9.192-3.808zM16 0v0c8.837 0 16 7.163 16 16s-7.163 16-16 16c-8.837 0-16-7.163-16-16s7.163-16 16-16zM14 22h4v4h-4zM14 6h4v12h-4z"></path>'
            ]
        },
        {
            id: "icon-open-circle",
            paths: [
                '<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12z"></path>'
            ]
        },
        {
            id: "icon-pencil",
            paths: [
                '<path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>'
            ]
        },
        {
            id: "icon-pie-chart",
            paths: [
                '<path d="M14 18v-14c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14c0-2.251-0.532-4.378-1.476-6.262l-12.524 6.262zM28.524 7.738c-2.299-4.588-7.043-7.738-12.524-7.738v14l12.524-6.262z"></path>'
            ]
        },
        {
            id: "icon-play3",
            viewBox: '0 0 100 100',
            paths: [
                '<path d="M18.75 12.5l62.5 37.5-62.5 37.5z"></path>'
            ]
        },
        {
            id: "icon-plus",
            paths: [
                '<path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>'
            ]
        },
        {
            id: "icon-pushpin",
            paths: [
                '<path d="M17 0l-3 3 3 3-7 8h-7l5.5 5.5-8.5 11.269v1.231h1.231l11.269-8.5 5.5 5.5v-7l8-7 3 3 3-3-15-15zM14 17l-2-2 7-7 2 2-7 7z"></path>'
            ]
        },
        {
            id: "icon-save",
            paths: [
                '<path d="M28 0h-28v32h32v-28l-4-4zM16 4h4v8h-4v-8zM28 28h-24v-24h2v10h18v-10h2.343l1.657 1.657v22.343z"></path>'
            ]
        },
        {
            id: "icon-stats-bars",
            paths: [
                '<path d="M0 26h32v4h-32zM4 18h4v6h-4zM10 10h4v14h-4zM16 16h4v8h-4zM22 4h4v20h-4z"></path>'
            ]
        },
        {
            id: "icon-stats-dots",
            paths: [
                '<path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path>'
            ]
        },
        {
            id: "icon-user",
            paths: [
                '<path d="M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>'
            ]
        },
        {
            id: "icon-user-minus",
            paths: [
                '<path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>',
                '<path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-10v-2h10v2z"></path>'
            ]
        },
        {
            id: "icon-user-plus",
            paths: [
                '<path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>',
                '<path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z"></path>'
            ]
        },
        {
            id: "icon-users",
            viewBox: '0 0 36 32',
            paths: [
                '<path d="M24 24.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>',
                '<path d="M10.225 24.854c1.728-1.13 3.877-1.989 6.243-2.513-0.47-0.556-0.897-1.176-1.265-1.844-0.95-1.726-1.453-3.627-1.453-5.497 0-2.689 0-5.228 0.956-7.305 0.928-2.016 2.598-3.265 4.976-3.734-0.529-2.39-1.936-3.961-5.682-3.961-6 0-6 4.029-6 9 0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h8.719c0.454-0.403 0.956-0.787 1.506-1.146z"></path>'
            ]
        },
        {
            id: "icon-zoom-in",
            paths: [
                '<path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM14 6h-4v4h-4v4h4v4h4v-4h4v-4h-4z"></path>'
            ]
        },
        {
            id: "icon-zoom-out",
            paths: [
                '<path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM6 10h12v4h-12z"></path>'
            ]
        }
    ]

    const misc = [
        {
            id: 'icon-javascript',
            viewBox: '0 0 448 512',
            fill: '#F7DF1E',
            paths: [
                '<path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"/>'
            ]
        }
    ];

    const component = Component({
        html: /*html*/ `
            <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    ${
                        HTML({
                            items: bootstrap,
                            each(item) {
                                const { id, paths } = item;

                                return /*html*/ `
                                    <symbol data-type='bootstrap' id="${id}" viewBox="0 0 16 16">
                                        ${paths}
                                    </symbol>
                                `
                            }
                        })
                    }
                    ${
                        HTML({
                            items: icomoon,
                            each(item) {
                                const { id, paths, fill, viewBox } = item;

                                return /*html*/ `
                                    <symbol data-type='icomoon' id="${id}" viewBox="${viewBox || '0 0 32 32'}">
                                        ${paths}
                                    </symbol>
                                `
                            }
                        })
                    }
                    ${
                        HTML({
                            items: misc,
                            each(item) {
                                const { id, paths, fill, viewBox } = item;

                                return /*html*/ `
                                    <symbol data-type='misc' data-fill='${fill}' id="${id}" viewBox="${viewBox}">
                                        ${paths}
                                    </symbol>
                                `
                            }
                        })
                    }
                </defs>
            </svg>
        `,
        style: /*css*/ `

        `,
        parent,
        position,
        onAdd() {

        }
    });

    component.getIcons = () => {
        return [
            bootstrap,
            icomoon,
            misc
        ].flat();
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function Table(param) {
    const {
        addButton,
        addButtonValue,
        advancedSearch,
        border,
        buttonColor,
        checkboxes,
        createdRow,
        defaultButtons,
        deleteButton,
        editButton,
        editForm,
        editFormTitle,
        exportButtons,
        filter,
        formFooter,
        formView,
        headerFilter,
        heading,
        list,
        margin,
        newForm,
        newFormTitle,
        nowrap,
        onRowClick,
        onDelete,
        openInModal,
        order,
        padding,
        parent,
        path,
        showId,
        titleDisplayName,
        toolbar,
        top,
        view,
        width,
        pageLength,
    } = param;

    let {
        buttons, fields, items
    } = param;

    // App Lists
    const lists = App.lists();

    const tableContainer = Container({
        display: 'block',
        classes: ['table-container', 'w-100'],
        shimmer: true,
        minHeight: '200px',
        radius: '20px',
        width,
        margin,
        padding,
        parent
    });

    tableContainer.add();

    // Columns
    const headers = [];
    const columns = [];
    
    let selectAllId;
    
    if (checkboxes !== false) {
        // headers.push('');
        selectAllId = `select-all-${GenerateUUID()}`;

        headers.push(/*html*/ `
            <div class='custom-control custom-checkbox' style='min-height: unset; text-align: center; padding-left: 32.5px'>
                <input type='checkbox' class='custom-control-input' id='${selectAllId}'>
                <label class='custom-control-label' for='${selectAllId}'></label>
            </div>
        `)
        columns.push({
            data: null,
        });
    }

    // Item Id
    const idProperty = 'Id';
    let formFields = [];
    let schema;

    if (list) {
        // TODO: Only select fields from view
        items = items || await Get({
            path,
            top,
            list,
            select: '*,Author/Name,Author/Title,Editor/Name,Editor/Title',
            expand: `Author/Id,Editor/Id`,
            filter
        });

        // Get fields in view
        schema = lists.concat(Lists()).find(item => item.list === list);
            
        if (view) {
            fields = fields || schema?.views
                .find(item => item.name === view)
                ?.fields
                .map(name => {
                    // FIXME: Set default SharePoint Fields (won't be listed in schema)
                    // TODO: Only set 'Name' as an option if schema?.template === 101
                    const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                    if (spFields.includes(name)) {
                        return { name };
                    } else {
                        return schema?.fields.find(field => field.name === name);
                    }
                });

            if (formView) {
                if (formView === 'All') {
                    formFields = lists.concat(Lists()).find(item => item.list === list)?.fields;
                } else {
                    formFields = schema?.views
                        .find(item => item.name === view)
                        ?.fields
                        .map(name => {
                            // FIXME: Set default SharePoint Fields (won't be listed in schema)
                            // TODO: Only set 'Name' as an option if schema?.template === 101
                            const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];

                            if (spFields.includes(name)) {
                                return { name };
                            } else {
                                return schema?.fields.find(field => field.name === name);
                            }
                        });
                }
            } else {
                formFields = fields;
            }
        } else {
            // If no view, get all fields
            // FIXME: redundant
            fields = fields || lists.concat(Lists()).find(item => item.list === list)?.fields;
            formFields = fields;
        }

        if (!fields) {
            console.log('Missing fields');
            return;
        }

        [{ name: 'Id', display: 'Id', type: 'number' }]
            .concat(fields)
            .forEach(field => {
                const {
                    name, display, type, render
                } = field;

                headers.push(display || name);

                const columnOptions = {
                    data: name === titleDisplayName ? 'Title' : name,
                    type: name === 'Id' || type === 'number' ? 'num' : 'string',
                    visible: name === 'Id' && !showId ? false : true
                };

                // Classes
                if (name === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                // Render
                if (render) {
                    columnOptions.render = render;
                }

                else if (name.includes('Percent')) {
                    columnOptions.render = (data, type, row) => {
                        return `${Math.round(parseFloat(data || 0) * 100)}%`;
                    };
                }

                else if (type === 'mlot') {
                    columnOptions.render = (data, type, row) => {
                        return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                    };
                }

                // NOTE: What will break on this?
                else if (type === 'multichoice') {
                    columnOptions.render = (data, type, row) => {
                        return data ? data.results.join(', ') : '';
                    };
                }

                else if (type === 'date') {
                    columnOptions.render = (data, type, row) => {
                        // return data ? new Date(data).toLocaleString() : '';
                        return data ? new Date(data.split('T')[0].replace(/-/g, '\/')).toLocaleDateString() : '';
                    };
                }

                else if (name === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title.split(' ').slice(0, 2).join(' ');
                    };
                }

                else if (name.includes('Created')) {
                    columnOptions.render = (data, type, row) => {
                        // return data ? new Date(data).toLocaleString() : '';
                        return data ? new Date(data).toLocaleDateString() : '';
                    };
                }

                else if (name !== 'Id') {
                    columnOptions.render = (data, type, row) => {
                        return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                    };
                }

                columns.push(columnOptions);
            });
    } else {
        (Array.isArray(fields) ? fields : fields.split(','))
        .forEach(field => {
            const {
                render
            } = field;

            const internalFieldName = typeof field === 'object' ? field.internalFieldName : field;
            const displayName = typeof field === 'object' ? field.displayName : field;
            const type = typeof field === 'object' ? field.type || 'slot' : 'slot';

            headers.push(displayName);

            const columnOptions = {
                data: internalFieldName === titleDisplayName ? 'Title' : internalFieldName,
                type: internalFieldName === 'Id' ? 'number' : 'string',
                visible: internalFieldName === 'Id' && !showId ? false : true
            };

            /** Classes */
            if (internalFieldName === 'Id') {
                columnOptions.className = 'do-not-export bold';
                columnOptions.render = (data, type, row) => {
                    return data;
                };
            }

            /** Render */
            if (render) {
                columnOptions.render = render;
            }

            else if (internalFieldName.includes('Percent')) {
                columnOptions.render = (data, type, row) => {
                    return `${Math.round(parseFloat(data || 0) * 100)}%`;
                };
            }

            else if (type === 'mlot') {
                columnOptions.render = (data, type, row) => {
                    return /*html*/ `
                    <div class='dt-mlot'>${data || ''}</data>
                `;
                };
            }

            else if (type === 'date') {
                columnOptions.render = (data, type, row) => {
                    // return data ? new Date(data).toLocaleString() : '';
                    return data ? new Date(data.split('T')[0].replace(/-/g, '\/')).toLocaleDateString() : '';
                };
            }

            else if (internalFieldName === 'Author') {
                columnOptions.render = (data, type, row) => {
                    return data.Title;
                };
            }

            else if (internalFieldName.includes('Created')) {
                columnOptions.render = (data, type, row) => {
                    // return data ? new Date(data).toLocaleString() : '';
                    return data ? new Date(data).toLocaleDateString() : '';
                };
            }

            else if (internalFieldName !== 'Id') {
                columnOptions.render = (data, type, row) => {
                    return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                };
            }

            columns.push(columnOptions);
        });
    }

    // Buttons
    if (!Array.isArray(buttons)) {
        buttons = [];
    }

    if (addButton !== false) {
        buttons.push({
            text: /*html*/ `
                <svg class='icon'>
                    <use href='#icon-bs-plus-circle-fill'></use>
                </svg>
                <span>${addButtonValue || 'Add item'}</span>
            `,
            className: 'add-item plus-icon',
            name: 'add',
            action: function (e, dt, node, config) {
                if (openInModal) {
                    Route(`${list}/New`);
                } else {
                    const newModal = Modal({
                        contentPadding: '30px',
                        title: newFormTitle || `New Item`,
                        async addContent(modalBody) {
                            const formParam = {
                                event: e,
                                fields: formFields,
                                list,
                                modal: newModal,
                                parent: modalBody,
                                table
                            };

                            if (schema?.newForm) {
                                // NOTE: Must pass in all fields, not just what the selected view provides
                                formParam.fields = schema?.fields;
                                selectedForm = await schema?.newForm(formParam);
                            } else if (newForm) {
                                selectedForm = await newForm(formParam);
                            } else {
                                selectedForm = await NewForm(formParam);
                            }

                            // Set button value
                            if (selectedForm?.label) {
                                newModal.getButton('Create').innerText = selectedForm.label;
                            }

                            if (selectedForm) {
                                newModal.showFooter();
                            }
                        },
                        buttons: {
                            footer: [
                                {
                                    value: 'Cancel',
                                    classes: '',
                                    data: [
                                        {
                                            name: 'dismiss',
                                            value: 'modal'
                                        }
                                    ]
                                },
                                // TODO: send modal prop to form
                                {
                                    value: 'Create',
                                    classes: 'btn-robi',
                                    async onClick(event) {
                                        // Call newForm.onCreate() and wait for it to complete
                                        const newItem = await selectedForm?.onCreate(event);

                                        // TODO: Don't create item if newItem == false;

                                        if (!newItem) {
                                            console.log('Data not valid, alert user');
                                            return;
                                        }

                                        // Disable button - Prevent user from clicking this item more than once
                                        console.log($(event.target));
                                        
                                        $(event.target)
                                            .attr('disabled', '')
                                            .html(`<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Creating`);

                                        if (Array.isArray(newItem)) {
                                            items.concat(newItem);

                                            newItem.forEach(item => {
                                                table.addRow({
                                                    data: item
                                                });
                                            });
                                        } else {
                                            items.push(newItem);

                                            table.addRow({
                                                data: newItem
                                            });
                                        }

                                        // Enable button
                                        $(event.target)
                                            .removeAttr('disabled')
                                            .text('Created');

                                        // Close modal (DOM node will be removed on hidden.bs.modal event)
                                        newModal.close();
                                    }
                                }
                            ]
                        },
                        parent: tableContainer
                    });

                    newModal.add();
                }
            }
        });
    }

    if (defaultButtons !== false) {
        if (checkboxes !== false && deleteButton !== false) {
            buttons.push({
                text: /*html*/ `
                    <svg class='icon'>
                        <use href='#icon-bs-trash'></use>
                    </svg>
                `,
                className: 'delete-item',
                name: 'delete',
                enabled: false,
                action: async function (e, dt, node, config) {
                    const selected = table.selected();
                    const button = tableContainer.find('.delete-item');
                    button.disabled = true;
                    button.innerHTML = /*html*/ `<span class='spinner-border' role='status' aria-hidden='true' style='width: 18px; height: 18px; border-width: 3px'></span>`;

                    // Delete items
                    for (let row in selected) {
                        console.log(selected[row]);

                        // Delete item
                        await DeleteItem({
                            list,
                            itemId: selected[row].Id
                        });

                        // Delete Row
                        table.removeRow(selected[row].Id);
                    }

                    if (onDelete) {
                        await onDelete(table);
                    }

                    button.innerHTML = /*html*/ `
                        <span>
                            <svg class='icon'>
                                <use href='#icon-bs-trash'></use>
                            </svg>
                        </span>
                    `;
                }
            });
        }

        if (exportButtons !== false) {
            buttons.push({
                extend: 'collection',
                autoClose: true,
                background: false,
                fade: 0,
                text: /*html*/ `
                    <svg class='icon'>
                        <use href='#icon-bs-arrow-down-circle-fill'></use>
                    </svg>
                `,
                buttons: [
                    {
                        extend: 'excelHtml5',
                        // className: 'ml-50',
                        exportOptions: {
                            header: false,
                            footer: false,
                            columns: ':not(.do-not-export):not(.select-checkbox)'
                        }
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            header: false,
                            footer: false,
                            columns: ':not(.do-not-export):not(.select-checkbox)'
                        }
                    },
                    {
                        extend: 'pdfHtml5',
                        orientation: 'landscape',
                        exportOptions: {
                            columns: ':not(.do-not-export):not(.select-checkbox)'
                        }
                    }
                    // {
                    //     extend: 'copyHtml5',
                    //     exportOptions: {
                    //         columns: [3,4,5,6,7,8,9,10,11]
                    //     }
                    // },
                ]
            });
        }

        // NOTE: Experimental
        // NOTE: Off for now
        // TODO: Replace with DynaView
        let show = true;

        if (editButton !== false && App.isDev()) {
            buttons.push({
                text: 'Edit',
                className: 'btn-robi-light',
                name: 'edit-mode',
                action: async function (e, dt, node, config) {
                    if (show) {
                        e.target.innerText = 'Done';
                        table.hide();
                        show = false;

                        console.clear();

                        // Show editable table
                        const pageData = table.DataTable().rows( {page:'current'} ).data();

                        table.after(/*html*/ `
                            <table class='w-100 editable-table'>
                                <thead>
                                    <tr>
                                        ${
                                            headers
                                            .filter(h => h)
                                            .map(header => {
                                                console.log(header);

                                                return /*html*/ `
                                                    <th>${header}</th>
                                                `;
                                            }).join('\n')
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    ${
                                        pageData.map(row => {
                                            console.log(row);

                                            return /*html*/ `
                                                <tr>
                                                    ${
                                                        columns
                                                        .filter(c => c.data)
                                                        .map(column => {
                                                            const { data } = column;

                                                            // TODO: Add input tag based on field type
                                                            return /*html*/ `
                                                                <td>${row[data]}</td>
                                                            `;
                                                        }).join('\n')
                                                    }
                                                </tr>
                                            `;
                                        }).join('\n')
                                    }
                                </tbody>
                            </table>
                        `)
                    } else {
                        e.target.innerText = 'Edit';
                        table.show();
                        show = true;
                        tableContainer.find('.editable-table')?.remove();
                    }
                }
            });
        }
    }

    // Toolbar
    if (toolbar || advancedSearch) {
        const tableToolbar = TableToolbar({
            heading: heading || ( heading === '' ? '' : list ? (lists.find(item => item.list === list)?.display || list.split(/(?=[A-Z])/).join(' '))  : '' ),
            options: toolbar || [],
            parent: tableContainer,
            advancedSearch,
            list,
            newForm: schema?.newForm,
            editForm: schema?.editForm,
            action(label) {
                const { filter } = toolbar.find(option => option.label === label);

                // Clear
                table.DataTable().clear().draw();
                
                // Filter
                table.DataTable().rows.add(filter(items)).draw();
                
                // Adjust
                table.DataTable().columns.adjust().draw();
            },
            async search({ button, filters }) {
                // TODO: add loading message
                // Disable button
                button.disabled = true;
                button.innerHTML = /*html*/ `
                    <span class='spinner-border' role='status' aria-hidden='true' style='width: 18px; height: 18px; border-width: 3px'></span>
                `;

                // TODO: wrap preceding fields in ( ) if operator is OR
                const oDataQuery = filters.map(filter => {
                    const { column, condition, value, operator, type } = filter;

                    let query;
                    
                    switch(condition) {
                        case 'contains':
                            query = `(substringof('${value}', ${column}) eq true`
                            break;
                        case 'equals':
                            // TODO: add support for date, lookup, and multichoice fields
                            query = `${column} eq ${type === 'number' ? value : `'${value}'`}`;
                            break;
                        case 'not equal to':
                            // TODO: add support for date, lookup, and multichoice fields
                            query = `${column} ne ${type === 'number' ? value : `'${value}'`}`
                    }

                    return `${query}${operator ? ` ${operator.toLowerCase()} ` : ''}`;
                }).join('');

                console.log(oDataQuery);

                const getItems = await Get({
                    list,
                    filter: oDataQuery
                });

                console.log(getItems);

                // Clear
                table.DataTable().clear().draw();

                // Filter
                table.DataTable().rows.add(getItems).draw();
                
                // Adjust
                table.DataTable().columns.adjust().draw();

                // Enable button
                button.disabled = false;
                button.innerHTML = 'Search';
            }
        });
    
        tableToolbar.add();
    }

    // Currently selected item, row, and form
    let selectedItem;
    let selectedRow;
    let selectedForm;

    // DataTable component
    const table = DataTable({
        border: border || false,
        buttonColor,
        buttons,
        checkboxes: checkboxes !== false ? true : false,
        columns,
        createdRow,
        data: items,
        headerFilter,
        headers,
        nowrap,
        order: order || [[1, 'asc']], /** Sort by 1st column (hidden Id field at [0]) {@link https://datatables.net/reference/api/order()} */
        pageLength: pageLength || 25,
        rowId: idProperty,
        striped: true,
        width: '100%',
        onRowClick: onRowClick || function (param) {
            const {
                row, item
            } = param;

            selectedRow = row;
            selectedItem = item;

            // Open edit form full screen
            if (openInModal) {
                Route(`${list}/${selectedItem.Id}`);
            } else {
                // Open edit form in modal
                const rowModal = Modal({
                    title: editFormTitle || `Edit Item`,
                    contentPadding: '30px',
                    async addContent(modalBody) {
                        const formParam = { item, table, row, fields: formFields, list, modal: rowModal, parent: modalBody };

                        if (schema?.editForm) {
                            selectedForm = await schema?.editForm(formParam);
                        } else if (editForm) {
                            selectedForm = await editForm(formParam);
                        } else {
                            selectedForm = await EditForm(formParam);
                        }

                        // TODO: if selectedForm.label, change button value

                        if (formFooter !== false) {
                            rowModal.showFooter();
                        }
                    },
                    buttons: {
                        footer: [
                            {
                                value: 'Cancel',
                                classes: '',
                                data: [
                                    {
                                        name: 'dismiss',
                                        value: 'modal'
                                    }
                                ]
                            },
                            {
                                value: 'Update',
                                classes: 'btn-robi',
                                async onClick(event) {
                                    // Call newForm.onUpdate() and wait for it to complete
                                    const updatedItem = await selectedForm?.onUpdate(event);

                                    if (!updatedItem) {
                                        console.log('Data not valid, alert user');

                                        return;
                                    }

                                    // Disable button - Prevent user from clicking this item more than once
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html(`<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Updating`);

                                    table.updateRow({
                                        row: selectedRow,
                                        data: updatedItem
                                    });

                                    // Enable button
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Updated');

                                    // Hide modal
                                    rowModal.getModal().modal('hide');
                                }
                            },
                            {
                                value: 'Delete',
                                // disabled: true,
                                classes: 'btn-robi-light',
                                async onClick(event) {
                                    // Disable button - Prevent user from clicking this item more than once
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html(`<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Deleteing`);

                                    // Call newForm.onDelete() and wait for it to complete
                                    await selectedForm?.onDelete(event);

                                    table.removeRow(selectedItem.Id);

                                    // Enable button
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Deleted');

                                    // Hide modal
                                    rowModal.getModal().modal('hide');
                                }
                            }
                        ]
                    },
                    parent: tableContainer
                });

                rowModal.add();
            }
        },
        onSelect(param) {
            const selected = table.selected();

            // console.log('select', selected);

            if (selected.length > 0) {
                table.DataTable().buttons('delete:name').enable();
            }

            setSelectedRadius();
        },
        onDeselect(param) {
            const selected = table.selected();

            // console.log('deselect', selected);

            if (selected.length === 0) {
                table.DataTable().buttons('delete:name').disable();
            }

            setSelectedRadius();
            removeSelectedRadius();
        },
        onDraw(param) {
            const {
                jqevent, table
            } = param;

            // const data = table.rows({ search: 'applied' }).data().toArray();
            // console.log(param);

            setSelectedRadius();
            removeSelectedRadius();
        },
        parent: tableContainer
    });

    table.add();

    // Add select all change handler
    table.find(`#${selectAllId}`)?.addEventListener('change', event => {
        if (event.target.checked) {
            table.DataTable().rows().select();
        } else {
            table.DataTable().rows().deselect();
        }
    });

    // Filter by first toolbar if toolbar exists
    if (toolbar) {
        const { filter } = toolbar[0];

        // Clear
        table.DataTable().clear().draw();
        
        // Filter
        table.DataTable().rows.add(filter(items)).draw();
        
        // Adjust
        table.DataTable().columns.adjust().draw();
    }

    // Shimmer off
    tableContainer.shimmerOff();

    // FIXME: This only works if selected rows are grouped together
    // TODO: Handle one or more groups of selected rows (ex: rows [0, 1, 2], [5,6], [8,9], and [12])
    function setSelectedRadius() {
        // Find all rows
        const rows = table.findAll('tbody tr.selected');

        // Reset
        rows.forEach(row => {
            row.querySelector('td:first-child').classList.remove('btlr-0', 'bblr-0');
            row.querySelector('td:last-child').classList.remove('btrr-0', 'bbrr-0');
        });

        // Remove radius from first and last row
        if (rows.length >= 2) {
            rows[0].querySelector('td:first-child').classList.add('bblr-0');
            rows[0].querySelector('td:last-child').classList.add('bbrr-0');

            rows[rows.length - 1].querySelector('td:first-child').classList.add('btlr-0');
            rows[rows.length - 1].querySelector('td:last-child').classList.add('btrr-0');
        }

        // Remove radius from middle rows (every row except first and last)
        if (rows.length >= 3) {
            const middle = [...rows].filter((row, index) => index !== 0 && index !== rows.length - 1);
            middle.forEach(row => {
                row.querySelector('td:first-child').classList.add('btlr-0', 'bblr-0');
                row.querySelector('td:last-child').classList.add('btrr-0', 'bbrr-0');
            });
        }
    }

    function removeSelectedRadius() {
        // Find all rows
        const rows = table.findAll('tbody tr:not(.selected)');

        // Reset
        rows.forEach(row => {
            row.querySelector('td:first-child').classList.remove('btlr-0', 'bblr-0');
            row.querySelector('td:last-child').classList.remove('btrr-0', 'bbrr-0');
        });
    }

    
    // TODO: Generalize
    // TODO: If form is modal, launch modal
    // TODO: If form is view, Route to view
    // Open modal
    // if (itemId) {
    //     const row = table.findRowById(itemId);

    //     if (row) {
    //         if (row.show) {
    //             row.show().draw(false).node().click();
    //         } else {
    //             row.draw(false).node().click();
    //         }
    //     }
    // }

    return table;
}

// TODO: Compute advanced search container and row heights in onAdd()
/**
 *
 * @param {*} param
 * @returns
 */
export function TableToolbar(param) {
    const {
        advancedSearch,
        action,
        heading,
        list,
        options,
        parent,
        position,
        search
    } = param;

    const listInfo = Lists().concat(App.lists()).find(item => item.list === list);
    
    let userSettings = JSON.parse(Store.user().Settings);
    let searches = userSettings.searches[list] || [];
    let open = false;
    let loaded;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar w-100' role='toolbar'>
                <div class='text'>${heading}</div>
                ${
                    listInfo?.options?.menu !== false && App.isDev() ?
                    (() => {
                        const id = GenerateUUID();

                        return /*html*/ `
                            <div class='edit-table'>
                                <button class='btn' type='button' id='${id}' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>•••</button>
                                <div class='dropdown-menu' aria-labelledby='${id}'>
                                    <div class='grow-in-top-left'>
                                        <button class='dropdown-item new-form' type='button'>New Form</button>
                                        <button class='dropdown-item edit-form' type='button'>Edit Form</button>
                                        <button class='dropdown-item fields' type='button'>Form Sections</button>
                                        <div class='dropdown-divider'></div>
                                        <button class='dropdown-item views' type='button'>Views</button>
                                        <div class='dropdown-divider'></div>
                                        <button class='dropdown-item fields' type='button'>Fields</button>
                                        <div class='dropdown-divider'></div>
                                        <button class='dropdown-item settings' type='button' style='color: var(--primary);'>Settings</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    })() : ''
                }
                ${
                    advancedSearch ? 
                    /*html*/ `
                        <button type='button' class='btn btn-robi-light mr-2 advanced-search'>Advanced search</button>
                    `                    
                    : ''   
                }
                <div class='btn-group' role='group'>
                    ${buildFilters()}
                </div>
                ${
                    advancedSearch ?
                    (() => {
                        const id = GenerateUUID();

                        return /*html*/ `
                            <div class='search-container search-container-grow height-0 opacity-0 pt-0 pb-0 mt-2'>
                                ${searchRow(GenerateUUID())}
                                <!-- Buttons -->
                                <div class='d-flex justify-content-end run-search-container pt-2'>
                                    <div class='d-flex justify-content-start load-search-container' style='flex: 2;'>
                                        <button type='button' class='btn btn-robi-light' id='${id}' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Load</button>
                                        <div class='dropdown-menu' aria-labelledby='${id}'>
                                            <div class='grow-in-top-left saved-search-menu'>
                                                ${
                                                    searches.length ? searches.map(search => {
                                                        const { name } = search;

                                                        return /*html*/ `<button class='dropdown-item load-search' type='button'>${name}</button>`;
                                                    }).join('\n') : 
                                                    /*html*/ `
                                                        <div style='font-size: 13px; padding: .25rem 1.5rem;'>No saved searches</div>
                                                    `
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class='d-flex justify-content-end'>
                                        <button type='button' class='btn btn-robi-light save-search'>Save</button>
                                        <button type='button' class='btn btn-robi-reverse run-search'>Search</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    })() : ''   
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                align-items: center;
                justify-content: end;
                margin-bottom: 10px;
            }

            #id .text {
                font-size: 20px;
                font-weight: 700;
            }

            #id .btn {
                font-size: 13px;
                font-weight: 500;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }

            #id .ask-a-question {
                background: var(--button-background);
                color: var(--primary);
                font-weight: 500;
            }
            
            #id .search-questions {
                background: var(--button-background) !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-outline-robi-primary {
                color: var(--primary);
                background-color: initial;
                border-color: var(--primary);
            }

            /* Search */
            #id .advanced-search {
                width: 135px;
                transition: 300ms opacity ease;
                text-align: right;
            }

            #id .search-container {
                border-radius: 20px;
                width: 100%;
                padding: 20px;
                background: var(--background);
                transition: opacity 300ms ease, padding 300ms ease, height 300ms ease;
                height: 123px;
                overflow: hidden;
            }

            #id .input-group * {
                font-size: 13px;
            }

            #id .opacity-0 {
                opacity: 0 !important;
            }

            #id .height-0 {
                height: 0px !important;
            }

            #id .custom-select {
                background: var(--inputBackground);
            }

            /* Load menu */
            #id .dropdown-menu {
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: none;
            }

            /* Edit table */
            #id .edit-table {
                flex: 1;
            }

            #id .edit-table .btn {
                font-size: 16px;
                cursor: pointer;
                color: var(--primary);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    // Deselect all options
                    const currentSelected = component.find('.filter.btn-robi-reverse');
                    currentSelected.classList.remove('btn-robi-reverse');
                    currentSelected.classList.add('btn-outline-robi-primary');

                    // Select clicked button
                    this.classList.remove('btn-outline-robi-primary');
                    this.classList.add('btn-robi-reverse');

                    action(this.innerText);
                }
            },
            {
                selector: '#id .advanced-search',
                event: 'click',
                listener(event) {
                    if (open) {
                        open = false;
                        event.target.innerText = 'Advanced search';
                        setTimeout(() => {
                            component.find('.search-container').classList.add('height-0', 'opacity-0', 'pt-0', 'pb-0');
                        }, 0);
                    } else {
                        open = true;
                        event.target.innerText = 'Close'
                        setTimeout(() => {
                            component.find('.search-container').classList.remove('height-0', 'opacity-0', 'pt-0', 'pb-0');
                        }, 0);
                    }
                }
            },
            {
                selector: '#id .add-row',
                event: 'click',
                listener: addRow
            },
            {
                selector: '#id .load-search',
                event: 'click',
                listener: loadSearch
            },
            {
                selector: '#id .save-search',
                event: 'click',
                listener: saveSearch
            },
            {
                selector: '#id .run-search',
                event: 'click',
                listener(event) {
                    runSearch(this);
                }
            },
            {
                selector: `#id input[data-field='value']`,
                event: 'keypress',
                listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        runSearch(component.find('.run-search'));
                    }
                }
            },
            // Edit table
            {
                selector: `#id .edit-table .new-form`,
                event: 'click',
                listener(event) {
                    const { newForm, display, fields } = App.list(list) || Lists().find(item => item.list === list);

                    if (newForm) {
                        ModifyForm({ list, display, fields, form: newForm, type: 'New' });
                    } else {
                        CustomNewForm({ list, display, fields });
                    }
                }
            },
            {
                selector: `#id .edit-table .edit-form`,
                event: 'click',
                listener(event) {
                    const { editForm, display, fields } = App.list(list) || Lists().find(item => item.list === list);

                    if (editForm) {
                        ModifyForm({ list, display, fields, form: editForm, type: 'Edit'  });
                    } else {
                        CustomEditForm({ list, display, fields });
                    }
                }
            }
        ]
    });

    function saveSearch(event) {
        const modal = Modal({
            title: false,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                // modal.find('.modal-dialog').style.maxWidth = 'fit-content';

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-3'>Save search</h3>
                `);

                // Search name
                const searchName = SingleLineTextField({
                    label: 'Name',
                    value: loaded,
                    parent: modalBody,
                    async onKeypress(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault();

                            if (searchName.value()) {
                                await save();
                            } else {
                                console.log('search name empty');
                            }
                        }
                    },
                    onKeyup(event) {
                        // canEnable();

                        // const name = searchName.value();
                        // showMessage(name);
                    },
                    onFocusout(event) {
                        // const name = searchName.value();
                        // showMessage(name);
                    }
                });

                searchName.add();

                const saveSearchBtn = Button({
                    action: save,
                    classes: ['w-100 mt-3'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Save'
                });

                saveSearchBtn.add();

                const cancelBtn = Button({
                    action(event) {
                        console.log('Cancel save search');

                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Cancel'
                });

                cancelBtn.add();

                async function save() {
                    //TODO: Show message if name empty
                    if (!searchName.value()) {
                        console.log('missing search name');
                        return;
                    }

                    console.log('Update Store.user().Settings.searches');

                    // Disable button
                    saveSearchBtn.get().disabled = true;
                    saveSearchBtn.get().innerHTML = /*html*/ `
                        <span class='spinner-border' role='status' aria-hidden='true' style='width: 20px; height: 20px; border-width: 3px'></span> Saving search
                    `;

                    // Get rows
                    const rows = [...component.findAll('.search-container .search-row')].map(row => {
                        // Column
                        const column = row.querySelector('[data-field="column"]').value;

                        // Condition
                        const condition = row.querySelector('[data-field="condition"]').value;

                        // Value
                        const value = row.querySelector('[data-field="value"]').value;

                        // Operator
                        const operator = row.querySelector('[data-field="operator"]')?.value || null;

                        return {
                            column,
                            condition,
                            value,
                            operator
                        }
                    });

                    if (searches.map(search => search.name).includes(searchName.value())) {
                        console.log('update existing search')
                        // Update existing search
                        searches.find(item => item.name === searchName.value()).filters = filters;

                        console.log(searches);
                    } else {
                        console.log('add new search')
                        // Add search
                        searches.push({
                            name: searchName.value(),
                            filters: rows
                        });

                        console.log(searches);
                    }

                    // Replace user Settings[list].searches
                    userSettings.searches[list] = searches;
                    const Settings = JSON.stringify(userSettings);
                    Store.user().Settings = Settings;

                    await UpdateItem({
                        itemId: Store.user().Id,
                        list: 'Users',
                        data: {
                            Settings
                        }
                    });

                    // Update saved search menu
                    component.find('.saved-search-menu').innerHTML = searches.map(search => {
                        const { name } = search;

                        return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                    }).join('\n');

                    // Add event listeners
                    component.findAll('.saved-search-menu .load-search').forEach(btn => btn.addEventListener('click', loadSearch));

                    modal.close();
                }

                let pathExists;

                // Show message if path already exists
                function showMessage(value) {
                    if (searches.map(search => search.name).includes(value)) {
                        // Show message
                        if (!pathExists) {
                            pathExists = Alert({
                                type: 'danger',
                                text: `Saved search with name <strong>${value}</strong> already exists`,
                                classes: ['alert-in', 'w-100'],
                                top: searchName.get().offsetHeight + 5,
                                parent: searchName
                            });

                            pathExists.add();
                        }
                    } else {
                        // Remove message
                        if (pathExists) {
                            pathExists.remove();
                            pathExists = null;
                        }
                    }
                }

                // Check if all fields are filled out and path doesn't already exist
                function canEnable() {
                    if ( searchName.value() !== '' && !searches.map(search => search.name).includes(searchName.value()) ) {
                        saveSearchBtn.enable();
                    } else {
                        saveSearchBtn.disable();
                    }
                }

                // FIXME: Experimental. Not sure if this will work everytime.
                setTimeout(() => {
                    searchName.focus();
                }, 500);
            },
            centered: true,
            showFooter: false,
        });

        modal.add();
    }

    function deleteSearch(event) {
        const modal = Modal({
            title: false,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Delete <strong>${loaded}</strong>?</h4>
                `);

                const deleteSearchBtn = Button({
                    async action() {
                        console.log('Update Store.user().Settings.searches');
    
                        // Disable button
                        deleteSearchBtn.get().disabled = true;
                        deleteSearchBtn.get().innerHTML = /*html*/ `
                            <span class="spinner-border" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 3px"></span> Deleting search
                        `;
    
                        // Find loaaded search by name and remove from searches
                        const searchToDelete = searches.find(search => search.name === loaded);
                        searches.splice(searches.indexOf(searchToDelete), 1);

                        // Replace user Settings[list].searches
                        userSettings.searches[list] = searches;
                        const Settings = JSON.stringify(userSettings);
                        Store.user().Settings = Settings
    
                        await UpdateItem({
                            itemId: Store.user().Id,
                            list: 'Users',
                            data: {
                                Settings
                            }
                        });
    
                        // Update saved search menu
                        component.find('.saved-search-menu').innerHTML = searches.map(search => {
                            const { name } = search;
    
                            return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                        }).join('\n');
    
                        // Add event listeners
                        component.findAll('.saved-search-menu .load-search').forEach(btn => btn.addEventListener('click', loadSearch));

                        // Reset menu
                        newSearch();
    
                        modal.close();
                    },
                    classes: ['w-100 mt-3'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Delete'
                });

                deleteSearchBtn.add();

                const cancelBtn = Button({
                    action(event) {
                        console.log('Cancel delete search');

                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Cancel'
                });

                cancelBtn.add();
            },
            centered: true,
            showFooter: false,
        });

        modal.add();
    }

    function newSearch() {
        // Reset loaded
        loaded = null;

        // Remove rows
        component.findAll('.search-container .search-row').forEach(row => row.remove());

        // Remove loaded search buttons
        component.find('.edit-search-container')?.remove();

        // Row id
        const newId = GenerateUUID();
        
        // Add row
        component.find('.search-container').style.height = `123px`;
        component.find('.run-search-container').insertAdjacentHTML('beforebegin', searchRow(newId));
        component.find(`.search-row[data-rowid='${newId}'] .add-row`).addEventListener('click', addRow);
    }

    function addRow(event) {
        // Id
        const id = event.target.closest('.search-row').dataset.rowid;

        // Button clicked
        const button = component.find(`.search-row[data-rowid='${id}'] .add-row`);

        // Add ADD/OR select
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <select class="custom-select ml-2 w-auto" style='border-radius: 10px; font-size: 13px;' data-field='operator'>
                <option value='AND'>AND</option>
                <option value='OR'>OR</option>
            </select>
        `);

        // Next row id
        const newId = GenerateUUID();

        // Add removeRow button
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <button type="button" class="btn btn-robi p-1 ml-2 remove-row">
                <svg class="icon" style="font-size: 22px; fill: var(--primary)"><use href="#icon-bs-dash-circle-fill"></use></svg>
            </button>
        `);
        component.find(`.search-row[data-rowid='${id}'] .remove-row`).addEventListener('click', () => removeRow(id, newId));

        // Remove addRow button
        button.remove();

        // Add row
        component.find('.search-container').style.height = `${component.find('.search-container').getBoundingClientRect().height + 41.5}px`;
        component.find('.run-search-container').insertAdjacentHTML('beforebegin', searchRow(newId));
        component.find(`.search-row[data-rowid='${newId}'] .add-row`).addEventListener('click', addRow);
    }
    
    function removeRow(btnRowId, removeRowId) {
        // Adjust height
        component.find('.search-container').style.height = `${component.find('.search-container').getBoundingClientRect().height - 41.5}px`;
        
        // Remove next row
        component.find(`.search-row[data-rowid='${removeRowId}']`).remove();

        // Remove operator
        component.find(`.search-row[data-rowid='${btnRowId}'] [data-field='operator']`).remove();

        // Add addRow button
        const button = component.find(`.search-row[data-rowid='${btnRowId}'] .remove-row`);
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <button type="button" class="btn btn-robi p-1 ml-2 add-row">
                <svg class="icon" style="font-size: 22px; fill: var(--primary)"><use href="#icon-bs-plus"></use></svg>
            </button>
        `);
        component.find(`.search-row[data-rowid='${btnRowId}'] .add-row`).addEventListener('click', addRow);

        // Remove removeRow button
        button.remove();
    }

    function searchRow(id) {
        return /*html*/ `
            <!-- Row -->
            <div class='d-flex mb-2 search-row' data-rowid='${id}'>
                <!-- Column -->
                <div class="input-group mr-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Column</div>
                    </div>
                    <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='column'>
                        ${
                            listInfo.fields
                            .sort((a, b) => a.display - b.display)
                            .map(field => {
                                const { display, name } = field;
                                return /*html*/ `<option value='${name}'>${display || name}</option>`;
                            }).join('\n')
                        }
                    </select>
                </div>
                <!-- Condition -->
                <div class="input-group mr-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Condition</div>
                    </div>
                    <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='condition'>
                        <option value='contains'>contains</option>
                        <option value='equals'>equals</option>
                        <option value='not equal to'>not equal to</option>
                    </select>
                </div>
                <!-- Value -->
                <input type="text" class="form-control w-auto" style='flex: 2;' placeholder="value" data-field='value'>
                <!-- Add row -->
                <button type='button' class='btn btn-robi p-1 ml-2 add-row'>
                    <svg class="icon" style="font-size: 22px; fill: var(--primary);"><use href="#icon-bs-plus"></use></svg>
                </button>
            </div>
        `;
    }

    function loadSearch(event) {
        const searchName = event.target.innerText;
        const filters = searches.find(search => search.name == searchName)?.filters;

        // Set loaded
        loaded = searchName;

        // Set height
        // base height + (row height * number of rows ) 
        const height = 81.5 + (41.5 * filters.length);
        component.find('.search-container').style.height = `${height}px`;

        // Empty search
        component.findAll('.search-row').forEach(row => row.remove());

        // Add buttons
        const editSearchContainer = component.find('.edit-search-container');

        if (!editSearchContainer) {
            component.find('.load-search-container').insertAdjacentHTML('beforeend', /*html*/ `
                <!-- Buttons -->
                <div class='d-flex justify-content-end edit-search-container'>
                    <button type='button' class='btn btn-robi mr-2 delete-search'>
                        Delete
                    </button>
                    <div class='d-flex justify-content-end'>
                        <button type='button' class='btn btn-robi new-search'>New</button>
                    </div>
                </div>
            `);

            // Add event listerners
            component.find('.edit-search-container .delete-search').addEventListener('click', deleteSearch)
            component.find('.edit-search-container .new-search').addEventListener('click', newSearch)
        }

        // Add rows
        filters.forEach(row => {
            const { column, condition, value, operator } = row;
            const id = GenerateUUID();

            const html = /*html*/ `
                <!-- Row -->
                <div class='d-flex mb-2 search-row' data-rowid='${id}'>
                    <!-- Column -->
                    <div class="input-group mr-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Column</div>
                        </div>
                        <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='column'>
                            ${
                                listInfo.fields
                                .sort((a, b) => a.display - b.display)
                                .map(field => {
                                    const { display, name } = field;
                                    return /*html*/ `<option value='${name}'${name === column ? ' selected' : ''}>${display || name}</option>`;
                                }).join('\n')
                            }
                        </select>
                    </div>
                    <!-- Condition -->
                    <div class="input-group mr-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Condition</div>
                        </div>
                        <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='condition'>
                            <option value='contains'${'contains' === condition ? ' selected' : ''}>contains</option>
                            <option value='equals'${'equals' === condition ? ' selected' : ''}>equals</option>
                            <option value='not equal to'${'not equal to' === condition ? ' selected' : ''}>not equal to</option>
                        </select>
                    </div>
                    <!-- Value -->
                    <input type="text" class="form-control w-auto" style='flex: 2;' placeholder="value" value='${value}' data-field='value'>
                    <!-- Operator -->
                    ${
                        operator ?
                        /*html*/ `
                            <select class="custom-select ml-2 w-auto" style='border-radius: 10px; font-size: 13px;' data-field='operator'>
                                <option value='AND'${'AND' === operator ? ' selected' : ''}>AND</option>
                                <option value='OR'${'OR' === operator ? ' selected' : ''}>OR</option>
                            </select>
                        ` : ''
                    }
                    <!-- Add row -->
                    <button type='button' class='btn btn-robi p-1 ml-2 ${operator ? 'remove-row' : 'add-row'}'>
                        <svg class="icon" style="font-size: 22px; fill: var(--primary);"><use href="#icon-${operator ? 'bs-dash-circle-fill' : 'bs-plus'}"></use></svg>
                    </button>
                </div>
            `
            component.find('.run-search-container').insertAdjacentHTML('beforebegin', html);

            // Add event listeners
            if (operator) {
                component.find(`.search-row[data-rowid='${id}'] .remove-row`).addEventListener('click', () => removeRow(id));
            } else {
                component.find(`.search-row[data-rowid='${id}'] .add-row`).addEventListener('click', addRow);
            }

            component.find(`.search-row[data-rowid='${id}'] input[data-field='value']`).addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();

                    runSearch(event);
                }
            });
        });
    }

    function runSearch(button) {
        const filters = [...component.findAll('.search-container .search-row')].map(row => {
            // Column
            const column = row.querySelector('[data-field="column"]').value;

            // Condition
            const condition = row.querySelector('[data-field="condition"]').value;

            // Value
            const value = row.querySelector('[data-field="value"]').value;

            // Operator
            const operator = row.querySelector('[data-field="operator"]')?.value || null;

            // Type
            const type = listInfo.fields.find(field => field.name === column)?.type

            return {
                column,
                condition,
                value,
                operator,
                type
            }
        });

        search({
            button,
            filters
        });
    }

    function buildFilters() {
        return options.map((option, index) => {
            const { label } = option;
            return /*html*/ `
                <button type='button' class='btn ${index === 0 ? 'btn-robi-reverse' : 'btn-outline-robi-primary'} filter'>${label}</button>
            `;
        }).join('\n');
    }

    return component;
}

/**
 * https://sean.is/poppin/tags
 * 
 * @param {*} param
 * @returns
 */
export function TaggleField(param) {
    const {
        label, description, fieldMargin, maxWidth, tags, onTagAdd, onTagRemove, parent, position,
    } = param;

    let taggle;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='taggle-container'></div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .taggle-container {
                position: relative;
                width: 100%;
                border-radius: 10px;
                border: 1px solid var(--border-color);
                padding: 10px;
            }

            #id .taggle .close {
                text-shadow: none;
            }

            /* Modified from: https://jsfiddle.net/okcoker/aqnspdtr/8/ */
            .taggle_list {
                float: left;
                padding: 0;
                margin: 0;
                width: 100%;
                display: flex;
            }
            
            .taggle_input {
                border: none;
                outline: none;
                background: none;
                font-size: 13px;
                font-weight: 400;
                padding: 5px 10px;
            }
            
            .taggle_list li {
                display: inline-block;
                white-space: nowrap;
                font-weight: 500;
                height: 29.5px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .taggle_list .taggle {
                font-size: 13px;
                margin-right: 8px;
                background: #E2E1DF;
                padding: 5px 10px;
                border-radius: 3px;
                position: relative;
                cursor: pointer;
                transition: all .3s;
                -webkit-animation-duration: 1s;
                animation-duration: 1s;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
                min-width: 60px;
                border-radius: 10px;
                text-align: center;
            }
            
            .taggle_list .taggle_hot {
                background: #cac8c4;
            }
            
            .taggle_list .taggle .close {
                font-size: 1.1rem;
                position: absolute;
                top: 10px;
                right: 3px;
                text-decoration: none;
                padding: 0;
                line-height: 0.5;
                color: #24292f;
                padding-bottom: 4px;
                display: none;
                border: 0;
                background: none;
                cursor: pointer;
            }
            
            .taggle_list .taggle:hover {
                padding: 5px;
                padding-right: 15px;
                background: #ccc;
                transition: all .3s;
            }
            
            .taggle_list .taggle:hover > .close {
                display: block;
            }
            
            .taggle_placeholder {
                font-size: 13px;
                position: absolute;
                color: #CCC;
                top: 15px;
                left: 8px;
                transition: opacity, .25s;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            .taggle_sizer {
                padding: 0;
                margin: 0;
                position: absolute;
                top: -500px;
                z-index: -1;
                visibility: hidden;
            }
        `,
        parent,
        position,
        events: [],
        onAdd() {
            // Initialize Taggle
            taggle = new Taggle(component.find('.taggle-container'), {
                placeholder: 'Type then press enter to add tag',
                tags: tags ? tags.split(',') : [],
                duplicateTagClass: 'bounce',
                onTagAdd,
                onTagRemove
            });
        }
    });

    component.value = () => {
        return taggle.getTagValues().join(', ');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function TasksList(param) {
    const {
        label, labelWeight, labelSize, options, onCheck, direction, wrap, parent, width, position, margin, padding, fieldMargin, onAddNewItem, onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<div class='form-field-label'>${label}</div>` : ''}
                ${createChoiceGroups()}
            </div>   
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id .form-field-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding: 5px 0px;
            }

            #id .form-field-multi-select-container {
                display: flex;
                flex-direction: ${direction || 'column'};
                flex-wrap: ${wrap || 'wrap'};
                user-select: none;
                padding: ${padding || '0px 0px 20px 0px'};
                margin: ${margin || '0px'};
            }

            #id .form-field-multi-select-row {
                /* width: ${width || '100%'}; */
                width: ${width || 'unset'};
                display: flex;
                flex-direction: row;
            }

            #id .form-field-multi-select-row:first-child {
                margin-top: 5px;
            }

            #id .form-field-multi-select-row:not(:last-child) {
                margin-bottom: 15px;
            }

            #id .form-field-multi-select-row.flex-start {
                align-items: flex-start;
            }

            #id .form-field-multi-select-row.flex-start .form-field-multi-select-value,
            #id .form-field-multi-select-row.flex-start .select-all-title {
                margin-top: 2px;
            }

            ${direction === 'row' ?
            /*css*/ `
                    #id .form-field-multi-select-row {
                        margin-left: 20px;
                        margin-bottom: 10px;
                    }
                ` :
                ''}

            #id .form-field-multi-select-value,
            #id .select-all-title {
                white-space: nowrap;
                margin-left: 5px;
                padding: 0px;
                font-size: 1em;
                border: none;
                outline: none;
            }

            #id .select-all-title {
                color: var(--primary);
                font-weight: 500;
                padding: 5px 0px;
            }

            /** Checkboxes */
            #id label {
                margin-bottom: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #id input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            #id input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                background: white;
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            #id input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }

            #id input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }

            /** Add an item */
            #id .add-an-item {
                background: transparent;
                border-bottom: solid 2px gray;
                width: 100%;
                min-width: 100px;
            }

            #id .add-an-item:focus,
            #id .add-an-item:active {
                border-bottom: solid 2px var(--primary);
            }

            /** Placeholder */
            /** {@link https://stackoverflow.com/a/61659129} */
            #id [contenteditable=true]:empty:before{
                content: attr(placeholder);
                pointer-events: none;
                /* display: block; */ /* For Firefox */
            }

            /** Delete task */
            #id .delete-task {
                margin-left: 10px;
                color: firebrick;
                cursor: pointer;
                display: none;
                font-size: 1.5em;
                line-height: .75;
            }

            #id .form-field-multi-select-row:hover > .delete-task {
                display: inline;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id  input.select-all',
                event: 'change',
                listener: selectAll
            },
            {
                selector: '#id input:not(.select-all)',
                event: 'change',
                listener: toggleSelectALL
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'keypress',
                listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        /** Runtime */
                        if (onAddNewItem) {
                            onAddNewItem(event);
                        }

                        return false;
                    }
                }
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'focusout',
                listener: onAddNewItem
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'paste',
                /** {@link https://stackoverflow.com/a/12028136} */
                listener(e) {
                    // cancel paste
                    e.preventDefault();

                    // get text representation of clipboard
                    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

                    // insert text manually
                    document.execCommand("insertHTML", false, text);
                }
            },
            {
                selector: '#id .delete-task',
                event: 'click',
                listener(event) {
                    event.target.closest('.form-field-multi-select-row ').remove();

                    onDelete(event.target.dataset.itemid);
                }
            }
        ]
    });

    function createChoiceGroups() {
        let html = '';

        options.forEach(group => {
            const {
                title, items, align
            } = group;

            html += /*html*/ `
                <div class='form-field-multi-select-container' data-group='${title}'>
            `;

            if (title !== '') {
                html += /*html*/ `
                    <div class='form-field-multi-select-row ${align}'>
                        <label>
                            <input type='checkbox' class='select-all' data-group='${title}'>
                            <span class='toggle'></span>
                        </label>
                        <span class='select-all-title'>${title}</span>
                    </div>
                `;
            }

            items.forEach(item => {
                html += rowTemplate(item, title, align);
            });

            html += /*html*/ `
                    <div class='form-field-multi-select-row'>
                        <label>
                            <input type='checkbox' disabled>
                            <span class='toggle'></span>
                        </label>
                        <!-- <input type='text' class='form-field-multi-select-value add-an-item' placeholder='Add an item'> -->
                        <div class='form-field-multi-select-value add-an-item' placeholder='Add an item' contenteditable='true'></div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function rowTemplate(item, group, align) {
        const {
            id, value, checked, CompletedBy, Completed
        } = item;

        // console.log(id, CompletedBy);
        return /*html*/ `
            <div class='form-field-multi-select-row ${align ? align : ''}'>
                <label>
                    <input type='checkbox' data-group='${group}' data-itemid='${id}'${checked ? ' checked' : ''}>
                    <span class='toggle'></span>
                </label>
                <span class='form-field-multi-select-value'>${value}</span>
                <span class='delete-task' data-itemid='${id}'>&times;</span>
                <!-- If Completed, show name -->
                <!-- <span class="assigned-name" data-account="stephen.matheis"></span> -->
            </div>
        `;
    }

    /** Select all Radio buttons in group */
    function selectAll(event) {
        const group = this.dataset.group;
        const state = this.checked;
        const radioButtons = component.findAll(`input[data-group='${group}']`);

        radioButtons.forEach(button => {
            button.checked = state;
        });
    }

    /** Auto toggle Group Title Radio button */
    function toggleSelectALL(event) {
        const group = this.dataset.group;
        const all = component.findAll(`input[data-group='${group}']:not(.select-all)`).length;
        const checked = component.findAll(`input[data-group='${group}']:not(.select-all):checked`).length;
        const state = all === checked ? true : false;

        const selectAll = component.find(`input.select-all[data-group='${group}']`);

        if (selectAll) {
            selectAll.checked = state;
        }

        if (onCheck) {
            onCheck(event);
        }
    }

    component.setValue = (itemId, value) => {
        const checkbox = component.find(`input[data-itemid='${itemId}']`);

        if (checkbox) {
            checkbox.checked = value;
        }
    };

    component.addOption = (param) => {
        const {
            option, group
        } = param;

        const container = component.find(`.form-field-multi-select-container[data-group='${group}']`);

        container.insertAdjacentHTML('beforeend', rowTemplate(option, group, true));

        const node = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (node) {
            node.addEventListener('change', toggleSelectALL);
        }
    };

    component.addItemAbove = (param) => {
        const {
            group, itemToAdd, item
        } = param;

        const row = item.closest('.form-field-multi-select-row');

        row.insertAdjacentHTML('beforebegin', rowTemplate(itemToAdd, group, true));

        const newCheckbox = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (newCheckbox) {
            newCheckbox.addEventListener('change', toggleSelectALL);
        }

        const newDelete = component.find(`.delete-task[data-itemid='${itemToAdd.id}']`);

        if (newDelete) {
            newDelete.addEventListener('click', event => {
                event.target.closest('.form-field-multi-select-row ').remove();

                onDelete(event.target.dataset.itemid);
            });
        }

        item.innerText = '';
    };

    component.value = (type) => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            if (type === 'id') {
                return parseInt(item.dataset.itemid);
            } else {
                const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value');

                return value.innerText;
            }
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Textarea(param) {
    const {
        addon,
        background,
        borderRadius,
        classes,
        description,
        fieldMargin,
        flex,
        fontSize,
        label,
        margin,
        maxWidth,
        onFocusout,
        onKeydown,
        onKeypress,
        onKeyup,
        padding,
        parent,
        placeholder,
        position,
        readOnly,
        rows,
        value,
        width
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    addon ?
                    /*html*/ `
                        <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>${addon}</div>
                            </div>
                            ${Field()}
                        </div>    
                    ` :
                    /*html*/ `
                        ${Field()}
                    `
                }
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            ${
                readOnly ?
                /*css*/ `
                    #id label {
                        margin-bottom: 0px;
                        font-weight: 500;
                    }
                ` :
                /*css*/ `
                    #id label {
                        font-weight: 500;
                    }
                `
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .text-field {
                width: ${width || 'unset'};
                font-size: ${fontSize || '13px'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .text-field.readonly {
                font-size: 13px;
                font-weight: 400;
                color: var(--color); 
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                padding: 0px;
            }

            #id .input-group-text {
                align-items: start;
            }

            #id textarea {
                min-height: 33.5px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-control',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-control',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id .form-control',
                event: 'keypress',
                listener: onKeypress
            },
            {
                selector: '#id .form-control',
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    // NOTE: Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work
    function Field() {
        return readOnly ?
        /*html*/ `
            <div type='text' class='text-field readonly'>${value || ''}</div>
        ` :
        /*html*/ `
            <textarea rows='${rows || '1'}' class="form-control" list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>${value || ''}</textarea>
        `;
    }

    component.focus = () => {
        const field = component.find('.form-control');

        field?.focus();
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };
    
    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ThemeField(param) {
    const {
        label, margin, parent, position, selected
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${label !== false ? /*html*/ `<label>Theme</label>` : ''}
                <div class='themes'>
                    ${Themes.map(theme => containerTemplate({theme, mode: App.get('prefersColorScheme')})).join('\n')}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id .themes {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                max-width: 995px;
            }

            #id label {
                font-weight: 500;
            }

            #id .theme-app {
                cursor: pointer;
                display: flex;
                height: 150px;
                width: 200px;
                border-radius: 10px;
            }

            #id .theme-app.selected {
                box-shadow: 0px 0px 0px 3px mediumseagreen;
            }

            #id .theme-app.current {
                box-shadow: 0px 0px 0px 3px var(--primary);
            }

            #id .theme-sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                border-radius: 10px 0px 0px 10px;
                flex: 1;
            }

            #id .theme-sidebar-title {
                margin: 8px 4px 0px 4px;
                padding: 0px 8px;
                font-weight: 700;
                font-size: 13px;
            }

            #id .theme-nav {
                margin: 0px 4px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 11px;
                white-space: nowrap;
            }

            #id .theme-nav.selected {
                margin: 4px 4px 0px 4px;
            }

            #id .theme-maincontainer {
                display: flex;
                flex-direction: column;
                flex: 2;
                border-radius: 0px 10px 10px 0px;
                padding: 8px;
            }

            #id .theme-title {
                font-weight: 700;
                font-size: 13px;
                margin-bottom: 8px;
            }

            #id .theme-maincontainer .btn {
                font-size: 10.25px;
                padding: 6px 9px;
            }

            #id .theme-maincontainer .background {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                border-radius: 10px;
                margin-top: 8px;
                font-size: 14px;
                font-weight: 500;                
            }

            /* Toggle - https://codepen.io/mrozilla/pen/OJJNjRb */
            .toggle {
                --size: 20px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                outline: none;
                border: none;
                cursor: pointer;
                width: var(--size);
                height: var(--size);
                box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
                border-radius: 999px;
                transition: all 200ms;
                z-index: 1;
                color: #54595f;
            }

            .toggle:checked {
                --ray-size: calc(var(--size) * -0.4);
                --offset-orthogonal: calc(var(--size) * 0.65);
                --offset-diagonal: calc(var(--size) * 0.45);
                color: #ced4da;
                transform: scale(0.75);
                box-shadow: inset 0 0 0 var(--size), calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size), var(--offset-orthogonal) 0 0 var(--ray-size), 0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size), 0 var(--offset-orthogonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size), var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size), var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
            }

            .mode-text {
                font-size: 14px;
                font-weight: 500;
                width: 33px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .theme-app',
                event: 'click',
                listener: selectTheme
            },
            {
                selector: '#id .toggle',
                event: 'change',
                listener(event) {
                    const toggleid = event.target.id;
                    const mode = event.target.checked ? 'light' : 'dark';
                    const name = toggleid.split('-')[1];
                    const theme = Themes.find(item => item.name === name);
                    const isSelected = component.find(`.theme-app[data-theme='${name}']`).classList.contains('selected');

                    component.find(`.mode-text[data-toggleid='${toggleid}']`).innerText = mode.toTitleCase();
                    component.find(`.theme-app[data-theme='${name}']`).remove();
                    component.find(`.theme-app-container[data-theme='${name}']`).insertAdjacentHTML('afterbegin', themeTemplate({ theme, mode }));
                    component.find(`.theme-app[data-theme='${name}']`).addEventListener('click', selectTheme);
                    
                    if (isSelected) {
                        component.find(`.theme-app[data-theme='${name}']`).classList.add('selected');
                    }
                }
            }
        ]
    });

    function selectTheme() {
        // Deselect all
        component.findAll('.theme-app').forEach(node => {
            node.classList.remove('selected');
        });
        
        // Select
        this.classList.add('selected');
    }

    function containerTemplate({theme, mode}) {
        const { name } = theme;

        return /*html*/ `
            <div class='theme-app-container d-flex flex-column justify-content-center align-items-center mb-4' data-theme='${name}'>
                ${themeTemplate({theme, mode})}
                <!-- Toggle Light/Dark Mode -->
                <div class='d-flex justify-content-center align-items-center'>
                    <div class="mode mt-2 mr-2">
                        <label style='display: none;' title='Hidden checkbox to toggle dark/light mode' for="toggle-${name}"></label>
                        <input id="toggle-${name}" class="toggle" type="checkbox" ${mode === 'light' ? 'checked' : ''}>
                    </div>
                    <div class='mode-text' data-toggleid="toggle-${name}">${mode === 'light' ? 'Light' : 'Dark'}</div>
                </div>
            </div>
        `
    }

    function themeTemplate({theme, mode}) {
        const { name } = theme;
        const { primary, secondary, background, color, borderColor, buttonBackgroundColor } = theme[mode];

        return /*html*/ `
            <div class='theme-app ${name === selected ? 'current' : ''}' style='color: ${color}; border: solid 1px ${borderColor}' data-theme='${name}'>
                <div class='theme-sidebar' style='background: ${background}; border-right: solid 1px ${borderColor};'>
                    <div class='theme-sidebar-title'>Title</div>
                    <div class='theme-nav selected' style='background: ${primary}; color: white;'>Route 1</div>
                    <div class='theme-nav'>Route 2</div>
                    <div class='theme-nav'>Route 3</div>
                </div>
                <div class='theme-maincontainer' style='background: ${secondary};'>
                    <div class='theme-title'>${name}</div>
                    <div>
                        <div class="btn" style='background: ${buttonBackgroundColor}; color: ${primary}'>Button</div>
                        <div class="btn" style='background: ${primary}; color: ${secondary}'>Button</div>
                    </div>
                    <div class='background' style='background: ${background}'>
                        Aa
                    </div>
                </div>
            </div>
        `;
    }

    // TODO: Set value
    component.value = () => {
        return component.find('.theme-app.selected')?.dataset.theme;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Timer(param) {
    const {
        parent, start, classes, stop, reset, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='timer ${classes?.join(' ')}'>
                <h5 class='mb-0'>Run action</h5>
                <div class='stopwatch' id='stopwatch'>00:00:00</div>
                <button class='btn btn-robi-success start'>Start</button>
                <button class='btn btn-robi stop'>Stop</button>
                <button class='btn btn-robi-light reset'>Reset</button>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 20px;
                border-radius: 20px;
                background: var(--background)
            }
            
            .stopwatch {
                margin: 20px 0px;
                font-size: 1.5em;
                font-weight: bold;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .start`,
                event: 'click',
                listener(event) {
                    component.start();
                }
            },
            {
                selector: `#id .stop`,
                event: 'click',
                listener(event) {
                    component.stop();
                }
            },
            {
                selector: `#id .reset`,
                event: 'click',
                listener(event) {
                    component.reset();
                }
            }
        ]
    });

    let time;
    let ms = 0;
    let sec = 0;
    let min = 0;

    function timer() {
        ms++;

        if (ms >= 100) {
            sec++;
            ms = 0;
        }

        if (sec === 60) {
            min++;
            sec = 0;
        }

        if (min === 60) {
            ms, sec, min = 0;
        }

        let newMs = ms < 10 ? `0${ms}` : ms;
        let newSec = sec < 10 ? `0${sec}` : sec;
        let newMin = min < 10 ? `0${min}` : min;

        component.find('.stopwatch').innerHTML = `${newMin}:${newSec}:${newMs}`;
    };

    component.start = () => {
        time = setInterval(timer, 10);

        if (start) {
            start();
        }
    };

    component.stop = () => {
        clearInterval(time);

        if (stop) {
            stop();
        }
    };

    component.reset = () => {
        ms = 0;
        sec = 0;
        min = 0;

        component.find('.stopwatch').innerHTML = '00:00:00';

        if (reset) {
            reset();
        }
    };

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Title(param) {
    const {
        back,
        title,
        width,
        subTitle,
        subTitleColor,
        breadcrumb,
        dropdownGroups,
        maxTextWidth,
        route,
        padding,
        margin,
        parent,
        position,
        action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='title across'>
                <div class='title-subtitle'>
                    ${
                        back ? 
                        /*html*/ `
                            <div class='d-flex justify-content-center align-items-center' style='width: 62px; height: 35.59px; position: absolute; left: -62px; cursor: pointer;'>
                                <div class='d-flex justify-content-center align-items-center back-btn' style='' title='Back'>
                                    <svg class='icon' style='fill: var(--primary); font-size: 26px;'>
                                        <use href='#icon-bs-arrow-left-cirlce-fill'></use>
                                    </svg>
                                </div>
                            </div>
                        ` : ''
                    }
                    <h1 class='app-title'>${title}</h1>
                    <!-- ${subTitle !== undefined ? `<h2>${subTitle}</h2>` : ''} -->
                    ${subTitle ? /*html*/`<h2>${subTitle}</h2>` : ''}
                    ${breadcrumb !== undefined ?
                    /*html*/ `
                        <h2 ${dropdownGroups && dropdownGroups.length ? `style='margin-right: 0px;'` : ''}>
                            ${buildBreadcrumb(breadcrumb)}
                            ${dropdownGroups && dropdownGroups.length ? `<span class='_breadcrumb-spacer'>/</span>` : ''}
                            ${dropdownGroups && dropdownGroups.length ?
                            /*html*/ `
                                ${buildDropdown(dropdownGroups)}
                            ` :
                            ''}
                        </h2>
                    ` :
                    ''}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
                ${width ? `width: ${width};` : ''}
            }

            #id .title-subtitle {
                width: 100%;
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: baseline;
            }

            #id.title h1 {
                font-size: 1.75rem;
                font-weight: 700;
                margin-top: 0px;
                margin-bottom: 10px;
                cursor: ${action ? 'pointer' : 'auto'};
            }

            #id.title h2 {
                width: 100%;
                font-size: 18px;
                font-weight: 500;
                margin: 0px;
                color: ${subTitleColor || 'var(--color)'};
            }

            #id.title .title-date {
                font-size: 13px;
                font-weight: 500;
                /* color: var(--primary); */
                color: #70767c;
                margin: 0px;
            }

            #id.title .title-date * {
                /* color: var(--primary); */
                color: #70767c;
            }

            #id.across {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: baseline;
                /* flex-wrap: wrap; */
                white-space: nowrap;
            }

            #id.across h2 {
                margin-left: 20px;
            }

            /* a, spacer */
            #id a:not(.alert-link),
            #id ._breadcrumb-spacer,
            #id ._breadcrumb {
                color: var(--primary)
            }

            /** Breadcrumb */
            #id ._breadcrumb {
                color: darkslategray;
            }

            #id .route {
                cursor: pointer;
                color: var(--primary);
            }

            #id .current-page {
                color: darkslategray;
            }

            /** Dropdown */
            #id .dropdown-menu {
                max-height: 75vh;
                overflow-y: auto;
            }

            #id .dropdown-item {
                cursor: pointer;
                font-size: 14px;
            }

            #id .nav {
                display: inline-flex;
            }

            #id .nav-link {
                padding: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: max-content;
                font-size: inherit;
                line-height: normal;
                border: none;
            }

            #id .nav-pills .show > .nav-link {
                color: var(--primary);
                background-color: initial;
            }

            #id .no-menu [role=button] {
                cursor: initial;
            }

            #id .no-menu .dropdown-toggle,
            #id .no-menu .nav-pills .show > .nav-link {
                color: var(--primary);
            }

            #id .no-menu .dropdown-toggle::after {
                display: none;
            }

            #id .no-menu .dropdown-menu {
                display: none;
            }

            @media (max-width: 1024px) {
                #id .nav-link {
                    max-width: 200px;
                }
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .route',
                event: 'click',
                listener: goToRoute
            },
            {
                selector: '#id .app-title',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: '#id .back-btn',
                event: 'click',
                listener(event) {
                    history.back();
                }
            }
        ]
    });

    function buildBreadcrumb(breadcrumb) {
        if (!Array.isArray(breadcrumb)) {
            return '';
        }

        return breadcrumb.map(part => {
            const {
                label, path, currentPage
            } = part;

            return /*html*/ `
                <span class='_breadcrumb ${currentPage ? 'current-page' : 'route'}' data-path='${path}'>${label}</span>
            `;
        }).join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function buildDropdown(dropdownGroups) {
        return dropdownGroups
            .map(dropdown => dropdownTemplate(dropdown))
            .join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function dropdownTemplate(dropdown) {
        const {
            name, dataName, items
        } = dropdown;

        let html = /*html*/ `
            <span data-name='${dataName || name}' class='${items.length === 0 ? 'no-menu' : ''}'>
                <ul class='nav nav-pills'>
                    <li class='nav-item dropdown'>
                        <a class='nav-link dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>${name}</a>
                        <div class='dropdown-menu'>
        `;

        items.forEach(part => {
            const {
                label, path
            } = part;

            html += /*html*/ `
                <span class='dropdown-item route' data-path='${path}'>${label}</span>
            `;
        });

        html += /*html*/ `
                        </div>
                    </li>
                </ul>
            </span>
        `;

        return html;
    }

    function goToRoute(event) {
        if (route) {
            console.log(event.target.dataset.path);

            route(event.target.dataset.path);
        }
    }

    /** Only works if dropdown already exists */
    component.updateDropdown = (param) => {
        const {
            name, replaceWith
        } = param;

        const node = component.find(`span[data-name='${name}']`);

        if (node) {
            node.insertAdjacentHTML('afterend', dropdownTemplate(replaceWith));

            component.findAll(`span[data-name='${replaceWith.dataName || replaceWith.name}'] .route`).forEach(route => {
                route.addEventListener('click', goToRoute);
            });

            node.remove();
        }
    };

    component.setTitle = (text) => {
        const title = component.find('h1');

        title.innerHTML = text;
    };

    component.setSubtitle = (text) => {
        const title = component.find('h2');

        if (title) {
            title.innerHTML = text;
        } else {
            component.find('.app-title').insertAdjacentHTML('afterend', /*html*/ `
                <h2>${text}</h2>
            `);
        }

    };

    component.setDate = (text) => {
        const title = component.find('.title-date');

        title.innerHTML = text;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Toast(param) {
    const {
        text, type, delay, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='notification ${type || 'information'}'>
                <div>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id.notification {
                position: fixed;
                z-index: 10000;
                top: 20px;
                right: 5px;
                font-size: 1em;
                padding: 10px 20px;
                max-width: 350px;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
                border-radius: 4px;
                animation: slidein 500ms ease-in-out forwards, slidein 500ms ease-in-out ${delay || '5s'} reverse forwards;
            }

            #id.bs-toast {
                background-color: rgba(255,255,255);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.bs-toast-light {
                background-color: rgba(255,255,255,.85);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.success {
                color: white;
                background: mediumseagreen;
            }

            #id.information {
                background: mediumseagreen;
            }

            #id.error {
                background: crimson;
            }

            #id.notification:not(.bs-toast) * {
                color: white;
            }

            #id .dismiss {
                font-size: 1.2em;
                position: absolute;
                top: 3px;
                right: 3px;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }
        `,
        position,
        parent,
        events: [],
        onAdd() {
            setTimeout(() => {
                component.remove();
            }, delay || 6000);

            const allToasts = Store.get('maincontainer').findAll('.notification');

            if (allToasts.length > 1) {
                component.get().style.top = `${allToasts[allToasts.length - 1].getBoundingClientRect().height + 40}px`;
            }

            console.log(allToasts);
        }
    });

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Unauthorized({ parent }) {
    const alertBanner = Alert({
        type: 'robi-primary',
        text: `Sorry! You don't have access to that page.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 *
 * @param {*} param
 */
export function UpgradeAppButton(param) {
    const {
        parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='dev-console'>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Upgrade Robi</div>
                            <div class='dev-console-description'>Install the latest Robi build.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button upgrade'>Upgrade ${App.get('name')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 0px;
                width: 100%;
            }
            
            #id .alert {
                border: none;
                border-radius: 20px;
            }

            #id .dev-console-title {
                font-size: 1.5em;
                font-weight: 700;
                color: #24292f;
                margin-bottom: 10px;
            }

            #id .dev-console {
                width: 100%;
                /* padding: 40px; */
                /* border: solid 2px var(--primary); */
                border-radius: 20px;
                display: flex;
                flex-direction: column;
            }

            #id .dev-console-row {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
                border-radius: 20px;
                background: var(--background);
            }

            #id .dev-console-text {
                max-width: 700px;
            }

            #id .dev-console-label {
                font-weight: 600;
            }

            #id .dev-console-row:not(:last-child) {
                margin-bottom: 20px;
            }

            #id .dev-console-button {
                font-weight: 600;
                font-size: 14px;
                height: fit-content;
                border-radius: 10px;
                padding: 10px;
                width: 230px;
                border: none;
            }

            #id .btn-danger {
                background: firebrick;
            }

            #id .btn-success {
                background: seagreen;
            }

            #id .btn-secondary {
                background: white;
                color: firebrick;
            }

            #id .dev-console-button:focus,
            #id .dev-console-button:active {
                box-shadow: none;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .upgrade',
                event: 'click',
                async listener(event) {
                    console.log('Upgrade app');

                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        close: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Show loading
                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='alert alert-robi-primary mb-0'>
                                    Comming soon. Stay tuned!
                                </div>
                            `);
                        },
                        centered: true,
                        showFooter: false,
                    });

                    modal.add();
                }
            }
        ]
    });

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function UploadButton(param) {
    const {
        action, parent, position, margin, type, value
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <button type="button" class="btn ${type}">${value}</button>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || ''};
                display: inline-block;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;

                    if (files.length > 0) {
                        action(files);
                    }
                }
            }
        ]
    });

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ViewContainer(param) {
    const {
        parent
    } = param;

    // Collapse container height
    const padding = '62px';

    const component = Component({
        html: /*html*/ `
            <div class='viewcontainer'></div>
        `,
        style: /*css*/ `
            .viewcontainer {
                position: relative;
                padding: ${padding};
                height: 100vh;
                overflow: overlay;
            }

            .viewcontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        events: []
    });

    component.dim = (toggle) => {
        const viewContainer = component.get();

        if (toggle) {
            viewContainer.classList.add('dim');
        } else {
            viewContainer.classList.remove('dim');
        }
    };

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = padding;
    };

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    };

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    };
    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function ViewTools(param) {
    const {
        route,
        parent,
        position
    } = param;

    let isOpen = false;

    const component = Component({
        html: /*html*/ `
            <div class='viewtools'>
                <button class='btn tools' type='button'>•••</button>
                <div class='grow-in-center'>
                    <!-- Add Table -->
                    <button class='dropdown-item add-table' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 48px;'>
                                <use href='#icon-bs-table'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Table</div>
                    </button>
                    <!-- Add Chart -->
                    <button class='dropdown-item add-chart' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 48px;'>
                                <use href='#icon-bs-bar-chart'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Chart</div>
                    </button>
                    <!-- Add Text Block -->
                    <button class='dropdown-item add-text-block' type='button'>
                        <div class='icon-container'>
                            <span class='d-flex align-items-center justify-content center' style='font-size: 28; font-weight: 600; color: var(--primary);'>
                                <span>Aa</span>
                                <svg class='icon' style='font-size: 32px;'>
                                    <use href='#icon-bs-cursor-text'></use>
                                </svg>
                            </span>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Text block</div>
                    </button>
                    <!-- Add Light Button -->
                    <button class='dropdown-item add-button-light' type='button'>
                        <div class='icon-container '>
                            <div class='btn btn-robi'>Button</div>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Light</div>
                    </button>
                    <!-- Add Dark Button -->
                    <button class='dropdown-item add-button-dark' type='button'>
                        <div class='icon-container'>
                            <div class='btn btn-robi-reverse'>Button</div>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Dark</div>
                    </button>
                    <!-- Divider -->
                    <div class='dropdown-divider'></div>
                    <!-- Edit Layout -->
                    <button class='dropdown-item edit-layout' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-grid-1x2'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Layout</div>
                    </button>
                    <!-- Edit Source -->
                    <button class='dropdown-item edit-source' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-code'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Source</div>
                    </button>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                right: 0px;
                height: 62px;
                width: 100%;
                color: var(--primary);
            }

            #id .tools {
                cursor: pointer;
                color: var(--primary);
                font-size: 20px;
                transition: transform 300ms ease, background-color 250ms ease;
                padding: 6px 11.82px; /* sets button width to an even 50px */
            }

            #id .scale-up {
                transform: scale(2);
            }

            #id .menu {

            }

            #id .grow-in-center {
                z-index: 10000;
                top: 5px;
                position: absolute;

                transform: scale(0);
                transform-origin: top;
                opacity: 0;
                transition: transform 150ms ease, opacity 150ms ease;
            }

            #id .grow-in-center.open {
                transform: scale(1);
                transform-origin: top;
                opacity: 1;
            }

            #id .dropdown-divider {
                height: unset;
                margin: .5rem;
                overflow: hidden;
                border-left: 1px solid var(--border-color);
                border-top: none;
            }

            #id .dropdown-item {
                position: relative;
                display: flex;
                flex-direction: column;
                color: var(--primary);
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 20px;
                transition: filter 300ms ease, background-color 150ms ease;
            }

            #id .dropdown-item .icon {
                fill: var(--primary);
            }

            /* Border */
            #id .border {
                border: solid 2px var(--primary);
            }

            #id .icon-container {
                border-radius: 20px;
                padding: 10px;
                width: 90px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            #${parent.get().id} .save-edit-layout,
            #${parent.get().id} .cancel-edit-layout {
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                height: 62px;
                padding: 0px 15px;
                border-radius: 10px;
            }

            #${parent.get().id} .save-edit-layout {
                left: 0px;
            }

            #${parent.get().id} .cancel-edit-layout {
                right: 0px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .tools',
                event: 'click',
                listener(event) {
                    this.classList.add('scale-up');

                    if (!isOpen) {
                        isOpen = true;

                        component.find('.grow-in-center').classList.add('open');
                        setTimeout(() => {
                            Store.get('appcontainer').on('click', close);
                        }, 0);
                    } else {
                        close();
                    }
                }
            },
            {
                selector: '#id .edit-layout',
                event: 'click',
                listener(event) {
                    // Disable sidebar
                    Store.get('sidebar').get().style.pointerEvents = 'none';

                    // Hide tools
                    component.find('.tools').classList.add('d-none');

                    // Add Save and Cancel buttons
                    parent.append(/*html*/ `
                        <div class='edit-layout-buttons'>
                            <div class='save-edit-layout'>
                                <button type='button' class='btn'>
                                    <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Save</span>
                                </button>
                            </div>
                            <div class='cancel-edit-layout'>
                                <button type='button' class='btn'>
                                    <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Cancel</span>
                                </button>
                            </div>
                        </div>
                    `);

                    // Save
                    parent.find('.save-edit-layout').on('click', () => {
                        // Edit file
                        EditLayout({
                            order: [...parent.findAll('.robi-row')].map(row => parseInt(row.dataset.row.split('-')[1])),
                            path: `App/src/Routes/${route.path}`,
                            file: `${route.path}.js`
                        });
                    });

                    // Cancel
                    parent.find('.cancel-edit-layout').on('click', turnOfSortable);

                    // Turn off sortable
                    function turnOfSortable() {
                        $(`#${parent.get().id} .robi-row`).removeClass('robi-row-transition');

                        // Reset order
                        [...parent.findAll('.robi-row')]
                        .sort((a, b) => parseInt(a.dataset.row.split('row-')[1]) - parseInt(b.dataset.row.split('row-')[1]))
                        .forEach(row => parent.get().append(row));

                        setTimeout(() => {
                            $(`#${parent.get().id}`).sortable('destroy');
                            $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'auto', 'user-select': 'auto'});
                        }, 0);

                        // Remove buttons
                        parent.find('.edit-layout-buttons').remove();

                        // Show tools
                        component.find('.tools').classList.remove('d-none');

                        // Enable sidebar
                        Store.get('sidebar').get().style.pointerEvents = 'all';
                    }

                    // Turn on sortable
                    $(`#${parent.get().id} .robi-row`).addClass('robi-row-transition');
                    $(`#${parent.get().id}`).sortable({ items: '.robi-row' });
                    $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'none', 'user-select': 'none'});
                }
            },
            {
                selector: '#id .edit-source',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Routes/${route.path}`,
                        file: `${route.path}.js`
                    });
                }
            }
        ],
        onAdd() {

        }
    });

    function close(event) {
        isOpen = false;

        component.find('.grow-in-center').classList.remove('open');
        component.find('.tools').classList.remove('scale-up');

        Store.get('appcontainer').off('click', close);
    }

    return component;
}
