// Template for viewing quote information
var addQuoteTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            elements: [
                { view: "label", label: "Add Quote", align: "left", css: "header_label" },
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
        id: "quoteForm",
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
                    {
                        view: "combo",
                        label: "Project ID",
                        name: "client_id",
                        id: "projectSelector",
                        options: {
                            body: {
                                url: "http://localhost:8000/backend/projects.php",
                                template: "#project_id#"
                            }
                        },
                        invalidMessage: "Client name is required",
                        on: {
                            onChange: function (newValue) {
                                const list = this.getPopup().getList();
                                const projectData = list.getItem(newValue);
                                console.log(list)
                                console.log(projectData)

                                console.log(projectData)
                    
                                if (projectData) {
                                    // Auto-fill the form with client data
                                    $$("quoteForm").setValues({
                                        project_name: projectData.project_name,
                                        project_description: projectData.description,
                                        project_total_amount: projectData.project_value,
                                        project_status: projectData.status,
                                        project_completion_date: projectData.expected_completion
                                    }, true);
                    
                                    // Prevent further typing
                                    this.getInputNode().setAttribute("readonly", true);
                                }
                            }
                        }
                    },  
                    { view: "text", label: "Client Name", name: "client_name", disabled:true },
                    { view: "text", label: "Project Name", name: "project_name", disabled:true },
                    { view: "text", label: "Project Description", name: "project_description", disabled:true },
                    { view: "text", label: "Total Amount", name: "project_total_amount", disabled:true },
                    {
                        view: "combo",
                        label: "Status",
                        name: "project_status",
                        options: ["Pending", "In Progress", "Completed"],
                        disabled:true
                    },
                    {
                        view: "datepicker",
                        label: "Expected Completion Date",
                        name: "project_completion_date",
                        stringResult: true,
                        format: "%Y-%m-%d",
                        disabled:true
                    }
                ]
            },
            { height: 25 },
            {
                rows: [
                    { template: "Quote Information", type: "section" },
                    { view: "text", label: "Quote Description", name: "quote_description", invalidMessage: "Quote description is required" },
                ]
            },
            {
                cols: [

                    { view: "text", label: "Requirement", name: "requirement" },
                    {
                        view: "button",
                        id: "saveRequirementBtn",
                        value: "Add Requirement",
                        width: 150,
                        css: "webix_primary",
                        click: function () {
                            console.log("Add Requirements")
                        }
                    }
                ]
            },
            {
                rows: [
                    {
                        view: "datatable",
                        id: "requirement_table",
                        height: 500,
                        scrollX: false,
                        footer: true,
                        columns: [
                            { id: "requirement_id", header: "Requirement ID", width: 100 },
                            { id: "requirement_text", header: "Description", fillspace: true },
                            { id: "requirement_created_at", header: "Created Date", width: 180 }
                        ],
                        on: {
                            onAfterLoad: function () {
                                if (!this.count()) {
                                    this.showOverlay("No quote requirements have been added yet.");
                                } else {
                                    this.hideOverlay();
                                }
                            }
                        }
                    }
                    
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



function addQuote() {
    const form = $$("quoteForm");
	if (form.validate()) {
		var formData = form.getValues();
        console.log("ADDDDDD Validated Data:", formData)
    
        webix.ajax().post("http://localhost:8000/backend/quotes.php", formData)
        .then(function (response) {
            webix.message("Quote added successfully!");
            form.clear();
            $$("quotesTable").clearAll();
            $$("quotesTable").load("http://localhost:8000/backend/quotes.php");
        })
        .catch(function (err) {
            webix.message({ type: "error", text: "Failed to add quote" });
            console.error("Error:", err);
        });

    } else {
        console.log("invalidate")
        webix.message({ type: "error", text: "Please fill in all required fields correctly." });
    }
}

function updateQuote() {
    const form = $$("quoteForm");

	if (form.validate()) {
		var formData = form.getValues();
        console.log("UPDATE QUOTE DATA:", formData);
        webix.ajax().put("http://localhost:8000/backend/quotes.php", formData)
        .then(function (response) {
            webix.message("Quote updated successfully!");
            form.clear();
            $$("quotesTable").clearAll();
            $$("quotesTable").load("http://localhost:8000/backend/quotes.php");
        })
        .catch(function (err) {
            webix.message({ type: "error", text: "Failed to update quote" });
            console.error("Error:", err);
        });


    } else {
        console.log("invalidate")
        webix.message({ type: "error", text: "Please fill in all required fields correctly." });
    }
}