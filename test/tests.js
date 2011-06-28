var data = {};

module("Test preconditions");

test("Plugin loaded", function(){
	ok(jQuery.fn.uploader, "Exists on jQuery.fn");
});

test("File input is on the page", function(){
	ok($("input#file").length > 0, "Can find file input");
});

module("Initialization", {
	setup: function(){
		$("input#file").uploader();
	}
});

test("Initializes on file input", function(){
	ok($("input#file").data("uploader"), "Node has uploader instance in its data.");
});

module("Multiple uploads", {
	setup: function(){
		data = {};
		$("input#file").uploader({maxNumber: 2});
		data.uploader = $("input#file").data("uploader");
		data.label = $("." + data.uploader.options.html.addLabelClass);
	}
});

test("Below the limit", function(){
	ok(data.uploader.canAddFile(), "Can add another file below the limit");
	ok(data.label.is(":visible"), "Add label should be present");
});

test("When at the limit", function(){
	data.uploader.addFile();
	ok(!data.uploader.canAddFile(), "Can't add another file past the limit");
	ok(!data.label.is(":visible"), "Add label should not be present");
});

test("UI click event adds another input", function(){
	var inputs = $("input").length;
	data.label.click();
	equals($("input").length, inputs+1);
});

module("Iframe file transport", {
	setup: function(){
		data = {};
		$("input#file").uploader({maxNumber: 2});
		data.uploader = $("input#file").data("uploader");
		data.dynamicInput = $("input." + data.uploader.options.html.inputClass);
		
		// stub transport selection
		data.uploader.pickTransport = function(){
			return $.uploader.transports.iframe;
		};
	}
});

test("Sets encoding, action, and target", function(){
	var prevIframes = $("iframe"),
		prevForms   = $("form");
		
	data.uploader.sendFile(data.dynamicInput);
	
	var iframe = $("iframe").not(prevIframes),
		form   = $("form").not(prevForms);
		
	equals(1, iframe.length, "1 new iframe created");
	equals(1, form.length, "1 new form created");
	equals(iframe.attr("id"), form.attr("target"), "Form target points to iframe");
});
