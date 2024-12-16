import React from 'react';
import { Button } from 'antd';

const ReviewerCard = ({
    cardStyle = '',
    cardData
}) => {
    const {
        profileURL,
        badgeImageURL,
        redirectionURL = '',
        ctaText,
        content
    } = cardData
    return (
        <section className={`p-[30px] m-[15px] w-[18rem] rounded-[6px] text-center ${cardStyle}`} style={{ boxShadow: '0 0 6px 0 rgb(119 119 119 / 40%)' }} >
            {/* <a href={redirectionURL} className='w-[100px] h-[100px] relative block m-auto'><img src={profileURL} className='rounded-[75px] w-full h-full' />
                <div className='absolute w-[46px] h-[46px] bottom-0 -right-[11px]'>
                    <img src={badgeImageURL} className='w-full h-full' />
                    </div>
            </a> */}

            {
                content ? <div className='h-[120px] mb-[16px] leading-[1.8] text-[16px] overflow-hidden max-sm:text-[13px] max-sm:line-clamp-5'>
                    {content}
                </div> : null
            }
            {
                ctaText ? <Button className='bg-test-button-bg-color text-white'>{ctaText}</Button> : null
            }
        </section>
    )
}


export default ReviewerCard