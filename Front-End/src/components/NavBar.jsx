import React from 'react';

const Navbar = () => {
    return (
      <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
        <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
          <input type='text' placeholder='Search' className='p2 w-full bg-white outline-none' />
        </div>
      </div>
    );
  };

export default Navbar;