// Template for viewing quote information
var viewQuoteInfoTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            elements: [
                { view: "label", label: "Quote Information", align: "left", css: "header_label" },
                {},
                {
                    view: "button",
                    label: "Back",
                    width: 100,
                    click: function () {
                        webix.require("js/quotes.js", function () {
                            const pageContent = $$("pageContent");
                            pageContent.removeView(pageContent.getChildViews()[0]);
                            pageContent.addView(quotesTemplate);
                        });
                    }
                }
            ]
        },
        {
            view: "form",
            id: "viewQuoteInfoForm",
            scroll: true,
            elements: [
                {
                    rows: [
                        { template: "Quote Details", type: "section" },
                        {
                            view: "property",
                            id: "quoteDetails",
                            height: 165,
                            editable: false,
                            elements: [
                                { label: "Quote ID", type: "text", id: "id" },
                                { label: "Project Description", type: "text", id: "description" },
                                { label: "Total Amount", type: "text", id: "total_amount" },
                                { label: "Status", type: "text", id: "status" },
                                { label: "Start Date", type: "text", id: "start_date" },
                                { label: "Expected Completion Date", type: "text", id: "completion_date" }
                            ]
                        }
                    ]
                },
                { height: 25 },
                {
                    rows: [
                        { template: "Client Details", type: "section" },
                        {
                            view: "property",
                            id: "clientDetails",
                            height: 110,
                            editable: false,
                            elements: [
                                { label: "Client Name", type: "text", id: "client_name" },
                                { label: "Contact Number", type: "text", id: "client_number" },
                                { label: "Email", type: "text", id: "email" },
                                { label: "Address Line", type: "text", id: "address" }
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
                            id: "requirement_table",
                            scrollX: false,
                            footer: true,
                            columns: [
                                { id: "requirement_id", header: "Requirement ID", width: 100 },
                                { id: "requirement_text", header: "Description", fillspace: true },
                                { id: "requirement_created_at", header: "Created Date", width: 180 }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
