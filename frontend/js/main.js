webix.ready(function(){
  checkLogin();
});

function checkLogin() {
  webix.ajax().get("http://localhost:8000/backend/check_session.php", function(text) {
    const res = JSON.parse(text);
    if (res.loggedIn) {
      initApp();
    } else {
      showLoginForm();
    }
  });
}

function showLoginForm() {
    if ($$("loginWindow")) {
    $$("loginWindow").show(); // Reuse existing window if it exists
    return;
  }
  webix.ui({
    view: "window",
    id: "loginWindow",
    width: 400,
    position: "center",
    modal: true,
    head: "Login",
    body: {
      view: "form",
      id: "loginForm",
      elements: [
        { view: "text", name: "username", label: "Username" },
        { view: "text", name: "password", type: "password", label: "Password" },
        {
          cols: [
            { view: "button", value: "Login", css: "webix_primary", click: doLogin },
            { view: "button", value: "Cancel", click: () => $$("loginWindow").hide() }
          ]
        }
      ]
    }
  }).show();
}

function doLogin() {
  const values = $$("loginForm").getValues();
  console.log(values);
  webix.ajax().post("http://localhost:8000/backend/login.php", values, function(text) {
    const res = JSON.parse(text);
    if (res.success) {
      webix.message("Welcome " + values.username);
      $$("loginWindow").hide();
      initApp(); // Load the sidebar + page view
    } else {
      webix.message({ type: "error", text: res.message });
    }
  });
}

// ✅ This is your existing layout — unchanged
function initApp() {
  var menu_options  = [
    {id: "1", icon: "mdi mdi-home", value:"Dashboard"},
    {id: "3", icon: "mdi mdi-folder", value:"Projects"},
    {id: "4", icon: "mdi mdi-account", value:"Clients"}
  ];

  webix.ui({
    rows: [
      { view: "toolbar", css:"webix_dark", elements: [
          { view: "button", type: "image", image: "./images/logo.jpg", height: 40, width: 40},
          { view: "label", label: "Admin Application" },
          {},
          { view: "button", label: "Logout", width: 100, click: doLogout }
      ]},
      { cols:[
          { view: "sidebar", css:"webix_dark", width:250, data: menu_options, on:{
              onAfterSelect: function(id){
                  loadPage(id);
              }
          }},
          { id: "pageContent", rows: [] }
      ]}
    ]
  });

  loadPage("1");
}

function doLogout() {
  webix.ajax().post("http://localhost:8000/backend/logout.php", null, {
  success: function(response) {
    checkLogin(); // Re-check session and redirect if needed
    showLoginForm();
    window.location.reload(); 
    webix.message("Logged out successfully");
  },
  error: function() {
    webix.message({ type: "error", text: "Logout failed" });
  }
});

}

// ✅ Your original function — keep as is
function loadPage(id) {
  var pageContent = $$("pageContent");

  if (pageContent.getChildViews().length > 0) {
    pageContent.removeView(pageContent.getChildViews()[0]);
  }

  switch(id) {
    case "1":
      webix.require("js/dashboard.js", function(){
        pageContent.addView(dashboardTemplate);
      });
      break;
    case "2":
      webix.require("js/quotes.js", function(){
        pageContent.addView(quotesTemplate);
      });
      break;
    case "3":
      webix.require("js/projects.js", function(){
        pageContent.addView(projectsTemplate);
      });
      break;
    case "4":
      webix.require("js/clients.js", function(){
        pageContent.addView(clientsTemplate);
      });
      break;
  }
}
