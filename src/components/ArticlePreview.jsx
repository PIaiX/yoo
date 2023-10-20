import React from 'react';
import {Link} from 'react-router-dom';

const ArticlePreview = () => {
  return (
    <div className="article-preview">
      <img src="/imgs/img.jpg" alt="" />
      <div className='ms-sm-4 ms-xl-5 flex-1 d-flex flex-column justify-content-between'>
        <h5><Link to="/articles/12">At vero eos et accusamus et iusto</Link></h5>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias</p>
        <Link to="/articles/12" className='btn-primary mt-auto'>Подробнее</Link>
      </div>
    </div>
  )
}

export default ArticlePreview