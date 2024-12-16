const CustomImgCard=({cardData})=>{
    return(
        <a href={cardData?.redirectionLink} className='mx-[15px]'>
            <img src={cardData?.imageURL} alt='img-icon' />
        </a>
    )
}

export default CustomImgCard  