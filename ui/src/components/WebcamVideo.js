import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container,Row } from "react-bootstrap";
import Webcam from "react-webcam";

export default function WebcamVideo() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);


  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };


  //BlobEvent :- data property
  const handleDataAvailable = useCallback(
    ({ data }) => {
      console.log(data);
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });

    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );

    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleReset = ()=>{
    if(recordedChunks.length>0)
      setRecordedChunks([]);
    else 
      alert("No video recorded!!")
  }

  const handlePredict = ()=>{

    const myFile = new File(
      recordedChunks,
      "demo.mp4",
      { type: 'video/mp4' }
    );

    console.log(myFile);

    const sendRequest = async()=>{
      try {
        const res = await axios({
          method: "post",
          url: "http://localhost:8000/uploadfile/",
          data: {
            file: myFile
          },
          headers: { "Content-Type": "multipart/form-data" },
        })

        console.log(res);
      } catch (err) {
        console.log(err);
        alert("Error: Predicting")
      }
    }

    sendRequest();

  }

  
 
  return (
    <>  
      <Container className='mt-5'>
        <Row className="justify-content-md-center">
          <div className="Container">

            <div className="flex-center">
              <Webcam
                  height={400}
                  width={400}
                  audio={false}
                  mirrored={true}
                  ref={webcamRef}
                  videoConstraints={videoConstraints}
                  className={`${capturing ? "purple-border" : ""}`}
                />
            </div>
            
            <div className="flex-center mt-4"> 
              {capturing ? (
                  <div
                    onClick={handleStopCaptureClick}
                    className="n-btn"
                  >
                      Stop Capture
                  </div>
                ) : (
                  <div
                    onClick={handleStartCaptureClick}
                    className="n-btn"
                  >
                    Start Capture
                  </div>
                )}

                  <div
                    onClick={handleReset}
                    className="n-btn"
                  >
                      Reset
                  </div>

                  <div
                    onClick={handlePredict}
                    className="n-btn"
                  >
                      Predict 
                  </div>
            </div>
      
          </div>
        </Row>
      </Container>
      
    </>
    
  );
}