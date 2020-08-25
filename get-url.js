var Crawler = require('crawler');

const fs = require('fs');

const stream = fs.createWriteStream('links.txt', {flag: 'a'});

const urlList = [];

let page = 1;

while(page <= 5000) {
  let url = `https://infodoanhnghiep.com/Ha-Noi/trang-${page}/`;
  urlList.push(url);
  page += 1;
}

var c = new Crawler({
  maxConnections: 1000,
  rateLimit: 1,
  callback: function(error, res, done) {
    if(error){
      console.log(res.request.uri.href);
    } else{
      var $ = res.$;
      $('.list-company .company-item').each(function() {
        stream.write('https:' + $(this).find('h3.company-name a').attr('href') + '\n');
      });
    }
    done();
  }
});

c.queue(urlList);