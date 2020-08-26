const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let url;
  let featuredContent;
  let featuredArticles;
  let data;
  let mainTitle;

  let newsSource = 'New York Times';

  const newsSources = [
    {
      "name": "New York Times",
      "href": "https://www.nytimes.com/"
    },
    {
      "name": "Huffington Post",
      "href": "https://www.huffpost.com/"
    }
  ];

  const sourceName = 'New York Times';

  await page.goto(`${newsSources[0].href}`);

  if (sourceName === 'New York Times') {
    featuredContent = await page.evaluate(() => document.getElementsByClassName('story-wrapper')[0]);

    featuredArticles = await page.evaluate(
      () => Array.from(document.querySelectorAll('article'))
        .map(story => ({
          "links": Array.from(story.querySelectorAll('a')).map(link => link.href),
          "html": Array.from(story.querySelectorAll('a')).map(link => link.innerHTML),
          "rawText": Array.from(story.querySelectorAll('a')).map(link => link.innerText),
          "media": story.querySelectorAll('.react-vhs-container').length
        })
      ))

      data = {
        "source": 'New York Times',
        "sourceLink": 'https://www.nytimes.com/',
        "articles": featuredArticles
      }
  } else if (sourceName === 'Huffington Post') {
    mainTitle = await page.evaluate(() => (document.querySelectorAll('.front-page-top')[0].innerText));

    featuredArticles = await page.evaluate(() => Array.from(document.querySelectorAll('section .card .card__headlines')).map(card => ({
        "title": card.innerText,
        "link": card.querySelector('a').href
        })
    ));

    data = {
      "source": 'Huffington Post',
      "sourceLink": 'https://huffingtonpost.com',
      "articles": featuredArticles
    }
  } else {
    data = 'something went wrong :(';
  }

  fs.writeFile('currentData.json', JSON.stringify(data), function (err) {
    if (err) return console.log(err);
    console.log('currentData.json updated');
  });

  await browser.close();
})();