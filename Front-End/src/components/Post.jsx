import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';

import { client, urlFor } from '../client'
import { getUserDataFromToken } from '../utils';

const Post = ({post}) => {
  const [postHovered, setPostHovered] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const { postedBy, image, _id, like } = post;

  useEffect(() => {
    const userInfo = getUserDataFromToken();
    setUser(userInfo);
    return () => {
      setUser(null);
    };
  }, []);

  const alreadyLiked = !!(like?.filter((item) => item?.postedBy?._id === user?.id)?.length); //double negative turn value into boolean

  const likePost = (id) => {
    if (!alreadyLiked) {
      setLikingPost(true);
      client
        .patch(id)
        .setIfMissing({ like: [] })
        .insert('after', 'like[-1]', [{
          _key: uuidv4(),
          userId: user?.id,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.id,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setLikingPost(false);
        });
    }
  };

  const deletePost = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/post-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image ? (<img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />) : null}
        {postHovered ? (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadyLiked ? (
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none cursor-zoom-in">
                  {post?.like?.length} ♥
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    likePost(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {post?.like?.length} {likingPost ? 'Liking' : 'Like'}
                </button>
              )}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              { (postedBy?._id === user?.id) ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePost(_id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none left"
                >
                  <AiTwotoneDelete />
                </button>) : null}
            </div>
          </div>) : null}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Post;