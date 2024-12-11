import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'; // นำเข้า Button component
import { TiLocationArrow } from 'react-icons/ti'; // นำเข้าไอคอนจาก react-icons
import gsap from 'gsap'; // นำเข้า gsap
import { useWindowScroll } from 'react-use';

const navItems = ['Nexus', 'Vault', 'Prologue', 'About', 'Contact'] // กำหนดรายการเมนูใน navbar

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false) // สร้าง state สำหรับตรวจสอบสถานะการเล่นเสียง
  const [isIndicatorActive, setIsIndicatorActive] = useState(false) // สร้าง state สำหรับตรวจสอบสถานะของ indicator
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isNavVisible, setIsNavVisible] = useState(true)

  const navContainerRef = useRef(null); // สร้าง ref สำหรับ nav container
  const audioElemeent = useRef(null); // สร้าง ref สำหรับ audio element
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev); // สลับสถานะการเล่นเสียง
    setIsIndicatorActive((prev) => !prev); // สลับสถานะของ indicator
  }

  // ตรวจสอบการเลื่อนหน้าจอ
  const { y: currentScrollY } = useWindowScroll();

  // Smooth scroll effect
  const handleNavClick = (e, id) => {
    e.preventDefault();

    const target = e.target.getAttribute('href').slice(1);
    const targetElement = document.getElementById(target);

    if (targetElement) {
      window.scrollBy({
        top: targetElement.getBoundingClientRect().top - 90,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    if (currentScrollY === 0) {
      // ถ้าเลื่อนหน้าจอไปที่ตำแหน่งบนสุด: แสดง navbar โดยไม่ใช้ floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // ถ้าเลื่อนหน้าจอลง: ซ่อน navbar และเพิ่ม floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // ถ้าเลื่อนหน้าจอขึ้น: แสดง navbar พร้อม floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    // อัปเดตค่า lastScrollY ด้วยค่า currentScrollY ปัจจุบัน
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]); // ทำงานเมื่อค่า currentScrollY หรือ lastScrollY เปลี่ยนแปลง

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  useEffect(() => {
    if (isAudioPlaying) {
      audioElemeent.current.play(); // เล่นเสียงถ้า isAudioPlaying เป็น true
    } else {
      audioElemeent.current.pause(); // หยุดเสียงถ้า isAudioPlaying เป็น false
    }
  }, [isAudioPlaying]) // ทำงานเมื่อ isAudioPlaying เปลี่ยนแปลง

  return (
    <div ref={navContainerRef} className='fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6'>
      {/* กำหนด container ของ navbar */}
      <header className='absolute top-1/2 w-full -translate-y-1/2'>
        {/* กำหนด header ของ navbar */}
        <nav className='flex size-full items-center justify-between p-4'>
          {/* กำหนด navigation bar */}
          <div className='flex items-center gap-7 '>
            {/* กำหนด container สำหรับโลโก้และปุ่ม */}
            <img
              src="/img/logo.png"
              alt=""
              className='w-10'
            />
            {/* แสดงโลโก้ */}
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
            {/* แสดงปุ่ม Products พร้อมไอคอน */}
          </div>
          <div className='flex h-full items-center'>
            {/* กำหนด container สำหรับรายการเมนูและปุ่มเสียง */}
            <div className='hidden md:block'>
              {/* แสดงรายการเมนูเฉพาะในหน้าจอขนาดใหญ่ */}
              {navItems.map((item) => (
                <a className='nav-hover-btn' key={item} href={`#${item.toLowerCase()}`} onClick={(e) => handleNavClick(e, item.toLowerCase())}>
                  {item}
                </a>
              ))}
              {/* แสดงรายการเมนู */}
            </div>

            <button className='ml-10 flex items-center space-x-0.5' onClick={toggleAudioIndicator}>
              {/* ปุ่มสำหรับสลับสถานะการเล่นเสียง */}
              <audio src="/audio/loop.mp3" ref={audioElemeent} className='hidden' loop />
              {/* แทรก audio element */}
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`indicator-line ${isIndicatorActive ? 'active' : ''}`}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
              {/* แสดง indicator ของเสียง */}
            </button>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Navbar