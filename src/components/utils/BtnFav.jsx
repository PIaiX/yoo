import React, {useState} from 'react';
import Heart from '../svgs/Heart';

const BtnFav = ({checked = false}) => {
  const [isFav, setIsFav] = useState(checked);

  return (
    <button 
      type='button' 
      onClick={()=>setIsFav(!isFav)} 
      className={(isFav) ? 'btn-fav active' : 'btn-fav'}
    >
      <Heart/>
    </button>
  );
};

export default BtnFav;