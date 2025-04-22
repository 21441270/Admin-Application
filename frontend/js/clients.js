// Variable to track edit mode
var isEditMode = false;

var clientsTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            paddingX: 20,
            elements: [
                { view: "label", label: "Clients", css: "app_header_label", align: "left" },
                {},
                {
                    view: "button",
                    label: "Add Client",
                    type: "form",
                    width: 130,
                    css: "webix_primary",
                    click: function () {
                        isEditMode = false;
                        $$("clientForm").clear();
                        $$("clientWindow").show();
                    }
                }
            ]
        },
        {
            view: "datatable",
            id: "clientsTable",
            url: "http://localhost:8000/backend/clients.php",
            columns: [
                { id: "id", header: "Client ID", width: 100 },
                { id: "name", header: "Client Name", fillspace: true },
                { id: "contact_number", header: "Contact Number", width: 150 },
                { id: "address", header: "Address", fillspace: true },
                { id: "action", header: "Action", template: "<span class='webix_icon wxi-eye'></span> {common.editIcon()} {common.trashIcon()}",width: 100 }
            ],
            select: true,
            resizeColumn: true,
            scrollX: false,
            scrollY: true,
            headerRowHeight: 55,
            rowHeight: 55,
            tooltip: true,
            fillspace: true,
            pager: "clientTablePager",
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
                    console.log("View");

                    var item = this.getItem(id);
                    console.log(item);
                    // Add your view logic here (like opening a modal)
                    $$("clientViewForm").setValues({
                        id: item.id,
                        first_name: item.first_name,
                        middle_name: item.middle_name,
                        last_name: item.last_name,
                        contact_number: item.contact_number,
                        email: item.email,
                        address_line: item.address_line,
                        city: item.city,
                        postcode: item.postcode
                    });
                
                    // $$("clientWindow").getHead().setHTML("View Client"); // Optional: change modal title
                    $$("clientViewWindow").show();
                },
                "wxi-pencil": function(ev, id) { // Edit Button
                    isEditMode = true;

                    var item = this.getItem(id);
                    console.log("Edit")
                    console.log(this)
                    console.log(item)
                    $$("clientForm").setValues({
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
                    $$("clientWindow").show();
                    
                },
                "wxi-trash": function (ev, id) {
                    var item = this.getItem(id);

                    webix.confirm({
                        title: "Delete Client",
                        text: `Are you sure you want to delete <strong>${item.name}</strong>?`,
                        ok: "Yes",
                        cancel: "No",
                        type: "confirm-warning",
                        callback: function (result) {
                            if (result) {
                                // Make the DELETE request with the client ID in the body
                                webix.ajax().del("http://localhost:8000/backend/clients.php", {
                                    id: item.id  // Send the client ID in the request body
                                })
                                .then(function (res) {
                                    webix.message("Client deleted successfully!");
                                    $$("clientsTable").remove(id);
                                })
                                .catch(function (err) {
                                    webix.message({ type: "error", text: "Failed to delete client" });
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
                    id: "clientTablePager",
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
    id: "clientWindow",
    head: "Client Information",
    width: 550,
    height: 750,
    position: "center",
    modal: true,
    close: true,
    body: {
        view: "form",
        id: "clientForm",
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
                        id: "saveClientBtn",
                        value: "Save Client",
                        width: 150,
                        click: function () {
                            const form = $$("clientForm");
                            if (form.validate()) {
                                const formData = form.getValues();
                                console.log("Validated Data:", formData);
                        
                                if (isEditMode) {
                                    console.log("IS isEditMode")
                                    updateClient()
                                } else {
                                    console.log("NOT isEditMode")
                                    addClient()
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



function addClient() {
    const form = $$("clientForm");
	if (form.validate()) {
		var formData = form.getValues();
        console.log("ADDDDDD Validated Data:", formData)
    
        webix.ajax().post("http://localhost:8000/backend/clients.php", formData)
        .then(function (response) {
            webix.message("Client added successfully!");
            $$("clientWindow").hide();
            form.clear();
            $$("clientsTable").clearAll();
            $$("clientsTable").load("http://localhost:8000/backend/clients.php");
        })
        .catch(function (err) {
            webix.message({ type: "error", text: "Failed to add client" });
            console.error("Error:", err);
        });

    } else {
        console.log("invalidate")
        webix.message({ type: "error", text: "Please fill in all required fields correctly." });
    }
}

function updateClient() {
    const form = $$("clientForm");

	if (form.validate()) {
		var formData = form.getValues();
        console.log("UPDATE CLIENT DATA:", formData);
        webix.ajax().put("http://localhost:8000/backend/clients.php", formData)
        .then(function (response) {
            webix.message("Client updated successfully!");
            $$("clientWindow").hide();
            form.clear();
            $$("clientsTable").clearAll();
            $$("clientsTable").load("http://localhost:8000/backend/clients.php");
        })
        .catch(function (err) {
            webix.message({ type: "error", text: "Failed to update client" });
            console.error("Error:", err);
        });


    } else {
        console.log("invalidate")
        webix.message({ type: "error", text: "Please fill in all required fields correctly." });
    }
}

// View Client Info
webix.ui({
    view: "window",
    id: "clientViewWindow",
    head: "Client Details",
    width: 550,
    height: 350,
    position: "center",
    modal: true,
    close: true,
    body: {
        rows: [
            {
                view: "property",
                id: "clientViewForm",
                editable: false,
                nameWidth: 250,
                elements: [
                    // { label:"Client Name", type:"label", align:"center"  }, // CONFIRM
                    { label: "First Name", id: "first_name" },
                    { label: "Middle Name", id: "middle_name" },
                    { label: "Last Name", id: "last_name" },
                    // { label:"Client Contact", type:"label" }, // CONFIRM
                    { label: "Contact Number", id: "contact_number" },
                    { label: "Email", id: "email" },
                    // { label:"Client Address", type:"label" }, // CONFIRM
                    { label: "Address", id: "address_line" },
                    { label: "City", id: "city" },
                    { label: "Postcode", id: "postcode" }
                ]
            },
            {
                cols: [
                    {},
                    {
                        view: "button",
                        value: "Close",
                        width: 100,
                        click: function () {
                            $$("clientViewWindow").hide();
                        }
                    }
                ]
            }
        ]
    }
});
