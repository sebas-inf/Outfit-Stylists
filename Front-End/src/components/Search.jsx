import React, { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import client from '../client';
import { feedQuery, searchQuery } from '../utils/data';

const Search = ({searchTerm}) => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query)
        .then((data) => {
          setPosts(data);
          setLoading(false);
        });
    } else {
      client.fetch(feedQuery())
        .then((data) => {
          setPosts(data);
          setLoading(false);
        });
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