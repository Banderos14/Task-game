import UserInfo from "./UserInfo";

const Profile = ({ user, dailyProgress }) => {
    return <UserInfo user={user} progress={dailyProgress} />;
};

export default Profile;
