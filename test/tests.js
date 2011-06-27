var data = {};

module("Test preconditions");

test("Plugin loaded", function(){
	ok(jQuery.fn.uploader, "Exists on jQuery.fn");
});

test("File input is on the page", function(){
	ok($("input:file").length > 0, "Can find file input");
});

module("Initialization", {
	setup: function(){
		$("input:file").uploader();
	}
});

test("Initializes on file input", function(){
	ok($("input:file").data("uploader"), "Node has uploader instance in its data.");
});

module("Multiple uploads", {
	setup: function(){
		data = {};
		$("input:file").uploader({maxNumber: 2});
		data.uploader = $("input:file").data("uploader");
	}
})

test("Below the limit", function(){
	ok(data.uploader.canAddFile(), "Can add another file below the limit");
})

test("When at the limit", function(){
	data.uploader.addFile();
	ok(!data.uploader.canAddFile(), "Can't add another file past the limit");
	
})