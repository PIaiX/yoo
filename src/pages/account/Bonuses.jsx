import React from 'react';
import AccountTitleReturn from '../../components/AccountTitleReturn';
import NavPagination from '../../components/NavPagination';
import LiBonus from '../../components/LiBonus';

const Bonuses = () => {
  
  return (
    <section className='bonus-program'>
      <AccountTitleReturn link={'/account'} title={'История начисления и списания бонусов'}/>
      <div className="box">
        <ul>
          <LiBonus gift={false} income={150} spending={90}/>
          <LiBonus gift={true} income={500}/>
          <LiBonus gift={false} income={150} spending={90}/>
          <LiBonus gift={true} income={500}/>
        </ul>
        <div className="p-3">
          <NavPagination/>
        </div>
      </div>
    </section>
  );
};

export default Bonuses;