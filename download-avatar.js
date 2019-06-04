var request = require('request');
var AuthId  = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
          'User-Agent': 'request',
          'Authorization': AuthId.GITHUB_TOKEN
        }
    };   
      
//   "https://api.github.com/repos/lighthouse-labs/laser_shark/contributors"
    
    request.get(options, function(err, res, body) {
        if (err) {
            console.log("error occured:", err);
        } else if (res.statusCode === 200) {
            var data = JSON.parse(body);
            cb(err, data);
        }
      
    });
};

function downloadImageByURL(url, filePath) {
    request.get(url, filePath)   
    .on('error', function(err){
        throw err;
    })
    .on('response', function (response){
        console.log('Response Status Code: ', response.statusCode);
        console.log('Response Status Message: ', response.statusMessage);
        console.log('Response Headers: ', response.headers['content-type']);
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
    //console.log(typeof result)
    if (!process.argv[2] && !process.argv[3]) {
        console.log("Error input missing")
    }
    result.forEach((element) => {
        downloadImageByURL(element.avatar_url, "./avatars/" + element.login + ".jpg")
    })
});