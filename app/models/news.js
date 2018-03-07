'use strict';
const config = require('../../config');

const apiQuery = require('./api-query');
const { getDateString, getTimeString } = require('./date-formatter');
const filterNullParams = require('./filter-null-params');


class NewsArticle {
    /* eslint-disable max-params */
    constructor(title, text, sourceUrl, image, date) {
        this.title = title;
        this.text = text;
        this.sourceUrl = sourceUrl;
        this.image = image;
        this._date = date;
    }

    get publicationDateIso() {
        return this._date.toISOString();
    }

    get publicationDate() {
        return `${getDateString(this._date)}, ${getTimeString(this._date)}`;
    }

    static fromApiResponse(apiResponse) {
        return new NewsArticle(
            apiResponse.title,
            apiResponse.description,
            apiResponse.url,
            apiResponse.urlToImage,
            new Date(apiResponse.publishedAt)
        );
    }
}


async function _getNews({ language = 'ru', country = null, category = null }) {
    const request = { apiKey: config.newsApiKey, language };
    Object.assign(request, filterNullParams({ country, category }));
    const apiResponse = await apiQuery(config.newsApiDomain, request);

    return apiResponse.articles
        .map(NewsArticle.fromApiResponse);
}


module.exports = _getNews;