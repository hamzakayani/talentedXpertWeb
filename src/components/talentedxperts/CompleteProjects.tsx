import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react'

const CompleteProjects = () => {
  return (
    
    <div className='card'>
    <div className='card first-card card-header'>
        <h3>Completed Projects</h3>
    </div>

    <div className='card-bodyy my-active-task py-2 '>


        <div className='completeproject  m-4  p-3'>
        <div className='projectdetail'>
          



          <div className='d-flex '>
            <div className='me-4'> <Image
                                          src="/assets/images/complete-project.jpg"
                                          alt="img"
                                          className="img-fluid user-img"
                                          width={350}
                                          height={350}
                                          priority
                                      /></div>
                                      <div>
                                      <h3 >Worldpress Development</h3>
                                      <div className='d-flex align-items-center justify-content-between'>
                                        <div>
                                        <div className='star d-flex align-items-center'>
                  <Icon icon="ic:baseline-star" className='text-warning' />
              <Icon icon="ic:baseline-star" className='text-warning' />
              <Icon icon="ic:baseline-star" className='text-warning' />
              <Icon icon="mdi-light:star" className='text-light' />
              <Icon icon="mdi-light:star" className='text-light' />
              <p>3.0/5</p>
                  </div>
                                        </div>
                                        <div><span>Excellent</span></div>
                                      </div>
                 
                  <p>Web developer expert with over eight years of experience in Websites Development, frontend developers as well as backend development, setup, and customization of WordPress, WordPress Development, Speed Optimization, Page Optimization, Website Optimization, and Website Development, Graphics Designer. I am quite an expert at any type of work regarding web design and development and WordPress. I also have experience in graphics.</p>
                                      </div>
         

                  
                 
              </div>





      </div>

      <div className='clientfeedback m-4 p-3 '>
          



          <div className='d-flex align-items-center'>
          <Image
                                          src="/assets/images/profile-img.png"
                                          alt="img"
                                          className="img-fluid user-img img-round me-4"
                                          width={40}
                                          height={40}
                                          priority
                                      />
                                      <h3>Mary Hill</h3>
                  <div className='star d-flex align-items-center'>
                  <Icon icon="ic:baseline-star" className='text-warning' />
              <Icon icon="ic:baseline-star" className='text-warning' />
              <Icon icon="ic:baseline-star" className='text-warning' />
              <Icon icon="mdi-light:star" className='text-light' />
              <Icon icon="mdi-light:star" className='text-light' />
                  </div>
                  <p>3.0/5</p>
              </div>

<p>{`
Tangible Words is amazing. They’ve helped create and organize our marketing operations (and many sales) processes for reliability and scale. Their macro work project focused on helping to document and define all our processes and I’ve continued to have them as our 'partner of record' as we build out those processes and execute marketing.
`}
</p>


      </div>



        </div>

       

       
       

        

    </div>


</div>
  )
}

export default CompleteProjects