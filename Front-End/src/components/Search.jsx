import React, { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Search = ({searchTerm}) => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (searchTerm) {
        setLoading(true);
        try{
            fetch(`http://localhost:3000/search?query=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => setPosts(data))
            setLoading(false);
        } catch (error) {
            console.error("Error searching:", error);
            setLoading(false);
        }
    } else {
        try{
            fetch(`http://localhost:3000/search?`)
            .then((response) => response.json())
            .then((data) => setPosts(data))
        } catch (error) {
            console.error("Error searching:", error);
        }
    }
  }, [searchTerm]);


  return (
    <div>
      {loading ? <Spinner message="Searching for posts..." /> : null}
      {(posts?.length !== 0) ? (<MasonryLayout posts={posts} />) : null}
      {(posts?.length === 0 && searchTerm !== '' && !loading) ? (
        <div className='mt-10 text-center text-xl'>
          No Posts Found!
        </div>
      ) : null}
    </div>
  )
}

export default Search