"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Table, Input, Button, Select, message, Modal, Form, AutoComplete, Input as AntInput } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getAllBusinessRequests, updateBusinessRequestStatus, fetchAllProductCompanies } from "@/services"; // Assuming `searchProductCompanies` is a service method for searching product companies

const { Option } = Select;

const ManageBusiness = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); // to track the action (approve/reject)
  const [currentId, setCurrentId] = useState(null); // to track the current business request id
  const [reason, setReason] = useState(""); // reason for the action
  const [selectedProductCompany, setSelectedProductCompany] = useState(null); // track selected product company for approval
  const [productCompanySearchTerm, setProductCompanySearchTerm] = useState(""); // search term for product company
  const [productCompanySuggestions, setProductCompanySuggestions] = useState([]); // stores product company search results
  const limit = 10;

  // Ref to store the timeout ID for debounce
  const debounceTimeoutRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllBusinessRequests({
        search,
        status,
        offset: (currentPage - 1) * limit,
        limit,
      });
      setData(res.rows);
      setTotal(res.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch when component mounts
  }, [currentPage]); // Fetch data on page change only

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    fetchData();
  };

  // Function to search product companies with debounce
  const searchForProductCompanies = useCallback(async (value) => {
    // setProductCompanySearchTerm(value);
    if (value) {
      try {
        const response = await fetchAllProductCompanies({
          filter: { name: value },
          pagination: { page: 0, size: 10 },
        });
        setProductCompanySuggestions(response.rows); // Update the suggestions
      } catch (error) {
        message.error("Failed to search for product companies.");
        console.error(error);
        setProductCompanySuggestions([]); // Clear suggestions on error
      }
    } else {
      setProductCompanySuggestions([]); // Clear suggestions if search term is empty
    }
  }, []);

  // Debounced version of the search
  const debouncedSearchForProductCompanies = useCallback((value) => {
    setProductCompanySearchTerm(value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      searchForProductCompanies(value);
    }, 200); // Adjust delay as needed (500ms here)
  }, [searchForProductCompanies]);

  const handleProductCompanySelect = (value) => {
    setProductCompanySearchTerm(value)
    const selected = productCompanySuggestions.find(
      (company) => company.name === value
    );
    setSelectedProductCompany(selected);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleStatusUpdate = async () => {
    if (!reason) {
      message.error("Please provide a reason for the action.");
      return;
    }

    try {
      await updateBusinessRequestStatus(currentId, {
        status: currentAction,
        reason,
        productCompanyId: selectedProductCompany?.id, 
      });
      message.success(
        `Business request ${
          currentAction === "approved" ? "approved" : "rejected"
        } successfully!`
      );
      fetchData();
    } catch (error) {
      message.error(
        error.error ??
          `Failed to ${
            currentAction === "approved" ? "approve" : "reject"
          } the business request!`
      );
      console.error(error);
    } finally {
      setIsModalVisible(false); // Close modal
      setReason(""); // Reset reason
      setSelectedProductCompany(null); // Reset selected product company
    }
  };

  const showModal = (action, id) => {
    setCurrentAction(action);
    setCurrentId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setReason(""); // Reset reason if user cancels
    setSelectedProductCompany(null); // Reset selected product company
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "Email",
      dataIndex: "primaryEmail",
      key: "primaryEmail",
    },
    {
      title: "Referrer Id",
      dataIndex: "referrerId",
      key: "referrerId",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          {record.status === "pending" ? (
            <>
              <Button
                type="primary"
                onClick={() => showModal("approved", record.id)}
              >
                Approve
              </Button>
              <Button
                type="danger"
                onClick={() => showModal("rejected", record.id)}
                className="ml-2"
              >
                Reject
              </Button>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Input
          style={{ width: 300 }}
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-2"
          suffix={<SearchOutlined />}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Filter by status"
          value={status}
          onChange={handleStatusChange}
          className="!mr-2"
        >
          <Option value="">All</Option>
          <Option value="approved">Approved</Option>
          <Option value="pending">Pending</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: total,
          onChange: setCurrentPage,
        }}
      />

      {/* Modal for reason input and product company search */}
      <Modal
        title={`Please provide a reason for ${currentAction === "approved" ? "approving" : "rejecting"} the request`}
        open={isModalVisible}
        onOk={handleStatusUpdate}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form>
          <Form.Item label="Reason" required>
            <AntInput.TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason here"
              rows={4}
            />
          </Form.Item>

          {/* Product Company Search */}
          {currentAction === "approved" && (
            <Form.Item label="Select Product Company" required>
              <AutoComplete
                value={productCompanySearchTerm}
                onSearch={debouncedSearchForProductCompanies}
                onSelect={handleProductCompanySelect}
                placeholder="Search for product company"
              >
                {productCompanySuggestions.map((company) => (
                  <AutoComplete.Option key={company.id} value={company.name}>
                    {company.name}
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBusiness;
