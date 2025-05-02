// Template for viewing quote information
var addProjectTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            elements: [
                { view: "label", label: "Add Project", align: "left", css: "header_label" },
                {},
                {
                    view: "button",
                    label: "Back",
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
            id: "addProjectForm",
            scroll: "y",
            // gravity: 1, 
            elementsConfig: {
                labelWidth: 180,
                bottomPadding: 18
            },
            rules: {
                "client_id": webix.rules.isNotEmpty,
                "quote_description": webix.rules.isNotEmpty
            },
            elements: [
                {
                    rows: [
                        { template: "Project Details", type: "section" },
                        { view: "text", label: "Project Name", name: "project_name"},
                        { view: "text", label: "Project Description", name: "project_description" },
                        { view: "text", label: "Project Value", name: "project_value" },
                        {
                            view: "combo",
                            label: "Status",
                            name: "project_status",
                            options: ["Pending", "In Progress", "Completed"]
                        },
                        {
                            view: "datepicker",
                            label: "Expected Completion Date",
                            name: "project_completion_date",
                            stringResult: true,
                            format: "%Y-%m-%d"
                        }
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Client Information", type: "section" },
                        {
                            view: "combo",
                            label: "Client ID",
                            name: "client_id",
                            id: "clientSelector",
                            options: {
                                body: {
                                    url: "http://localhost:8000/backend/clients.php",
                                    template: "#id#"
                                }
                            },
                            invalidMessage: "Client name is required",
                            on: {
                                onChange: function (newValue) {
                                    const list = this.getPopup().getList();
                                    const clientData = list.getItem(newValue);
                                    console.log(list)
                                    console.log(clientData)

                                    console.log(clientData)
                        
                                    if (clientData) {
                                        // Auto-fill the form with client data
                                        $$("addProjectForm").setValues({
                                            client_name: clientData.name,
                                            client_email: clientData.email,
                                            client_contact_number: clientData.contact_number,
                                            client_address: clientData.address
                                        }, true);
                        
                                        // Prevent further typing
                                        this.getInputNode().setAttribute("readonly", true);
                                    }
                                }
                            }
                        },  
                        { view: "text", label: "Client Name", name: "client_name", disabled:true },
                        { view: "text", label: "Email", name: "client_email", disabled:true },
                        { view: "text", label: "Contact Number", name: "client_contact_number", disabled:true },
                        { view: "text", label: "Address", name: "client_address", disabled:true },
                        
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Staff Information", type: "section" },
                        {
                            view: "combo",
                            label: "Staff Name",
                            name: "staff_name",
                            id: "staffSelector",
                            options: {
                                body: {
                                    url: "http://localhost:8000/backend/staff.php",
                                    template: "#name#"
                                }
                            },
                            invalidMessage: "Client name is required",
                            on: {
                                onChange: function (newValue) {
                                    const list = this.getPopup().getList();
                                    const staffData = list.getItem(newValue);
                                    console.log(list)
                                    console.log(staffData)

                                    console.log(staffData)
                        
                                    if (staffData) {
                                        // Auto-fill the form with client data
                                        $$("addProjectForm").setValues({
                                            staff_email: staffData.email,
                                            staff_contact_number: staffData.contact_number,
                                            staff_address: staffData.role
                                        }, true);
                        
                                        // Prevent further typing
                                        this.getInputNode().setAttribute("readonly", true);
                                    }
                                }
                            }
                        },
                        { view: "text", label: "Email", name: "staff_email", disabled:true },
                        { view: "text", label: "Contact Number", name: "staff_contact_number", disabled:true },
                        { view: "text", label: "Address", name: "staff_address", disabled:true },
                        
                    ]
                },
                { height: 25 },
                {
                    margin: 10,
                    cols: [
                        {}, // spacer to push buttons to the right
                        {
                            view: "button",
                            id: "cancelQuoteBtn",
                            value: "Cancel",
                            height: 50,
                            width: 150,
                            css: "webix_secondary",
                            click: function () {
                                webix.confirm("Are you sure you want to cancel and discard changes?")
                                    .then(function () {
                                        $$("quoteForm").clear();
                                        webix.require("js/quotes.js", function () {
                                            const pageContent = $$("pageContent");
                                            pageContent.removeView(pageContent.getChildViews()[0]);
                                            pageContent.addView(quotesTemplate);
                                        });
                                    });
                            }
                        },
                        { width: 20 }, // space between Cancel and Save buttons
                        {
                            view: "button",
                            id: "saveQuoteBtn",
                            value: "Save Quote",
                            height: 50,
                            width: 150,
                            css: "webix_primary",
                            click: function () {
                                const form = $$("quoteForm");
                                if (form.validate()) {
                                    const formData = form.getValues();
                                    if (isEditMode) {
                                        updateQuote();
                                    } else {
                                        addQuote();
                                    }
                                    this.getTopParentView().hide();
                                } else {
                                    webix.message({ type: "error", text: "Please fill in all required fields correctly." });
                                }
                            }
                        }
                    ]
                }            
            ]
        }
    ]
};



