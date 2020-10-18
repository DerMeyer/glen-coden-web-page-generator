import React, { useEffect } from 'react';

const coordinates = { lat: 52.53013315072107, lng: 13.444419998891341 };


export default function GoogleMaps({ height }) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB10NAFC0QI3h02NyGZyoKpGpSY-6BWFfY&callback=initMap';
        script.defer = true;

        window.initMap = () => {
            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: coordinates,
                zoom: 15,
                mapTypeId: 'terrain'
            });
            new window.google.maps.Marker({
                map,
                position: coordinates,
                title: 'Hainarbeit'
            });
        };

        document.head.appendChild(script);
    }, []);

    return (
        <div
            id="map"
            style={{ height: `${height}px` }}
        />
    );
}
