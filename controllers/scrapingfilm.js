// install puppeteer for scraping
const puppeteer = require('puppeteer');

exports.scrapingfilm = async (req, res) => {
    let date = req.params.dateChoosen
    console.log("date " + date);

// function to scraping the site of movies

    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    await page.goto(`https://www.imdb.com/movies-coming-soon/${date}`);
    const movies = await page.evaluate( () => {
        let movies = [];
        // select the elements in the list of movies in this website => we will choose the class, span ... follow in this site
        let elements = document.querySelectorAll('div.list_item');
        for (element of elements) {
            // take the infos of stars 
            let stars = [];
            for ( let i = 0; i < element.querySelectorAll('td.overview-top>div:nth-child(6) a').length; i++) {
                stars.push(element.querySelectorAll('td.overview-top>div:nth-child(6) a')[i]?.textContent);
            };

            // info of genres of movies in the span 
            let genres = [];
            for ( let i = 0 ; i< element.querySelectorAll('p.cert-runtime-genre span').length; i++) {
                genres.push(element.querySelectorAll('p.cert-runtime-genre span:not(.ghost)')[i]?.textContent);
            }
            // push all the info in list of movies
            movies.push({
                img: element.querySelector('img')?.src,
                title: element.querySelector('td.overview-top a')?.textContent.trim(),
                description : element.querySelector('.outline')?.textContent.trim(),
                time: element.querySelector('time')?.textContent.trim(),
                directeur: element.querySelector('div.txt-block a')?.textContent,
                stars: stars,
                genres: genres,
            });

        }
        return movies
    })

    res.send({movies}) 

    console.log(movies);
    await browser.close()

}