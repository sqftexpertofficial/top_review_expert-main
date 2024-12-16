"use client"

import { useAppSelector } from "@/store";
import FAQManagement from "@/components/FAQManagement"

const ManageFaq=()=>{
    const selectedBusiness = useAppSelector(
        (state) => state.auth.selectedBusiness
      );
    return <FAQManagement companyId={selectedBusiness?.productCompanyId} isBusiness={true}/>
}

export default ManageFaq