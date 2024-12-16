import React from "react";
import { Drawer} from "antd";

import FAQManagement from "../FAQManagement";


const FAQDrawer = ({ visible, onClose, companyId }) => {

  return (
    <Drawer
      title="Manage FAQs"
      open={visible}
      onClose={onClose}
      width={600}
      footer={null}
    >
        <FAQManagement companyId={companyId}/>
    </Drawer>
  );
};

export default FAQDrawer;
