/**
 * Class for creating DOM elements with jQuery.
 * 
 * Every object returned from this class is a jQuery object,
 * so you get all the functionality of a jQuery object, without having
 * to query the DOM every time you need to access that element.
 * 
 * 
 * 1. Include jQuery before using.
 * 2. Declare variable to use (preferably global or in scope of your choice).
 *    var doe = new DOMExtra();
 *    
 * 3. Sample Usage (change text of DIV):
 * 
 * var div = doe.div("Some text", {"class":"something"});
 * $("body").append( div );
 * div.text("I changed the text!");
 * 
 * 4. Sample Usage (click events)
 * var button = doe.button("Click me!").on('click', (ev) => {
 *      button.text("Thanks for clicking me. Have a nice day!");
 * });
 * $("body").append(button);
 * 
 * 5. Sample Usage, table
 * $("body").append(
 *    doe.table(
 *       doe.tbody([
 *          doe.tr([
 *              doe.td("Name", {width:100}),
 *              doe.td("John Smith")
 *          ]),
 *          doe.tr([
 *              doe.td("Age"),
 *              doe.td("25")
 *          ])
 *       ]),
 *       {width:"100%",cellSpacing:0,cellPadding:3}
 *    )
 * );
 *    
 * 
 * @returns {DOMExtra}
 */
function DOMExtra() {}

/**
 * Generates a DOM node with the given tag name.
 * @param {string} name The tag name. Must be a valid a valid XML tag name.
 * @param {string|number|Array|jQuery} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.node = function(name, children, attr, css, data) {
    var n = jQuery(document.createElement(name.toLowerCase()));
    this.append(n, children);
    try {
        if( typeof(attr) == "object" && attr != null) {
            n.attr(attr);
        }
    } catch( er ) { }
    
    try {
        if( typeof(css) == "object" && css != null) {
            n.css(css);
        }
    } catch( er ) { }
    try {
        if( typeof(data) == "object" && data != null) {
            n.data(data);
        }
    } catch( er ) { }
    return n;
};

/**
 * Appends the child nodes in the chain.
 * @param {jQuery} node
 * @param {string|number|Array|jQuery} children
 * @returns {unresolved}
 */
DOMExtra.prototype.append = function(node, children) {
    if( typeof (children) === "string" || typeof (children) === "number" )
        node.append(children);
    else if( children !== null && typeof (children) === "object" ) {
        if( children instanceof jQuery )
            node.append(children);
        else {
            for( var key in children )
                this.append(node, children[key]);
        }
    }

    return node;
};

/**
 * Creates an anchor element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.a = function(children, attr, css, data) {
    return this.node("a", children, attr, css, data);
};

/**
 * Creates an abbr element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.abbr = function(children, attr, css, data) {
    return this.node("abbr", children, attr, css, data);
};

/**
 * Creates an address element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.address = function(children, attr, css, data) {
    return this.node("address", children, attr, css, data);
};

/**
 * Creates an area element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.area = function(children, attr, css, data) {
    return this.node("area", children, attr, css, data);
};

/**
 * Creates an article element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.article = function(children, attr, css, data) {
    return this.node("article", children, attr, css, data);
};

/**
 * Creates an aside element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.aside = function(children, attr, css, data) {
    return this.node("aside", children, attr, css, data);
};

/**
 * Creates an audio element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.audio = function(children, attr, css, data) {
    return this.node("audio", children, attr, css, data);
};

/**
 * Creates a b element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.b = function(children, attr, css, data) {
    return this.node("b", children, attr, css, data);
};

/**
 * Creates a base element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.base = function(children, attr, css, data) {
    return this.node("base", children, attr, css, data);
};

/**
 * Creates a bdi element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.bdi = function(children, attr, css, data) {
    return this.node("bdi", children, attr, css, data);
};

/**
 * Creates a bdo element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.bdo = function(children, attr, css, data) {
    return this.node("bdo", children, attr, css, data);
};

/**
 * Creates a blockquote element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.blockquote = function(children, attr, css, data) {
    return this.node("blockquote", children, attr, css, data);
};

/**
 * Creates a body element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.body = function(children, attr, css, data) {
    return this.node("body", children, attr, css, data);
};

/**
 * Creates a br element.
 * @returns {jQuery}
 */
DOMExtra.prototype.br = function() {
    return this.node("br");
};

/**
 * Creates a button element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.button = function(children, attr, css, data) {
    return this.node("button", children, attr, css, data);
};

/**
 * Creates a canvas element.
 * To get a reference to the canvas context, use jQuery's get(0) function:
 * 
 * var canvas = ui.canvas(null,{width:200,height:200}};
 * var context = canvas.get(0).getContext('2d');
 * 
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.canvas = function(children, attr, css, data) {
    return this.node("canvas", children, attr, css, data);
};

/**
 * Creates a caption element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.caption = function(children, attr, css, data) {
    return this.node("caption", children, attr, css, data);
};

/**
 * Creates a cite element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.cite = function(children, attr, css, data) {
    return this.node("cite", children, attr, css, data);
};

/**
 * Creates a code element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.code = function(children, attr, css, data) {
    return this.node("code", children, attr, css, data);
};

/**
 * Creates a col element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.col = function(children, attr, css, data) {
    return this.node("col", children, attr, css, data);
};

/**
 * Creates a colgroup element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.colgroup = function(children, attr, css, data) {
    return this.node("colgroup", children, attr, css, data);
};

/**
 * Creates a datalist element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.datalist = function(children, attr, css, data) {
    return this.node("datalist", children, attr, css, data);
};

/**
 * Creates a dd element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.dd = function(children, attr, css, data) {
    return this.node("dd", children, attr, css, data);
};

/**
 * Creates a del element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.del = function(children, attr, css, data) {
    return this.node("del", children, attr, css, data);
};

/**
 * Creates a details element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.details = function(children, attr, css, data) {
    return this.node("details", children, attr, css, data);
};

/**
 * Creates a dfn element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.dfn = function(children, attr, css, data) {
    return this.node("dfn", children, attr, css, data);
};

/**
 * Creates a dialog element.
 * (This is not to be confused with jQuery UI dialog.)
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.dialog = function(children, attr, css, data) {
    return this.node("dialog", children, attr, css, data);
};

/**
 * Creates a div element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.div = function(children, attr, css, data) {
    return this.node("div", children, attr, css, data);
};

/**
 * Creates a dl element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.dl = function(children, attr, css, data) {
    return this.node("dl", children, attr, css, data);
};

/**
 * Creates a dt element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.dt = function(children, attr, css, data) {
    return this.node("dt", children, attr, css, data);
};

/**
 * Creates an em element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.em = function(children, attr, css, data) {
    return this.node("em", children, attr, css, data);
};

/**
 * Creates an embded element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.embed = function(children, attr, css, data) {
    return this.node("embed", children, attr, css, data);
};

/**
 * Creates a fieldset element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.fieldset = function(children, attr, css, data) {
    return this.node("fieldset", children, attr, css, data);
};

/**
 * Creates a figcaption element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.figcaption = function(children, attr, css, data) {
    return this.node("figcaption", children, attr, css, data);
};

/**
 * Creates a figure element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.figure = function(children, attr, css, data) {
    return this.node("figure", children, attr, css, data);
};

/**
 * Creates a footer element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.footer = function(children, attr, css, data) {
    return this.node("footer", children, attr, css, data);
};

/**
 * Creates a form element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.form = function(children, attr, css, data) {
    return this.node("form", children, attr, css, data);
};

/**
 * Creates an h1 element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.h1 = function(children, attr, css, data) {
    return this.node("h1", children, attr, css, data);
};

/**
 * Creates an h2 element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.h2 = function(children, attr, css, data) {
    return this.node("h2", children, attr, css, data);
};

/**
 * Creates an h3 element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.h3 = function(children, attr, css, data) {
    return this.node("h3", children, attr, css, data);
};

/**
 * Creates an h4 element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.h4 = function(children, attr, css, data) {
    return this.node("h4", children, attr, css, data);
};

/**
 * Creates a h5 element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.h5 = function(children, attr, css, data) {
    return this.node("h5", children, attr, css, data);
};

/**
 * Creates an h6 element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.h6 = function(children, attr, css, data) {
    return this.node("h6", children, attr, css, data);
};

/**
 * Creates an head element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.head = function(children, attr, css, data) {
    return this.node("head", children, attr, css, data);
};

/**
 * Creates a header element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.header = function(children, attr, css, data) {
    return this.node("header", children, attr, css, data);
};

/**
 * Creates an hr element.
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.hr = function(attr, css, data) {
    return this.node("hr", null, attr, css, data);
};

/**
 * Creates an html elemnent
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.html = function(children, attr, css, data) {
    return this.node("html", children, attr, css, data);
};

/**
 * Creates an i element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.i = function(children, attr, css, data) {
    return this.node("i", children, attr, css, data);
};

/**
 * Creates an iframe element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.iframe = function(children, attr, css, data) {
    return this.node("iframe", children, attr, css, data);
};

/**
 * Creates an img element.
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.img = function(attr, css, data) {
    return this.node("img", null, attr, css, data);
};

/**
 * Creates an input element.
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.input = function(attr, css, data) {
    return this.node("input", null, attr, css, data);
};

/**
 * Creates an ins element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.ins = function(children, attr, css, data) {
    return this.node("ins", children, attr, css, data);
};

/**
 * Creates a kbd element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.kbd = function(children, attr, css, data) {
    return this.node("kbd", children, attr, css, data);
};

/**
 * Creates a label element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.label = function(children, attr, css, data) {
    return this.node("label", children, attr, css, data);
};

/**
 * Creates a legend element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.legend = function(children, attr, css, data) {
    return this.node("legend", children, attr, css, data);
};

/**
 * Creates an li element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.li = function(children, attr, css, data) {
    return this.node("li", children, attr, css, data);
};

/**
 * Creates a link element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.link = function(children, attr, css, data) {
    return this.node("link", children, attr, css, data);
};

/**
 * Creates a main element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.main = function(children, attr, css, data) {
    return this.node("main", children, attr, css, data);
};

/**
 * Creates a map element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.map = function(children, attr, css, data) {
    return this.node("map", children, attr, css, data);
};

/**
 * Creates a mark element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.mark = function(children, attr, css, data) {
    return this.node("mark", children, attr, css, data);
};

/**
 * Creates a menu element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.menu = function(children, attr, css, data) {
    return this.node("menu", children, attr, css, data);
};

/**
 * Creates a menuitem element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.menuitem = function(children, attr, css, data) {
    return this.node("menuitem", children, attr, css, data);
};

/**
 * Creates a meta element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.meta = function(children, attr, css, data) {
    return this.node("meta", children, attr, css, data);
};

/**
 * Creates a meter element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.meter = function(children, attr, css, data) {
    return this.node("meter", children, attr, css, data);
};

/**
 * Creates a nav element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.nav = function(children, attr, css, data) {
    return this.node("nav", children, attr, css, data);
};

/**
 * Creates an ol element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.ol = function(children, attr, css, data) {
    return this.node("ol", children, attr, css, data);
};

/**
 * Creates an optgroup element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.optgroup = function(children, attr, css, data) {
    return this.node("optgroup", children, attr, css, data);
};

/**
 * Creates an option element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.option = function(children, attr, css, data) {
    return this.node("option", children, attr, css, data);
};

/**
 * Creates a p element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.p = function(children, attr, css, data) {
    return this.node("p", children, attr, css, data);
};

/**
 * Creates a param element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.param = function(children, attr, css, data) {
    return this.node("param", children, attr, css, data);
};

/**
 * Creates a picture element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.picture = function(children, attr, css, data) {
    return this.node("picture", children, attr, css, data);
};

/**
 * Creates a pre element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.pre = function(children, attr, css, data) {
    return this.node("pre", children, attr, css, data);
};

/**
 * Creates a progress element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.progress = function(children, attr, css, data) {
    return this.node("progress", children, attr, css, data);
};

/**
 * Creates a q element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.q = function(children, attr, css, data) {
    return this.node("q", children, attr, css, data);
};

/**
 * Creates an rp element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.rp = function(children, attr, css, data) {
    return this.node("rp", children, attr, css, data);
};

/**
 * Creates an rt element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.rt = function(children, attr, css, data) {
    return this.node("rt", children, attr, css, data);
};

/**
 * Creates a ruby element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.ruby = function(children, attr, css, data) {
    return this.node("ruby", children, attr, css, data);
};

/**
 * Creates an s element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.s = function(children, attr, css, data) {
    return this.node("s", children, attr, css, data);
};

/**
 * Creates a samp element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.samp = function(children, attr, css, data) {
    return this.node("samp", children, attr, css, data);
};

/**
 * Creates a script element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.script = function(children, attr, css, data) {
    return this.node("script", children, attr, css, data);
};

/**
 * Creates a section element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.section = function(children, attr, css, data) {
    return this.node("section", children, attr, css, data);
};

/**
 * Creates a select element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.select = function(children, attr, css, data) {
    return this.node("select", children, attr, css, data);
};

/**
 * Creates a small element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.small = function(children, attr, css, data) {
    return this.node("small", children, attr, css, data);
};

/**
 * Creates a source element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.source = function(children, attr, css, data) {
    return this.node("source", children, attr, css, data);
};

/**
 * Creates a span element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.span = function(children, attr, css, data) {
    return this.node("span", children, attr, css, data);
};

/**
 * Creates a strong element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.strong = function(children, attr, css, data) {
    return this.node("strong", children, attr, css, data);
};

/**
 * Creates a style element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.style = function(children, attr, css, data) {
    return this.node("style", children, attr, css, data);
};

/**
 * Creates a sub element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.sub = function(children, attr, css, data) {
    return this.node("sub", children, attr, css, data);
};

/**
 * Creates a summary element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.summary = function(children, attr, css, data) {
    return this.node("summary", children, attr, css, data);
};

/**
 * Creates a sup element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.sup = function(children, attr, css, data) {
    return this.node("sup", children, attr, css, data);
};

/**
 * Creates an svg element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.svg = function(children, attr, css, data) {
    return this.node("svg", children, attr, css, data);
};

/**
 * Creates a table element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.table = function(children, attr, css, data) {
    return this.node("table", children, attr, css, data);
};

/**
 * Creates a tbody element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.tbody = function(children, attr, css, data) {
    return this.node("tbody", children, attr, css, data);
};

/**
 * Creates a td element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.td = function(children, attr, css, data) {
    return this.node("td", children, attr, css, data);
};

/**
 * Creates a template element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.template = function(children, attr, css, data) {
    return this.node("template", children, attr, css, data);
};

/**
 * Creates a textarea element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.textarea = function(children, attr, css, data) {
    return this.node("textarea", children, attr, css, data);
};

/**
 * Creates a tfoot element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.tfoot = function(children, attr, css, data) {
    return this.node("tfoot", children, attr, css, data);
};

/**
 * Creates a th element
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.th = function(children, attr, css, data) {
    return this.node("th", children, attr, css, data);
};

/**
 * Creates a thead element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.thead = function(children, attr, css, data) {
    return this.node("thead", children, attr, css, data);
};

/**
 * Creates a time element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.time = function(children, attr, css, data) {
    return this.node("time", children, attr, css, data);
};

/**
 * Creates a title element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.title = function(children, attr, css, data) {
    return this.node("title", children, attr, css, data);
};

/**
 * Creates a tr element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.tr = function(children, attr, css, data) {
    return this.node("tr", children, attr, css, data);
};

/**
 * Creates a track element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.track = function(children, attr, css, data) {
    return this.node("track", children, attr, css, data);
};

/**
 * Creates a u element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.u = function(children, attr, css, data) {
    return this.node("u", children, attr, css, data);
};

/**
 * Creates a ul element.
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.ul = function(children, attr, css, data) {
    return this.node("ul", children, attr, css, data);
};

/**
 * Creates a video element.
 * To control the video, use jQuery's get(0) method:
 * 
 * var videoElement = ui.video(null,{
 *   width:1280,
 *   height:720,
 *   src:http://www.example.com/video.mp4
 * });
 * var video = videoElement.get(0);
 * 
 * video.play();
 * 
 * @param {string|number|jQuery|Array} children
 * @param {object} attr
 * @param {object} css
 * @param {object} data
 * @returns {jQuery}
 */
DOMExtra.prototype.video = function(children, attr, css, data) {
    return this.node("video", children, attr, css, data);
};

/**
 * Creates a wby element.
 * @returns {jQuery}
 */
DOMExtra.prototype.wbr = function() {
    return this.node("wbr");
};