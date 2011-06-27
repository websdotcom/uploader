(function($){
    $.uploader = function(el, options){
        var self = this == window ? {} : this;
        self.$el = $(el);
        self.el = el;

        // Add a reverse reference to the DOM object
        self.$el.data("uploader", self);

        self.init = function(){
            self.options = $.extend(true, {},$.uploader.defaultOptions, options);
			self.inputs = [];
			self.addLabel = $("<label>")
								.text("Upload another file")
								.addClass(self.options.html.addLabelClass)
								.insertAfter(self.$el)
								.click(self.addFile);
			self.render();
        };

		self.render = function(){
			self.$el.hide();
			self.addFile();
			self.hiddenField = $("<input type='hidden'>")
									.addClass(self.options.hiddenFieldName)
									.insertBefore(self.$el);
		};
		
		self.canAddFile = function(){
			return self.options.nextIndex <= self.options.maxNumber;
		};
		
		self.addFile = function(){
			if(!self.canAddFile()) return false;
			
			var i = self.options.nextIndex;
			self.addLabel.hide();
			self.inputs.push($("<input type='file'>")
								.addClass(self.options.inputClass)
								.insertBefore(self.$el));
													
			self.options.nextIndex++;
			if(self.canAddFile()) self.addLabel.show();
			
			return self.inputs[self.inputs.length-1];
		};

        self.init();
		return self;
    };

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