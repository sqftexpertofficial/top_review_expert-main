import EditProfile from '@/components/EditProfile';
import Head from 'next/head'

const Profile = () => {
  return (
    <div className="h-[100%]">
      <Head>

        <title>
          Top Review Expert Customer Profile
        </title>
        <link rel="canonical" href={"https://topreview.expert/profile"} />
      </Head>
      <EditProfile/>
    </div>
  );
};

export default Profile;
