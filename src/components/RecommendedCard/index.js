const RecommendedCard=({cardData})=>{
    return(
        <div className="bg-gradient-to-r from-slate-500 to-slate-900 rounded-lg md:w-[15rem] h-[10rem] text-white flex items-center justify-center mx-[15px] text-center p-[20px] max-sm:text-sm">
           {cardData.title}
        </div>
    )
}

export default RecommendedCard  