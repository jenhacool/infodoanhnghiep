const cheerio = require('cheerio');

const request = require('request');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'data-4.csv',
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

function sendRequest(url) {
  return new Promise(function(resolve, reject) {
    request(
      {
        gzip: true,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        },
        url: url,
        method: 'GET'
      },
      function(err, res, body) {
        if(!err && res.statusCode === 200) {
          resolve(body)
        } else {
          reject(err)
        }
      }
    )
  });
}

(async () => {
  let page = 3001;

  while(page <= 4000) {
    let url = `https://infodoanhnghiep.com/Ha-Noi/trang-${page}/`;
    let body = await sendRequest(url);
    let $ = cheerio.load(body);
    let detailUrls = [];
    $('.list-company .company-item').each(function() {
      detailUrls.push($(this).find('h3.company-name a').attr('href'));
    });
    for(let detailUrl of detailUrls) {
      let detail = {};
      let body = await sendRequest(`https:${detailUrl}`);
      let $ = cheerio.load(body);
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
      await csvWriter.writeRecords(data);
    }
    console.log(page);
    page += 1;
  }
})();