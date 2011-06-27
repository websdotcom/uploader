(function($){
    $.uploader = function(el, options){
        if(this == window) return new $.uploader(el, options);

        this.$el = $(el);
        this.el = el;

        // Add a reverse reference to the DOM object
        this.$el.data("uploader", this);

        this.init(options);
		return this;
	}
	
	$.extend($.uploader.prototype, {
		init: function(options){
			var self = this; 
	    	this.options = $.extend(true, {},$.uploader.defaultOptions, options);
			this.inputs = [];
			this.addLabel = $("<label>")
								.text("Upload another file")
								.addClass(this.options.html.addLabelClass)
								.insertAfter(this.$el)
								.click(function(){ self.addFile(); });
			this.render();
		},
		render: function(){
			this.$el.hide();
			this.addFile();
			this.hiddenField = $("<input type='hidden'>")
									.addClass(this.options.hiddenFieldName)
									.insertBefore(this.$el);	
		},
		canAddFile: function(){
			return this.options.nextIndex <= this.options.maxNumber;
		},
		addFile: function(){
			if(!this.canAddFile()) return false;
			
			var i = this.options.nextIndex,
				self = this;
			this.addLabel.hide();
			this.inputs.push($("<input type='file'>")
								.addClass(this.options.inputClass)
								.insertBefore(this.$el)
								.change(function() { self.onFileSelected(); }));
													
			this.options.nextIndex++;
			if(this.canAddFile()) this.addLabel.show();
			
			return this.inputs[this.inputs.length-1];
		},
		onFileSelected: function(){
			console.log("file set")
		}
    });

    $.uploader.defaultOptions = {
		html: {
			addLabelClass: 	 "uploader-add-label",
			inputClass: 	 "uploader-input",
			hiddenFieldName: "uploader-file-ids"
		},
		maxNumber: 1,				// maximum images to upload within form
		addLabel: "Add another", 	// text on the label 
		nextIndex: 1				// first local index
    };

    $.fn.uploader = function(options){
        return this.each(function(){
            return new $.uploader(this, options);
        });
    };

})(jQuery);