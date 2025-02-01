import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

const DicomViewer = ({ filePath }) => {
    const dicomRef = useRef(null);

    useEffect(() => {
        if (dicomRef.current) {
            cornerstone.enable(dicomRef.current);
            cornerstone.loadImage(filePath).then((image) => {
                cornerstone.displayImage(dicomRef.current, image);
            });
        }
    }, [filePath]);

    return <div ref={dicomRef} style={{ width: 512, height: 512, border: '1px solid black' }}></div>;
};

export default DicomViewer;