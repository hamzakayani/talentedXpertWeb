// import { DOTS, usePagination } from '@/hooks/usePagination';
// import { listingLimitEnum } from '@/services/enums/enums'
import React, { useEffect } from "react";
import { Pagination as MuiPagination, Typography } from "@mui/material";

export const Pagination = (props: any) => {
  const {
    limit,
    count,
    page,
    onLimitChange,
    onPageChange,
    siblingCount,
    fromPrisma,
  } = props;

  // const paginationRange: any = usePagination({
  //     currentPage: page,
  //     limit,
  //     totalCount: count,
  //     siblingCount
  // });

  // if (page === 0 || paginationRange?.length < 1) {
  //     return null;
  // }

  // const onNext = () => {
  //     page === lastPage ? null : onPageChange(page + 1);
  // };

  // const onPrevious = () => {
  //     page === 1 ?  null : onPageChange(page - 1);
  // };

  // let lastPage = paginationRange && paginationRange[paginationRange?.length - 1];

  // return (
  //     <div className='pagiandnumber d-flex flex-wrap justify-content-around justify-content-md-between align-items-baseline py-2 px-lg-3 px-2 bg-black'>
  //         <div className='Numbring d-flex align-items-center'>
  //             <span>Showing</span> <span className="mx-2">
  //                 <select name="limit" className="form-select form-select-sm" value={limit} onChange={(e) => onLimitChange(Number(e?.target?.value))}>
  //                     {Object.keys(listingLimitEnum).map(key => {
  //                         const value = listingLimitEnum[key as keyof typeof listingLimitEnum];
  //                         return (
  //                             <option key={value} value={value}>
  //                                 {value}
  //                             </option>
  //                         );
  //                     })}
  //                 </select>
  //             </span>  <span>entries</span>
  //         </div>
  //         <div className='pagination'>
  //             <nav aria-label="Page navigation example">
  //                 <ul className="pagination py-2 my-0 cursor">
  //                     <li className={page === 1 ? 'page-item disabled' : 'page-item'} onClick={onPrevious}>
  //                         <span className='page-link' aria-hidden="true">&lsaquo;</span>
  //                     </li>
  //                     {paginationRange && paginationRange?.length > 0 && paginationRange?.map((pageNumber: any) => {

  //                         if (pageNumber === DOTS) {
  //                             return <li className="page-item dots ms-1" key={pageNumber}>&#8230;</li>;
  //                         }

  //                         return (
  //                             <li
  //                                 className={pageNumber === page ? `page-item active ms-1` : `page-item ms-1`}
  //                                 onClick={() => onPageChange(pageNumber)}
  //                                 key={pageNumber}
  //                             >
  //                                 <span className={`page-link ${pageNumber === page ? 'bg-gradient1' : ''} `}>{pageNumber}</span>
  //                             </li>
  //                         );
  //                     })}
  //                     <li className={page === lastPage ? 'page-item disabled ms-1' : 'page-item ms-1'}  onClick={onNext}>
  //                         <span className='page-link' aria-hidden="true">&rsaquo;</span>
  //                     </li>
  //                 </ul>
  //             </nav>
  //         </div>
  //     </div>
  // )

  const totalPages = Math.ceil(count / limit);
  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, count) || 0;

  useEffect(() => {
    // Calculate the number of pages
    const totalPages = Math.ceil(count / limit);

    // If current page is greater than total pages available
    // AND we're not on the first page, go back one page
    if (page > totalPages && page > 1 && totalPages > 0) {
      onPageChange(page - 1);
    }
    // If we've deleted everything, go to page 1
    else if (totalPages === 0 && page > 1) {
      onPageChange(1);
    }
  }, [count, page, limit]);

  return (
    count > 0 && (
      <nav
        className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 mt-3"
        style={{ flexDirection: fromPrisma ? "column" : "row" }}
      >
        <Typography variant="subtitle2" style={{ color: "white" }}>{`Showing ${
          startEntry ?? ""
        } to ${endEntry ?? ""} of ${count ?? ""} entries`}</Typography>

        <MuiPagination
          count={totalPages}
          page={page}
          onChange={(event, page) => onPageChange(page)}
          variant="outlined"
          shape="rounded"
          color="primary"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
              backgroundColor: "#212529", // Dark grey background for inactive pages
              border: "none", // Remove borders
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Add shadow
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", // Enhanced shadow on hover
              },
              "&.Mui-selected": {
                background: "linear-gradient(135deg, #00BBFF, #5947FF)",
                color: "white",
                border: "none", // Remove borders from selected page too
                boxShadow: "0 4px 8px rgba(0, 187, 255, 0.3)", // Blue shadow for selected page
                "&:hover": {
                  background: "linear-gradient(135deg, #00BBFF, #5947FF)",
                  boxShadow: "0 6px 12px rgba(0, 187, 255, 0.4)", // Enhanced blue shadow on hover
                },
              },
            },
            "& .MuiPaginationItem-outlined": {
              border: "none", // Remove borders from outlined items
            },
          }}
        />
      </nav>
    )
  );
};
