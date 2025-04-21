import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import ImageFallback from "../../common/ImageFallback/ImageFallback";
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import { useAppDispatch } from "@/store/Store";
import { setCallThread, startCall } from "@/reducers/CallSlice";
import { useNavigation } from "@/hooks/useNavigation";

const ChatHeader = ({ user, thread }: any) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  console.log("thread", thread);
  return (
    <div className="ChatHead">
      <li className="group">
        <div className="avatar me-2">
          <ImageFallback
            src={
              thread?.expertProfile?.userId === user?.id
                ? thread?.task?.requesterProfile?.user?.profilePicture?.fileUrl
                : thread?.expertProfile?.user?.profilePicture?.fileUrl
            }
            alt="img"
            className="user-img img-round"
            width={40}
            height={40}
            userName={
              thread?.expertProfile?.user
                ? `${thread?.expertProfile?.user?.firstName} ${thread?.expertProfile?.user?.lastName}`
                : null
            }
          />
        </div>
        <div>
          <p className="GroupName text-white mb-0">
            {user?.profile[0]?.type === "TR"
              ? thread?.expertProfile?.user?.firstName
              : thread?.task?.requesterProfile?.user?.firstName}{" "}
            {user?.profile[0].type === "TR"
              ? thread?.expertProfile?.user?.lastName
              : thread?.task?.requesterProfile?.user?.lastName}
          </p>
          <p
            style={{ fontSize: "12px", cursor: "pointer" }}
            className="GroupName text-white mb-0"
            onClick={() => navigate(`/dashboard/tasks/${thread.task?.id}`)}
          >
            {thread?.task?.name}
          </p>
        </div>
      </li>
      <div className="callGroupicon d-flex align-items-center">
        <div className="search-boxx">
          <button className="btn-search">
            <Icon className="text-info m-1" icon="weui:search-outlined" />
          </button>
          <input
            type="text"
            className="input-search"
            placeholder="Type to Search..."
          />
        </div>
        <Icon
          className="text-info m-1 fs-24 cursor"
          icon="material-symbols-light:call-outline-sharp"
          onClick={() => {
            if (!thread?.id) {
              console.error("Cannot start call: Thread ID is missing");
              return;
            }
            dispatch(startCall());
            dispatch(setCallThread(thread));
          }}
        />
        <Icon
          className="text-info m-1 fs-24 cursor"
          icon="carbon:video"
          onClick={() => {
            if (!thread?.id) {
              console.error("Cannot start call: Thread ID is missing");
              return;
            }
            dispatch(setCallThread(thread));
            dispatch(startCall());
          }}
        />
        <Icon className="text-info m-1 fs-24" icon="mage:dots" />
      </div>
    </div>
  );
};

export default ChatHeader;
