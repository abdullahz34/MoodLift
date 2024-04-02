'use client';
import { FC } from "react";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

interface indexProps{}

const index: FC<indexProps> = ({}) => {
    return (
        <div >
            <TimePicker />
        </div>
    )
}


export default index