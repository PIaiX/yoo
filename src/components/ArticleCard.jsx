import React, { memo } from 'react';
import {Link} from 'react-router-dom';

const ArticleCard = memo(({data}) => {
    return (
        <figure className='article-card'>
            <Link to="/articles/123">
                <img src={data.imgLink} alt={data.title} />
                <figcaption>{data.title}</figcaption>
            </Link>
        </figure>
    );
});

export default ArticleCard;