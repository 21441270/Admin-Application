var requirementIdCounter = 1;

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
                                    requirement_id: requirementIdCounter++, // use and increment
                                    requirement_text: requirementText,
                                    requirement_created_at: now
                                });
                        
                                // Clear the input field after adding
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
                                },
                                onAfterRender: function () {
                                    if (!this.count()) {
                                        this.showOverlay("No quote requirements have been added yet.");
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
                    // click: function () {
                    //     const form = $$("quoteForm");
                    //     if (form.validate()) {
                    //         const formData = form.getValues();
                    //         const requirementTableData = $$("requirement_table").serialize();
                
                    //         // Log the required fields
                    //         console.log("Project ID:", formData.project_id);
                    //         console.log("Client ID:", formData.client_id);
                    //         console.log("Quote Description:", formData.quote_description);
                    //         console.log("Quote Amount:", formData.quote_amount);
                    //         console.log("Requirements:", requirementTableData);
                
                    //         /* if (requirementTableData.length === 0) {
                    //             console.log("No requirements added.");
                    //         } else {
                    //             console.log("Requirements:");
                    //             requirementTableData.forEach((item, index) => {
                    //                 console.log(
                    //                     ` Description: ${item.requirement_text}, Created At: ${item.requirement_created_at}`
                    //                 );
                    //             });
                    //         } */
                
                    //     } else {
                    //         webix.message({ type: "error", text: "Please fill in all required fields correctly." });
                    //     }
                    // }

                    click: function () {
                        const form = $$("quoteForm");
                        if (form.validate()) {
                            const formData = form.getValues();
                            const requirementTableData = $$("requirement_table").serialize();
                            
                            // Prepare data to send
                            const quoteData = {
                                client_id: formData.client_id,
                                project_id: formData.project_id,
                                quote_amount: formData.quote_amount,
                                quote_description: formData.quote_description,
                                requirements: requirementTableData
                            };

                            /* console.log(quoteData)

                            if (requirementTableData.length === 0) {
                                console.log("No requirements added.");
                            } else {
                                console.log("Requirements:");
                                    requirementTableData.forEach((item, index) => {
                                    console.log(`${item.requirement_text}`);
                                });
                            } */

                                webix.ajax().headers({
                                    "Content-Type": "application/json"
                                }).post("http://localhost:8000/backend/add_quote.php", JSON.stringify(quoteData), {
                                    error: function (text, data, xhr) {
                                        webix.message({ type: "error", text: "Failed to save quote." });
                                    },
                                    success: function (text, data, xhr) {
                                        webix.message({ type: "success", text: "Quote saved successfully!" });
                                
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
