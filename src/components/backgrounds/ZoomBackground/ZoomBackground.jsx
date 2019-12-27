import React, { useRef, useEffect } from 'react';
import './ZoomBackground.css'
import Image from '../../Image/Image';

// user config
const bgOverlapPercent = 2;
const bgTransitionTime = 0.5;

// calculated config
const safetyMargin = bgOverlapPercent / 10;


export default function ZoomBackground() {
    const bgBox = useRef(null);
    const bgImage = useRef(null);

    useEffect(() => {
        const box = bgBox.current;
        const image = bgImage.current;

        function onMousemove(event) {
            growZoomBg();
            setBoxTransform(event);
        }

        function growZoomBg() {
            if (box.classList.contains('grow-box')) {
                return;
            }
            box.classList.add('grow-box');
            image.style.width = `${100 + (bgOverlapPercent * 2)}vw`;
            image.style.height = `${100 + (bgOverlapPercent * 2)}vh`;
        }

        function shrinkZoomBg() {
            if (!box.classList.contains('grow-box')) {
                return;
            }
            box.classList.remove('grow-box');
            image.style.width = '100vw';
            image.style.height = '100vh';
        }

        function setBoxTransform(event) {
            const offsetFactor = bgOverlapPercent - safetyMargin;
            const xFromCenter = event.clientX - (window.innerWidth / 2);
            const yFromCenter = event.clientY - (window.innerHeight / 2);
            const bgTransformX = xFromCenter / (window.innerWidth / 2) * offsetFactor;
            const bgTransformY = yFromCenter / (window.innerHeight / 2) * offsetFactor;
            box.style.transform = `translate(-${50 + bgTransformX}%, -${50 + bgTransformY}%)`;
        }

        box.style.transition = `width ${bgTransitionTime}s, height ${bgTransitionTime}s`;
        image.style.transition = `width ${bgTransitionTime}s, height ${bgTransitionTime}s`;

        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('blur', shrinkZoomBg);
        document.addEventListener('mouseleave', shrinkZoomBg);

        return () => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('blur', shrinkZoomBg);
            document.removeEventListener('mouseleave', shrinkZoomBg);
        };
    }, []);

    return (
        <div className="zoom-bg">
            <div
                ref={bgBox}
                className="zoom-bg-box"
            >
                <div
                    ref={bgImage}
                    className="zoom-bg-image"
                >
                    <Image
                        source="etl/images/etl-bg-2019.jpg"
                    />
                </div>
            </div>
            <div className="zoom-bg-headline">
                The Eternal Love
            </div>
        </div>
    );
}