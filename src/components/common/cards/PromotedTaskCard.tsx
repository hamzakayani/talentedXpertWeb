import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import RatingStar from "@/components/common/RatingStar/RatingStar";
import { useNavigation } from "@/hooks/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

type PromotedTaskCardProps = {
  data: any;
};

const PromotedTaskCard: React.FC<PromotedTaskCardProps> = ({ data }) => {
  const { navigate } = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="promoted_task mb-2  d-flex flex-column h-100">
      <div className="usertext">
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex gap-3 align-items-start" style={{ minWidth: 0 }}>
            <div className="userimg overflow-hidden flex-shrink-0" style={{ width: 48, height: 48 }}>
              <Image
                src="/assets/images/default-user.jpg"
                alt="userimg"
                width={48}
                height={48}
              />
            </div>
            <Link
              className="mb-0 text-white d-block"
              style={{ minWidth: 0,}}
              href={`/tasks/${data?.id}`}
              onClick={() => navigate(`/tasks/${data?.id}`)}
           >
            <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>{data?.name}</span>
              <h6 className="fw-light">Product Designer</h6>
            </Link>
          </div>
          <div className="ribbin">Promoted</div>
        </div>
      </div>
      <HtmlData
        data={data?.details}
        className="text-white line-clamp-3 fw-normal fs-14 ff-figtree mt-3"
      />
      <hr className="text-light" />
      <div className="tags mb-2">
        <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block ff-figtree" style={{textAlign: 'center',}}>
          Product Designer
        </div>
        <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block ff-figtree" style={{textAlign: 'center'}}>
          UX/UI
        </div>
        <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block ff-figtree" style={{textAlign: 'center'}}>
          Brand Design
        </div>
                <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block ff-figtree" style={{textAlign: 'center'}}>
          Design System
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-auto">
        <RatingStar rating={data?.requesterProfile?.averageRating} />
        {(user?.profile && user?.profile[0].type == "TE") || !isAuth ? (
          <Link
            className="btn btn-outline-light rounded-pill btn-sm w-auto mt-1 ff-figtree"
            style={{textAlign: 'center'}}
            href={isAuth ? `/tasks/${data.id}` : "/signin"}
            onClick={() => navigate(isAuth ? `/tasks/${data.id}` : "/signin")}
          >
            Apply Now <Icon icon="line-md:arrow-right" className="ms-1 ff-figtree" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default PromotedTaskCard;


