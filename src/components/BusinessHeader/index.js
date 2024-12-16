// components/Header.js
"use client";
import React,{ useState } from 'react';
import { MenuOutlined,ArrowRightOutlined,DoubleRightOutlined } from '@ant-design/icons';
import {  Drawer } from 'antd';

const BusinessHeader = () => {
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
      };

    
    return (
        <header className="border-b p-4 flex justify-between items-center bg-white">
            <div className='md:hidden cursor-pointer' onClick={()=>setOpen(true)}><MenuOutlined /></div>
            <div className="flex items-center max-sm:w-full max-sm:justify-center">
                <div className='flex items-center'>
                    <a href='/' className="text-lg font-bold mr-4 max-sm:text-center">  <img src='/logo.png' alt='logo-icon' className='max-sm:w-auto h-[65px] max-sm:h-[45px]'/></a>
                </div>
            </div>

            {
                open ? <Drawer
                 title={<div className='flex justify-between'><span>Search</span><ArrowRightOutlined /></div>}
                 placement={'left'}
                 closable={false}
                 onClose={onClose}
                 open={open}
                 key={'left'}
                 bodyStyle={{display:'flex', flexDirection:'column', gap:'10px'}}
                width='70%'
               >
                 <a href='/' className='flex gap-[6px]'><DoubleRightOutlined size={30}/>Home</a>
                 <a href='/brand-sign-up' className='flex gap-[6px]'><DoubleRightOutlined />Business Enquiry</a>
               </Drawer> : null
            }
        </header>
    );
};

export default BusinessHeader;
