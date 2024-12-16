import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import StarRating from '../StarRating';
import HeartRating from '../HeartRating';
import {
  EmailShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  XIcon,
  WhatsappIcon,
  EmailIcon
} from "react-share";
import { Dropdown, Space } from 'antd';
import { ShareAltOutlined, CheckOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils';
import { useAppDispatch } from "@/store";
import { updateSignInModalStatus } from "@/store/authSlice";
import ProgressRating from '../ProgressRating';
import { getFollowingStatus, updateFollow } from '@/services';

const CustomerImageRatings = ({ companyImage, ratings, votes, likeScore, attributes, showReiewModal, productCompanyId = '' }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isFollow, setFollowStatus] = useState(false);
  
  const items = [
    {
      label: <TwitterShareButton url={pathname}><div className='flex items-center gap-1'><XIcon size={32} round />Twitter</div></TwitterShareButton>,
      key: '0',
    },
    {
      label: <WhatsappShareButton url={pathname} separator=":: "><div className='flex items-center gap-1'><WhatsappIcon size={32} round />WhatsApp</div></WhatsappShareButton>,
      key: '1',
    },
    {
      label: <EmailShareButton url={pathname} subject={'Forwarding Gems: Must-See Content from TopReviewExpert'} body="body"><div className='flex items-center gap-1'><EmailIcon size={32} round />Email</div></EmailShareButton>,
      key: '2',
    }
  ];

  const fetchFollowingStatus = async () => {
    const data = await getFollowingStatus(productCompanyId);
    setFollowStatus(data?.following || false);
  };

  useEffect(() => {
    fetchFollowingStatus();
  }, []);

  const handleReview = () => {
    let cookie = getCookie('session');
    if (cookie)
      showReiewModal(true);
    else
      dispatch(updateSignInModalStatus(true));
  };

  const toggleFollowBtn = () => {
    setFollowStatus(!isFollow);
    updateFollow(productCompanyId, isFollow ? 'unfollow' : 'follow');
  };

  return (
    <div className="flex flex-col md:flex-row mb-4 pb-2 border-b">
      {/* Left Section: Image and Write a Review Button */}
      <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0 flex flex-col">
        {/* Company Image */}
        <div className='w-full h-[240px] flex border p-2 rounded-lg'>
          <img src={companyImage} alt="Company Logo" className="w-full h-auto object-contain" />
        </div>

        {/* Write a Review Button */}
        <button onClick={handleReview} className="bg-green-500 text-white px-4 py-2 rounded-md mt-3 w-full">
          Write a Review
        </button>
      </div>

      {/* Right Section: Ratings and Attributes */}
      <div className="flex flex-col flex-grow">
        {/* Stars, Ratings, and Votes */}
        <div className='flex flex-col border mb-2 rounded-lg'>
          <div className='font-bold bg-gray-100 p-4 flex items-center justify-between text-sm'>
            <span className='hidden md:block'>Top Review Expert Score</span>
            <span className='block md:hidden'>Score</span>
            <div className='flex items-center gap-2'>
              <button className='rounded-md border border-solid p-1 border-black px-3 font-medium' onClick={toggleFollowBtn}>
                {isFollow ? <div className='flex gap-[3px]'><CheckOutlined />Following</div> : 'Follow'}
              </button>
              <span className='flex gap-[3px] cursor-pointer items-center rounded-md border border-solid p-1 border-black'>
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <ShareAltOutlined /><span className='font-medium'>Share</span>
                    </Space>
                  </a>
                </Dropdown>
              </span>
            </div>
          </div>
          <div className='p-4 flex items-center flex-wrap'>
            <StarRating rating={ratings} className={'text-2xl'} />
            <span className="ml-2 bg-green-600 text-white p-2 rounded">
              {ratings} <span className="text-lg">&#9733;</span>
            </span>
            <HeartRating fillPercentage={likeScore ?? 0 + '%'} className={'ml-4 text-gray-500'} />
            <span className="ml-2 text-sm">({votes?.toLocaleString("en-IN") ?? 0} votes)</span>
          </div>
        </div>

        {/* Attributes with Progress Bars */}
        <div className='flex flex-wrap mt-4 text-sm'>
          {attributes && attributes.map((attribute, index) => (
            <div key={index} className="flex items-center justify-between mb-2 w-full sm:w-1/2 p-2">
              <span className="mr-2 w-[12rem] md:w-[20rem]">{attribute.attribute}:</span>
              <ProgressRating rating={attribute.rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerImageRatings;
