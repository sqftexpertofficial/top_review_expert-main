import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { submitBusinessRequest } from "@/services";
import SignIn from '../SignIn';
import { getCookie } from '@/utils';


const BusinessSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
    const [userDetails, setUserDetails] = useState(null); // Store user details temporarily
    const [showSignIn, setShowSignIn] = useState(false); // Flag to show SignIn
    const router = useRouter();

   
    
    
    

    // Check if user is logged in (via session cookie or your preferred method)
    useEffect(() => {
        const sessionCookie = getCookie('session');
        if (sessionCookie) {
            setIsLoggedIn(true);
        }
    }, []);

    // Step 1: Handle Form Submit to collect registration info
    const handleSubmit = async (values) => {
        setUserDetails(values); // Store the registration data temporarily

        if (isLoggedIn) {
            // If already logged in, submit the registration immediately
            return registerBusiness(values);
        }

        // If not logged in, show SignIn modal
        setShowSignIn(true);
    };

    // Step 3: Register business once logged in
    const registerBusiness = async (values) => {
        const payload = {
            name: values.name,
            designation: values.title,
            companyName: values.company,
            primaryEmail: values.email,
            mobileNumber: values.mobileNumber,
            website: values.website,
            referrerId: values.employeeReferral,
        };

        setLoading(true);

        try {
            await submitBusinessRequest(payload);
            message.success('Registration successful!');
            form.resetFields();
            router.push('/brand-signup-success');
        } catch (error) {
            message.error(error?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Close SignIn modal after successful login
    const handleSignInSuccess = () => {
        setShowSignIn(false);
        setIsLoggedIn(true); // Update the state as logged in
        registerBusiness(userDetails); // Proceed with business registration
    };

    // Step 4: If the user is not logged in, show the SignIn component
    if (!isLoggedIn && showSignIn) {
        return <SignIn onSuccess={handleSignInSuccess} isHideCloseIcon/>;
    }

    // Step 5: If logged in, show the registration form
    return (
        <>

<Form
            form={form}
            name="signup_form"
            layout="vertical"
            onFinish={handleSubmit}
            className='mt-[20px] gap-[10px]'
            size={'large'}
        >
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your name' }]}
            >
                <Input placeholder="Name *" />
            </Form.Item>
            <Form.Item
                name="title"
                rules={[{ required: true, message: 'Please input your Title/Designation' }]}
            >
                <Input placeholder='Title / Designation *' />
            </Form.Item>
            <Form.Item
                name="company"
                rules={[{ required: true, message: 'Please input your Company / Brand Name' }]}
            >
                <Input placeholder='Company/ Brand Name *' />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please input your email address!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                ]}
            >
                <Input placeholder='Primary Email Address *' />
            </Form.Item>

            <Form.Item
                name="mobileNumber"
                rules={[
                    { required: true, message: 'Please input your mobile number!' },
                    { pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: 'Please enter a valid mobile number!' },
                ]}
            >
                <Input placeholder='Mobile Number *' />
            </Form.Item>

            <Form.Item
                name="website"
            >
                <Input placeholder="Website" />
            </Form.Item>

            <Form.Item
                name="employeeReferral"
                rules={[
                    { pattern: /^TRE-.+/, message: 'Invalid referral code' },
                ]}
            >
                <Input placeholder="Top Review Expert Referral" />
            </Form.Item>

            <Form.Item wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
            }}>
                <Button 
                    htmlType="submit" 
                    className="w-[50%] float-right bg-[#81209d] text-white"
                    loading={loading} // Show loading spinner
                >
                    Register
                </Button>
            </Form.Item>
        </Form>

        


        </>
        
    );
};

export default BusinessSignUp;
