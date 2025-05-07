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
                        webix.confirm({
                            title: "Confirm Navigation",
                            text: "Are you sure you want to leave this page and return to the project list?",
                            type: "confirm-warning"
                        }).then(function () {
                            webix.require("js/projects.js", function () {
                                const pageContent = $$("pageContent");
                                pageContent.removeView(pageContent.getChildViews()[0]);
                                pageContent.addView(projectsTemplate);
                            });
                        });
                    }
                }
                
            ]
        },
        {
            view: "form",
            id: "addProjectForm",
            scroll: "y",
            elementsConfig: {
                labelWidth: 180,
                bottomPadding: 18
            },
            rules: {
                "project_name": webix.rules.isNotEmpty,
                "project_description": webix.rules.isNotEmpty,
                "project_value": webix.rules.isNotEmpty,
                "project_status": webix.rules.isNotEmpty,
                "project_start_date": webix.rules.isNotEmpty,
                "project_completion_date": webix.rules.isNotEmpty,
                "client_name": webix.rules.isNotEmpty,
                "staff_name": webix.rules.isNotEmpty
            },
            elements: [
                {
                    rows: [
                        { template: "Project Details", type: "section" },
                        { view: "text", label: "Project Name", name: "project_name", invalidMessage: "Project name is required" },
                        { view: "text", label: "Project Description", name: "project_description", invalidMessage: "Description is required" },
                        { view: "text", label: "Project Value", name: "project_value", invalidMessage: "Value is required" },
                        {
                            view: "combo",
                            label: "Status",
                            name: "project_status",
                            options: ["Pending", "In Progress", "Completed"],
                            invalidMessage: "Status is required"
                        },
                        {
                            view: "datepicker",
                            label: "Start Date",
                            name: "project_start_date",
                            stringResult: true,
                            format: "%Y-%m-%d",
                            invalidMessage: "Start date is required"
                        },
                        {
                            view: "datepicker",
                            label: "Expected Completion Date",
                            name: "project_completion_date",
                            stringResult: true,
                            format: "%Y-%m-%d",
                            invalidMessage: "Completion date is required"
                        }
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Client Information", type: "section" },
                        {
                            view: "combo",
                            label: "Client Name",
                            name: "client_name",
                            id: "clientSelector",
                            options: {
                                body: {
                                    url: "http://localhost:8000/backend/clients.php",
                                    template: "#name#"
                                }
                            },
                            invalidMessage: "Client name is required",
                            on: {
                                onChange: function (newValue) {
                                    const list = this.getPopup().getList();
                                    const clientData = list.getItem(newValue);
                        
                                    if (clientData) {
                                        // Auto-fill the form with client data
                                        $$("addProjectForm").setValues({
                                            client_id: clientData.id,
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
                            invalidMessage: "Staff name is required",
                            on: {
                                onChange: function (newValue) {
                                    const list = this.getPopup().getList();
                                    const staffData = list.getItem(newValue);
                        
                                    if (staffData) {
                                        // Auto-fill the form with client data
                                        $$("addProjectForm").setValues({
                                            staff_id: staffData.id,
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
                                        $$("addProjectForm").clear();
                                        webix.require("js/projects.js", function () {
                                            const pageContent = $$("pageContent");
                                            pageContent.removeView(pageContent.getChildViews()[0]);
                                            pageContent.addView(projectsTemplate);
                                        });
                                    });
                            }
                        },
                        { width: 20 }, // space between Cancel and Save buttons
                        {
                            view: "button",
                            id: "saveProjectBtn",
                            value: "Save Project",
                            height: 50,
                            width: 150,
                            css: "webix_primary",
                                click: function () {
                                    const form = $$("addProjectForm");
                                    if (form.validate()) {
                                        const formData = form.getValues();
                                
                                        // Extract and log only the required fields
                                        var projectValues = {
                                            project_name: formData.project_name,
                                            description: formData.project_description,
                                            project_value: formData.project_value,
                                            status: formData.project_status,
                                            start_date: formData.project_start_date,
                                            expected_completion: formData.project_completion_date,
                                            client_id: formData.client_id,
                                            staff_id: formData.staff_id
                                        }

                                        console.log(projectValues)

                                        webix.ajax().post("http://localhost:8000/backend/projects.php", projectValues)
                                        .then(function (response) {
                                            webix.message("Project saved successfully!");
                                            $$("addProjectForm").clear();
                                            webix.require("js/projects.js", function () {
                                                const pageContent = $$("pageContent");
                                                pageContent.removeView(pageContent.getChildViews()[0]);
                                                pageContent.addView(projectsTemplate);
                                            });
                                        })
                                        .catch(function (err) {
                                            webix.message({ type: "error", text: "Failed to save project." });
                                            console.error(err);
                                        });

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



