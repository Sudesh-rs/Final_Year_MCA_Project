import {
  
  Divider,
  
} from "@mui/material";

import ProfileFildCard from "../../../seller/pages/Account/ProfileFildCard";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { Avatar } from '@mui/material';

const UserDetails = () => {
  const { user } = useAppSelector((store) => store);


  return (
    <div className="flex justify-center py-10">
      <div className="w-full lg:w-[70%]  ">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600 ">
            Persional Details
          </h1>
          {/* <div>
            <Button
              onClick={handleOpen}
              size="small"
              sx={{ borderRadius: "2.9rem" }}
              variant="contained"
              className="w-16 h-16"
            >
              <EditIcon />
            </Button>
          </div> */}
        </div>
        <div className="space-y-5">
          <div className='flex items-center gap-5'>
            <Avatar sx={{ width: "6rem", height: "6rem" }} src={user.user?.profileImage || '/default-avatar.svg'} />
            <h1 className='text-xl font-bold'>{user.user?.fullName}</h1>
          </div>
          <div>
            <ProfileFildCard keys={"Name"} value={user.user?.fullName} />
            <Divider />
            <ProfileFildCard keys={"Email"} value={user.user?.email} />
            {user.user?.mobile && (
              <>
                <Divider />
                <ProfileFildCard keys={"Contact Number"} value={user.user.mobile} />
              </>
            )}
          </div>
        </div>
      </div>
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>Update UserProfile</Box>
      </Modal> */}
    
    </div>
  );
};

export default UserDetails;
