import apiCall from '@/services/apiCall/apiCall'
import { promotedTasks } from '@/services/helpers/staticdata'
import { requests } from '@/services/requests/requests'
import { getTimeago } from '@/services/utils/util'
import { RootState, useAppDispatch } from '@/store/Store'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const PromotedTasks = () => {
  const [tasks, setTasks] = useState<any>([])
  const dispatch = useAppDispatch()
  const user = useSelector((state: RootState) => state.user)
  const isAuth = useSelector((state: RootState) => state.isAuth)
  const router = useRouter()

  useEffect(() => {
    getAllTasks();
  }, [])

  const getAllTasks = async () => {
    let params = ''
    params += '?promoted=' + true;
    params += '&limit=' + 6;

    try {
      const response = await apiCall(
        `${requests.getTasks}${params}`,
        {},
        'get',
        false,
        dispatch,
        user,
        router
      );
      console.log('response', response)
      setTasks(response?.data?.data.tasks|| []);
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    } finally {
      console.log(tasks)
    }
  };

  const handleClick = () => {
    if (isAuth) {
      // router.push(`{/dashboard/tasks/${tasks.id}`)
    }
    else {
      router.push('/signin')
    }
  }

  return (

    <section className="promoted_te_section py-5">
      <div className="container">
        <h2 className="mb-4">Promoted Tasks</h2>
        <div className="row row-gap-4">
          {tasks?.map((data: any) => (
            <div className="col-md-4" key={data.id}>
              <div className="promoted_card mb-2">
                <div className="ribbon-1">
                  <Image
                    src="/assets/images/promote.svg"
                    alt="img"
                    className="img-fluid ribbon-img"
                    width={255}
                    height={255}
                    priority
                  />
                </div>

                <div className="usertext">
                  <Link className="mb-0 text-white" href={`/tasks/$`} >{data?.name}</Link>
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <p className="fs-12 mb-0">{data.workingSlot} <span className="ms-2">{data.country}</span><span className="ms-2">{data.taskType}</span></p>
                    <p className="text-white fw-medium mb-0">${data.amount}/ hr</p>
                  </div>
                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <Icon icon="material-symbols-light:kid-star" key={index} className={`text-light ${index < data.rating ? "rated" : ""}`} />

                    ))}
                  </div>
                </div>
                <p className="line-clamp-3">
                  {data.details}
                  {/* <a href="">more</a> */}
                </p>
                <div className="d-flex align-items-baseline justify-content-between">
                  <h6 className="fs-12 text-secondary">{getTimeago(data.createdAt)}</h6>
                  <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm" onClick={handleClick}>
                    View Details <Icon icon="line-md:arrow-right" className='ms-1' />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
        <div className="buttondiv text-end mt-4">
          <button className="btn btn-info rounded-pill">View All</button>
        </div>
      </div>
    </section>

  )
}

export default PromotedTasks
