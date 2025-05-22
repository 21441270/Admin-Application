var dashboardTemplate = {
    view: "layout",
    type: "space",
    rows: [
        { 
            view: "label",
            label: "<h2>Dashboard Overview</h2>",
            align: "left",
            css: "header_label",
            height: 50
        },
        { 
            view: "label",
            label: "Welcome back, here's what's happening today.",
            align: "left",
            css: "subheader_label"
        },
        {
            cols: [
                {
                    view: "template",
                    template: "<div><h3>Active Projects</h3><p>25</p></div>",
                    height: 100
                },
                { width: 25 },
                {
                    view: "template",
                    template: "<div><h3>Pending Quotes</h3><p>12</p></div>",
                    height: 100
                },
                { width: 25 },
                {
                    view: "template",
                    template: "<div><h3>Total Clients</h3><p>150</p></div>",
                    height: 100
                },
                { width: 25 },
                {
                    view: "template",
                    template: "<div><h3>Revenue</h3><p>£1,000</p></div>",
                    height: 100
                }
            ]
        },
        { height: 5 }, 
        {
            cols: [
                {
                    view: "list",
                    id: "recentQuotes",
                    css: "recent_quotes",
                    template: "<div><strong>#name#</strong> - <span class='status #status#'>#status#</span></div>",
                    type: {
                        height: 100
                    },
                    data: [
                        { name: "Client Name 1", status: "Pending" },
                        { name: "Client Name 2", status: "Approved" },
                        { name: "Client Name 3", status: "Rejected" }
                    ]
                },
                { width: 25 },
                {
                    view: "template",
                    css: "active_projects",
                    template: "<strong>Active Projects:</strong> No active projects at the moment."
                }
            ]
        }
    ]
};
