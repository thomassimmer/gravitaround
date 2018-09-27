(function(){var jQuery=require("jquery");require("./core"),require("./widget"),function($,undefined){var lastActive,baseClasses="ui-button ui-widget ui-state-default ui-corner-all",typeClasses="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",formResetHandler=function(){var form=$(this);setTimeout(function(){form.find(":ui-button").button("refresh")},1)},radioGroup=function(radio){var name=radio.name,form=radio.form,radios=$([]);return name&&(name=name.replace(/'/g,"\\'"),radios=form?$(form).find("[name='"+name+"']"):$("[name='"+name+"']",radio.ownerDocument).filter(function(){return!this.form})),radios};$.widget("ui.button",{version:"1.10.4",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,formResetHandler),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var that=this,options=this.options,toggleButton="checkbox"===this.type||"radio"===this.type,activeClass=toggleButton?"":"ui-state-active";null===options.label&&(options.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(baseClasses).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){options.disabled||this===lastActive&&$(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){options.disabled||$(this).removeClass(activeClass)}).bind("click"+this.eventNamespace,function(event){options.disabled&&(event.preventDefault(),event.stopImmediatePropagation())}),this._on({focus:function(){this.buttonElement.addClass("ui-state-focus")},blur:function(){this.buttonElement.removeClass("ui-state-focus")}}),toggleButton&&this.element.bind("change"+this.eventNamespace,function(){that.refresh()}),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(options.disabled)return!1}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(options.disabled)return!1;$(this).addClass("ui-state-active"),that.buttonElement.attr("aria-pressed","true");var radio=that.element[0];radioGroup(radio).not(radio).map(function(){return $(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){if(options.disabled)return!1;$(this).addClass("ui-state-active"),lastActive=this,that.document.one("mouseup",function(){lastActive=null})}).bind("mouseup"+this.eventNamespace,function(){if(options.disabled)return!1;$(this).removeClass("ui-state-active")}).bind("keydown"+this.eventNamespace,function(event){if(options.disabled)return!1;event.keyCode!==$.ui.keyCode.SPACE&&event.keyCode!==$.ui.keyCode.ENTER||$(this).addClass("ui-state-active")}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){$(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(event){event.keyCode===$.ui.keyCode.SPACE&&$(this).click()})),this._setOption("disabled",options.disabled),this._resetButton()},_determineButtonType:function(){var ancestor,labelSelector,checked;this.element.is("[type=checkbox]")?this.type="checkbox":this.element.is("[type=radio]")?this.type="radio":this.element.is("input")?this.type="input":this.type="button","checkbox"===this.type||"radio"===this.type?(ancestor=this.element.parents().last(),labelSelector="label[for='"+this.element.attr("id")+"']",this.buttonElement=ancestor.find(labelSelector),this.buttonElement.length||(ancestor=ancestor.length?ancestor.siblings():this.element.siblings(),this.buttonElement=ancestor.filter(labelSelector),this.buttonElement.length||(this.buttonElement=ancestor.find(labelSelector))),this.element.addClass("ui-helper-hidden-accessible"),checked=this.element.is(":checked"),checked&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",checked)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(baseClasses+" ui-state-active "+typeClasses).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(key,value){if(this._super(key,value),"disabled"===key)return this.element.prop("disabled",!!value),void(value&&this.buttonElement.removeClass("ui-state-focus"));this._resetButton()},refresh:function(){var isDisabled=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");isDisabled!==this.options.disabled&&this._setOption("disabled",isDisabled),"radio"===this.type?radioGroup(this.element[0]).each(function(){$(this).is(":checked")?$(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):$(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return void(this.options.label&&this.element.val(this.options.label));var buttonElement=this.buttonElement.removeClass(typeClasses),buttonText=$("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(buttonElement.empty()).text(),icons=this.options.icons,multipleIcons=icons.primary&&icons.secondary,buttonClasses=[];icons.primary||icons.secondary?(this.options.text&&buttonClasses.push("ui-button-text-icon"+(multipleIcons?"s":icons.primary?"-primary":"-secondary")),icons.primary&&buttonElement.prepend("<span class='ui-button-icon-primary ui-icon "+icons.primary+"'></span>"),icons.secondary&&buttonElement.append("<span class='ui-button-icon-secondary ui-icon "+icons.secondary+"'></span>"),this.options.text||(buttonClasses.push(multipleIcons?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||buttonElement.attr("title",$.trim(buttonText)))):buttonClasses.push("ui-button-text-only"),buttonElement.addClass(buttonClasses.join(" "))}}),$.widget("ui.buttonset",{version:"1.10.4",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(key,value){"disabled"===key&&this.buttons.button("option",key,value),this._super(key,value)},refresh:function(){var rtl="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return $(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(rtl?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(rtl?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return $(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})}(jQuery);var jQuery=require("jquery");require("./core"),require("./widget"),require("./position"),function($){function addDescribedBy(elem,id){var describedby=(elem.attr("aria-describedby")||"").split(/\s+/);describedby.push(id),elem.data("ui-tooltip-id",id).attr("aria-describedby",$.trim(describedby.join(" ")))}function removeDescribedBy(elem){var id=elem.data("ui-tooltip-id"),describedby=(elem.attr("aria-describedby")||"").split(/\s+/),index=$.inArray(id,describedby);-1!==index&&describedby.splice(index,1),elem.removeData("ui-tooltip-id"),describedby=$.trim(describedby.join(" ")),describedby?elem.attr("aria-describedby",describedby):elem.removeAttr("aria-describedby")}var increments=0;$.widget("ui.tooltip",{version:"1.10.4",options:{content:function(){var title=$(this).attr("title")||"";return $("<a>").text(title).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(key,value){var that=this;if("disabled"===key)return this[value?"_disable":"_enable"](),void(this.options[key]=value);this._super(key,value),"content"===key&&$.each(this.tooltips,function(id,element){that._updateContent(element)})},_disable:function(){var that=this;$.each(this.tooltips,function(id,element){var event=$.Event("blur");event.target=event.currentTarget=element[0],that.close(event,!0)}),this.element.find(this.options.items).addBack().each(function(){var element=$(this);element.is("[title]")&&element.data("ui-tooltip-title",element.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var element=$(this);element.data("ui-tooltip-title")&&element.attr("title",element.data("ui-tooltip-title"))})},open:function(event){var that=this,target=$(event?event.target:this.element).closest(this.options.items);target.length&&!target.data("ui-tooltip-id")&&(target.attr("title")&&target.data("ui-tooltip-title",target.attr("title")),target.data("ui-tooltip-open",!0),event&&"mouseover"===event.type&&target.parents().each(function(){var blurEvent,parent=$(this);parent.data("ui-tooltip-open")&&(blurEvent=$.Event("blur"),blurEvent.target=blurEvent.currentTarget=this,that.close(blurEvent,!0)),parent.attr("title")&&(parent.uniqueId(),that.parents[this.id]={element:this,title:parent.attr("title")},parent.attr("title",""))}),this._updateContent(target,event))},_updateContent:function(target,event){var content,contentOption=this.options.content,that=this,eventType=event?event.type:null;if("string"==typeof contentOption)return this._open(event,target,contentOption);(content=contentOption.call(target[0],function(response){target.data("ui-tooltip-open")&&that._delay(function(){event&&(event.type=eventType),this._open(event,target,response)})}))&&this._open(event,target,content)},_open:function(event,target,content){function position(event){positionOption.of=event,tooltip.is(":hidden")||tooltip.position(positionOption)}var tooltip,events,delayedShow,positionOption=$.extend({},this.options.position);if(content){if(tooltip=this._find(target),tooltip.length)return void tooltip.find(".ui-tooltip-content").html(content);target.is("[title]")&&(event&&"mouseover"===event.type?target.attr("title",""):target.removeAttr("title")),tooltip=this._tooltip(target),addDescribedBy(target,tooltip.attr("id")),tooltip.find(".ui-tooltip-content").html(content),this.options.track&&event&&/^mouse/.test(event.type)?(this._on(this.document,{mousemove:position}),position(event)):tooltip.position($.extend({of:target},this.options.position)),tooltip.hide(),this._show(tooltip,this.options.show),this.options.show&&this.options.show.delay&&(delayedShow=this.delayedShow=setInterval(function(){tooltip.is(":visible")&&(position(positionOption.of),clearInterval(delayedShow))},$.fx.interval)),this._trigger("open",event,{tooltip:tooltip}),events={keyup:function(event){if(event.keyCode===$.ui.keyCode.ESCAPE){var fakeEvent=$.Event(event);fakeEvent.currentTarget=target[0],this.close(fakeEvent,!0)}},remove:function(){this._removeTooltip(tooltip)}},event&&"mouseover"!==event.type||(events.mouseleave="close"),event&&"focusin"!==event.type||(events.focusout="close"),this._on(!0,target,events)}},close:function(event){var that=this,target=$(event?event.currentTarget:this.element),tooltip=this._find(target);this.closing||(clearInterval(this.delayedShow),target.data("ui-tooltip-title")&&target.attr("title",target.data("ui-tooltip-title")),removeDescribedBy(target),tooltip.stop(!0),this._hide(tooltip,this.options.hide,function(){that._removeTooltip($(this))}),target.removeData("ui-tooltip-open"),this._off(target,"mouseleave focusout keyup"),target[0]!==this.element[0]&&this._off(target,"remove"),this._off(this.document,"mousemove"),event&&"mouseleave"===event.type&&$.each(this.parents,function(id,parent){$(parent.element).attr("title",parent.title),delete that.parents[id]}),this.closing=!0,this._trigger("close",event,{tooltip:tooltip}),this.closing=!1)},_tooltip:function(element){var id="ui-tooltip-"+increments++,tooltip=$("<div>").attr({id:id,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return $("<div>").addClass("ui-tooltip-content").appendTo(tooltip),tooltip.appendTo(this.document[0].body),this.tooltips[id]=element,tooltip},_find:function(target){var id=target.data("ui-tooltip-id");return id?$("#"+id):$()},_removeTooltip:function(tooltip){tooltip.remove(),delete this.tooltips[tooltip.attr("id")]},_destroy:function(){var that=this;$.each(this.tooltips,function(id,element){var event=$.Event("blur");event.target=event.currentTarget=element[0],that.close(event,!0),$("#"+id).remove(),element.data("ui-tooltip-title")&&(element.attr("title",element.data("ui-tooltip-title")),element.removeData("ui-tooltip-title"))})}})}(jQuery)}).call(this);
