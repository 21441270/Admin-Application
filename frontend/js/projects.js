var isEditMode = false;

var projectsTemplate = {
    rows: [
        {
            view: "toolbar",
            height: 60,
            paddingX: 20,
            elements: [
                { view: "label", label: "Projects", css: "app_header_label", align: "left" },
                {},
                {
                    view: "button",
                    label: "Add Project",
                    type: "form",
                    width: 130,
                    css: "webix_primary",
                    click: function () {
                        isEditMode = false;
                        $$("projectForm").clear();
                        $$("projectWindow").show();
                    }
                }
            ]
        },
        {
            view: "datatable",
            id: "projectsTable",
            url: "http://localhost:8000/backend/projects.php",
            columns: [
                { id: "project_id", header: "Project ID", width: 60 },
                { id: "project_name", header: "Project Name", fillspace: true },
                { id: "client_name", header: "Client Name", fillspace: true },
                { id: "project_value", header: "Project Value", width: 150 },
                { id: "description", header: "Description", fillspace: true },
                { id: "start_date", header: "Start Date", width: 130 },
                { id: "expected_completion", header: "Expected Completion", width: 150 },
                { id: "status", header: "Status", width: 120 },
                { id: "team_member", header: "Team Member", fillspace: true },
                { id: "action", header: "Action", template: "<span class='webix_icon wxi-eye'></span> {common.editIcon()} {common.trashIcon()}", width: 120 }
            ],
            select: true,
            resizeColumn: true,
            scrollX: false,
            scrollY: true,
            headerRowHeight: 55,
            rowHeight: 55,
            tooltip: true,
            fillspace: true,
            pager: "projectTablePager",
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
                    webix.ajax().post("http://localhost:8000/backend/project_info_details.php", { project_id: item.project_id })
                    .then(function(response) {
                        const data = response.json(); // the JSON object sent back from PHP

                        webix.require("js/view-project-info.js", function () {
                            const pageContent = $$("pageContent");
    
                            // Remove existing view if any
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }
    
                            // Add the new view
                            pageContent.addView(viewProjectInfoTemplate);
                                $$("projectOverview").setValues({
                                    "project_name": data.project_name,
                                    "status": data.status,
                                    "start_date": data.start_date,
                                    "expected_completion": data.expected_completion
                                });
                
                                $$("clientDetails").setValues({
                                    "client_name": data.client_name,
                                    "client_email": data.client_email,
                                    "client_phone": data.client_phone,
                                    "client_address": data.client_address
                                });

                                $$("description").setValue(data.project_description);
                                $$("project_value").setValue(data.project_value);
                                $$("project_manager").setValue(data.project_manager);
                                $$("role").setValue(data.role);
                                $$("staff_contact").setValue(data.staff_contact);
                                $$("staff_email").setValue(data.staff_email);

                                $$("quote_table").clearAll();
                                $$("quote_table").parse(data.quotes); 
                        });
                    })
                    .catch(function(err) {
                        console.error("Error loading project details:", err);
                    });
                },
                "wxi-pencil": function(ev, id) {
                    isEditMode = true;
                    var item = this.getItem(id);
                    $$("projectForm").setValues(item);
                    $$("projectWindow").show();
                },
                "wxi-trash": function (ev, id) {
                    var item = this.getItem(id);
                    webix.confirm({
                        title: "Delete Project",
                        text: `Are you sure you want to delete <strong>${item.project_name}</strong>?`,
                        ok: "Yes",
                        cancel: "No",
                        type: "confirm-warning",
                        callback: function (result) {
                            if (result) {
                                webix.ajax().del("http://localhost:8000/backend/projects.php", {
                                    project_id: item.project_id
                                })
                                .then(function () {
                                    webix.message("Project deleted successfully!");
                                    $$("projectsTable").remove(id);
                                })
                                .catch(function (err) {
                                    webix.message({ type: "error", text: "Failed to delete project" });
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
                    id: "projectTablePager",
                    size: 25,
                    group: 5,
                    template: function (obj, common) {
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
    id: "projectWindow",
    head: "Project Information",
    width: 600,
    height: 700,
    position: "center",
    modal: true,
    close: true,
    body: {
        view: "form",
        id: "projectForm",
        elementsConfig: {
            labelWidth: 150,
            bottomPadding: 18
        },
        rules: {
            "project_name": webix.rules.isNotEmpty,
            "client_name": webix.rules.isNotEmpty,
            "project_value": webix.rules.isNumber,
            "description": webix.rules.isNotEmpty,
            "start_date": webix.rules.isNotEmpty,
            "expected_completion": webix.rules.isNotEmpty,
            "status": webix.rules.isNotEmpty,
            "team_member": webix.rules.isNotEmpty
        },
        elements: [
            { view: "text", label: "Project Name", name: "project_name", invalidMessage: "Project name is required" },
            { view: "text", label: "Client Name", name: "client_name", invalidMessage: "Client name is required" },
            { view: "text", label: "Project Value", name: "project_value", invalidMessage: "Enter a valid project value" },
            { view: "textarea", label: "Description", name: "description", invalidMessage: "Description is required" },
            { view: "datepicker", label: "Start Date", name: "start_date", stringResult: true, format: "%Y-%m-%d" },
            { view: "datepicker", label: "Expected Completion", name: "expected_completion", stringResult: true, format: "%Y-%m-%d" },
            { view: "combo", label: "Status", name: "status", options: ["Pending", "In Progress", "Completed"] },
            { view: "text", label: "Team Members", name: "team_member", invalidMessage: "Team members are required" },
            {
                margin: 5,
                cols: [
                    {},
                    {
                        view: "button",
                        id: "saveProjectBtn",
                        value: "Save Project",
                        width: 150,
                        click: function () {
                            const form = $$("projectForm");
                            if (form.validate()) {
                                const formData = form.getValues();
                                isEditMode ? updateProject() : addProject();
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
});

function addProject() {
    const form = $$("projectForm");
    if (form.validate()) {
        const formData = form.getValues();
        // Ensure the 'client_name' and 'team_member' are handled correctly.
        // You may need to adapt this to your form if those fields are stored differently.
        webix.ajax().post("http://localhost:8000/backend/projects.php", formData)
        .then(function () {
            webix.message("Project added successfully!");
            $$("projectWindow").hide();
            form.clear();
            $$("projectsTable").clearAll();
            $$("projectsTable").load("http://localhost:8000/backend/projects.php");
        })
        .catch(function (err) {
            webix.message({ type: "error", text: "Failed to add project" });
            console.error("Error:", err);
        });
    }
}

function updateProject() {
    const form = $$("projectForm");
    if (form.validate()) {
        const formData = form.getValues();
        // Include project_id in the update request as needed.
        webix.ajax().put("http://localhost:8000/backend/projects.php", formData)
        .then(function () {
            webix.message("Project updated successfully!");
            $$("projectWindow").hide();
            form.clear();
            $$("projectsTable").clearAll();
            $$("projectsTable").load("http://localhost:8000/backend/projects.php");
        })
        .catch(function (err) {
            webix.message({ type: "error", text: "Failed to update project" });
            console.error("Error:", err);
        });
    }
}

/* webix.ui({
    view: "window",
    id: "projectViewWindow",
    head: "Project Details",
    width: 600,
    height: 450,
    position: "center",
    modal: true,
    close: true,
    body: {
        rows: [
            {
                view: "property",
                id: "projectViewForm",
                editable: false,
                nameWidth: 200,
                elements: [
                    { label: "Project Name", id: "project_name" },
                    { label: "Client Name", id: "client_name" },
                    { label: "Project Value", id: "project_value" },
                    { label: "Description", id: "description" },
                    { label: "Start Date", id: "start_date" },
                    { label: "Expected Completion", id: "expected_completion" },
                    { label: "Status", id: "status" },
                    { label: "Team Members", id: "team_member" }
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
                            $$("projectViewWindow").hide();
                        }
                    }
                ]
            }
        ]
    }
});
 */
