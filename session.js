/**
 * Class used for managing sessionStorage data, including restoring it on history changes.
 * 
 * skey should be unique, and valid for a key in standard JSON
 * The Session class creates a top-level property to the sessionStorage object store your session
 * 
 * The key, skey, is set at instantiation.
 * It shouldn't be confused with name (from the set/get methods),
 * which save a value to a specific property of the top-level property:
 * 
 * If skey equals 'Test', then the session object is:
 * {
 *   'Test':[...]
 * }
 * 
 * For a value with the name 'Foo', the stored JSON object looks like this:
 * {
 *   'Test':{
 *          'Foo':'Bar'
 *      }
 * }
 * 
 * @param {string} skey 
 */
function Session(skey)
{
    this.key = skey;
    this.canSave = (sessionStorage && sessionStorage.setItem) ? true : false;
    this.canPush = false;
    this.listeners = [];
    
    try
    {
        if(history && history.pushState)
        {
            this.canPush = true;
            var that = this;
            window.addEventListener("popstate", function(ev){
                that.pop(ev);
            });
        }
        
    }
    catch(er)
    {
        //can't push history state!
    }
}

/**
 * Saves data to the session as a stringified JSON object.
 * @param {string|number} name
 * @param {mixed} value
 * @return {Session.prototype}
 */
Session.prototype.set = function(name, value)
{
    if(!this.canSave)
        return this;
    
    var obj = this.get();
    try
    {
        obj[name] = value;
        sessionStorage.setItem(this.key, JSON.stringify(obj));
    }
    catch(er)
    {
        //console.log(er)
    }
    
    return this;
};

/**
 * Gets the value of the session data.
 * 
 * @param {string} name (optional) If provided, and a string, it returns the value of that key in the stored object.
 * @return {mixed}
 */
Session.prototype.get = function(name)
{
    if(!this.canSave)
        return {};
    
    var obj = {};
    try
    {
        obj = sessionStorage.getItem(this.key);
        if(typeof(obj) === "string")
            obj = JSON.parse(obj);
        else if(obj === null)
            obj = {};
    }
    catch(er)
    {
        obj = {};
    }
    finally
    {
        if(typeof(name) !== "string")
            return obj;
        return obj["" + name + ""];
    }
};

/**
 * Pushes the document's location into history, along with the session values.
 * 
 * This is used as a 'virtual' forward in history. When the user clicks 'back'
 * in their browser / history, the pop() method is triggered, and listening functions
 * will receive the state of the session storage at that point in time.
 */
Session.prototype.push = function()
{
    if(!this.canPush)
        return this;
    history.pushState(this.get(), null, document.location);
    return this;
};

/**
 * Called when the history state changes, and fires off any listeners (callbacks).
 * 
 * Sample callbacks:
 * - Re-submitting search forms when the user clicks back/forward in history.
 * - Scrolling the page when the user clicks forward/backward, referecing the hash element as the anchor to scroll to.
 */
Session.prototype.pop = function(ev)
{
    if(ev.state == null || typeof(ev.state) !== "object")
        return this;
    
    this.set(ev.state);
    for(var key in this.listeners)
    {
        this.listeners[key].call(this, ev.state, key);
    }
    return this;
};

/**
 * Adds a listener (callback, closure, w/e) for when the the history state changes.
 * If key is provided, then the listener can be overridden.
 * @param {function} listener
 * @param {string} key
 */
Session.prototype.add = function(listener, key)
{
    if(typeof(listener) === "function")
    {
        if(typeof(key) === "string")
            this.listeners[key] = listener;
        else
            this.listeners.push(listener);
    }
    return this;
};

/**
 * Clears the session storage for the current domain.
 * You should only use this if you known you can without causing
 * problems for your application.
 * 
 * Useful for:
 * - Removing authentication values.
 * - Resetting an app that relies on sessionStorage.
 */
Session.prototype.reset = function()
{
    sessionStorage.clear();
    return this;
};