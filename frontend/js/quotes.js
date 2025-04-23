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
                        $$("quoteForm").clear();
                        $$("quoteWindow").show();
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
                "wxi-eye": function(ev, id) { // View Button
                    isEditMode = false;
                    var item = this.getItem(id);

                    $$("quoteViewWindow").getBody().setValues({
                        id: item.id,
                        first_name: item.first_name,
                        middle_name: item.middle_name,
                        last_name: item.last_name,
                        contact_number: item.contact_number,
                        email: item.email,
                        address_line: item.address_line,
                        city: item.city,
                        postcode: item.postcode,
                        description: item.description,
                        total_amount: item.total_amount,
                        status: item.status,
                        completion_date: item.completion_date
                    });

                    $$("quoteViewWindow").show();
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

webix.ui({
    view: "window",
    id: "quoteWindow",
    head: "Quote Information",
    width: 550,
    height: 750,
    position: "center",
    modal: true,
    close: true,
    body: {
        view: "form",
        id: "quoteForm",
        elementsConfig: {
            labelWidth: 150,
            bottomPadding: 18
        },
        rules: {
            "first_name": webix.rules.isNotEmpty,
            "last_name": webix.rules.isNotEmpty,
            "contact_number": function(value) {
                return webix.rules.isNotEmpty(value) && webix.rules.isNumber(value);
            },
            "email": webix.rules.isEmail,
            "address_line": webix.rules.isNotEmpty,
            "city": webix.rules.isNotEmpty,
            "postcode": webix.rules.isNotEmpty
        }
        ,
        elements: [
            {
                view: "text",
                label: "First Name",
                name: "first_name",
                invalidMessage: "First name is required"
            },
            {
                view: "text",
                label: "Middle Name",
                name: "middle_name"
            },
            {
                view: "text",
                label: "Last Name",
                name: "last_name",
                invalidMessage: "Last name is required"
            },
            {
                view: "text",
                label: "Contact Number",
                name: "contact_number",
                invalidMessage: "Contact number is required and must be numeric"
            },
            {
                view: "text",
                label: "Email",
                name: "email",
                invalidMessage: "Please enter a valid email address"
            },
            {
                view: "textarea",
                label: "Address Line",
                name: "address_line",
                invalidMessage: "Address is required"
            },
            {
                view: "text",
                label: "City",
                name: "city",
                invalidMessage: "City is required"
            },
            {
                view: "text",
                label: "Postcode",
                name: "postcode",
                invalidMessage: "Postcode is required"
            },
            {
                margin: 5,
                cols: [
                    {},
                    { 
                        view: "button",
                        id: "saveQuoteBtn",
                        value: "Save Quote",
                        width: 150,
                        click: function () {
                            const form = $$("quoteForm");
                            if (form.validate()) {
                                const formData = form.getValues();
                                console.log("Validated Data:", formData);
                        
                                if (isEditMode) {
                                    console.log("IS isEditMode")
                                    updateQuote()
                                } else {
                                    console.log("NOT isEditMode")
                                    addQuote()
                                }
                                this.getTopParentView().hide(); // hide window
                            
                        
                            } else {
                                console.log("invalidate")
                                webix.message({ type: "error", text: "Please fill in all required fields correctly." });
                            }
                        }
                    }
                ]
            }
        ]
    }
});



function addQuote() {
    const form = $$("quoteForm");
	if (form.validate()) {
		var formData = form.getValues();
        console.log("ADDDDDD Validated Data:", formData)
    
        webix.ajax().post("http://localhost:8000/backend/quotes.php", formData)
        .then(function (response) {
            webix.message("Quote added successfully!");
            $$("quoteWindow").hide();
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
            $$("quoteWindow").hide();
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

// View Quote Info
webix.ui({
    view: "window",
    id: "quoteViewWindow",
    head: "Quote Details",
    width: 725,
    height: 750,
    position: "center",
    modal: true,
    close: true,
    body: {
        view: "form",
        // scroll: true,
        elementsConfig: {
            labelWidth: 180 // Increase width for all labels
            
        },
        elements: [
            {
                view: "fieldset",
                label: "Quote Details",
                body: {
                    rows: [
                        { view: "text", label: "Quote ID", name: "id", readonly: true },
                        { view: "text", label: "Project Description", name: "description", readonly: true },
                        { view: "text", label: "Total Amount", name: "total_amount", readonly: true },
                        { view: "text", label: "Status", name: "status", readonly: true },
                        { view: "text", label: "Expected Completion Date", name: "completion_date", readonly: true }
                    ]
                }
            },
            {
                view: "fieldset",
                label: "Client Details",
                body: {
                    rows: [
                        { view: "text", label: "First Name", name: "first_name", readonly: true },
                        { view: "text", label: "Middle Name", name: "middle_name", readonly: true },
                        { view: "text", label: "Last Name", name: "last_name", readonly: true },
                        { view: "text", label: "Contact Number", name: "contact_number", readonly: true },
                        { view: "text", label: "Email", name: "email", readonly: true },
                        { view: "textarea", label: "Address Line", name: "address_line", readonly: true },
                        { view: "text", label: "City", name: "city", readonly: true },
                        { view: "text", label: "Postcode", name: "postcode", readonly: true }
                    ]
                }
            }
        ]
    }
});
