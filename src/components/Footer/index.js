const Footer = () => {
    return (
        <footer className='flex flex-col bg-black w-full text-[14px] px-[10%] py-[2%] justify-center gap-[12px] text-white'>
            <section className='flex w-full justify-center items-center gap-[2%]'>
            <a href="/" className='hover:font-bold'>
                Home 
            </a>
            {/* <a className='hover:font-bold'>
                ContactUs
            </a> */}
            <a href='/product-list' className='hover:font-bold'>  
                Categories 
            </a>
            </section>
            <section className='flex w-full justify-center items-center gap-[2%]'>
            <a href="/privacy-policy" className='hover:font-bold'>
                Privacy Policy 
            </a>
            <a href='/refund-cancellation-policy' className='hover:font-bold'>  
                Refund and Cancellation Policy 
            </a>
            <a href='/terms-and-conditions' className='hover:font-bold'>  
                Terms and Conditions
            </a>
            </section>
            <section className='w-full flex justify-center text-[11px]'>
                Copyright © 2024 Top Review Expert. All rights reserved.
            </section>
        </footer>
    );
};

export default Footer;
