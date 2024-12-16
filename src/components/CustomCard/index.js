import React from 'react';
import { Rate } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { Tag } from 'antd';

const CustomCard = ({
    cardStyle = '',
    cardData
}) => {
    const { title = 'Dunki',
        subTitle = null,
        starRatingObj = null,
        recommandationPercentage = null,
        chipList = [],
        datePlaceHolder = 'Release Date',
        date = null,
        imageURL = null,
        redirectionLink = '', } = cardData || {}
    return (
        <section className={`border mx-[15px] sm:w-[10rem] md:w-[17rem] border-solid border-gray-300 rounded-lg ${cardStyle}`}>
            <a className="block h-36" href={redirectionLink} tabindex="0">
                <img className="h-full w-full object-contain object-center p-[1rem] max-sm:w-[16rem]" alt="" src={imageURL} />
            </a>
            <div className='py-2.5 px-3 flex flex-col'>
                <a className="text-lg max-sm:text-[14px]" href={redirectionLink} tabindex="0">
                    {title}
                </a>
                {
                    subTitle ?
                        <div className='text-sm text-card-text-color mb-2'>
                            {subTitle}
                        </div>
                        :
                        null
                }

                {
                    date ?
                        <div className='text-xs text-card-text-color mb-2.5'>
                            {datePlaceHolder}: {date}
                        </div>
                        :
                        null
                }


                {
                    chipList.length ?
                        <div className='mb-2'>{chipList.map(item => {
                            return (item ? <Tag color="#44a512" className='w-fit text-xs py-1 '>{item}</Tag>: null)
                        })}
                        </div> : null
                }

                <div className='flex items-center justify-between'>
                    {starRatingObj ? <div className='flex items-center'>
                        <Rate count='1' defaultValue={1} className='text-star-color max-sm:text-sm' />
                        <div className='text-lg text-star-color ml-1 max-sm:text-sm'>{starRatingObj?.rate}</div>
                        <div className='text-card-text-color text-sm ml-1 max-sm:text-xs'>({starRatingObj?.votes} Votes)</div>
                    </div> : null}
                    {recommandationPercentage ? <div className='flex'>
                        <HeartFilled style={{ color: 'red' }} />
                        <div className='text-sm text-card-text-color ml-1 max-sm:text-xs'>{recommandationPercentage}%</div>
                    </div> : null}
                </div>
            </div>
        </section>
    )
}


export default CustomCard