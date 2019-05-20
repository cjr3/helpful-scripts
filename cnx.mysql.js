/**
 * Wrapper for the 'mysql' node.js package, allowing for easy use
 * with generating queries and transactions.
 * 
 * For security reasons, this file should obviously not be available on the client side / front-end.
 * 
 * I originally developed this to work with a system for sports production,
 * which (for now) uses JSON files instead. Eventually, this will be used in it for permanent data.
 * 
 * Sample usage:
 * 
 * var query = new Query();
 * query.addTable('commerce', 'customers', 'c')
 *   .addField('c','ID')
 *   .addField('c','FirstName')
 *   .addField('c",'LastName')
 *   .addOrderBy('c','LastName','ASC')
 * ;
 * 
 * query.execute(function(status, result) {
 *    console.log( result );
 * });
 * 
 * Sample Transaction (using above query):
 * 
 * var john = {'FirstName':'John', 'LastName':'Doe'};
 * var jane = {'FirstName':'Jane', 'LastName':'Doe'};
 * 
 * var tx = new Transaction();
 * tx.setTable('commerce', 'customers')
 *    .addColumn('FirstName')
 *    .addColumn('LastName')
 *    .addRecord(john)
 *    .addRecord(jane)
 * ;
 * tx.insert(function(status){
 *     if(status) {
 *         query.execute(function(status, result){
 *             console.log(result);
 *         });
 *     }
 * }, true);
 * 
 * 
 * @returns {Connection}
 */
function Connection()
{
    //internal connection object
    this.CNX = false;
    
    //database host
    this.HostName = "";
    this.Username = "";
    this.Schema = "";
    this.Password = "";
}

/**
 * Gets the global connection object.
 * @returns {Connection}
 */
function getConnection()
{
    if(!is_object($cnx))
        $cnx = new Connection();
    return $cnx;
}

/**
 * Used for performing transactions on the database.
 * @returns {Transaction}
 */
function Transaction()
{
    this.CNX = getConnection();
    this.TableName = "";
    this.SchemaName = this.CNX.Schema;
    this.Records = [];
    this.Columns = [];
    this.UpdateColumns = [];
    this.Conditions = [];
}

/**
 * Creates a new Query object, for getting
 * records from the database.
 * @returns {Query}
 */
function Query()
{
    this.CNX = getConnection();
    this.Records = [];
    this.Tables = [];
    this.Fields = [];
    this.Conditions = [];
    this.OrderBy = [];
    this.Page = null;
    this.Limit = null;
}

/**
 * Handles errors for the database.
 * @param {Object} err
 * @returns {Connection.prototype}
 */
Connection.prototype.error = function(err)
{
    if(!is_object(err))
        return this;
    switch(err.code)
    {
        default :
            
            break;
    }
};

/**
 * Attempts to connect to the database.
 * This function is called often as the connect_timeout
 * is set to 60 seconds. That may be changed in the future
 * to keep connections alive during a full day.
 * 
 * @param {Function} cb
 * @param {string} user
 * @param {string} pass
 * @param {string} schema
 * @returns {Boolean}
 */
Connection.prototype.connect = function(cb, user, pass, schema)
{
    this.connected(function(status){
        if(status)
        {
            //already connected
            cb( true );
        }
        else
        {
            
            try
            {
                if(!is_string(user))
                    user = this.Username;
                if(!is_string(pass))
                    pass = this.Password;
                if(!is_string(schema))
                    schema = this.Schema;

                 this.CNX = mysql.createConnection({
                    host:this.HostName,
                    user:user,
                    password:pass,
                    schema:schema,
                    supportBigNumbers:true
                 });

                if(is_object(this.CNX))
                {
                    this.Username = user;
                    this.Schema = schema;
                    this.Password = pass;
                    this.CNX.on('error', this.error.bind(this));
                    this.query("USE " + this.Schema, null, function(status){
                        try
                        {
                            this.query("SET @@session.wait_timeout = 60", null, function(status){
                                cb(status);
                            });
                        }
                        catch(er)
                        {
                            
                        }
                    }.bind(this));
                }
                else
                {
                    cb( false, new Error('Failed to create connection object!') );
                    this.CNX = false;
                }
            }
            catch(er)
            {
                this.CNX = false;
                cb( false, er );
            }
        }
    }.bind(this));
    
    return false;
};

/**
 * Queries the database.
 * @param {String} sql
 * @param {Object} values
 * @param {Function} cb
 * @param {Number} index
 * @param {String} columnName
 * @returns {Connection}
 */
Connection.prototype.query = function(sql, values, cb, index, columnName)
{
    this.connect(function(status) {
        if(status === true)
        {
            this.CNX.query(sql, values, function(er, result, fields) {
                if(is_object(er))
                    cb( false, er );
                else
                {
                    if(is_number(index) && result[index])
                    {
                        if(is_string(columnName) && result[index][columnName])
                            cb( true, result[index][columnName], fields );
                        else
                            cb( true, result[index], fields );
                    }
                    else
                        cb( true, result, fields );
                }
            }.bind(this));
        }
        else
        {
            cb( false, status );
        }
    }.bind(this), this.Username, this.Password, this.Schema);
    
    return this;
};

/**
 * Performs a transaction against the database, with rollback on error.
 * 
 * @param {String} sql Transaction query, with ? placeholders for values.
 * @param {Array} values values to pass to the query
 * @param {Function} cb Callback when all processing is complete.
 * @param {bool} commit If true, the transaction is committed on success (default is false)
 * @returns {Connection.prototype}
 */
Connection.prototype.transaction = function(sql, values, cb, commit)
{
    this.connect(function(status){
        if(status === true)
        {
            this.CNX.beginTransaction(function(er){
                if(is_object(er))
                {
                    cb( false, er );
                    return false;
                }
                
                this.query(sql, values, function(status, result){
                    
                    if(status === false)
                    {
                        this.CNX.rollback(function(){
                            cb(false, result);
                        });
                        return false;
                    }
                    
                    if(commit)
                    {
                        this.CNX.commit(function(er){
                            if(er)
                                cb(false, er);
                            else
                                cb(true, result);
                        });
                    }
                    else
                    {
                        cb(true, result);
                    }
                    
                }.bind(this));
                
            }.bind(this));
        }
    }.bind(this));
    return this;
};

/**
 * Ends the database connection.
 * @param {Function} cb
 * @returns {Connection.prototype}
 */
Connection.prototype.end = function(cb)
{
    if(this.CNX && this.CNX.end)
        this.CNX.end(cb);
    this.CNX = null;
    return this;
};

/**
 * Destroys the connection object.
 * @returns {Connection.prototype}
 */
Connection.prototype.destroy = function()
{
    if(this.CNX && this.cnx.destroy)
        this.CNX.destroy();
    this.CNX = null;
    return this;
};

/**
 * Checks if the connection is open.
 * @param {Function} cb
 * @returns {Connection.prototype}
 */
Connection.prototype.connected = function(cb)
{
    if(is_object(this.CNX) && this.CNX.query)
    {
        this.CNX.query("SELECT NOW()", function(er){
            if(is_object(er))
                cb(false, er);
            else
                cb(true);
        });
    }
    else
        cb(false, new Error("Connection object is invalid!"));
    return this;
};

/**
 * Sets the table to perform the transaction on.
 * @param {string} db
 * @param {string} table
 * @returns {Transaction.prototype}
 */
Transaction.prototype.setTable = function(db, table)
{
    this.SchemaName = db;
    this.TableName = table;
    return this;
};

/**
 * Adds a record to be saved.
 * When performing a multi-insert, you can add as many
 * records as can be handled by the transaction.
 * 
 * @param {Object} record
 * @returns {Transaction.prototype}
 */
Transaction.prototype.addRecord = function(record)
{
    this.Records.push( record );
    return this;
};

/**
 * Adds a column to the values to be saved.
 * Every record passed to addRecord() must have the
 * matching records.
 * 
 * When update is true, the column will be updated when
 * there is a duplicate key.
 * 
 * @param {String} name
 * @param {Boolean} update
 * @returns {Transaction.prototype}
 */
Transaction.prototype.addColumn = function(name, update)
{
    this.Columns.push(name);
    if(update === true)
        this.addUpdateColumn(name);
    return this;
};

/**
 * Adds a condition to the update/delete
 * @param {String} column
 * @param {String|Number} value
 * @returns {Transaction.prototype}
 */
Transaction.prototype.addCondition = function(column, value)
{
    this.Conditions[column] = value;
    return this;
};

/**
 * 
 * @param {String} name
 * @returns {Transaction.prototype}
 */
Transaction.prototype.addUpdateColumn = function(name)
{
    this.UpdateColumns[name] = true;
    return this;
};

/**
 * Performs an insert on the database.
 * @param {Function} cb Callback for when the transaction succeeds / fails.
 * @param {Boolean} commit
 */
Transaction.prototype.insert = function(cb, commit)
{
    //Is there better security available for table and schema names?
    var sql = "INSERT INTO `" + this.SchemaName + "`.`" + this.TableName + "` (";
    var values = [];
    var ul = 0;
    for(var key in this.UpdateColumns)
    {
        ul++;
    }
    
    //Is there better security available for column names?
    for(var i=0; i < this.Columns.length;)
    {
        sql += "`" + this.Columns[i] + "`";
        i++;
        if(this.Columns[i])
            sql += ",";
    }
    
    sql += ") VALUES ";

    //prepared statements are safer, I hear.
    for(var r=0; r < this.Records.length;)
    {
        sql += "(";
        for(var i=0; i < this.Columns.length;)
        {
            sql += "?";
            values.push(this.Records[r][this.Columns[i]]);
            i++;
            if(this.Columns[i])
                sql += ",";
        }
        sql += ")";
        r++;
        if(this.Records[r])
            sql += ",";
    }
    
    //gotta catch those duplicate keys and update what we want to!
    if(ul >= 1)
    {
        sql += " ON DUPLICATE KEY UPDATE ";
        var u = 0;
        for(var key in this.UpdateColumns)
        {
            sql += "`" + key + "` = VALUES(`" + key + "`)";
            u++;
            if(u < ul)
                sql += ",";
        }
    }
    
    this.CNX.transaction(sql, values, cb, commit);
    return this;
};

/**
 * @param {Function} cb Callback for when the transaction succeeds / fails.
 * @param {Boolean} commit To commit the transaction immediately or not.
 */
Transaction.prototype.update = function(cb, commit)
{
    var rl = 0;
    var cl = 0;
    var values = [];

    //we must have records to update...
    if(this.Records.length === 1)
    {
        for(var key in this.Records[0])
            rl++;
    }
    else
    {
        cb(false, new Error("No records were supplied!"));
        return this;
    }
    
    //we prefer to have conditions to update... but maybe this can change?
    for(var key in this.Conditions)
        cl++;
    
    if(cl <= 0)
    {
        cb(false, new Error("No conditions were supplied!"));
    }
    else
    {
        //Batter security for schema and table name?
        var sql = "UPDATE `" + this.SchemaName + "`.`" + this.TableName + "` SET ";
        var c = 0;
        
        //prepared statements are helpful, aren't they?
        for(var key in this.Records[0])
        {
            sql += "`" + key + "` = ";
            sql += "?";
            values.push(this.Records[0][key]);
            c++;
            if(c < rl)
                sql += ", ";
        }
        
        sql += " WHERE ";
        
        //why am I preparing? I'm always preparing! Just go
        //...because security is a huge concern with databases, maaaaybe?
        c = 0;
        for(var key in this.Conditions)
        {
            sql += "`" + key + "` = ";
            sql += "?";
            values.push(this.Conditions[key]);
            c++;
            if(c < cl)
                sql += " AND ";
        }
        
        this.CNX.transaction(sql, values, cb, commit);
    }
    
    return this;
};

/**
 * Runs the transaction as a delete transaction.
 * @param {Function} cb Callback for when the transaction succeeds / fails.
 * @param {Boolean} commit Commit transaction or not.
 */
Transaction.prototype.deleteRecords = function(cb, commit)
{
    var cl;
    var values = [];
    for(var key in this.Conditions)
        cl++;
    
    //must we have conditions? can't we just delete everything?
    //No, please don't do that in a production environment...
    if(cl <= 0)
    {
        cb(false, new Error("No conditions were supplied!"));
        return this;
    }
    
    //Again, is there better security possible here?
    var sql = "DELETE FROM `" + this.SchemaName + "`.`" + this.TableName + "` " +
        "WHERE ";
    
    //there I go, preparing again!
    var c = 0;
    for(var key in this.Conditions)
    {
        sql += "`" + key + "` = ";
        sql += "?";
        values.push(this.Conditions[key]);
        c++;
        if(c < cl)
            sql += " AND ";
    }
    
    this.CNX.transaction(sql, values, cb, commit);
    
    return this;
};

/**
 * Adds a field to the result set.
 * @param {String} table
 * @param {String} column
 * @param {String} alias
 * @returns {Query.prototype}
 */
Query.prototype.addField = function(table, column, alias)
{
    this.Fields.push({
        table:table,
        column:column,
        alias:alias,
        type:"field"
    });
    return this;
};

/**
 * Adds a field for combining fields with an alias and separator
 * @param {Array} fields
 * @param {String} alias
 * @param {String} combo
 * @returns {Query.prototype}
 */
Query.prototype.addConcatField = function(fields, alias, combo)
{
    this.Fields.push({
        fields:fields,
        alias:alias,
        combo:combo,
        type:"concat"
    });
    return this;
};

/**
 * Adds a table to the query
 * @param {String} db The schema name
 * @param {String} table The table name
 * @param {String} alias The table alias
 * @param {Object} joins Joins, which ar key-value pairs
 * @param {Boolean} joinType null = straight; true = left; false = right outer
 * @returns {Query.prototype}
 */
Query.prototype.addTable = function(db, table, alias, joins, joinType)
{
    this.Tables.push({
        db:db,
        table:table,
        alias:alias,
        joinType:joinType,
        joins:joins
    });
    
    return this;
};

/**
 * Adds a COUNT() field to the query.
 * @param {String} table
 * @param {String} column
 * @param {String} alias
 * @param {boolean} distinct
 * @returns {Query.prototype}
 */
Query.prototype.count = function(table, column, alias, distinct)
{
    this.Fields.push({
        table:table,
        column:column,
        alias:alias,
        type:"func",
        func:"count",
        distinct:distinct
    });
    
    return this;
};

/**
 * Sets the paging for the query, which is the number of records
 * to retrieve, and which (if more than the limit) to start.
 * @param {Number} page
 * @param {Number} limit
 * @returns {Query.prototype}
 */
Query.prototype.setPaging = function(page, limit)
{
    this.setPage( page );
    this.setLimit( limit );
    return this;
};

/**
 * Sets the page (starting record number) for the query
 * @param {Number} page
 * @returns {Query.prototype}
 */
Query.prototype.setPage = function(page)
{
    if(is_number(page))
        this.Page = parseInt(page);
    else if(page === null)
        this.Page = null;
    return this;
};

/**
 * Sets the number of records to retrieve
 * @param {Number} limit
 * @returns {Query.prototype}
 */
Query.prototype.setLimit = function(limit)
{
    if(is_number(limit))
        this.Limit = parseInt(limit);
    else if(limit === null)
        this.Limit = null;
    return this;
};

/**
 * Adds a field for the given table alias.
 * example: SELECT a.* FROM products a;
 * @param {String} alias
 * @returns {Query.prototype}
 */
Query.prototype.addAllField = function(alias)
{
    this.Fields.push({
        table:alias,
        type:"all"
    });
    return this;
};

/**
 * Adds a subquery to the query, which is another Query object.
 * The alias is used as the field name. The subquery must
 * return only one record, or none.
 * @param {Object} q
 * @param {String} alias
 * @returns {Query.prototype}
 */
Query.prototype.addSubQuery = function(q, alias)
{
    this.Fields.push({
        table:q,
        alias:alias,
        type:"subquery"
    });
    return this;
};

/**
 * Gets an object for joining to another table's column.
 * @param {String} ta
 * @param {String} cn
 * @returns {Object}
 */
Query.prototype.joinTo = function(ta, cn)
{
    return {'table':ta,'column':cn};
};

/**
 * Adds an order by clause.
 * @param {string} alias Table alias
 * @param {string} column Column/Field name
 * @param {string} direction ASC|DESC
 * @returns {Query.prototype}
 */
Query.prototype.addOrderBy = function(alias, column, direction)
{
    this.OrderBy.push({
        alias:alias,
        column:column,
        direction:direction
    });
    return this;
};

/**
 * Adds a condition to the WHERE clause.
 * @param {string} table table alias
 * @param {String} column Colum/Field
 * @param {mixed} value 
 * @param {String} operator comparison operator
 * @param {String} combo how to combine with previous conditions (AND, OR, etc.)
 * @returns {Query.prototype}
 */
Query.prototype.addParam = function(table, column, value, operator, combo)
{
    if(!is_string(operator))
        operator = "=";
    if(!is_string(combo) || combo === "")
        combo = "AND";
    this.Conditions.push({
        table:table,
        column:column,
        value:value,
        operator:operator,
        combo:combo,
        type:"param"
    });
    return this;
};

/**
 * Adds a <> condition to the WHERE clause.
 * @returns {Query.prototype}
 */
Query.prototype.notEqual = function(table, column, value, combo)
{
    return this.addParam(table, column, value, "<>", combo);
};

/**
 * Adds a LIKE condition to the WHERE clause (left and right side comparison, %LIKE%)
 * @returns {Query.prototype}
 */
Query.prototype.like = function(table, column, value, combo)
{
    return this.addParam(table, column, value, "LIKE", combo);
};

/**
 * Adds a >= condition to the WHERE clause
 * @returns {Query.prototype}
 */
Query.prototype.greaterEqual = function(table, column, value, combo)
{
    return this.addParam(table, column, value, ">=", combo);
};

/**
 * Adds a <= condition to the WHERE clause
 * @returns {Query.prototype}
 */
Query.prototype.lessEqual = function(table, column, value, combo)
{
    return this.addParam(table, column, value, "<=", combo);
};

/**
 * Adds a > condition to the WHERE clause
 * @returns {Query.prototype}
 */
Query.prototype.greaterThan = function(table, column, value, combo)
{
    return this.addParam(table, column, value, ">", combo);
};

/**
 * Adds a < condition to the WHERE clause
 * @returns {Query.prototype}
 */
Query.prototype.lessThan = function(table, column, value, combo)
{
    return this.addParam(table, column, value, "<", combo);
};

/**
 * Starts a grouping of conditions in the WHERE clause
 * (helpful for combinations of AND and OR).
 * @param {String} combo
 * @returns {Query.prototype}
 */
Query.prototype.startGroup = function(combo)
{
    this.Conditions.push({
        type:"group_start",
        combo:combo
    });
    
    return this;
};

/**
 * Ends a grouping of conditions in the WHERE clause
 * @param {String} combo
 * @returns {Query.prototype}
 */
Query.prototype.endGroup = function(combo)
{
    this.Conditions.push({
        type:"group_end",
        combo:combo
    });
    
    return this;
};

/**
 * Sets the conditions of this query's WHERE clause.
 * @returns {Query.prototype}
 */
Query.prototype.setParams = function(params)
{
    this.Conditions = params;
    return this;
};

/**
 * Copies the conditions of _this_ Query, to the given Query, _q_
 * 
 * A great example of this is when retrieving records with a total,
 * say for search results, the conditions of the main query can be applied
 * to the subquery that performs the total record count.
 * 
 * @param {Query} q
 */
Query.prototype.copyParams = function(q)
{
    q.setParams( this.Conditions );
    return this;
};

/**
 * Executes the query against the database.
 * @param {Function} cb
 * @returns {Query.prototype}
 */
Query.prototype.execute = function(cb)
{
    var sql = this.getQuery();
    var values = this.getValues();
    var that = this;
    this.CNX.query(sql, values, function(status, result){
        if(status === true)
        {
            that.Records = result;
            that.RecordCount = result.length;
            cb(true, result);
        }
        else
        {
            cb(false, result);
        }
    });
    return this;
};

/**
 * Gets the records from the query, with optional index and column name.
 * 
 * If index is provided, it looks for that record in the record set:
 * 0 = first record, 1 = second, and so on...
 * 
 * If column and index are provided, the return value is that field/column in the matching row.
 * 
 * If neither index/column is provided, then the records are returned.
 * If no records exist, then NULL is returned.
 */
Query.prototype.get_results = function(index, column)
{
    if(this.Records.length <= 0)
        return null;
    if(is_number(index) && this.Records[index])
    {
        if(is_string(column))
        {
            if(this.Records[index][column])
                return this.Records[index][column];
            return null;
        }
        return this.Records[index];
    }
    return this.Records;
};

/**
 * Gets a string representation of the query.
 */
Query.prototype.getQuery = function()
{
    var sql = "SELECT ";
    var i = 0;
    var combo = "";
    for(var key in this.Fields)
    {
        sql += combo;
        sql = this.addQueryField(sql, this.Fields[key], i);
        combo = ", ";
        i++;
    }
    
    sql += " FROM ";
    
    i = 0;
    for(var key in this.Tables)
    {
        sql = this.addQueryTable(sql, this.Tables[key], i);
        i++;
    }
    
    if(this.Conditions.length >= 1)
    {
        var grouping = false;
        sql += " WHERE ";
        i = 0;
        for(var key in this.Conditions)
        {
            combo = "";
            if( i > 0 && is_string(this.Conditions[key].combo) && this.Conditions[key].combo != "")
                combo = this.Conditions[key].combo;
            if(this.Conditions[key].type == "group_start")
            {
                if( i > 0)
                    sql += " AND ";
                sql += " (";
                grouping = true;
            }
            else if(this.Conditions[key].type == "group_end")
            {
                sql += ") ";
                grouping = false;
            }
            else
            {
                if(grouping)
                    combo = "";
                sql = this.addQueryCondition(sql, this.Conditions[key], combo);
                grouping = false;
            }
            i++;
        }
    }
    
    if(this.OrderBy.length >= 1)
    {
        sql += " ORDER BY ";
        combo = "";
        for(var key in this.OrderBy)
        {
            sql = this.addQueryOrderBy(sql, this.OrderBy[key], combo);
            combo = ", ";
        }
    }
    
    if(is_number(this.Page) && is_number(this.Limit))
    {
        var start = parseInt(this.Page);
        var end = parseInt(this.Limit);
        
        if(start <= 1)
            start = 0;
        
        if(end > 0)
        {
            if(start > 1)
                start = start * end - (end);
        }
        else
        {
            end = null;
        }
        
        if(is_number(end) && is_number(start))
        {
            sql += " LIMIT " + start + ", " + end;
        }
    }
    
    return sql;
};

/**
 * Adds a field to the query.
 * This should be an internal function only when generating the query!
 * 
 * @param {type} sql
 * @param {type} record
 * @param {type} index
 */
Query.prototype.addQueryField = function(sql, record, index)
{
    var table = (record.table) ? record.table : null;
    var column = (record.column) ? record.column : null;
    var alias = (record.alias) ? record.alias : null;
    if(!is_string(alias) || alias === '')
        alias = null;
    
    if(record.type === 'field')
    {
        if(!is_string(table) && !is_string(column))
            return sql;

        //better security possible?
        sql += " `" + table + "`.`" + column + "` ";
    }
    else if(record.type === 'all')
    {
        if(is_string(table))
            sql += " `" + table + "`.* ";
    }
    else
    {
        switch(record.type)
        {
            case "func" :
                sql = this.addQueryFieldFunction(sql, record, index);
                break;
                
            case "subquery" :
                sql += " (" + record.table.getQuery() + ") ";
                break;
                
            case "concat" :
                sql += " CONCAT(";
                for(var c=0; c < record.fields.length;)
                {
                    sql += " `" + record.fields[c][0] + "`.`" + record.fields[c][1] + "` ";
                    c++;
                    if(record.fields[c])
                    {
                        sql += ", ";
                        if(is_string(record.combo) && record.combo != "")
                            sql += "'" + record.combo + "', ";
                    }
                }
                
                sql += ") ";
                for(var key in record.fields)
                {
                    sql += ""
                }
            break;
                
            default :
                
                break;
        }
    }
    
    if(is_string(alias) && alias != "")
        sql += " as '" + alias + "' ";
    
    return sql;
};

/**
 * Appends a function field to the query.
 * This should only be used internally!
 * 
 */
Query.prototype.addQueryFieldFunction = function(sql, record, index)
{
    sql += " " + record.func + "(";
    if(record.distinct)
        sql += "DISTINCT ";
    
    if(is_object(record.value) && record.value.getQuery)
        sql += " (" + record.value.getQuery() + ") ";
    
    switch(record.func)
    {
        case "DATE_FORMAT" :
            sql += "`" + record.table + "`.`" + record.column + "`, ";
            if(is_object(record.value) && typeof(record.value.getQuery) != "function")
            {
                sql += " `" + record.value.table + "`.`" + record.value.column + "` ";
            }
            else
            {
                sql += " ? ";
            }
            
            break;
            
        default :
            sql += "`" + record.table + "`.`" + record.column + "`";
            break;
    }
    
    sql += ") ";
    if(is_string(record.alias))
        sql += " as '" + record.alias + "' ";
    
    return sql;
};

/**
 * Adds a table to the query.
 * This should only be used internally.
 */
Query.prototype.addQueryTable = function(sql, table, index)
{
    if(index > 0)
    {
        if(table.joinType === true)
            sql += " LEFT ";
        else if(table.joinType === false)
            sql += " RIGHT OUTER ";
        sql += " JOIN ";
    }
    
    sql += "`" + table.db + "`.`" + table.table + "` " + table.alias;
    
    if(is_object(table.joins))
        sql = this.addTableJoin(sql, table, index);
    return sql;
};

/**
 * Adds a JOIN to the query.
 */
Query.prototype.addTableJoin = function(sql, table, index)
{
    sql += " ON(";
    var combo = "";
    for(var key in table.joins)
    {
        sql += combo;
        var join = table.joins[key];
        if(is_object(join))
        {
            sql += " `" + table.alias + "`.`" + key + "` = " +
                "`" + join.table + "`.`" + join.column + "` ";
        }
        else
        {
            sql += " `" + table.alias + "`.`" + key + "` = ? ";
        }
        
        combo = " AND ";
    }
    
    sql += ") ";
    return sql;
};

/**
 * Adds a parameter to the ORDER BY clause.
 * This should only be used internally.
 */
Query.prototype.addQueryOrderBy = function(sql, ob, combo)
{
    sql += combo + " `" + ob.alias + "`.`" + ob.column + "` " + ob.direction + " ";
    return sql;
};

/**
 * Adds a condition to the WHERE clause.
 * This should only be used internally.
 */
Query.prototype.addQueryCondition = function(sql, cond, combo)
{
    if(is_string(combo) && combo != "")
        sql += " " + combo + " ";
    if(is_object(cond.table) && cond.table.getQuery)
    {
        sql += " (" + cond.table.getQuery() + ") ";
    }
    else
    {
        sql += " `" + cond.table + "`.`" + cond.column + "` ";
    }
    
    sql += " " + cond.operator + " ";
    
    if(is_object(cond.value) && cond.value.getQuery)
        sql += " (" + cond.value.getQuery() + ") ";
    else
    {
        switch(cond.operator)
        {
            case "NOT LIKE" :
            case "LIKE" :
                sql += " CONCAT('%',?,'%') ";
                break;
                
            case "LIKE%" :
                sql += " CONCAT(?, '%') ";
                break;
                
            case "%LIKE" :
                sql += " CONCAT('%', ?) ";
                break;
                
            case "IS NOT NULL" :
            
                break;
                
            default :
                sql += " ? ";
                break;
        }
    }
    
    return sql;
};

/**
 * Gets the values of this query.
 * Used primarily for internally generating the prepared statement,
 * this can also be used externally for debugging.
 */
Query.prototype.getValues = function()
{
    var values = [];
    for(var key in this.Fields)
    {
        switch(this.Fields[key].type)
        {
            case "subquery" :
                var v = this.Fields[key].table.getValues();
                for(var vkey in v)
                {
                    values.push(v[vkey]);
                }
                break;
                
            default :
                if(is_string(this.Fields[key].value) || is_number(this.Fields[key].value))
                    values.push(this.Fields[key].value);
                break;
        }
    }
    
    for(var key in this.Tables)
    {
        if(is_object(this.Tables[key].joins))
        {
            for(var j in this.Tables[key].joins)
            {
                var join = this.Tables[key].joins[j];
                if(is_string(join) || is_number(join))
                    values.push(join);
                else if(is_object(join) && join.getValues)
                {
                    var v = join.getValues();
                    for(var vkey in v)
                    {
                        values.push(v[vkey]);
                    }
                }
            }
        }
    }
    
    for(var key in this.Conditions)
    {
        var cond = this.Conditions[key];
        if(cond.operator === "IS NOT NULL")
            continue;
        if(is_string(cond.value) || is_number(cond.value))
            values.push(cond.value);
        else if(is_object(cond.value))
        {
            var v = cond.value.getValues();
            for(var vkey in v)
            {
                values.push(v[vkey]);
            }
        }
    }
    
    return values;
};