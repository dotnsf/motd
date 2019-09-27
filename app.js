//.  app.js
var express = require( 'express' ),
    Mysql = require( 'mysql' ),
    fs = require( 'fs' ),
    ejs = require( 'ejs' ),
    settings = require( './settings' ),
    app = express();

var mysql = Mysql.createConnection({
  host: settings.mysql_hostname,
  user: settings.mysql_username,
  password: settings.mysql_password,
  database: settings.mysql_database
});
mysql.connect();

app.use( express.static( __dirname + '/public' ) );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );


app.get( '/', function( req, res ){
  getManholeOfTheDay().then( function( motd ){
    res.render( 'index', { motd: motd } );
  }, function( err ){
    res.render( 'index', { motd: null } );
  });
});


function getManholeOfTheDay(){
  return new Promise( function( resolve, reject ){
    var dt = new Date();
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();

    var sql = 'select cast(id as char) as id, text, m, d from dailyimg where m = ' + mm + ' and d = ' + dd;
    mysql.query( sql, function( err, results, fields ){
      if( err ){
        resolve( null );
      }else{
        if( results.length > 0 ){
          var idx = Math.floor( Math.random() * results.length );
          results[idx].text = results[idx].text.split( "\n" ).join( "<br/>" ).split( "\r" ).join( "" );
          resolve( { id: results[idx].id, text: results[idx].text, m: results[idx].m, d: results[idx].d } );
        }else{
          resolve( null );
        }
      }
    });
  });
}


var port = process.env.PORT || 3000;
app.listen( port );
console.log( "server starting on " + port + " ..." );
