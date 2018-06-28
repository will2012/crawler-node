var Crawler = require("crawler");
var random_ua = require('random-ua');
var fs = require('fs')
var c = new Crawler({
    rateLimit: 10000,
    maxConnections: 1,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            console.log($(".s-result-list li").length)
            $(".s-result-list li").each(function (index, item) {
                try {
                    console.log(`index = ${index}`)
                    let j = $(item)
                    let title = j.find('.s-color-twister-title-link').attr('title')
                    let url = j.find('.s-color-twister-title-link').attr('href')
                    let price = ''
                    j.find('.s-price').each(function (index, value) {
                        try {
                            price = $(value).text()
                        } catch (e) {
                            console.log(e)
                        }
                    });
                    price = price.replace('￥', '')
                    let str = `${title}|${url}|${price}\n`
                    console.log(str)
                    var nowTime = new Date()
                    fs.writeFileSync(`info${nowTime.getFullYear()}${nowTime.getMonth() + 1}${nowTime.getDate()}.txt`, str, { flag: 'a' })
                } catch (e) {
                    console.log(e)
                }
            })
        }
        done()
    }
});

c.queue({
    headers: [
        { "User-Agent": random_ua.generate() }
    ],
    uri: `https://www.amazon.cn/s/ref=lp_143359071_pg_2?rh=n%3A116087071%2Cn%3A%21116088071%2Cn%3A116169071%2Cn%3A143359071&page=1&ie=UTF8&qid=1529636343`,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            let total = parseInt($(".pagnDisabled").text())
            for (let i = 1; i <= total; i++) {
                let url = `https://www.amazon.cn/s/ref=lp_143359071_pg_2?rh=n%3A116087071%2Cn%3A%21116088071%2Cn%3A116169071%2Cn%3A143359071&page=${i}&ie=UTF8&qid=1529636343`
                c.queue({
                    headers: [
                        { "User-Agent": random_ua.generate() }
                    ],
                    uri: url
                })
            } 
        }
        done()
    }
})