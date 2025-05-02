var originalProjectData = {};

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
                    id: "editProjectBtn",
                    label: "Edit Project",
                    width: 130,
                    click: function () {
                        // Store current values
                        /* originalProjectData = {
                            projectOverview: webix.copy($$("projectOverview").getValues()),
                            clientDetails: webix.copy($$("clientDetails").getValues()),
                            description: $$("description").getValue(),
                            project_value: $$("project_value").getValue(),
                            project_manager: $$("project_manager").getValue(),
                            role: $$("role").getValue(),
                            staff_contact: $$("staff_contact").getValue(),
                            staff_email: $$("staff_email").getValue()
                        }; */

                        originalProjectData = {
                            projectOverview: webix.copy($$("projectOverview").getValues()),
                            clientDetails: webix.copy($$("clientDetails").getValues()),
                            description: $$("description").getValue(),
                            project_value: $$("project_value").getValue(),
                            project_manager: $$("project_manager").getValue(),
                            role: $$("role").getValue(),
                            staff_contact: $$("staff_contact").getValue(),
                            staff_email: $$("staff_email").getValue()
                        }
                        console.log(originalProjectData)

                        $$("projectOverview").define("editable", true); $$("projectOverview").refresh();
                        $$("clientDetails").define("editable", true); $$("clientDetails").refresh();

                        ["description", "project_value", "project_manager", "role", "staff_contact", "staff_email"].forEach(id => {
                            $$(id).define("readonly", false);
                            $$(id).refresh();
                        });

                        $$("editProjectBtn").hide();
                        $$("addQuoteBtn").hide();
                        $$("backBtn").hide();
                        $$("cancelEditBtn").show();
                        $$("footerToolbar").show();
                    }
                },
                {
                    view: "button",
                    id: "cancelEditBtn",
                    label: "Cancel",
                    width: 130,
                    hidden: true,
                    click: function () {
                        
                        console.log(originalProjectData)
                        // Restore original values

                        console.log($$("projectOverview").getValues())
                        console.log($$("clientDetails").getValues())

                        // $$("projectOverview").setValues(originalProjectData.projectOverview);

                        $$("projectOverview").setValues({
                            "project_name": originalProjectData.projectOverview.project_name,
                            "status": originalProjectData.projectOverview.status,
                            "start_date": originalProjectData.projectOverview.start_date,
                            "expected_completion": originalProjectData.projectOverview.expected_completion
                        });
        
                        $$("clientDetails").setValues({
                            "client_name": originalProjectData.clientDetails.client_name,
                            "client_email": originalProjectData.clientDetails.client_email,
                            "client_phone": originalProjectData.clientDetails.client_phone,
                            "client_address": originalProjectData.clientDetails.client_address
                        });




                       // $$("clientDetails").setValues(originalProjectData.clientDetails);
                        $$("description").setValue(originalProjectData.description);
                        $$("project_value").setValue(originalProjectData.project_value);
                        $$("project_manager").setValue(originalProjectData.project_manager);
                        $$("role").setValue(originalProjectData.role);
                        $$("staff_contact").setValue(originalProjectData.staff_contact);
                        $$("staff_email").setValue(originalProjectData.staff_email);

                        $$("projectOverview").define("editable", false); $$("projectOverview").refresh();
                        $$("clientDetails").define("editable", false); $$("clientDetails").refresh();

                        ["description", "project_value", "project_manager", "role", "staff_contact", "staff_email"].forEach(id => {
                            $$(id).define("readonly", true);
                            $$(id).refresh();
                        });

                        $$("editProjectBtn").show();
                        $$("addQuoteBtn").show();
                        $$("backBtn").show();
                        $$("cancelEditBtn").hide();
                        $$("footerToolbar").hide();

                        webix.message("Changes discarded");
                    }
                },
                {
                    view: "button",
                    id: "addQuoteBtn",
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
                    id: "saveBtn",
                    value: "Save",
                    width: 120,
                    css: "webix_primary",
                    click: function () {
                        // Disable editing
                        $$("projectOverview").define("editable", false); $$("projectOverview").refresh();
                        $$("clientDetails").define("editable", false); $$("clientDetails").refresh();

                        ["description", "project_value", "project_manager", "role", "staff_contact", "staff_email"].forEach(id => {
                            $$(id).define("readonly", true);
                            $$(id).refresh();
                        });

                        $$("editProjectBtn").show();
                        $$("addQuoteBtn").show();
                        $$("backBtn").show();
                        $$("cancelEditBtn").hide();
                        $$("footerToolbar").hide();

                        webix.message("Project saved!");
                    }
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
