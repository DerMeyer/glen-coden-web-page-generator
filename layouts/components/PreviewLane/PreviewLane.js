import React, { useRef, useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import s from './PreviewLane.css';

export const LaneTypes = {
    IMAGE: 'image'
};

const previewItems = {
    [LaneTypes.IMAGE]: ({ item }) => <img className={s.Image} src={item.medium} alt={item.medium} />
};

const laneItems = {
    [LaneTypes.IMAGE]: ({ item }) => <img className={s.Image} src={item.small} alt={item.small} />
};

const itemHeight = 0.6;
const itemsPerLane = 4;

const previewHeight = itemsPerLane / (itemsPerLane + 1);
const laneHeight = 1 - previewHeight;
const heightFactor = itemHeight / previewHeight;


const PreviewLane = props => {
    const ref = useRef(null);

    const [ itemIndex, setItemIndex ] = useState(0);
    const [ laneIndex, setLaneIndex ] = useState(0);

    useEffect(() => {
        const firstItem = laneIndex * itemsPerLane;
        if (
            itemIndex < firstItem
            || itemIndex > (firstItem + (itemsPerLane - 1))
        ) {
            setItemIndex(firstItem);
        }
    }, [ itemIndex, laneIndex ]);

    const PreviewItem = previewItems[props.type];
    const LaneItem = laneItems[props.type];

    const width = ref.current ? ref.current.getBoundingClientRect().width : 0;

    return (
        <div
            ref={ref}
            className={s.Container}
            style={{ height: `${width * heightFactor}px` }}
        >
            <div
                className={s.Preview}
                style={{ height: `${previewHeight * 100}%` }}
            >
                {props.items[itemIndex] && <PreviewItem item={props.items[itemIndex]} />}
            </div>
            <div
                className={s.LaneBox}
                style={{ height: `${laneHeight * 100}%` }}
            >
                <ul
                    className={s.Lane}
                    style={{ left: `-${laneIndex * width}px` }}
                >
                    {props.items.map((item, index) => (
                        <li
                            key={index}
                            className={`${s.LaneItem}${index === itemIndex ? ` ${s.Active}` : ''}`}
                            style={{ width: `${width / itemsPerLane}px` }}
                            onClick={() => setItemIndex(index)}
                        >
                            <LaneItem item={item} />
                        </li>
                    ))}
                </ul>
                {laneIndex && (
                    <div
                        className={`${s.LaneButton} ${s.prev}`}
                        onClick={() => setLaneIndex(prevState => Math.max(prevState - 1, 0))}
                    >
                        prev
                    </div>
                )}
                {props.items.length > ((laneIndex + 1) * itemsPerLane) && (
                    <div
                        className={`${s.LaneButton} ${s.next}`}
                        onClick={() => setLaneIndex(prevState => Math.min(prevState + 1, Math.floor(props.items.length / itemsPerLane)))}
                    >
                        next
                    </div>
                )}
            </div>
        </div>
    );
};

PreviewLane.propTypes = {
    type: Proptypes.string.isRequired,
    items: Proptypes.array.isRequired
};

export default PreviewLane;