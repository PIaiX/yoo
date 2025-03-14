import React from 'react';
import { useSwiper } from 'swiper/react';
import NextIcon from '../svgs/NextIcon';

const SwiperButtonNext = () => {
    const swiper = useSwiper();
    const locked = (swiper.isLocked ? ' locked' : '');
    return (
        <button draggable={false}  
            className={'swiper-arrow-next' + locked} 
            onClick={() => swiper.slideNext()}
        >
            <NextIcon/>
        </button>
    );
};

export default SwiperButtonNext;