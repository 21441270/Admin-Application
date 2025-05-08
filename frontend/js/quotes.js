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
                        const projectName = selectedQuoteContext.project_name
                        const projectId = selectedQuoteContext.project_id
                        const clientId = selectedQuoteContext.client_id
                        const clientName = selectedQuoteContext.client_name
                        console.log("Selected Project & Client:", { projectName, projectId, clientId, clientName });
                    

                        webix.require("js/add-quote.js", function () {
                            const pageContent = $$("pageContent");
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }
    
                            pageContent.addView(addQuoteTemplate);

                            webix.delay(function () {
                                $$("quoteForm").setValues({
                                    project_name: projectName,
                                    project_id: projectId,
                                    client_id: clientId,
                                    client_name: clientName
                                }, true);
                            });
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




