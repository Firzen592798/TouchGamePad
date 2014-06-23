//commit 2
function GetPluginSettings()
{
	return {
		"name":			"Touch Gamepad",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"TouchGamepad",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Create an analog stick on screen and retrieve input from touchscreen devices",
		"author":		"Itanildo Augusto/UFRN",
		"help url":		"http://www.scirra.com",
		"category":		"Input",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_size_aces | pf_position_aces | pf_appearance_aces | pf_texture
	};
};

//
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

//
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				

AddComboParamOption("Up");
AddComboParamOption("Left"); 
AddComboParamOption("Down");
AddComboParamOption("Right");
AddComboParam("direction", "Select the direction");
AddCondition(0, 0, "On direction selected", "Input", "On <b>{0}</b> selected", "Triggered when a gamepad key is pressed.", "onDirectionSelected");

AddCondition(1, cf_trigger, "On direction released", "Input", "On direction released", "Triggered when a gamepad key is released.", "onDirectionReleased");

AddComboParamOption("Gamepad X axis");
AddComboParamOption("Gamepad Y axis");
AddComboParam("axis", "Select the gamepad axis.");
AddCmpParam("comparison", "How to select the axis value (ranging from -100 to 100).");
AddNumberParam("value", "The value to compare to, from -100 to 100.");
AddCondition(2, cf_none, "Compare axis", "Input", "Axis <b>{0}</b> {1} {2}", "Test the value of the gamepad's axes.", "compareAxis");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_number, "Axis X Movement", "Axis input value from X", "AxisValueX", "Return axis value  from -100 to 100 for axis X.");
AddExpression(1, ef_return_number, "Axis Y Movement", "Axis input value from Y", "AxisValueY", "Return axis value  from -100 to 100 for axis Y.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_integer,  "MinimumDistance",	0,"Defines minimum distance from center to recognize the movement"),
	new cr.Property(ept_combo, "Directions", "8 directions", "The number of directions of movement available.", "4 directions|8 directions"),
	new cr.Property(ept_link,"Image", lang("project\\misc\\touchgamepad-edit-link"), "Click to edit the object's image.", "firstonly"),
	new cr.Property(ept_integer,"TouchRadius", 30, "Define the radius of touch region when player touchs some region of gamepad"),
	new cr.Property(ept_color, "GradientColor", "rgb(20,20,20)", "Define the gradient color of the TouchGamepad region"),
	new cr.Property(ept_integer, "MaximumDistance", 50, "Define maximum distance beyond circle"),
	new cr.Property(ept_combo, "AutoDetectMobile", "Yes", "Define if your browser should auto detect mobile device then draw the gamepad only if mobile", "Yes|No")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	this.just_inserted = false;
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.just_inserted = true;
	this.instance.SetSize(new cr.vector2(100, 100));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (property_name === "Image")
	{
		this.instance.EditTexture();
	}
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
	renderer.LoadTexture(this.instance.GetTexture());
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}


// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	var texture = this.instance.GetTexture();
	renderer.SetTexture(this.instance.GetTexture());
	
	if (this.just_inserted)
	{
		this.just_inserted = false;
		var sz = texture.GetImageSize();
		this.instance.SetSize(new cr.vector2(sz.x * 2, sz.y * 2));
		RefreshPropertyGrid();		// show new size
	}
	
	// Calculate tiling
	// This ignores cards without NPOT texture support but... meh.  Tiling by repeated quads is a massive headache.
	var texsize = texture.GetImageSize();
	var objsize = this.instance.GetSize();
	var uv = new cr.rect(0, 0, texture.GetImageSize().x, texture.GetImageSize().y);
	
	//renderer.EnableTiling(true);
	renderer.Quad(this.instance.GetBoundingQuad(), this.instance.GetOpacity());
	//renderer.EnableTiling(false);
	
	//renderer.SetTexture(null);
	//var q = this.instance.GetBoundingQuad();
	//renderer.Fill(q, cr.RGB(40, 170, 40)); 
	//renderer.Outline(q,cr.RGB(0, 0, 0));
	//var d = this.instance.GetSize(); // get the instance size
	//cr.quad.prototype.offset.call(q, 0, 6);
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	renderer.ReleaseTexture(this.instance.GetTexture());
}
