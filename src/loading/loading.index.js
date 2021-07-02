import React from "react";
import './loading.style.scss'
import animationData from '../assets/18357-spinner-dots.json';
import Lottie from 'react-lottie';

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <div className="komeil-loading">
      <div className='lotie'>
        <Lottie options={defaultOptions}
                height={200}
                width={200}
        />
        <p>لطفا منتظر بمانید...</p>
      </div>
    </div>
  );
}
