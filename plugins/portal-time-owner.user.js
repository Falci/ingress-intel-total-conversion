// ==UserScript==
// @id             iitc-plugin-portal-time-owner@falci
// @name           IITC plugin: portal time owner
// @category       Info
// @version        0.0.1.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Show a zoom slider on the map instead of the zoom buttons.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////


// use own namespace for plugin
window.plugin.portalTimeOwner = function() {};
window.plugin.portalTimeOwner.show = function(portal){
	return 1;
}
window.plugin.portalTimeOwner.registerColumn = function(){
	window.plugin.portalslist.registerColumn("Time", window.plugin.portalTimeOwner.show);
};

window.plugin.portalTimeOwner.setup  = function() {
	
	try{
		if(typeof window.plugin.portalslist.registerColumn == "function"){
			window.plugin.portalTimeOwner.registerColumn();
			
			return true;
		}
	} catch(e){}
	
	// log?
	return false;
};

var setup = window.plugin.portalTimeOwner.setup;

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
