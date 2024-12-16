'use client'

import { useAppSelector} from "@/store";

const ProfileName=()=>{
    const userData = useAppSelector((state) => state.auth.userData);
 return   <div className="text-sm">{`Home > ${userData?.username || "..."}`}</div>
}

export default ProfileName