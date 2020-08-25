var fs = require('fs');

var urlList = fs.readFileSync('links.txt').toString().split('\n');

var Crawler = require('crawler');

var createCsvWriter = require('csv-writer').createObjectCsvWriter;

var csvWriter = createCsvWriter({
  path: 'data.csv',
  header: [
    {id: 'Tên doanh nghiệp', title: 'Tên doanh nghiệp'},
    {id: 'Tên giao dịch', title: 'Tên giao dịch'},
    {id: 'Mã số thuế', title: 'Mã số thuế'},
    {id: 'Tình trạng hoạt động', title: 'Tình trạng hoạt động'},
    {id: 'Nơi đăng ký quản lý', title: 'Nơi đăng ký quản lý'},
    {id: 'Địa chỉ', title: 'Địa chỉ'},
    {id: 'Điện thoại', title: 'Điện thoại'},
    {id: 'Đại diện pháp luật', title: 'Đại diện pháp luật'},
    {id: 'Địa chỉ người ĐDPL', title: 'Địa chỉ người ĐDPL'},
    {id: 'Giám đốc', title: 'Giám đốc'},
    {id: 'Ngày cấp giấy phép', title: 'Ngày cấp giấy phép'},
    {id: 'Ngày bắt đầu hoạt động', title: 'Ngày bắt đầu hoạt động'},
    {id: 'Ngày nhận TK', title: 'Ngày nhận TK'},
    {id: 'Năm tài chính', title: 'Năm tài chính'},
    {id: 'Số lao động', title: 'Số lao động'},
    {id: 'Cấp Chương Loại Khoản', title: 'Cấp Chương Loại Khoản'},
    {id: 'Ngành nghề kinh doanh', title: 'Ngành nghề kinh doanh'},
  ]
});

var c = new Crawler({
  maxConnections: 100,
  rateLimit: 1,
  callback: function(error, res, done) {
    if(error){
      console.log(error);
    } else{
      var $ = res.$;
      let detail = {};
      let sdt = $('.company-info').find('.responsive-table-cell-head:contains("Điện thoại:")');
      $('.company-info .responsive-table-cell-head').each(function() {
        let title = $(this).text().trim().replace(':', '');
        detail[title] = $(this).next().text().trim();
        if(sdt.length === 0 && title == 'Địa chỉ') {
          detail['Điện thoại'] = 'Không có dữ liệu';
        }
      })
      if(!detail.hasOwnProperty('Điện thoại')) {

      }
      let data = [];
      data.push(detail);
      if(detail['Tên doanh nghiệp']) {
        csvWriter.writeRecords(data).then(function() {
          // console.log(detail['Tên doanh nghiệp']);
        });
      } else {
        console.log(res.request.uri.href);
      }
    }
    done();
  }
});

c.queue(urlList);