import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import gsap from 'gsap';

const AnimatedTitle = ({ title, containerClass }) => {

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '10 bottom',
          end: 'center bottom',
          toggleActions: 'play none none reverse', // onEnter onLeave onEnterBack onLeaveBack
        }
      });

      titleAnimation.to('.animated-word', {
        opacity: 1,
        transform: 'translate3d(0,0,0) rotateY(0deg) rotateX(0deg)',
        ease: 'power2.inOut',
        stagger: 0.02,
      })
    }, containerRef)

    return () => ctx.revert();

  }, [])

  return (
    <div
      ref={containerRef}
      className={`animated-title ${containerClass}`} >
      {
        title.split('<br/>').map((line, index) => (
          <div key={index} className='flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3'>
            {line.split(' ').map((word, i) => (
              <span key={i} className='animated-word' dangerouslySetInnerHTML={{ __html: word }}></span>
            ))}
          </div>
        ))
      }
    </div >
  )
}

AnimatedTitle.propTypes = {
  title: PropTypes.string,
  containerClass: PropTypes.string
}

export default AnimatedTitle
