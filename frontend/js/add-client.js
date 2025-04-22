var addClientsView = {
    rows: [
        { view: "button", label: "< Return", width: 100 },
        {
            view: "form",
            elementsConfig:{
                labelWidth: 150,
                bottomPadding: 18
            },
            elements:[
                { view:"text", label:"Client Name", name:"client_name" },
                { view:"text", label:"Contact Number", name:"contact_number" },
                { view:"text", label:"Email", name:"email" },
                { view:"textarea", label:"Client Address", name:"client_address" },
                {
                    margin:5,
                    cols:[
                        {},
                        { 
                            view:"button",
                            value:"Save Client",
                            width:150,
                            click:function(){
                                // Save client logic here
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
