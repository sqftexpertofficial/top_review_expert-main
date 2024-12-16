'use client';
import UserAvatar from '@/components/UserAvatar';
import { getFollowing, updateFollow } from '@/services';
import { Pagination } from 'antd';
import React,{useState,useEffect} from 'react';

const Following=()=>{
   
    const [allFollowing, setFollowing] = useState({});

      const fetchFollowingList = async () => {
        const list = await getFollowing(10,0);
        setFollowing(list)
      }


      useEffect(()=>{
        fetchFollowingList()
      },[])
      const fetchFollowing = async (page) => {
        const list = await getFollowing(10, (page-1)*10);
        setFollowing(list)
      };

    const handleUnfollow = async (id) => {
        await updateFollow(id,'unfollow');
        fetchFollowingList()
    }
    const renderFollowingContent = () => {
        return(
            allFollowing?.rows?.map(item=>{
                return (
                    <div className='flex items-start w-1/2 gap-[4px] mb-[10px]'>
                        <div className="flex flex-col items-center mb-2 w-[12%] flex-shrink-0">
                            <UserAvatar username={item.followingProductCompany.name} />
                        </div>
                        <div className='flex flex-col items-start gap-[4px]'>
                            <span className="text-xs">{item.followingProductCompany.name}</span>
                            <button className='rounded-md border border-solid p-1 border-black font-medium text-[10px]' onClick={()=>handleUnfollow(item.followingId)}>
                                Unfollow
                            </button>
                        </div>
                    </div>
                    
                )
            })
        )
    }
    return(
        <div>
            Following
            {allFollowing && allFollowing?.count === 0 ? <div className="text-gray-600 p-4 max-sm:text-[12px]">
                No Following!.
                </div>
                 :
                <div className='w-full flex flex-wrap m-[3%]'>
                {renderFollowingContent()}
                </div>}
                <div className="flex justify-end">
        {allFollowing?.count > 0 && <Pagination
          total={allFollowing?.count}
          defaultPageSize={10}
          onChange={fetchFollowing}
          showTotal={(total) => `Total ${total} items`}
        />}
      </div>
        </div>
    )
}

export default Following