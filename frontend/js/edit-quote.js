var requirementIdCounter = 1;

var editQuoteTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            elements: [
                { view: "label", label: "Edit Quote", align: "left", css: "header_label" },
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
            elementsConfig: {
                labelWidth: 180,
                bottomPadding: 18
            },
            rules: {
                "client_id": webix.rules.isNotEmpty,
                "quote_description": webix.rules.isNotEmpty,
                "quote_amount": webix.rules.isNotEmpty
            },
            elements: [
                {
                    rows: [
                        { template: "Project Name", type: "section" },
                        { view: "text", label: "Project Name", name: "project_name", disabled: true },
                        { view: "text", label: "Client Name", name: "client_name", disabled: true },
                        { view: "text", name: "quote_id", hidden: true },
                        { view: "text", name: "project_id", hidden: true },
                        { view: "text", name: "client_id", hidden: true },
                        { height: 25 },
                        { template: "Quote Information", type: "section" },
                        { view: "text", label: "Quote Description", name: "quote_description", invalidMessage: "Quote description is required" },
                        { view: "text", label: "Quote Amount", name: "quote_amount", invalidMessage: "Quote amount is required" }
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
                                const requirementText = $$("quoteForm").getValues().requirement;

                                if (!requirementText || requirementText.trim() === "") {
                                    webix.message({ type: "error", text: "Requirement cannot be empty." });
                                    return;
                                }

                                const table = $$("requirement_table");
                                const now = new Date().toLocaleString(); // readable timestamp

                                table.add({
                                    requirement_id: requirementIdCounter++,
                                    requirement_text: requirementText,
                                    requirement_created_at: now,
                                    is_new: true
                                });

                                $$("quoteForm").setValues({ requirement: "" }, true);
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
                            editable: true,
                            footer: true,
                            columns: [
                                { id: "requirement_id", header: "Requirement ID", width: 100 },
                                { id: "requirement_text", editor: "text", header: "Description", fillspace: true },
                                { id: "requirement_created_at", header: "Created Date", width: 180 },
                                {
                                    id: "actions",
                                    header: "Actions",
                                    template: "<span class='webix_icon wxi-trash'></span>",
                                    width: 80
                                }
                            ],
                            onClick: {
                                "wxi-trash": function (e, id) {
                                    const item = this.getItem(id);
                                    console.log(item)
                            
                                    if (item.is_new || !item.requirement_id) {
                                        // New requirement: delete locally
                                        this.remove(id);
                                        console.log("New Requirement")
                                    } else {
                                        console.log("Existing Requirement")
                                        // Existing requirement: delete via AJAX
                                        webix.confirm("This is an existing requirement. Do you want to delete it permanently?")
                                            .then(() => {
                                                webix.ajax().del("http://localhost:8000/backend/quotes.php", {
                                                    requirement_id: item.requirement_id
                                                })
                                                .then(() => {
                                                    webix.message("Requirement deleted successfully!");
                                                    this.remove(id);
                                                })
                                                .catch((err) => {
                                                    webix.message({ type: "error", text: "Failed to delete requirement." });
                                                    console.error("Delete error:", err);
                                                });
                                            });
                                    }
                            
                                    return false;
                                }
                            },                            
                            on: {
                                onAfterLoad: function () {
                                    if (!this.count()) {
                                        this.showOverlay("No quote requirements have been edited yet.");
                                    } else {
                                        this.hideOverlay();
                                    }
                                },
                                onAfterRender: function () {
                                    if (!this.count()) {
                                        this.showOverlay("No quote requirements have been edited yet.");
                                    }
                                }
                            }
                        }
                    ]
                },
                { height: 25 }
            ]
        },
        {
            view: "toolbar",
            height: 70,
            padding: { top: 10, bottom: 10, left: 20, right: 20 },
            elements: [
                {},
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
                { width: 20 },
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
                            const requirementTableData = $$("requirement_table").serialize();

                            const quoteData = {
                                quote_id: formData.quote_id,
                                client_id: formData.client_id,
                                project_id: formData.project_id,
                                quote_amount: formData.quote_amount,
                                quote_description: formData.quote_description,
                                requirements: requirementTableData
                            };

                            webix.ajax().headers({
                                "Content-Type": "application/json"
                            }).put("http://localhost:8000/backend/quotes.php", JSON.stringify(quoteData), {
                                error: function () {
                                    webix.message({ type: "error", text: "Failed to update quote." });
                                },
                                success: function () {
                                    webix.message({ type: "success", text: "Quote updated successfully!" });
                                    webix.require("js/quotes.js", function () {
                                        const pageContent = $$("pageContent");
                                        pageContent.removeView(pageContent.getChildViews()[0]);
                                        pageContent.addView(quotesTemplate);
                                    });
                                }
                            });                            
                        } else {
                            webix.message({ type: "error", text: "Please fill in all required fields correctly." });
                        }
                    }
                }
            ]
        }
    ]
};
