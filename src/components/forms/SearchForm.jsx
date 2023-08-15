import React, {useState} from 'react'
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const SearchForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <form action="" className={(isOpen)?'searchForm opened':'searchForm'} onMouseEnter={()=>setIsOpen(true)} onMouseLeave={()=>setIsOpen(false)}>
            <input type="search" placeholder='Найти...' />
            <button type='submit'>
                <HiOutlineMagnifyingGlass/>
            </button>
        </form>
  )
}

export default SearchForm