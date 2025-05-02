var menu_options  = [
  {id: "1", icon: "mdi mdi-home", value:"Dashboard"},
  // {id: "2", icon: "mdi mdi-file-document", value:"Quote Management"},
  {id: "3", icon: "mdi mdi-folder", value:"Projects"},
  {id: "4", icon: "mdi mdi-account", value:"Clients"}
];

webix.ready(function(){
  var sidebar = webix.ui({
      rows: [
          { view: "toolbar", css:"webix_dark", elements: [
              { view: "button", type: "image", image: "./images/logo.jpg", height: 40, width: 40},
              { view: "label", label: "Admin Application"}
          ]},
          { cols:[
              { view: "sidebar", css:"webix_dark", width:250, data: menu_options, on:{
                  onAfterSelect: function(id){
                      loadPage(id);
                  }
              }},
              { id: "pageContent", rows: [] } // Initialize with empty rows
          ]}
      ]
  });

  // Load the default page
  loadPage("1");
});

function loadPage(id) {
  var pageContent = $$("pageContent");
  console.log(pageContent.getChildViews())
  console.log(pageContent.getChildViews().length)

    if (pageContent.getChildViews().length > 0) {
        pageContent.removeView(pageContent.getChildViews()[0]); // Remove existing view if any
      }
    
  switch(id) {
      case "1":
        webix.require("js/dashboard.js", function(){
          console.log("Page 1");
          pageContent.addView(dashboardTemplate); // Add new view
        });
        break;
      case "2":
        webix.require("js/quotes.js", function(){
          console.log("Page 2");
          pageContent.addView(quotesTemplate); // Add new view
        });
        break;
      case "3":
        webix.require("js/projects.js", function(){
          console.log("Page 3");
          pageContent.addView(projectsTemplate); // Add new view
        });
        break;
      case "4":
        webix.require("js/clients.js", function(){
          console.log("Page 4");
          pageContent.addView(clientsTemplate); // Add new view
        });
        break;
  }
}
