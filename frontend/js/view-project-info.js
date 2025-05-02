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
                    label: "Edit Project",
                    width: 130,
                    click: function () {
                        $$("projectOverview").enable();
                        $$("clientDetails").enable();
                        $$("description").enable();
                        $$("project_value").enable();
                        $$("project_manager").enable();
                        $$("role").enable();
                        $$("staff_contact").enable();
                        $$("staff_email").enable();
                        $$("footerToolbar").show();
                    }
                },
                {
                    view: "button",
                    label: "Add Quote",
                    type: "form",
                    width: 130,
                    click: function () {
                        isEditMode = false;
                        webix.require("js/add-quote.js", function () {
                            const pageContent = $$("pageContent");
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }
                            pageContent.addView(addQuoteTemplate);
                        });
                    }
                },
                {
                    view: "button",
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
            elementsConfig: {
                disabled: true
            },
            elements: [
                {
                    cols: [
                        {
                            rows: [
                                { template: "Project Overview", type: "section" },
                                {
                                    view: "property",
                                    id: "projectOverview",
                                    disabled: true,
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
                                    disabled: true,
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
                            label: "Description",
                            height: 80,
                            labelWidth: 150
                        },
                        {
                            view: "text",
                            id: "project_value",
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
                                    label: "Name",
                                    labelWidth: 150
                                },
                                { width: 50 },
                                {
                                    view: "text",
                                    id: "role",
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
                                    label: "Contact Number",
                                    labelWidth: 150
                                },
                                { width: 50 },
                                {
                                    view: "text",
                                    id: "staff_email",
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
        },
        {
            view: "toolbar",
            id: "footerToolbar",
            height: 50,
            hidden: true,
            css: "footer",
            elements: [
                {},
                {
                    view: "button",
                    id: "saveProjectBtn",
                    value: "Save",
                    width: 120,
                    css: "webix_primary",
                    click: function () {
                        webix.message("Project saved!");

                        $$("projectOverview").disable();
                        $$("clientDetails").disable();
                        $$("description").disable();
                        $$("project_value").disable();
                        $$("project_manager").disable();
                        $$("role").disable();
                        $$("staff_contact").disable();
                        $$("staff_email").disable();

                        $$("footerToolbar").hide();
                    }
                },
                {}
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
