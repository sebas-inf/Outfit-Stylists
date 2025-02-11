import React from 'react';

const AddItem = () => {
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
            <p>Image Upload Placeholder</p>
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input type='text' placeholder='Add your title' className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2' />
          <input type='text' placeholder='Write a caption!' className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-2' />
          <div className='flex justify-end items-end mt-5'>
            <button className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none cursor-pointer'>Post!</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;