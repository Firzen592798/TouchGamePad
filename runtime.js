// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.TouchGamepad = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	function detectmob() { 
	 if( navigator.userAgent.match(/Android/i)
	 || navigator.userAgent.match(/webOS/i)
	 || navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/iPad/i)
	 || navigator.userAgent.match(/iPod/i)
	 || navigator.userAgent.match(/BlackBerry/i)
	 || navigator.userAgent.match(/Windows Phone/i)
	 ){
		return true;
	  }
	 else {
		return false;
	  }
	}
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.TouchGamepad.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
		this.texture_img = new Image();
		this.texture_img["idtkLoadDisposed"] = true;
		this.texture_img.src = this.texture_file;
		this.texture_img.cr_filesize = this.texture_filesize;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		//this.direction = new Array(8);
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	function getStyle(el,styleProp) {
		var result;
		if(el.currentStyle) {
			result = el.currentStyle[styleProp];
		} else if (window.getComputedStyle) {
			result = document.defaultView.getComputedStyle(el,null)
										.getPropertyValue(styleProp);
		} else {
			result = 'unknown';
		}
		return result;
	}
	
	instanceProto.drawGradient = function(x, y){
		console.log(x, y);
		var ctx = this.elem.getContext('2d');
		console.log(x, y, this.touchRadius, this.height, this.width);
		var grd=ctx.createRadialGradient(x, y, this.touchRadius, this.height/2,this.width/2,(this.height + this.width) / 4 );
		grd.addColorStop(0, this.gradientColor);
		grd.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.save();
		ctx.fillStyle = grd;
		ctx.drawImage(this.texture_img, 0, 0,  this.width, this.height);
		ctx.fillRect(0, 0, this.width, this.height);
	}
	
	instanceProto.clearGradient = function(ctx){
		//ctx.globalAlpha = 0.5;
		var grd=ctx.createRadialGradient(this.width/2,this.height/2, this.touchRadius,this.height/2,this.width/2,(this.height + this.width) / 4 );
		grd.addColorStop(0, this.gradientColor);
		grd.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.save();
		ctx.fillStyle=grd;
		ctx.drawImage(this.texture_img, 0, 0,  this.width, this.height);
	    ctx.fillRect(0, 0, this.width, this.height);
	}
	

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{	
		//variables
		var self = this;
		this.downmouse = false;
		this.ongoingTouches = new Array();
		this.canvasTam = (this.width + this.height) / 2;
		this.direction = new Array(8);
		this.axisX = 0;
		this.axisY = 0;
		//properties
		this.minimumDistance = this.properties[0];
		this.directions = this.properties[1];
		this.touchRadius = this.properties[2];
		this.gradientColor = this.properties[3];
		this.texture_img = this.type.texture_img;
		this.maxDistance = this.properties[4];
		this.detectMobile = this.properties[5];
		for(var i = 0; i < 8; i++){
			this.direction[i] = false;
		}
		//this.direction[1] = true;
		
		//this.direction = 1;
		// define CSS
		//var style_css = "<style type=\"text/css\">  .imagebutton{ cursor: default; } </style>";
		//jQuery(style_css).appendTo("head");
			
		// create gamepad	
		this.elem = document.createElement("canvas");
		this.elem.setAttribute("id", "canvass");
		
		this.log = document.createElement("div");
		this.log.setAttribute("id", "log");
		
		jQuery(this.log).appendTo(this.runtime.canvasdiv);
		if(detectmob() || this.detectMobile == 1){
			jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
			
			//console.log(getStyle(canvass, "width"));
			
			//this.elem.width = this.runtime.canvasdiv.offsetWidth;
			//this.elem.height = this.runtime.canvasdiv.offsetHeight;
			this.elem.width = this.canvasTam;
			this.elem.height = this.canvasTam;
			
			this.elem.addEventListener("mousedown", doMouseDown, false);
			document.addEventListener("mouseup", doMouseUp, false);
			document.addEventListener("mousemove", doMouseMove, false);
			
	        document.addEventListener("touchstart", doTouchStart, false);
			document.addEventListener("touchend", doTouchEnd, false);
			document.addEventListener("touchmove", doTouchMove, false);

			var ctx = this.elem.getContext('2d');
			
			document.getElementById(this.elem.id).style.opacity = (this.opacity);
			
			var grd=ctx.createRadialGradient(this.width/2,this.height/2, this.touchRadius,this.height/2,this.width/2,(this.height + this.width) / 4 );
			grd.addColorStop(0, self.gradientColor);
			grd.addColorStop(1, 'rgba(255,255,255,0)');
			
			ctx.fillStyle=grd;
			ctx.globalCompositeOperation = "lighter";
			ctx.fillRect(0, 0, this.width, this.height);
			ctx.drawImage(this.texture_img, 0, 0,  this.width, this.height);
		}
		function log(msg) {
			var p = document.getElementById('log');
			p.innerHTML = msg + "\n" + p.innerHTML;
		}
		
		function doMouseDown(event){
		    var rect = canvass.getBoundingClientRect();
			var mouseX = event.clientX - rect.left;
			var mouseY = event.clientY - rect.top;
			var realX = mouseX - self.canvasTam / 2;
			var realY = mouseY - self.canvasTam / 2;
			
			self.mouseDown(realX, realY);
			self.downmouse = true;
		}
		
		function doMouseMove(event){
			if(self.downmouse == true){ //Is Mouse Down?
				var rect = canvass.getBoundingClientRect();
				var mouseX = event.clientX - rect.left;
				var mouseY = event.clientY - rect.top;
				var realX = mouseX - self.canvasTam / 2;
				var realY = mouseY - self.canvasTam / 2;
				self.mouseMove(realX, realY);
				
			}
			return false;
		}
		
		function doMouseUp(event){
			self.downmouse = false;
			self.mouseUp();
				for(var i = 0; i < 4; i++){
					self.direction[i] = false;
				}
				self.clearGradient(ctx);
				self.axisX = 0;
				self.axisY = 0;
		}
		
		
		
		function doTouchStart(event){
			  var touches = event.changedTouches;
			for(var i = 0; i < touches.length; i++){
				
				var rect = canvass.getBoundingClientRect();
				var touchX = touches[i].pageX - rect.left;
				var touchY = touches[i].pageY - rect.top;
				var realX = touchX - self.canvasTam / 2;
				var realY = touchY - self.canvasTam / 2;
				//alert(realX);
				//alert(realY);
				//alert(self.canvasTam/2)
				
				if(Math.abs(realX) <= self.canvasTam / 2 && Math.abs(realY) <= self.canvasTam/2)
				{
					self.ongoingTouches.push(self.copyTouch(touches[i], true));
					self.mouseDown(realX, realY);
					//alert(ongoingTouches.length+"-"+ongoingTouches);
					//self.downTouch[i] = true;
				}
				else{
					self.ongoingTouches.push(self.copyTouch(touches[i], false));
					//alert(ongoingTouches.length+"-"+ongoingTouches);
					//self.downTouch[i] = false;
					
				}
				
			}
		}
		
		
		function doTouchMove(event){
			
			event.preventDefault();
			var touches = event.changedTouches;
			//alert(touches.length + "-" + self.ongoingTouches.length);
			for(var i = 0; i < touches.length; i++){	
				var idx = self.ongoingTouchIndexById(touches[i].identifier);
				//alert(self.ongoingTouches[idx]);
					if(idx >= 0 && self.ongoingTouches[idx].inCanvas == true){ //Is touch inside canvas?
						var rect = canvass.getBoundingClientRect();
						var touchX = touches[i].pageX - rect.left;
						var touchY = touches[i].pageY - rect.top;
						var realX = touchX - self.canvasTam / 2;
						var realY = touchY - self.canvasTam / 2;
						self.mouseMove(realX, realY);
						//self.ongoingTouches.splice(idx, 1, self.copyTouch(touches[i]));
					}
				}
			return false;
		}
		
		function doTouchEnd(event){
			var touches = event.changedTouches;
			for(var i = 0; i < touches.length; i++){	
				var idx = self.ongoingTouchIndexById(touches[i].identifier);
				//alert(self.ongoingTouchIndexById[idx].inCanvas);
				if(self.ongoingTouches[idx].inCanvas == true){
					self.mouseUp();
					for(var i = 0; i < 4; i++){
						self.direction[i] = false;
					}
					self.clearGradient(ctx);
					self.axisX = 0;
					self.axisY = 0;
					
				}
				self.ongoingTouches.splice(idx, 1);
				
			}
			//self.runtime.trigger(cr.plugins_.TouchGamepad.prototype.cnds.onDirectionReleased, this);
		}
		this.updatePosition();
		window.touchcanvas = this;
		//this.runtime.tickMe(this);
	};
	
	instanceProto.copyTouch = function(touch, insideCanvas) {
	  return { identifier: touch.identifier, inCanvas: insideCanvas};
	}
	
	instanceProto.ongoingTouchIndexById = function(idToFind) {
	  for (var i=0; i < this.ongoingTouches.length; i++) {
		var id = this.ongoingTouches[i].identifier;
		
		if (id == idToFind) {
		  return i;
		}
	  }
	  return -1;    // não econtrado
	}
	
	instanceProto.mouseMove = function(realX, realY){
		var distance = Math.sqrt(Math.pow(realX, 2) + Math.pow(realY, 2));
		var realRadius = this.canvasTam / 2 - this.touchRadius;
		if(distance < this.maxDistance + 80){
				if(distance > realRadius){
					realX = realX * realRadius / distance * 0.9999;
					realY = realY * realRadius / distance * 0.9999;
				}
				var mouseX = realX + this.canvasTam/2;
				var mouseY = realY + this.canvasTam/2;
				this.axisX = Math.round(100 * realX / realRadius);
				this.axisY = Math.round(100 * realY / realRadius);
				console.log("realradius, canvastam, touchradius", realRadius, this.canvasTam, this.touchRadius);
				console.log("AxisX, AxisY", this.axisX, this.axisY);
				
			if(distance > this.minimumDistance){
			if(this.directions == 1){//8 directions?
				if(Math.abs(realY) >= 2 * Math.abs(realX)){
						if(realY < -this.minimumDistance){
							//UP
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[3] = false;
							this.direction[0] = true;
						}else if (realY > this.minimumDistance){
							//DOWN
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[3] = false;
							this.direction[2] = true;
						}else{
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[3] = false;
						}					
					}else if(Math.abs(realY) > Math.abs(realX) / 2){
						if(realX > this.minimumDistance && realY > this.minimumDistance){
							//DOWNRIGHT
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[2] = true;
							this.direction[3] = true;
						}else if(realX > this.minimumDistance && realY < -this.minimumDistance){
							//UPRIGHT
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[0] = true;
							this.direction[3] = true;
						}else if(realX < -this.minimumDistance && realY > this.minimumDistance){
							//DOWNLEFT
							this.direction[0] = false;
							this.direction[3] = false;
							this.direction[1] = true;
							this.direction[2] = true;
						}else if(realX < -this.minimumDistance && realY < -this.minimumDistance){
							//UPLEFT
							this.direction[2] = false;
							this.direction[3] = false;
							this.direction[0] = true;
							this.direction[1] = true;
						}else{
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[3] = false;
						}
					}else if(Math.abs(realY) <= Math.abs(realX) / 2){
						if(realX > this.minimumDistance){
							//RIGHT
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[3] = true;
						}else if(realX < -this.minimumDistance){
							//LEFT
							this.direction[0] = false;
							this.direction[3] = false;
							this.direction[2] = false;
							this.direction[1] = true;
						}else{
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[3] = false;
						}
						
					}
				}else{//4 Directions
					if(Math.abs(realY) >= Math.abs(realX)){
						if(realY < -this.minimumDistance){
							//UP
							this.direction[0] = true;
							this.direction[1] = false;
							this.direction[2] = false;
							this.direction[3] = false;
						}else if (realY > this.minimumDistance){
							//DOWN
							this.direction[2] = true;
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[3] = false;
						}				
					}else if(Math.abs(realY) < Math.abs(realX)){
						if(realX > this.minimumDistance){
							//RIGHT
							this.direction[3] = true;
							this.direction[0] = false;
							this.direction[1] = false;
							this.direction[2] = false;
						}else if(realX < -this.minimumDistance){
							//LEFT
							this.direction[1] = true;
							this.direction[0] = false;
							this.direction[3] = false;
							this.direction[2] = false;
						}
					}
				}
				this.drawGradient(mouseX, mouseY);
					//console.log(self.direction);
			}
		}else{
			this.direction[1] = false;
			this.direction[0] = false;
			this.direction[3] = false;
			this.direction[2] = false;
			this.drawGradient(this.canvasTam/2, this.canvasTam/2);
			this.downmouse = false;
		}
	}
	
	instanceProto.mouseDown = function(realX, realY){
		var distance = Math.sqrt(Math.pow(realX, 2) + Math.pow(realY, 2));
		var realRadius = this.canvasTam / 2 - this.touchRadius;
			if(distance > realRadius){
				realX = realX * realRadius / distance * 0.9999;
				realY = realY * realRadius / distance * 0.9999;
			}
			var mouseX = realX + this.canvasTam/2;
			var mouseY = realY + this.canvasTam/2;
			this.axisX = Math.round(100 * realX / realRadius);
			this.axisY = Math.round(100 * realY / realRadius);
			//console.log("AxisX, AxisY", self.axisX, self.axisY);
			
		if(distance > this.minimumDistance){
		if(this.directions == 1){//8 directions?
			if(Math.abs(realY) >= 2 * Math.abs(realX)){
				if(realY < -this.minimumDistance){
					//UP
					this.direction[0] = true;
					this.direction[1] = false;
					this.direction[2] = false;
					this.direction[3] = false;
				}else if (realY > this.minimumDistance){
					//DOWN
					this.direction[2] = true;
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[3] = false;
				}else{
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[2] = false;
					this.direction[3] = false;
				}				
			}else if(Math.abs(realY) > Math.abs(realX) / 2){
				if(realX > this.minimumDistance && realY > this.minimumDistance){
					//DOWNRIGHT
					console.log(realX, realY);
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[2] = true;
					this.direction[3] = true;
				}else if(realX > this.minimumDistance && realY < -this.minimumDistance){
					//UPRIGHT
					this.direction[0] = true;
					this.direction[1] = false;
					this.direction[2] = false;
					this.direction[3] = true;
				}else if(realX < -this.minimumDistance && realY > this.minimumDistance){
					//DOWNLEFT
					this.direction[0] = false;
					this.direction[1] = true;
					this.direction[2] = true;
					this.direction[3] = false;
				}else if(realX < -this.minimumDistance && realY < -this.minimumDistance){
					//UPLEFT
					this.direction[0] = true;
					this.direction[1] = true;
					this.direction[2] = false;
					this.direction[3] = false;
				}
			}else if(Math.abs(realY) <= Math.abs(realX) / 2){
				if(realX > this.minimumDistance){
					//RIGHT
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[2] = false;
					this.direction[3] = true;
				}else if(realX < -this.minimumDistance){
					//LEFT
					this.direction[0] = false;
					this.direction[2] = false;
					this.direction[3] = false;
					this.direction[1] = true;
				}else{
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[2] = false;
					this.direction[3] = false;
				}
				
			}
		}else{//4 directions
			if(Math.abs(realY) >= Math.abs(realX)){
				if(realY < -this.minimumDistance){
					//UP
					this.direction[0] = true;
					this.direction[1] = false;
					this.direction[2] = false;
					this.direction[3] = false;
				}else if (realY > this.minimumDistance){
					//DOWN
					this.direction[2] = true;
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[3] = false;
				}				
			}else if(Math.abs(realY) < Math.abs(realX)){
				if(realX > this.minimumDistance){
					//RIGHT
					this.direction[3] = true;
					this.direction[0] = false;
					this.direction[1] = false;
					this.direction[2] = false;
				}else if(realX < -this.minimumDistance){
					//LEFT
					this.direction[1] = true;
					this.direction[0] = false;
					this.direction[3] = false;
					this.direction[2] = false;
				}
				
			}
		}
		this.drawGradient(mouseX, mouseY);
		}
	}

	instanceProto.mouseUp = function(){
		this.runtime.trigger(cr.plugins_.TouchGamepad.prototype.cnds.onDirectionReleased, this);
	}
	
	instanceProto.updatePosition = function () 
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
			
		jQuery(this.elem).show();
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	/*
		ctx.strokeStyle = this.lineColor;
		ctx.beginPath();
		for(var y = 32; y <= 480; y = y + 32){
			ctx.moveTo(0, y)
			ctx.lineTo(640, y);
			ctx.closePath();
			ctx.stroke();
		}
	*/
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
		//this.draw(this.runtime.overlay_ctx);
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "Propriedades",
			"properties": [
				{"name": "AutoRelease", "value": this.dx},
				{"name": "this.minimumDistance", "value": this.dy},
				{"name": "Directions", "value": Math.sqrt(this.dx * this.dx + this.dy * this.dy)}
			]
			
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	/*Cnds.prototype.onDirectionSelected = function(direction)
	{
		
		console.log("chamou");
		return true;
		//return this.keyMap[direction];
	};
	*/
	
	// ... other conditions here ...
	
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	cnds.onDirectionSelected = function(dir)
	{
		
		console.log("DirectionSelected");
		return this.direction[dir];
		//window.teste = cnds;
		/*if(direction === this.direction){
		

		return true;
		}else{
		return false;
		}*/		
		//return this.keyMap[direction];
	};
	
	cnds.onDirectionReleased = function()
	{
		console.log("Soltou");
		return true;
	};
	
	cnds.compareAxis = function (axis, comparison, value){
		//return false;
		var axisValue = 0;
		if (axis === 0){
			axisValue = this.axisX;
		}else{
			axisValue = this.axisY;
		}
		//console.log(axisValue, value);
		return cr.do_cmp(axisValue, comparison, value);
		//return cr.do_cmp(axisvalue, comparison, value);
	}
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.AxisValueX = function (ret)
	{
		ret.set_int(this.axisX);
		return;
	};

	Exps.prototype.AxisValueY = function (ret)
	{
		ret.set_int(this.axisY);
		return;
	};
	
	pluginProto.exps = new Exps();

}());