import React from 'react';
import Masonry from 'react-masonry-css';
import Item from './Item';

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ item }) => (
  <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
    {item?.map((item) => <Item key={item._id} item={item} className="w-max" />)}
  </Masonry>
);

export default MasonryLayout;