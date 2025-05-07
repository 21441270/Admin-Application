var viewProjectInfoTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            elements: [
                { view: "label", label: "Project Information", align: "left", css: "header_label" },
                {},
                {
                    view: "button",
                    id: "addQuoteBtn",
                    label: "Add Quote",
                    type: "form",
                    width: 130,
                    click: function () {
                        isEditMode = false;
                    
                        const projectData = $$("projectOverview").getValues();
                        const clientData = $$("clientDetails").getValues();
                    
                        const projectName = projectData.project_name;
                        const projectId = projectData.project_id;
                        const clientId = clientData.client_id;
                        const clientName = clientData.client_name;
                    
                        console.log("Selected Project & Client:", { projectName, projectId, clientId, clientName });
                    
                        webix.require("js/add-quote.js", function () {
                            const pageContent = $$("pageContent");
                    
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }
                    
                            pageContent.addView(addQuoteTemplate);
                    
                            webix.delay(function () {
                                $$("quoteForm").setValues({
                                    project_name: projectName,
                                    project_id: projectId,
                                    client_id: clientId,
                                    client_name: clientName
                                }, true);
                            });
                        });
                    }                                   
                },
                {
                    view: "button",
                    id: "backBtn",
                    label: "Back",
                    css: "webix_primary",
                    width: 100,
                    click: function () {
                        webix.require("js/projects.js", function () {
                            const pageContent = $$("pageContent");
                            pageContent.removeView(pageContent.getChildViews()[0]);
                            pageContent.addView(projectsTemplate);
                        });
                    }
                }
            ]
        },
        {
            view: "form",
            id: "viewProjectInfoForm",
            scroll: true,
            elements: [
                {
                    cols: [
                        {
                            rows: [
                                { template: "Project Overview", type: "section" },
                                {
                                    view: "property",
                                    id: "projectOverview",
                                    editable: false,
                                    height: 110,
                                    elements: [
                                        { label: "Project Name", type: "text", id: "project_name" },
                                        { label: "Status", type: "text", id: "status" },
                                        { label: "Start Date", type: "text", id: "start_date" },
                                        { label: "Expected Completion", type: "text", id: "expected_completion" }
                                    ]
                                }
                            ]
                        },
                        { width: 50 },
                        {
                            rows: [
                                { template: "Client Details", type: "section" },
                                {
                                    view: "property",
                                    id: "clientDetails",
                                    editable: false,
                                    height: 110,
                                    elements: [
                                        { label: "Name", type: "text", id: "client_name" },
                                        { label: "Email", type: "text", id: "client_email" },
                                        { label: "Phone", type: "text", id: "client_phone" },
                                        { label: "Address", type: "text", id: "client_address" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Project Details", type: "section" },
                        {
                            view: "textarea",
                            id: "description",
                            readonly: true,
                            label: "Description",
                            height: 80,
                            labelWidth: 150
                        },
                        {
                            view: "text",
                            id: "project_value",
                            readonly: true,
                            label: "Project Value",
                            labelWidth: 150
                        }
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Staff", type: "section" },
                        {
                            cols: [
                                {
                                    view: "text",
                                    id: "project_manager",
                                    readonly: true,
                                    label: "Name",
                                    labelWidth: 150
                                },
                                { width: 50 },
                                {
                                    view: "text",
                                    id: "role",
                                    readonly: true,
                                    label: "Site Role",
                                    labelWidth: 150
                                }
                            ]
                        },
                        
                        {
                            cols: [
                                {
                                    view: "text",
                                    id: "staff_contact",
                                    readonly: true,
                                    label: "Contact Number",
                                    labelWidth: 150
                                },
                                { width: 50 },
                                {
                                    view: "text",
                                    id: "staff_email",
                                    readonly: true,
                                    label: "Email",
                                    labelWidth: 150
                                }
                            ]
                        }
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Quote Summary", type: "section" },
                        {
                            cols: [
                                {}, // spacer to push the button to the right
                                {
                                    view: "button",
                                    id: "quoteMgmtBtn",
                                    label: "Quote Management",
                                    width: 180,
                                    css: "webix_primary",
                                    click: function () {
                                        webix.require("js/quotes.js", function () {
                                            const pageContent = $$("pageContent");
                                    
                                            if (pageContent.getChildViews().length > 0) {
                                                pageContent.removeView(pageContent.getChildViews()[0]);
                                            }
                                        
                                                pageContent.addView(quotesTemplate);
                                        });


                                    /* const projectData = $$("projectOverview").getValues();
                                        const clientData = $$("clientDetails").getValues();
                                    
                                        const projectName = projectData.project_name;
                                        const projectId = projectData.project_id;
                                        const clientId = clientData.client_id;
                                        const clientName = clientData.client_name;
                                    
                                        console.log("Selected Project & Client:", { projectName, projectId, clientId, clientName }); */
                                    
                                        /* webix.require("js/add-quote.js", function () {
                                            const pageContent = $$("pageContent");
                                    
                                            if (pageContent.getChildViews().length > 0) {
                                                pageContent.removeView(pageContent.getChildViews()[0]);
                                            }
                                    
                                            pageContent.addView(addQuoteTemplate);
                                    
                                            webix.delay(function () {
                                                $$("quoteForm").setValues({
                                                    project_name: projectName,
                                                    project_id: projectId,
                                                    client_id: clientId,
                                                    client_name: clientName
                                                }, true);
                                            }); */
                                            /* 
                                        // Send project_id to PHP script
                                        webix.ajax().post("http://localhost:8000/backend/project_info_details.php", { project_id: projectId })
                                        .then(function(response) {
                                            const data = response.json(); // the JSON object sent back from PHP

                                            webix.require("js/quotes.js", function () {
                                                const pageContent = $$("pageContent");
                                                
                                                if (pageContent.getChildViews().length > 0) {
                                                    pageContent.removeView(pageContent.getChildViews()[0]);
                                                }
                                                
                                                pageContent.addView(quotesTemplate);

                                                console.log(data)
                                                    $$("quotesTable").clearAll();
                                                    $$("quotesTable").parse(data.quotes);
                                            });
                                        })
                                        .catch(function(err) {
                                            console.error("Error loading project details:", err);
                                        }); */

                                    }
                                      
                                }
                            ]
                        },
                        {
                            view: "datatable",
                            id: "quote_table",
                            scrollX: false,
                            footer: true,
                            columns: [
                                { id: "quote_id", header: "Quote ID", width: 100 },
                                { id: "quote_description", header: "Description", fillspace: true },
                                {
                                    id: "quote_amount",
                                    header: "Amount",
                                    width: 150,
                                    format: webix.i18n.priceFormat,
                                    footer: {
                                        content: "summColumn",
                                        colspan: 2
                                    }
                                },
                                { id: "created_at", header: "Created Date", width: 180 }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

webix.ui.datafilter.summColumn = webix.extend({
    refresh: function (master, node, value) {
        var summ = 0;
        master.data.each(function (obj) {
            summ += parseFloat(obj[value.columnId]) || 0;
        });
        node.innerHTML = "Total: " + webix.i18n.priceFormat(summ);
        node.style.textAlign = "right";
    }
}, webix.ui.datafilter.summColumn);
