(function($){
	
	/* Uploader UI */
	
    $.uploader = function(el, options){
        if(this == window) return new $.uploader(el, options);
        return this.init(el, options);
	};	
	
	$.extend($.uploader.prototype, {
		init: function(el, options){
			var self = this; 
	        this.$el = $(el);
	        this.$el.data("uploader", this);
	    	this.options = $.extend(true, {},$.uploader.defaultOptions, options);
			this.inputs = [];
			this.addLabel = $("<label>")
								.text("Upload another file")
								.addClass(this.options.html.addLabelClass)
								.insertAfter(this.$el)
								.click($.proxy(self, "addFile"));
			this.render();
			return this;
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
				self = this,
				$input = $("<input type='file'>").addClass(this.options.inputClass);
				
			this.addLabel.hide();
			this.inputs.push($input);
			$input.insertBefore(this.$el)
					.bind("change", { input: $input }, $.proxy(self, "onFileSelected"));
			
			this.options.nextIndex++;
			if(this.canAddFile()) this.addLabel.show();
			
			return this.inputs[this.inputs.length-1];
		},
		onFileSelected: function(event){
			if(! (event.data && typeof(event.data.input) == "Object")) return;
			this.sendFile(event.data.input);
		},
		pickTransport: function(){
			return $.uploader.transports.iframe;
		},
		sendFile: function(input){
			this.pickTransport()(input, this.options.action, this.options.callback);
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
		nextIndex: 1,				// first local index
		action: "/",
		callback: function(){}
    };

    $.fn.uploader = function(options){
        return this.each(function(){
            return new $.uploader(this, options);
        });
    };

	
	
	/* Uploader Transports:
		@argument form: the form to be submitted
		@argument action: url to post the data to
		@argument onComplete: the callback when everything is done, it takes:
			@argument response: text of the response, or undefined if there is no response
	*/
	$.uploader.transports = {
		iframe: function(input, action, callback){
			var iframeId = idGen("uploader-iframe-"),
				$iframe = $("<iframe>"),
				$input = $(input),
				$form = $("<form>"),
				oldAction = $form.attr("action"),
				oldTarget = $form.attr("target"),
				onComplete = function(){
					if(!callback) return;
					callback($iframe);
					
					$form.remove();
					$iframe.remove();
					callback = undefined;
				};
				
			$iframe.attr("id", iframeId)
				   .css({position:"absolute", top: -10000, left: -10000})
				   .appendTo("body");
					
			$form.attr("encoding", "multipart/form-data")
				 .attr("enctype", "multipart/form-data")
				 .attr("action", action)
				 .attr("target", iframeId)
				 .css({position: "absolute", top:-10000, left: -10000})
				 .appendTo("body")
				 .append($input)
				 .submit();
				
			setTimeout(onComplete, 5000);
			$iframe.load($input, onComplete);
		}
	};

	/* Utilities */
	idGen = (function(){
		idNames = {};
		return function(name){
			return name + (idNames[name] = (idNames[name] || 0) + 1);
		};
	})();
})(jQuery);