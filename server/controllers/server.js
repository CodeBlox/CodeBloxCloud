var randomstring = require("randomstring");
var ncp = require('ncp').ncp;
var freeport = require('freeport');
var pm2 = require('pm2');
var cmd = require('node-cmd');
var AdmZip = require('adm-zip');
var fs = require('fs');
var slash = require('slash');
var archiver = require('archiver');

var archive = archiver('zip');

var config = require('../config/config');

module.exports.run = function(req, res, next) {
    var uid = randomstring.generate(5);
    
    ncp(config.codeBloxDir + 'Projects/' + req.params.project,
        config.codeBloxDir + 'Servers/' + req.params.project + '-' + uid,
        function (err) {
        if (err) {
            return console.error(err);
        }
    
        console.log('Done copying ' + req.params.project + '-' + uid);
        
        console.log('Do npm install');
        
        cmd.get(
            'npm install --prefix "' + config.codeBloxDir + 'Servers/' + req.params.project + '-' + uid + '"',
            function(data){
                console.log('Finish npm install');
                
                console.log('Search available port...');
        
                freeport(function(err, port) {
                    if (err) throw err
                    console.log('Start server on port ' + port);
                    pm2.connect(function(err) {
                        if (err) {
                            console.error(err);
                            process.exit(2);
                        }

                        pm2.start({
                            script: config.codeBloxDir + 'Servers/' + req.params.project + '-' + uid + '/app.js',
                            args: [port],
                            name: req.params.project + '-' + uid,
                            max_memory_restart : '100M'
                            }, function(err, apps) {
                                console.log('Server started!');

                                var output = fs.createWriteStream(slash(config.tmpDir + req.params.project + '-' + uid + '.zip'));

                                output.on('close', function() {
                                    console.log(archive.pointer() + ' total bytes');
                                    console.log('archiver has been finalized and the output file descriptor has closed.');
                                    
                                    res.json({
                                        port: port,
                                        name: req.params.project + '-' + uid
                                    });
                                });

                                archive.on('error', function(err) {
                                    throw err;
                                });

                                archive.pipe(output);

                               
                                var fileContent = fs.readFileSync(slash(config.codeBloxDir + 'Projects/hijackall.js'), "utf8");
                                fileContent = fileContent.replace('<ADDRESS>', 'http://40.127.177.147:' + port + '/');
                                

                                archive
                                .append(fileContent, { name: 'hijackall.js' })
                                .append(fs.createReadStream(slash(config.codeBloxDir + 'Projects/index.html')), { name: 'index.html' })
                                .finalize();

                                
                                
                                // Disconnect from PM2
                                pm2.disconnect();   
                                if (err) throw err
                        });
                    });
                });
            }
        );
    });
};

module.exports.getServersStatus = function(req, res, next) {
    pm2.connect(function(err) {
        // Get all processes running
        pm2.list(function(err, process_list) {

            var retJson = [];
            
            for (var i = 0; i < process_list.length; i++) {
                retJson.push({
                    pm_id: process_list[i].pm_id,
                    name: process_list[i].name,
                    status: process_list[i].pm2_env.status
                });
            }
            
            res.json(retJson);
            
            // Disconnect from PM2
            pm2.disconnect();   
            if (err) throw err
        });
    })
};