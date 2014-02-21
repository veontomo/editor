// app is a callback function or an express application
// module.exports = app;
if (!module.parent) {
		http.createServer(app).listen(process.env.PORT, function(){
		console.log("Server listening on port " + app.get('port'));
	});
}