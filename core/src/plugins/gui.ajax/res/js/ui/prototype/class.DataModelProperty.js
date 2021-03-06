/*
 * Copyright 2007-2013 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

Class.create("DataModelProperty", {

    __implements: ["IAjxpWidget"],

    initialize: function(element, options){
        this.element = element;
        this.element.ajxpPaneObject = this;
        options = Object.extend({
            dmID: "ajaxplorer-global"
        }, options);
        var dm;
        if(options.dmID == "ajaxplorer-global"){
            dm = ajaxplorer.getContextHolder();
        }else if($(options.dmID) && $(options.dmID).ajxpPaneObject && $(options.dmID).ajxpPaneObject.getDataModel){
            dm = $(options.dmID).ajxpPaneObject.getDataModel();
        }
        if(!dm) return;
        this.observer = function(){
            switch (options.property){
                case "root_children":
                    var l = ProtoCompat.map2values(dm.getRootNode().getChildren()).length;
                    element.update(l?l:'');
                    break;
                case "root_label":
                    element.update(he.escape(dm.getRootNode().getLabel()));
                    break;
                case "metadata":
                    if(options.metadata_sum){
                        var sum = 0;
                        ProtoCompat.map2values(dm.getRootNode().getChildren()).each(function(c){
                            if(c.getMetadata().get(options.metadata_sum)) sum += parseInt(c.getMetadata().get(options.metadata_sum));
                        });
                        element.update(sum?sum:'');
                    }
                default:
                    break;
            }


        }.bind(this);
        dm.getRootNode().observe("loaded", this.observer);
        this.dm = dm;
    },

    resize : function(){},
    showElement : function(show){},
    getDomNode : function(){},
    destroy : function(){
        if(this.dm && this.dm.getRootNode()){
            this.dm.getRootNode().stopObserving(this.observer);
        }
        try{
            pydio.UI.removeInstanceFromCache(this.element.id);
        }catch(e){}
        this.element = null;
    }


});