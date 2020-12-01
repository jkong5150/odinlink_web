var parsedData;

var getOdinList = function() {
	var request = new XMLHttpRequest();
	var url = "http://35.226.53.214:8080/links"
	//var url = "http://localhost:8080/links"
	request.open('GET', url);

	request.onload = function() {
		var response = request.response;
		parsedData = JSON.parse(response);
		console.log(parsedData);
		createOdinLinkTable(parsedData);
	}
	request.send();
}

var dateEditor = function(cell, onRendered, success, cancel, editorParams){
	//cell - the cell component for the editable cell
	//onRendered - function to call when the editor has been rendered
	//success - function to call to pass the successfuly updated value to Tabulator
	//cancel - function to call to abort the edit and return to a normal cell
	//editorParams - params object passed into the editorParams column definition property

	//create and style editor
	var editor = document.createElement("input");

	editor.setAttribute("type", "date");

	//create and style input
	editor.style.padding = "3px";
	editor.style.width = "100%";
	editor.style.boxSizing = "border-box";

	//Set value of editor to the current value of the cell
	editor.value = moment(cell.getValue(), "DD/MM/YYYY").format("YYYY-MM-DD")

	//set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
	onRendered(function(){
		editor.focus();
		editor.style.css = "100%";
	});

	//when the value has been set, trigger the cell to update
	function successFunc(){
		success(moment(editor.value, "YYYY-MM-DD").format("DD/MM/YYYY"));
	}

	editor.addEventListener("change", successFunc);
	editor.addEventListener("blur", successFunc);

	//return the editor element
	return editor;
};
var createOdinLinkTable = function(parsedData) {
	var table = new Tabulator("#links-table", {
		data:parsedData,           //load row data from array
		layout:"fitDataFill",      //fit columns to width of table
		responsiveLayout:"hide",  //hide columns that dont fit on the table
		tooltips:true,            //show tool tips on cells
		addRowPos:"top",          //when adding a new row, add it to the top of the table
		history:true,             //allow undo and redo actions on the table
		pagination:"local",       //paginate the data
		paginationSize:10,         //allow 7 rows per page of data
		movableColumns:true,      //allow column order to be changed
		resizableRows:true,       //allow row order to be changed
		initialSort:[             //set the initial sort order of the data
			{column:"created_at", dir:"desc"},
		],
		columns:[                 //define the table columns
			{title:"Link Alias", field:"Name", editor:"input"},
			{title:"URL", field:"FullLink", formatter:"link"},
			{title:"TTL", field:"ttl", editor:"input"},
			{title:"One Link ID", field:"one_link_id", editor:"input"},
			{title:"Short Link ID", field:"shortlink_id", editor:"input"},
			{title:"Created", field:"created_at", editor:dateEditor},
			{title:"Updated", field:"updated_at", editor:dateEditor},
		],
	});
}

$("#btnRefresh").click( function(){
	getOdinList();
});

$("#btnCreateLink").click( function(){
	var request = new XMLHttpRequest();
	var url = "http://35.226.53.214:8080/links"
	//var url = "http://localhost:8080/links"
	request.open('POST', url);
	//request.setRequestHeader("authorization","1b3u1l4h0010O00001rswL6QAI1s6h3a2t");//$("#oneLinkApiKey").val());
	request.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
	var body = { "ttl": $("#ttl").val(), 
				"one_link_id":$("#oneLinkID").val(),
				"name":$("#alias").val(),
				"domain":"somedomain.com",
				"author_id":11,
				"APIKey":$("#oneLinkApiKey").val(),
				"is_active":true,
				"data": 
					{ 
						"pid": $("#mediaSource").val(),
						"c": $("#campaign").val(),
						"deep_link_value": $("#deeplinkvalue").val(),
					}
				};

	// var body = { "ttl": "2", 
	// 			"one_link_id":"L3c3",
	// 			"name":"alias",
	// 			"domain":"somedomain.com",
	// 			"author_id":11,
	// 			"is_active":true,
	// 			"data": 
	// 				{ 
	// 					"pid": "mediasource",
	// 					"c": "campaign",
	// 					"deep_link_value": "deeplinkvalue"
	// 				}
	// 			};
	
	request.onload = function() {
		var response = request.response;
		var parsedData = JSON.parse(response);
		getOdinList();
	}
	console.log(JSON.stringify(body));
	request.send(JSON.stringify(body));
});
