// Import dependencies
import React, { useState, useRef, useEffect } from 'react'
import Button from './Button'
import { TiLocationArrow } from 'react-icons/ti'
import { useGSAP } from '@gsap/react'
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  // State สำหรับจัดการ video และ loading
  const [currentIndex, setCurrentIndex] = useState(1) // เก็บ index ของวิดีโอปัจจุบัน
  const [hasClicked, setHasClicked] = useState(false) // เช็คว่ามีการคลิกที่วิดีโอหรือไม่
  const [isLoading, setIsLoading] = useState(true) // สถานะ loading
  const [loadedVideos, setLoadedVideos] = useState(0) // จำนวนวิดีโอที่โหลดเสร็จแล้ว

  const totalVideos = 4; // จำนวนวิดีโอทั้งหมด
  const nextVideoRef = useRef(null) // ref สำหรับอ้างอิงวิดีโอถัดไป

  const redefineTextRef = useRef(null);
  const gamingTextRef = useRef(null);
  const paragraphRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(redefineTextRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out' }
    );
    gsap.fromTo(gamingTextRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 2.5, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo(paragraphRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out', delay: 1 }
    );
  }, [])

  // Function สำหรับเพิ่มจำนวนวิดีโอที่โหลดเสร็จแล้ว
  // รับค่า state ก่อนหน้าผ่าน prev แล้วเพิ่มค่าขึ้น 1
  // ใช้ร่วมกับ state loadedVideos เพื่อติดตามสถานะการโหลดวิดีโอ
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1)
  }

  // คำนวณ index ของวิดีโอถัดไป
  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  // Function จัดการเมื่อคลิกที่วิดีโอขนาดเล็ก
  // 1. อัปเดต state hasClicked เป็น true เพื่อทริกเกอร์ animation
  // 2. อัปเดต currentIndex เป็นวิดีโอถัดไปเพื่อเปลี่ยนวิดีโอที่แสดง
  const handleMiniVdClick = () => {
    setHasClicked(true)
    setCurrentIndex(upcomingVideoIndex)
  }

  // Effect ตรวจสอบว่าโหลดวิดีโอครบหรือยัง
  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setIsLoading(false)
    }
  }, [loadedVideos])

  // Function สร้าง path ของวิดีโอ
  const getVideoSrc = (index) => `videos/hero-${index}.mp4`

  // Animation เมื่อคลิกที่วิดีโอ
  useGSAP(() => {
    if (hasClicked) {
      gsap.set('#next-video', { visibility: 'visible' });
      gsap.to('#next-video', {
        transformOrigin: 'center center',
        scale: 1,
        width: '100%',
        height: '100%',
        duration: 1,
        ease: 'power1.inOut',
        onStart: () => nextVideoRef.current.play(),
      })

      gsap.from('#current-video', {
        transformOrigin: 'center center',
        scale: 0,
        duration: 1.5,
        ease: 'power1.inOut'
      })
    }
  }, { dependencies: [currentIndex], revertOnUpdate: true })

  // Animation clip path ของ video frame
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
      {/* Loading Screen */}
      {isLoading && (
        <div className='flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50'>
          <div className='three-body'>
            <div className='three-body__dot'></div>
            <div className='three-body__dot'></div>
            <div className='three-body__dot'></div>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
        <div>
          {/* Preview Video ตรงกลาง */}
          <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg'>
            <div onClick={handleMiniVdClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                id='current-video'
                className='size-64 origin-center scale-150 object-cover object-center'
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          {/* วิดีโอที่จะแสดงถัดไป */}
          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id='next-video'
            className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
            onLoadedData={handleVideoLoad}
          />

          {/* วิดีโอหลัก */}
          <video
            src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
            autoPlay
            loop
            muted
            className='absolute left-0 top-0 size-full object-cover object-center'
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* ข้อความ Gaming ด้านล่างขวา */}
        <h1 ref={gamingTextRef} className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>
          G<b>a</b>ming
        </h1>

        {/* Content ด้านบน */}
        <div className='absolute left-0 top-0 z-40 size-full'>
          <div className='mt-24 px-5 sm:px-10'>
            <h1 ref={redefineTextRef} className='special-font hero-heading text-blue-100'>
              redefi<b>n</b>e
            </h1>
            <p ref={paragraphRef} className='mb-5 max-w-64 font-robert-regular text-blue-100'>
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            {/* ปุ่ม Watch Trailer */}
            <Button id="watch-trailer" title="Watch Trailer" leftIcon={<TiLocationArrow />} containerClass="!bg-yellow-300 flex-center gap-1" />
          </div>
        </div>
      </div>

      {/* ข้อความ Gaming ด้านล่างขวาซ้อนทับ */}
      <h1 className='special-font hero-heading absolute bottom-5 right-5 text-black'>
        G<b>a</b>ming
      </h1>
    </div>
  )
}

export default Hero
