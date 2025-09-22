import React, { FC, useState } from "react";
import { Icon } from "@iconify/react";
import NoFound from "@/components/common/NoFound/NoFound";
import InviteMemberModal from "@/components/common/Modals/InviteMemberModal";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigation } from "@/hooks/useNavigation";
import { setThread } from "@/reducers/ThreadSlice";

const TeamTable: FC<any> = ({ data, type, handleAction }) => {
  const user = useSelector((state: RootState) => state.user);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectTeam, setSelectTeam] = useState<any>({});
  const { navigate } = useNavigation();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleInvite = (row: any) => {
    setShowModal(true);
    setSelectTeam(row);
  };

  const closeInvite = () => {
    setShowModal(false);
    setSelectTeam({});
  };

  const getMessageThread = async (row: any) => {
    console.log('row team', row)
    try {
      const response = await apiCall(
        requests.getThread,
        {
          // teamId: row.id,
        },
        "get",
        false,
        dispatch,
        user,
        router
      );
      const matchingThread = response?.data?.threads?.find(
        (thread: any) => thread.teamId === row.id
      );
      if (matchingThread) {
        dispatch(setThread(matchingThread));
        router.push(`/dashboard/messages/${matchingThread?.id}`);
      } else {
        let data = {
          teamId: row.id,
          threadType: "TEAM"
        };


        const res = await apiCall(
          requests.createThread,
          data,
          "post",
          false,
          dispatch,
          user,
          router
        );
        dispatch(setThread(res?.data.thread));
        router.push(`/dashboard/messages/${res?.data.thread?.id}`);
      }
    } catch (error) {
      console.warn("Error fetching threads", error);
    }
  };


  const handleAcceptReject = async (status: string, id: number) => {
    await apiCall(
      `${requests.invitation}/${id}`,
      { invitationStatus: status },
      "put",
      true,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        let message: any;
        if (res?.error) {
          message = res?.error?.message;
          if (Array.isArray(message)) {
            message?.map((msg: string) =>
              toast.error(msg ? msg : "Something went wrong, please try again")
            );
          } else {
            toast.error(
              message ? message : "Something went wrong, please try again"
            );
          }
        } else {
          toast.success(res?.data?.message);
          handleAction(type);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <div
      className="table-responsive mt-3"
      style={{
        background: 'transparent',
        border: 'none',
        borderRadius: 16,
        overflow: 'hidden'
      }}
    >
      <table className="table table-hover mb-0" style={{ background: 'transparent', borderSpacing: 0 }}>
        <thead className="table-dark"
          style={{
            background: 'var(--color_black)',
            borderBottom: '1px solid var(--color_grey)',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          <tr>
            <th scope="col" className="nr  fw-semibold border-0" style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 24, color: 'var(--color_tertiary)', letterSpacing: '.02em' }}>
              Team Name
            </th>
            <th scope="col" className=" fw-semibold border-0" style={{ paddingTop: 14, paddingBottom: 14, color: 'var(--color_tertiary)', letterSpacing: '.02em' }}>
              Description
            </th>
            {type === "Invites" ? (
              <th scope="col" className="nr  fw-semibold border-0" style={{ paddingTop: 14, paddingBottom: 14, color: 'var(--color_tertiary)', letterSpacing: '.02em' }}>
                Invitation Status
              </th>
            ) : (
              <th scope="col" className="nr  fw-semibold border-0" style={{ paddingTop: 14, paddingBottom: 14, color: 'var(--color_tertiary)', letterSpacing: '.02em' }}>
                Number of Members
              </th>
            )}
            <th scope="col" className="fw-semibold border-0" style={{ paddingTop: 14, paddingBottom: 14, color: 'var(--color_tertiary)', letterSpacing: '.02em' }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="table-dark" style={{ background: 'transparent' }}>
          {data?.length > 0 &&
            data?.map((row: any, idx: number) => {
              return (
                <tr
                  key={row?.id}
                  onMouseEnter={() => setSelectTeam((prev: any) => ({ ...prev, __hover: row?.id }))}
                  onMouseLeave={() => setSelectTeam((prev: any) => ({ ...prev, __hover: null }))}
                  style={{
                    borderBottom: '1px solid var(--color_grey)',
                    background: (selectTeam as any)?.__hover === row?.id ? 'rgba(255,255,255,0.04)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'),
                    transition: 'background 160ms ease'
                  }}
                >
                  <td className="align-middle" style={{ paddingLeft: 24, color: 'var(--color_tertiary)' }}>{row?.name || row?.team?.name}</td>
                  <td className="align-middle" style={{ color: 'var(--color_tertiary)', opacity: 0.8 }}>
                    <HtmlData
                      data={
                        row?.description?.slice(0, 50) ||
                        row?.team?.description?.slice(0, 50) ||
                        ""
                      }
                    />
                  </td>
                  {type === "Invites" ? (
                    <td className="align-middle" style={{ color: 'var(--color_tertiary)', opacity: 0.8 }}>{row?.invitationStatus}</td>
                  ) : (
                    <td className="align-middle" style={{ color: 'var(--color_tertiary)', opacity: 0.8 }}>{row?.teamMembers?.length}</td>
                  )}
                  <td className="align-middle">
                    <div className="d-flex flex-wrap gap-2">
                      {type === "Invites" ? (
                        <>
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill ${row?.invitationStatus === 'PENDING' ? 'btn-success' : 'btn-success disabled'}`}
                            onClick={() => handleAcceptReject("ACCEPTED", row?.id)}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill ${row?.invitationStatus === 'PENDING' ? 'btn-danger' : 'btn-danger disabled'}`}
                            onClick={() => handleAcceptReject("REJECTED", row?.id)}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill btn-aqua"
                            onClick={() => handleInvite(row)}
                          >
                            Add
                          </button>
                          <Link
                            href={`/dashboard/teams/${row?.id}`}
                            onClick={() => navigate(`/dashboard/teams/${row?.id}`)}
                            className="btn btn-sm rounded-pill btn-blue"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill btn-success"
                            onClick={() => getMessageThread(row)}
                          >
                            Message
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          {data?.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: 32 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--color_grey)',
                    color: 'var(--color_tertiary)'
                  }}
                >
                  No teams found                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && (
        <InviteMemberModal
          isOpen={showModal}
          onClose={closeInvite}
          data={selectTeam}
        />
      )}
    </div>
  );
};

export default TeamTable;
