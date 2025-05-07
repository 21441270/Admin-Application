// Variable to track edit mode
var isEditMode = false;

var quotesTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            paddingX: 20,
            elements: [
                { view: "label", label: "Quotes", css: "app_header_label", align: "left" },
                {},
                {
                    view: "button",
                    label: "Add Quote",
                    type: "form",
                    width: 130,
                    css: "webix_primary",
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
            view: "datatable",
            id: "quotesTable",
            url: "http://localhost:8000/backend/quotes.php",
            columns: [
                { id: "id", header: "Quote ID", width: 100 },
                { id: "name", header: "Client Name", fillspace: true },
                { id: "description", header: "Project Description", width: 150 },
                { id: "total_amount", header: "Total Amount", fillspace: true },
                { id: "status", header: "Status", fillspace: true },
                { id: "completion_date", header: "Expected Completion Date", fillspace: true },
                { id: "action", header: "Action", template: "<span class='webix_icon wxi-eye'></span> {common.editIcon()} {common.trashIcon()}", fillspace: true}
            ],
            select: true,
            resizeColumn: true,
            scrollX: false,
            scrollY: true,
            headerRowHeight: 55,
            rowHeight: 55,
            tooltip: true,
            fillspace: true,
            pager: "quoteTablePager",
            on: {
                onBeforeLoad: function () {
                    this.showOverlay("Loading...");
                },
                onAfterLoad: function () {
                    this.hideOverlay();
                    if (!this.count()) {
                        this.showOverlay("No Records Found");
                    }
                }
            },
            onClick: {
                "wxi-eye": function (ev, id) {
                    const item = this.getItem(id); // get the clicked item (row)

                    // Send project_id to PHP script
                    webix.ajax().post("http://localhost:8000/backend/quote_info_details.php", { quote_id: item.id })
                    .then(function(response) {
                        const data = response.json()
                        
                        webix.require("js/view-quote-info.js", function () {
                            const pageContent = $$("pageContent");
    
                            // Remove existing view if any
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }
    
                            // Add the new view
                            pageContent.addView(viewQuoteInfoTemplate);

                             // Show loading overlay while the data is being processed
                            $$("requirement_table").showOverlay("Loading...");

                                $$("quoteDetails").setValues({
                                    "id": data.quote_id,
                                    "description": data.quote_description,
                                    "total_amount": data.total_amount,
                                    "status": data.project_status,
                                    "start_date": data.project_start_date,
                                    "completion_date": data.project_completion_date
                                })
        
                                $$("clientDetails").setValues({
                                    "client_name": data.client_name,
                                    "client_number": data.client_number,
                                    "email": data.client_email,
                                    "address": data.client_address
                                });
                                $$("requirement_table").parse(data.requirements); 

                                // Hide loading overlay once data is loaded
                                $$("requirement_table").hideOverlay();

                                // Check if requirements are empty and show overlay if so
                                if (data.requirements.length === 0) {
                                    $$("requirement_table").showOverlay("No Requirements Found");
                                } else {
                                    $$("requirement_table").hideOverlay();
                                }
                        });
                    })
                    .catch(function(err) {
                        console.error("Error loading project details:", err);
                    });
                },
                "wxi-pencil": function(ev, id) { // Edit Button
                    isEditMode = true;

                    var item = this.getItem(id);
                    console.log("Edit")
                    console.log(this)
                    console.log(item)
                    $$("quoteForm").setValues({
                        id: item.id,
                        first_name: item.first_name,
                        middle_name: item.middle_name,
                        last_name: item.last_name,
                        contact_number: item.contact_number,
                        email: item.email,
                        address_line: item.address_line,
                        city: item.city,
                        postcode: item.postcode
                    })
                    $$("quoteWindow").show();
                    
                },
                "wxi-trash": function (ev, id) {
                    var item = this.getItem(id);

                    webix.confirm({
                        title: "Delete Quote",
                        text: `Are you sure you want to delete <strong>${item.name}</strong>?`,
                        ok: "Yes",
                        cancel: "No",
                        type: "confirm-warning",
                        callback: function (result) {
                            if (result) {
                                // Make the DELETE request with the quote ID in the body
                                webix.ajax().del("http://localhost:8000/backend/quotes.php", {
                                    id: item.id  // Send the quote ID in the request body
                                })
                                .then(function (res) {
                                    webix.message("Quote deleted successfully!");
                                    $$("quotesTable").remove(id);
                                })
                                .catch(function (err) {
                                    webix.message({ type: "error", text: "Failed to delete quote" });
                                    console.error("Delete error:", err);
                                });
                            }
                        }
                    });
                }
            }
        },
        {
            cols: [
                {},
                {
                    view: "pager",
                    id: "quoteTablePager",
                    size: 25,
                    group: 5,
                    template: function (obj, common) {
                        console.log(obj)
                        var size = obj.size || 1;
                        var items = obj.items || 0;
                        var current = (obj.page || 0) + 1;
                        var total = Math.max(1, Math.ceil(items / size));
                        return `
                            ${common.first()} 
                            ${common.prev()} 
                            <span style='padding: 0 10px;'>Page ${current} of ${total}</span> 
                            ${common.next()} 
                            ${common.last()}
                        `;
                    },
                    hidden: false
                },
                {}
            ]
        }
    ]
};

/* webix.ui({
    view: "window",
    id: "quoteWindow",
    head: "Quote Information",
    width: 725,
    height: 900,
    position: "center",
    modal: true,
    close: true,
    body: {
        view: "form",
        id: "quoteForm",
        elementsConfig: {
            labelWidth: 180,
            bottomPadding: 18
        },
        rules: {
            "description": webix.rules.isNotEmpty,
            "total_amount": function(value) {
                return !isNaN(value) && parseFloat(value) >= 0;
            },
            "status": webix.rules.isNotEmpty,
            "completion_date": webix.rules.isNotEmpty,
            "client_id": webix.rules.isNotEmpty
        },
        elements: [
            {
                view: "fieldset",
                label: "Quote Details",
                body: {
                    rows: [
                        { view: "text", label: "Project Description", name: "description", invalidMessage: "Project description is required" },
                        { view: "text", label: "Total Amount", name: "total_amount", invalidMessage: "Please enter a valid amount" },
                        {
                            view: "combo",
                            label: "Status",
                            name: "status",
                            options: ["Pending", "In Progress", "Completed"],
                            invalidMessage: "Status is required"
                        },
                        {
                            view: "datepicker",
                            label: "Expected Completion Date",
                            name: "completion_date",
                            stringResult: true,
                            format: "%Y-%m-%d",
                            invalidMessage: "Date is required"
                        }
                    ]
                }
            },
            {
                view: "fieldset",
                label: "Client Details",
                body: {
                    rows: [   
                        {
                            view: "combo",
                            label: "Client Name",
                            name: "client_id",
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
                                        $$("quoteForm").setValues({
                                            contact_number: clientData.contact_number,
                                            email: clientData.email,
                                            address_line: clientData.address_line,
                                            city: clientData.city,
                                            postcode: clientData.postcode
                                        }, true);
                        
                                        // Prevent further typing
                                        this.getInputNode().setAttribute("readonly", true);
                                    }
                                }
                            }
                        },                                                 
                        { view: "text", label: "Contact Number", name: "contact_number", invalidMessage: "Contact number is required and must be numeric", readonly: true  },
                        { view: "text", label: "Email", name: "email", invalidMessage: "Please enter a valid email address", readonly: true  },
                        { view: "textarea", label: "Address Line", name: "address_line", invalidMessage: "Address is required", readonly: true  },
                        { view: "text", label: "City", name: "city", invalidMessage: "City is required", readonly: true  },
                        { view: "text", label: "Postcode", name: "postcode", invalidMessage: "Postcode is required", readonly: true  }
                    ]
                }
            },
            {
                margin: 10,
                cols: [
                    {},
                    {
                        view: "button",
                        id: "saveQuoteBtn",
                        value: "Save Quote",
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
}); */


