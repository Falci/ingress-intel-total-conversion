// ==UserScript==
// @id             iitc-plugin-portal-time-owner@falci
// @name           IITC plugin: portal time owner
// @author         Falci <falci@falci.me>
// @category       Info
// @version        0.1.1.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Shows how long the portal belongs to the current owner, based on your query.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////

//
// use own namespace for plugin
window.plugin.portalTimeOwner = function() {};
window.plugin.portalTimeOwner.toUpdate = [];

window.plugin.portalTimeOwner.getPortalDays = function(portal){
	var portals = window.plugin.portalTimeOwner.portals;
	var guid = portal.guid || portal;
	
	if(guid in portals){
		return window.plugin.portalTimeOwner.getDaysFrom(portals[guid].date);
	}
	
	return "<em>Unknown</em>";
};

window.plugin.portalTimeOwner.getDaysFrom = function(date){
	var timeDiff = Math.abs(new Date().getTime() - date);
	return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
};

window.plugin.portalTimeOwner.registerColumn = function(){
	window.plugin.portalslist.registerColumn("Time", window.plugin.portalTimeOwner.getPortalDays);
};

window.plugin.portalTimeOwner.onPortalDetailsUpdated = function(data){
	var portals = window.plugin.portalTimeOwner.portals;
	var guid = data.guid;
	window.plugin.portalTimeOwner.update(guid, data.portalDetails.owner);
	
	if(guid in portals){
		var date = portals[guid].date;
		var days = window.plugin.portalTimeOwner.getDaysFrom(date);
		
		$("#randdetails").append("<tr><th colspan='2'>Since</th><td><tt title='"+ (new Date(date))+"'>"+days+" "+(days == 1 ? "day" : "days")+"</tt></td></tr>");
	}
};


window.plugin.portalTimeOwner.update = function(guid, owner){
	var portals = window.plugin.portalTimeOwner.portals;
	
	if(!(guid in portals) || portals[guid].owner != owner){
		portals[guid] = {
			date: new Date().getTime(),
			owner: owner
		};
	}
	
	window.plugin.portalTimeOwner.save(portals);
};

window.plugin.portalTimeOwner.loadPortals = function(){
	var saved = localStorage.getItem('portalTimeOwner') || "{}";
	window.plugin.portalTimeOwner.portals = JSON.parse(saved);
};

window.plugin.portalTimeOwner.save = function(portals){
	 localStorage.setItem('portalTimeOwner', JSON.stringify(portals));
};

window.plugin.portalTimeOwner.onPaneChanged = function(pane){
  	if(pane == "plugin-portaltimeowner")
    	window.plugin.portalTimeOwner.display();
  	else
    	$("#portaltimeowner").remove();
	
};
	
window.plugin.portalTimeOwner.setup  = function() {
	console.log("init Timer Owner");
	
	window.plugin.portalTimeOwner.loadPortals();
	
	
	if(window.useAndroidPanes()) {
	    window.android.addPane("plugin-portaltimeowner", "Time Owner", "ic_action_paste");
	    window.addHook("paneChanged", window.plugin.portalTimeOwner.onPaneChanged);
	} else {
	    $('#toolbox').append(' <a onclick="window.plugin.portalTimeOwner.display()" title="Update all portals in the current view">Time Owner</a>');
	}
	
	try{
		window.addHook('portalDetailsUpdated', window.plugin.portalTimeOwner.onPortalDetailsUpdated);
		
		// integração com portal-list
		if(typeof window.plugin.portalslist.registerColumn == "function"){
			window.plugin.portalTimeOwner.registerColumn();
		}
	} catch(e){}
	
	return true;
};
window.plugin.portalTimeOwner.updateNext = function(){
	if(!window.plugin.portalTimeOwner.toUpdate.length){
		return;
	}
}

window.plugin.portalTimeOwner.display = function(){
	window.plugin.portalTimeOwner.toUpdate = window.portals;
	var html =  "<div style='text-align:center'>";
		html += "<span>0/"+window.portals.length+"</span><br />"
		html += "<process value='0' max='"+window.portals.length+"' />";
		html += "</div>";
		
	window.plugin.portalTimeOwner.updateNext();
	
	
	if(window.useAndroidPanes()) {
		$('<div id="portalslist" class="mobile">' + html + '</div>').appendTo(document.body);
	} else {
		window.dialog({
			html: '<div id="portaltimeowner">' + html + '</div>',
			dialogClass: 'ui-dialog-portaltimeowner',
			title: 'Portal Time Owner',
			id: 'portal-timeowner',
			width: 300
		});
	}
	
};

var setup = window.plugin.portalTimeOwner.setup;

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
