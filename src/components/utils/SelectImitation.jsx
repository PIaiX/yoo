import React, {useState, useRef, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { HiChevronDown } from "react-icons/hi2";


const SelectImitation = (props) => {
  const optionsArr = props.optionsArr;
  const [options, setOptions] = useState(optionsArr);

  const handleChange = (val) => {
    setOptions(options.map(obj => {
      if (obj.value === val) {
        return {...obj, defaultChecked: true};
      } else {
        return {...obj, defaultChecked: false};
      }
   }));
  }

  return (
    <Dropdown as="div" className='select' autoClose={true}>
      <Dropdown.Toggle as="button" className={(props.btnClass) ? 'select-button ' + props.btnClass : 'select-button'} >
        <div className="select-button-value">
          {
            (options.find(item => item.defaultChecked === true))
            ? <>
              {
                (options.find(item => item.defaultChecked === true).icon) &&
                <img src={options.find(item => item.defaultChecked === true).icon} alt="" className={props.imgClass}/>
              }
              <span>{options.find(item => item.defaultChecked === true).label}</span>
            </>
            : <span className='gray'>Выберите</span>
          }
        </div>
        <HiChevronDown className='select-button-chevron'/>
      </Dropdown.Toggle>

      <Dropdown.Menu as="ul" className='select-options'>
        {
          options.map( (obj, index) => {
            return <Dropdown.Item as="li" bsPrefix="select-options-item" key={index}>
              <label className={(obj.defaultChecked)?'active':''}>
                <input 
                type="radio" 
                name='receiving' 
                defaultChecked={obj.defaultChecked} 
                value={obj.value} 
                onChange={() => handleChange(obj.value)}
                hidden />
                {
                  (obj.icon) &&
                  <img src={obj.icon} alt="" className={props.imgClass}/>
                }
                <div className='select-options-label'>{obj.label}</div>
              </label>
            </Dropdown.Item>
          })
        }
      </Dropdown.Menu>
    </Dropdown>
    // <div ref={ref} className={'select '+props.boxClass}>
    //   <button type='button' onClick={()=>setShowOptions(!showOptions)} className={'select-button '+props.btnClass}>
    //     <div className="select-button-value">
    //       {
    //         (options.find(item => item.defaultChecked === true))
    //         ? <>
    //           {
    //             (options.find(item => item.defaultChecked === true).icon) &&
    //             <img src={options.find(item => item.defaultChecked === true).icon} alt="" className={props.imgClass}/>
    //           }
    //           <span>{options.find(item => item.defaultChecked === true).label}</span>
    //         </>
    //         : <span className='gray'>Выберите</span>
    //       }
    //     </div>
    //     <HiChevronDown className='select-button-chevron'/>
    //   </button>

    //   <ul ref={objRef} data-observing={isVisible} className={(showOptions) ? "select-options" : "select-options d-none"}>
    //     {
    //       options.map( (obj, index) => {
    //         return <li key={index}>
    //           <label htmlFor={index} className={(obj.defaultChecked)?'active':''}>
    //             <input 
    //             type="radio" 
    //             id={index}
    //             name='receiving' 
    //             defaultChecked={obj.defaultChecked} 
    //             value={obj.value} 
    //             onChange={() => handleChange(obj.value)}
    //             hidden />
    //             {
    //               (obj.icon) &&
    //               <img src={obj.icon} alt="" className={props.imgClass}/>
    //             }
    //             <div className='select-options-label'>{obj.label}</div>
    //           </label>
    //         </li>
    //       })
    //     }
    //   </ul>
    // </div>
  );
};

export default SelectImitation;