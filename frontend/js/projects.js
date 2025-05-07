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
                        /* $$("projectForm").clear();
                        $$("projectWindow").show(); */
                        webix.require("js/add-project.js", function () {
                            const pageContent = $$("pageContent");
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }
                            pageContent.addView(addProjectTemplate);
                        });
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
                                    "expected_completion": data.expected_completion_date
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
                "wxi-pencil": function (ev, id) {
                    const item = this.getItem(id); // get the clicked item (row)
                    console.log(item)

                    // Send project_id to PHP script
                    webix.ajax().post("http://localhost:8000/backend/project_info_details.php", { project_id: item.project_id })
                    .then(function(response) {
                        const data = response.json(); // the JSON object sent back from PHP

                        webix.require("js/edit-project.js", function () {
                            const pageContent = $$("pageContent");
    
                            // Remove existing view if any
                            if (pageContent.getChildViews().length > 0) {
                                pageContent.removeView(pageContent.getChildViews()[0]);
                            }

                            // Add the new view
                            pageContent.addView(editProjectTemplate);
                            $$("editProjectForm").setValues({
                                project_id: item.project_id,
                                project_name: data.project_name,
                                project_description: data.project_description,
                                project_value: data.project_value,
                                project_status: data.status,
                                project_start_date: data.start_date,
                                project_completion_date: data.expected_completion_date,

                                client_id: data.client_id,
                                //client_name: data.client_name,
                                client_email: data.client_email,
                                client_contact_number: data.client_phone,
                                client_address: data.client_address,

                                staff_id: data.staff_id,
                                staff_name: data.project_manager,
                                staff_email: data.staff_email,
                                staff_contact_number: data.staff_contact,
                                staff_address: data.role
                            })

                            const clientCombo = $$("clientSelector");
                            clientCombo.getPopup().getList().waitData.then(() => {
                                const clientMatch = clientCombo.getPopup().getList().find(obj => obj.name === data.client_name)[0];
                                if (clientMatch) {
                                    clientCombo.setValue(clientMatch.id);
                                    clientCombo.getInputNode().setAttribute("readonly", true);
                                    $$("editProjectForm").setValues({ client_id: clientMatch.id }, true);
                                }
                            });

                            // Set staff combo value
                            const staffCombo = $$("staffSelector");
                            staffCombo.getPopup().getList().waitData.then(() => {
                                const staffMatch = staffCombo.getPopup().getList().find(obj => obj.name === data.project_manager)[0];
                                if (staffMatch) {
                                    staffCombo.setValue(staffMatch.id);
                                    staffCombo.getInputNode().setAttribute("readonly", true);
                                    $$("editProjectForm").setValues({ staff_id: staffMatch.id }, true);
                                }
                            });
                            
                        });
                    })
                    .catch(function(err) {
                        console.error("Error loading project details:", err);
                    });
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
                            console.log("Delete Project")
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
