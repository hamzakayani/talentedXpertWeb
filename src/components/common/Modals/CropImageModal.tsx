import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop';
import ModalWrapper from '../ModalWrapper/ModalWrapper';

interface CropImageModalProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
    aspect: number;
    isOpen: boolean;
    width: number;
    height: number;
}

const CropImgModal: FC<CropImageModalProps> = ({ imageSrc, onCropComplete, onClose, aspect, isOpen, width, height }) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const closeRef = useRef(null)

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    useEffect(() => {
        setOpenModal(true)
    }, [isOpen])

    const handleClose = () => {
        setOpenModal(false)
        onClose()
    }

    const getCroppedImg = async (imageSrc: string, crop: Area): Promise<string | null> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        const { width, height } = crop;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
            image,
            crop.x, crop.y, width, height,
            0, 0, width, height
        );

        return canvas.toDataURL('image/jpeg'); // Return data URL
    };

    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.src = url;
            image.onload = () => resolve(image);
            image.onerror = (error) => reject(error);
        });

    const handleCropComplete = async () => {
        if (croppedAreaPixels) {
            const croppedImageDataURL = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImageDataURL) {
                onCropComplete(croppedImageDataURL); // Return the data URL
            }
        }
        handleClose();
    };

    return (
        <>
            {openModal &&
                <div className='ad-review'>
                    <ModalWrapper modalId={"CropImgModal"} title={'Crop Image'} closeRef={closeRef} handleClose={handleClose}>
                        <div style={{ position: 'relative', width: 400, height: 300 }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <button className="btn btn-primary text-white mb-3 w-100" type='button' onClick={handleCropComplete}>Crop and Save</button>
                        </div>
                    </ModalWrapper>
                </div>
            }
        </>
    )
}

export default CropImgModal

// import React, { FC, useEffect, useRef, useState } from 'react';
// import Cropper from 'react-cropper';
// import ModalWrapper from '../ModalWrapper/ModalWrapper';

// interface CropImageModalProps {
//     imageSrc: string;
//     onCropComplete: (croppedImage: string) => void;
//     onClose: () => void;
//     aspect: number;
//     isOpen: boolean;
//     width: number;
//     height: number;
// }

// const CropImgModal: FC<CropImageModalProps> = ({
//     imageSrc,
//     onCropComplete,
//     onClose,
//     aspect,
//     isOpen,
//     width,
//     height
// }) => {
//     const [openModal, setOpenModal] = useState<boolean>(false);
//     const cropperRef = useRef<any>(null);
//     const closeRef = useRef(null);

//     useEffect(() => {
//         setOpenModal(isOpen);
//     }, [isOpen]);

//     const handleClose = () => {
//         setOpenModal(false);
//         onClose();
//     };

//     const handleCropComplete = () => {
//         const cropper = cropperRef.current?.cropper;
//         if (cropper) {
//             const croppedImageDataURL = cropper.getCroppedCanvas({
//                 width,
//                 height,
//                 imageSmoothingQuality: 'high'
//             }).toDataURL('image/jpeg');
//             onCropComplete(croppedImageDataURL);
//         }
//         handleClose();
//     };

//     return (
//         <>
//             {openModal && (
//                 <div className='ad-review'>
//                     <ModalWrapper
//                         modalId="CropImgModal"
//                         title="Crop Image"
//                         closeRef={closeRef}
//                         handleClose={handleClose}
//                     >
//                         <div
//                             style={{
//                                 position: 'relative',
//                                 width: 400,
//                                 height: 300,
//                                 margin: '0 auto',
//                                 overflow: 'hidden',
//                                 background: '#f5f5f5',
//                                 borderRadius: '4px',
//                                 border: '1px solid #ccc',
//                             }}
//                         >
//                             <Cropper
//                                 className="custom-cropper"
//                                 src={imageSrc}
//                                 style={{
//                                     width: '100%',
//                                     height: '100%',
//                                 }}
//                                 initialAspectRatio={aspect}
//                                 aspectRatio={aspect}
//                                 guides={true}
//                                 viewMode={1}
//                                 dragMode="move"
//                                 scalable={true}
//                                 cropBoxResizable={true}
//                                 cropBoxMovable={true}
//                                 responsive={true}
//                                 ref={cropperRef}
//                             />
//                         </div>
//                         <div className="form-group mt-3">
//                             <button
//                                 className="btn btn-primary text-white mb-3 w-100"
//                                 type="button"
//                                 onClick={handleCropComplete}
//                             >
//                                 Crop and Save
//                             </button>
//                         </div>
//                     </ModalWrapper>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CropImgModal;
